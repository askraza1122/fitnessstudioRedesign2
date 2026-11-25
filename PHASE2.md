# Fitness Studio — Phase 2: LMS (courses, login, manual unlock, admin)

Phase 1 (website, shop, geo-pricing) is untouched in behaviour — all Phase 1
pages still work the same way. Phase 2 adds accounts, course lectures, a
manual enrollment/unlock flow and an admin panel. There is **no payment
gateway yet** (Phase 3) and **no real lecture videos yet** (upload them from
the admin panel when the client supplies them).

## What was built

- **Auth** — Auth.js v5 (`next-auth@beta`) with a Credentials provider and JWT
  sessions. Roles: `student` and `admin`. Pages: `/login`, `/register`
  (name, email, phone, password). The header shows Login / My Courses /
  Admin / Log out according to the session.
- **Database** — Prisma + PostgreSQL (production schema in
  `prisma/schema.prisma`). Models: User, Course, Lecture, Enrollment,
  LectureProgress, Order. Roles/statuses/tiers are plain Strings (no Postgres
  enums) so the models stay portable.
- **Seed** — `prisma/seed.ts` creates the admin (from env, see below) and the
  6 courses from `lib/data.ts` (PROGRAMS), each with **8 lecture slots**
  ("Lecture 1" … "Lecture 8", 2 per week over 4 weeks), no video URL.
  Lectures 1–3 are free (`isFree = true`); 4–8 are locked until unlock.
- **Student dashboard** — `/dashboard`: my enrollments with status, continue
  learning, available courses.
- **Learning pages** — `/learn/[courseSlug]` (lecture list with lock icons;
  free lectures playable by any logged-in user) and
  `/learn/[courseSlug]/[lectureOrder]` (plain `<video controls>` player for
  the Bunny CDN URL, "Video coming soon" state when no video yet, prev/next
  navigation, mark-as-complete per user).
- **Enrollment flow** — on each program detail page, the existing WhatsApp
  Enroll button is unchanged. Additionally, a logged-in student can
  "Request enrollment" choosing a tier (one-to-one / group of 5 / home
  trainer; KSA → flat 200 SAR, UAE → flat 200 AED, otherwise PKR tiers —
  same geo-pricing logic as Phase 1). The request creates an Enrollment with
  status `requested`. Unauthenticated users are sent to `/login`.
- **Admin panel** — `/admin` (admin role only; others are redirected):
  Overview counts (students, pending enrollments, orders, lectures without
  video); Students (list + search by name/email); Enrollments (filter by
  status; mark paid / unlock / reject); Lectures (per-course list; edit
  title/description/order; paste a Bunny CDN URL or upload a file to Bunny
  Storage); Orders (COD shop orders with status new/confirmed/delivered/
  cancelled); Products (the 4 shop products, read-only — see note below).
- **Orders** — the cart COD checkout still opens WhatsApp as before, and now
  also saves the order to the database (total computed server-side from the
  product catalogue). A failed save never blocks the WhatsApp checkout.
- **Access rules** — lectures 1–3 playable when logged in; lectures 4+
  require an `unlocked` enrollment for that course; admin bypasses all
  locks; unauthenticated visitors to a lecture page are redirected to
  `/login`; non-admin users hitting `/admin` are redirected to `/dashboard`.
  The geo middleware (`middleware.ts`) is untouched — Auth.js middleware is
  deliberately NOT used, so the two can never conflict.

## Env vars

| Var | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string in production (Coolify Postgres service), e.g. `postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public`. Local dev fallback: `file:./dev.db` (SQLite, see below). |
| `AUTH_SECRET` | yes | Generate with `openssl rand -base64 32`. |
| `AUTH_URL` | yes (production) | Canonical public URL of the site, e.g. `https://www.fitnessstudiopk.com`. Auth.js rejects all logins with `UntrustedHost` in production builds without it (or `AUTH_TRUSTED_HOST=true`). Local dev: `http://localhost:3000`. |
| `ADMIN_EMAIL` | for seed | Admin account email. Seed refuses to create an admin without it. |
| `ADMIN_PASSWORD` | for seed | Admin account password. Strong value, never committed. Seed refuses without it. |
| `BUNNY_STORAGE_PASSWORD` | for uploads | Bunny Storage zone password. Without it, file upload shows "configure BUNNY_STORAGE_PASSWORD in Coolify env" instead of failing silently; pasting a Bunny CDN URL still works. |
| `BUNNY_STORAGE_ZONE` | no | Storage zone name, default `FitnessStudio`. |
| `BUNNY_CDN_HOST` | no | Pull-zone hostname, default `<zone>.b-cdn.net` (i.e. `FitnessStudio.b-cdn.net`). |

