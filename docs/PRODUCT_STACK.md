# WebKMT Product Stack — The Sellable Automation Products (frozen v2)

> ✏️ Easily edited — names/prices marked ✏️ are yours to change.
> Companions: [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) (component licenses) · [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) (offers & pricing) · [`ERP_PRODUCT.md`](./ERP_PRODUCT.md) (Business OS) · [`API_KEYS.md`](./API_KEYS.md)
> **v2 changes:** (1) development happens on **your PC**; the VPS is deploy-only hosting. (2) Every product is now a *named fix for one painful problem* — capability labels ("document intelligence", "automation packs", "panels") are gone.
>
> **The product test (every product must pass):** name the person, name their painful Tuesday-afternoon moment, demo the fix in 60 seconds. If it can't pass, it's a feature, not a product.

---

## 0. TL;DR — the portfolio

| # | Product ✏️ | The problem it kills (customer's words) | Core stack | Offer |
|---|---|---|---|---|
| P1 | **Kemet Receptionist** | "I answer the same WhatsApp questions 40× a day and miss bookings after hours" | Dify + Evolution + Chatwoot + Cal + own widget | B ⭐ |
| P2 | **Kemet Invoice Inbox** | "My accountant re-types every supplier invoice by hand" | Docling + PaddleOCR + Dify extraction → ERPNext | D/C add-on |
| P3 | **Kemet Reach** | "I have 2,000 past customers in a spreadsheet and never message them" | listmonk + WhatsApp broadcast + Dify copywriting | D add-on |
| P4a | **Kemet Lead Responder** | "Inquiries wait hours; the competitor who replies first wins" | Chatwoot/n8n + Dify qualifying + CRM | D |
| P4b | **Kemet Review Collector** | "I have 14 Google reviews. My competitor has 400" | n8n + WhatsApp rating gate | D |
| P5 | **Kemet Approvals** | "Approvals die in WhatsApp chats — nobody knows who approved what" | Appsmith + n8n WhatsApp approvals + audit log | C add-on |

Anchors (already decided, unchanged): websites/templates · Bagisto store · Kemet Business OS (ERPNext). These 6 are the AI/automation layer that plugs into them.
**One engine per job. No second tool in any category.** Stability = boring consistency.

---

## 1. Where things are built vs hosted

### 1A. Your PC = the factory floor (development)
- **Docker Compose per engine/product** — start only what the product you're building needs (`dify`, `n8n`, `chatwoot`, `evolution`, `listmonk`, `doc-intel`, `erpnext`, `bagisto`, `appsmith`). ERPNext bench is the heaviest local item — give Docker enough RAM ✏️ (your PC spec rules).
- **Repo layout:** `/products/<product>/` → `docker-compose.yml` · golden artifacts (Dify DSL, n8n JSON, app exports, prompt packs) · `seed/` demo data · `RUNBOOK.md`. Version-tagged like software releases (`invoice-inbox v1.0`).
- **Seed data per product** (fake clinic, sample AR/EN invoices incl. ZATCA-QR samples, demo customer list) — demos must run offline-deterministic on your PC.
- **Webhooks while local:** Cloudflare Tunnel (free) exposes local services so WhatsApp/Cal/payment callbacks work during development.
- **Nothing is developed on the VPS.** No SSH-and-edit, ever.

### 1B. VPS = hosting tier 1 (deploy-only)
- **Coolify** hosts: public demos (`clinic-demo.webkmt.com`…) + **first batch of clients** (per-client projects, same compose files from Git). Deploy = pull + set client `.env` + up. The VPS is *replaceable* — everything on it can be rebuilt from Git + backups.
- Monitoring (Uptime Kuma) + backups → Cloudflare R2 live here.
- **Scale-out path (later, as MRR grows):** second VPS, or the client's own VPS/on-prem running the identical artifacts (self-host package = premium option). The stack never changes — only where it runs.
- Environments are **promoted, never edited in place:** local → VPS demo → client production. Config via `.env` only; secrets never in Git.

### 1C. Shared engines (run locally in dev; hosted copies serve clients)
| Engine | Job | White-label method |
|---|---|---|
| **Dify** (1 workspace) | AI brain: prompts, RAG, routing, extraction, generation | API-only behind *your gateway* + your UIs; console never client-facing |
| **Gateway** (your code, Node/Express) | Auth, per-client config, rate limits, hides all engines | This **is** your product layer — fully yours |
| **n8n** (your instance) | Triggers, glue, retries, schedules | Invisible to clients; sell outcomes (SUL-compliant) |
| **Evolution API** v2.3.7 | WhatsApp transport (official Cloud API channel for clients) | Messages carry client's brand/number |
| **Chatwoot CE** | Human handoff inbox (1 account/client) | Agent UI keeps default branding (staff-only); customer widget is styled |
| **Cal.com** | Booking | Your booking modal (already built) |
| **listmonk** | Email lists/campaigns/sending | Runs unmodified behind your approval UI/reports (AGPL-safe) |
| **doc-intel service** (your code) | Docling + PaddleOCR wrapper API | Yours end-to-end (MIT/Apache parts) |
| **LLM APIs** (Gemini first) | All model calls | Client's key or priced into fee; per-app usage alerts |

