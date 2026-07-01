# Stock & orders backend (Supabase)

The catalog, order tracking, and the `/admin` back office are powered by
Supabase. Inventory lives in the database; the site reads it at build time
(for SEO/speed) and refreshes live stock in the browser. If Supabase isn't
configured, the site falls back to `src/data/inventory.json` and still works.

## One-time setup

1. **Create the tables.** In Supabase → SQL Editor, run `db/schema.sql`, then
   `db/seed.sql` to load the current 28 SKUs.
2. **Create the owner's login.** Supabase → Authentication → Users → *Add user*
   (email + password). That account signs in at `/admin`. (No GitHub, no code.)
2b. **Customer accounts + admin lockdown.** Run `db/accounts.sql` (AFTER the
   owner login exists). It promotes the owner (earliest user) to admin, ties
   orders to customer accounts, and restricts stock editing to the admin only.
   Customers self-register at `/account`; only the admin can edit the catalog.
3. **Connect the site.** Copy `.env.example` → `.env` and fill in:
   - `PUBLIC_SUPABASE_URL` — Project → Settings → API → Project URL
   - `PUBLIC_SUPABASE_ANON_KEY` — Project → Settings → API → `anon` `public` key

   Add the same two variables in **Vercel → Project → Settings → Environment
   Variables**, then redeploy.

Both values are public by design and protected by Row Level Security. **Never**
use the `service_role` secret key in the site.

## Day-to-day: the owner adds stock

Go to **`/admin`**, sign in with the email/password from step 2, and:

- **Stock tab** — change price / MSRP / stock, toggle *On sale*, **Save** each
  row; add a new tire; or delete one. (Wholesale cost/margin is shown to admins
  only — it's never sent to the public catalog.)
- **Orders tab** — see every order, and set status (Requested → Confirmed →
  Delivered / Cancelled).

Stock edits appear on the live catalog immediately via the browser's live-stock
refresh, and become the static baseline on the next deploy.

> Optional: to rebuild the static pages automatically when stock changes, add a
> Vercel **Deploy Hook** and call it from a Supabase database webhook on the
> `tires` table.

## How it fits together

- `db/schema.sql` — `tires` + `orders` tables, RLS, and a `tires_public` view
  that hides wholesale cost from anonymous reads.
- `src/lib/supabase.ts` — browser/build client from the env vars.
- `src/lib/inventory.ts` — `getTires()`: Supabase when configured, else JSON.
- `/shop` — builds from `getTires()`, refreshes live stock, writes orders.
- `/track` — looks up an order by reference (cross-device).
- `/admin` — email-login back office for stock + orders.

## Online payments (Stripe)

Customers can pay by card (Visa, Mastercard, Amex, debit) via Stripe Checkout.
Card entry happens on Stripe's secure hosted page; the site never handles card
data. Prices are recomputed server-side so totals can't be tampered with.

### Setup
1. Create a Stripe account (stripe.com) → Developers → API keys.
2. Add these env vars in Vercel (then redeploy):
   - `PUBLIC_STRIPE_PUBLISHABLE_KEY` — `pk_…` (public; enables the "Pay online" option)
   - `STRIPE_SECRET_KEY` — `sk_…` (**secret, server only**)
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Settings → API → `service_role`
     (**secret, server only** — lets the payment function mark orders paid)
3. That's it — no Stripe webhook needed. Payment is verified on the return
   redirect (`/api/order-complete`) before the order is marked **Paid**.

### Flow
- `/shop` checkout → "Pay online" → `POST /api/create-checkout` creates a
  pending order + a Stripe session → customer pays on Stripe → returns to
  `/api/order-complete`, which verifies the session and marks the order **Paid**,
  then sends the customer to `/account`.
- "Pay on delivery/pickup" still works with no card — the order is saved as
  **Requested**.

### Notes
- These `/api/*` routes are serverless functions (via the Vercel adapter). They
  require a host that runs server functions — Vercel (incl. the custom
  axeltire.ca domain) works; a purely static host would not run payments.
- Use Stripe **test** keys (`pk_test`/`sk_test`) to trial with card 4242 4242
  4242 4242, then swap to live keys.
