import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variáveis de ambiente do Supabase ausentes.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all active billing rules
    const { data: rules, error: rulesError } = await supabase
      .from('billing_rules')
      .select('*')
      .eq('active', true);

    if (rulesError) throw rulesError;
    
    if (!rules || rules.length === 0) {
      return new Response(JSON.stringify({ success: true, processed: 0, sent: 0, message: 'Nenhuma regra ativa.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let processedCount = 0;
    let sentCount = 0;

    // Group rules by tenant
    const rulesByTenant = rules.reduce((acc: any, rule: any) => {
      acc[rule.tenant_id] = acc[rule.tenant_id] || [];
      acc[rule.tenant_id].push(rule);
      return acc;
    }, {});

    for (const [tenant_id, tenantRules] of Object.entries(rulesByTenant)) {
      // Get open receivables for this tenant with customer info
      const { data: receivables, error: recError } = await supabase
        .from('receivables')
        .select('*, customers(*)')
        .eq('tenant_id', tenant_id)
        .eq('status', 'open');

      if (recError || !receivables) continue;

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      for (const rec of receivables) {
        const dueDate = new Date(rec.due_date);
        dueDate.setUTCHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - dueDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // Find matching rules for this days offset
        const matchingRules = (tenantRules as any[]).filter(r => r.days_offset === diffDays);

        for (const rule of matchingRules) {
          processedCount++;
          const actionType = `rule_${rule.id}`;

          // Check if action already exists
          const { data: existingAction } = await supabase
            .from('billing_actions')
            .select('id')
            .eq('receivable_id', rec.id)
            .eq('type', actionType)
            .maybeSingle();

          if (existingAction) continue; // Already processed

          const customer = rec.customers;
          if (!customer) continue;

          let message = rule.template || 'Olá {{nome}}, você tem um título no valor de {{valor}} vencendo/vencido em {{vencimento}}';
          message = message.replace(/\{\{nome\}\}/g, customer.name || '');
          message = message.replace(/\{\{valor\}\}/g, `R$ ${Number(rec.amount).toFixed(2)}`);
          
          // Ajuste de fuso horário para exibição correta
          const localDueDate = new Date(rec.due_date);
          localDueDate.setMinutes(localDueDate.getMinutes() + localDueDate.getTimezoneOffset());
          message = message.replace(/\{\{vencimento\}\}/g, localDueDate.toLocaleDateString('pt-BR'));

          let sent = false;

          // Processar o envio baseado no canal
          if (rule.channel === 'email' && customer.email) {
            const { error: emailError } = await supabase.functions.invoke('send-email', {
              body: {
                to: customer.email,
                subject: `Aviso de Cobrança - ${customer.name}`,
                message: message
              }
            });

            if (!emailError) {
              sent = true;
            } else {
              console.error('Erro ao enviar email para', customer.email, emailError);
            }
          } else if (rule.channel === 'whatsapp' || rule.channel === 'sms') {
            // Simulando o envio de WhatsApp/SMS para o fluxo não travar
            // Num cenário real, chamaria a integração respectiva de mensageria aqui.
            console.log(`Simulando envio de ${rule.channel} para ${customer.name}`);
            sent = true;
          } else if (rule.channel === 'email' && !customer.email) {
            console.log(`Cliente ${customer.name} não possui email cadastrado para receber a notificação.`);
          }

          if (sent) {
            sentCount++;
            await supabase.from('billing_actions').insert({
              tenant_id: tenant_id,
              receivable_id: rec.id,
              type: actionType,
              channel: rule.channel,
              status: 'sent',
              notes: `Notificação enviada via ${rule.channel}. Regra: ${rule.name}`
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed: processedCount, sent: sentCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Erro no processamento das regras:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
