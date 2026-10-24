# WebKMT Product Stack — The 5 Sellable Automation Products (frozen v1)

> ✏️ Easily edited — names/prices marked ✏️ are yours to change.
> Companions: [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) (component licenses) · [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) (offers & pricing) · [`ERP_PRODUCT.md`](./ERP_PRODUCT.md) (Business OS) · [`API_KEYS.md`](./API_KEYS.md)
> This doc freezes **what we build** and **with what**. The two anchor systems (websites/templates, Bagisto store, Kemet Business OS) are already decided — these 5 are the AI/automation layer that plugs into them.

---

## 0. TL;DR — the portfolio

| # | Product ✏️ | Category | Core stack | Ships / integrates as | Offer |
|---|---|---|---|---|---|
| P1 | **Kemet Receptionist** | AI chatbot | Dify (brain) + Evolution API + Chatwoot + Cal.com + own widget | WhatsApp number · website widget snippet · API | B ⭐ |
| P2 | **Kemet Docs** | OCR / document AI | Docling + PaddleOCR + Dify extraction + n8n intake | Upload page · email-in · WhatsApp-in · REST API → ERPNext/CRM/Sheets | D/C add-on |
| P3 | **Kemet Campaigns** | Marketing | listmonk + sending relay + Dify content + n8n triggers (+ WhatsApp broadcast) | Managed service + approval UI + monthly report | D add-on |
| P4 | **Kemet Automations** | Automation packs | n8n workflow bundles on *your* instance | Webhooks/APIs into client's existing tools | D |
| P5 | **Kemet Panels** | Internal tools | Appsmith (staff panels) + Baserow (data apps) over client DBs/APIs | Web apps at `panel.client...` | C add-on |

**One engine per job. No second chatbot builder, no second automation engine, no second OCR stack.** Stability = boring consistency.

---

## 1. The stable platform (under every product)

### Run-once factory (RESCUE_PLAN §5)
- [ ] **Coolify + Docker** on the VPS (SSL, per-client projects) · wildcard DNS `*.webkmt.com`
- [ ] **Postgres** (default DB) · **Redis** (queues/cache) · backups → Cloudflare R2 · **Uptime Kuma**
- [ ] **Git = source of truth** for every golden artifact (compose files, Dify DSLs, n8n JSONs, app exports, prompt packs)

### Shared engines (single instances, your VPS)
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
1. **Permissive-only in shipped paths:** MIT/Apache/BSD components inside anything client-branded. GPL = whole systems delivered as-is (ERPNext/Woo). AGPL/SUL/source-available = unmodified internal engines only, never presented as "the product."
2. **Pin every version** (image tags, Dify, Evolution v2.3.7). Upgrade on *your* schedule, staging first.
3. **CPU-only rule:** no GPU models on the VPS; LLMs via API; heavy jobs async (queue, concurrency 1–2 for OCR).
4. **Customization = parameters, not forks:** KB/docs, prompt & rule variables, schemas, templates, channels. Golden artifact stays identical across clients.
5. **Every product has an exit ramp** (see §7): your prompts/DSL/configs/data are portable; hard business rules live in gateway/n8n, not in prompts.
6. **Capacity:** factory VPS runs demos + shared engines. Client production systems go on the client's own VPS (setup fee) or a second "clients" VPS when MRR justifies — never cram paying clients next to demos.

---

## P1 — Kemet Receptionist ✏️ · AI chatbot (Offer B ⭐ flagship)

- **Buyer/pain:** clinics, salons, real estate, services drowning in WhatsApp/DM inquiries.
- **Does:** answers from the client's own documents (AR/EN/TR), detects intent (question → answer · booking → collect name/phone/service → Cal), hands off to a human in Chatwoot, sends reminders, saves leads to CRM.
- **Stack:** Dify golden chatflow → gateway → Evolution API (WhatsApp) + own web widget; Chatwoot handoff; Cal booking; n8n reminders/lead sync. Simple-KB variant: AnythingLLM.
- **White-label:** widget, WhatsApp profile, messages = client's brand. Consoles never exposed.
- **Customization knobs:** KB documents · tone/brand prompt vars · languages · intents & fields · services/booking rules · escalation & working-hours rules.
- **Integrates via:** WhatsApp number · 1-line website widget · REST/webhook to any CRM.
- **Golden artifacts:** ☐ chatflow DSL (Git) ☐ widget ☐ reminder + lead-sync n8n JSONs ☐ inbox setup checklist ☐ demo clinic instance.
- **Price anchor ✏️:** Offer B range + care plan.

## P2 — Kemet Docs ✏️ · OCR / document intelligence

