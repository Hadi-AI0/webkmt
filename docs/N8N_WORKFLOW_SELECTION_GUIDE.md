# n8n Workflow Selection Guide — Hand-Picking Patterns for WebKMT's Five Products

> **Audience:** an AI research/build agent with access to [Zie619's n8n Workflow Collection](https://zie619.github.io/n8n-workflows/) and its source repository, [Zie619/n8n-workflows](https://github.com/Zie619/n8n-workflows).
>
> **Mission:** hand-pick the *exact workflow patterns* WebKMT should adapt or rebuild for its five products. The output is an audited shortlist and rebuild backlog — not a pile of blindly imported JSON files.
>
> **Read first:** [`AI_BUILD_PACK.md`](./AI_BUILD_PACK.md), [`PRODUCT_STACK.md`](./PRODUCT_STACK.md), and [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md). If this guide conflicts with the frozen product/license decisions in those files, stop and flag the conflict.

---

## 1. Full WebKMT context the research agent must use

### What WebKMT is building

WebKMT is a solopreneur-operated software business. Its current website/repository is the public **webfront** — offers, template gallery, tools/mini-apps, user accounts, audit/booking and lead-capture surfaces used to attract and retain clients. The five sellable systems are separate golden products:

1. **① Kemet Business OS** — comprehensive ERP (ERPNext/Frappe).
2. **② Kemet Store** — comprehensive e-commerce system (Bagisto).
3. **③ Kemet Receptionist** — customer-service **and client-acquisition** AI for website chat + WhatsApp (Dify brain, owned gateway, Evolution/Meta WhatsApp, Chatwoot, Cal.com).
4. **④ Kemet Websites** — niche templates connected to a client-managed CMS (Payload CMS).
5. **⑤ Kemet Marketing Suite** — Mautic email/journeys + Postiz social scheduling + Chatwoot conversations + owned social-intelligence/competitor-watch service.

Invoice OCR, lead response, reviews, reactivation, approvals, document intelligence, automations, and panels are **modules/recipes inside the five**, not extra products.

### Architecture role of n8n

- **Dify is the AI brain:** prompts, RAG, intent routing, extraction, classification, drafted content.
- **n8n is the process/glue layer:** triggers, schedules, API calls, validation, retries, reminders, reports, synchronization, alerts.
- **The owned gateway is the security/config boundary:** tenant resolution, auth, rate limits, usage/cost logs, provider abstraction.
- **Source systems own business truth:** ERPNext for ERP/accounting/stock, Bagisto for orders/catalog, Cal for bookings, Payload for website content, Mautic for marketing contacts/journeys, Postiz for scheduled social posts, Chatwoot for human conversations.
- Therefore, a workflow that implements an entire chatbot, CRM, email platform, store, or social scheduler inside n8n is usually **reference-only**; extract only its trigger, transformation, retry, notification, or API pattern.

### White-label and open-source approach

- WebKMT assembles proven open-source systems into branded client outcomes. Clients see WebKMT/client-branded widgets, messages, dashboards, websites, emails, and reports — not vendor consoles.
- n8n is run by WebKMT as an internal engine under its Sustainable Use License. Research must select workflows for **managed outcomes on WebKMT's instance**. Never propose selling n8n access, client editor accounts, white-labeled n8n, or “powered by n8n” client products.
- Permissive/open components are preferred in client-branded paths. GPL systems are delivered whole. AGPL/SUL/source-available engines (Postiz, n8n) remain unmodified/unexposed as the product.
- Community workflow provenance/licensing may be unclear even when JSON is downloadable. Treat every selected item as a **pattern to audit and rebuild cleanly**, unless license/provenance is verified. Do not sell or redistribute third-party workflow JSON as WebKMT's own template pack.
- Prefer official APIs/webhooks and replaceable/self-hostable dependencies. Flag every paid SaaS/API dependency, its purpose, likely marginal cost driver, and open/API alternative.
- Client numbers use the official Meta WhatsApp Cloud API through the approved architecture. Unofficial WhatsApp automation is acceptable only for disposable demo research, never as the client production pattern.
- No scraping or automation pattern that requires credential sharing, fake accounts/engagement, CAPTCHA/anti-bot evasion, platform-ToS evasion, or unofficial LinkedIn/Instagram/TikTok/Reddit/X firehoses.

### Market and operational context

- Owner is a solopreneur; recurring manual effort is a defect. Favor simple, debuggable workflows that one operator can monitor and clone.
- Most clients are SMBs; Saudi Arabia is strategically important. Patterns must support Arabic/English (Turkish where relevant), RTL-safe message/report templates, E.164 phone numbers, client time zones (especially `Asia/Riyadh`), VAT/currency fields, and configurable business hours.
- Builds happen on the owner's PC; the VPS hosts demos/first clients. Workflows must be environment-portable through credentials/environment/config, not hard-coded localhost, personal accounts, sheet IDs, or URLs.
- API keys arrive late. Hand-pick patterns that can be rebuilt with webhook fixtures, sandbox accounts, and mock HTTP endpoints. Record owner-only accounts/keys as blockers; never request or use real secrets during research.

---

## 2. How to use the Zie619 collection correctly

At the time this guide was written, the site presented **4,343 workflows**, 268 integrations, category/complexity/trigger filters, workflow cards, node/integration summaries, “Copy ID”, and direct JSON downloads from GitHub. Re-check current counts and UI behavior during research; do not treat these numbers as permanent.

Useful site categories include:

- AI Agent Development
- Business Process Automation
- CRM & Sales
- Cloud Storage & File Management
- Communication & Messaging
- Creative Content & Video Automation
- Creative Design Automation
- Data Processing & Analysis
- E-commerce & Retail
- Financial & Accounting
- Marketing & Advertising Automation
- Project Management
- Social Media Management
- Technical Infrastructure & DevOps
- Web Scraping & Data Extraction

Raw workflow JSON is generally reachable under:

```text
https://raw.githubusercontent.com/Zie619/n8n-workflows/main/workflows/<folder>/<numeric-prefix>_<filename>.json
```

### Important limitation

Titles, generated descriptions, categories, and integration labels in a large community index can be noisy, duplicated, or mismatched. **Never select from the card alone.** For every serious candidate, inspect the actual JSON node graph, node types/versions, expressions, Code nodes, HTTP URLs, credential placeholders, error branches, and active/webhook settings.

### Research sources in order

1. Site search + category/integration/trigger/complexity filters.
2. Exact title and displayed Copy ID (record only if actually visible/retrievable; never invent an ID).
3. GitHub repository tree/code search across `workflows/` for filenames, node types, service names, and keywords.
4. Raw JSON inspection.
5. Official upstream API/docs for the WebKMT replacement system (ERPNext, Bagisto, Dify, Evolution/Meta, Chatwoot, Cal, Payload, Mautic, Postiz, YouTube/Google where relevant).
6. n8n official docs for current node behavior and credentials.

Do not use unrelated blogs or AI summaries as a substitute for inspecting JSON and official APIs.

---

## 3. Mandatory research method

For each capability in §5:

1. **Start from the capability ID and business outcome**, not from attractive workflow titles.
2. Search the exact terms, synonyms, adjacent business verbs, category, trigger type, and integration names in the “search pack” column.
3. Search by pattern equivalents. Example: a Shopify abandoned-cart workflow may be a valid *pattern* for Bagisto even though Shopify nodes will be replaced by Bagisto webhooks/HTTP.
4. Collect a long list, deduplicate near-identical workflows, then shortlist **at most three** candidates: primary pattern, simpler fallback, and optional advanced reference.
5. Download/inspect JSON for each shortlisted workflow. Do not import it into a production n8n. If a sandbox import is later approved, disable triggers/webhooks first and use dummy credentials/data.
6. Map every external node/credential to the approved WebKMT architecture or mark it as a paid/optional dependency.
7. Score using §7 and classify:
   - **REBUILD** — pattern fits; recreate cleanly in WebKMT's n8n with approved systems/subflows.
   - **ADAPT IN SANDBOX** — provenance/license and security are sufficiently clear; still sanitize, parameterize, test, and re-export WebKMT's own version.
   - **REFERENCE ONLY** — useful idea/subpattern, wrong architecture/dependency/license.
   - **REJECT** — unsafe, illegal/ToS-risky, unmaintainable, duplicated, or irrelevant.
8. If no good candidate exists, report **GAP — build from official APIs** rather than forcing a poor workflow.
9. Produce the deliverables in §9. Every recommendation must include exact displayed title, raw JSON URL/path, search trail, node/integration summary, adaptation mapping, security findings, score, and test plan.

### Search discipline

Use combinations of:

```text
[business object] + [action] + [trigger/channel]
invoice + OCR + email
lead + WhatsApp + follow up
abandoned cart + reminder
appointment + reminder + calendar
review + request + Google
RSS + social media + schedule
sentiment + comments + alert
```

Also search node/integration names and generic mechanics:

```text
Webhook, HTTP Request, Schedule Trigger, IMAP Email Read, Gmail Trigger,
Google Drive, Google Sheets, Split In Batches, Merge, IF, Switch, Set,
Wait, Execute Workflow, Error Trigger, Code, RSS Feed Read
```

Search adjacent ecosystems, then substitute:

| If the workflow uses… | WebKMT substitution to evaluate |
|---|---|
| OpenAI/Anthropic/Gemini chat or agent nodes | Dify app via owned gateway/HTTP; keep only process pattern in n8n |
| Twilio/WhatsApp unofficial node | Evolution API using official Meta Cloud API for client numbers |
| Shopify/WooCommerce | Bagisto order/product/customer webhooks or REST/HTTP adapters |
| QuickBooks/Xero/generic accounting | ERPNext REST API/doc events |
| HubSpot/Pipedrive/Airtable/Google Sheets CRM | ERPNext CRM, Chatwoot contact/conversation, Baserow/internal CRM, or client CRM via gateway — choose the product's source of truth |
| Calendly/Google Calendar | Cal.com API first; calendar only as Cal's connected backend |
| WordPress/Webflow | Payload REST/local API/webhooks and owned form gateway |
| Mailchimp/ActiveCampaign/HubSpot email | Mautic API/events; listmonk only for internal agency patterns |
| Buffer/Hootsuite/Later/direct social nodes | Postiz API/n8n integration where verified; direct official APIs only if Postiz cannot support the case |
| Apify/Phantombuster/SerpApi/scraper SaaS | Owned lawful collectors/Crawlee service or official APIs; mark paid pass-through if unavoidable |
| Telegram/Slack approval buttons | WhatsApp action pattern through owned gateway, preserving signed-state/audit design |

---

## 4. Universal workflow design WebKMT expects after rebuild

A selected pattern is valuable only if it can be rebuilt into this shape:

```text
Trigger (webhook/schedule/event)
  → authenticate/verify signature where applicable
  → validate schema and normalize fields
  → resolve tenant/client configuration
  → idempotency/deduplication check
  → business rules in deterministic nodes/code
  → official API/source-system action
  → audit/result record
  → success response/notification
  → error branch: bounded retry/backoff or dead-letter + operator alert
```

Look for or add reusable subworkflow patterns for:

- `SYS_Tenant_Config_Lookup`
- `SYS_Idempotency_Check_And_Mark`
- `SYS_Error_Notify_And_DeadLetter`
- `SYS_Send_WhatsApp_Template`
- `SYS_Send_Owner_Alert`
- `SYS_Call_Dify_Workflow`
- `SYS_Call_DocIntel`
- `SYS_Create_Or_Update_Lead`
- `SYS_Generate_Report`
- `SYS_Health_And_Usage_Watchdog`

These names are internal conventions for the rebuild backlog; the research agent should identify source patterns that could inform them.

### Preferred workflow characteristics

- Webhook/scheduled triggers with clear payload contracts; manual-only demos are weaker.
- Low/medium complexity; ideally ≤25 nodes for a single capability. >40 nodes requires exceptional justification and decomposition.
- Standard n8n nodes and HTTP Request over obscure community nodes, shell commands, or giant Code nodes.
- Explicit IF/Switch validation, pagination, rate-limit handling, Wait/retry logic, stop conditions, and error branches.
- Credentials referenced by name with no embedded secrets/personal IDs.
- Testable transformations separated from side effects.
- Language/tenant/time-zone/channel values parameterized.

---

## 5. Exact workflow patterns to hand-pick

Priority meanings:

- **P0:** required for the first sellable golden demos/build order.
- **P1:** required for a complete v1 or strong care-plan value.
- **P2:** v2, industry variant, or optional accelerator.

### 5.1 Shared platform and operations

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation |
|---|---|---|---|---|
| OPS-01 | P0 | Global error handler: failed execution → classify → operator alert + dead-letter record | `error trigger`, `workflow error notification`, `failed execution alert`, Technical Infrastructure & DevOps | One internal standard; alert via owner's chosen channel; store sanitized payload/replay instructions |
| OPS-02 | P0 | Webhook validation + idempotency/deduplication pattern | `webhook deduplication`, `idempotency`, `duplicate webhook`, `signature verification` | Gateway/source event IDs; DB/Redis/Baserow only as architecture decides; no secrets in workflow JSON |
| OPS-03 | P0 | Scheduled health checks for APIs/websites → downtime/recovery alerts | `uptime monitor`, `website health check`, `API status alert`, Technical Infrastructure & DevOps | Complement Uptime Kuma; check product-specific APIs/queues/cron, not just homepage |
| OPS-04 | P1 | Backup verification/report: backup job result → missing/stale backup alert | `backup notification`, `database backup alert`, `backup verification` | Restic/Coolify/DB backup outputs; never put backup credentials in n8n Code nodes |
| OPS-05 | P1 | AI/API usage watchdog: usage threshold → tenant cost alert/report | `API usage report`, `OpenAI usage`, `cost monitoring`, `token usage alert` | Replace model-provider specifics with gateway/Dify usage logs; per-tenant budget flags |
| OPS-06 | P1 | Scheduled digest/report generator: query sources → HTML/PDF/email/WhatsApp summary | `weekly report`, `daily digest`, `PDF report`, `Google Sheets report` | Shared report subflow with metric definitions and tenant branding |
| OPS-07 | P1 | Credential/token expiry watcher pattern | `token expiry`, `OAuth refresh alert`, `certificate expiry`, `domain expiry` | Social/Meta/API tokens, TLS/domain reminders; alert before failure |
| OPS-08 | P2 | Workflow export/version backup pattern | `export workflows`, `backup n8n workflows`, `GitHub workflow backup` | Only sanitized exports to Git; reject patterns that export credentials or restore secrets |

### 5.2 Product ① — Kemet Business OS / ERP

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation |
|---|---|---|---|---|
| ERP-01 | P0 | Supplier invoice intake: email/Drive/file trigger → extract attachment → OCR/parse → structured invoice → accounting draft | `invoice OCR`, `invoice processing`, `email invoice`, `PDF invoice extraction`, `receipt OCR`, Financial & Accounting / Cloud Storage | Doc-intel + Dify extraction; ERPNext draft Purchase Invoice only; duplicate/math/confidence validation is mandatory |
| ERP-02 | P0 | Document review queue: low-confidence/mismatch → notify reviewer → approve/correct → continue | `human approval`, `document approval`, `invoice approval`, `approval workflow` | Reviewer acts in ERPNext/owned surface; workflow carries state/audit, not financial truth |
| ERP-03 | P0 | Manager approval via messaging buttons/links → update business record | `expense approval Telegram`, `purchase approval`, `Slack approval`, `WhatsApp approval` | Rebuild on WhatsApp + signed expiring one-time gateway actions; ERPNext Workflow remains source of truth |
| ERP-04 | P0 | Accounts-receivable reminder ladder: overdue invoice → scheduled reminders → stop on payment/reply | `invoice reminder`, `payment reminder`, `overdue invoice`, `dunning`, Financial & Accounting | ERPNext AR data; email/WhatsApp templates; frequency caps, business hours, opt-out/human takeover |
| ERP-05 | P1 | Sales document notifications: quotation/order/invoice created → customer/owner notification + PDF/link | `invoice created notification`, `sales order alert`, `send invoice WhatsApp/email` | ERPNext events/API polling only if webhooks unavailable; customer-safe templates |
| ERP-06 | P1 | Low-stock/reorder alert: stock below threshold → purchaser digest/draft purchase request | `low stock alert`, `inventory reorder`, `stock notification`, E-commerce/Business Process | ERPNext stock/bin data; draft Material Request/Purchase Order, no auto-buying |
| ERP-07 | P1 | CSV/data import cleansing: spreadsheet → validate/map/dedupe → import/error report | `CSV import`, `Google Sheets data cleaning`, `deduplicate contacts/products`, Data Processing | ERPNext Data Import/API; dry-run + row-level errors for customers/suppliers/items/opening stock |
| ERP-08 | P1 | Daily/weekly management digest: sales, receivables, stock, approvals → owner report | `business dashboard report`, `daily sales report`, `accounting report` | ERPNext reports/API; definitions and time zone explicit |
| ERP-09 | P2 | Bank/payment reconciliation assistance: payment notification/file → match candidate invoices → review | `payment reconciliation`, `bank transaction matching`, `invoice payment matching` | Suggestion-only; accountant confirms. Reject workflows requiring bank credentials or screen scraping |
| ERP-10 | P2 | ZATCA/e-invoice queue pattern: invoice finalized → generate/submit/report → retry/status | `e-invoice`, `invoice XML`, `tax invoice submission`, `invoice QR` | Pattern research only. Production route must follow verified ERPNext/ZATCA implementation and sandbox gate; never infer compliance from a generic workflow |

### 5.3 Product ② — Kemet Store / E-commerce

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation |
|---|---|---|---|---|
| STORE-01 | P0 | New order → owner/ops alert + customer confirmation/status message | `new order notification`, `Shopify order WhatsApp`, `WooCommerce order alert`, E-commerce & Retail | Bagisto order webhook/API; Evolution/Meta + email; include order state/idempotency |
| STORE-02 | P0 | Verified payment webhook → invoice/accounting handoff → retry queue | `payment webhook invoice`, `Stripe payment invoice`, `order paid accounting` | Bagisto + PSP webhook verification; ERPNext/ZATCA route when sold; browser success page is not a trigger |
| STORE-03 | P0 | Fulfillment status: shipped/out-for-delivery/delivered → customer notifications | `shipping notification`, `order tracking`, `delivery status WhatsApp` | Bagisto shipment/carrier events where available; template messages and tracking links |
| STORE-04 | P0 | Abandoned cart recovery: cart idle → consent check → reminder sequence → stop on order/opt-out | `abandoned cart`, `cart recovery WhatsApp/email`, E-commerce & Retail | Bagisto event to Mautic/WhatsApp; frequency/discount rules configurable; do not use Shopify-only assumptions without mapping |
| STORE-05 | P0 | Post-purchase review request: delivered order → private rating gate → Google review or support | `review request`, `Google review automation`, `post purchase feedback` | Marketing Suite Review Collector; unhappy customers go private/human, no review gating that violates policy—flag policy review |
| STORE-06 | P1 | Low-stock/out-of-stock alert and supplier reorder digest | `low inventory alert`, `out of stock notification`, `product stock report` | Bagisto inventory; optional ERPNext purchase handoff |
| STORE-07 | P1 | Product catalog import/enrichment: CSV/feed → validate/dedupe/translate/draft descriptions → store import | `product import CSV`, `AI product description`, `catalog enrichment`, Data Processing/E-commerce | Bagisto import/API; Dify drafts require review; image/attribute validation and rollback report |
| STORE-08 | P1 | Customer sync: store customer/order → CRM/Mautic segments with consent/source | `sync customers CRM`, `Shopify to CRM`, `ecommerce customer segmentation` | Mautic contact/company mapping; consent, dedupe, order value/frequency fields |
| STORE-09 | P1 | Refund/return workflow: request → status updates → accounting/support tasks | `refund notification`, `return request`, `order refund workflow` | Bagisto refund state + Chatwoot/ERPNext tasks; no automatic refund execution in n8n |
| STORE-10 | P1 | New product/promotion → draft social post + email campaign for approval | `new product social post`, `product launch email`, `RSS to social` | Dify drafts; Postiz/Mautic remain schedulers/senders; human approval |
| STORE-11 | P2 | Price/stock feed monitoring for the client's own suppliers/catalog | `price monitoring`, `product feed update`, `website change alert` | Only authorized feeds/APIs/pages; suggest changes, never silently overwrite prices |
| STORE-12 | P2 | Winback cohort: no order in X days → segment → campaign trigger | `customer winback`, `inactive customer`, `reactivation campaign` | Mautic journey; suppression/consent and margin-aware offer rules |

### 5.4 Product ③ — Kemet Receptionist / Service & Acquisition AI

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation |
|---|---|---|---|---|
| REC-01 | P0 | New webform lead → instant WhatsApp/email response + CRM record + owner alert | `lead WhatsApp`, `new lead notification`, `form to CRM`, `instant lead response`, CRM & Sales/Communication | Gateway form event; dedupe; lead timestamps prove response time; owner alert includes tap-to-contact details |
| REC-02 | P0 | WhatsApp inbound webhook → session/context → AI/RAG answer → reply/escalate | `WhatsApp chatbot`, `WhatsApp AI assistant`, `RAG chatbot webhook`, AI Agent Development | Keep process skeleton; Dify through gateway owns brain; Evolution/Meta channel; Chatwoot handoff |
| REC-03 | P0 | Lead qualification conversation: collect fields → score/status → CRM + owner summary | `lead qualification chatbot`, `lead scoring`, `qualify leads WhatsApp` | Configurable fields per niche; structured Dify extraction validated in gateway/n8n |
| REC-04 | P0 | Appointment booking: availability → create booking → confirm customer/staff | `book appointment chatbot`, `Calendar booking`, `Calendly WhatsApp` | Cal.com is truth; never let AI claim a slot without API confirmation |
| REC-05 | P0 | Appointment reminders + reschedule/cancel/no-show follow-up | `appointment reminder`, `no show follow up`, `Calendar reminder WhatsApp` | Cal events/schedules; client time zone/business hours; stop conditions |
| REC-06 | P0 | Follow-up ladder: unresponsive lead → Day 1/3/7 messages → stop on reply/booking/opt-out | `lead follow up sequence`, `WhatsApp follow up`, `drip campaign CRM` | Configurable cadence/templates; Chatwoot/human takeover cancels automation |
| REC-07 | P0 | Human handoff: low confidence/urgent/human request → conversation summary → inbox assignment/alert | `chatbot human handoff`, `summarize conversation`, `support escalation` | Chatwoot assignment/labels; summary includes intent, fields, urgency, transcript reference |
| REC-08 | P1 | KB ingestion: Drive/web/PDF changes → parse/chunk/index → approval/report | `RAG ingestion`, `Google Drive to vector database`, `website to knowledge base`, `PDF chatbot` | Doc-intel + Dify KB; source manifest/freshness/approval, no silent policy changes |
| REC-09 | P1 | Conversation classification/tagging: intent/sentiment/urgency → CRM/inbox labels + report | `classify messages AI`, `sentiment analysis chatbot`, `tag support tickets` | Dify classification; evaluation thresholds; avoid sensitive inferences |
| REC-10 | P1 | After-hours capture: inquiry outside hours → special response + next-business-day task/digest | `after hours lead`, `business hours chatbot`, `missed lead alert` | Tenant schedule/holidays; report after-hours captures as proof metric |
| REC-11 | P1 | Review/service recovery after appointment/order | `appointment feedback`, `customer satisfaction WhatsApp`, `review request` | Share Review Collector pattern with STORE-05; route dissatisfaction to humans |
| REC-12 | P1 | Weekly Receptionist report: response time, leads, bookings, handoffs, costs | `chatbot report`, `lead report`, `weekly CRM digest` | Gateway/Chatwoot/Cal/CRM data; owner-friendly definitions |
| REC-13 | P2 | FAQ gap mining: unanswered questions → clustered KB improvement list | `unanswered questions`, `chatbot analytics`, `conversation clustering` | Human approves KB additions; privacy-safe aggregation |
| REC-14 | P2 | Missed-call/voicemail-to-lead pattern, only with a lawful telephony provider | `missed call text back`, `voicemail transcription`, `call summary CRM` | Optional future module; recording/consent/cost gate. Do not let it delay WhatsApp/web v1 |

### 5.5 Product ④ — Kemet Websites / CMS Templates

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation |
|---|---|---|---|---|
| WEB-01 | P0 | Website form → spam checks → CRM/Receptionist → owner alert + visitor acknowledgement | `contact form CRM`, `form submission WhatsApp`, `website lead notification` | Owned gateway is entry point; dedupe/rate limit/consent; Payload submission record optional |
| WEB-02 | P0 | CMS content published → cache/sitemap/search notification + social draft | `WordPress publish social`, `blog published automation`, `sitemap update` | Payload hooks/webhooks; Postiz draft only after approval rules; no WordPress-specific core assumptions |
| WEB-03 | P1 | Blog/content pipeline: RSS/brief → AI draft/tag/translate → editorial approval → CMS draft | `AI blog post`, `auto tag blog`, `RSS to blog`, Creative Content | Dify drafts; human editor approval; plagiarism/fact/brand review; never auto-publish in v1 |
| WEB-04 | P1 | Image/media processing: upload → resize/compress/alt-text draft → media library report | `image optimization`, `generate alt text`, `Google Drive image resize` | Prefer Payload/app-level media pipeline; n8n only for batch/legacy imports |
| WEB-05 | P1 | Broken-link/SEO/page-change audit: crawl sitemap → errors/meta gaps → report | `SEO audit`, `broken link checker`, `sitemap monitor`, Web Scraping | Owned crawler/scraper patterns; schedule and rate-limit; report to care plan |
| WEB-06 | P1 | Website uptime/forms synthetic test: visit page/submit test form → alert on failure | `website monitoring`, `form test alert`, `uptime check` | Demo/client sites; test submissions clearly tagged/excluded from leads |
| WEB-07 | P1 | Content localization queue: source content changed → translation draft → editor approval | `translate blog`, `localization workflow`, `multilingual content` | Arabic/English/Turkish; Dify translation with glossary; no auto-publish |
| WEB-08 | P2 | Directory/Google Business Profile content reminder/checklist | `Google Business Profile post`, `local SEO automation`, `review monitoring` | Use official APIs/manual checklist where API access is limited; coordinate with Marketing Suite |

### 5.6 Product ⑤ — Kemet Marketing Suite: email, social, conversations

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation |
|---|---|---|---|---|
| MKT-01 | P0 | Contact import/sync: forms/store/CRM → normalize/dedupe/consent → marketing platform | `sync contacts email marketing`, `deduplicate contacts`, `CRM to Mailchimp/Mautic` | Mautic API; source/consent/suppression fields are mandatory |
| MKT-02 | P0 | Lead magnet/newsletter signup → double opt-in/tag/welcome journey trigger | `newsletter signup`, `lead magnet automation`, `welcome email sequence` | Mautic journey; Dify only drafts/personalizes within approved templates |
| MKT-03 | P0 | Behavioral segmentation/scoring: page/order/appointment events → score/tag/segment | `lead scoring automation`, `customer segmentation`, `tag contacts based on behavior` | Mautic scoring/segments; event contracts from ②③④; explainable rules |
| MKT-04 | P0 | Content calendar intake: approved post rows/media → schedule social posts → status/report | `social media scheduler`, `Google Sheets to social media`, `content calendar automation`, Social Media Management | Postiz API/n8n where verified; approval state owned by suite process; token/failure alerts |
| MKT-05 | P0 | Cross-posting/repurposing: blog/video/product → channel-specific drafts → approval → schedule | `RSS to social media`, `repurpose content`, `YouTube to social`, `blog to LinkedIn/Instagram` | Dify drafts; human approval; respect media/platform constraints and copyright |
| MKT-06 | P0 | Social publish failure/token watcher → retry/operator alert | `social media error notification`, `token expired alert`, `failed post` | Postiz/platform status; never silently drop scheduled content |
| MKT-07 | P0 | Unified inbox triage: DM/comment/email → classify/assign/label → AI draft → human approval/send | `social inbox automation`, `classify customer messages`, `AI reply social media` | Chatwoot + Dify; risky topics always human-approved; SLA timers |
| MKT-08 | P1 | Campaign performance report: email/social/ads-safe sources → normalized weekly/monthly report | `marketing report`, `email campaign report`, `social media analytics report` | Mautic/Postiz/Chatwoot/source systems; metric definitions and reconciliation |
| MKT-09 | P1 | Dormant customer reactivation: segment → multi-step email/WhatsApp journey → conversion/exit | `reactivation campaign`, `winback email`, `inactive subscribers` | Reach playbook in Mautic + approved WhatsApp; consent/frequency/margin rules |
| MKT-10 | P1 | Newsletter production: curated links/content → draft issue → approval → campaign | `newsletter automation`, `RSS newsletter`, `AI newsletter` | Mautic sends; editorial approval and source attribution |
| MKT-11 | P1 | Webinar/event/launch registration → reminders → attendance/no-show follow-up | `event registration automation`, `webinar reminder`, `launch sequence` | Optional industry recipe; Cal/Mautic/WhatsApp |
| MKT-12 | P2 | Top-performing content recycling: metrics → select winners → draft updated repost | `repost top content`, `social media analytics automation`, `evergreen content` | Avoid spam/duplicate penalties; human approval and cooldowns |
| MKT-13 | P2 | UGC/testimonial intake: form/mention → consent record → approval → content library | `testimonial collection`, `user generated content`, `customer review to social` | Written consent/versioned asset rights; no scraping private content |

### 5.7 Product ⑤ v2 — social intelligence, sentiment, reviews & competitor watch

| ID | Priority | Workflow pattern needed | Search pack | WebKMT adaptation / honesty gate |
|---|---|---|---|---|
| INT-01 | P1 | Own social comments/mentions collector → normalize → classify → inbox/alert | `Facebook comments`, `Instagram comments`, `social listening`, `mention monitoring` | Only connected/owned accounts through official APIs/Chatwoot/Postiz capabilities. “Near-real-time” only if webhooks/polling actually support it |
| INT-02 | P1 | YouTube channel/video comments/search monitor → sentiment/topic report | `YouTube comments`, `YouTube sentiment`, `monitor YouTube` | Official YouTube Data API and quota controls |
| INT-03 | P1 | Google review monitor → new/negative review alert → draft response → approval | `Google review notification`, `review monitoring`, `respond to reviews` | Google Business Profile/Places only where authorized/available; human response approval |
| INT-04 | P1 | RSS/news/blog brand-mention monitor → dedupe/classify → digest/alert | `RSS brand monitoring`, `news monitoring`, `Google Alerts automation`, Web Scraping | Lawful feeds/crawls; source allowlist and freshness shown |
| INT-05 | P1 | Sentiment/intent spike detector: rolling volume/negative ratio → urgent owner alert | `sentiment analysis alert`, `negative review alert`, `brand monitoring AI` | Dify classifier with labeled evaluation; thresholds/baselines configurable; no crisis auto-replies |
| INT-06 | P1 | Competitor website change watcher: scheduled fetch → hash/diff → price/promo/product alert | `website change monitoring`, `price change alert`, `competitor website tracking`, Web Scraping & Data Extraction | Public pages, robots/terms/rate limits; store evidence snapshot; owned Crawlee/scraper service may do collection outside n8n |
| INT-07 | P1 | Competitor content/RSS/social-public-page digest where official access exists | `competitor social monitoring`, `RSS competitor`, `YouTube competitor tracking` | No fake accounts/unofficial Instagram/TikTok scraping; label sampled/manual sources |
| INT-08 | P2 | Competitor review/rating tracker: periodic authorized counts → trend report | `competitor reviews`, `rating tracker`, `Google Places monitoring` | Places/API terms, caching/attribution and costs reviewed; aggregate trends only where required |
| INT-09 | P2 | Ad-library/creative monitoring assist | `Facebook ads monitoring`, `competitor ads`, `ad library` | Prefer manual/assisted official Ad Library checks if automation is not lawfully/API supported. Reject credential/session scrapers |
| INT-10 | P2 | X/Twitter listening pattern with a client-funded official API budget | `Twitter monitoring`, `X sentiment`, `tweet alerts` | PASS-THROUGH ONLY after current pricing/terms review; never a default/free suite promise |
| INT-11 | Reject by default | Reddit/TikTok/open-Instagram firehose, mass profile scraping, engagement bots | `Reddit scraping`, `TikTok scraper`, `Instagram scraper`, `auto like/follow/comment` | Do not shortlist except as rejected examples with legal/platform-risk notes |

---

## 6. Minimum first hand-pick set

Research these first because they unlock the build order and sales demos:

1. OPS-01 error handler
2. OPS-02 webhook idempotency
3. OPS-03 health checks
4. REC-01 instant lead response
5. REC-02 WhatsApp AI process skeleton
6. REC-03 lead qualification
7. REC-04 booking
8. REC-05 reminders
9. REC-06 follow-up ladder
10. REC-07 human handoff
11. REC-08 KB ingestion
12. WEB-01 website form routing
13. ERP-01 invoice intake/OCR
14. ERP-03 approvals
15. ERP-04 payment reminders
16. STORE-01 order alerts
17. STORE-04 abandoned cart
18. STORE-05 review request
19. MKT-01 contact sync/consent
20. MKT-04 content calendar/scheduling
21. MKT-07 inbox triage/AI draft
22. INT-03 review monitoring
23. INT-06 competitor website diff

Deliver a maximum of three audited candidates per capability. Quality and adaptation clarity beat volume.

---

## 7. Scoring rubric and knockout criteria

Score each shortlisted candidate out of 100. Show subscores; do not hide weaknesses in a single number.

| Criterion | Points | What earns points |
|---|---:|---|
| Business fit | 20 | Directly implements the capability/outcome with correct trigger, actors, stop conditions, and proof metric |
| Architecture fit | 15 | Maps cleanly to Dify/gateway/ERPNext/Bagisto/Chatwoot/Cal/Payload/Mautic/Postiz and source-of-truth rules |
| Reliability | 15 | Validation, idempotency, retries/backoff, pagination/rate limits, error branches, safe replay |
| Security & privacy | 15 | No embedded secrets/personal data, safe Code/HTTP, signed webhooks, least-privilege credentials, PII minimization |
| Maintainability | 10 | Clear node flow/names, standard nodes, reasonable node count, parameterized config, decomposable subflows |
| License/provenance & platform terms | 10 | Source/license understandable; official APIs; no ToS-evading scraping/messaging/engagement |
| Cost & replaceability | 5 | Self-hostable/free or transparent low marginal cost; paid nodes replaceable |
| Localization/tenancy | 5 | Arabic/English/Turkish strings, time zones, currencies, tenant config can be externalized |
| Testability/docs | 5 | Sample payloads, deterministic transforms, documented credentials/steps, easy sandbox proof |
| **Total** | **100** |  |

### Classification thresholds

- **80–100:** primary REBUILD candidate (still rebuild/sanitize; not blind import).
- **65–79:** fallback or partial-pattern candidate.
- **50–64:** reference-only unless it contains one exceptional subpattern.
- **<50:** reject.
- Any knockout below overrides the score.

### Automatic knockouts

Reject immediately if the workflow:

- Contains real-looking API keys, passwords, session cookies, private URLs, personal emails/phones, or customer data.
- Uses unexplained external HTTP endpoints, URL shorteners, pastebins, dynamic script downloads, `eval`/obfuscated/base64 payloads, crypto miners, or arbitrary shell/SSH commands.
- Restores/imports credentials, extracts browser/session cookies, bypasses CAPTCHA/anti-bot controls, rotates proxies to evade bans, or automates likes/follows/fake engagement.
- Requires unofficial client WhatsApp accounts, social-password login, or platform-ToS-evading scrapers for production.
- Sends marketing messages without consent/suppression/stop logic.
- Performs irreversible financial/payment/refund/account actions without validation/approval/idempotency.
- Hard-codes a single person's Google Sheet/Drive/account in a way that cannot be parameterized.
- Depends on an abandoned/unverifiable custom node for a security-critical path.
- Cannot be understood from its JSON because most logic is hidden in opaque external services/code.

---

## 8. JSON forensic checklist

For every shortlisted raw JSON, record:

### Provenance and metadata

- [ ] Exact site title, visible Copy ID if retrievable, GitHub folder/file name, numeric prefix, raw URL
- [ ] Site category, trigger, complexity, node count, listed integrations
- [ ] Search queries/filters that found it
- [ ] Date accessed and repository commit/branch if visible
- [ ] Any license/attribution/provenance clue; otherwise state “unverified — pattern rebuild only”

### Node graph

- [ ] Trigger type and whether workflow is marked active
- [ ] Node inventory by type/version; community/custom nodes flagged
- [ ] Main path, branches, loops/batching, merges, Wait nodes, subworkflow calls
- [ ] Error outputs, Error Trigger dependency, retry settings, timeout behavior
- [ ] Pagination, rate limiting, ordering, deduplication, stop conditions
- [ ] Binary/file handling, size/type assumptions, temporary storage

### Code and HTTP safety

- [ ] Every Code node summarized line-by-line at a functional level
- [ ] Every external domain/URL listed and justified
- [ ] HTTP methods/auth headers; credential names only, no secret values
- [ ] Execute Command/SSH/FTP/local file/database nodes flagged
- [ ] Dynamic code, obfuscation, credential exfiltration, telemetry, or unknown callbacks
- [ ] Prompt text and hard-coded business rules identified for replacement

### Data and operations

- [ ] Input/output schema examples (sanitized)
- [ ] PII/financial/health/sensitive fields and retention/logging risks
- [ ] Tenant/client identifiers and hard-coded account/sheet/channel IDs
- [ ] Credentials/services required and WebKMT substitutes
- [ ] Paid quotas/costs and failure modes
- [ ] Test payload and sandbox proof needed before rebuild

Do not paste secrets or real customer data into the research report. If JSON appears to contain secrets, stop, do not use them, and report only that the candidate was rejected for embedded-secret risk.

---

## 9. Required research deliverables

The research agent must produce the following files or clearly delimited report sections.

### A. Executive summary

- Coverage by product/capability: strong pattern found, partial, gap, rejected category.
- Top 10 patterns to rebuild first and why.
- Major unsafe/illegal/paid-dependency themes discovered.
- Capabilities that should be built directly from official APIs instead of adapting a workflow.

### B. Shortlist table

Use exactly these columns:

| Capability ID | Product/module | Priority | Exact workflow title | Site Copy ID (if verified) | Raw JSON URL | Category/trigger | Nodes | Main integrations | Score | Verdict | WebKMT substitution | Main risk |
|---|---|---|---|---|---|---|---|---:|---|---:|---|---|---|

### C. Workflow card for every shortlisted candidate

```markdown
## [Capability ID] — [Exact workflow title]

- Product/module:
- Business outcome:
- Site title / Copy ID:
- Raw JSON URL / GitHub path:
- Accessed:
- Search trail:
- Category / trigger / complexity / node count:
- Integrations and credential names:
- License/provenance status:

### Pattern summary
1. Trigger:
2. Validation/transformation:
3. External actions:
4. Branch/retry/error logic:
5. Output/audit:

### WebKMT adaptation map
| Source node/service | Replace with | Notes |
|---|---|---|
| | | |

### Required WebKMT subflows/config
- Tenant config fields:
- Environment/credential names (no values):
- Source-of-truth system:
- Idempotency key:
- Retry/dead-letter:
- Stop conditions:

### Security/privacy/platform-terms findings
- …

### Score
Business /20 · Architecture /15 · Reliability /15 · Security /15 · Maintainability /10 · License-terms /10 · Cost /5 · Localization-tenancy /5 · Testability /5 · Total /100

### Verdict
REBUILD / ADAPT IN SANDBOX / REFERENCE ONLY / REJECT

### Rebuild test plan
- Fixture payload:
- Happy path:
- Duplicate/replay:
- Invalid/unauthorized:
- Dependency failure:
- Arabic/time-zone case:

### Build estimate
Pattern reuse: [High/Medium/Low] · Rebuild complexity: [S/M/L] · Owner blockers:
```

### D. Rejection log

List notable rejected workflows/categories with one-line reasons, especially unsafe scrapers, credential workflows, fake-engagement bots, unofficial WhatsApp/social automation, and opaque mega-workflows. This prevents repeating bad research.

### E. Rebuild backlog

Order by product build sequence and dependency:

| Order | WebKMT workflow name | Capability ID | Source pattern | Systems involved | Shared subflows | Test fixture | Owner blocker |
|---:|---|---|---|---|---|---|---|

Suggested naming convention:

```text
WKMT_[PRODUCT]_[Capability]_[Trigger]_v1
Examples:
WKMT_REC_LeadIntake_Webhook_v1
WKMT_ERP_SupplierInvoiceIntake_Email_v1
WKMT_STORE_AbandonedCart_Schedule_v1
WKMT_MKT_CompetitorWatch_Schedule_v1
WKMT_SYS_ErrorNotify_ErrorTrigger_v1
```

### F. Gap list

For every capability with no suitable source pattern, state:

- Searches performed
- Why candidates failed
- Official API/docs to build from
- Proposed WebKMT workflow skeleton
- Whether n8n is even the right layer (gateway, source-system webhook, Dify, Mautic journey, Postiz, or a dedicated collector may be better)

---

## 10. Copy/paste prompt for the workflow research agent

```text
You are WebKMT's senior automation architect and open-source research agent. Your task is to hand-pick n8n workflow patterns from https://zie619.github.io/n8n-workflows/ and https://github.com/Zie619/n8n-workflows for five white-label products: (1) ERPNext-based ERP, (2) Bagisto e-commerce, (3) Dify+gateway+official WhatsApp/Chatwoot/Cal customer-service and client-acquisition AI, (4) Payload CMS template websites, and (5) Mautic+Postiz+Chatwoot Marketing Suite with lawful social intelligence and competitor tracking.

Read and obey docs/N8N_WORKFLOW_SELECTION_GUIDE.md, docs/AI_BUILD_PACK.md, docs/PRODUCT_STACK.md, and docs/OPEN_SOURCE_STACK.md. WebKMT is solopreneur-run, budget-constrained, PC-first/VPS-hosted, focused on SMBs and Saudi/Arabic use cases, and sells managed outcomes from open-source golden artifacts. n8n is an unexposed internal glue/reliability layer under its Sustainable Use License; Dify is the AI brain; ERPNext/Bagisto/Cal/Payload/Mautic/Postiz/Chatwoot own their business truth. Never recommend client n8n logins, white-labeled vendor consoles, unofficial WhatsApp for client numbers, ToS-evading scrapers, fake engagement, or social-listening firehoses that lawful APIs do not provide.

For the assigned capability IDs, search the site by business object/action/channel, synonyms, categories, triggers, complexity, and integrations; then verify candidates in GitHub/raw JSON. Titles/descriptions may be noisy—never choose from a card alone. Shortlist at most three candidates per capability. For each, record exact title, verified Copy ID if available, raw JSON URL/GitHub path, search trail, category/trigger/node count/integrations, node-by-node pattern, credential names, Code/HTTP/security findings, PII/platform-terms risks, paid dependencies, license/provenance status, WebKMT substitution map, required subflows/config, score using the guide's 100-point rubric, verdict (REBUILD, ADAPT IN SANDBOX, REFERENCE ONLY, REJECT), rebuild test plan, complexity, and owner blockers.

Treat community JSON as untrusted and license-unverified unless proven otherwise. Do not import workflows into production, activate webhooks, enter real credentials, use embedded secrets, or copy personal/customer data. Prefer clean pattern rebuilds using official APIs, standard nodes/HTTP, webhook signature validation, idempotency, bounded retries, dead-letter alerts, stop conditions, tenant configuration, Arabic/time-zone support, and source-of-truth discipline.

Deliver: executive summary, coverage matrix, exact shortlist table, one workflow card per candidate, rejection log, dependency-ordered rebuild backlog with WKMT_* names, and a gap list describing what to build directly from official APIs where no suitable workflow exists. Quality over volume. If evidence is missing, say “unverified” rather than inventing IDs, licenses, API behavior, or scores. Begin with the P0/minimum first hand-pick set unless I assign different capability IDs.
```

---

## 11. Owner review checklist

Before approving any rebuild from the shortlist, confirm:

- [ ] The workflow serves a named product/module and measurable client outcome.
- [ ] The raw JSON was actually inspected; title/ID/URL are exact and traceable.
- [ ] No knockout security, license, platform-terms, or unofficial-messaging issue exists.
- [ ] Every paid/proprietary dependency is justified or replaceable.
- [ ] Dify/source-system responsibilities are not duplicated inside n8n.
- [ ] Tenant config, credentials, idempotency, retries, error alerts, and stop conditions are designed.
- [ ] Arabic/time-zone/consent/PII cases have test fixtures.
- [ ] The rebuilt workflow will be exported sanitized to Git with a README and test payloads.
- [ ] The owner-only accounts/keys/approvals are listed without requesting secrets in chat.
- [ ] The expected demo/proof metric justifies build and support effort.

A workflow is not part of a WebKMT product merely because it was shortlisted. It becomes product IP only after a clean rebuild, tests, sanitized export, runbook, and clone checklist are complete.
