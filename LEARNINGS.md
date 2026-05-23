# Build Learnings — Kenilworth Home Mobile

Documented issues from initial build and deploy. Each entry notes what went wrong,
how many attempts it took, and what the fix was. Intended to improve kw-- skills
and Dockerfile templates.

---

## 1. Coolify injects NODE_ENV=production at build time

**Symptom:** `npm ci` silently skipped devDependencies (tailwindcss, typescript,
autoprefixer), causing Next.js build to fail with `Cannot find module 'tailwindcss'`.

**Why it's subtle:** Build works locally because local `npm ci` doesn't have
`NODE_ENV=production` set. The Coolify warning about this is buried in non-error
log output and easy to miss.

**Attempts:** 3. First attempt revealed `@/` path alias error (which masked the
real issue). Second attempt exposed the tailwindcss error. Third attempt fixed it.

**Fix:** Use `npm ci --include=dev` in the builder stage. This installs
devDependencies regardless of `NODE_ENV`.

```dockerfile
RUN npm ci --include=dev
```

Do NOT use `ENV NODE_ENV=development` as a workaround — it causes React's dev-mode
renderer to throw `<Html> should not be imported outside of pages/_document` during
Next.js static page generation.

**Add to:** kw--infra `platforms/coolify.md` and Next.js Dockerfile template.

---

## 2. COPY with shell syntax fails in Docker BuildKit

**Symptom:** `COPY --from=builder /app/public ./public 2>/dev/null || true` fails
with `"/||": not found` in BuildKit. BuildKit parses `|| true` as file path
arguments, not shell syntax.

**Why it's subtle:** This line pattern appears in many Next.js deployment tutorials
and may have worked in older non-BuildKit Docker versions.

**Attempts:** 1 (once build got past the NODE_ENV issue, this was the next failure).

**Fix:** Use `RUN mkdir -p ./public` when the directory may not exist. For optional
copies from another stage, either create the dir in the builder stage first or use
a RUN + shell command:

```dockerfile
# Wrong
COPY --from=builder /app/public ./public 2>/dev/null || true

# Right (if public dir doesn't exist)
RUN mkdir -p ./public

# Right (if public dir may or may not exist)
RUN --mount=type=bind,from=builder,source=/app,target=/build \
    cp -r /build/public . 2>/dev/null || true
```

**Add to:** Next.js Dockerfile template.

---

## 3. @/ path alias fails in Docker Linux (works locally on macOS)

**Symptom:** `Module not found: Can't resolve '@/components/BottomNav'` during
Next.js build in Docker. Exact same code builds fine locally.

**Why it's subtle:** Next.js is supposed to auto-read tsconfig.json paths. On
macOS with a warm `.next/` cache this works. In a clean Linux Docker container
without cache, it doesn't pick up the tsconfig paths.

**Attempts:** 2 (first attempt revealed the alias issue; second fixed it).

**Fix:** Add explicit webpack alias in `next.config.ts`:

```typescript
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
};
```

**Add to:** Next.js Dockerfile template notes and engineer skill.

---

## 4. Coolify can't access private GitHub repos without explicit GitHub App config

**Symptom:** Coolify deploy fails with `could not read Username for
'https://github.com'` (exit code 128). The GitHub App installed on Coolify was not
configured for the private repo.

**Why it's subtle:** Coolify API returns success when registering the app — the
access failure only surfaces at deploy time.

**Fix:** Use a public repo, or configure the Coolify GitHub App to have explicit
repo access. Easiest path for personal projects: public repo.

**Add to:** kw--infra `platforms/coolify.md` — note prominently that the GitHub
App must have access to the repo before registering in Coolify.

---

## 5. Coolify PATCH /applications/:uuid wipes the domain field

**Symptom:** After PATCHing the `git_repository` field, the `domains` field was
cleared (set to `null`). Traefik stopped routing to the app.

**Attempts:** Lost time debugging why the app wasn't responding after what seemed
like a successful update.

**Fix:** When changing major app config (repo URL), delete the app and recreate it
cleanly rather than patching. If patching, always re-send the full config
including `fqdn`/`domains`.

**Add to:** kw--infra `platforms/coolify.md`.

---

## 6. Coolify build log access requires SSH + direct Postgres query

