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
- Auto-configures NextAuth secret/URL and default admin login

Default admin login:

- Email: `admin@mcso.local`
- Password: `MCSOAdmin2026!`

## Local development

```bash
npm install
npm run db:setup
npm run dev
```

Optional: copy `.env.example` and set `SUPABASE_URL` / `SUPABASE_API_KEY` to test Storage sync.

## Stack

- Next.js 15
- Prisma + SQLite (runtime)
- Supabase Storage backup via `@supabase/supabase-js` (`db.js` for Hostinger)
- NextAuth + Puck editor
