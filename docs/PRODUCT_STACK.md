# WebKMT Product Stack — The 5 Products (frozen v3)

> ✏️ Easily edited — names/prices marked ✏️ are yours to change.
> Companions: [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) (component licenses) · [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) (offers & pricing) · [`ERP_PRODUCT.md`](./ERP_PRODUCT.md) (Business OS spec) · [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md) · [`API_KEYS.md`](./API_KEYS.md)
>
> **What WebKMT sells — five owned, ready-to-run business systems**, assembled from open-source, white-labeled, customized per client, cloned from golden templates (never rebuilt from scratch):
> **① ERP** (Odoo-class) · **② E-commerce** · **③ Customer-service & client-acquisition AI** (chat + WhatsApp) · **④ Template websites with client-managed CMS** · **⑤ Full-scale marketing suite** (email, social scheduling, unified conversations, social intelligence & sentiment, competitor tracking, automations).
> The OCR and workflow tools are **modules inside these five** — not separate products (§3 mapping).
>
> **v3 changes:** restructured around the 5 products above · dev-on-PC/host-on-VPS (§1) · every product passes **the product test**: *name the person, name their painful Tuesday-afternoon moment, demo the fix in 60 seconds* — or it's a feature, not a product.

---

## 1. Architecture principles (apply to all 5 products)

| Principle | The rule |
|---|---|
| **Open-source only** | Permissive (MIT/Apache/BSD) inside anything client-branded. GPL = whole systems delivered as-is (ERPNext, Mautic). AGPL/SUL/source-available = unmodified internal engines, never presented as "the product." |
| **White-label** | The customer-facing surface is always *yours/the client's* brand. Vendor consoles (Dify, n8n, Chatwoot, Postiz, listmonk) are staff-only or hidden behind your gateway/UIs. Per-component verdicts in §7. |
| **Customizable** | Customization = parameters, not forks: themes/tokens, KB & documents, prompt/rule variables, data schemas, module toggles, locales. The golden artifact stays identical across clients. |
| **Easy deployment** | Develop on your **PC** (Docker Compose per product) → golden artifacts in **Git** → deploy by promotion (local → VPS demo → client production: same compose, client `.env`). Nothing is developed on a server. |
| **Maintainable** | One engine per job · pin every version · upgrade on PC first, then promote · per-product RUNBOOK + clone checklist · monitoring/backups on hosting tier · quarterly upgrade cadence under care plans. |