- **Buyer/pain:** traders, logistics, clinics, offices re-typing invoices, receipts, IDs, forms, delivery notes.
- **Does:** document in (upload / email / WhatsApp / API) → text+layout → **structured fields** (supplier, totals, VAT no., line items…) → validated → pushed to ERPNext/accounting/CRM/Sheet; searchable archive; low-confidence items go to a human review queue.
- **Stack (all permissive — this is why):**
  - **Docling** (MIT; docling-serve) — parsing/layout/tables for PDF/Office/images → Markdown/JSON. No license traps in code or weights.
  - **PaddleOCR PP-OCRv5** (Apache-2.0) — OCR engine for scans; multilingual incl. **Arabic** (109 languages).
  - **Dify workflow** — classification + field extraction + validation/cleanup; **vision-LLM escalation** (Gemini) only for low-confidence pages/handwriting.
  - **n8n** — intake channels & delivery; review queue = small own UI or Appsmith panel.
  - Escalation chain: native text layer → Docling → PaddleOCR → vision-LLM. Async jobs, CPU-only.
- **Rejected alternatives (license):** Marker — weights bar competing products + >$5M orgs; MinerU — mandatory visible attribution for online services + auto-termination clause. Both clash with white-label resale; revisit only with eyes open.
- **White-label:** your API/UI brand end-to-end (MIT/Apache parts only).
- **Customization knobs:** per-client **document schemas** (fields), validation rules, confidence thresholds, destinations, languages.
- **Integrates via:** REST API (JSON out) · email-in mailbox · WhatsApp-in · direct pushes to ERPNext (supplier invoices → Purchase Invoices — Saudi-pack synergy), Baserow/Sheets.
- **Golden artifacts:** ☐ doc-intel compose + service ☐ extraction DSLs: invoice v1, receipt v1, ID/form v1 ☐ review panel ☐ ERPNext push workflow.
- **Build v1 narrow:** *invoice/receipt extraction only.* Price anchor ✏️: setup + monthly per-document bundle (care plan tier).

## P3 — Kemet Campaigns ✏️ · marketing automation

- **Buyer/pain:** stores & services with a customer list they never message ("we run your offers newsletter").
- **Does:** AI drafts campaigns (offers, new arrivals, winbacks) in client voice AR/EN → client approves (WhatsApp/simple UI) → sends → monthly performance report feeds the care-plan PDF.
- **Stack:** **listmonk** (lists, campaigns, bounces, unsubscribes, stats; runs *unmodified* — AGPL-safe) + SMTP/SES relay · **Dify = content layer only** (copy, subject variants, segment personalization, reply classification → CRM) · **n8n triggers** (new Bagisto product, abandoned cart, no-show winback) · WhatsApp broadcast via Evolution **official Cloud API templates** · optional Postiz tier for social scheduling.
- **White-label:** emails/templates/reports carry client brand; listmonk UI never exposed.
- **Customization knobs:** brand-voice vars · segments · templates · channels (email/WhatsApp/social) · cadence · approval flow.
- **Compliance:** consent-based lists only, one-click unsubscribe (engine-native), PDPL/anti-spam basics in the setup checklist; sending domain SPF/DKIM/DMARC per client ✏️ (deliverability is part of setup fee).
- **Golden artifacts:** ☐ campaign prompt pack (DSL) ☐ email template set (AR/EN RTL-safe) ☐ trigger workflows ☐ report generator.
- **Not this:** Dify is **not** the email platform; full journey/lead-scoring suites (Mautic class) = separate bigger build, only on proven demand.

## P4 — Kemet Automations ✏️ · fixed-scope automation packs (Offer D)

- **Buyer/pain:** any SMB doing manual glue work between tools.
- **The catalog (fixed price each ✏️):** Lead → CRM → WhatsApp follow-up · Invoice reminders/payment chasing · Review-request engine · Appointment reminders · Order-status notifications (Bagisto → WhatsApp) · Weekly owner report (sales/leads summary to WhatsApp) · Backup & uptime watchdog.
- **Stack:** n8n on **your** instance (license-clean: you sell outcomes, clients never touch the editor) + gateway webhooks. Client-editable variant (rare, premium): Activepieces (MIT core) per OPEN_SOURCE_STACK §F.
- **White-label:** nothing to brand — invisible plumbing; messages/reports carry client identity.
- **Customization knobs:** field mappings · message templates · schedules · thresholds. Workflow JSONs in Git, cloned + configured.
- **Integrates via:** webhooks/REST into whatever the client already has (Sheets, ERPNext, Bagisto, Cal, Chatwoot, Supabase…).
- **Golden artifacts:** ☐ one n8n JSON per pack + config sheet (env vars per client) ☐ health-check workflow per pack.

