/**
 * Hostinger connection file.
 * Uses only SUPABASE_URL + SUPABASE_API_KEY (injected when you connect the DB).
 * No other env vars required for the MCSO app to run.
 */
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!supabase) {
  console.warn(
    "[db] Waiting for Hostinger to inject SUPABASE_URL / SUPABASE_API_KEY.",
  );
} else {
  console.log("[db] Supabase client connected.");
}

module.exports = supabase;
