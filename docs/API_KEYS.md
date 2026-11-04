# WEBKMT — API Keys & Deployment Guide (step-by-step)

> Purpose: get **every function of webkmt.com working** and the site **deployed**.
> Verified against the codebase on 2026-11-04. Every key the code actually reads
> is listed here — nothing more, nothing less. All secret keys live **only** in
> the server `.env` file (template: `.env.example`, project root).
>
> How to use: work top to bottom. Sections 2–6 get the keys and accounts,
> Section 7 fills `.env`, Section 8 tests locally, Section 9 deploys,
> Section 10 is the go-live checklist. Estimated time: 1–2 hours (most of it Supabase + DNS wait).

---

## 0. How the site is wired (1 minute)

- **One Node/Express server** (`server/app.js`, port **8083**) serves the static
  site **and** all `/api/*` endpoints. There is no separate frontend host.
- The browser gets its Supabase **public** config from the server at runtime
  (`GET /js/supabase-config.js` is generated from your `.env`), so changing
  `.env` + restarting is enough — no rebuild, no code edits.
- Secret keys (Supabase service role, Gemini, PageSpeed, Cal) are used
  **server-side only**. The browser never receives them.
- Everything degrades gracefully: a missing optional key disables one feature,
  never the whole site. Table in §1 says exactly what happens without each key.

**You need before starting**

- [ ] GitHub access to this repo (keep it **private**)
- [ ] A Google account (Supabase login can use GitHub/Google; PageSpeed + Gemini need Google)
- [ ] A Cal.com account (free) — only if you want the booking modal
- [ ] The VPS (Ubuntu recommended) + SSH access, and DNS control for `webkmt.com`
- [ ] Node.js ≥ 16 locally for testing (20 LTS recommended everywhere)

---

## 1. Complete inventory — every function, service and key

| # | Website function | Service / API | Key (`.env` name) | Required? | If the key is missing |
|---|---|---|---|---|---|
| 1 | Accounts: sign up / sign in / password reset | **Supabase Auth** | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | **Yes (core)** | Auth, leads, blog, KMT Link all fail; static pages still load |
| 2 | Sign in with Google / GitHub buttons | Supabase OAuth providers | OAuth client ID/secret **inside Supabase dashboard** (not `.env`) | Optional | Buttons return an error; email login still works |
| 3 | Contact form, quote form, chatbot lead capture | Supabase table `contacts` via `/api/contact/*` | Same as #1 | **Yes** | Forms show an error; nothing is stored |
| 4 | Newsletter subscribe / unsubscribe | Supabase table `newsletter` | Same as #1 | **Yes** | Subscribe shows an error |
| 5 | Blog (public reading + admin publishing) | Supabase table `blogs` | Same as #1 | **Yes** | Blog/admin features fail |
| 6 | KMT Link bio-link builder + public profiles (`link.webkmt.com/username`) | Supabase table `kmtlink_profiles` | Same as #1 **plus one config snippet (§2.9)** | **Yes** | Builder runs without cloud sync; public profiles don't load |
| 7 | Internal analytics events | Supabase table `analytics_events` | Same as #1 | Automatic | Events are simply not recorded |
| 8 | **AI chatbot** ("WEBKMT Assistant") | **Google Gemini** via `POST /api/gemini-chat` | `GEMINI_API_KEY` (optional `GEMINI_MODEL`) | For AI answers | Chatbot falls back to canned EN/AR answers + WhatsApp handoff |
| 9 | **Booking modal** (real calendar slots) | **Cal.com API v2** via `/api/cal/*` | `CAL_API_KEY` (optional `CAL_EVENT_TYPE_ID`, `CAL_API_BASE`) | For booking | Modal degrades to "Book on WhatsApp" |
| 10 | **Website Analyzer** performance scores | **Google PageSpeed Insights API** | `PAGE_SPEED_API_KEY` | Strongly recommended | Analyzer works, Performance shows "N/A" |
| 11 | **Speed Test** mini-app | PageSpeed Insights API | `PAGE_SPEED_API_KEY` | For this tool | Tool returns an error |
| 12 | Prospect scraper `POST /api/scraper/extract` | Crawlee (self-hosted library) | **None** | Built in | — |
| 13 | Color Palette "AI" suggestions | Colormind API (`colormind.io`) | **None** (free, keyless) | Built in | Falls back to local palette generation |
| 14 | ROI Calculator, Social Scheduler | Pure browser code | **None** | Built in | — |
| 15 | Visitor analytics (GA4) | Google Analytics 4 (`G-KBFEXZKMWV`, in HTML) | No key — measurement ID only | Already wired | — |
| 16 | Fonts, Supabase JS SDK | Google Fonts, jsDelivr CDN | None | Built in | — |
| 17 | WhatsApp buttons everywhere | `wa.me` deep links | None (number `905013617795`) | Built in | — |

