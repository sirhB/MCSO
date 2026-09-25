# MCSO Security Group Website

Marketing site and admin CMS for Michael Colon Security Organization LLC, rebuilt from [CaLoFa/MSCO](https://github.com/CaLoFa/MSCO).

## Features

- Marketing homepage with hero, owner story, services, image gallery, and working consultation form
- **Wix-like drag-and-drop site editor** (Puck) — add/reorder blocks, edit text and images, save draft, publish
- Admin dashboard with inquiry pipeline + flowchart, contact book, and gallery uploads
- Auth-protected `/admin` area

## Quick start

```bash
npm install
npm run db:setup
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Default admin (from `.env`):

- Email: `admin@mcso.local`
- Password: `MCSOAdmin2026!`

## Production database (Postgres)

Local development uses SQLite (`DATABASE_URL="file:./dev.db"`).

For Vercel + Neon/Supabase:

1. Create a Postgres database and copy the connection string
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`
3. Set `DATABASE_URL` (and `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_*`) in Vercel env vars
4. Run `npx prisma db push && npm run db:seed` against production (or use migrations)

## Stack

- Next.js 15 (App Router)
- Prisma + SQLite (dev) / PostgreSQL (prod)
- NextAuth credentials
- Puck visual page builder (`@puckeditor/core`)
