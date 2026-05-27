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
| App UUID | `fzjdvrkwpftvgdvoutpqrkvw` |
| Repo | `wittkensis/kenilworth-home-v2-mobile` |
| Branch | `main` |
| VPS | `76.13.102.88` |
| URL | `home.ericwittke.com` |

Manual deploy trigger (if the push webhook doesn't fire — it didn't on 2026-05-27):
```bash
curl -s -X POST -H "Authorization: Bearer 1|NwjnoGLmdEqtTR5YSI5NByst0SLZyeOWPpgKFRVwa1954ae1" \
  "http://76.13.102.88:8000/api/v1/deploy?uuid=fzjdvrkwpftvgdvoutpqrkvw"
```

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
