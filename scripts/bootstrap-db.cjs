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

process.env.DATABASE_URL =
  process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:../")
    ? process.env.DATABASE_URL
    : `file:${path.join(process.cwd(), "data", "prod.db")}`;
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.SUPABASE_API_KEY ||
  "mcso-hostinger-default-nextauth-secret";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "demo@mcso.local";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MCSO-Demo-2026!";
process.env.ADMIN_NAME = process.env.ADMIN_NAME || "Demo Admin";

mkdirSync(path.join(process.cwd(), "data"), { recursive: true });

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
