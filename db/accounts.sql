-- Axel Tires — customer accounts, admin authorization, order ownership.
-- Run once in the Supabase SQL Editor (after schema.sql + seed.sql).

-- ─── Admin allowlist ────────────────────────────────────────────────────────
create table if not exists public.admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "self read admin" on public.admins;
create policy "self read admin" on public.admins
  for select to authenticated using (email = (auth.jwt() ->> 'email'));

-- Seed the current (earliest-created) user as the admin, if none set yet.
-- Run this BEFORE any customers sign up so the shop owner becomes the admin.
insert into public.admins(email)
  select email from auth.users order by created_at asc limit 1
  on conflict do nothing;

-- Future-proof: if the admins table is ever empty, the next sign-up becomes admin.
create or replace function public.promote_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.admins) = 0 then
    insert into public.admins(email) values (new.email) on conflict do nothing;
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.promote_first_admin();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email'));
$$;

-- ─── Order ownership ────────────────────────────────────────────────────────
alter table public.orders add column if not exists user_id uuid references auth.users(id);

-- ─── Tighten RLS ────────────────────────────────────────────────────────────
-- Only admins can edit the catalog.
drop policy if exists "admin manage tires" on public.tires;
create policy "admin manage tires" on public.tires
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Orders: customers manage their own; admin sees everything.
drop policy if exists "anyone create order" on public.orders;
drop policy if exists "admin read orders" on public.orders;
drop policy if exists "admin update orders" on public.orders;
drop policy if exists "lookup order by ref" on public.orders;

create policy "customer insert own order" on public.orders
  for insert to authenticated with check (user_id = auth.uid());

create policy "read own or admin" on public.orders
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "admin update order" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