**Not needed** (no code reads them — delete from any old `.env`):
`APIFY_API_KEY`, all `FIREBASE_*`, `JWT_SECRET`, `JWT_REFRESH_SECRET`,
`SESSION_SECRET`. Auth is Supabase; Firebase (`dataconnect/`, `firestore.indexes.json`)
is abandoned leftover and can be ignored.

**Email note:** there is **no SMTP/email API to configure for the website itself.**
Contact/quote/newsletter submissions are stored in Supabase (view them in the
site's admin dashboard after signing in as admin, or in Supabase Table Editor).
The only emails sent are Supabase Auth emails (signup confirmation, password
reset), handled in §2.7.

---

## 2. Supabase — the core (do this first)

This powers functions #1–#7. Free tier is enough.

### 2.1 Create the project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Name: `webkmt`. Region: closest to your VPS/audience (e.g. EU Central).
3. Set a strong **database password** and save it in your password manager
   (needed only for direct DB access; the website never uses it).
4. Wait for provisioning (~2 minutes).

> If you already have the existing WEBKMT project (the one referenced in
> `js/supabase-config.js`), you can reuse it — skip to §2.3 and only run §2.2
> if the tables don't exist yet.

### 2.2 Create the database schema

1. Dashboard → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy the **entire file**, paste, **Run**.
3. It creates: enums `user_role`/`user_plan`; tables `profiles`, `blogs`,
   `kmtlink_profiles`, `contacts`, `newsletter`, `mini_app_sessions`,
   `analytics_events`; **RLS enabled on every table** with policies; the
   `is_admin()` helper; and a trigger that auto-creates a profile for every
   new user (**the user who registers with `info@webkmt.com` automatically
   becomes `admin` + `premium`** — remember this for §2.5).
4. Notes: run it **once on a fresh project**. If you re-run it later you will
   get "already exists" errors on the types/tables — that is expected; the
   objects are already there.

### 2.3 Copy the three keys

Dashboard → **Project Settings → API**:

| Dashboard label | `.env` name | Notes |
|---|---|---|
| Project URL | `SUPABASE_URL` | Looks like `https://xxxxxxxxxxxx.supabase.co` |
| `anon` / **publishable** key | `SUPABASE_ANON_KEY` | Public by design — safe in the browser **only because RLS is on** |
| `service_role` / **secret** key | `SUPABASE_SERVICE_ROLE_KEY` | **Bypasses RLS. Server `.env` only. Never in browser code, chats or screenshots** |

Paste them into `.env` (template in §7). You will restart the server later.

### 2.4 Configure Auth URLs (required for login + password reset to work)

Dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://webkmt.com`
- **Redirect URLs** — add all of these:
  - `https://webkmt.com/**`
  - `https://www.webkmt.com/**`
  - `https://link.webkmt.com/**`
  - `http://localhost:8083/**` (local testing)

Dashboard → **Authentication → Providers → Email**:

- Enable Email provider: **ON**
- **Confirm email:** leave **ON** for public signups (recommended). Users who
  register through the website form must click the confirmation link before
  first login. (The server's own `/api/auth/register` route auto-confirms;
  the public website form uses Supabase directly, so this setting applies.)

### 2.5 Create your owner/admin account

1. Start the site (locally is fine, §8) → **Sign In → create account** with
   **`info@webkmt.com`** and a strong password. Confirm via email if prompted.
2. Verify: Supabase → **Table Editor → profiles** → your row must show
   `role = admin`, `plan = premium` (the trigger does this automatically).
3. If the account already existed before the schema was installed, promote it
   manually in SQL Editor:
   ```sql
   update public.profiles set role='admin', plan='premium'
   where email='info@webkmt.com';
   ```
4. This account unlocks: admin blog management, contact/newsletter submission
   tables in the site dashboard, and role assignment (`/api/auth/set-claims`
   only accepts requests from this admin).

### 2.6 (Optional) Enable Google / GitHub sign-in

The auth modal already has the buttons (`js/shared/supabase-auth-manager.js`).
Each provider needs an OAuth app whose callback is your Supabase project:

**Callback URL for both providers:**
`https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`
(the ref is the subdomain of your `SUPABASE_URL`).

**Google:**
1. [console.cloud.google.com](https://console.cloud.google.com) → create/select project.
2. **APIs & Services → OAuth consent screen** → External → app name `WEBKMT`, support email → save.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** → type **Web application** → Authorized redirect URI = the callback URL above → Create.
4. Supabase → **Authentication → Providers → Google** → enable, paste **Client ID** + **Client Secret** → Save.

**GitHub:**
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Homepage URL `https://webkmt.com`, Authorization callback URL = callback above → Register → **Generate a new client secret**.
3. Supabase → **Authentication → Providers → GitHub** → enable, paste Client ID + Secret → Save.

No `.env` change is needed for OAuth — Supabase holds these credentials.

### 2.7 (Optional, recommended later) Custom SMTP for auth emails

Supabase's built-in mailer works with zero setup but is heavily rate-limited
on the free tier (a few emails/hour — fine for launch, not for growth).
When signups grow: Supabase → **Authentication → SMTP Settings** → plug in any
SMTP provider (e.g. your domain mailbox host). No website code or `.env` change.

### 2.8 Safety check (2 minutes, do not skip)

- [ ] Table Editor → every table shows **RLS enabled** (schema does this; verify).
- [ ] Confirm the `service_role` key exists **only** in the server `.env`.
- [ ] Project Settings → API → if any key was ever shared (chat, screenshot,
      old zip), press **Reset** on it now, update `.env`, restart the server.
- [ ] Free-tier reality: Supabase pauses inactive free projects after ~7 days
      without API activity. A live website with any traffic stays awake; if it
      ever pauses, **Restore** it from the dashboard (data is kept).

### 2.9 KMT Link — one extra wiring step (required for function #6)

The two KMT Link pages (`mini-apps/kmtlink-simple.html`,
`mini-apps/kmtlink-public-profile.html`) read their Supabase config from
`window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY`, and nothing currently sets
those globals on those pages. Until you add them, KMT Link runs without cloud
sync and public profiles can't load. Fix (uses the **public** anon key — safe
with RLS on): in **both** files, immediately **before** the
`<script type="module">` that imports `createClient`, add:

```html
<script>
  // Public Supabase config (anon key is public-by-design; RLS protects data)
  window.SUPABASE_URL = 'https://<YOUR_PROJECT_REF>.supabase.co';
  window.SUPABASE_ANON_KEY = '<YOUR_ANON_KEY>';
</script>
```

Also: public profiles are served by the same Node app at
`link.webkmt.com/<username>` (DNS for `link` is covered in §9.3), and the
server's `ALLOWED_ORIGINS` already includes `https://link.webkmt.com`.

> Related: `js/supabase-config.js` (static fallback) contains a previously
> used project URL + anon key. When the site runs through the Node server —
> the supported deployment — the server's dynamic `/js/supabase-config.js`
> route (from `.env`) takes precedence, so **`.env` is the source of truth**.
> If you created a **new** Supabase project in §2.1, also update the two
> fallback constants in `js/supabase-config.js` to match, so any static
> context stays consistent.

---

## 3. Google PageSpeed Insights key (Website Analyzer + Speed Test)

Free, 25,000 requests/day — far more than needed.

1. [console.cloud.google.com](https://console.cloud.google.com) → select or create a project (can be the same one as OAuth).
2. **APIs & Services → Library** → search **PageSpeed Insights API** → **Enable**.
3. **APIs & Services → Credentials → Create credentials → API key**.
4. Click the new key and restrict it (important):
   - **API restrictions:** *Restrict key* → **PageSpeed Insights API** only.
   - **Application restrictions:** *IP addresses* → add your **VPS public IP**
     (and your own IP temporarily if you test from a home server).
5. Copy into `.env` as `PAGE_SPEED_API_KEY=` → restart server.

Used server-side only (`api/mini-apps/seo-analyzer.js`, `speed-tester.js`).
Without it: Analyzer still returns SEO/accessibility results with Performance
"N/A"; Speed Test errors. **Keep this key separate from the Gemini key** —
one key per service, so one leak/quota never breaks both.

---

## 4. Google Gemini key (AI chatbot)

1. [aistudio.google.com](https://aistudio.google.com) → **Get API key** → **Create API key**.
2. Copy into `.env` as `GEMINI_API_KEY=` → restart server.
3. Model: the proxy (`server/routes/gemini-proxy.js`) defaults to
   **`gemini-2.5-flash-lite`** (the old `gemini-1.5-flash-001` was retired by
   Google — already fixed in code). To change models later, set
   `GEMINI_MODEL=<model-id>` in `.env` — no code edit.
4. Cost: AI Studio free tier covers light traffic; if you outgrow it, enable
   billing on that key's Google Cloud project — Flash-Lite is the cheapest tier.
5. The browser only ever calls `POST /api/gemini-chat` on your server; the key
   never reaches the client. If the key is missing/invalid, the chatbot
   automatically uses its built-in EN/AR fallback answers and offers WhatsApp.

---

## 5. Cal.com key (booking modal)

Free. The booking widget (`js/booking.js`) talks only to your server's
`/api/cal/*` proxy (`server/routes/cal.js`, Cal API v2) — never directly to Cal.

1. [cal.com](https://cal.com) → create account → **connect your calendar**
   (Google/Outlook) → set your **working hours / availability**.
2. **Event types → New** → name it **`Free Audit Call`** (the server
   auto-prefers an event type with "audit" in its name), set duration/location
   (e.g. Google Meet), save.
3. **Settings → Security → API Keys → Create** → copy into `.env` as `CAL_API_KEY=`.
4. Optional: `CAL_EVENT_TYPE_ID=<numeric id>` forces one specific event type.
   Self-hosting Cal later? Set `CAL_API_BASE=https://<your-cal>/v2`.
5. Restart the server. How visitors open booking: any element with
   `data-book-call`, the URL `?book=1`, or `window.WebKMTBooking.open()`.
   Without a key (or if Cal is down) the modal degrades to a WhatsApp booking
   prompt, so the CTA never dead-ends.

---

## 6. Services that need **no key** (already working)

- **Scraper (Crawlee)** — `POST /api/scraper/extract` returns title, meta,
  headings, links, images, forms, structured data and
  `contact: { emails[], phones[], socials[] }` from any public page.
  Self-hosted, rate-limited (10/15 min/IP), SSRF-guarded. Chosen because it is
  a *library* (zero extra RAM/services on the VPS) from the Apify team — the
  open-source engine behind Apify, without the subscription. Firecrawl was
  rejected: Docker + Redis + Playwright sidecar ~1.5 GB idle. Upgrade path
  only if needed: Crawlee `PlaywrightCrawler` for JavaScript-only sites.
  Etiquette: single-page audit/research extraction; respect `robots.txt` for
  any future bulk crawling.
- **Colormind** (`colormind.io`) — keyless palette suggestions in the Color
  Palette tool; has a local fallback. Already allowed in the server CSP.
- **Google Analytics 4** — measurement ID `G-KBFEXZKMWV` is embedded in
  `index.html` and the mini-apps. Verify data arrives in
  [analytics.google.com](https://analytics.google.com) → Reports → Realtime
  after launch. To use a different GA4 property later, replace that ID string
  in `index.html` and `mini-apps/*.html` (no `.env` involved).
- **Google Fonts / jsDelivr CDN** — no accounts or keys.
- **WhatsApp** — all buttons are `wa.me/905013617795` deep links. If the
  number ever changes, it lives in `index.html`, `js/booking.js`,
  `js/templates-gallery.js` and the locale files.

---

## 7. `.env` — the complete file

Copy `.env.example` to `.env` in the project root and fill it in:

```ini
PORT=8083
NODE_ENV=production
ALLOWED_ORIGINS=https://webkmt.com,https://www.webkmt.com,https://link.webkmt.com

# Supabase (Section 2) — REQUIRED
SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
SUPABASE_ANON_KEY=<anon/publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service_role/secret key>

# Google PageSpeed (Section 3) — recommended
PAGE_SPEED_API_KEY=<restricted API key>

# Google Gemini (Section 4) — chatbot
GEMINI_API_KEY=<AI Studio key>
# GEMINI_MODEL=gemini-2.5-flash-lite   # optional override

# Cal.com (Section 5) — booking
CAL_API_KEY=<Cal API key>
# CAL_EVENT_TYPE_ID=
# CAL_API_BASE=https://api.cal.com/v2

# Optional tuning
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=100
```

Notes:

- `PORT` — the Express port (default **8083**). Nginx proxies to it (§9.4);
  never expose it directly to the internet.
- `NODE_ENV=production` on the VPS; omit or set `development` locally.
- `ALLOWED_ORIGINS` — comma-separated CORS allowlist. For local testing add
  `http://localhost:8083`. A wrong value here is the #1 cause of
  "works locally, API fails in production" (see §11).
- `.env` is gitignored. Never commit it, zip it, or paste it into chats.

---

## 8. Test locally first (10 minutes)

```bash
git clone <repo-url> webkmt && cd webkmt
npm install
cp .env.example .env     # then fill in the keys (Sections 2–5)
npm start                # = node server/app.js
```

Open `http://localhost:8083`. In the server log you should see
`✅ Supabase connection verified successfully`. A warning instead means the
URL/service key in `.env` is wrong or §2.2 hasn't run (the check queries the
`profiles` table). Then run the quick smoke tests in §10 against
`localhost:8083` before deploying.

---

## 9. Deploy to the VPS (PM2 + Nginx + HTTPS)

This matches `deploy.json` / `ecosystem.config.js` already in the repo.

### 9.1 Prepare the server (Ubuntu)

```bash
# Node.js 20 LTS + PM2 + Nginx + git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

### 9.2 Install the app

```bash
sudo mkdir -p /var/www/webkmt && sudo chown $USER /var/www/webkmt
git clone <repo-url> /var/www/webkmt && cd /var/www/webkmt
npm install --omit=dev
mkdir -p logs
cp .env.example .env && nano .env    # production values from Section 7
```

### 9.3 DNS (at your domain registrar)

Create three **A records** → your VPS public IP:

| Host | Type | Value |
|---|---|---|
| `@` (webkmt.com) | A | `<VPS IP>` |
| `www` | A | `<VPS IP>` |
| `link` | A | `<VPS IP>` (KMT Link public profiles) |

Wait for propagation (`dig +short webkmt.com` should return the IP).

### 9.4 Nginx reverse proxy

`/etc/nginx/sites-available/webkmt`:

```nginx
server {
    listen 80;
    server_name webkmt.com www.webkmt.com link.webkmt.com;
    client_max_body_size 6m;

    location / {
        proxy_pass http://127.0.0.1:8083;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

(The app sets `trust proxy`, so rate limiting sees real visitor IPs through Nginx.)

```bash
sudo ln -s /etc/nginx/sites-available/webkmt /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 9.5 HTTPS (free, Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d webkmt.com -d www.webkmt.com -d link.webkmt.com
sudo certbot renew --dry-run    # verifies auto-renewal
```

### 9.6 Start with PM2 (and survive reboots)

```bash
cd /var/www/webkmt
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup        # run the command it prints (with sudo)
pm2 logs webkmt    # expect: Supabase connection verified
```

### 9.7 Firewall

```bash
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
```

Do **not** open 8083 — Nginx is the only public entry point.

### 9.8 Updating later

```bash
cd /var/www/webkmt
git pull
npm install --omit=dev
# edit .env here if keys changed/rotated
pm2 reload webkmt
```

Key rotation never needs a code change: dashboard → new key → `.env` → `pm2 reload webkmt`.

---

## 10. Go-live smoke-test checklist

Run against `https://webkmt.com` (or localhost first). Every row = one function from §1.

- [ ] **Health:** `curl https://webkmt.com/api/health` → `{"status":"healthy",...}`
- [ ] **Pages:** `/`, `/templates`, `/case-study.html?id=1` load; Arabic toggle works (RTL)
- [ ] **Sign up / sign in:** create a test account → row appears in Supabase `profiles`
- [ ] **Admin:** sign in as `info@webkmt.com` → blog admin + submission tables visible; `role=admin` in `profiles`
- [ ] **Password reset:** request reset → email arrives → link lands on the site → new password works
- [ ] **OAuth (if §2.6 done):** Google/GitHub buttons complete the round-trip back to the site signed in
- [ ] **Contact form:** submit → row in Supabase `contacts`
- [ ] **Quote form:** complete all steps → row in `contacts` (check its payload/type)
- [ ] **Newsletter:** footer subscribe → row in `newsletter`; duplicate email handled politely
- [ ] **Chatbot:** ask "What does WEBKMT Chat cost?" → real AI answer with approved prices (if you get a generic fallback, check `GEMINI_API_KEY`/model — §11)
- [ ] **Booking:** open `https://webkmt.com/?book=1` → real slots load → test booking → event appears in Cal.com + invite email arrives
- [ ] **Website Analyzer:** analyze `https://example.com` → Performance score is a number (not "N/A")
- [ ] **Speed Test:** run a test → results render (needs PageSpeed key + IP restriction includes the VPS)
- [ ] **Scraper:** `curl -X POST https://webkmt.com/api/scraper/extract -H 'Content-Type: application/json' -d '{"url":"https://example.com"}'` → JSON with title/headings/contact fields
- [ ] **KMT Link:** create a profile in the builder → visit `https://link.webkmt.com/<username>` → public profile renders (needs §2.9 + `link` DNS/SSL)
- [ ] **Other tools:** Color Palette, ROI Calculator, Social Scheduler open and work (no keys involved)
- [ ] **GA4:** analytics.google.com → Realtime shows your visit
- [ ] **HTTPS:** all three hosts (`webkmt.com`, `www`, `link`) serve valid certificates, HTTP redirects to HTTPS

---

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Boot log: "Supabase connection check failed" | Wrong `SUPABASE_URL`/service key, or schema not run | Re-copy keys (§2.3); run `supabase/schema.sql` (§2.2); restart |
| Login works locally, fails on domain | Supabase redirect URLs missing your domain | Add `https://webkmt.com/**` etc. (§2.4) |
| Browser console: CORS error on `/api/*` | `ALLOWED_ORIGINS` doesn't include the exact origin (scheme + host) | Fix `.env`, restart (§7) |
| Users can sign up but never confirm | Confirmation emails rate-limited (free built-in mailer) | Wait/retry, or add custom SMTP (§2.7); check Spam |
| Chatbot only gives generic answers | `GEMINI_API_KEY` missing/invalid, quota, or wrong `GEMINI_MODEL` | Check `pm2 logs`; test key in AI Studio; unset `GEMINI_MODEL` to use the default |
| Analyzer Performance = "N/A", Speed Test errors | `PAGE_SPEED_API_KEY` missing, API not enabled, or IP restriction excludes the VPS | §3 steps 2–4; add the VPS's **public outbound** IP |
| Booking shows WhatsApp fallback | `CAL_API_KEY` missing/invalid, no event type, no availability | §5 steps 1–3; test `curl localhost:8083/api/cal/event-types` on the server |
| KMT Link public profile blank | §2.9 snippet not added, profile not public, or `link` DNS/SSL missing | Add snippet; set `is_public=true`; check DNS (§9.3) + cert (§9.5) |
| Site updated but visitors see old version | Service worker / browser cache (`sw.js`, 1-day static cache) | Hard-refresh (Ctrl+F5); cache clears within a day for everyone else |
| `pm2 logs` shows port 8083 in use | Another process/an old PM2 app on the port | `pm2 list`; `sudo lsof -i :8083`; stop the offender or change `PORT` + Nginx `proxy_pass` together |
| Everything worked, then database errors after quiet days | Supabase free project auto-paused | Dashboard → **Restore** project (§2.8) |

---

## 12. Security rules (so the October 2026 leak doesn't repeat)

- Keys live **only** in `.env` — never in code, zip files, chats, or screenshots. (`.env` and `*.zip` are gitignored — keep it that way.)
- One key per service, restricted (API + IP) wherever the provider allows it.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security: treat it like a root password. The `anon` key in browser code is fine **only** because RLS is enabled on every table.
- Keep the GitHub repo **private**; enable **Secret Scanning → Push Protection** (repo Settings → Code security).
- If a key ever leaks: rotate it in the provider dashboard → update `.env` → `pm2 reload webkmt`. No code change is ever needed.
- The admin of the whole site is the `info@webkmt.com` account — protect that mailbox and password accordingly (unique password, 2FA on the mailbox).

---

## Appendix A — API endpoint map (your server)

| Endpoint | Purpose | Auth |
|---|---|---|
| `GET /api/health` | Health check | Public |
| `POST /api/auth/register` · `/verify` · `/reset-password` · `PUT /api/auth/profile` · `DELETE /api/auth/user` · `POST /api/auth/set-claims` | Account lifecycle (most day-to-day auth goes browser → Supabase directly) | Mixed (admin for set-claims) |
| `POST /api/contact/submit` · `/quote` | Contact + quote-form leads → `contacts` | Public |
| `POST /api/contact/newsletter` · `/newsletter/unsubscribe` | Newsletter → `newsletter` | Public |
| `GET/PUT /api/contact/submissions` | Admin lead management | Admin |
| `POST /api/gemini-chat` | Chatbot → Gemini proxy | Public (rate-limited) |
| `GET /api/cal/event-types` · `GET /api/cal/slots` · `POST /api/cal/bookings` | Booking via Cal.com | Public |
| `POST /api/mini-apps/seo-analyzer` · `/speed-test` | Analyzer tools (PageSpeed) | Public (rate-limited) |
| `POST /api/scraper/extract` | Single-page extraction (Crawlee) | Public (rate-limited) |
| `POST /api/analytics/pageview` · `/event` · `/performance` · `GET /api/analytics/summary` | Internal events → `analytics_events` | Public insert / admin read |
| `/api/data/*` | Authenticated generic table access | Bearer token required |
| `POST /api/errors` | Client error-report stub (no-op) | Public |

## Appendix B — Where each integration lives in code

| Integration | Files |
|---|---|
| Server bootstrap, CSP, dynamic Supabase config | `server/app.js`, `server/config/supabase.js` |
| Browser Supabase client (static fallback) | `js/supabase-config.js` |
| Auth UI + Google/GitHub OAuth | `js/shared/supabase-auth-manager.js`, `js/auth-ui.js`, `server/routes/auth.js` |
| Contact / quote / newsletter | `js/forms-enhanced.js`, `js/chatbot.js` (lead capture), `server/routes/contact.js` |
| Chatbot | `js/chatbot.js`, `server/routes/gemini-proxy.js` |
| Booking | `js/booking.js`, `server/routes/cal.js` |
| Analyzer / Speed Test | `mini-apps/website-analyzer.html`, `api/mini-apps/{routes,seo-analyzer,speed-tester}.js` |
| Scraper | `server/services/scraper.js`, `server/routes/scraper.js` |
| KMT Link | `mini-apps/kmtlink-simple.html`, `mini-apps/kmtlink-public-profile.html`, `/:username` in `server/app.js` |
| Database schema / RLS / admin trigger | `supabase/schema.sql` |
| GA4 | `index.html` (+ mini-apps) |
| Deployment | `deploy.json`, `ecosystem.config.js`, `.env.example` |
