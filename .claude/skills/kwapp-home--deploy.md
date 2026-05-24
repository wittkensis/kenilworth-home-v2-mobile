---
triggers: [deploy, redeploy, push, coolify, home deploy, go live]
description: Home deploy — repo, Coolify config, SQLite volume, push-to-deploy flow.
---

# kwapp-home--deploy

## Deploy Flow

```bash
# 1. Build check first
npx tsc --noEmit

# 2. Push triggers Coolify auto-deploy
git push origin main
```

## Coolify Config

| Field | Value |
|-------|-------|
| Repo | `wittkensis/kenilworth-home-v2-mobile` |
| Branch | `main` |
| VPS | `76.13.102.88` |
| URL | `home.ericwittke.com` |

Note: Coolify app UUID not yet recorded — find in Coolify dashboard after first deploy.

## Required Env Vars

| Var | Purpose |
|-----|---------|
| `APP_PASSWORD` | Login password |
| `DATABASE_PATH` | `/data/home.db` (default in Dockerfile) |

## Persistent Volume

SQLite at `/data/home.db` in container, bind-mounted from VPS host.

## Verification After Deploy

1. Visit `https://home.ericwittke.com/login`
2. Log in with `APP_PASSWORD`
3. Confirm all four tabs load (Assets, Contacts, Maintenance, Upgrades)
4. Confirm record creation works in at least one tab

## Critical Docker Patterns

See `LEARNINGS.md` for all documented build/deploy issues.
Key: `npm ci --include=dev`, webpack alias for `@/`, `serverExternalPackages: ['better-sqlite3']`.