### Stability rules (non-negotiable)
1. **Permissive-only in shipped paths:** MIT/Apache/BSD inside anything client-branded. GPL = whole systems delivered as-is (ERPNext/Woo). AGPL/SUL/source-available = unmodified internal engines only, never presented as "the product."
2. **Pin every version** (image tags, Dify, Evolution v2.3.7). Upgrade locally first, then promote.
3. **CPU-only rule:** no GPU models in production paths; LLMs via API; heavy jobs (OCR) async with low concurrency.
4. **Customization = parameters, not forks:** KB/docs, prompt & rule variables, schemas, templates, channels. The golden artifact stays identical across clients.
5. **Every product has an exit ramp** (see §7): prompts/DSL/configs/data are yours and portable; hard business rules live in gateway/n8n, not in prompts.
6. **Dev/prod separation:** if it isn't in Git, it doesn't ship. A client install must be reproducible from repo + `.env` + runbook in under ~2 hours.

---

## P1 — Kemet Receptionist ✏️ · "Your WhatsApp and website answer customers and book appointments while you work" (Offer B ⭐)

- **The pain:** clinic/salon/agency owner personally answers prices/hours/availability all day; after-hours inquiries go cold; bookings live in chat scrollback.
- **What happens:** customer messages (WhatsApp or site) → AI answers from the business's own documents (AR/EN/TR) → booking intent collects name/phone/service → appointment created in Cal → reminders sent → anything sensitive hands off to a human in Chatwoot with a summary → every lead lands in CRM.
- **In the box:** WhatsApp bot + website widget (1-line embed) · KB manager (their docs) · booking flow · human-handoff inbox · reminder sequence · lead sync · owner daily digest (new bookings/leads).
- **60-second demo:** message the demo clinic in Arabic → book a cleaning → watch it appear in the calendar + owner's phone ping.
- **Stack:** Dify golden chatflow → gateway → Evolution + widget; Chatwoot; Cal; n8n. Simple-KB variant: AnythingLLM.
- **Customization knobs:** KB documents · tone vars · languages · services/booking rules · escalation & working-hours rules.
- **Proof metric (care report):** conversations handled without staff · bookings created · after-hours leads captured.
- **Golden artifacts:** ☐ chatflow DSL ☐ widget ☐ reminder/lead-sync workflows ☐ demo clinic seed.

## P2 — Kemet Invoice Inbox ✏️ · "Supplier invoices type themselves into your accounting"

- **The pain:** accountant/owner spends hours weekly re-typing supplier invoices & receipts (Arabic/English mix); VAT numbers mistyped; duplicates paid; paper lost before audit.
- **What happens:** invoices forwarded to one place (dedicated email / WhatsApp number / drag-drop / API) → read automatically (OCR incl. Arabic; **ZATCA QR decoded when present** = instant verified seller/VAT/totals) → math + duplicate checks → a **draft bill** appears in ERPNext (or CSV/Excel export) → human approves in one click in a review screen (document beside extracted fields, low-confidence highlighted) → originals archived, full-text searchable.
- **In the box:** 4 intake channels · extraction (supplier, dates, line items, VAT, totals) · duplicate detector · review queue · ERPNext Purchase-Invoice push + CSV export · searchable archive.
- **60-second demo:** WhatsApp a photo of an Arabic supplier invoice → draft bill with line items sitting in ERPNext 30 seconds later.
- **Stack (permissive-only, deliberately):** **Docling** (MIT — parsing/layout/tables, docling-serve) + **PaddleOCR PP-OCRv5** (Apache-2.0 — OCR incl. Arabic, 109 languages) inside your `doc-intel` API · **Dify** workflow for classification/field extraction/validation · vision-LLM (Gemini) escalation only for low-confidence pages · n8n for intake/delivery. Fallback chain: text layer → Docling → PaddleOCR → vision-LLM. Async, CPU-only.
  - *Rejected:* Marker (weights bar competing products + >$5M orgs) · MinerU (mandatory visible attribution + auto-termination clause). Both clash with white-label resale.
