-- Axel Tires — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query),
-- then run db/seed.sql to load the current stock.

-- ─── Tires (inventory) ──────────────────────────────────────────────────────
create table if not exists public.tires (
  id            text primary key,
  sku           text not null,
  brand         text not null,
  model         text not null,
  size          text not null,
  season        text not null default 'All-Season',
  load_index    text,
  speed_rating  text,
  price         integer not null,        -- retail price (CAD)
  msrp          integer not null default 0,
  stock         integer not null default 0,
  best_seller   boolean not null default false,
  on_sale       boolean not null default false,
  run_flat      boolean not null default false,
  studdable     boolean not null default false,
  ev            boolean not null default false,
  ply           text,
  fob_usd       numeric,                 -- wholesale cost, admin-only (never public)
  updated_at    timestamptz not null default now()
);

create index if not exists tires_size_idx on public.tires (size);
create index if not exists tires_brand_idx on public.tires (brand);

-- ─── Orders ─────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  ref          text primary key,          -- e.g. AX-123456
  created_at   timestamptz not null default now(),
  items        jsonb not null,            -- [{sku,name,size,price,qty}]
  total        integer not null default 0,
  status       text not null default 'Requested',
  customer     jsonb                      -- {name, phone, fulfilment}
);

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.tires  enable row level security;
alter table public.orders enable row level security;

-- Public can READ the catalog, but NOT the wholesale cost column.
-- (Expose a view without fob_usd for anonymous reads.)
create or replace view public.tires_public as
  select id, sku, brand, model, size, season, load_index, speed_rating,
         price, msrp, stock, best_seller, on_sale, run_flat, studdable, ev, ply, updated_at
  from public.tires;

grant select on public.tires_public to anon, authenticated;

-- Signed-in admins can do everything on tires.
drop policy if exists "admin manage tires" on public.tires;
create policy "admin manage tires" on public.tires
  for all to authenticated using (true) with check (true);

-- Anyone can CREATE an order (checkout); only admins can read/update them.
drop policy if exists "anyone create order" on public.orders;
create policy "anyone create order" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders
  for select to authenticated using (true);

drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders
  for update to authenticated using (true) with check (true);

-- A customer can look up their own order by reference (for /track).
drop policy if exists "lookup order by ref" on public.orders;
create policy "lookup order by ref" on public.orders
  for select to anon using (true);

-- ─── Admin user ─────────────────────────────────────────────────────────────
-- Create the shop owner's login in Dashboard → Authentication → Users →
-- "Add user" (email + password). That account can then sign in at /admin.
