#!/usr/bin/env node
/**
 * Zero-config bootstrap for Hostinger:
 * - Forces SQLite DATABASE_URL (no manual DATABASE_URL)
 * - Auto-fills NextAuth / admin defaults
 * - Creates schema + seed
 * - Restores / backs up via Supabase Storage when SUPABASE_* are present
 */
const { mkdirSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

// Hostinger may inject a Postgres DATABASE_URL when a "database" is connected.
// This app always uses local SQLite (+ Supabase Storage backup) — force file URL.
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
  process.env.MCSO_IGNORED_DATABASE_URL = process.env.DATABASE_URL;
  console.warn(
    "[bootstrap] Ignoring non-SQLite DATABASE_URL from host; using local SQLite.",
  );
}
const sqlitePath = path.join(process.cwd(), "data", "prod.db");
process.env.DATABASE_URL = `file:${sqlitePath}`;
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.SUPABASE_API_KEY ||
  "mcso-hostinger-default-nextauth-secret";
process.env.NEXTAUTH_URL =
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://mcsogroup.com";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "demo@mcso.local";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MCSO-Demo-2026!";
process.env.ADMIN_NAME = process.env.ADMIN_NAME || "Demo Admin";

mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
console.log("[bootstrap] SQLite DATABASE_URL =", process.env.DATABASE_URL);

function run(cmd, args) {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (res.status !== 0) process.exit(res.status || 1);
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "db", "push", "--accept-data-loss"]);

const syncScript = path.join(process.cwd(), "scripts", "sync-supabase.ts");
// Restore durable snapshot before seeding so owner/CMS data is not skipped.
run("npx", ["tsx", syncScript, "restore"]);
run("npx", ["tsx", "prisma/seed.ts"]);
// Backup after seed so demo + defaults are durable on first boot.
run("npx", ["tsx", syncScript, "backup"]);

console.log("DB bootstrap complete.");
