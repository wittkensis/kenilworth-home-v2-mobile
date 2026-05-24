# kenilworth-home — Home Management Mobile App

## What This Is

A personal mobile-first web app for managing home data: assets, contacts, maintenance logs, and upgrade projects. Redesigned from a local Tauri desktop app to a mobile web app accessible from any device.

Live at: `home.ericwittke.com`

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15, App Router, TypeScript strict |
| Database | SQLite via `better-sqlite3` (server-only, WAL mode) |
| Styling | Tailwind CSS |
| Auth | httpOnly cookie (password-protected, personal use only) |
| Deploy | Docker → Coolify VPS (76.13.102.88) → Traefik HTTPS |
| Data persistence | `/data/home.db` bind-mounted from VPS host |

---

## Project Structure

```
src/
  app/
    api/
      auth/login/         POST — sets auth cookie
      auth/logout/        POST — clears auth cookie
      assets/             GET list, POST create; [id]/ GET, PUT, DELETE
      contacts/           GET list, POST create; [id]/ GET, PUT, DELETE
      maintenance/        GET list, POST create; [id]/ GET, PUT, DELETE
      upgrades/           GET list, POST create; [id]/ GET, PUT, DELETE
    assets/               Assets tab page
    contacts/             Contacts tab page
    login/                Login page
    maintenance/          Maintenance tab page
    upgrades/             Upgrades tab page
    globals.css           Tailwind import + mobile resets
    layout.tsx            Root layout
    page.tsx              Redirect → middleware handles
  components/
    BottomNav.tsx         Fixed bottom nav
    Sheet.tsx             Base bottom sheet component
    Field.tsx             Form field component
    assets/               Asset-specific components
    contacts/             Contact-specific components
    maintenance/          Maintenance-specific components
    upgrades/             Upgrade-specific components
  lib/
    db.ts                 better-sqlite3 singleton, WAL mode, schema init
    auth.ts               Auth cookie constants + checkPassword()
    middleware.ts         Route protection + root redirect
    types.ts              All domain types
```

---

## Auth

- Same pattern as Pipeline: httpOnly cookie, raw password comparison
- Middleware protects all routes except `/login` and `/api/auth/*`
- Root redirect handled in middleware to avoid Next.js SSR redirect issues

---

## Docker / Deployment

Same patterns as Pipeline — see LEARNINGS.md for critical Coolify/Docker gotchas:
- `npm ci --include=dev` in builder stage (Coolify sets NODE_ENV=production)
- Explicit webpack alias for `@/` path resolution
- `serverExternalPackages: ['better-sqlite3']` in next.config.ts
- `output: 'standalone'` in next.config.ts
- `public/.gitkeep` must exist

**Repository:** `wittkensis/kenilworth-home-v2-mobile` (GitHub)

---

## Key Learnings

See `LEARNINGS.md` in this directory for documented build/deploy issues and fixes.

---

## Load at session start

Open `.claude/skills/kwapp-home--deploy.md` immediately at every session start.

## Skills

| Trigger | Skill | Purpose |
|---------|-------|---------|
| deploy, push, coolify, go live | `kwapp-home--deploy` | Deploy automation |
