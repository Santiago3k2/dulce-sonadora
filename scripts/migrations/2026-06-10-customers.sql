-- ════════════════════════════════════════════════════════════════════
-- Clientes: cuentas, perfiles, tiers (clientes especiales) y enlace a pedidos.
-- Pegar en Supabase Studio → SQL Editor → Run.  (Idempotente, se puede correr 2 veces.)
-- ════════════════════════════════════════════════════════════════════

-- 1) Perfil de cada cliente (1:1 con auth.users). Incluye el tier para precios especiales.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  address      text,
  city         text,
  tier         text not null default 'detal',   -- 'detal' | 'mayorista' | 'vip'
  discount_pct numeric not null default 0,       -- % extra de descuento (clientes especiales)
  notes        text,                             -- notas internas del admin
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- El cliente solo ve/edita SU propio perfil. (El admin usa service_role y salta RLS.)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- El cliente NO puede cambiarse su propio tier/descuento (eso lo controla el admin).
-- Se fija con un trigger que conserva los valores previos en updates del cliente.
create or replace function public.protect_profile_tier()
returns trigger as $$
begin
  if auth.role() <> 'service_role' then
    new.tier := old.tier;
    new.discount_pct := old.discount_pct;
    new.notes := old.notes;
  end if;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists trg_protect_profile_tier on public.profiles;
create trigger trg_protect_profile_tier
  before update on public.profiles
  for each row execute function public.protect_profile_tier();

-- 2) Crear el perfil automáticamente al registrarse.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Enlazar pedidos con el cliente (queda null en pedidos de invitado).
alter table public.orders add column if not exists customer_id uuid references auth.users(id);

-- El cliente puede ver SUS pedidos (los de invitado siguen siendo solo service_role).
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = customer_id);
