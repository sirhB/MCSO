import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/** Supabase client from Hostinger-injected SUPABASE_URL + SUPABASE_API_KEY. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_API_KEY;
  if (!url || !key) {
    client = null;
    return client;
  }
  client = createClient(url, key);
  return client;
}