See `.env.example`. Never commit a real `.env`.

## Production deploy (Coolify)

1. Add a Postgres service in Coolify and set `DATABASE_URL` on the app.
2. Set `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `BUNNY_STORAGE_PASSWORD` (+ `BUNNY_STORAGE_ZONE` if different).
3. Build: the Dockerfile runs `npx prisma generate` (production Postgres
   schema) before `npm run build`.
4. Apply migrations once (before first start, and after any schema change):
   `npx prisma migrate deploy`
   (migrations live in `prisma/migrations/`; `0001_init` covers all Phase 2
   models).
5. Seed once: `npx prisma db seed` (creates the admin + 6 courses × 8
   lectures; safe to re-run — it upserts). Then **rotate/remove the admin
   password from wherever it was stored** if it was shared.
6. Start the app (`node server.js`, port 3000). No extra services needed.

## Local dev (no Postgres in this sandbox)

The committed schema is PostgreSQL. For local dev/verification without a
Postgres server, a dev-only SQLite schema is provided at
`prisma/schema.dev.prisma` (same models, `provider = "sqlite"`). It is NOT
the production schema — never point the production schema at SQLite.

```bash
cp .env.example .env        # then fill in AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run db:generate:dev     # prisma generate --schema=prisma/schema.dev.prisma
npm run db:push:dev         # prisma db push --schema=prisma/schema.dev.prisma
npm run db:seed             # tsx prisma/seed.ts (creates admin + courses)
npm run dev                 # http://localhost:3000
```

Note: a local PostgreSQL install was attempted in the sandbox (apt install
succeeded) but a VM/service restart wiped all system packages outside the
home directory, so local verification used the SQLite dev fallback above.
The production path (Postgres schema + `migrate deploy`) was verified
offline by generating the migration SQL from the Postgres schema (see
Verification) — it has NOT yet been run against a live Postgres; run
`prisma migrate deploy` on Coolify before first start and confirm the seed
runs there.

## Manual unlock flow (for the studio)

1. Student requests enrollment from a program page (status `requested`).
2. Student pays by JazzCash / Easypaisa / bank transfer and shares the
   receipt on WhatsApp (payment methods to confirm with the client).
3. Admin opens `/admin` → Enrollments → the request → **Mark paid**, then
   **Unlock course**.
4. Lectures 4–8 of that course become playable for that student immediately.
   (Lectures 1–3 were already playable once logged in.)

## Lecture videos (Bunny CDN)

- Videos live on Bunny CDN (`FitnessStudio.b-cdn.net`). In `/admin` →
  Lectures, each lecture accepts (a) a pasted Bunny CDN URL, or (b) a file
  upload — the upload goes to Bunny Storage via the Bunny Storage API
  (`BUNNY_STORAGE_PASSWORD` + `BUNNY_STORAGE_ZONE`) and the CDN URL is saved
  on the lecture. Nothing is stored on the app server's filesystem.
- Upload limit: 1 GB per file. If the storage password is missing, the upload
  button reports the missing env var instead of failing silently.

## Verification (local, SQLite dev DB)

Verified 2026-11-14 against the production build (`npm run build` passes;
server `node .next/standalone/server.js` on localhost:3000) with the
automated script `~/workspace/fitness-studio-project/tmp-e2e-phase2.mjs`
(run: `E2E_ADMIN_PASSWORD=<dev admin password> node tmp-e2e-phase2.mjs`).
**37/37 checks passed**, including the full flow end to end:

- **Phase 1 intact:** home, program detail (SA cookie → "200 SAR" + "Prices
  shown for Saudi Arabia"; AE → "200 AED"; PK → PKR tiers Rs 15,000 /
  5,000 / 30,000), shop, about, programs list, achievements, MoU partners,
  media, contact, cart, product page — all 200. WhatsApp Enroll button still
  present; geo middleware still sets the `fs-region` cookie.
- **Guards:** `/dashboard`, `/admin`, `/learn/self-defense` logged out → 307
  to `/login`; `/api/enrollments` logged out → 401.
- **Auth:** register 201; duplicate email 409; wrong password rejected;
  student + admin login via the Auth.js credentials flow (session cookie).
- **Enrollment:** student requests self-defense (one-to-one) → 201,
  `status=requested`, `currency=PKR`, `tier=one_to_one`.
- **Learning:** lecture list shows free lectures + locked 4–8; lecture 1
  playable with "Video coming soon"; lecture 4 locked (no `<video>`);
  progress on unknown lecture → 404.
- **Admin:** student hitting `/admin` → redirected to `/dashboard`; student
  PATCH on admin enrollment → 403; admin panel 200; enrollments list shows
  the pending request; mark paid → 200; unlock → 200.
- **Unlock effect:** after unlock, lecture 4 becomes playable for the
  student and the dashboard shows "Enrolled — full access".
- **Lectures admin:** lectures tab lists Lecture 1–8; PATCH on unknown
  lecture → 404; pasting a Bunny CDN URL saves it and the lecture page then
  renders `<video src="https://FitnessStudio.b-cdn.net/...">`; upload
  without `BUNNY_STORAGE_PASSWORD` → 503 with the exact message "Bunny
  Storage is not configured. Set BUNNY_STORAGE_PASSWORD (and
  BUNNY_STORAGE_ZONE) in Coolify env to enable uploads."
- **Orders:** COD order saved → 201, total computed server-side (2× Rs 1,800
  + 1× Rs 1,200 = Rs 4,800); appears in the admin orders list.
- **Progress:** mark lecture complete → 200; learn list then shows
  "Completed".
- **Seed:** refuses with exit 1 and the exact "what to set" message when
  `ADMIN_EMAIL`/`ADMIN_PASSWORD` are absent (verified with `.env` moved
  away); seeds admin + 6 courses × 8 lectures (1–3 free) when set.
- **Migration:** `prisma/migrations/0001_init/migration.sql` generated
  offline from the Postgres schema (`migrate diff --from-empty
  --to-schema-datamodel`) — creates all 6 tables with the unique
  constraints; `migration_lock.toml` pins `provider = "postgresql"`.

Sandbox gotchas encountered (local dev only — do not affect Coolify):
- This sandbox has no Postgres/Docker; a local `apt install postgresql`
  succeeded but a VM/service restart wiped all system packages outside
  `~`, so verification used the SQLite dev fallback (`schema.dev.prisma`).
- `npm install` pulled Prisma **8.0.0-rc.33**, whose CLI has no `generate` /
  `migrate deploy` / `db push` commands — pinned to **Prisma 6.19.3**
  (classic CLI, matches this doc).
- Prisma's engine downloads from `binaries.prisma.sh` fail in this sandbox
  (Node's downloader gets TLS disconnects through the egress proxy, while
  curl works). Workaround used: engines downloaded with curl into
  `~/.cache/prisma/...` and served from a local mirror
  (`~/workspace/tmp/prisma-mirror`, python http.server on 127.0.0.1:8931)
  via `PRISMA_ENGINES_MIRROR=http://127.0.0.1:8931`. Coolify/Docker builds
  have normal network access and do not need this.
