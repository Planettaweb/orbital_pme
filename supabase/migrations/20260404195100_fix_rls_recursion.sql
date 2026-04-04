-- Fix handle_new_user for robustness
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_tenant_id uuid;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;

  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL AND NEW.raw_user_meta_data->>'company_name' <> '' THEN
    new_tenant_id := gen_random_uuid();
    
    INSERT INTO public.tenants (id, name, status, plan)
    VALUES (new_tenant_id, NEW.raw_user_meta_data->>'company_name', 'active', 'freemium');

    INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
    VALUES (new_tenant_id, NEW.id, 'admin', 'active')
    ON CONFLICT (tenant_id, user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create helper functions to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_auth_user_tenants()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.get_auth_user_admin_tenants()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role = 'admin';
$function$;

-- Update tenant_users policies
DROP POLICY IF EXISTS "tenant_users_select" ON public.tenant_users;
CREATE POLICY "tenant_users_select" ON public.tenant_users
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    tenant_id IN (SELECT public.get_auth_user_tenants())
  );

DROP POLICY IF EXISTS "tenant_users_insert" ON public.tenant_users;
CREATE POLICY "tenant_users_insert" ON public.tenant_users
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IN (SELECT public.get_auth_user_admin_tenants())
  );

DROP POLICY IF EXISTS "tenant_users_update" ON public.tenant_users;
CREATE POLICY "tenant_users_update" ON public.tenant_users
  FOR UPDATE TO authenticated
  USING (
    tenant_id IN (SELECT public.get_auth_user_admin_tenants())
  );

DROP POLICY IF EXISTS "tenant_users_delete" ON public.tenant_users;
CREATE POLICY "tenant_users_delete" ON public.tenant_users
  FOR DELETE TO authenticated
  USING (
    tenant_id IN (SELECT public.get_auth_user_admin_tenants())
  );

-- Update profiles policies
DROP POLICY IF EXISTS "Profiles select" ON public.profiles;
CREATE POLICY "Profiles select" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() OR
    id IN (
      SELECT user_id FROM tenant_users WHERE tenant_id IN (SELECT public.get_auth_user_tenants())
    )
  );

-- Update tenants policies
DROP POLICY IF EXISTS "Tenant access" ON public.tenants;
CREATE POLICY "Tenant access" ON public.tenants
  FOR SELECT TO authenticated
  USING (id IN (SELECT public.get_auth_user_tenants()));

DROP POLICY IF EXISTS "Tenant update" ON public.tenants;
CREATE POLICY "Tenant update" ON public.tenants
  FOR UPDATE TO authenticated
  USING (id IN (SELECT public.get_auth_user_admin_tenants()));

-- Contracts, customers, fiscal_documents, receivables can use the helper function too for consistency and performance
DROP POLICY IF EXISTS "Contracts access" ON public.contracts;
CREATE POLICY "Contracts access" ON public.contracts
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT public.get_auth_user_tenants()));

DROP POLICY IF EXISTS "Customers access" ON public.customers;
CREATE POLICY "Customers access" ON public.customers
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT public.get_auth_user_tenants()));

DROP POLICY IF EXISTS "Fiscal docs access" ON public.fiscal_documents;
CREATE POLICY "Fiscal docs access" ON public.fiscal_documents
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT public.get_auth_user_tenants()));

DROP POLICY IF EXISTS "Receivables access" ON public.receivables;
CREATE POLICY "Receivables access" ON public.receivables
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT public.get_auth_user_tenants()));
