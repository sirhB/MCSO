import fs from "fs";
import path from "path";

/**
 * Auto-configure env so Hostinger only needs SUPABASE_URL + SUPABASE_API_KEY
 * (injected when you connect the database). No manual DATABASE_URL / NEXTAUTH_* required.
 *
 * Kept self-contained (no local imports) because next.config.ts loads this file.
 */
function ensureWritableDatabaseUrl(): string {
  const preferredDir = path.join(process.cwd(), "data");
  const preferredDb = path.join(preferredDir, "prod.db");
  const fallbackDir = path.join("/tmp", "mcso-data");
  const fallbackDb = path.join(fallbackDir, "prod.db");

  const canUse = (dir: string, dbPath: string) => {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const probe = path.join(dir, ".write-test");
      fs.writeFileSync(probe, "ok");
      fs.unlinkSync(probe);
      if (fs.existsSync(dbPath)) {
        fs.accessSync(dbPath, fs.constants.W_OK);
      }
      return true;
    } catch {
      return false;
    }
  };

  if (canUse(preferredDir, preferredDb)) {
    return `file:${preferredDb}`;
  }

  fs.mkdirSync(fallbackDir, { recursive: true });
  if (fs.existsSync(preferredDb) && !fs.existsSync(fallbackDb)) {
    try {
      fs.copyFileSync(preferredDb, fallbackDb);
    } catch (err) {
      console.warn("[db] Could not copy SQLite to writable path:", err);
    }
  }
  if (!canUse(fallbackDir, fallbackDb)) {
    console.warn("[db] Writable SQLite path unavailable; using preferred path anyway.");
    return process.env.DATABASE_URL || `file:${preferredDb}`;
  }
  console.warn("[db] Using writable SQLite fallback:", fallbackDb);
  return `file:${fallbackDb}`;
}

export function ensureRuntimeEnv() {
  // Resolve a writable absolute SQLite URL (falls back to /tmp when ./data is read-only).
  process.env.DATABASE_URL = ensureWritableDatabaseUrl();

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
    process.env.ADMIN_EMAIL = "demo@mcso.local";
  }
  if (!process.env.ADMIN_PASSWORD) {
    // Demo credentials are seeded in prisma/seed.ts; owner uses /admin/setup
    process.env.ADMIN_PASSWORD = "MCSO-Demo-2026!";
  }
  if (!process.env.ADMIN_NAME) {
    process.env.ADMIN_NAME = "Demo Admin";
  }
}

ensureRuntimeEnv();
