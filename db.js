/**
 * Supabase client for Hostinger / MCSO.
 * Hostinger injects SUPABASE_URL and SUPABASE_API_KEY when the DB is connected.
 *
 * App data (inquiries, pages, gallery, auth) still uses Prisma via DATABASE_URL
 * (Supabase Postgres connection string). See README / .env.example.
 */
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[db] SUPABASE_URL / SUPABASE_API_KEY not set. Set them in Hostinger env (or .env) after connecting the database.",
  );
}

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

module.exports = supabase;
