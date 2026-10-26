# WebKMT — Open-Source Stack Catalog

> **Purpose:** The vetted shortlist of open-source projects you can deploy, customize, and sell as ready-to-run client systems — mapped to the offers in [`RESCUE_PLAN.md`](./RESCUE_PLAN.md). Chosen for: maturity (real production use), self-hostability on a small VPS, license safety for reselling *services*, and fit for TR/GCC SMBs (WhatsApp-first, multi-language).
>
> **How to read the License column:**
> - 🟢 **Permissive (MIT/Apache/BSD)** — white-label, rebrand, resell freely (keep copyright notices).
> - 🟡 **Copyleft (GPL/AGPL/LGPL)** — free to host for clients and charge for setup/hosting/support. If you *modify* AGPL code and serve it, you must offer your modified source. **Safe pattern: configure + extend via plugins/APIs; don't fork-patch the core.**
> - 🟠 **Open-core / fair-code / source-available** — free CE exists but some features or resale rights are paid/restricted. Read the note.
> - 🔴 **Trap for your use case** — listed so you *avoid* building a sellable product on it.
>
> Star counts ≈ as of Oct 2026 (verify on GitHub before quoting). Effort = time to make it client-ready first time: **S**ame-day · **W**eekend · **1–2 wks**.

---

## A. The factory — infrastructure you run once (powers everything)

