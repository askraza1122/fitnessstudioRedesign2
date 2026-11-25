# syntax=docker/dockerfile:1

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Generate the Prisma client from the production (PostgreSQL) schema.
# The Docker build does not need a live database for this step.
RUN npx prisma generate
RUN npm run build

# ---- run ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma: client engine + schema/migrations, so `prisma migrate deploy` can
# run against this image (Coolify: run it once on deploy, before starting).
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# seed.ts imports ../lib/data — the lib dir must exist in the runner too.
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
# .bin shims (npx prisma / npx tsx) and the tsx runner itself.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/esbuild ./node_modules/esbuild
# esbuild needs its platform binary (optional dep) or tsx crashes at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@esbuild ./node_modules/@esbuild
# Prisma CLI + tsx (seed runner) need their full production dependency
# closure in the runner image. List computed from the installed
# node_modules (prisma + tsx + bcryptjs, production deps only).
# If a dependency is added/removed, recompute this list — a missing
# package makes `npx prisma` fail at deploy time with
# "Cannot find module '<pkg>'".
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@standard-schema/spec ./node_modules/@standard-schema/spec
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/anymatch ./node_modules/anymatch
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/binary-extensions ./node_modules/binary-extensions
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/braces ./node_modules/braces
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/c12 ./node_modules/c12
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/chokidar ./node_modules/chokidar
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/citty ./node_modules/citty
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/confbox ./node_modules/confbox
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/consola ./node_modules/consola
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/deepmerge-ts ./node_modules/deepmerge-ts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/defu ./node_modules/defu
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/destr ./node_modules/destr
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/effect ./node_modules/effect
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/empathic ./node_modules/empathic
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/exsolve ./node_modules/exsolve
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/fast-check ./node_modules/fast-check
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/fill-range ./node_modules/fill-range
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/giget ./node_modules/giget
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/glob-parent ./node_modules/glob-parent
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/is-binary-path ./node_modules/is-binary-path
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/is-extglob ./node_modules/is-extglob
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/is-glob ./node_modules/is-glob
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/is-number ./node_modules/is-number
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/jiti ./node_modules/jiti
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/node-fetch-native ./node_modules/node-fetch-native
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/normalize-path ./node_modules/normalize-path
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/nypm ./node_modules/nypm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/ohash ./node_modules/ohash
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pathe ./node_modules/pathe
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/perfect-debounce ./node_modules/perfect-debounce
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/picomatch ./node_modules/picomatch
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pkg-types ./node_modules/pkg-types
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/pure-rand ./node_modules/pure-rand
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/rc9 ./node_modules/rc9
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/readdirp ./node_modules/readdirp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/tinyexec ./node_modules/tinyexec
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/to-regex-range ./node_modules/to-regex-range
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
