-- 1. Add status to tenant_users
ALTER TABLE public.tenant_users ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- 2. Drop dependent triggers if we change columns (none here, but we replace function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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

  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    new_tenant_id := gen_random_uuid();
    
    INSERT INTO public.tenants (id, name, status, plan)
    VALUES (new_tenant_id, NEW.raw_user_meta_data->>'company_name', 'active', 'freemium');

    INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
    VALUES (new_tenant_id, NEW.id, 'admin', 'active');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RLS for tenant_users
DROP POLICY IF EXISTS "tenant_users_select" ON public.tenant_users;
CREATE POLICY "tenant_users_select" ON public.tenant_users
  FOR SELECT TO authenticated USING (
    tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "tenant_users_insert" ON public.tenant_users;
CREATE POLICY "tenant_users_insert" ON public.tenant_users
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = auth.uid() AND tenant_id = tenant_users.tenant_id AND role = 'admin')
  );

DROP POLICY IF EXISTS "tenant_users_update" ON public.tenant_users;
CREATE POLICY "tenant_users_update" ON public.tenant_users
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = auth.uid() AND tenant_id = tenant_users.tenant_id AND role = 'admin')
  );

DROP POLICY IF EXISTS "tenant_users_delete" ON public.tenant_users;
CREATE POLICY "tenant_users_delete" ON public.tenant_users
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = auth.uid() AND tenant_id = tenant_users.tenant_id AND role = 'admin')
  );

-- 4. RLS for tenants
DROP POLICY IF EXISTS "Tenant access" ON public.tenants;
CREATE POLICY "Tenant access" ON public.tenants
  FOR SELECT TO authenticated USING (
    id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Tenant update" ON public.tenants;
CREATE POLICY "Tenant update" ON public.tenants
  FOR UPDATE TO authenticated USING (
    id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 5. RLS for profiles
DROP POLICY IF EXISTS "Profiles select" ON public.profiles;
CREATE POLICY "Profiles select" ON public.profiles
  FOR SELECT TO authenticated USING (
    id = auth.uid() OR id IN (SELECT user_id FROM public.tenant_users WHERE tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()))
  );