| Repo | What it is | License | Role for WebKMT | Effort · RAM |
|---|---|---|---|---|
| [coollabsio/coolify](https://github.com/coollabsio/coolify) ~55k★ | Self-hosted PaaS (Heroku/Vercel alternative), 280+ one-click services, auto-SSL, built-in backups | 🟢 Apache-2.0 | **Install first.** Your client-deployment panel: one project per client, most tools below deploy in 1 click | S · ~1 GB |
| [Dokploy/dokploy](https://github.com/Dokploy/dokploy) ~31k★ | Lighter PaaS alternative (Docker Swarm) | 🟢 Apache-2.0 core | Fallback if Coolify feels heavy on a tiny VPS — pick ONE, not both | S · ~0.4 GB |
| [louislam/uptime-Kuma](https://github.com/louislam/uptime-Kuma) ~70k★ | Uptime monitoring + status pages | 🟢 MIT | Monitor every client system; public status page = trust signal; feeds care-plan reports | S · ~0.1 GB |
| [umami-software/umami](https://github.com/umami-software/umami) ~27k★ | Lightweight web analytics (GA alternative) | 🟢 MIT | Analytics for your + all client sites; numbers for monthly reports | S · ~0.2 GB |
| [supabase/supabase](https://github.com/supabase/supabase) ~80k★ | Postgres + Auth + Storage + REST (self-hostable) | 🟢 Apache-2.0 | Backend for *your own* custom client apps when needed — self-host on VPS to dodge free-tier pausing/projects limit | W · ~1–2 GB |
| [restic/restic](https://github.com/restic/restic) ~28k★ | Encrypted backup tool | 🟢 BSD | Backup anything Coolify doesn't cover → Cloudflare R2 (10 GB free) | S · CLI |
| [filebrowser/filebrowser](https://github.com/filebrowser/filebrowser) ~30k★ | Web file manager/sharing | 🟢 Apache-2.0 | Simple per-client file delivery (designs, documents, exports) | S · tiny |

---

## B. The money stack — engines behind Offers B & D (WhatsApp AI + automation)

| Repo | What it is | License | What you sell with it | Effort · RAM |
|---|---|---|---|---|
| [evolution-foundation/evolution-api](https://github.com/evolution-foundation/evolution-api) ~9.6k★ | WhatsApp REST API — Baileys (unofficial) **and official Meta Cloud API** channels; native Chatwoot/Typebot/Dify integrations | 🟢 Apache-2.0 + attribution/usage-notice; ⚠️ **pin v2.3.7** (≥2.4.0 needs license activation) | The WhatsApp layer of Offer B. **Client numbers → official Cloud API only; Baileys = demo numbers (ban risk)** | W · ~0.5 GB |
| [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) ~25k★ | Omnichannel shared inbox (WhatsApp, web chat, email, IG/FB/Telegram), Intercom alternative | 🟠 MIT core; `enterprise/` features (Captain AI, **custom branding**, custom roles) are paid — CE inbox is fully usable; keep default branding | One instance → one account per client. The human-handoff inbox behind the AI receptionist; also sellable alone as "support inbox" | W · ~1–1.5 GB |
| [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) ~45k★ | RAG chat over documents/websites, multi-workspace, embeddable chat widget, agent tools | 🟢 MIT | **The "brain" of Offer B** — one workspace per client trained on their prices/FAQs/docs. Widget for websites + API for WhatsApp flows | S–W · ~0.5–0.8 GB |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) 100k+★ | Workflow automation (400+ integrations, AI nodes) | 🟠 Sustainable Use License: ✅ build/run client workflows on YOUR instance & charge for the work · ❌ white-label, sell access, or let clients edit workflows | All glue: reminders, lead routing, CRM sync, reports — for Offer D and your own ops. Sell *outcomes*, never "n8n accounts" | S–W · ~0.4 GB |
| [calcom/cal.diy](https://github.com/calcom/cal.diy) ~35k★ | Scheduling/booking (Calendly alternative) | 🟡 AGPL-3.0 (EE bits separate) | Booking layer for clinics/salons/services + your own audit-call booking. Host & charge for the service — don't fork-patch | W · ~0.5 GB |
| [typebot-io/typebot](https://github.com/typebot-io/typebot) ~9k★ | Visual conversational-form/chatbot builder (WhatsApp + web) | 🟡 AGPL-3.0 | Guided flows where AI free-chat is overkill: intake forms, lead qualification, order taking | S · ~0.4 GB |
| [mautic/mautic](https://github.com/mautic/mautic) ~10k★ | Full marketing automation: email campaigns, visual journeys, lead scoring, forms, landing pages (HubSpot-class) | 🟡 GPL-3.0 | **Email/journey core of the Marketing Suite** ([`PRODUCT_STACK.md`](./PRODUCT_STACK.md) ⑤) — per-client instance (single-tenant by design); brand the admin via themes, never use the Mautic name. ⚠️ Real ops weight (cron, upgrades; ~1.5 GB+ idle) and thin community funding — pin versions, quarterly upgrades, contacts always exportable | 1–2 wks · ~1.5–2 GB |
| [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) ~25k★ | Social-media scheduler (IG, TikTok, YT, LinkedIn, X…) with AI helpers | 🟡 AGPL-3.0 | **Social-scheduling core of the Marketing Suite** ([`PRODUCT_STACK.md`](./PRODUCT_STACK.md) ⑤): shared instance, workspace per client, run **unmodified** (AGPL) — clients never log in (white-label UI = paid Enterprise; your approvals/reports are the surface). Public API + n8n node for automation. ⚠️ Create your platform developer apps early — Meta/YouTube/TikTok approvals take weeks (once, for your agency app). Also runs *your* build-in-public queue | W · ~0.6 GB |
| [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise) ~40k★ / [langgenius/dify](https://github.com/langgenius/dify) 100k+★ | Visual LLM/RAG app builders | 🟢 Apache-2.0 (Flowise) · 🟠 Apache-2.0 + extra conditions (Dify — check multi-tenant/logo terms before reselling) | Visual chatbot/workflow builders for custom AI pipelines (document processing, internal copilots, AI store assistants). **Dify compliance pattern (its license bans multi-tenant operation + logo removal):** run Dify as a single-workspace backend behind your own API, or one instance per client — never sell workspaces on a shared instance; keep the Dify logo wherever its frontend shows. Use Flowise (clean Apache-2.0) when a client needs a builder of their own. **Client self-host handover:** ship pinned Dify docker-compose + exported DSL YAML (or `.ifpkg`) + KB source documents + setup script (difyctl / Knowledge API) + your frontend. DSL carries workflow/prompts/code-nodes but NOT credentials or KB content; cross-instance imports also drop knowledge-retrieval dataset links (re-create KB, re-link nodes). No codegen exists — leaving Dify means re-implementation. Marketplace templates = study material; sell your own rebuilt workflows, never a marketplace template verbatim | 1–2 wks · ~1–2 GB |

**Offer B golden combo:** Evolution API (Cloud API channel) + Chatwoot + AnythingLLM + Cal.com + n8n reminders. One deployment pattern, infinite clones.

#### How Dify is used in sellable products (the operating model)

Dify is a **factory tool, not the product.** What the client buys = your frontend + your workflow IP (prompts, KB design, business rules as DSL) + integrations + hosting/support. Rules:

1. **Layering:** Dify owns only the *AI brain* (prompts, RAG, intent routing, structured extraction, content generation). Channels/inbox = Evolution API + Chatwoot · process glue, triggers, retries = n8n · booking = Cal.com · email sending/journeys = Mautic (§B) · client-facing UI = yours. A thin **gateway you own** sits between the UI and Dify (auth, per-client config, rate limits) — it hides Dify and keeps you license-clean (single-workspace backend; clients never receive Dify logins).
2. **Productization:** one **golden workflow per product** — DSL kept in Git, versioned like a software release. Customization = parameters, not forks: the client's KB documents, tone/brand prompt variables, business-rule variables, enabled channels. Clone per client (import DSL → attach KB → set variables → connect channel); improvements ship as new DSL versions to every client under care plans.
3. **Delivery models:** default = **you host** (your instance, your one workspace, many client *apps* behind your gateway → MRR). Premium = **client self-host package** (see Dify row above). Never sell workspaces on a shared instance; never rebrand the Dify console.
4. **Economics & guardrails:** LLM tokens are billed via the client's own provider keys *or* priced into the monthly fee — with per-app usage alerts either way (n8n watchdog). Pin the Dify version; test workflow changes on a staging clone before publishing to client apps. Keep hard business rules (prices, booking validation) in the gateway/n8n — not buried in prompts — so your logic stays portable if you ever leave Dify.
5. **Product recipes:** *AI chatbot* = Dify brain (RAG + routing + field extraction) with Evolution/Chatwoot/Cal around it. *AI email marketing* = Dify as **content layer only** (campaign copy, per-segment personalization, reply classification) + Mautic as the engine (lists, journeys, scoring, deliverability, unsubscribe, analytics) + n8n triggers — Dify is not an email platform. *No LLM needed?* n8n alone. *Client wants their own visual builder?* Flowise, or Dify commercial license priced into the deal.

---

## C. Websites, CMS & e-commerce — engines behind Offer A (+ stores)

| Repo | What it is | License | What you sell with it | Effort · RAM |
|---|---|---|---|---|
| [payloadcms/payload](https://github.com/payloadcms/payload) ~35k★ | Next.js-native headless CMS + admin + auth | 🟢 MIT | Your default CMS for template sites & small custom apps — full white-label freedom, matches your JS stack | W · ~0.3 GB |
| WordPress + WooCommerce *(not GitHub-first — wordpress.org)* | The pragmatic incumbent | 🟡 GPL | **Fallback pick** — use unapologetically when client needs a familiar store fast or ready-made local payment plugins (iyzico/PayTR etc.). You sell setup + care, not purity | S–W · ~0.3 GB |
| [medusajs/medusa](https://github.com/medusajs/medusa) ~35k★ | Headless commerce engine (Node) + admin | 🟢 MIT (open-core) | Reserve for **custom/high-ticket builds** (subscriptions, custom apps, complex logistics) — headless = more dev per client and you translate/build the storefront yourself. Not the template-factory default | 1–2 wks · ~0.6 GB |
| [bagisto/bagisto](https://github.com/bagisto/bagisto) ~28k★ | Laravel e-commerce (storefront+admin in one) | 🟢 MIT | ⭐ **THE default store engine** — powers the gallery's "Shop Starter" template. All-in-one store incl. COD/bank-transfer checkout, native **Arabic + Turkish + full RTL**, multi-currency/channel, multi-warehouse inventory, B2B suite. Golden-image it (your theme + TR/AR locales + WhatsApp order alerts via n8n) and clone per client. **Known gap:** no official iyzico/PayTR module — build one reusable Laravel payment package, or use the WooCommerce fallback for TR-card-first clients. (Saudi: PayTabs/HyperPay/Tabby extensions exist — full compliance pack below.) | W · ~0.5–2 GB |
| [strapi/strapi](https://github.com/strapi/strapi) ~65k★ | Headless CMS (Node) | 🟠 MIT core; some EE features paid | Alternative CMS if client/team familiarity demands it — Payload preferred for new builds | W · ~0.4 GB |
| [withastro/astro](https://github.com/withastro/astro) + free themes (astro.new/themes) | Static-site framework, huge free theme ecosystem | 🟢 MIT (check each theme's license) | Offer A speed-run: pick niche theme → rebrand → add booking/WhatsApp → ship same-day | S · ~0 GB (static) |
| [ixartz/Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) ~10k★ | Production Next.js starter (auth, i18n, testing) | 🟢 MIT | Starting point for any custom web-app add-on work | S · n/a |
| [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) ~8k★ + [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Polished admin-dashboard template + component system | 🟢 MIT | Instant professional dashboards for custom internal tools (Offer C add-ons) | S · n/a |
| [marmelab/react-admin](https://github.com/marmelab/react-admin) ~25k★ | Admin framework over any REST/GraphQL API (has Supabase data provider) | 🟢 MIT | Throw a usable admin panel over a client's existing database/API in a day | S–W · n/a |
| [payloadcms/payload — `/templates`](https://github.com/payloadcms/payload/tree/main/templates) | Official Payload starter templates (website, e-commerce, blog) | 🟢 MIT | Ready-made bases for **Template Gallery** listings — rebrand & ship | S · n/a |
| WordPress.org theme directory | Thousands of free themes | 🟡 GPL | Gallery listings for clients who want WordPress familiarity | S · n/a |

*Template sourcing & license rules for the gallery (what you may deploy vs. resell, ThemeForest one-license-per-client, attribution templates): [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md) §3.*

#### 🇸🇦 Saudi store pack (ships inside the Bagisto golden image)

Most store clients are Saudi, and KSA e-commerce is tightly regulated. The legal duties belong to the **merchant** (CR or freelance certificate, store verification via Saudi Business Center — business.sa, linked **business** bank account, VAT registration, PSP accounts in their name) — the golden image must make compliance the default:

- **Payments (solved, no custom build):** Webkul **PayTabs** module (~$99 one-time — mada + Apple Pay + STC Pay) or the open-source **HyperPay** package (`devloopsnet/bagisto-hyperpay`); **Tabby** BNPL via the official Bagisto extension. Tamara/Moyasar = small custom module or via a gateway bundle. Set client expectations: ≈2.5–2.9% + SAR 1 per card sale (online mada cheaper); BNPL is effectively mandatory for conversion.
- **ZATCA Fatoora (the one real build):** Phase 1 = e-invoice + QR on simplified invoices (all VAT-registered, since Dec 2021). Phase 2 = UBL 2.1 XML + CSID cryptographic stamp + UUID/hash chain; B2B cleared in real time, B2C reported within 24h — Wave 24 (>SAR 375k taxable revenue) deadline passed 2026-06-30, Wave 25 (>SAR 187.5k) due 2027-02-01, so assume every VAT-registered client needs Phase 2. Two standard routes: **(a) flagship combo** — Bagisto takes orders/payments, **Kemet Business OS (ERPNext + ZATCA app, see [`ERP_PRODUCT.md`](./ERP_PRODUCT.md))** issues the compliant invoice (sync via API/n8n); **(b) standalone** — one reusable Bagisto ZATCA module (XML generation + TLV QR + CSID onboarding + reporting queue; invoice fired from the *payment webhook*, idempotent — never from the success page). Invoices must be **in Arabic** (authoritative text) — Bagisto locales cover this.
- **Storefront duties baked into the theme:** prices displayed **incl. 15% VAT**; footer block (merchant legal name, CR no., VAT no., address/contact); Arabic policy pages (shipping, 7-day returns per the E-Commerce Law, privacy/PDPL); National Address (short address) checkout fields; slot for the business.sa verification badge. Regulated products (SFDA cosmetics/food, Saber imports) stay the client's licensing problem — flag in discovery.
- **Positioning vs Salla/Zid:** don't fight them for micro-shops (they bundle compliance cheaply and win). White-label Bagisto wins on ownership (no lock-in/platform fees), B2B + multi-warehouse, custom features — and the bundle Salla can't sell: **store + Business OS (ERP) + WhatsApp AI receptionist + automations under one care plan.** Sales line: *"Salla rents you a shop; we build you an owned commerce system."*

---

## D. Business systems — engines behind Offer C (ERP / CRM / POS / inventory / invoicing)

| Repo | What it is | License | What you sell with it | Effort · RAM |
|---|---|---|---|---|
| [frappe/erpnext](https://github.com/frappe/erpnext) ~30k★ (+ [frappe/hrms](https://github.com/frappe/hrms), [frappe/crm](https://github.com/frappe/crm), [frappe/lms](https://github.com/frappe/lms)) | Full ERP: accounting, inventory, manufacturing, POS, HR/payroll, CRM, helpdesk, LMS. **100% open, no enterprise edition.** Frappe framework is MIT | 🟡 GPL-3.0 | **The base of your "Kemet Business OS" product (Offer C)** — full spec, editions, ZATCA/Arabic notes, and anti-Odoo sales math in [`ERP_PRODUCT.md`](./ERP_PRODUCT.md). Killer economics: one "bench" hosts *many client sites* (true multi-tenancy). Sell vs Odoo's per-user pricing | 1–2 wks first time (learn Frappe) · ~2–4 GB per bench (shared by many clients) |
| [Dolibarr/dolibarr](https://github.com/Dolibarr/dolibarr) ~6k★ | ERP/CRM for very small businesses: quotes, invoices, stock, POS (TakePOS), members, projects. No enterprise edition | 🟡 GPL-3.0+ | **Offer C "lite"** — freelancers, shops, small traders. Runs on almost nothing; simplest possible ERP sale | W · ~0.2–0.4 GB per client |
| [odoo/odoo](https://github.com/odoo/odoo) ~40k★ (Community) | The famous all-in-one suite | 🟡 LGPL-3.0 open-core (advanced accounting etc. = paid Enterprise) | Only when a client specifically asks for Odoo or needs its POS/app ecosystem. Know its CE limits before quoting | 1–2 wks · ~1–2 GB |
| [twentyhq/twenty](https://github.com/twentyhq/twenty) ~25k★ | Modern CRM (Salesforce-style, Notion-like UX) | 🟡 AGPL-3.0 (some premium features) | Standalone CRM for sales-driven clients (real estate!) + **your own agency CRM** | W · ~0.6 GB |
| [inventree/InvenTree](https://github.com/inventree/InvenTree) ~5k★ | Inventory & parts management (barcodes, BOMs, suppliers) | 🟢 MIT | Inventory-only sales to workshops/electronics/small manufacturers who recoil at full ERP | W · ~0.3 GB |
| [invoiceninja/invoiceninja](https://github.com/invoiceninja/invoiceninja) ~9k★ | Invoicing, quotes, client portal, payment links | 🟠 Elastic License (source-available): self-host free; **white-label needs paid plan** — use for *your* invoicing or as-is for clients | Your agency billing; sellable "invoicing system" for freelancers/agencies without rebranding | S · ~0.3 GB |
| [akaunting/akaunting](https://github.com/akaunting/akaunting) ~8k★ | Small-business accounting (invoices, expenses, banking) | 🟡 GPL-3.0 (some apps paid in their store — core is enough) | Accounting-lite for micro-businesses not ready for ERPNext | W · ~0.3 GB |
| [baserow/baserow](https://github.com/baserow/baserow) *(GitLab-primary)* | No-code database + app builder (Airtable alternative) | 🟢 MIT open-source edition (premium dirs separate) | Glue-ware: trackers, mini-CRMs, ops dashboards for clients; your prospect scoring | S · ~0.5 GB |
| [Budibase/budibase](https://github.com/Budibase/budibase) ~24k★ / [appsmithorg/appsmith](https://github.com/appsmithorg/appsmith) ~37k★ / [ToolJet/ToolJet](https://github.com/ToolJet/ToolJet) ~36k★ | Low-code internal-tool builders | 🟡 GPL-3.0 (Budibase) · 🟢 Apache-2.0 CE (Appsmith) · 🟡 AGPL (ToolJet) | **Decided: Appsmith** (Apache-2.0, free self-host, unlimited users) — staff-facing panels/approval screens over client DBs at template speed; full branding-removal is its paid tier (pass through only if a client demands it). Budibase/ToolJet rejected as defaults (white-label is paid; GPL/AGPL friction). See [`PRODUCT_STACK.md`](./PRODUCT_STACK.md) §3 (capability, not a headline product) | W · ~1 GB |

**Offer C golden combos:** *Micro:* Dolibarr + Uptime Kuma + backups. *Growth:* ERPNext bench (multi-client) + Chatwoot + n8n (invoice reminders) · *Sales teams:* twenty + Evolution API notifications.

---

## E. Sellable extras — high-perceived-value add-ons (attach to any offer)

| Repo | What it is | License | Sell it as | Effort · RAM |
|---|---|---|---|---|
| [documenso/documenso](https://github.com/documenso/documenso) ~11k★ | E-signature (DocuSign alternative) | 🟡 AGPL-3.0 | Your contracts; sell to law firms, real estate, HR — "sign from WhatsApp link" | S · ~0.4 GB |
| [formbricks/formbricks](https://github.com/formbricks/formbricks) ~10k★ | Surveys/forms & feedback (Typeform alternative) | 🟡 AGPL-3.0 | Client intake, satisfaction surveys after jobs, your testimonial collection | S · ~0.4 GB |
| [knadh/listmonk](https://github.com/knadh/listmonk) ~17k★ | Newsletter/email campaigns (single binary) | 🟡 AGPL-3.0 | Agency's own newsletter + tiny managed sends — **client email standard is now Mautic** (§B / PRODUCT_STACK ⑤); keep listmonk internal | S · ~0.1 GB |
| [freescout-help-desk/freescout](https://github.com/freescout-help-desk/freescout) ~3.5k★ | Shared email helpdesk (HelpScout alternative) | 🟡 AGPL-3.0 | Email-centric support desk for older-school businesses (Chatwoot covers most cases first) | S · ~0.2 GB |
| [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat) ~30k★ | Multi-model AI chat UI (ChatGPT-style, multi-user) | 🟢 MIT | "Private AI workspace for your team" — one login, their keys/models, your hosting fee | W · ~0.5 GB |
| [makeplane/plane](https://github.com/makeplane/plane) ~40k★ | Project management (Jira/Linear alternative) | 🟡 AGPL-3.0 | Internal use + client delivery transparency (share progress boards) | W · ~1 GB |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) ~50k★ | Web crawling → LLM-ready markdown | 🟢 Apache-2.0 | Prospect research + building client chatbot knowledge bases from their websites | S · CLI |
| [stonith404/pingvin-share](https://github.com/stonith404/pingvin-share) ~4k★ | Self-hosted file sharing (WeTransfer alternative) | 🟢 (check repo) | Branded large-file delivery for media/design clients | S · tiny |

*\*Email note: never self-host an SMTP server on the VPS (deliverability hell). Sending = free/cheap tiers of an ESP or the client's own Workspace/Zoho. Your domain email: Zoho Mail free tier or Cloudflare Email Routing.*

---

## F. 🔴 License traps — great tools, wrong for reselling (use internally only, or avoid)

| Project | Problem | Use instead / safe pattern |
|---|---|---|
| **NocoDB** | Switched AGPL → **Sustainable Use License (Jan 2026)**: internal use OK, *offering it as a managed service to third parties needs a commercial license* | **Baserow** (MIT core) for anything client-facing |
| **n8n** | No white-labeling, no selling access, clients can't use the editor | Run client workflows on *your* instance & charge for outcomes (explicitly allowed). If you ever need client-editable automation: **Activepieces** (MIT core) or **Windmill** (AGPL core) |
| **Directus** | Moved to a sustainable-core (source-available) license with resale restrictions | **Payload** (MIT) / **Strapi** |
| **Chatwoot** | Custom branding + Captain AI are paid Enterprise features | Ship CE with default branding; add *your* AI via AnythingLLM webhook flows instead of Captain |
| **Evolution API ≥ 2.4.0** | Requires activation against vendor licensing server | **Pin v2.3.7** (or evaluate their Go/Lite editions + attribution terms) |
| **Invoice Ninja** | White-labeling requires paid plan | Use as-is; or invoice from ERPNext/Dolibarr |
| **Open WebUI** | License now restricts removing branding | **LibreChat** (MIT) for white-label AI chat |
| *Anything "fair-code", "source-available", "BSL", "Elastic", "sustainable use"* | Assume resale is restricted until proven otherwise | Read `LICENSE` + vendor FAQ **before** quoting a client |

---

## G. AI fine-tuning — the honest footnote

You currently advertise training/fine-tuning custom models. Reality on $0 budget: clients almost never need it — they need RAG over their documents (= AnythingLLM, Offer B) + good prompts. If a genuine fine-tune ever appears: [unslothai/unsloth](https://github.com/unslothai/unsloth) on a rented GPU (Colab/Kaggle free tiers for experiments), quoted as paid discovery + project — never a headline offer. Local LLM serving for clients: not on a CPU VPS; use API models (Gemini free tier → paid is pennies per client).

Voice AI receptionists (phone calls) are the natural *future* upsell after Offer B works — when ready, look at [pipecat-ai/pipecat](https://github.com/pipecat-ai/pipecat) (BSD). Not now.

---

## H. Deployment order (matches RESCUE_PLAN §12)

1. **Phase 0 (your PC — build here first):** Docker Compose stacks per product + Git golden artifacts + Cloudflare Tunnel for webhooks ([`PRODUCT_STACK.md`](./PRODUCT_STACK.md) §1A) · **Phase 1 (VPS hosting):** Coolify → Uptime Kuma → Umami → n8n → Cal.com → your CRM (twenty/Baserow)
2. **Phase 1 (demos):** Evolution API v2.3.7 → Chatwoot → AnythingLLM (Offer B clinic demo) · **ERPNext bench** (your own agency invoicing + ERP demo site — [`ERP_PRODUCT.md`](./ERP_PRODUCT.md))
3. **Phase 2:** Documenso (contracts) · Dolibarr if a Lite client signs first (otherwise bill from ERPNext) · Template Gallery page + demo subdomains ([`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md))
4. **After base layer:** Bagisto golden-image demo store (`store-demo.webkmt.com`) · **On first sale only:** clone it · Postiz (first social add-on) · anything in §E

*Your VPS (2 vCPU / 8 GB / 100 GB) runs items 1–2 together at ~7 GB RAM — see the allocation rules in [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) §5.3 (swap, stopping idle demos, disk discipline).* 
5. **Never all at once.** Each new service = RAM + updates + support surface. A tool earns its slot by being attached to a paying care plan.

> **Rule of the catalog:** if a repo isn't connected to a demo, an offer, or a paying client — it doesn't get installed. Star it on GitHub and move on.
