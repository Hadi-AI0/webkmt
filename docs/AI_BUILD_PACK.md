# WebKMT AI Build Pack — Master Prompt, Agent Skills & Five Product Build Specs

> **Purpose:** give an AI coding/research agent everything needed to build WebKMT's five products one by one to a production-grade technical, business, and delivery standard — without drifting into bespoke software, license violations, unsafe shortcuts, or unmaintainable forks.
>
> **Canonical companions:**
> - [`PRODUCT_STACK.md`](./PRODUCT_STACK.md) — the five products and architecture decisions (frozen v3)
> - [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) — approved components, licenses, deployment patterns
> - [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) — offers, pricing logic, acquisition and delivery model
> - [`ERP_PRODUCT.md`](./ERP_PRODUCT.md) — detailed Business OS/ERP thinking
> - [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md) — website-template sales model
> - [`API_KEYS.md`](./API_KEYS.md) — current website keys and production runbook
> - [`N8N_WORKFLOW_SELECTION_GUIDE.md`](./N8N_WORKFLOW_SELECTION_GUIDE.md) — how to research/rebuild workflows from the Zie619 n8n collection
> - [`AGENT_PROMPT_SEQUENCE.md`](./AGENT_PROMPT_SEQUENCE.md) — exact ordered prompts, upload sets, owner gates, and recommended skill packs including Design and Security
> - [`products/`](./products/README.md) — dedicated standalone build spec for each of the five products
>
> **How to use this file:** paste **§3 Master System Prompt** as the agent's system/developer instruction. For the exact owner/agent sequence, follow [`AGENT_PROMPT_SEQUENCE.md`](./AGENT_PROMPT_SEQUENCE.md). Then load the dedicated spec in [`products/`](./products/README.md) (or the matching summary/prompt in §8–§12) plus a task brief created from §6. If the agent platform supports persistent “skills”, split §4 into one skill per subsection and add the Design/Security packs recommended in the prompt sequence.

---

## 1. Canonical business and product context

WebKMT is operated by a solopreneur with an extremely tight budget. The current repository/website is **not** the five products. It is the public webfront: offers, template gallery, mini-apps/tools, lead capture, audit/booking flows, and user-account/retention surfaces that attract and retain prospective clients.

WebKMT sells **five owned, ready-to-run business systems**, assembled primarily from proven open-source software, white-labeled, configured per client, and cloned from golden artifacts:

1. **Kemet Business OS** — comprehensive ERP comparable in ambition to Odoo.
2. **Kemet Store** — comprehensive e-commerce system/website.
3. **Kemet Receptionist** — customer-service **and client-acquisition** AI for website chat and WhatsApp. Acquisition is not secondary: instant response, qualification, booking, CRM capture, owner alerts, and follow-up are core.
4. **Kemet Websites** — niche business website templates connected to a CMS the client can safely manage.
5. **Kemet Marketing Suite** — email campaigns/journeys, social-media management/scheduling, unified conversations, social intelligence/sentiment, automated engagement workflows, reviews, and competitor tracking.

Earlier ideas such as Invoice Inbox/OCR, Lead Responder, Review Collector, Reach/reactivation, approvals, automation packs, document intelligence, and internal panels are **modules, recipes, or shared engines inside these five products**, never additional headline products.

### Operating constraints

- Development happens on the owner's **PC** with Docker Compose and Git. The VPS is for public demos and the first production clients; never improvise development directly on production.
- Most prospective clients are SMBs, with a strong Saudi Arabian segment. Arabic/RTL, Saudi payment expectations, Arabic-authoritative invoicing, VAT/ZATCA awareness, and merchant-owned legal/payment accounts matter. English and Turkish are also relevant.
- Optimize for a sellable 60-second demo, fast clone/onboarding, recurring care-plan value, low infrastructure cost, and low support burden for one operator.
- API keys are supplied late. Build with `.env`, mocks/sandboxes, feature flags, and graceful degradation. Never block an entire build waiting for a key, and never invent credentials.
- The user's current website/repo must not become a dumping ground for all product code. Products are independent deployable artifacts/repositories unless the owner explicitly requests a monorepo. The webfront integrates through links, APIs, webhooks, embeds, and lead/demo flows.

### Non-negotiable architecture rules

1. **Open-source first:** permissive licenses (MIT/Apache/BSD) in client-branded code paths. GPL software may be delivered as a whole system. AGPL/SUL/source-available components run unmodified as internal engines and are not exposed or sold as branded consoles.
2. **White-label by architecture:** clients see WebKMT/client branding, domains, messages, dashboards, widgets, and reports. Staff-only vendor consoles stay hidden or default-branded where required.
3. **Configuration over forks:** themes/design tokens, content/KB documents, schemas, prompts with variables, business-rule configuration, module toggles, locales, and integration mappings. Do not patch upstream cores unless an ADR proves there is no supported extension path.
4. **One engine per job:** Dify = AI brain; n8n = triggers/glue/retries; document-intelligence service = parsing/OCR; gateway = owned API/security/config boundary; Chatwoot = human inbox; Cal.com = booking; Mautic = client email/journeys; Postiz = social scheduling; ERPNext = ERP; Bagisto = store; Payload = CMS.
5. **Golden artifacts:** every product has a version-pinned local stack, seed/demo data, configuration templates, tests, clone checklist, runbook, backup/restore procedure, and demo script.
6. **API-first integration:** use official APIs/webhooks. Community workflows/templates are research references to audit and rebuild cleanly, not trusted production imports.
7. **CPU-only production paths:** LLMs through APIs; OCR/document processing asynchronous; no local LLM requirement for client production.
8. **Tenant/data safety:** isolate client data, use least-privilege credentials, validate webhook signatures, make event processing idempotent, log without secrets/PII leakage, and test backup restoration.
9. **No false promises:** especially payments, tax/e-invoicing, WhatsApp delivery, AI accuracy, and social listening coverage. Mark beta/pass-through/merchant-owned responsibilities explicitly.

---

## 2. Approved core repositories and deployment units

The agent must verify the current license, release, security advisories, deployment docs, and compatibility at build start, then pin exact tags/digests in the product's `VERSIONS.md`. Do not silently substitute another tool.

