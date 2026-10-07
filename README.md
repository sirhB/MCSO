# MCSO Security Group Website

Marketing site + admin CMS for Michael Colon Security Organization LLC.

## Hostinger setup (zero manual env vars)

1. Connect the **MCSO** Supabase database in Hostinger (Continue).
2. Hostinger injects `SUPABASE_URL` + `SUPABASE_API_KEY` automatically.
3. Push to GitHub — Hostinger redeploys.

That’s it. The app:

- Uses local SQLite automatically (ignores a Hostinger Postgres `DATABASE_URL` if injected)
- On Hostinger production, SQLite lives under `/tmp/mcso-data` so the DB can open at runtime
- `npm start` re-runs DB bootstrap so Michael’s login is recreated on each deploy/start
- Syncs a durable backup to **Supabase Storage** with those two Hostinger keys
- Restores from that backup on each fresh deploy
- Auto-configures NextAuth secret/URL
- Seeds Michael’s admin account on deploy
- Change credentials anytime under **Admin → Settings**

## Admin access

Sign in at `/admin/login`:

| Field | Value |
| --- | --- |
| Username | `mcso` |
| Email | `mcsogroup@gmail.com` |
| Password | `changeme123` |

Change the password after first login (Settings). A short mobile walkthrough introduces the admin on first visit.

Contact form submissions appear under **Inquiries** (and on the dashboard). Use **Reply by email** to open a ready-to-send mailto reply.

## Local development

```bash
npm install
npm run db:setup
npm run dev
```

Then open http://localhost:3000/admin/login

## Stack

- Next.js 15
- Prisma + SQLite (runtime)
- Supabase Storage backup via `@supabase/supabase-js` (`db.js` for Hostinger)
- NextAuth + Puck editor
