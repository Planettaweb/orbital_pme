-- Criar tabela de roles (Perfis de Acesso)
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Inserir perfis básicos
INSERT INTO public.roles (name, description) VALUES 
('admin', 'Administrador com acesso total'),
('analyst', 'Analista com acesso de edição'),
('viewer', 'Visualizador com acesso apenas leitura'),
('operator', 'Operador do sistema')
ON CONFLICT (name) DO NOTHING;

-- Adicionar FK em tenant_users para garantir integridade relacional
ALTER TABLE public.tenant_users ADD CONSTRAINT tenant_users_role_fkey FOREIGN KEY (role) REFERENCES public.roles(name) ON UPDATE CASCADE;

-- Habilitar RLS e políticas
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roles_select" ON public.roles;
CREATE POLICY "roles_select" ON public.roles FOR SELECT TO authenticated USING (true);

-- Atualizar trigger para ser mais seguro ao criar tenants garantindo sempre ser o Admin primário e evitando vazios
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

  -- Só cria o tenant se a empresa for de fato preenchida, como no fluxo obrigatório de cadastro
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL AND NEW.raw_user_meta_data->>'company_name' <> '' THEN
    new_tenant_id := gen_random_uuid();
    
    INSERT INTO public.tenants (id, name, status, plan)
    VALUES (new_tenant_id, NEW.raw_user_meta_data->>'company_name', 'active', 'freemium');

    INSERT INTO public.tenant_users (tenant_id, user_id, role, status)
    VALUES (new_tenant_id, NEW.id, 'admin', 'active');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
