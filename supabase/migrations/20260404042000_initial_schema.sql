DO $$
BEGIN
  -- 1. Create Tables
  
  -- Tenants
  CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    plan TEXT NOT NULL DEFAULT 'freemium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Profiles (Linked to auth.users)
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Tenant Users
  CREATE TABLE IF NOT EXISTS public.tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'operator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
  );

  -- Customers (Cobrança Viva)
  CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Receivables (Cobrança Viva)
  CREATE TABLE IF NOT EXISTS public.receivables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Fiscal Documents (FiscalPulse PME)
  CREATE TABLE IF NOT EXISTS public.fiscal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    document_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    risk_level TEXT DEFAULT 'low',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Contracts (Contrato Vivo)
  CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    party_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

END $$;

-- 2. Create Triggers for Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RLS Policies
-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tenant access
DROP POLICY IF EXISTS "Tenant access" ON public.tenants;
CREATE POLICY "Tenant access" ON public.tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE tenant_users.tenant_id = tenants.id 
      AND tenant_users.user_id = auth.uid()
    )
  );

-- Customers access
DROP POLICY IF EXISTS "Customers access" ON public.customers;
CREATE POLICY "Customers access" ON public.customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE tenant_users.tenant_id = customers.tenant_id 
      AND tenant_users.user_id = auth.uid()
    )
  );

-- Receivables access
DROP POLICY IF EXISTS "Receivables access" ON public.receivables;
CREATE POLICY "Receivables access" ON public.receivables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE tenant_users.tenant_id = receivables.tenant_id 
      AND tenant_users.user_id = auth.uid()
    )
  );

-- Fiscal docs access
DROP POLICY IF EXISTS "Fiscal docs access" ON public.fiscal_documents;
CREATE POLICY "Fiscal docs access" ON public.fiscal_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE tenant_users.tenant_id = fiscal_documents.tenant_id 
      AND tenant_users.user_id = auth.uid()
    )
  );

-- Contracts access
DROP POLICY IF EXISTS "Contracts access" ON public.contracts;
CREATE POLICY "Contracts access" ON public.contracts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users 
      WHERE tenant_users.tenant_id = contracts.tenant_id 
      AND tenant_users.user_id = auth.uid()
    )
  );
