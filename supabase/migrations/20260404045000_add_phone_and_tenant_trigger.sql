ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $function$
DECLARE
  new_tenant_id uuid;
BEGIN
  -- Insert into profiles
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

  -- If company_name is provided in metadata, create a new tenant
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    new_tenant_id := gen_random_uuid();
    
    INSERT INTO public.tenants (id, name, status, plan)
    VALUES (new_tenant_id, NEW.raw_user_meta_data->>'company_name', 'active', 'freemium');

    INSERT INTO public.tenant_users (tenant_id, user_id, role)
    VALUES (new_tenant_id, NEW.id, 'admin');
  END IF;

  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;
