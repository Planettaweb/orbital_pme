-- Tenants
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS max_files_per_contract INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_file_size_mb INTEGER DEFAULT 10;

-- Contracts
ALTER TABLE public.contracts
ADD COLUMN IF NOT EXISTS value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_notified_at TIMESTAMPTZ;

-- Contract Attachments
CREATE TABLE IF NOT EXISTS public.contract_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contract_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contract_attachments access" ON public.contract_attachments;
CREATE POLICY "contract_attachments access" ON public.contract_attachments
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT public.get_auth_user_tenants()));

-- Helper for UUID casting safely
CREATE OR REPLACE FUNCTION public.try_cast_uuid(p_in text)
RETURNS uuid AS $$
BEGIN
  RETURN p_in::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Helper for Tenant Membership
CREATE OR REPLACE FUNCTION public.is_tenant_member(p_tenant_id uuid)
RETURNS boolean AS $$
BEGIN
  IF p_tenant_id IS NULL THEN RETURN false; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE user_id = auth.uid() AND tenant_id = p_tenant_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage Bucket Creation
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('contracts', 'contracts', false, null, null)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies for Contracts Bucket
DROP POLICY IF EXISTS "contracts_bucket_insert" ON storage.objects;
CREATE POLICY "contracts_bucket_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contracts' AND public.is_tenant_member(public.try_cast_uuid(SPLIT_PART(name, '/', 1))));

DROP POLICY IF EXISTS "contracts_bucket_select" ON storage.objects;
CREATE POLICY "contracts_bucket_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'contracts' AND public.is_tenant_member(public.try_cast_uuid(SPLIT_PART(name, '/', 1))));

DROP POLICY IF EXISTS "contracts_bucket_delete" ON storage.objects;
CREATE POLICY "contracts_bucket_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'contracts' AND public.is_tenant_member(public.try_cast_uuid(SPLIT_PART(name, '/', 1))));
