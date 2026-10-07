import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Auto-configure env so Hostinger only needs SUPABASE_URL + SUPABASE_API_KEY.
 *
 * Kept self-contained (no local imports) because next.config.ts loads this file.
 *
 * Hostinger may inject a Postgres DATABASE_URL — ignore it. Prefer a writable
 * SQLite file under /tmp in production (deploy artifacts are often read-only).
 */
function toSqliteUrl(absoluteDbPath: string) {
  // Prisma expects a file URL; pathToFileURL yields file:///abs/path.db
  return pathToFileURL(absoluteDbPath).href;
}

function prepareDbFile(dir: string, dbPath: string) {
  fs.mkdirSync(dir, { recursive: true });
  const probe = path.join(dir, ".write-test");
  fs.writeFileSync(probe, "ok");
  fs.unlinkSync(probe);
  if (!fs.existsSync(dbPath)) {
    // Touch an empty file so SQLite can open the path; schema comes from db push/bootstrap.
    fs.writeFileSync(dbPath, "");
  }
  fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
}

function ensureWritableDatabaseUrl(): string {
  const incoming = process.env.DATABASE_URL || "";
  if (incoming && !incoming.startsWith("file:")) {
    process.env.MCSO_IGNORED_DATABASE_URL = incoming;
    console.warn(
      "[db] Ignoring non-SQLite DATABASE_URL from host (using local SQLite instead).",
    );
  }

  const preferredDir = path.join(process.cwd(), "data");
  const preferredDb = path.join(preferredDir, "prod.db");
  const fallbackDir = path.join("/tmp", "mcso-data");
  const fallbackDb = path.join(fallbackDir, "prod.db");

  const candidates =
    process.env.NODE_ENV === "production"
      ? [
          // Hostinger runtime disk is often only writable under /tmp.
          { dir: fallbackDir, db: fallbackDb, label: "tmp-fallback" },
          { dir: preferredDir, db: preferredDb, label: "cwd-data" },
        ]
      : [
          { dir: preferredDir, db: preferredDb, label: "cwd-data" },
          { dir: fallbackDir, db: fallbackDb, label: "tmp-fallback" },
        ];

  for (const candidate of candidates) {
    try {
      // Seed /tmp from build artifact when present.
      if (
        candidate.db === fallbackDb &&
        fs.existsSync(preferredDb) &&
        !fs.existsSync(fallbackDb)
      ) {
        fs.mkdirSync(fallbackDir, { recursive: true });
        fs.copyFileSync(preferredDb, fallbackDb);
      }
      prepareDbFile(candidate.dir, candidate.db);
      const url = toSqliteUrl(candidate.db);
      console.warn(`[db] SQLite ready (${candidate.label}):`, url);
      return url;
    } catch (err) {
      console.warn(`[db] Cannot use ${candidate.label}:`, err);
    }
  }

  // Last resort
  try {
    prepareDbFile(fallbackDir, fallbackDb);
  } catch {
    // ignore
  }
  return toSqliteUrl(fallbackDb);
}

export function ensureRuntimeEnv() {
  process.env.DATABASE_URL = ensureWritableDatabaseUrl();

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      process.env.SUPABASE_API_KEY ||
      "mcso-hostinger-default-nextauth-secret";
  }

  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
    process.env.NEXTAUTH_URL =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
      "https://mcsogroup.com";
  }

  if (!process.env.ADMIN_EMAIL) {
    process.env.ADMIN_EMAIL = "mcsogroup@gmail.com";
  }
  if (!process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = "changeme123";
  }
  if (!process.env.ADMIN_NAME) {
    process.env.ADMIN_NAME = "mcso";
  }
}

ensureRuntimeEnv();
