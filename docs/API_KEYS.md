# API Keys & Scraper — The Definitive Setup

> ✏️ Verified line-by-line against the codebase on 2026-10-22. Every key the
> code actually reads is listed here — nothing more, nothing less.
> All keys live **only** in the server `.env` file (see `.env.example`).

---

## 1. The complete list

| Key (env name) | Powers | Required? | Cost |
|---|---|---|---|
| `SUPABASE_URL` + `SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` | Login/auth, contact + audit leads, blog, KMT Link | ✅ **Yes — core site** | Free tier |
| `PAGE_SPEED_API_KEY` | Website Analyzer performance scores + Speed Test tool | ⭐ Strongly recommended (without it: Performance = "N/A", Speed Test errors) | Free (25k/day) |
| `GEMINI_API_KEY` | Kemet AI chatbot | Only for the chatbot | Free tier |
| `CAL_API_KEY` | Booking modal (real slots + bookings) | Only for booking (falls back to WhatsApp without it) | Free |
| **Scraper: Crawlee** | `POST /api/scraper/extract` | Built in | **$0 — no key, self-hosted** |

**Not needed anymore** (no code reads them — delete from any old `.env`):
`APIFY_API_KEY`, `FIREBASE_*`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
(auth is handled by Supabase; Firebase/Apify are abandoned).

---

## 2. The scraper decision: **Crawlee** ✅ (installed & integrated)

**Why Crawlee fits this project:**
- Node.js **library**, not a server → zero extra infrastructure on the 2 vCPU / 8 GB VPS (the box must also run the site and, per the rescue plan, ERPNext later).
- Built by the **Apify team** — it is the open-source engine behind Apify, i.e. the direct like-for-like replacement, minus the $49/mo.
- Anti-blocking fetch (browser-like headers/TLS), retries, request queues; parses with Cheerio, which the codebase already uses.
- Firecrawl was rejected for this setup: it needs Docker + Redis + a Playwright microservice running 24/7 (~1.5 GB RAM idle). Wrong fit here.

**What you got** (`server/services/scraper.js` + `server/routes/scraper.js`):

```
POST /api/scraper/extract
{ "url": "https://example.com" }
→ title, meta description, headings, word count, text sample,
  internal/external links, image stats, forms, structured data,
  contact: { emails[], phones[], socials[] }
```

Rate-limited (10 / 15 min / IP) and SSRF-guarded like the analyzer.
**Use it for:** prospect research before outreach (grab a business's email/phone/socials from their site), pre-audit recon, migration content pulls.
**Upgrade path (only if needed):** add Crawlee's `PlaywrightCrawler` for JavaScript-only sites (`npm i playwright` + browser download ~170 MB, more RAM per crawl). Cheerio mode covers most SMB sites.

Scraping etiquette: single-page extraction for audits/research is fine; for any future bulk crawling, respect `robots.txt` and site terms, keep concurrency low.

---

## 3. Key by key — exactly where to get each

### 3.1 Supabase (required)
1. [supabase.com](https://supabase.com) → your project → **Project Settings → API**
2. Copy: **Project URL** → `SUPABASE_URL` · **anon public** → `SUPABASE_ANON_KEY` · **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
3. 🔁 **Rotate after the leak:** same page → **Reset** the service role secret → update `.env` → restart server.
4. Safety check: Table Editor → each table → **RLS enabled** (the anon key is public-by-design and only safe with RLS on). The service-role key bypasses RLS — server-only, never expose it.

### 3.2 Google PageSpeed (recommended)
1. [console.cloud.google.com](https://console.cloud.google.com) → select/create a project → **APIs & Services → Library** → enable **PageSpeed Insights API**
2. **APIs & Services → Credentials → Create credentials → API key**
3. Click the key → **API restrictions:** "Restrict key" → PageSpeed Insights API only · **Application restrictions:** IP addresses → your **VPS public IP**
4. Put it in `.env` as `PAGE_SPEED_API_KEY=` → restart. Delete the old disabled key.
- Without it the analyzer still works (Performance shows "N/A"); the Speed Test tool needs it.

### 3.3 Google Gemini (chatbot)
1. [aistudio.google.com](https://aistudio.google.com) → **Get API key** → create key → `GEMINI_API_KEY=` in `.env`
2. 🔁 Rotate: delete the exposed key in AI Studio, create a new one. **Keep it a different key from PageSpeed** (one key per service).

### 3.4 Cal.com (booking)
1. [cal.com](https://cal.com) → **Settings → Security → API Keys** → create key → `CAL_API_KEY=` in `.env`
2. Create an event type named **"Free Audit Call"** (calendar connected + working hours set) — the site auto-prefers an event type with "audit" in its name. To force a specific one, set `CAL_EVENT_TYPE_ID=`.
3. Later/self-hosted Cal: point `CAL_API_BASE=` at your instance.

---

## 4. Deploy / refresh on the VPS

```bash
cd /path/to/webkmt
git pull
npm install --omit=dev     # installs crawlee and everything else
nano .env                  # fill in the keys from §3
# restart your server process (pm2 restart webkmt / systemctl restart …)
```

**Smoke tests** (adjust port to your `.env`):

```bash
curl -X POST localhost:8083/api/scraper/extract -H 'Content-Type: application/json' -d '{"url":"https://example.com"}'
curl localhost:8083/api/cal/event-types
curl -X POST localhost:8083/api/mini-apps/seo-analyzer -H 'Content-Type: application/json' -d '{"url":"https://example.com"}'
```

---

## 5. Rules (so October 2026 doesn't repeat)

- Keys live **only** in `.env` — never in code, zip files, chats, or screenshots. (`*.zip` and `.env` are gitignored.)
- One key per service, restricted (API + IP) wherever the provider allows it.
- Keep the GitHub repo **private**; enable **Secret Scanning → Push Protection** (repo Settings → Code security).
- If a key ever leaks: rotate it in the provider dashboard → update `.env` → restart. No code change is ever needed.
