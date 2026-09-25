import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Typed Supabase client (Hostinger-injected SUPABASE_URL + SUPABASE_API_KEY). */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_API_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}
