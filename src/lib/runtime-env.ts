import fs from "fs";
import path from "path";

/**
 * Auto-configure env so Hostinger only needs SUPABASE_URL + SUPABASE_API_KEY
 * (injected when you connect the database). No manual DATABASE_URL / NEXTAUTH_* required.
 *
 * Kept self-contained (no local imports) because next.config.ts loads this file.
 *
 * Important: Hostinger may inject a Postgres DATABASE_URL when you "connect a
 * database". This app uses SQLite + Supabase Storage, so we always force a
 * local file: URL and ignore non-SQLite injected values.
 */
function ensureWritableDatabaseUrl(): string {
  const incoming = process.env.DATABASE_URL || "";
  if (incoming && !incoming.startsWith("file:")) {
    // Preserve for debugging; never use Postgres/MySQL with this Prisma schema.
    process.env.MCSO_IGNORED_DATABASE_URL = incoming;
    console.warn(
      "[db] Ignoring non-SQLite DATABASE_URL from host (using local SQLite instead).",
    );
  }

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

  try {
    fs.mkdirSync(fallbackDir, { recursive: true });
  } catch {
    // continue; canUse will report failure
  }

  if (fs.existsSync(preferredDb) && !fs.existsSync(fallbackDb)) {
    try {
      fs.copyFileSync(preferredDb, fallbackDb);
    } catch (err) {
      console.warn("[db] Could not copy SQLite to writable path:", err);
    }
  }

  if (canUse(fallbackDir, fallbackDb)) {
    console.warn("[db] Using writable SQLite fallback:", fallbackDb);
    return `file:${fallbackDb}`;
  }

  // Last resort: still return a file URL (never a Postgres URL).
  console.warn("[db] Writable SQLite path unavailable; using preferred path anyway.");
  try {
    fs.mkdirSync(preferredDir, { recursive: true });
  } catch {
    // ignore
  }
  return `file:${preferredDb}`;
}

export function ensureRuntimeEnv() {
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
      "https://mcsogroup.com";
  }

  if (!process.env.ADMIN_EMAIL) {
    process.env.ADMIN_EMAIL = "demo@mcso.local";
  }
  if (!process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = "MCSO-Demo-2026!";
  }
  if (!process.env.ADMIN_NAME) {
    process.env.ADMIN_NAME = "Demo Admin";
  }
}

ensureRuntimeEnv();