**Symptom:** Coolify API returns `{"message": "Not found."}` for deployment log
endpoints. The API's `/api/v1/deployment/:uuid` endpoint doesn't work reliably.

**Fix:** SSH into VPS and query Postgres directly:

```bash
ssh -i ~/.ssh/epw-apps root@76.13.102.88 "
  docker exec -i coolify-db psql -U coolify -d coolify -t -c \"
    SELECT logs FROM application_deployment_queues
    WHERE deployment_uuid = 'UUID_HERE';
  \"
" | python3 -c "
import sys, json
data = json.loads(sys.stdin.read().strip())
for e in sorted(data, key=lambda x: x.get('order', 0)):
    print(e.get('output', '')[:400])
"
```

SSH key: `~/.ssh/epw-apps`, user: `root`, host: `76.13.102.88`.

**Add to:** kw--infra `platforms/coolify.md` — Debugging section.

---

## 7. macOS sqlite3 CLI encodes special chars as unistr() — not portable

**Symptom:** When dumping a SQLite DB on macOS with `.dump`, any text containing
special characters (em dashes, curly quotes, unicode) is written as
`unistr('—')` etc. better-sqlite3 (and standard SQLite on Linux) doesn't
support the `unistr()` function, so importing the seed fails silently or errors.

**Fix:** Post-process the dump with Python to decode all `unistr()` calls to
literal UTF-8:

```python
import re

def fix_unistr(m):
    inner = m.group(1)
    fixed = inner.encode('utf-8').decode('unicode_escape')
    fixed = fixed.replace("'", "''")
    return f"'{fixed}'"

result = re.sub(r"unistr\('((?:[^'\\]|\\.)*)'\)", fix_unistr, content)
```

**Add to:** kw--infra notes on SQLite seeding / data migration.

---

## 8. 'use server' files can only export async functions

**Symptom:** `A 'use server' file can only export async functions, found object`
at build time when constants (arrays, strings) were exported from a file with the
`'use server'` directive.

**Fix:** Move all non-function exports (constants, types) to a separate file
without the `'use server'` directive (e.g., `src/lib/constants.ts`).

**Add to:** engineer skill — Next.js Server Actions patterns.

---

## 9. Large binary files in git history block GitHub push — even after .gitignore

**Symptom:** `git push` rejected because old commits contained binary files >100MB
(Tauri/Rust build artifacts in `_archive/`). Adding to `.gitignore` only stops
future tracking — it doesn't rewrite history.

**Fix:** Use `git-filter-repo` to rewrite history, removing the paths entirely:

```bash
git filter-repo --path "_archive/path/to/binaries" --invert-paths --force
git remote add origin https://github.com/...
git push --force origin main
```

Note: `git filter-repo` removes the remote tracking ref — re-add remote manually.

**Add to:** engineer skill or general git hygiene notes.

---

## 10. iCloud Drive causes git to hang with many tracked files

**Symptom:** Every git command (status, add, commit) hangs for 5+ minutes when a
directory with thousands of iCloud-synced files is tracked in git. The pre-tool
hook that runs `git status` made every Claude tool call stall.

**Root cause:** iCloud Drive needs to stat each file through its kernel extension,
and with 7,800+ Tauri build artifacts tracked in git, this was O(n) iCloud API
calls per `git status`.

**Fix:** `git rm -r --cached <directory>` to untrack the files, then add to
`.gitignore`. For monorepos on iCloud Drive, be aggressive about `.gitignore`ing
build output directories.

---

## 11. Next.js standalone output requires explicit serverExternalPackages for native modules

**Pattern that works:** For `better-sqlite3` (and any native Node addon) with
Next.js standalone output:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  output: 'standalone',
};
```

Without `serverExternalPackages`, Next.js tries to bundle the native `.node` file
and fails. This is a required config for any app using native addons.

**Add to:** engineer skill — Next.js + SQLite pattern.

---

## 12. Coolify API: use /start not /deploy

**Symptom:** `POST /api/v1/applications/:uuid/deploy` returns `{"message": "Not found."}`.

**Fix:** Use `POST /api/v1/applications/:uuid/start` with `{"force_rebuild": true}`.

This is already in kw--infra/platforms/coolify.md but worth reinforcing.
