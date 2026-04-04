-- 1. Create is_platform_admin function to avoid recursion and allow robust RBAC logic
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM tenant_users tu
    JOIN tenants t ON tu.tenant_id = t.id
    WHERE tu.user_id = auth.uid()
      AND tu.role = 'admin'
      AND t.name ILIKE 'Planettaweb%'
  );
$function$;

-- 2. Update RLS policies for tenants to eliminate recursion and grant access to platform admins
DROP POLICY IF EXISTS "Tenant access" ON public.tenants;
CREATE POLICY "Tenant access" ON public.tenants
  FOR SELECT TO authenticated
  USING (
    id IN (SELECT get_auth_user_tenants())
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "Tenant update" ON public.tenants;
CREATE POLICY "Tenant update" ON public.tenants
  FOR UPDATE TO authenticated
  USING (
    id IN (SELECT get_auth_user_admin_tenants())
    OR public.is_platform_admin()
  );

-- 3. Update RLS policies for tenant_users to eliminate recursion
DROP POLICY IF EXISTS "tenant_users_select" ON public.tenant_users;
CREATE POLICY "tenant_users_select" ON public.tenant_users
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR tenant_id IN (SELECT get_auth_user_tenants())
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "tenant_users_update" ON public.tenant_users;
CREATE POLICY "tenant_users_update" ON public.tenant_users
  FOR UPDATE TO authenticated
  USING (
    tenant_id IN (SELECT get_auth_user_admin_tenants())
    OR public.is_platform_admin()
  );

-- 4. Update RLS policies for profiles
DROP POLICY IF EXISTS "Profiles select" ON public.profiles;
CREATE POLICY "Profiles select" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() 
    OR id IN (
      SELECT user_id 
      FROM tenant_users 
      WHERE tenant_id IN (SELECT get_auth_user_tenants())
    )
    OR public.is_platform_admin()
  );

-- 5. Seed Planettaweb tenant if it doesn't exist, so the user can rename their organization and use it
DO $DO$
DECLARE
  v_tenant_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE name ILIKE 'Planettaweb%') THEN
    v_tenant_id := gen_random_uuid();
    INSERT INTO public.tenants (id, name, status, plan)
    VALUES (v_tenant_id, 'Planettaweb (Admin)', 'active', 'enterprise');
  END IF;
END $DO$;