- A relative SQLite `DATABASE_URL=file:./dev.db` resolves against the
  generated client's directory at runtime, so the standalone server opened
  an empty DB next to the client. Local `.env` now uses an **absolute**
  path (`file:/home/hatch/.../app/prisma/dev.db`). Postgres URLs are
  unaffected.
- The standalone server loads `.env` from `.next/standalone/.env` (copied
  at build time), not from the app dir — after changing `.env`, copy it
  there and restart (`cp .env .next/standalone/.env`). Coolify injects env
  vars directly, so this only matters for local standalone runs.
- `npm run dev` loads `.env` from the app dir normally; the copy step is
  only for `node .next/standalone/server.js`.

## What is NOT done

- **No payment gateway (Phase 3).** Enrollment is request → manual payment
  → admin unlock. No auto-unlock, no online payment.
- **No real lecture videos yet.** All 48 lecture slots are titled
  "Lecture 1" … "Lecture 8" with no video — upload real videos from the
  admin panel when the client supplies them. No lecture content was invented.
- **Products are read-only in the admin panel.** The 4 shop products are
  listed with prices; editing price/name there is intentionally not wired
  up, because the shop catalogue lives in code (`lib/data.ts`) and an
  admin-side edit would drift from it. If product editing is wanted, the
  products should move into the database (small Phase 3 candidate).
- **No lecture reorder drag-and-drop** — the order number is editable per
  lecture (two lectures in one course cannot share an order number).
- **Not verified yet:** live-browser click-through (verification was via
  curl + API calls, which is how the flows above were exercised); real Bunny
  upload (no storage password in this sandbox — the 503 path was verified,
  the success path was not); Postgres on Coolify (`migrate deploy` + seed
  still to run there); live IP→region detection (unchanged from Phase 1,
  same ip-api.com caveat).
