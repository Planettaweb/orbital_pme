DO $$
DECLARE
  v_tenant_id uuid;
BEGIN
  -- Create tables
  CREATE TABLE IF NOT EXISTS public.fiscal_taxes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      due_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.fiscal_certificates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'valid',
      expires_at DATE NOT NULL,
      source TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.fiscal_monthly_stats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
      month_year TEXT NOT NULL,
      revenue NUMERIC NOT NULL DEFAULT 0,
      tax NUMERIC NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(tenant_id, month_year)
  );

  -- Seeding
  SELECT id INTO v_tenant_id FROM public.tenants LIMIT 1;

  IF v_tenant_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.fiscal_taxes WHERE tenant_id = v_tenant_id) THEN
      INSERT INTO public.fiscal_taxes (tenant_id, name, amount, due_date, status) VALUES
      (v_tenant_id, 'Simples Nacional (DAS)', 4530.20, '2026-04-20', 'pending'),
      (v_tenant_id, 'INSS (Folha)', 2150.00, '2026-04-15', 'paid'),
      (v_tenant_id, 'FGTS', 890.50, '2026-04-07', 'pending'),
      (v_tenant_id, 'ISSQN (Retido)', 1240.00, '2026-03-30', 'late');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.fiscal_certificates WHERE tenant_id = v_tenant_id) THEN
      INSERT INTO public.fiscal_certificates (tenant_id, name, status, expires_at, source) VALUES
      (v_tenant_id, 'Certidão Negativa Federal (Receita/PGFN)', 'valid', '2026-09-15', 'Receita Federal'),
      (v_tenant_id, 'Certidão Negativa Estadual (Sefaz)', 'warning', '2026-04-10', 'Sefaz SP'),
      (v_tenant_id, 'Certidão Negativa Municipal', 'expired', '2026-03-31', 'Prefeitura'),
      (v_tenant_id, 'Certidão de Regularidade do FGTS (CRF)', 'valid', '2026-08-20', 'Caixa Econômica');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.fiscal_monthly_stats WHERE tenant_id = v_tenant_id) THEN
      INSERT INTO public.fiscal_monthly_stats (tenant_id, month_year, revenue, tax) VALUES
      (v_tenant_id, '2025-11', 45000, 6750),
      (v_tenant_id, '2025-12', 52000, 7800),
      (v_tenant_id, '2026-01', 48000, 7200),
      (v_tenant_id, '2026-02', 61000, 9150),
      (v_tenant_id, '2026-03', 59000, 8850),
      (v_tenant_id, '2026-04', 65000, 9750);
    END IF;
  END IF;
END $$;

-- RLS
ALTER TABLE public.fiscal_taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_monthly_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Fiscal taxes access" ON public.fiscal_taxes;
CREATE POLICY "Fiscal taxes access" ON public.fiscal_taxes
    FOR ALL TO authenticated
    USING (tenant_id IN (SELECT get_auth_user_tenants()));

DROP POLICY IF EXISTS "Fiscal certificates access" ON public.fiscal_certificates;
CREATE POLICY "Fiscal certificates access" ON public.fiscal_certificates
    FOR ALL TO authenticated
    USING (tenant_id IN (SELECT get_auth_user_tenants()));

DROP POLICY IF EXISTS "Fiscal stats access" ON public.fiscal_monthly_stats;
CREATE POLICY "Fiscal stats access" ON public.fiscal_monthly_stats
    FOR ALL TO authenticated
    USING (tenant_id IN (SELECT get_auth_user_tenants()));
