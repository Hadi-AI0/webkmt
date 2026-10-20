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
| [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) ~25k★ | Social-media scheduler (IG, TikTok, YT, LinkedIn, X…) with AI helpers | 🟡 AGPL-3.0 | Sellable "we schedule your content" add-on; also runs *your* build-in-public content queue | W · ~0.6 GB |
| [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise) ~40k★ / [langgenius/dify](https://github.com/langgenius/dify) 100k+★ | Visual LLM/RAG app builders | 🟢 Apache-2.0 (Flowise) · 🟠 Apache-2.0 + extra conditions (Dify — check multi-tenant/logo terms before reselling) | Use **one** *only if* a client needs custom AI pipelines beyond AnythingLLM (document processing, internal copilots). Don't start here | 1–2 wks · ~1–2 GB |

**Offer B golden combo:** Evolution API (Cloud API channel) + Chatwoot + AnythingLLM + Cal.com + n8n reminders. One deployment pattern, infinite clones.

---

## C. Websites, CMS & e-commerce — engines behind Offer A (+ stores)

| Repo | What it is | License | What you sell with it | Effort · RAM |
|---|---|---|---|---|
| [payloadcms/payload](https://github.com/payloadcms/payload) ~35k★ | Next.js-native headless CMS + admin + auth | 🟢 MIT | Your default CMS for template sites & small custom apps — full white-label freedom, matches your JS stack | W · ~0.3 GB |
| WordPress + WooCommerce *(not GitHub-first — wordpress.org)* | The pragmatic incumbent | 🟡 GPL | Use unapologetically when client needs a familiar store fast or local payment plugins (iyzico/PayTR etc.). You sell setup + care, not purity | S–W · ~0.3 GB |
| [medusajs/medusa](https://github.com/medusajs/medusa) ~27k★ | Headless commerce engine (Node) + admin | 🟢 MIT | Modern store for clients outgrowing Instagram DMs; pairs with Next.js storefront templates | 1–2 wks · ~0.6 GB |
| [bagisto/bagisto](https://github.com/bagisto/bagisto) ~10k★ | Laravel e-commerce (storefront+admin in one) | 🟢 MIT | Faster all-in-one store than Medusa when client wants "just a shop," multi-language incl. Arabic/RTL support | W · ~0.4 GB |
| [strapi/strapi](https://github.com/strapi/strapi) ~65k★ | Headless CMS (Node) | 🟠 MIT core; some EE features paid | Alternative CMS if client/team familiarity demands it — Payload preferred for new builds | W · ~0.4 GB |
| [withastro/astro](https://github.com/withastro/astro) + free themes (astro.new/themes) | Static-site framework, huge free theme ecosystem | 🟢 MIT (check each theme's license) | Offer A speed-run: pick niche theme → rebrand → add booking/WhatsApp → ship same-day | S · ~0 GB (static) |
| [ixartz/Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) ~10k★ | Production Next.js starter (auth, i18n, testing) | 🟢 MIT | Starting point for any custom web-app add-on work | S · n/a |
| [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) ~8k★ + [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Polished admin-dashboard template + component system | 🟢 MIT | Instant professional dashboards for custom internal tools (Offer C add-ons) | S · n/a |
| [marmelab/react-admin](https://github.com/marmelab/react-admin) ~25k★ | Admin framework over any REST/GraphQL API (has Supabase data provider) | 🟢 MIT | Throw a usable admin panel over a client's existing database/API in a day | S–W · n/a |

---

## D. Business systems — engines behind Offer C (ERP / CRM / POS / inventory / invoicing)

| Repo | What it is | License | What you sell with it | Effort · RAM |
|---|---|---|---|---|
| [frappe/erpnext](https://github.com/frappe/erpnext) ~30k★ (+ [frappe/hrms](https://github.com/frappe/hrms), [frappe/crm](https://github.com/frappe/crm), [frappe/lms](https://github.com/frappe/lms)) | Full ERP: accounting, inventory, manufacturing, POS, HR/payroll, CRM, helpdesk, LMS. **100% open, no enterprise edition.** Frappe framework is MIT | 🟡 GPL-3.0 | **Your flagship Offer C for businesses with stock/production.** Killer economics: one "bench" hosts *many client sites* (true multi-tenancy). Sell vs Odoo's per-user pricing | 1–2 wks first time (learn Frappe) · ~2–4 GB per bench (shared by many clients) |
| [Dolibarr/dolibarr](https://github.com/Dolibarr/dolibarr) ~6k★ | ERP/CRM for very small businesses: quotes, invoices, stock, POS (TakePOS), members, projects. No enterprise edition | 🟡 GPL-3.0+ | **Offer C "lite"** — freelancers, shops, small traders. Runs on almost nothing; simplest possible ERP sale | W · ~0.2–0.4 GB per client |
| [odoo/odoo](https://github.com/odoo/odoo) ~40k★ (Community) | The famous all-in-one suite | 🟡 LGPL-3.0 open-core (advanced accounting etc. = paid Enterprise) | Only when a client specifically asks for Odoo or needs its POS/app ecosystem. Know its CE limits before quoting | 1–2 wks · ~1–2 GB |
| [twentyhq/twenty](https://github.com/twentyhq/twenty) ~25k★ | Modern CRM (Salesforce-style, Notion-like UX) | 🟡 AGPL-3.0 (some premium features) | Standalone CRM for sales-driven clients (real estate!) + **your own agency CRM** | W · ~0.6 GB |
| [inventree/InvenTree](https://github.com/inventree/InvenTree) ~5k★ | Inventory & parts management (barcodes, BOMs, suppliers) | 🟢 MIT | Inventory-only sales to workshops/electronics/small manufacturers who recoil at full ERP | W · ~0.3 GB |
| [invoiceninja/invoiceninja](https://github.com/invoiceninja/invoiceninja) ~9k★ | Invoicing, quotes, client portal, payment links | 🟠 Elastic License (source-available): self-host free; **white-label needs paid plan** — use for *your* invoicing or as-is for clients | Your agency billing; sellable "invoicing system" for freelancers/agencies without rebranding | S · ~0.3 GB |
| [akaunting/akaunting](https://github.com/akaunting/akaunting) ~8k★ | Small-business accounting (invoices, expenses, banking) | 🟡 GPL-3.0 (some apps paid in their store — core is enough) | Accounting-lite for micro-businesses not ready for ERPNext | W · ~0.3 GB |
| [baserow/baserow](https://github.com/baserow/baserow) *(GitLab-primary)* | No-code database + app builder (Airtable alternative) | 🟢 MIT open-source edition (premium dirs separate) | Glue-ware: trackers, mini-CRMs, ops dashboards for clients; your prospect scoring | S · ~0.5 GB |
| [Budibase/budibase](https://github.com/Budibase/budibase) ~24k★ / [appsmithorg/appsmith](https://github.com/appsmithorg/appsmith) ~37k★ / [ToolJet/ToolJet](https://github.com/ToolJet/ToolJet) ~36k★ | Low-code internal-tool builders | 🟡 GPL-3.0 (Budibase) · 🟢 Apache-2.0 CE (Appsmith) · 🟡 AGPL (ToolJet) | Pick **one** for "internal tool" add-ons: admin panels, approval screens over client DBs — day-rate work at template speed | W · ~1 GB |

**Offer C golden combos:** *Micro:* Dolibarr + Uptime Kuma + backups. *Growth:* ERPNext bench (multi-client) + Chatwoot + n8n (invoice reminders) · *Sales teams:* twenty + Evolution API notifications.

---

## E. Sellable extras — high-perceived-value add-ons (attach to any offer)

| Repo | What it is | License | Sell it as | Effort · RAM |
|---|---|---|---|---|
| [documenso/documenso](https://github.com/documenso/documenso) ~11k★ | E-signature (DocuSign alternative) | 🟡 AGPL-3.0 | Your contracts; sell to law firms, real estate, HR — "sign from WhatsApp link" | S · ~0.4 GB |
| [formbricks/formbricks](https://github.com/formbricks/formbricks) ~10k★ | Surveys/forms & feedback (Typeform alternative) | 🟡 AGPL-3.0 | Client intake, satisfaction surveys after jobs, your testimonial collection | S · ~0.4 GB |
| [knadh/listmonk](https://github.com/knadh/listmonk) ~17k★ | Newsletter/email campaigns (single binary) | 🟡 AGPL-3.0 | "We run your offers newsletter" service (pair with a sending service — see note*) | S · ~0.1 GB |
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

1. **Phase 1 (factory):** Coolify → Uptime Kuma → Umami → n8n → Cal.com (or cal.com cloud free while learning) → your CRM (twenty/Baserow)
2. **Phase 1 (Offer B demo):** Evolution API v2.3.7 → Chatwoot → AnythingLLM → wire the clinic demo
3. **Phase 2:** Documenso (contracts) · Invoice Ninja or Dolibarr (your billing)
4. **On first sale only:** Dolibarr (Offer C lite) or ERPNext bench (Offer C) · Medusa/Bagisto (first store) · Postiz (first social add-on)
5. **Never all at once.** Each new service = RAM + updates + support surface. A tool earns its slot by being attached to a paying care plan.

> **Rule of the catalog:** if a repo isn't connected to a demo, an offer, or a paying client — it doesn't get installed. Star it on GitHub and move on.
