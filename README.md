# Sonic Packaging — Web Platform

Next.js 16 + PostgreSQL (Prisma) monorepo serving both the public site
(`sonicpackaging.com`) and the admin CMS (`admin.sonicpackaging.com`) from
one codebase. Locally, and until the two domains are configured, the admin
is reached at `/admin` directly.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- PostgreSQL via Prisma ORM 7 (driver adapters — no native binary engine)
- Hand-rolled session auth (`jose` JWT, HttpOnly cookie) — not NextAuth
- Vercel Blob for file storage (media library, form attachments, CVs)

## 1. Prerequisites

- Node.js 20+
- A PostgreSQL database — [Neon](https://neon.tech) (free tier) is what
  these instructions assume; any Postgres works.
- A [Vercel](https://vercel.com) account, for deployment and Blob storage.

## 2. Environment variables

Copy `.env.example` to `.env` and fill in real values:

| Variable | Where it comes from |
|---|---|
| `DATABASE_URL` | Neon project → **Connection Details** → the **pooled** connection string (has `-pooler` in the hostname) |
| `SESSION_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | The public site's URL |
| `NEXT_PUBLIC_ADMIN_URL` | The admin site's URL |
| `BLOB_READ_WRITE_TOKEN` | Added automatically when you attach Vercel Blob to the project (see below) |
| `ZOHO_*` | Optional — leave blank to run with CRM sync disabled |
| `SEED_SUPER_ADMIN_*` | The first admin account's name/email/password, used only by the seed script |

## 3. Local development

```bash
npm install
npx prisma generate      # generates the Prisma client into src/generated/prisma
npx prisma migrate dev   # creates the database tables
npx prisma db seed       # loads confirmed starting content + the first admin user
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin` to sign in with the `SEED_SUPER_ADMIN_EMAIL`
/ `SEED_SUPER_ADMIN_PASSWORD` you set in `.env`.

## 4. Deploying to Vercel

1. Push this repository to GitHub (if you're reading this after that step,
   it's already done).
2. In Vercel: **Add New → Project** → import the GitHub repo.
3. **Storage** tab → **Create Database** → **Blob** → connect it to this
   project. This automatically sets `BLOB_READ_WRITE_TOKEN`.
4. **Settings → Environment Variables** → add everything from the table
   above except `BLOB_READ_WRITE_TOKEN` (step 3 already set it).
5. Deploy. The first build runs `npx prisma generate` automatically as
   part of `npm install` (see `package.json`'s `postinstall` script) —
   this only works because Vercel's build environment has normal internet
   access.
6. Once deployed, run the database migration and seed once, from your own
   machine, pointed at the same `DATABASE_URL` Vercel is using:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
7. Visit the deployed URL, and `/admin` to sign in.

### Two domains, one deployment

`src/proxy.ts` rewrites requests to the `admin.` hostname to `/admin`
internally, so one Vercel deployment serves both. Once you're ready to
attach real domains: add both `sonicpackaging.com` and
`admin.sonicpackaging.com` under the Vercel project's **Domains** tab,
and update `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ADMIN_URL` to match.

## 5. What's confirmed vs. placeholder

Any content not yet confirmed by Sonic Packaging is marked internally
with `[CEO CONFIRMATION REQUIRED]` rather than invented. It's visible
site-wide while `PRODUCTION_MODE` (a site setting, off by default) is
off, and is automatically hidden from visitors once it's switched on —
switch it on only once everything currently marked has been resolved.
