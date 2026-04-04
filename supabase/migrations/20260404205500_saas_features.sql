-- Add SaaS configuration columns to tenants table
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS user_limit INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS record_limit INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS active_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enabled_integrations JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{"logo": "", "primary_color": "#000000"}'::jsonb;

-- Adjust Policies to allow platform admins to create and delete tenants
DROP POLICY IF EXISTS "Tenant insert" ON public.tenants;
CREATE POLICY "Tenant insert" ON public.tenants
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_platform_admin()
  );

DROP POLICY IF EXISTS "Tenant delete" ON public.tenants;
CREATE POLICY "Tenant delete" ON public.tenants
  FOR DELETE TO authenticated
  USING (
    public.is_platform_admin()
  );
