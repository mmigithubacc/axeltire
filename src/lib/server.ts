/**
 * Server-only helpers for Stripe payments. These read SECRET env vars and must
 * never be imported into client code. On Vercel the secrets come from
 * `process.env` at runtime; `import.meta.env` is a local-dev fallback.
 *
 * Required env vars (Vercel → Settings → Environment Variables):
 *   STRIPE_SECRET_KEY            — Stripe secret key (sk_live_… / sk_test_…)
 *   SUPABASE_SERVICE_ROLE_KEY    — Supabase service role key (server only!)
 *   PUBLIC_SUPABASE_URL          — already set
 */
import Stripe from 'stripe';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = (k: string): string | undefined =>
  (typeof process !== 'undefined' && process.env?.[k]) || (import.meta.env as any)[k];

const STRIPE_SECRET = env('STRIPE_SECRET_KEY');
const SERVICE_ROLE = env('SUPABASE_SERVICE_ROLE_KEY');
const SUPABASE_URL = env('PUBLIC_SUPABASE_URL');
export const ANON_KEY = env('PUBLIC_SUPABASE_ANON_KEY');

// Checkout only needs Stripe + Supabase URL/anon (it acts as the signed-in
// customer). The service role is used only to mark orders Paid afterwards.
export const isPaymentsConfigured = Boolean(STRIPE_SECRET && SUPABASE_URL && ANON_KEY);

export const stripe = STRIPE_SECRET ? new Stripe(STRIPE_SECRET) : null;

/** Supabase client with the service role — bypasses RLS. Server only. */
export function adminDb(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE_ROLE) return null;
  return createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
}

/** A Supabase client acting as the signed-in customer (their access token). */
export function authedClient(token?: string): SupabaseClient | null {
  if (!SUPABASE_URL || !ANON_KEY) return null;
  return createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    auth: { persistSession: false },
  });
}

export const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