- **Customization knobs:** document schemas per client · validation rules · confidence thresholds · destination (ERPNext/CSV/Sheet) · languages.
- **Proof metric:** invoices processed · est. hours saved · duplicates caught · % auto-approved-ready.
- **v1 scope (narrow!):** supplier invoices + receipts only. *Later variants on the same engine:* ID/form intake (clinics, HR onboarding) — separate SKUs when demanded.
- **Golden artifacts:** ☐ doc-intel compose+service ☐ extraction DSL v1 (invoice) ☐ review screen ☐ ERPNext push workflow ☐ sample invoice set (AR/EN + ZATCA QR).
- **Price anchor ✏️:** setup + monthly document bundle (care-plan tier).

## P3 — Kemet Reach ✏️ · "Your past customers get an offer this week — written, sent, and tracked for you"

- **The pain:** 500–5,000 past customers sit in a phone/Excel/POS, never contacted; ads cost money while the free list rots; owner has no time to write or send campaigns.
- **What happens:** pick a segment ("bought 90+ days ago") → AI writes the offer in the brand's voice (AR/EN) → owner approves from WhatsApp → sent via **WhatsApp official templates + email** → replies auto-classified (interested → hot-lead ping with summary; complaint → inbox) → report shows sent/opened/replied/**revenue recovered**. Always-on: abandoned-cart recovery (stores), rebooking reminders (services).
- **In the box:** list import & dedupe · AI campaign composer · one-tap approval · dual-channel sending · reply classification → Chatwoot/CRM · revenue-recovered report (feeds care-plan PDF).
- **60-second demo:** select the 90-day segment → AI drafts an Arabic Eid offer → approve on WhatsApp → replies land as hot leads.
- **Stack:** listmonk (unmodified, behind your UI) + SMTP/SES relay · Evolution **official Cloud API** broadcast · Dify content layer · n8n triggers. (Dify is *not* the sender — lists/deliverability/unsubscribe live in listmonk.)
- **Customization knobs:** brand-voice vars · segment definitions · templates · channels · cadence · sender domain (SPF/DKIM/DMARC setup is part of onboarding ✏️).
- **Compliance:** consent-based lists only · one-click unsubscribe · WhatsApp template approvals have lead time — start them at contract signing.
- **Proof metric:** revenue recovered per campaign · reply rate · list growth.
- **Golden artifacts:** ☐ campaign prompt pack (DSL) ☐ AR/EN email template set (RTL-safe) ☐ trigger workflows ☐ report generator.

## P4 — Two micro-products (replaces vague "automation packs")

*Other automations (order-status alerts, invoice-payment reminders, backup watchdogs) are **features inside Store/ERP care plans**, not standalone products. These two earned product status: named pain, 60-second demo, standalone ROI.*

### P4a — Kemet Lead Responder ✏️ · "Every inquiry answered in 60 seconds — at 2pm or 2am"
- **The pain:** website/Instagram/ad leads wait hours; first responder wins the deal; the rest die in DM scrollback.
- **What happens:** lead lands (webform, IG/FB via Chatwoot, ad webhook) → instant branded WhatsApp/email reply + 2 qualifying questions (AI) → CRM row created → owner/sales pinged with summary + tap-to-call → Day 1/3/7 follow-up ladder that stops the moment they reply.
- **60-second demo:** submit the demo form → your phone buzzes with the reply *and* the owner alert before you look up.
- **Stack:** n8n + Chatwoot channels + Dify qualifying chat + Baserow/twenty/ERPNext sink. **Proof metric:** median first-response time (before vs after) · leads captured after hours.

### P4b — Kemet Review Collector ✏️ · "Finished jobs become Google reviews — automatically"
- **The pain:** 14 Google reviews vs the competitor's 400; happy customers are never asked; unhappy ones go straight to Google.
- **What happens:** job/order marked complete (Bagisto/ERPNext/manual list) → WhatsApp: "How was it? 1–5" → 4–5 → Google review link; 1–3 → private feedback to owner (service-recovery chance before it goes public) → monthly rating report.
- **60-second demo:** complete a demo order → rating message arrives → tap 5 → Google review page opens.
- **Stack:** n8n + Evolution + simple state store. **Proof metric:** new reviews/month · average rating trend · private complaints intercepted.

## P5 — Kemet Approvals ✏️ · "No approval ever dies in a WhatsApp chat again" (second wave)

