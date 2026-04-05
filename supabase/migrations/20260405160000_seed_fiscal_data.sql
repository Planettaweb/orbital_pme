DO $$
DECLARE
  v_tenant_id uuid;
BEGIN
  -- Get first available tenant to associate data
  SELECT id INTO v_tenant_id FROM public.tenants LIMIT 1;

  IF v_tenant_id IS NOT NULL THEN
    -- Check if we already have fiscal documents for this tenant to keep idempotent
    IF NOT EXISTS (SELECT 1 FROM public.fiscal_documents WHERE tenant_id = v_tenant_id) THEN
      INSERT INTO public.fiscal_documents (id, tenant_id, document_number, issue_date, status, risk_level)
      VALUES 
        (gen_random_uuid(), v_tenant_id, 'NF-2026-0001', '2026-04-01', 'valid', 'low'),
        (gen_random_uuid(), v_tenant_id, 'NF-2026-0002', '2026-04-03', 'pending', 'medium'),
        (gen_random_uuid(), v_tenant_id, 'NF-2026-0003', '2026-04-04', 'rejected', 'high');
    END IF;
  END IF;
END $$;