### Where things run
- **Your PC = factory floor.** Docker Compose stacks per product (start only what you're building), seed/demo data (fake clinic, sample invoices, demo catalog), Cloudflare Tunnel for webhooks during dev (WhatsApp/payments/Cal callbacks).
- **VPS = hosting tier 1 (deploy-only).** Coolify hosts public demos + the first batch of clients from Git artifacts; Uptime Kuma + R2 backups here. Fully replaceable from repo + backups.
- **Scale-out (later):** more VPS capacity or client-owned VPS/on-prem — same artifacts, new home.

### Deployment units (shared vs per-client — decided per component)
| Component | Unit | Why |
|---|---|---|
| ERPNext | **Shared bench, site per client** | Native multi-tenancy; lowest cost/client |
| Bagisto · Payload CMS · Mautic | **Instance per client** | Single-tenant by design; isolation + per-client branding |
| Dify | **Shared, 1 workspace** (app per client) | License: no multi-tenant operation; API-only behind gateway |
| Chatwoot · Evolution API · Postiz | **Shared instance** (account / number-instance / workspace per client) | Built for it; run Postiz **unmodified** (AGPL) |
| n8n · doc-intel · intel collectors · gateway | **Shared (yours)** | Your engines; clients get outcomes/configs, never logins |
| Cal.com | Cloud API now → self-host shared later | Already integrated (see API_KEYS) |

### The shared engine layer (not products — consumed by the five)
**Dify** (AI brain: prompts, RAG, routing, extraction, sentiment, generation) · **n8n** (triggers/glue/retries) · **doc-intel** (Docling + PaddleOCR wrapper API — document parsing/OCR) · **gateway** (your Node/Express layer: auth, per-client config, rate limits; hides every engine) · **LLM APIs** (Gemini first; client's key or priced in). Stability rules: CPU-only production paths (LLMs via API; OCR async) · hard business rules live in gateway/n8n, not prompts · every engine has an exit ramp (§7).

---

## 2. The five products

### ① Kemet Business OS ✏️ — comprehensive ERP (your better-than-Odoo) · Offer C ⭐
- **Kills:** "We run the company on Excel, notebooks, and the accountant's memory."
- **What it is:** accounting, quotes/invoices, inventory, purchasing, POS, HR-lite, reports — pre-configured per industry, unlimited users, flat monthly (the anti-Odoo headline). Full spec: [`ERP_PRODUCT.md`](./ERP_PRODUCT.md).
- **Stack:** ERPNext (GPL-3.0, 100% open, Arabic/RTL) on a shared bench + your configuration app (industry starter kits, print formats) · Dolibarr = Lite edition.
- **Modules (your add-on IP):**
  - **Invoice Inbox** (doc-intel): supplier invoices via email/WhatsApp/upload → OCR incl. Arabic + **ZATCA QR decode** → duplicate/math checks → draft Purchase Invoice for one-click approval. *Demo: WhatsApp a photo of an Arabic invoice → draft bill with line items in 30s.*
  - **WhatsApp Approvals:** ERPNext Workflow approvals (purchases, expenses, leave, discounts) pushed to WhatsApp with Approve/Reject buttons; full audit trail. *Demo: approve an expense from WhatsApp → trail + entry appear.*
  - **ZATCA pack** (Saudi): Phase 2 e-invoicing via community apps — see ERP_PRODUCT + Saudi pack in Stack doc. **Payment chaser:** overdue-invoice reminder ladder via WhatsApp/email.
- **Customization:** industry kit (chart of accounts, item/service masters, print formats), roles/permissions, approval chains, locales.
- **White-label:** your product name, client logo/theme via settings; hosted delivery keeps GPL duties simple.

### ② Kemet Store ✏️ — comprehensive e-commerce system · Offer A premium
- **Kills:** "We sell through Instagram DMs and a spreadsheet — orders get lost, no online payment, no stock control."
- **What it is:** full online store — catalog, cart/checkout, payments, shipping, promotions, customer accounts, multi-currency/language with native **Arabic + Turkish + RTL**, multi-warehouse inventory, B2B suite — cloned from your golden image, not built per client. Powers the gallery's *Shop Starter*.
- **Stack:** **Bagisto** (MIT — full white-label freedom) per-client instance + **🇸🇦 Saudi pack** (PayTabs/HyperPay/Tabby + ZATCA routes + legal/theme duties — Stack doc §C) · WooCommerce = fallback for ready-made TR payment plugins · Medusa = custom/high-ticket only.
- **Modules:** AI shopping assistant (engine from ③) · post-purchase **Review Collector** (rating gate → Google reviews)* · abandoned-cart & winback (via ⑤) · supplier-invoice intake shared with ①'s Invoice Inbox · order-status WhatsApp alerts (care-plan feature).
- **Customization:** theme/tokens, catalog structure, payment/shipping matrix, locales/currencies, promotions rules.
- **Demo:** `store-demo.webkmt.com` golden store (AR storefront, mada-style checkout flow in sandbox, one-click clone story).
- *Review Collector also lives in ⑤; the store is its best trigger source.

### ③ Kemet Receptionist ✏️ — customer-service **& client-acquisition** AI · Offer B ⭐ flagship
- **Kills:** "I answer the same WhatsApp questions 40× a day, miss after-hours inquiries, and leads die waiting for a reply."
- **Two jobs, one product:**
  - **Service:** answers from the client's own documents 24/7 (WhatsApp + website widget, AR/EN/TR), books into a real calendar, reminders, human handoff to one shared inbox with AI summary.
  - **Acquisition:** every inquiry answered in **~60 seconds** (webform/IG/FB/WhatsApp/ads) → 2 qualifying questions → CRM row + owner ping with summary & tap-to-call → Day 1/3/7 follow-up ladder that stops on reply → weekly lead report (median response time = the proof).
- **Stack:** Dify golden chatflow → **gateway** → Evolution API (official Meta Cloud API for client numbers) + own web widget · Chatwoot (inbox + channels) · Cal.com (booking) · n8n (reminders, follow-ups, CRM sync) · doc-intel feeds KB ingestion. Simple-KB variant: AnythingLLM.
- **White-label:** widget, WhatsApp profile, messages = client brand; Dify/Chatwoot consoles never exposed (Chatwoot agent UI = default branding, staff-only).
- **Customization:** KB documents · tone vars · languages · intents/qualifying fields · services & booking rules · escalation/working-hours rules.
- **60-second demo:** message the demo clinic in Arabic → it books you; then submit the demo lead form → your phone buzzes with the reply + owner alert before you look up.
- **Proof metrics:** conversations handled without staff · bookings created · leads captured after hours · median first-response time.

### ④ Kemet Websites ✏️ — template websites + client-managed CMS · Offer A
- **Kills:** "Our website is outdated, and every tiny change means begging a developer." (Yours must never become webmaster-by-WhatsApp.)
- **What it is:** the client picks a niche template from your **Template Gallery** (live demos) → launched rebranded in days → **they edit text, photos, offers, menus, and blog posts themselves** in a clean CMS admin. You keep hosting/updates/backups (care plan).
- **Stack (decided):** **Payload CMS** (MIT — code *and* all official plugins; Figma-owned since 2025, still MIT) — **one instance per client** from golden niche templates (clinic, restaurant, real-estate, services, portfolio…) on Postgres; admin logo/theme set per client (trivial at one instance each). **Astro** static variant for landing-page-speed projects (content via Payload API or files). Official multi-tenant plugin exists — *later* cost optimization for micro-sites (note: shared instance = shared admin theme).
- **In the box:** pages/blog/media/menus/forms-inbox · multi-language (EN/AR/TR, RTL) · SEO fields + sitemap · WhatsApp click-to-chat · forms wired into ③'s acquisition flow · Google Business Profile setup (service step).
- **Customization:** template choice → design tokens (logo/colors/fonts) → section toggles → content. Anything structural = new template in *your* gallery (reusable), quoted once.
- **60-second demo:** open a demo template → client edits a headline + price in the CMS → live site updates; submit the contact form → ③ answers on WhatsApp.
- **Sales surface:** the existing `/templates` gallery (browse → WhatsApp → manual payment → launch) per [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md).

### ⑤ Kemet Marketing Suite ✏️ — campaigns, socials, conversations & brand radar · Offer E (attach after first win)
- **Kills:** "Marketing lives in five subscriptions and my head — irregular posts, unmailed lists, no idea what the internet says about us or what competitors just launched."
- **Modules (one suite, phased):**
  - **Email & Journeys — Mautic** (per-client instance): campaigns/newsletters, visual journey builder, lead scoring, forms & landing pages, segmentation, tracking. The HubSpot-class open core; Dify writes/personalizes copy (AR/EN) inside it. *(Reach/reactivation campaigns from v2 live here as the broadcast playbook.)*
  - **Social Scheduling — Postiz** (shared instance, workspace per client): 30+ networks, calendar, cross-posting, public API + n8n node for automation. ⚠️ **Create your platform developer apps NOW** — Meta/YouTube/TikTok app approvals take weeks (once, for your agency app; clients OAuth-connect their accounts). Run unmodified (AGPL); clients approve via your surface/WhatsApp — white-label UI is Postiz Enterprise (paid), so the suite dashboard/reports are your surface.
  - **Conversations — Chatwoot** (shared engine with ③): every DM/comment/email/WA in one inbox; AI-drafted replies (Dify) with human approval.
  - **Social Intelligence & Sentiment** (your intel service): collectors → Dify classification (sentiment, intent, topic, urgency — AR/EN) → owner alerts on spikes/complaints → monthly brand report. **Honest source matrix:**
    | Source | v1 access | Reality |
    |---|---|---|
    | Client's own pages/comments/DMs | Full (Graph API + Chatwoot/Postiz) | ✅ "Near-real-time" is true here |
    | YouTube (search/comments) | Data API (quota) | ✅ Workable |
    | Google reviews | GBP API (owned) · Places API (competitor counts, Google key, small cost) | ✅ Workable |
    | News/blogs/web mentions | RSS + Crawlee crawls (your scraper) | ✅ Scheduled sweeps |
    | X (Twitter) | Pay-per-use API ($0.005/read) | 💲 Client-budget add-on only |
    | Reddit | Commercial agreement required; RSS/public API shutting down (Nov 2026 → Mar 2027) | ⛔ Don't build on it |
    | TikTok / open Instagram firehose | No commercial search API | ⛔ Nobody legal has this; vendors sample |
  - **Competitor Watch:** scheduled diffs of competitor websites (prices/promos/new products), their public review counts/ratings, Meta Ad Library checks → "Competitor X launched a 20% promo" alert + monthly digest.
  - **Automation workflows (n8n recipes):** listen → classify → AI drafts response → human approves → engage · negative-spike WhatsApp alert · new-review alert · content calendar auto-fill from store/ERP events (new product → draft post + email).
- **White-label:** client sees one branded dashboard + reports (yours); Mautic admin theme-branded per client instance (never use the "Mautic" name); Postiz/listmonk-class UIs staff-only.
- **Ops honesty:** Mautic is the heavyweight (≈1.4 GB+ idle/instance, cron-driven, upgrades need care; community-funded — pin versions, quarterly upgrades, contacts always exportable). listmonk is retired to *your own* agency newsletter — client email standard is Mautic (one engine per job).
- **Phasing:** **v1** = Mautic + Postiz + Chatwoot + unified monthly report. **v2** = Intelligence (owned + YouTube + reviews + web) + Competitor Watch. **v3** = paid-data add-ons per client (X listening budget, third-party data APIs) as pass-through.
- **Proof metrics:** list growth & campaign revenue · posts shipped on schedule · response time on mentions · sentiment trend · competitor moves caught.

---

## 3. Where the earlier tools live now (nothing lost — reassigned)

| Earlier item | Now lives in | Note |
|---|---|---|
| Invoice Inbox (OCR) | **① ERP module** (engine: doc-intel) | Also feeds ② supplier side |
| Lead Responder | **③ acquisition module** | The "++acquisition++" half of the Receptionist |
| Review Collector | **⑤ module**, triggered by ②/① events | Rating gate → Google; unhappy → private |
| Reach (reactivation) | **⑤ playbook** on Mautic + WhatsApp | Broadcast + winback journeys |
| Approvals Desk | **① module** (ERPNext Workflow + WhatsApp buttons) | Appsmith only for non-ERP custom panels |
| Automation "packs" | **Recipes inside ③/⑤** + Offer D sprints | Features/sprints, not a shelf product |
| Internal Panels | **Capability, not a product** (Appsmith/Baserow on demand) | Staff surfaces for C-projects |
| doc-intel (Docling+PaddleOCR) | **Shared engine** | Also powers KB ingestion for ③ |

## 4. White-label & license matrix (one glance)

| Component | License | White-label verdict |
|---|---|---|
| Docling · PaddleOCR · Bagisto · Payload (code+plugins) · Baserow core · gateway/your UIs | MIT / Apache-2.0 | ✅ Full — brand freely |
| Appsmith CE | Apache-2.0 | ✅ Self-host/modify; branding-removal sold → staff-only or pass-through |
| ERPNext · Mautic · WooCommerce | GPL-3.0 | ✅ Host & charge; brand via theming/settings (respect trademarks); source duties if *distributing* modified copies |
| Dify | Apache-2.0 + conditions | ✅ By architecture: API-only behind your UI; never sell workspaces |
| Postiz · listmonk | AGPL-3.0 | ⚠️ Run **unmodified**, unexposed as "the product"; modifications offered over network ⇒ publish them |
| Chatwoot CE | MIT core, EE paid | ⚠️ Custom branding is paid EE → default branding, staff-only |
| n8n | Sustainable Use | ⚠️ No white-label/editor resale — managed outcomes only |
| Marker · MinerU | RAIL-M weights · Apache+terms | 🔴 Excluded (competitor bar / forced attribution) |
| Evolution API | Apache-2.0 + notices, **pin v2.3.7** | ✅ Internal engine; client numbers on official Cloud API |

**Exit ramps:** Dify → Flowise/custom code (your prompts/DSL) · Mautic → contacts/journeys export; listmonk fallback · Postiz → per-network APIs via n8n (content is yours) · Payload → content in Postgres + API · parsers swappable behind doc-intel API · Appsmith → own React (data in Postgres/APIs).

## 5. Cross-sell logic (why five, not fifteen)

Every product feeds the others' data: ④ forms → ③ leads → ⑤ journeys · ② orders → ⑤ campaigns + reviews · ① invoices → ⑤ payment winbacks · ③ conversations → ⑤ sentiment. **Sell one, land the next two with data you already have.** Each ships only with a care plan (RESCUE_PLAN §4) — the suite *is* the MRR ladder.

## 6. Build order (local-first; VPS when a demo needs a public URL)

- [ ] **0. PC dev setup** — Docker + repo layout (§1) + Cloudflare Tunnel + seed data
- [ ] **1. ③ Receptionist golden** (rebuild the marketplace template as *your* workflow) + widget + gateway v1
- [ ] **2. ④ first two golden templates** (clinic + services) on Payload → refresh gallery demos
- [ ] **3. ① Business OS demo** (ERPNext bench + industry kit) + **Invoice Inbox v1**
- [ ] **4. First VPS deploy** — Coolify + public demos for outreach (deploy-only from Git)
- [ ] **5. ② Store golden image** (+ Saudi pack) → `store-demo.webkmt.com`
- [ ] **6. ⑤ Suite v1** — Mautic + Postiz (⚠️ platform dev-app approvals started at step 0–1 in parallel) + unified report
- [ ] **7. ⑤ Intelligence v2** — collectors + sentiment + Competitor Watch
- [ ] Every product: local demo → public demo → RUNBOOK + clone checklist + care-plan tier ✏️

## 7. Deliberately NOT building

- ❌ A sixth "platform" product or capability-named SKUs — five systems, modules inside them
- ❌ Own OCR/LLM/workflow/email/social engines (assemble permissive ones; your IP = workflows, templates, data, glue)
- ❌ Firehose social listening (X/Reddit/TikTok at scale) on promises — paid-data pass-through only, priced per client
- ❌ Client-editable Dify/n8n/Postiz consoles as the product surface
- ❌ Local LLM serving in production paths · native mobile apps · developing on the VPS
- ❌ A second tool in any category "just in case"
