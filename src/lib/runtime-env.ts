/**
 * Auto-configure env so Hostinger only needs SUPABASE_URL + SUPABASE_API_KEY
 * (injected when you connect the database). No manual DATABASE_URL / NEXTAUTH_* required.
 */
export function ensureRuntimeEnv() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./data/prod.db";
  }

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      process.env.SUPABASE_API_KEY ||
      "mcso-hostinger-default-nextauth-secret";
  }

  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
      "http://localhost:3000";
  }

  if (!process.env.ADMIN_EMAIL) {
    process.env.ADMIN_EMAIL = "admin@mcso.local";
  }
  if (!process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = "MCSOAdmin2026!";
  }
  if (!process.env.ADMIN_NAME) {
    process.env.ADMIN_NAME = "MCSO Admin";
  }
}

ensureRuntimeEnv();
