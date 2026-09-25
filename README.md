# MCSO Security Group Website

Marketing site and admin CMS for Michael Colon Security Organization LLC.

## Features

- Marketing homepage with hero, owner story, services, image gallery, and consultation form
- Wix-like drag-and-drop site editor (Puck)
- Admin dashboard: inquiries pipeline, contact book, gallery uploads
- Supabase Postgres via Hostinger + Prisma

## Hostinger + Supabase setup

1. In Hostinger hPanel, create/connect the **MCSO** Supabase database (save the DB password).
2. Hostinger will provide / inject:
   - `SUPABASE_URL`
   - `SUPABASE_API_KEY`
3. Also add **`DATABASE_URL`** (required for Prisma):
   - Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings → Database → Connect**
   - Copy the **URI** connection string
   - Replace `[YOUR-PASSWORD]` with the database password from Hostinger
   - Paste into Hostinger → Website → Environment variables as `DATABASE_URL`
4. Also set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `ADMIN_*` (see `.env.example`).
5. Push to GitHub — Hostinger redeploys, runs `prisma db push` + seed, and connects.

This repo already includes:

- `@supabase/supabase-js` in `package.json`
- `db.js` (Hostinger connection file)
- Prisma schema pointed at PostgreSQL

## Local development

```bash
cp .env.example .env
# Set DATABASE_URL to your Supabase URI (same as production) or a local Postgres URL
npm install
npm run db:setup
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Stack

- Next.js 15 (App Router)
- Prisma + Supabase PostgreSQL
- `@supabase/supabase-js` (Hostinger connection)
- NextAuth credentials
- Puck visual page builder
