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
  process.env.DATABASE_URL || "file:./data/prod.db";
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.SUPABASE_API_KEY ||
  "mcso-hostinger-default-nextauth-secret";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mcso.local";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MCSOAdmin2026!";
process.env.ADMIN_NAME = process.env.ADMIN_NAME || "MCSO Admin";

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
run("npx", ["prisma", "db", "push"]);
run("npx", ["tsx", "prisma/seed.ts"]);

const syncScript = path.join(process.cwd(), "scripts", "sync-supabase.ts");
run("npx", ["tsx", syncScript]);

console.log("DB bootstrap complete.");
