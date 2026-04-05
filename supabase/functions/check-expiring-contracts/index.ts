import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get contracts expiring in exactly 30 days that haven't been notified today
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    // Format dates for query
    const targetDateStr = thirtyDaysFromNow.toISOString().split('T')[0]

    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('*, tenants(name)')
      .eq('status', 'active')
      .eq('end_date', targetDateStr)

    if (contractsError) throw contractsError

    if (!contracts || contracts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No contracts expiring in 30 days.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    let sentCount = 0

    for (const contract of contracts) {
      // Fetch tenant admins to notify
      const { data: admins } = await supabase
        .from('tenant_users')
        .select('profiles(email)')
        .eq('tenant_id', contract.tenant_id)
        .eq('role', 'admin')
        .eq('status', 'active')

      if (!admins || admins.length === 0) continue

      const adminEmails = admins
        .map((a: any) => a.profiles?.email)
        .filter(Boolean)

      if (adminEmails.length > 0) {
        const message = `Olá,\n\nO contrato "${contract.title}" com "${contract.party_name}" vencerá em 30 dias (${new Date(contract.end_date).toLocaleDateString('pt-BR')}).\n\nPor favor, revise as condições para renovação ou encerramento no painel da Planettaweb.\n\nAtenciosamente,\nEquipe Planettaweb`

        for (const email of adminEmails) {
          await supabase.functions.invoke('send-email', {
            body: {
              to: email,
              subject: `Aviso de Vencimento: Contrato ${contract.title}`,
              message: message,
            },
          })
        }
        sentCount++

        // Update last_notified_at
        await supabase
          .from('contracts')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', contract.id)
      }
    }

    return new Response(
      JSON.stringify({ success: true, notified: sentCount }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
