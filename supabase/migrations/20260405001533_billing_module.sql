-- 1. Ensure risk_level and payment_behavior in customers
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS payment_behavior TEXT DEFAULT 'punctual';

-- 2. Create Billing Rules table
CREATE TABLE IF NOT EXISTS public.billing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days_offset INTEGER NOT NULL,
  channel TEXT NOT NULL,
  template TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Billing Actions (Traceability & Promises)
CREATE TABLE IF NOT EXISTS public.billing_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  receivable_id UUID NOT NULL REFERENCES public.receivables(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  promise_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. Create API Keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- 5. Create Webhooks
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  secret TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.billing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Billing Rules Policies
DROP POLICY IF EXISTS "Billing rules access" ON public.billing_rules;
CREATE POLICY "Billing rules access" ON public.billing_rules
  FOR ALL TO authenticated USING (tenant_id IN (SELECT get_auth_user_tenants()));

-- Billing Actions Policies
DROP POLICY IF EXISTS "Billing actions access" ON public.billing_actions;
CREATE POLICY "Billing actions access" ON public.billing_actions
  FOR ALL TO authenticated USING (tenant_id IN (SELECT get_auth_user_tenants()));

-- API Keys Policies
DROP POLICY IF EXISTS "API keys access" ON public.api_keys;
CREATE POLICY "API keys access" ON public.api_keys
  FOR ALL TO authenticated USING (tenant_id IN (SELECT get_auth_user_tenants()));

-- Webhooks Policies
DROP POLICY IF EXISTS "Webhooks access" ON public.webhooks;
CREATE POLICY "Webhooks access" ON public.webhooks
  FOR ALL TO authenticated USING (tenant_id IN (SELECT get_auth_user_tenants()));
