/**
 * Supabase configuration.
 *
 * Reads the public project URL + anon key from env. Both are safe to expose
 * in the browser — the database is protected by Row Level Security (see
 * db/schema.sql). If the env vars are absent, the site falls back to the
 * static inventory.json so it still builds and runs.
 *
 * Set these in `.env` (local) and in Vercel → Project → Environment Variables:
 *   PUBLIC_SUPABASE_URL
 *   PUBLIC_SUPABASE_ANON_KEY
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

/** Returns a shared Supabase client, or null when not configured. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}
