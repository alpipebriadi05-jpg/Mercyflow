-- Mercyflow PostgreSQL foundation
-- Designed for Supabase + future blockchain verification.
-- Auth identities are handled by Supabase Auth; public.users stores app profiles.

create extension if not exists pgcrypto;

create type public.campaign_status as enum ('draft','active','paused','completed','cancelled');
create type public.donation_status as enum ('pending','confirmed','failed','refunded');
create type public.wallet_type as enum ('custodial','external');
create type public.transaction_type as enum ('donation','payout','refund','fee','transfer');
create type public.transaction_status as enum ('pending','confirmed','failed');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.beneficiaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  contact_email text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending','verified','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users(id) on delete restrict,
  beneficiary_id uuid references public.beneficiaries(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  goal_amount numeric(20,2) not null default 0 check (goal_amount >= 0),
  currency text not null default 'USD',
  status public.campaign_status not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  wallet_type public.wallet_type not null default 'external',
  chain text,
  address text,
  label text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (chain, address)
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete restrict,
  donor_id uuid references public.users(id) on delete set null,
  amount numeric(20,2) not null check (amount > 0),
  currency text not null default 'USD',
  status public.donation_status not null default 'pending',
  message text,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  wallet_id uuid references public.wallets(id) on delete set null,
  tx_type public.transaction_type not null,
  status public.transaction_status not null default 'pending',
  amount numeric(30,10) not null check (amount >= 0),
  currency text not null default 'USD',
  chain text,
  tx_hash text,
  block_number bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unique (chain, tx_hash)
);

create index campaigns_creator_id_idx on public.campaigns(creator_id);
create index campaigns_status_idx on public.campaigns(status);
create index donations_campaign_id_idx on public.donations(campaign_id);
create index donations_donor_id_idx on public.donations(donor_id);
create index donations_status_idx on public.donations(status);
create index transactions_campaign_id_idx on public.transactions(campaign_id);
create index transactions_donation_id_idx on public.transactions(donation_id);
create index transactions_tx_hash_idx on public.transactions(tx_hash);

alter table public.users enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.campaigns enable row level security;
alter table public.wallets enable row level security;
alter table public.donations enable row level security;
alter table public.transactions enable row level security;

-- Profiles: users can read/update their own profile.
create policy "users can read own profile"
on public.users for select
to authenticated
using (auth.uid() = id);

create policy "users can update own profile"
on public.users for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "users can insert own profile"
on public.users for insert
to authenticated
with check (auth.uid() = id);

-- Public campaign discovery.
create policy "anyone can read active campaigns"
on public.campaigns for select
to anon, authenticated
using (status = 'active');

-- Campaign creators can manage their own campaigns.
create policy "creators can insert campaigns"
on public.campaigns for insert
to authenticated
with check (auth.uid() = creator_id);

create policy "creators can update campaigns"
on public.campaigns for update
to authenticated
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

-- Beneficiary details are restricted by default.
-- Donation records are private to their donor/creator for now.
create policy "donors can read own donations"
on public.donations for select
to authenticated
using (auth.uid() = donor_id);

-- Wallets belong to their owner.
create policy "users can read own wallets"
on public.wallets for select
to authenticated
using (auth.uid() = user_id);

create policy "users can insert own wallets"
on public.wallets for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can delete own wallets"
on public.wallets for delete
to authenticated
using (auth.uid() = user_id);

-- Transaction data is not publicly writable.
-- Public transparency policies can be added after the verification flow is implemented.

-- Automatically create a public profile after Supabase Auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row execute procedure public.set_updated_at();

create trigger beneficiaries_set_updated_at
before update on public.beneficiaries
for each row execute procedure public.set_updated_at();

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute procedure public.set_updated_at();