- **The pain:** purchase/expense/leave/discount approvals happen in chats and memory; the owner is the bottleneck; "who approved this payment?" is unanswerable at audit time.
- **What happens:** employee submits a request (form: amount, reason, attachment photo) → routed by rules (amount → manager/owner) → approver decides from **WhatsApp buttons** (Approve / Reject) → decision, timestamp, and full trail logged → requester notified → approved purchases/expenses optionally created in ERPNext automatically.
- **In the box:** request types (purchase · expense · leave · discount — configurable forms) · routing rules · WhatsApp approve/reject · **audit log** · dashboard (pending now, avg decision time) · optional ERPNext sink.
- **60-second demo:** submit an expense with a receipt photo → manager approves from WhatsApp → audit trail + ERP entry appear.
- **Stack (decided — one builder):** **Appsmith CE** (Apache-2.0, free self-host, unlimited users) over Postgres/APIs + n8n (WhatsApp notifications/actions) + ERPNext API optional. Simple data trackers that clients self-manage → **Baserow** (MIT core). Public/customer-facing portals → own React (shadcn-admin), never Appsmith.
- **White-label reality:** staff-facing surface — Appsmith chrome is acceptable there; vendor sells full branding-removal (~$15/user/mo ✏️ pass-through) only if a client demands it. Budibase (GPL) / ToolJet (AGPL) rejected as defaults (white-label paid on both).
- **Proof metric:** median approval time · % requests with complete audit trail.
- **Golden artifacts:** ☐ Approvals app export (Git) ☐ WhatsApp-action workflows ☐ seed org (roles/request types). *Build on first real demand, then reuse forever.*

---

## 7. White-label & license matrix (one glance)

| Component | License | White-label verdict |
|---|---|---|
| Docling · PaddleOCR · Bagisto · Baserow (core) · gateway/your UIs | MIT / Apache-2.0 | ✅ Full — brand freely |
| Dify | Apache-2.0 + conditions | ✅ Via architecture: API-only behind your UI; never sell workspaces; console logo untouched |
| Appsmith CE | Apache-2.0 | ✅ Self-host/modify; branding-removal is paid → staff-only use or pass-through |
| ERPNext · WooCommerce | GPL-3.0 | ✅ Host & charge; rebrand via theming/settings; source duties only if *distributing* modified copies |
| listmonk | AGPL-3.0 | ⚠️ Run **unmodified**, unexposed; modifying + network use ⇒ publish changes |
| Chatwoot CE | MIT core, EE paid | ⚠️ Custom branding is paid EE → default branding, staff-only |
| n8n | Sustainable Use | ⚠️ No white-label/editor resale — managed outcomes only |
| Marker · MinerU | RAIL-M weights · Apache+terms | 🔴 Excluded (competitor bar / forced attribution) |
| Evolution API | Apache-2.0 + notices, **pin v2.3.7** | ✅ Internal engine; client numbers on official Cloud API |

**Exit ramps:** Dify → Flowise/custom code (prompts+DSL are yours) · doc-intel parsers → swappable behind your API · listmonk → lists export as CSV · n8n → Activepieces (workflows are specs) · Appsmith → own React panels (data stays in Postgres/APIs).

## 8. Cross-sell matrix (why these products)

| Anchor \ Attach | P1 Receptionist | P2 Invoice Inbox | P3 Reach | P4a Responder | P4b Reviews | P5 Approvals |
|---|---|---|---|---|---|---|
| Website (A) | ⭐ widget | — | ⭐ | ⭐ | ⭐ | — |
| Bagisto store | ⭐ shopping assistant | supplier invoices | ⭐ cart & winback | ⭐ | ⭐ post-order | purchase approvals |
| Business OS (C) | support bot | ⭐ AP automation | payment-winback* | ⭐ | ⭐ post-job | ⭐ native sink |

*via Reach lists from ERP customers. Every anchor sale opens 2–3 attach points — the care-plan MRR ladder.

## 9. Build order (local-first; VPS only when something needs a public URL)

- [ ] **0. PC dev setup** (half a day): Docker + repo layout (§1A) + Cloudflare Tunnel + seed data
- [ ] **1. P1 golden** end-to-end locally (rebuild the marketplace template as *your* workflow; WhatsApp test number via tunnel)
- [ ] **2. Gateway v1** (auth/config/limits) — small, everything hangs off it
- [ ] **3. P2 Invoice Inbox v1** (invoice/receipt → ERPNext draft + review screen)
- [ ] **4. P4a + P4b** (small; reuse P1 plumbing)
- [ ] **5. First VPS deploy** — Coolify + public demos (clinic, store) when outreach starts; deploy-only from Git
- [ ] **6. P3 Reach** (start WhatsApp template approvals + sending-domain warmup early — they have lead time)
- [ ] **7. P5 Approvals** — first golden Appsmith app on first real demand
- [ ] Every product ships with: local demo + public demo (step 5+) + RUNBOOK + clone checklist + care-plan tier ✏️

## 10. Deliberately NOT building

- ❌ Capability-named "products" ("document intelligence", "automation packs", "panels") — if it fails the 60-second demo test, it's a feature inside a product
- ❌ Own OCR/LLM/workflow/email engines (we assemble permissive ones)
- ❌ Dify-as-email-tool; email platform from scratch
- ❌ Client-editable Dify/n8n (license + support sink; priced exceptions only)
- ❌ Local LLM serving in production paths (API models only)
- ❌ Native mobile apps for these products (web/WhatsApp surfaces only)
- ❌ Developing on the VPS; a second tool in any category "just in case"
