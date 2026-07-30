-- Exécuter dans l'éditeur SQL de Supabase (Dashboard → SQL Editor)

-- Table profiles liée à auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  first_name text,
  last_name text,
  full_name text,
  address text,
  has_paid boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Si la table existe déjà, ajouter les colonnes :
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists address text;

alter table public.profiles enable row level security;

-- L'utilisateur peut lire son propre profil
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- L'utilisateur peut mettre à jour son propre profil
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger : créer un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    address
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'address'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Le service role (webhook Stripe) peut gérer tous les profils
drop policy if exists "Service role manages profiles" on public.profiles;
create policy "Service role manages profiles"
  on public.profiles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