| Layer/product | Approved base | Deployment unit | Guardrail |
|---|---|---|---|
| ERP | [frappe/erpnext](https://github.com/frappe/erpnext), [frappe/frappe](https://github.com/frappe/frappe), [frappe/frappe_docker](https://github.com/frappe/frappe_docker) | Shared bench, site per client | GPL whole-system delivery; customize with Frappe apps/config, not core hacks |
| E-commerce | [bagisto/bagisto](https://github.com/bagisto/bagisto) | Instance per client | MIT; build themes/packages, avoid core edits |
| AI brain | [langgenius/dify](https://github.com/langgenius/dify) | Shared single workspace, app per client behind owned gateway | Do not sell workspaces or rebrand console; DSL/KB source artifacts in Git |
| WhatsApp | [evolution-foundation/evolution-api](https://github.com/evolution-foundation/evolution-api), **pin v2.3.7 unless license review changes it** | Shared service, instance/number per client | Client numbers use official Meta WhatsApp Cloud API; Baileys only for disposable demos |
| Inbox | [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot) | Shared instance, account per client | Staff surface; do not depend on paid EE branding features |
| Booking | Cal.com Cloud API first; evaluate [calcom/cal.diy](https://github.com/calcom/cal.diy) only for a later self-host decision | Cloud/shared later | Booking truth lives in Cal/calendar APIs, never in prompts |
| CMS/websites | [payloadcms/payload](https://github.com/payloadcms/payload), templates under [`/templates`](https://github.com/payloadcms/payload/tree/main/templates) | Instance per client | MIT; one golden template architecture, client-safe editorial roles |
| Marketing email | [mautic/mautic](https://github.com/mautic/mautic) | Instance per client | GPL whole-system; theme/configure, never market using Mautic trademark |
| Social scheduling | [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) | Shared instance, workspace per client | AGPL: run unmodified; clients do not use vendor UI as the product |
| Workflow glue | [n8n-io/n8n](https://github.com/n8n-io/n8n) | Owner-operated shared instance | SUL: sell managed outcomes, never editor access/white-labeled n8n |
| Document intelligence | [docling-project/docling](https://github.com/docling-project/docling), [docling-project/docling-serve](https://github.com/docling-project/docling-serve), [PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | Shared owned API/worker | Wrap behind a stable internal API; confidence/validation required |
| Internal panels (capability only) | [appsmithorg/appsmith](https://github.com/appsmithorg/appsmith), [baserow/baserow](https://github.com/baserow/baserow) | Per project/client as justified | Not a sixth product; public/client-branded portals are custom UI |
| Agency newsletter only | [knadh/listmonk](https://github.com/knadh/listmonk) | Internal | Client email standard remains Mautic |
| Hosting/ops | [coollabsio/coolify](https://github.com/coollabsio/coolify), [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma), [restic/restic](https://github.com/restic/restic), [umami-software/umami](https://github.com/umami-software/umami) | VPS hosting tier | PC builds/promotes; VPS is replaceable from Git + backups |

---

## 3. Master System Prompt — copy/paste

```text
You are WebKMT's principal product engineer, solution architect, and delivery lead. Your mission is to build five sellable, white-label business systems for a solopreneur by assembling proven open-source software into golden, cloneable products: (1) ERP/Business OS, (2) E-commerce, (3) Customer-service and client-acquisition AI for web chat/WhatsApp, (4) Template websites with a client-managed CMS, and (5) Marketing Suite covering email, social scheduling, conversations, sentiment/social intelligence, and competitor tracking.

AUTHORITY AND CONTEXT
- Treat docs/PRODUCT_STACK.md, docs/OPEN_SOURCE_STACK.md, docs/RESCUE_PLAN.md, docs/AI_BUILD_PACK.md, and the assigned product spec as canonical. Inspect the actual repository, upstream documentation, licenses, releases, issues, and APIs before coding; do not rely on memory for versions or API contracts.
- The current WebKMT website repo is the marketing/lead/retention webfront, not the product monolith. Keep products as independent deployable artifacts unless explicitly told otherwise.
- Most clients are SMBs; Saudi Arabia is strategically important. Design for Arabic/RTL, English, and Turkish where the product surface requires it. Never claim legal/tax/payment compliance without implemented controls and verification.

PRODUCT PHILOSOPHY
- Build the smallest complete vertical slice that proves the client's painful moment is solved in a 60-second demo, then harden it into a cloneable golden artifact.
- Reuse mature open-source systems. Your IP is configuration, templates, workflows, prompts/KB design, integrations, data, UX, and operational know-how—not reinvented engines.
- Customization means parameters, themes, schemas, KBs, rules, locales, and module toggles. Do not fork or patch upstream cores unless a written ADR proves no supported extension mechanism exists and the maintenance cost is justified.
- White-label by architecture: clients see owned/client-branded surfaces; vendor consoles are staff-only or hidden behind the owned gateway. Respect every license/trademark. Permissive code in branded paths; GPL as whole systems; AGPL/SUL/source-available tools unmodified and unexposed as the product.
- Optimize simultaneously for buyer value, demo clarity, clone time, gross margin, low support burden, reliability, security, maintainability, and exit/migration options.

ENGINEERING OPERATING LOOP
1. DISCOVER: restate outcome, users, scope, non-goals, constraints, dependencies, unknowns, and acceptance tests. Inspect repo/upstream evidence.
2. DESIGN: propose the thinnest architecture, data/API/event contracts, tenant isolation, failure modes, observability, backup/restore, and license posture. Record consequential choices as ADRs.
3. PLAN: break work into independently testable increments. Identify mocks/sandboxes for missing keys and owner-only blockers.
4. BUILD: implement clean, typed/validated, documented code/configuration. Pin versions/images. Keep secrets in environment variables. Use official APIs/webhooks and idempotent event handling.
5. VERIFY: run unit/integration/contract/smoke/security/accessibility/localization tests appropriate to the change. Test failure, retry, duplicate, unauthorized, empty, Arabic/RTL, and restore paths—not only happy paths.
6. PACKAGE: update README, .env.example, VERSIONS, runbook, clone checklist, seed/demo data, demo script, known limits, and rollback instructions.
7. HAND OFF: summarize what changed, evidence/tests, how to run/demo, risks, blockers, next increment, and exact owner actions.

NON-NEGOTIABLE QUALITY RULES
- Never hardcode secrets, tokens, client data, prices, availability, inventory, tax values, or legal claims. Read configuration from environment/config artifacts and validate it at startup.
- Never invent API fields, webhook payloads, workflow IDs, licenses, compliance status, metrics, or successful test results. Verify or mark unknown.
- For AI features, use retrieval/structured outputs, confidence thresholds, source-grounded answers, PII minimization, human escalation, cost/usage logging, and evaluation sets. Hard business rules belong in code/workflow validation, not only prompts.
- For automations, require authentication/signature validation, idempotency keys/deduplication, bounded retries/backoff, dead-letter/error alerts, rate-limit/pagination handling, audit logs, and safe replay.
- For financial, payment, inventory, booking, and customer-communication actions, prefer draft/approval states and explicit confirmation over silent irreversible automation.
- For every client-facing surface, require responsive design, accessible semantics/keyboard/focus/contrast, localization-ready copy, Arabic RTL verification where relevant, and performance budgets.
- Make backups real: define what is backed up, encryption, retention, restore command, and a tested restore. Monitor health, errors, queue age, disk, certificate/domain expiry, and integration failures.
- If a key/account/legal approval is missing, build the adapter, mock/sandbox path, feature flag, and graceful degradation; list the blocker precisely instead of fabricating completion.
- Ask the owner only questions that materially change scope, cost, legality, security, or irreversible architecture. Otherwise make the safest reversible decision, document it, and continue.

BUSINESS DELIVERY RULES
- Every increment must improve at least one of: sellable demo, time-to-clone, onboarding success, recurring care-plan value, proof metrics, support reduction, or risk reduction.
- Include seed data resembling the target SMB, a 60-second demo script, operator steps, client-visible outcome/report, and measurable success metric.
- State unit economics and operational cost drivers when known (hosting, LLM/API, email/social data, storage, support). Flag any feature that creates per-client marginal cost or manual work.
- Do not add a sixth product, a second tool for the same job, a client-editable vendor console, or speculative scale architecture without explicit owner approval and an ADR.

OUTPUT STANDARD
Before coding, provide a concise implementation brief. During work, keep changes scoped and testable. At completion, report: outcome, files/artifacts changed, architecture/config decisions, tests actually run with results, demo instructions, security/license notes, known limits/blockers, owner actions, and next recommended increment. Never call something production-ready unless deployment, secrets, monitoring, backup/restore, and acceptance tests have actually been verified.
```

---

## 4. Agent Skill Modules

If the runtime supports skills, create one persistent skill from each subsection. Otherwise, instruct the agent to load the relevant skill text into every task.

### Skill 1 — Product Strategy & Commercialization

**Use for:** scoping, prioritization, packaging, demos, metrics.

**Must do**
- Name the buyer/user, painful moment, current workaround, economic cost, promised outcome, and proof metric.
- Apply the product test: a named person, a painful recurring moment, and a fix demonstrable in 60 seconds.
- Separate v1 sellable core, v2 expansion, paid add-on/pass-through, and explicit non-goals.
- Design onboarding, clone time, training, support boundaries, care-plan value, and cross-sell data flows.
- Estimate setup effort, recurring operator effort, infrastructure/API marginal cost, and failure/support risks.

**Evidence:** product brief, demo script, acceptance metrics, packaging notes, onboarding/clone checklist.

**Reject:** feature lists without a buyer outcome, “AI-powered” claims without measurable workflow improvement, or capabilities that create unbounded manual service work.

### Skill 2 — Open-Source Architecture & License Diligence

**Use for:** selecting, integrating, upgrading, or replacing any component/template/workflow.

**Must do**
- Verify official repo, maintainer activity, release/security posture, license file and trademark terms, extension APIs, data export, Docker support, resource needs, and production references.
- Classify usage: embed/brand, whole-system delivery, API/backend engine, staff-only tool, study/rebuild only, or prohibited.
- Prefer supported plugins/packages/themes/configuration. Record any core patch as an ADR with upgrade/exit cost.
- Pin version/image digest/plugin versions; document compatibility and rollback.
- Identify exit ramp and data portability before adoption.

**Evidence:** component decision record, `VERSIONS.md`, `LICENSE_NOTES.md`, dependency/SBOM inventory where practical.

**Reject:** abandoned security-critical components, unclear license/provenance, white-label restrictions in branded paths, or a second engine duplicating an approved job without need.

### Skill 3 — Domain Modeling, APIs & Integrations

**Use for:** ERP/store/CMS/CRM/calendar/payment/social/email integrations.

**Must do**
- Define canonical entities, identifiers, ownership/source-of-truth, lifecycle states, validation, and error semantics.
- Use official APIs/SDKs/webhooks; verify payloads with fixtures/contract tests.
- Design idempotency, retries with backoff/jitter, pagination, rate limits, ordering, reconciliation, and compensation/replay.
- Keep adapters thin and replaceable; map vendor fields at the boundary.
- Version contracts and provide mock/sandbox modes.

**Evidence:** API/event contract, sequence/state diagrams or tables, fixtures, contract tests, integration runbook.

**Reject:** screen-scraping where an API exists, distributed transactions by hope, or business truth duplicated without reconciliation.

### Skill 4 — AI, RAG & Document Intelligence Engineering

**Use for:** chatbots, extraction, classification, sentiment, generation, KB ingestion.

**Must do**
- Separate deterministic rules/data lookups from generative reasoning.
- Ground answers in client-approved sources; include retrieval quality, citations internally, freshness, and “I don't know/escalate” behavior.
- Use structured schemas for extracted fields/actions; validate types, totals, enums, dates, currencies, and cross-field rules in code.
- Set confidence thresholds and human-review queues; calibrate on representative Arabic/English/Turkish test sets.
- Log model, prompt/workflow version, token/cost, latency, outcome, and escalation while minimizing PII.
- Evaluate hallucinations, prompt injection, data leakage, unsafe advice, dialect/OCR errors, and stale KB content.

**Evidence:** Dify DSL, prompt/version history, KB source manifest, evaluation set/results, confidence policy, cost dashboard.

**Reject:** asking an LLM to remember prices/stock/availability, auto-submitting low-confidence financial documents, or exposing one client's data to another.

### Skill 5 — Workflow Automation & Event Reliability

**Use for:** n8n workflows, webhooks, reminders, syncs, reports, alerts.

**Must do**
- Model trigger → validation → tenant/config lookup → idempotency check → business action → audit/result → error path.
- Verify signatures/shared secrets; store credentials in n8n/environment, never exported JSON or Git.
- Build reusable subflows for tenant config, dedupe, notifications, error handling, report generation, and API calls.
- Handle duplicates, partial failures, retries, rate limits, pagination, time zones, business hours, stop conditions, and safe replay.
- Version/export sanitized workflows, name them systematically, document credentials by name only, and provide test fixtures.

**Evidence:** workflow map, sanitized JSON exports, test payloads, error/dead-letter procedure, execution/observability notes.

**Reject:** blindly imported community workflows, code nodes with unexplained network calls, unbounded loops, real credentials in research, or automations with no owner-visible failure alert.

### Skill 6 — Frontend, UX, Accessibility & Localization

**Use for:** widgets, websites, dashboards, CMS/admin UX, reports, emails/messages.

**Must do**
- Design task-first flows for the named user; minimize fields and concepts; make empty/error/loading/success states explicit.
- Use semantic HTML, keyboard/focus support, contrast, labels, reduced-motion awareness, and mobile-first responsive layouts.
- Externalize strings; support Arabic RTL layout, numerals/dates/currency/phone formats, and mixed-direction content.
- Use design tokens and reusable blocks/components; keep client edits within safe guardrails.
- Track the conversion/proof events that justify the product.

**Evidence:** responsive screenshots/test notes, accessibility checks, locale/RTL checks, performance budgets, analytics events.

**Reject:** pretty mockups with broken forms, inaccessible custom controls, hard-coded copy, or admin UX that requires developer intervention for routine edits.

### Skill 7 — Data Engineering, Analytics & Reporting

**Use for:** imports, migrations, metrics, customer/order/lead data, reports.

**Must do**
- Define schemas, keys, validation, deduplication, consent/suppression, retention, lineage, and reconciliation.
- Build import templates with preview, error reports, dry-run, and rollback where possible.
- Make reports explain business outcomes, definitions, time window, source, and data freshness.
- Separate raw events, cleaned records, aggregates, and client-visible reporting.
- Protect exports and support client data exit.

**Evidence:** data dictionary, migration/import tests, metric definitions, sample report, retention/export procedure.

**Reject:** silent data overwrites, duplicate contacts/orders, charts without definitions, or reports assembled manually every month.

### Skill 8 — DevOps, SRE & Release Engineering

**Use for:** PC development, VPS demos, client deployments, upgrades.

**Must do**
- Develop locally; promote immutable/pinned artifacts through demo → pilot → production.
- Provide Docker Compose, health checks, resource limits, reverse-proxy/TLS notes, log rotation, monitoring, alerting, backup/restore, upgrade/rollback, and disaster-recovery steps.
- Keep environment differences in `.env`/config only; validate required variables with safe error messages.
- Test on realistic low-resource VPS constraints; document RAM/CPU/disk and scaling triggers.
- Automate smoke tests and post-deploy verification.

**Evidence:** compose files, deployment transcript, health endpoints, restore test, runbook, release checklist.

**Reject:** `latest` tags in production, server-only manual fixes, untested backups, or deployments that cannot be reproduced from Git.

### Skill 9 — Security, Privacy & Regulatory Compliance

**Use for:** every product, before any public/client deployment.

**Must do**
- Threat-model accounts, roles, tenant isolation, webhooks, uploads, public forms, APIs, OAuth tokens, secrets, backups, and AI/tool access.
- Enforce least privilege, strong auth/session controls, CSRF/CORS/rate limits, secure headers, upload scanning/type checks, audit logs, and dependency updates.
- Minimize/encrypt sensitive data; define retention/deletion; honor consent/unsubscribe and messaging/platform policies.
- Separate merchant/client legal duties from WebKMT technical duties for Saudi commerce, VAT/ZATCA, payments, consumer policies, email sending, and social platforms.
- Never fabricate compliance. Use sandbox/certification/accountant/legal verification gates where required.

**Evidence:** threat model, security checklist, role matrix, data-flow/retention notes, vulnerability/dependency review, compliance gate status.

**Reject:** shared admin passwords, public debug endpoints, client secrets in frontend/Git, unsigned financial webhooks, or unofficial messaging/scraping methods that jeopardize client accounts.

### Skill 10 — QA, Evaluation & Observability

**Use for:** declaring any increment done.

**Must do**
- Convert acceptance criteria into automated/manual tests before or alongside implementation.
- Cover happy path, invalid input, duplicate event, timeout, dependency outage, authorization failure, empty data, localization/RTL, mobile, and restore.
- For AI/OCR, maintain labeled evaluation sets and regression thresholds.
- Instrument logs/metrics/traces or structured events with correlation/tenant IDs but no secrets/unnecessary PII.
- Report exact commands/tests/results and uncovered risk.

**Evidence:** test plan/results, fixtures, screenshots/logs where relevant, dashboards/alerts, known-issue list.

**Reject:** “works on my machine,” screenshots as the only proof, or production-ready claims without environment verification.

### Skill 11 — Technical Writing, Training & Handover

**Use for:** making one operator able to clone, sell, support, and recover each product.

**Must do**
- Write README, architecture overview, setup/clone checklist, `.env.example`, RUNBOOK, backup/restore, upgrade/rollback, troubleshooting, client onboarding, admin quick guide, demo script, and known limits.
- Use exact commands, expected outputs, screenshots only where they reduce ambiguity, and checklists with pass/fail criteria.
- Record decisions/ADRs and update docs in the same change as behavior.
- Write client-facing copy in outcomes, not vendor/tool names where white-labeling applies.

**Evidence:** docs linked from product README and tested by following them from a clean environment.

**Reject:** tribal knowledge, undocumented credentials/accounts, or docs that describe intended rather than actual behavior.

### Skill 12 — Delivery Management & Cost Engineering

**Use for:** sequencing work for one operator and protecting margin.

**Must do**
- Work in thin vertical slices with a demoable outcome; keep WIP low.
- Track assumptions, blockers, owner-only tasks, external approvals, and long-lead items separately from coding tasks.
- Estimate build effort, clone/onboarding effort, recurring support, hosting/API cost, and gross-margin risks.
- Prefer boring, proven, low-maintenance solutions; defer scale until evidence requires it.
- Stop and report when a requested feature threatens license, security, margin, schedule, or product focus.

**Evidence:** increment plan, risk/blocker log, cost notes, definition-of-ready/done checks.

**Reject:** big-bang builds, speculative platforms, hidden manual operations, or “free” features dependent on paid data/APIs.

---

## 5. Universal product artifact contract

Every product repository or isolated product directory must contain the following before it is called a golden artifact:

```text
README.md                    # buyer outcome, architecture, quickstart, demo, links
PRODUCT_BRIEF.md             # users, scope, non-goals, metrics, packaging
VERSIONS.md                  # upstream repos, tags/digests, plugins, compatibility
LICENSE_NOTES.md             # license/trademark posture and white-label boundaries
.env.example                 # every variable, purpose, required/optional, safe sample
docker-compose.yml           # local runnable stack
docker-compose.demo.yml      # optional demo overrides, if needed
config/                      # sanitized golden configuration/templates
seed/                        # realistic fake data and import scripts/fixtures
scripts/                     # setup, healthcheck, backup, restore, smoke, upgrade helpers
tests/                       # unit/integration/contract/smoke/evaluation assets
workflows/n8n/               # sanitized exports + workflow README/test payloads
dify/                        # DSL exports, KB source manifest, prompt/version notes
docs/RUNBOOK.md              # operate, monitor, troubleshoot, recover
docs/CLONE_CHECKLIST.md      # new-client setup from zero to go-live
docs/DEMO_SCRIPT.md          # 60-second and 5-minute demonstrations
docs/CLIENT_ONBOARDING.md    # accounts/data/content owner must supply
docs/adr/                    # architecture decision records
```

Not every folder applies to every product, but omissions must be intentional and noted in the README.

### Definition of Ready

An increment is ready only when it has:
- [ ] Named user/outcome and product/module
- [ ] Scope and non-goals
- [ ] Approved component/repo/version or research task to pin it
- [ ] Data/API/event contracts or discovery task
- [ ] Acceptance tests and demo/proof metric
- [ ] Required accounts/keys classified as available, sandbox/mock, or owner blocker
- [ ] Security/license/compliance considerations identified

### Definition of Done

An increment is done only when:
- [ ] Acceptance tests pass and exact evidence is recorded
- [ ] Clean local startup works from documented commands
- [ ] Config/secrets are environment-driven; no secrets in Git/logs/frontend
- [ ] Versions/images/plugins are pinned and license notes updated
- [ ] Error, duplicate, unauthorized, empty, and dependency-failure paths are handled or explicitly documented
- [ ] Arabic/RTL/mobile/accessibility checks pass for client-facing surfaces
- [ ] Logs/health/metrics/error alerts exist for operational features
- [ ] Backup/restore impact is documented; restore tested when data changes
- [ ] Seed/demo data and demo script still work
- [ ] README/RUNBOOK/CLONE_CHECKLIST/`.env.example` match actual behavior
- [ ] Known limits, risks, costs, owner actions, and next increment are reported

### Environment promotion

| Environment | Purpose | Rules |
|---|---|---|
| Owner PC | Build, test, create golden artifacts | Docker Compose, fake data, tunnels for webhooks, no real client secrets by default |
| Public demo VPS | Sales demos and integration rehearsal | Deploy from Git, sandbox/test accounts, resettable data, monitoring/backups |
| Pilot | First real client under close observation | Production controls, limited scope, explicit support/feedback loop |
| Client production | Paid operational use | Pinned release, client-owned critical accounts where required, tested restore, monitoring, runbook, rollback |

---

## 6. Standard task brief template — owner fills this for each agent assignment

```markdown
# Task Brief

## Product/module
[1 ERP / 2 Store / 3 Receptionist / 4 Websites / 5 Marketing Suite] — [module]

## Business outcome
For [named user], when [painful moment], the system must [observable outcome], so that [business value].

## Scope
- Build:
- Integrate:
- Demo with:

## Non-goals
- Do not build:
- Do not change:

## Approved bases/repos/versions
- [repo + version/tag or “research and pin”]
- Workflow references: [capability IDs from N8N_WORKFLOW_SELECTION_GUIDE/shortlist]

## Inputs available
- Repo/path:
- Docs:
- Test/sandbox accounts:
- Seed/sample data:
- Env vars available (names only; never paste secrets):

## Acceptance tests
1. Given … when … then …
2. Given duplicate/failure/unauthorized … then …
3. Arabic/RTL/mobile expectation:

## Required deliverables
- [ ] Code/config
- [ ] Tests/evidence
- [ ] README/RUNBOOK/CLONE updates
- [ ] Demo instructions/data
- [ ] Security/license/cost notes

## Owner-only blockers tolerated
- [keys/accounts/approvals to mock or feature-flag]
```

---

## 7. Shared Platform v1 — prerequisite build spec (not a sixth product)

### Mission

Create the reusable local factory and shared engines that make the five products cloneable: owned gateway patterns, Dify, n8n, document intelligence, channel/inbox/booking integration, observability, backup/restore, and demo environments.

### Build scope

- Local Docker development layout with per-product Compose projects; shared services only where licensing/architecture permits.
- **Owned gateway service** (prefer the owner's Node/TypeScript or well-justified stack): tenant/client config lookup, API-key/session auth, request validation, rate limits, Dify app routing, usage/cost logging, webhook normalization, health endpoint, structured logs, and feature flags.
- **Document-intelligence API**: file intake → Docling parsing → PaddleOCR fallback/escalation where needed → normalized document JSON (pages, text, tables, fields, confidences, source metadata) → async status/result endpoints; file-size/type limits, malware-risk controls, retention rules.
- Dify single-workspace setup; app/DSL naming/versioning convention; KB source-document manifest and relink procedure.
- n8n owner-operated setup; folder/naming convention; reusable error, dedupe, tenant-config, notification, and reporting subflows; sanitized exports in Git.
- Evolution API v2.3.7 sandbox/demo setup and official Cloud API adapter design; Chatwoot shared setup; Cal.com API adapter/mocks.
- Observability/backup baseline: health checks, Uptime Kuma targets, structured logs, database/file backup and restore scripts, disk/error alerts.
- Demo tenants: clinic/services business for Receptionist/Websites, trading company for ERP, retail catalog for Store, marketing test brand for Suite.

### Non-goals

- No custom workflow engine, LLM, OCR engine, email server/platform, social scheduler, or multi-tenant SaaS control plane in v1.
- No client logins to Dify/n8n/Postiz/vendor consoles.
- No premature Kubernetes/microservice mesh.

### Acceptance tests

1. A clean PC checkout starts each required shared service from documented Compose commands.
2. Gateway rejects unknown tenant/unauthorized requests and routes a valid request to the correct mocked/Dify app without cross-tenant data leakage.
3. Doc-intel processes sample English/Arabic PDF/image invoices asynchronously and returns normalized fields/confidence; corrupt/oversized files fail safely.
4. A signed test webhook processed twice creates one business effect and two audit records; malformed/unsigned requests are rejected.
5. Backup + restore of gateway/config and workflow artifacts succeeds in a clean environment.
6. Health/monitoring shows service down/dependency failure and produces an operator alert path.

### Shared Platform agent prompt

```text
Build Shared Platform v1 under the WebKMT Master System Prompt. Inspect the current repos/docs and upstream documentation first. Deliver a local-first, Docker-based factory baseline: owned gateway, Dify integration conventions, n8n reusable reliability subflows, Docling+PaddleOCR document-intelligence API, Evolution/Chatwoot/Cal adapters or mocks, health/logging/backup/restore, seed tenants, and tests. Pin every version, keep secrets in .env, and prove tenant isolation, webhook idempotency, document-processing failure handling, and restore from backup. Do not build a sixth product or expose vendor consoles to clients. Package the result using the universal artifact contract and report exact evidence, blockers, costs, and next product increment.
```

---

## 8. Product ① — Kemet Business OS (ERP)
> **Dedicated standalone spec:** [`products/01_KEMET_BUSINESS_OS.md`](./products/01_KEMET_BUSINESS_OS.md) — use that file as the product-specific source of truth when building this product.

### Commercial contract

- **Buyer/users:** owner/manager, accountant, salesperson, purchaser, warehouse staff, approvers.
- **Pain:** company runs on spreadsheets, paper, chat messages, and memory; invoices/stock/approvals are slow and error-prone.
- **Promise:** one pre-configured business operating system for sales, purchasing, stock, accounting, approvals, and reports — flat product packaging rather than per-user ERP rent (final offer/pricing remains in `RESCUE_PLAN.md`).
- **Proof metrics:** onboarding/clone effort, invoice-processing time, approval cycle time, stock accuracy, overdue receivables, month-end/report preparation time.
- **60-second demo:** WhatsApp/upload an Arabic supplier invoice → draft Purchase Invoice appears with matched supplier/lines/totals → manager approves an expense/purchase from WhatsApp → audit trail and updated record appear.

### Approved architecture

- **Core:** ERPNext/Frappe shared bench, one site per client.
- **WebKMT layer:** Frappe configuration/app artifacts for industry kits, roles, print formats, dashboards, import templates, workflow definitions, and integration endpoints. No ERPNext core patches.
- **Document intake:** email/upload/WhatsApp → gateway/n8n → doc-intel → Dify structured extraction/validation assistance → ERPNext REST API draft records.
- **Approvals:** ERPNext Workflow as source of truth; n8n/Evolution sends actionable WhatsApp notifications; signed, expiring, one-time action links/tokens call owned gateway; gateway verifies actor/state and updates ERPNext.
- **Reports/alerts:** ERPNext reports/dashboards; n8n scheduled AR aging/payment chaser, low-stock, pending-approval digests.

### V1 scope

1. **Golden site template** for a trading/services SMB: company, chart of accounts starter, taxes/VAT structure, currencies, users/roles/permissions, numbering, print formats (Arabic/English), email/notification templates.
2. **Core operations:** customers, suppliers, items/services, price lists, quotations, sales orders/invoices, payments/receivables, purchase requests/orders/receipts/bills, stock/warehouses, expenses, basic reports/dashboards.
3. **Data onboarding:** CSV templates and validation/import scripts for opening balances, customers, suppliers, items, stock; dry-run and error report.
4. **Invoice Inbox v1:** intake, OCR/parse, supplier match, invoice number/date/currency/subtotal/VAT/total/line extraction, duplicate detection, arithmetic checks, ZATCA QR decode when present, confidence/review queue, **draft-only** Purchase Invoice creation. No automatic submission/payment.
5. **WhatsApp Approvals v1:** purchase/expense approval notification with approve/reject action, state/expiry/actor validation, audit trail, fallback link to ERPNext.
6. **Payment chaser v1:** configurable overdue ladder by email/WhatsApp with opt-out/stops, owner digest, no harassment/unbounded sends.
7. **Operations:** site backup/restore, user/role checklist, health checks, upgrade rehearsal, seed trading company, admin quick guide.

### V2 / gated scope

- Saudi ZATCA Phase 2 production e-invoicing through the verified route in `ERP_PRODUCT.md`/Stack docs: sandbox onboarding, CSID/UBL/hash/QR/reporting/clearance behavior, Arabic authoritative invoices, accountant/ZATCA test evidence. **Do not label compliant before the gate passes.**
- Additional industry kits (manufacturing, clinic/services, retail/POS) only after the trading/services golden site is clone-proven.
- Store→ERP order/inventory/invoice synchronization as a flagship integration after Products ① and ② v1 stabilize.

### Data and controls

- ERPNext is source of truth for accounting/stock/documents. Doc-intel/Dify outputs are proposals until validated/posted in ERPNext.
- Every integration-created record stores source, external IDs, correlation ID, confidence/review status where applicable.
- Financial automations require maker/checker or draft/review for low confidence, mismatched totals, duplicate invoice numbers, unknown suppliers, tax anomalies, and changed bank details.
- Role matrix must separate sales, purchasing, warehouse, accounting, approval, and system administration.

### Acceptance tests

1. Clone a golden site and load seed/import data using only the clone checklist.
2. Create quote → sales invoice → payment; stock and receivables/reports reconcile.
3. Process 10 representative Arabic/English supplier invoices (PDF/photo/scan): fields/lines meet agreed evaluation thresholds; duplicates/math errors are flagged; only drafts are created.
4. Approve/reject from WhatsApp with valid, expired, replayed, and unauthorized tokens; only the valid first action changes state and all attempts are auditable.
5. Overdue ladder sends only eligible reminders and stops after payment/reply/opt-out.
6. Backup and restore a site to a clean bench; users/roles/documents/files survive.
7. Arabic/RTL print/report samples render correctly; unauthorized roles cannot access restricted accounting data.

### Product ① agent prompt

```text
Build Kemet Business OS v1 under the WebKMT Master System Prompt and ERP_PRODUCT.md. Use ERPNext/Frappe as a shared bench with a golden trading/services site; customize through Frappe configuration/apps/import artifacts, never core patches. Deliver core sales/purchasing/stock/accounting setup, CSV onboarding, Arabic/English print formats, Invoice Inbox draft-only pipeline through doc-intel with confidence/duplicate/math validation, WhatsApp approvals with signed expiring one-time actions and audit, and a bounded payment-chaser. Seed a realistic trading company and prove clone, quote-to-payment, invoice-intake evaluation, approval security, reminder stop conditions, Arabic/RTL output, role isolation, and backup/restore. Treat ZATCA production compliance as a separate verified gate, not a claim. Package runbook, clone checklist, demo script, license/version notes, costs, and known limits.
```

---

## 9. Product ② — Kemet Store (E-commerce)
> **Dedicated standalone spec:** [`products/02_KEMET_STORE.md`](./products/02_KEMET_STORE.md) — use that file as the product-specific source of truth when building this product.

### Commercial contract

- **Buyer/users:** merchant/owner, store operator, support staff, online shoppers, B2B buyers where enabled.
- **Pain:** orders through DMs/spreadsheets, no reliable online payment/stock/order process.
- **Promise:** a complete, owned online store cloned from a golden image, localized and operationally ready, with Saudi-market configuration where applicable.
- **Proof metrics:** clone/launch effort, checkout completion, page performance, order-processing time, abandoned-cart recovery, repeat/review rate, support tickets per order.
- **60-second demo:** browse Arabic RTL storefront → add product → sandbox checkout → order + stock + customer notification + admin alert appear → AI assistant answers a product question using live catalog/policy data.

### Approved architecture

- **Core:** Bagisto instance per client; WebKMT theme/packages/configuration; no core edits.
- **Payments:** merchant-owned PSP accounts; provider modules/adapters selected per market; invoice/tax actions triggered from verified payment webhooks, idempotently.
- **AI/support:** Receptionist engine with catalog/policy retrieval and live API lookups for price/stock/order status.
- **Marketing:** events to Mautic/n8n for abandoned cart, post-purchase, reviews, winback; consent and suppression respected.
- **ERP route:** optional Product ① synchronization/ZATCA route after both v1s are stable.

### V1 scope

1. **Golden store** with demo catalog: categories, attributes, simple/configurable products, variants, inventory, search/filter/sort, promotions/coupons, customer accounts/guest checkout, wishlist/compare only if native and useful.
2. **Checkout/operations:** cart, addresses, shipping zones/methods, tax/VAT-inclusive display rules, COD/bank transfer where applicable, one sandbox online-payment path, orders, invoices/shipments/refunds, transactional email, WhatsApp order alerts/status through approved channels.
3. **Localization:** Arabic + English at minimum for Saudi golden image; Turkish configuration retained where supported; RTL, currencies, address/phone formats, localized policies/templates.
4. **Saudi pack configuration:** merchant legal placeholders (legal name, CR, VAT number, contacts/policies), National Address-ready fields, payment/shipping/BNPL adapter slots documented from the Stack doc, Arabic invoice/print requirements, launch checklist distinguishing merchant duties from WebKMT setup.
5. **Merchandising/content:** homepage sections, banners, CMS pages, SEO metadata/sitemap, analytics events, product import template with image/attribute validation.
6. **Modules:** AI shopping assistant grounded in live catalog/policies; delivered-order Review Collector trigger; abandoned-cart event export to Marketing Suite; supplier-invoice intake handoff to Product ①/doc-intel where sold.
7. **Operations:** media/storage config, cache/queue/search choices documented, backup/restore, admin roles, security hardening, demo reset.

### Non-goals/gates

- Do not promise a payment method, BNPL, shipping carrier, or ZATCA compliance until the merchant account/adapter/sandbox/production verification exists.
- Do not build a marketplace/custom storefront platform in v1. Medusa/custom builds require a separate high-ticket ADR.
- Do not trigger invoices from browser success pages; use verified payment webhooks/server-side order state.

### Acceptance tests

1. Clone golden store, import demo catalog, configure brand/locales/currency/tax/shipping using only the checklist.
2. Complete guest/account checkout on mobile and desktop in Arabic RTL and English; stock, order emails/status, admin records are correct.
3. Replay, duplicate, malformed, and unsigned payment webhooks cause no duplicate order/invoice/payment effects.
4. Refund/return and out-of-stock/variant edge cases behave safely; AI assistant refuses/guards when live price/stock lookup fails.
5. Review request fires only after eligible delivery and routes unhappy customers privately; abandoned-cart event respects consent/frequency rules.
6. Performance/accessibility/security checks meet documented budgets; backup/restore includes DB/media/config.
7. Saudi launch checklist clearly shows incomplete merchant-owned items and blocks a “compliant/live” claim until verified.

### Product ② agent prompt

```text
Build Kemet Store v1 under the WebKMT Master System Prompt. Use Bagisto as a per-client golden image and customize through themes/packages/configuration, never core edits. Deliver a localized Arabic RTL + English demo store with catalog/import, variants/inventory, search, promotions, guest/account checkout, shipping/tax configuration, sandbox payment and verified idempotent webhooks, orders/refunds, transactional notifications, SEO/analytics, Saudi launch/compliance configuration, AI shopping assistant using live catalog/policy APIs, review/cart event hooks to the Marketing Suite, hardened admin roles, and backup/restore. Prove cloneability, mobile checkout, webhook replay safety, stock/refund correctness, AI grounding, performance/accessibility, and restore. Clearly separate merchant-owned legal/payment/ZATCA duties from implemented technical features and do not claim unverified compliance. Package the universal artifact contract.
```

---

## 10. Product ③ — Kemet Receptionist (Service & Acquisition AI)
> **Dedicated standalone spec:** [`products/03_KEMET_RECEPTIONIST.md`](./products/03_KEMET_RECEPTIONIST.md) — use that file as the product-specific source of truth when building this product.

### Commercial contract

- **Buyer/users:** business owner, front desk/support/sales staff, website visitors, WhatsApp customers/leads.
- **Pain:** repetitive questions, missed after-hours inquiries, slow lead response, no-shows, leads scattered across channels.
- **Promise:** every inquiry receives a fast, useful, branded response; service questions are answered from approved knowledge; qualified leads are captured, alerted, booked, and followed up automatically; humans take over with context.
- **Proof metrics:** median first-response time, conversations resolved without staff, qualified leads, bookings, after-hours captures, handoff rate, no-show rate, follow-up replies, AI cost per conversation.
- **60-second demo:** message a fake Arabic clinic on WhatsApp → Receptionist answers and books a real slot; submit a website lead form → instant reply, qualification, CRM row, and owner alert occur before the prospect looks up.

### Approved architecture

`Website widget / WhatsApp / webform / Chatwoot channels → owned gateway → Dify golden app(s) → tool/API calls (Cal, CRM/ERP/store, doc-intel) → Evolution/Chatwoot/n8n follow-up and reporting`

- **Dify:** intent routing, RAG, field extraction, answer generation, summaries. Golden DSL cloned per client app; KB source documents versioned separately.
- **Gateway:** tenant resolution, channel identity, config, rate limits, session/consent, usage logs, tool authorization, response policy, provider abstraction.
- **Evolution API:** official WhatsApp Cloud API for client numbers; Baileys only disposable demos.
- **Chatwoot:** human inbox/handoff and omnichannel history.
- **Cal.com:** availability/booking truth.
- **n8n:** lead routing, reminders, follow-up ladders, CRM sync, reports, watchdogs.

### V1 scope

1. **Golden clinic/services demo tenant** with Arabic/English KB, services, FAQs, policies, working hours, booking rules, escalation contacts, and seed conversations.
2. **Website widget** owned/branded, embeddable, mobile/accessible, locale-aware, with privacy/consent notice and human-contact fallback.
3. **WhatsApp service flow:** greeting/identity, language detection, grounded FAQ/service answers, structured field collection, booking/reschedule/cancel through Cal, reminders, human handoff with summary/transcript.
4. **Acquisition flow:** webform/WhatsApp/ad-response entry → response target under 60 seconds where channel/provider permits → deduplication → configurable qualification fields → lead score/status → CRM/Baserow/ERPNext or client CRM record → owner alert with summary/contact action → Day 1/3/7 (configurable) follow-up ladder that stops on reply/booking/opt-out/human takeover.
5. **KB operations:** source intake from documents/web pages through doc-intel/Dify; approval/version/freshness manifest; test-question evaluation; no unapproved auto-publication of changed policies/prices.
6. **Safety/policy:** grounded-answer and uncertainty rules, no invented prices/availability/discounts/medical/legal advice, emergency/professional escalation scripts by niche, prompt-injection and cross-tenant isolation tests, PII minimization/retention.
7. **Reporting:** weekly owner report and internal dashboard data: volume, first-response median, resolved/handoff, leads/bookings, after-hours, follow-up outcomes, token/API cost, top unanswered questions.

### V2 scope

- Additional Chatwoot channels (Instagram/Facebook/Telegram/email) after WhatsApp/web are reliable.
- Voice only as a separately priced/approved module after latency, consent, recording, and cost analysis.
- Deeper ERP/store tools (order status, invoice balance, appointment history) with authenticated identity checks.

### Acceptance tests

1. Evaluation set of at least 50 representative Arabic/English questions (plus Turkish if enabled): grounded accuracy, refusal/escalation, and formatting meet documented thresholds; no cross-tenant facts.
2. Booking creates/reschedules/cancels through Cal; conflicts/provider outages produce safe alternatives and never claim success without confirmation.
3. Website lead test produces deduped CRM record, instant customer response workflow, owner alert, and measurable timestamps.
4. Follow-up ladder stops on reply, booking, opt-out, human takeover, and max attempts; business hours/time zones honored.
5. Human handoff in Chatwoot includes summary, collected fields, intent, urgency, and transcript link/context.
6. Prompt-injection, malicious file/link, abusive, emergency, unknown-policy, and provider-timeout cases follow policy.
7. Usage/cost/rate-limit logs are tenant-scoped; widget passes mobile/accessibility/RTL checks; backup/restore covers DSL/KB sources/config, not secrets.

### Product ③ agent prompt

```text
Build Kemet Receptionist v1 under the WebKMT Master System Prompt as the flagship service-and-acquisition AI. Build the owned gateway and embeddable web widget, Dify golden chatflow/DSL with approved KB sources, official WhatsApp integration design through Evolution, Chatwoot handoff, Cal booking, CRM lead capture/deduplication, owner alerts, reminders, and stop-safe n8n follow-up ladders. Seed an Arabic/English clinic or services demo and maintain an evaluation set for grounded answers, escalation, prompt injection, tenant isolation, booking conflicts/outages, lead speed, and cost logging. Never invent prices or availability; call authoritative APIs and escalate uncertainty. Prove the 60-second service+booking and lead-response demos, then package DSL/KB manifests, sanitized workflows, runbook, clone checklist, reports, security/license notes, costs, and known limits.
```

---

## 11. Product ④ — Kemet Websites (Templates + Client-Managed CMS)
> **Dedicated standalone spec:** [`products/04_KEMET_WEBSITES.md`](./products/04_KEMET_WEBSITES.md) — use that file as the product-specific source of truth when building this product.

### Commercial contract

- **Buyer/users:** business owner/marketer who edits content; visitors/leads; WebKMT operator who launches/hosts templates.
- **Pain:** outdated website and developer dependency for every text/photo/offer change.
- **Promise:** choose a proven niche template, launch rebranded quickly, and safely edit everyday content without a developer while WebKMT handles hosting/updates/backups under a care plan.
- **Proof metrics:** clone/launch effort, client edit-task success/time, page performance, form conversion, support requests for routine edits, uptime.
- **60-second demo:** edit a headline, price/offer, and photo in the CMS → preview/publish → live page updates → submit the lead form → Receptionist/CRM receives it instantly.

### Approved architecture

- **Core:** Payload CMS, one instance per client from a golden template codebase/config; Postgres and managed media storage per deployment.
- **Template system:** shared block/component library, design tokens, niche seed content, locale framework, SEO defaults, analytics/lead integrations. Structural innovation becomes a reusable template feature, not a one-off client fork.
- **Astro variant:** only as a deliberately separate lightweight landing-page template family after the Payload golden path is proven; do not split v1 effort across two architectures without an ADR.
- **Lead path:** forms → owned gateway/n8n → Receptionist/CRM/owner alert with spam/consent controls.

### V1 scope

1. **Two golden templates:** (a) clinic/health or appointment-led services; (b) professional/local services. Restaurant/real-estate variants follow after clone proof.
2. **Content model:** site settings, header/footer/navigation, pages with reusable blocks, services, team, testimonials, FAQs, offers, blog/posts, media, forms/submissions, redirects, users/roles, SEO fields, locales.
3. **Block library:** hero, trust/logos, services, benefits/process, pricing/offers, gallery, testimonials, FAQ, team, CTA, contact/map, blog list/detail. Each block has validation, responsive behavior, accessibility, empty-state rules, and editor help text.
4. **Client-safe CMS:** admin branding, editor/admin roles, drafts/preview/publish workflow supported by the chosen Payload setup, media alt-text/crop guidance, locked structural settings, audit/activity where available, concise client guide and training checklist.
5. **Conversion/SEO:** metadata/Open Graph, sitemap/robots, structured data for local business/services/FAQ where valid, analytics events, WhatsApp click-to-chat, contact/booking CTAs, Google Business Profile launch checklist.
6. **Forms/security:** validation, honeypot/rate limit/CAPTCHA-ready adapter, consent text, submission notifications/storage, spam quarantine, file-upload restrictions if enabled.
7. **Operations:** seed/reset, domain/TLS checklist, redirects, backups/restore, media optimization, cache/performance budgets, update/rollback procedure.

### Acceptance tests

1. Clone each golden template, apply new logo/colors/fonts/content/locales, and launch locally using only the checklist.
2. A non-technical editor test completes: edit hero, add service, change price/offer, publish blog post, replace image with alt text, update hours/phone; no code or broken layout.
3. Arabic RTL + English pages, mobile/tablet/desktop, keyboard/focus/contrast, and form errors pass checks.
4. Form submission reaches gateway/CRM/owner alert once; spam/duplicate/provider-failure behavior is safe and visible.
5. SEO outputs validate (metadata, canonical/robots/sitemap/structured data) and performance budgets are recorded.
6. Roles prevent editors from destructive/admin-only actions; backup/restore includes DB/media/config and restores a working site.
7. Broken links/images and missing required content are caught by pre-launch checks.

### Product ④ agent prompt

```text
Build Kemet Websites v1 under the WebKMT Master System Prompt. Use Payload CMS as a per-client golden template system and deliver two cloneable niche templates (appointment-led clinic/services and professional/local services) with a shared accessible block library, design tokens, Arabic RTL + English locales, client-safe editorial roles/help, SEO/structured data, analytics/WhatsApp CTAs, spam-resistant forms wired to the gateway/Receptionist, seed content, and backup/restore/update procedures. Prove a non-technical editor can complete routine edits without breaking layout, forms reach CRM exactly once, performance/accessibility budgets pass, and a full clone/restore works from the checklist. Do not create one-off client forks or split v1 across a second site architecture without an ADR. Package demo scripts, client guide, runbook, clone checklist, license/version notes, costs, and known limits.
```

---

## 12. Product ⑤ — Kemet Marketing Suite
> **Dedicated standalone spec:** [`products/05_KEMET_MARKETING_SUITE.md`](./products/05_KEMET_MARKETING_SUITE.md) — use that file as the product-specific source of truth when building this product.

### Commercial contract

- **Buyer/users:** owner/marketer, sales/support staff responding to conversations, WebKMT operator running managed marketing operations.
- **Pain:** email list unused, irregular social posting, conversations scattered, no visibility into reviews/sentiment/competitor moves, multiple subscriptions and manual reports.
- **Promise:** one owned marketing operating system for campaigns/journeys, social scheduling, unified conversations, review/brand alerts, competitor watch, and a clear monthly growth report — with honest data-source coverage.
- **Proof metrics:** list growth, campaign/journey revenue or conversions, deliverability, posts shipped on schedule, mention/review response time, sentiment trend, competitor moves caught, report preparation time.
- **60-second demo:** new store product/lead triggers a segmented email journey; a week of social posts is approved/scheduled; a negative review/mention is classified, drafted, alerted, and answered after human approval; owner sees one report.

### Approved architecture

- **Mautic per client:** contacts/segments, campaigns, journeys, scoring, forms/landing pages, sending configuration, unsubscribe/suppression, campaign analytics.
- **Postiz shared/unmodified:** connected social accounts/workspaces, scheduling/cross-posting through API/n8n where supported; WebKMT reports/approval surfaces are client-facing, not the Postiz console.
- **Chatwoot shared:** DMs/comments/email/WhatsApp conversations and human handoff, shared with Product ③.
- **Dify:** copy variants, personalization assistance, reply drafts, sentiment/intent/topic/urgency classification within evaluated limits.
- **n8n:** event triggers, syncs, content pipeline, alerts, report assembly, watchdogs.
- **Owned intelligence service:** lawful collectors/APIs → normalized mentions/reviews/competitor observations → classification → alert/report store. Reuse the existing WebKMT scraper patterns where lawful/appropriate; respect robots, terms, authentication, and rate limits.

### V1 scope — campaigns, scheduling, conversations, report

1. **Mautic golden instance:** brand/theme configuration, sender domain checklist (SPF/DKIM/DMARC), contact import/dedupe/consent fields, segments/tags, scoring starter rules, forms/landing-page templates, email templates (Arabic/English), unsubscribe/suppression verification.
2. **Starter journeys:** welcome/lead nurture, abandoned cart (from Product ②), post-purchase/review request handoff, dormant-customer reactivation (Reach playbook), appointment/service follow-up (from Product ③). Each has entry/exit, frequency caps, consent checks, test contacts, and reporting.
3. **Postiz golden setup:** agency developer-app/account checklist, workspace per client, channel connection guide, content calendar process, media naming/approval workflow, API/n8n draft/schedule path where verified, token-expiry/failure alerts.
4. **Unified conversations:** Chatwoot routing/labels, AI draft reply with mandatory approval rules by risk, escalation and SLA/response-time reporting.
5. **Monthly growth report v1:** email, social, conversation, lead/order source metrics with definitions and data-freshness; generated from stored data/exports, not hand-assembled screenshots.
6. **Operations:** cron/queue monitoring for Mautic, backup/restore, sending limits/reputation checklist, social token health, role/access matrix.

### V2 scope — intelligence and competitor watch

1. **Owned-channel intelligence:** comments/DMs/reviews from connected accounts; near-real-time only where provider APIs/webhooks actually support it.
2. **Workable public sources:** YouTube Data API within quota, Google Business Profile/Places where authorized/available, RSS/news/blogs and client-approved web sources, scheduled lawful crawls.
3. **Classification/evaluation:** sentiment, intent, topic, urgency, language/dialect; labeled Arabic/English evaluation set; confidence and human review; spike/complaint alerts.
4. **Competitor Watch:** competitor website/page diffs (price/promo/product claims), public review count/rating changes where lawfully available, content/RSS changes, manual/assisted Meta Ad Library checks; evidence snapshots and monthly digest.
5. **Engagement loop:** listen → classify → draft → human approve → respond via approved channel → log outcome. No fully autonomous public replies for complaints, crises, legal/medical/financial topics, or low confidence.

### V3 / pass-through only

- X/Twitter or third-party social-listening data only with client-approved paid API/data budgets and contractual/terms review.
- No Reddit-dependent architecture, TikTok/open-Instagram firehose promises, credential sharing, fake engagement, or TOS-evading scrapers.

### Acceptance tests

1. Clone Mautic golden instance; import/dedupe test contacts with consent states; suppressed/unsubscribed contacts receive nothing.
2. Each starter journey triggers from test lead/order/appointment events, exits correctly, respects frequency/time-zone rules, and reports conversions.
3. Sender-domain preflight catches missing SPF/DKIM/DMARC; bounce/complaint/unsubscribe handling is documented/tested with provider sandbox where available.
4. Schedule test posts to owned/sandbox social accounts; expired token/API failure alerts the operator and does not silently drop content.
5. Incoming test conversation receives an AI draft; risky/low-confidence drafts require approval; SLA/report data is correct.
6. Monthly report regenerates from source data with metric definitions, totals reconciled to Mautic/Postiz/Chatwoot samples.
7. V2 classifiers meet documented evaluation thresholds by language/category; competitor diff produces evidence-linked alert without false “real-time” claim.
8. Backup/restore covers Mautic DB/files/config, Postiz data/config, workflow exports, report/intel data; secrets/tokens are re-entered/rotated per runbook, never committed.

### Product ⑤ agent prompt

```text
Build Kemet Marketing Suite in phases under the WebKMT Master System Prompt. For v1, deliver a cloneable per-client Mautic golden setup with consent/dedupe/segments/scoring/templates and tested starter journeys, a shared unmodified Postiz scheduling setup with workspace/token-health operations, Chatwoot conversation workflows with approval-gated AI drafts, n8n event/report glue, and a reproducible monthly growth report. Prove suppression/unsubscribe safety, journey entry/exit, sender-domain preflight, scheduling failure alerts, report reconciliation, tenant isolation, and backup/restore. For v2, add lawful owned-channel/YouTube/review/web collectors, evaluated Arabic/English sentiment-intent classification, alerts, and evidence-based Competitor Watch. Never promise X/Reddit/TikTok/open-Instagram firehose listening or use TOS-evading collection; paid data is v3 pass-through. Package the universal artifact contract with platform approval checklists, costs, risks, and known limits.
```

---

## 13. Cross-product integration map

| Producer event | Consumer | Business effect |
|---|---|---|
| Website form submitted (④) | Receptionist (③) + CRM | Instant response, qualification, owner alert, follow-up |
| Chat/WhatsApp lead qualified (③) | Marketing Suite (⑤) | Consent-based nurture/scoring journey |
| Appointment booked/reminded (③) | ④/⑤ reporting | Conversion and no-show metrics; post-service review journey |
| Order paid/delivered (②) | ⑤ + ① optional | Post-purchase/review/winback; accounting/invoice route |
| Cart abandoned (②) | ⑤ | Consent/frequency-safe recovery journey |
| Supplier invoice received (①/②) | doc-intel → ① | Draft Purchase Invoice and approval |
| Invoice overdue (①) | ③ channels/⑤ email | Payment chaser with stop conditions |
| New product/content published (②/④) | ⑤ | Draft social/email campaign for approval |
| Review/mention detected (⑤) | ③/Chatwoot | Drafted response, human approval, SLA tracking |
| All products | Owner reporting | Care-plan proof: leads, bookings, orders, response times, campaigns, uptime |

Integration contracts must name source of truth, event ID/idempotency, consent status, tenant ID, timestamp/time zone, retry/replay behavior, and PII fields allowed to cross the boundary.

---

## 14. Build sequence for agents

Follow dependency and sales-proof order; do not build all five in parallel as a big-bang platform.

1. **Shared Platform v1** — local factory, gateway, doc-intel, Dify/n8n conventions, seed tenants, backup/monitoring.
2. **Product ③ Receptionist golden demo** — fastest flagship proof: WhatsApp/web service + booking + acquisition.
3. **Product ④ Websites first two templates** — feeds high-quality leads into ③ and refreshes the public gallery.
4. **Product ① Business OS golden site + Invoice Inbox/Approvals** — high-value system proof.
5. **First VPS demo promotion** — deploy only tested golden artifacts; run public-demo smoke/restore checks.
6. **Product ② Store golden image + Saudi pack** — payment/compliance gates handled explicitly.
7. **Product ⑤ Marketing Suite v1** — start platform developer-app/OAuth approvals early/in parallel because they are external lead-time risks.
8. **Product ⑤ Intelligence v2** — only after v1 data/reporting foundations and classifier evaluation exist.

At each step: local demo → tests → runbook/clone checklist → public demo if needed → pilot hardening → next product. A product is not “ready to sell” merely because the upstream software installs.

---

## 15. Final agent handoff format

Every completed assignment must end with:

```markdown
## Outcome
[What user/business result now works]

## Artifacts changed
- [repo/path — purpose]

## Decisions
- [ADR/choice + reason + alternative rejected]

## Verification actually performed
- [command/test — result]
- [manual demo path — result]

## How to run/demo
1. …
2. …

## Security / license / compliance
- …

## Operational cost & support impact
- …

## Known limits / blockers
- …

## Owner actions required
- [exact account/key/approval/decision; never request secrets in chat]

## Next recommended increment
- …
```

If any required verification could not be performed, say so plainly and downgrade the readiness claim accordingly.
