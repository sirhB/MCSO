# MCSO Security Group Website

Marketing site + admin CMS for Michael Colon Security Organization LLC.

## Hostinger setup (zero manual env vars)

1. Connect the **MCSO** Supabase database in Hostinger (Continue).
2. Hostinger injects `SUPABASE_URL` + `SUPABASE_API_KEY` automatically.
3. Push to GitHub — Hostinger redeploys.

That’s it. The app:

- Uses local SQLite automatically (no `DATABASE_URL` to configure)
- Syncs a durable backup to **Supabase Storage** with those two Hostinger keys
- Restores from that backup on each fresh deploy
- Auto-configures NextAuth secret/URL
- Seeds a **demo admin** for testing (see below)
- Lets Michael create **one owner account** at `/admin/setup`
- Change credentials anytime under **Admin → Settings**

## Admin access

### Demo login (dev / testing)

| Field | Value |
| --- | --- |
| Email | `demo@mcso.local` |
| Password | `MCSO-Demo-2026!` |

Sign in at `/admin/login`.

### Owner setup (Michael — one time)

1. Open `/admin/setup` (also linked from the login page until setup is done).
2. Choose username, email, and password (min 8 characters).
3. This can only be done once. After that, use `/admin/login`.

## Local development

```bash
npm install
npm run db:setup
npm run dev
```

- Demo: http://localhost:3000/admin/login (`demo@mcso.local` / `MCSO-Demo-2026!`)
- Owner setup: http://localhost:3000/admin/setup

## Stack

- Next.js 15
- Prisma + SQLite (runtime)
- Supabase Storage backup via `@supabase/supabase-js` (`db.js` for Hostinger)
- NextAuth + Puck editor