## P5 — Kemet Panels ✏️ · internal tools & ops dashboards (second wave)

- **Buyer/pain:** ops-heavy SMBs outgrowing spreadsheets (approvals, dispatch, stock lookups).
- **Stack (decided — one builder):** **Appsmith CE** (Apache-2.0; free self-host, unlimited users) over Postgres / ERPNext / Bagisto APIs · **Baserow** (MIT core) for simple data apps clients self-manage · public/customer-facing portals = own React (shadcn-admin) when branding is external.
- **White-label reality:** Appsmith is staff-facing — its chrome is acceptable there; full branding-removal is Appsmith's paid Business feature → pass through (~$15/user/mo ✏️) only when a client demands it. Budibase (GPL + paid white-label) and ToolJet (AGPL + paid white-label) rejected as defaults.
- **Golden apps (build on first demand, then reuse):** approvals panel · order/dispatch tracker · stock lookup · customer 360 · job board. App definitions exported to Git.
- **Customization knobs:** data model, screens, roles/permissions, connected sources.

---

## 7. White-label & license matrix (the whole stack, one glance)

| Component | License | White-label verdict |
|---|---|---|
| Docling · PaddleOCR · Bagisto · Baserow (core) · Cal proxy code · your gateway/UIs | MIT / Apache-2.0 | ✅ Full — brand freely |
| Dify | Apache-2.0 + conditions | ✅ Via architecture: API-only behind your UI; never sell workspaces; console logo untouched |
| Appsmith CE | Apache-2.0 | ✅ Self-host/modify; vendor sells branding-removal → staff-only use or pass-through license |
| ERPNext · WooCommerce | GPL-3.0 | ✅ Host & charge; rebrand via theming/settings; source duties only if you *distribute* modified copies |
| listmonk | AGPL-3.0 | ⚠️ Run **unmodified**, unexposed; modifying + network use ⇒ publish changes |
| Chatwoot CE | MIT core, EE paid | ⚠️ Custom branding is paid EE → default branding, staff-only surface |
| n8n | Sustainable Use | ⚠️ No white-label/editor resale — managed outcomes only |
| Marker · MinerU | RAIL-M weights · Apache+terms | 🔴 Excluded (competitor bar / forced attribution) |
| Evolution API | Apache-2.0 + notices, **pin v2.3.7** | ✅ Internal engine; client numbers on official Cloud API |

**Exit ramps:** Dify → Flowise/custom code (prompts+DSL are yours) · Docling/Paddle → any parser behind the doc-intel API · listmonk → Mautic/SES tooling (lists export CSV) · n8n → Activepieces (workflow JSONs are specs) · Appsmith → own React panels (data stays in Postgres/APIs).

## 8. Cross-sell matrix (why these 5)

| Anchor \ Attach | P1 Chatbot | P2 Docs | P3 Campaigns | P4 Automations | P5 Panels |
|---|---|---|---|---|---|
| Website (A) | ⭐ widget | forms→data | ⭐ | lead follow-up ⭐ | — |
| Bagisto store | ⭐ shopping assistant | supplier invoices | ⭐ cart/new-arrival | order alerts ⭐ | ops tracker |
| Business OS (C) | support bot | ⭐ AP invoices | invoice reminders* | ⭐ | ⭐ approvals |

*via P4. Every anchor sale creates 2–3 automation attach points — that's the care-plan MRR ladder.

## 9. Build order (dependency sequence, solo-capacity)

- [ ] **0.** Factory base (Coolify, DNS, backups, monitoring) — see RESCUE_PLAN §5.1
- [ ] **1.** P1 golden chatflow + widget + clinic demo (rebuild the marketplace template as *your* workflow)
- [ ] **2.** Gateway v1 (auth/config/limits) — small, but everything hangs off it
- [ ] **3.** P2 doc-intel v1: invoices/receipts → ERPNext push + review queue
- [ ] **4.** Productize P4 packs as they emerge from P1–P3 deliveries (reminders, order alerts, lead sync)
- [ ] **5.** P3 campaigns (listmonk + sending domain setup + prompt pack)
- [ ] **6.** P5 first golden Appsmith app — only on first real demand
- [ ] Each product ships with: demo instance + one-page runbook + clone checklist + care-plan tier ✏️

## 10. Deliberately NOT building

- ❌ Own OCR/LLM/workflow engines (we assemble permissive ones)
- ❌ Email platform from scratch, or Dify-as-email-tool
- ❌ Client-editable Dify/n8n (license + support sink; premium exceptions priced)
- ❌ Local LLM serving on CPU VPS (API models only)
- ❌ Native mobile apps for these products (web/PWA surfaces only)
- ❌ A second tool in any category "just in case"
