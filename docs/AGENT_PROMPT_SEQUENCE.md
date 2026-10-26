# WebKMT Agent Prompt Sequence — From Planning to Building

> **Purpose:** this is the owner's ordered runbook for using an AI agent to move WebKMT from planning → workflow research → build-ready backlog → tested product increments. It tells you **what to upload, which skills to give the agent, what to paste, in what order, and what to approve before allowing the next step**.
>
> **Companion source of truth:**
> - [`AI_BUILD_PACK.md`](./AI_BUILD_PACK.md) — master system prompt, common skills, universal artifact contract, quality gates, shared platform, handoff format
> - [`PRODUCT_STACK.md`](./PRODUCT_STACK.md) — frozen five-product portfolio and architecture
> - [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) — approved repositories, licenses, deployment and white-label decisions
> - [`N8N_WORKFLOW_SELECTION_GUIDE.md`](./N8N_WORKFLOW_SELECTION_GUIDE.md) — workflow capability IDs, Zie619 research method, scoring and rebuild rules
> - [`products/`](./products/README.md) — dedicated standalone build spec for each product
>
> **Golden rule:** one phase, one deliverable, one owner gate. Never tell the agent “build everything.” Research output → approval → backlog → one tested increment → demo → next increment.

---

## 1. What to upload, by phase

### If the agent has repository access

Do not upload files. Tell it to read the paths below from the repo and cite the sections it used. Keep the product work in a separate product workspace/repo when coding begins; the current WebKMT repo is the webfront and planning/documentation home unless a task explicitly integrates the webfront.

### If the agent is upload-only

| Phase | Upload these files | Why |
|---|---|---|
| Orientation | `AI_BUILD_PACK.md` · `PRODUCT_STACK.md` · `OPEN_SOURCE_STACK.md` · this file | Operating system, frozen scope, licenses/repos, ordered process |
| Workflow research | Above + `N8N_WORKFLOW_SELECTION_GUIDE.md` + relevant file from `docs/products/` | Capability IDs, search/scoring rules, product-specific context |
| Rebuild backlog | Core files + research output, e.g. `N8N_SHORTLIST_BATCH_A.md` | Converts approved patterns into contracts, fixtures, and increments |
| Product build | `AI_BUILD_PACK.md` · relevant `docs/products/0X_*.md` · `OPEN_SOURCE_STACK.md` · backlog · current build log | Focused context without unrelated products |
| ERP build only | Add `ERP_PRODUCT.md` | Deep ERP positioning/editions/ZATCA research |
| Websites build only | Add `TEMPLATE_GALLERY.md` | Gallery/sales/launch model |
| Webfront/API deployment only | Add `API_KEYS.md` | Current website keys/runbook categories; **never upload a real `.env` or secret values** |
| Business/packaging decisions | Add `RESCUE_PLAN.md` | Offers, pricing logic, acquisition and care-plan model |

### Minimum upload sets

- **Only 4 files allowed:** `AI_BUILD_PACK.md`, `AGENT_PROMPT_SEQUENCE.md`, `PRODUCT_STACK.md`, and the active guide/spec for the phase.
- **Workflow research minimum:** `N8N_WORKFLOW_SELECTION_GUIDE.md`, `AI_BUILD_PACK.md`, `AGENT_PROMPT_SEQUENCE.md`.
- **Single-product build minimum:** `AI_BUILD_PACK.md`, the dedicated product spec, and the current backlog/build log.

### System-prompt placement

- If the platform has a **system / developer / custom instructions** field, paste only **§3 Master System Prompt** from `AI_BUILD_PACK.md` there.
- If there is no system field, upload `AI_BUILD_PACK.md` and instruct the agent in Prompt 1 to treat §3 as persistent operating rules for the session.
- Do not paste all documents into every message. Upload once per session, then reference exact sections.

---

## 2. Recommended agent skills

If the agent platform supports persistent skills, create the skills below. If it does not, paste the relevant skill summary/checklist into the task prompt or keep the files attached and instruct the agent to “activate” them by name.

### 2.1 Always-on core skills (P0)

| Skill name to create | Source | What it must make the agent do |
|---|---|---|
| `webkmt-master-operating-system` | `AI_BUILD_PACK.md` §1–§3 | Enforce five-product scope, white-label/open-source rules, PC-first delivery, one-engine-per-job, golden artifacts, no invented keys/APIs |
| `product-strategy-and-commercialization` | `AI_BUILD_PACK.md` Skill 1 | Buyer/pain/proof metric, 60-second demo, packaging, clone time, care-plan value, margin/support impact |
| `oss-architecture-and-license-diligence` | `AI_BUILD_PACK.md` Skill 2 + `OPEN_SOURCE_STACK.md` | Verify repos/releases/licenses/trademarks, extension paths, version pins, exit ramps; prevent core forks and license drift |
| `api-event-and-integration-engineering` | `AI_BUILD_PACK.md` Skill 3 | Source-of-truth discipline, API/webhook contracts, idempotency, retries, pagination, reconciliation, mocks and contract tests |
| `ai-rag-and-document-intelligence` | `AI_BUILD_PACK.md` Skill 4 | Grounded RAG, structured extraction, confidence/human review, evaluation sets, cost logs, prompt/version control |
| `n8n-workflow-forensics-and-reliability` | `AI_BUILD_PACK.md` Skill 5 + n8n guide | Audit community JSON, rebuild clean patterns, subflows, signed webhooks, dedupe, dead letters, stop conditions, sanitized exports |
| `design-ux-and-design-systems` | §3 below + `AI_BUILD_PACK.md` Skill 6 | Mandatory design pack for every client/staff-facing surface |
| `security-privacy-and-compliance` | §4 below + `AI_BUILD_PACK.md` Skill 9 | Mandatory security pack for every integration, data flow, public demo, and go-live |
| `data-analytics-and-reporting` | `AI_BUILD_PACK.md` Skill 7 | Schemas/imports/dedupe/consent, metric definitions, reproducible proof reports |
| `devops-sre-and-release-engineering` | `AI_BUILD_PACK.md` Skill 8 | Docker/PC→VPS promotion, health/monitoring, backups/restore, upgrades/rollback |
| `qa-evaluation-and-observability` | `AI_BUILD_PACK.md` Skill 10 | Acceptance/failure/security/localization tests, AI/OCR evaluation, logs/metrics/alerts and exact evidence |
| `technical-writing-and-cost-delivery` | `AI_BUILD_PACK.md` Skills 11–12 | Runbooks, clone checklists, client guides, thin slices, cost/support awareness, §15 handoffs |

### 2.2 Product/tool skills to add when that work starts (P1)

| Skill name | Activate for | Minimum contents |
|---|---|---|
| `frappe-erpnext-and-accounting-ops` | Product ① | Frappe apps/permissions/workflows/print formats, ERPNext accounting/stock, imports, backup/restore, ZATCA gate awareness |
| `bagisto-laravel-and-commerce-payments` | Product ② | Laravel packages/themes, catalog/checkout, PSP webhooks, tax/shipping, Saudi launch checklist, performance |
| `whatsapp-chatwoot-and-cal-integrations` | Product ③ | Official Meta WhatsApp Cloud API, Evolution boundaries, Chatwoot handoff, Cal availability/booking truth, messaging policy |
| `payload-cms-and-template-systems` | Product ④ | Payload collections/blocks/access control, Next.js rendering, editor UX, SEO, media, multisite-by-clone operations |
| `mautic-deliverability-and-lifecycle` | Product ⑤ | Mautic campaigns/journeys/scoring, SPF/DKIM/DMARC, suppression, segmentation, cron/queue operations |
| `postiz-and-social-platform-apis` | Product ⑤ | OAuth/developer apps, token health, scheduling APIs, platform constraints, approval workflows |
| `social-listening-and-data-apis` | Product ⑤ v2 | Official YouTube/Google/RSS/web sources, quota/terms, classifier evaluation, evidence-based competitor diffs |
| `saudi-commerce-and-zatca-research` | Products ①②⑤ where relevant | Official-source research, merchant vs WebKMT duties, Arabic/VAT/e-invoicing gates; explicitly **not legal advice** |
| `docker-coolify-and-vps-operations` | Demo/production | Compose hardening, reverse proxy/TLS, resource limits, logs, Uptime Kuma, Restic/restore, incident basics |

### 2.3 Research-only / occasional skills (P2)

- `competitor-and-market-research` — source-cited comparisons, pricing/feature evidence, no invented claims.
- `data-migration-and-spreadsheet-cleaning` — CSV profiling, mapping, dedupe, dry runs, reconciliation reports.
- `content-localization-ar-en-tr` — translation glossaries, transcreation review, Arabic dialect sensitivity, externalized strings.
- `technical-sales-demo-scripting` — 60-second/5-minute demos, proof metrics, objection/risk notes.

### How to create a good persistent skill

Each skill should contain only:
1. **When to activate** (trigger/products/surfaces)
2. **Canonical WebKMT rules** and links/sections
3. **Checklist** the agent must run
4. **Required evidence/deliverables**
5. **Reject/escalate conditions**

Do not copy entire product specs into every skill; that creates drift. Skills enforce *how to work*; product files define *what to build*.

---

## 3. Dedicated Design skill pack (mandatory)

Activate for websites, storefronts, widgets, dashboards, CMS/admin UX, emails, WhatsApp/message templates, reports, ERP print formats, and any client/staff-facing workflow.

### 3.1 Product UX and information architecture

- Name the primary user, job, entry point, success state, and next action for every flow.
- Map the shortest path; remove fields/steps that do not change a decision or record.
- Design loading, empty, partial, error, offline/dependency-failure, permission-denied, and success states.
- For admin/CMS/ERP surfaces, optimize repeated tasks, scanning, bulk actions, undo/draft states, and clear audit/status visibility.
- For owner alerts/reports, make the required action obvious within seconds: who, what, urgency, value, next tap/click.

### 3.2 Visual design and white-label design systems

- Use reusable design tokens: color, typography, spacing, radius, shadows, breakpoints, icon style, focus states.
- Separate **WebKMT product chrome**, **client brand tokens**, and content so a clone changes tokens/assets, not component code.
- Define logo/brand placement rules that respect upstream trademark/license limits; never hide required notices where a license requires them.
- Maintain a component/block inventory with variants, states, content limits, and editor guardrails.
- Avoid one-off page designs; new structural patterns become reusable template components.

### 3.3 Arabic, RTL, and multilingual design

- Design Arabic-first where the target demo/client is Saudi; verify true RTL layout, not merely translated LTR.
- Choose Arabic/Latin font pairs with readable weights/sizes; test numerals, dates, currencies, phone numbers, addresses, and mixed-direction strings.
- Allow text expansion and avoid fixed-height/truncation traps in buttons, cards, tables, chat bubbles, and print formats.
- Externalize strings; keep a glossary for product, accounting, commerce, booking, and marketing terms.
- Test Arabic, English, and Turkish where enabled with real-length content, not lorem ipsum.

### 3.4 Accessibility and inclusive interaction

Target **WCAG 2.2 AA** for client-facing surfaces unless an ADR records a justified exception:

- Semantic landmarks/headings/labels, keyboard operability, visible focus, skip links where appropriate.
- Color contrast, non-color status cues, touch target size, reduced-motion preferences.
- Form errors that identify the field, explain the fix, preserve input, and work with screen readers.
- Alt text/media rules, captions/transcripts where media is instructional, accessible tables/charts and data summaries.
- Chat widgets must be keyboard/screen-reader usable, not trap focus, and offer a human/contact fallback.

### 3.5 Conversion, trust, and content design

- Each public page/widget has one primary conversion goal and a measurable event.
- Make pricing/availability/policy claims data-backed; design must never make the AI appear to confirm what an API has not confirmed.
- Show trust elements appropriate to the market: legal identity/contact, policies, payment/shipping clarity, reviews with provenance, secure/consent notices.
- Write microcopy for errors, consent, booking, payment, follow-up, and AI uncertainty in plain Arabic/English; avoid vendor/tool names on white-label surfaces.
- Instrument demo/proof metrics without dark patterns or fake urgency/social proof.

### 3.6 Design delivery and QA gate

Before implementation is accepted, the agent must provide as applicable:

- [ ] User-flow or task map and source-of-truth actions
- [ ] Component/block and state inventory
- [ ] Design tokens/brand variables and asset rules
- [ ] Desktop/tablet/mobile evidence
- [ ] Arabic RTL and English evidence with realistic content
- [ ] Keyboard/focus/contrast/form-error checks
- [ ] Performance-sensitive media/font choices and page-weight notes
- [ ] Client-editor task test for CMS/admin surfaces
- [ ] Analytics/proof events and success/error copy

**Design reject conditions:** inaccessible custom controls, broken RTL, hard-coded brand/copy, editor can break layout with routine content, confirmation UI that misstates API results, or a polished mockup with untested forms/states.

---

## 4. Dedicated Security skill pack (mandatory)

Activate for every product increment. Security is not a final polish step; the depth scales from local mock → public demo → pilot → client production.

### 4.1 Threat modeling and secure architecture

- Identify assets (credentials, PII, financial records, orders, messages, OAuth tokens, files, backups), actors, trust boundaries, and data flows.
- Use abuse cases/STRIDE-style review for public forms, uploads, webhooks, APIs, admin surfaces, AI tools, and tenant boundaries.
- Define what an attacker, malicious lead, compromised client user, curious tenant, or leaked token could and could not do.
- Prefer server-side authority: frontend/AI must never be trusted for price, stock, availability, payment, permissions, or approval state.

### 4.2 Identity, authorization, and tenant isolation

- Use least-privilege accounts/roles; separate owner/admin, staff, editor, client, service, and integration identities.
- Test cross-tenant access for every list/detail/export/file/API path; tenant ID must come from authenticated context/config, not user-supplied free text alone.
- Protect sessions/cookies, password reset, invitation, and admin recovery flows through the upstream platform's supported mechanisms.
- Record maker/checker rules for financial, publishing, refund, discount, and customer-communication actions.

### 4.3 Application, API, and webhook security

Use OWASP ASVS/API-security thinking proportional to risk:

- Validate and encode input/output; prevent injection, XSS, CSRF, SSRF, path traversal, unsafe redirects, and insecure deserialization.
- Authenticate APIs; verify webhook signatures/timestamps; enforce idempotency/replay windows and rate limits.
- Restrict CORS, security headers, file types/sizes, upload storage/execution, and public debug/error detail.
- Paginate/bound queries and exports; avoid leaking existence of records across tenants.
- Log security-relevant events with correlation IDs while excluding secrets and unnecessary PII.

### 4.4 Secrets, dependencies, and supply chain

- Secrets only in environment/secret stores; `.env.example` names and safe placeholders only. Never commit `.env`, workflow exports with credentials, archives, keys, or client exports.
- Scope and rotate tokens; separate demo/pilot/production credentials; document owner-only creation/rotation steps without requesting values in chat.
- Pin upstream versions/images/plugins; record digests where practical; review license and security advisories before upgrades.
- Treat community n8n JSON, templates, plugins, and Code nodes as untrusted until forensic review; maintain provenance and sanitized rebuilds.
- Run dependency/vulnerability/code scanning available in the environment for production-bound increments and report unresolved findings by severity.

### 4.5 Data protection, privacy, and regulated workflows

- Classify data (public, internal, customer PII, financial, health/appointment, credentials) and minimize collection/retention.
- Define lawful/consent basis, suppression/unsubscribe, export/deletion, backup retention, and client data-exit procedures.
- Encrypt in transit; use platform/disk/backup encryption where available; protect exports and reports.
- Separate merchant/client legal duties from WebKMT technical controls for Saudi e-commerce, VAT/ZATCA, payments, consumer policies, email/WhatsApp/social platform rules, and privacy law.
- Never claim compliance from a checklist alone; use sandbox/official verification and qualified accountant/legal review gates where required.

### 4.6 Infrastructure and operations security

- Harden Docker/VPS: non-root where supported, minimal exposed ports, firewall/reverse proxy, TLS, automatic certificate monitoring, patched base images, resource/log limits.
- Backups must be encrypted, access-controlled, monitored, and restore-tested; document RPO/RTO assumptions honestly for the care plan.
- Monitor auth failures, webhook errors, queue/dead-letter growth, disk, token expiry, and unusual API/AI usage.
- Maintain an incident runbook: revoke/rotate, isolate tenant/service, preserve logs, assess data exposure, communicate, restore, and post-incident fixes.

### 4.7 AI and automation security

- Treat KB documents, web pages, emails, chats, and workflow payloads as untrusted prompt input.
- Prevent prompt injection from changing system rules, revealing other tenants' data, or invoking tools outside an allowlist.
- Use structured outputs and server-side validation; require human approval for low-confidence, financial, public, medical/legal, complaint, refund, and irreversible actions.
- Cap tokens/costs/retries per tenant; redact PII in logs/evaluation sets; version prompts/DSL and KB sources.
- Test malicious instructions in documents/messages, cross-tenant questions, data exfiltration attempts, and unsafe tool requests.

### 4.8 Security delivery and go-live gate

For public demo/pilot/production increments, require:

- [ ] Mini threat model and data-flow note
- [ ] Role/permission and tenant-isolation test evidence
- [ ] Secret scan / no secrets in repo, frontend, logs, or exports
- [ ] Signed webhook, replay/duplicate, unauthorized, rate-limit, and malformed-input tests where applicable
- [ ] Upload/file and SSRF checks where applicable
- [ ] Dependency/license/version inventory and known vulnerability disposition
- [ ] Privacy/consent/retention notes and suppression tests where messaging is involved
- [ ] TLS/domain, monitoring/alerts, backup and tested restore
- [ ] Incident/rotation/rollback steps in the runbook
- [ ] Explicit unresolved risks and owner decisions; no “secure/production-ready” claim without evidence

**Security reject conditions:** shared admin credentials, client secrets in frontend/Git, unsigned financial webhooks, cross-tenant data access, unofficial account automation, auto-executing low-confidence financial/public actions, or backups that have never been restored.

---

## 5. Skill activation matrix

| Work | Always activate | Add |
|---|---|---|
| Workflow research | Master OS · OSS/license · n8n forensics · Product strategy · Security | Relevant product/tool skill for substitutions |
| Shared Platform | API/events · AI/doc-intel · n8n · DevOps · QA · Security | Docker/Coolify later for VPS |
| ① ERP | Data/reporting · API/events · Design (admin/print) · Security | Frappe/ERPNext · Saudi/ZATCA research |
| ② Store | Design (conversion/checkout) · Security (payments/accounts) · Data | Bagisto/Laravel · Saudi commerce |
| ③ Receptionist | AI/RAG · n8n · Design (conversation/widget) · Security (AI/PII) | WhatsApp/Chatwoot/Cal · localization |
| ④ Websites | Design systems · Security (CMS/forms) · QA/a11y | Payload/templates · localization · SEO content |
| ⑤ Marketing Suite | Data/reporting · Design (email/social/reports) · Security (OAuth/consent) | Mautic · Postiz/social APIs · listening APIs |
| Public demo / go-live | DevOps/SRE · QA/observability · Design QA · Security gate | Incident/backup/restore review |

---

## 6. Ordered prompt sequence

### Stage 0 — Owner setup (you do this; no prompt yet)

- [ ] Start a fresh agent session/project: **WebKMT — Research & Build**
- [ ] Put `AI_BUILD_PACK.md` §3 in system/custom instructions if available.
- [ ] Upload the Stage 1 files from §1 or give repo paths.
- [ ] Create/enable P0 skills from §2.1 if the platform supports skills.
- [ ] Explicitly enable/attach the Design (§3) and Security (§4) packs.
- [ ] Do not provide real secrets, passwords, client exports, or production data.
- [ ] Decide where outputs will be saved. Recommended names:
  - `N8N_SHORTLIST_BATCH_A.md`
  - `REBUILD_BACKLOG_BATCH_A.md`
  - `BUILD_LOG.md`
  - Product workspace `README.md`, `docs/RUNBOOK.md`, `docs/adr/`

**Gate:** the agent receives only planning/research authority first. Coding authority comes at Stage 4.

---

### Prompt 1 — Orientation and control sheet

Paste exactly:

```text
Read the attached/repo files in this order:
1. AI_BUILD_PACK.md — treat §3 as your persistent operating system.
2. AGENT_PROMPT_SEQUENCE.md — follow its phases, gates, Design pack (§3), and Security pack (§4).
3. PRODUCT_STACK.md — frozen five-product scope; do not redesign it.
4. OPEN_SOURCE_STACK.md — approved repos, licenses, white-label and deployment decisions.
5. N8N_WORKFLOW_SELECTION_GUIDE.md — workflow research rules.
6. The dedicated product spec I identify for each later task under docs/products/.

TASK NOW: ORIENTATION ONLY. Do not browse workflows, write code, create product files, or propose a new strategy.

Return:
A. Control sheet: five products, approved stack/deployment unit per product, shared engines, source-of-truth systems, license/white-label boundaries, PC→VPS model, and build order.
B. The exact documents/sections and skills governing: workflow research, rebuild backlog, Shared Platform v1, and Product ③ Receptionist.
C. Design and Security gates that will apply before any client-facing surface or public integration.
D. Contradictions/ambiguities, separating true blockers from items to mock.
E. Owner-only accounts/approvals needed later, by name/purpose only. Never ask me to paste secrets.
F. End with exactly: "READY FOR RESEARCH BATCH A" or "NOT READY BECAUSE: ..."
```

**Owner gate:** correct any misunderstanding about products, stack, licensing, or build order. Do not proceed on a vague “understood.”

---

### Prompt 2 — Workflow research Batch A (foundation + flagship)

Paste after Prompt 1 passes:

```text
Execute RESEARCH ONLY — Workflow Batch A.

Follow N8N_WORKFLOW_SELECTION_GUIDE.md, especially §3 method, §5 capability definitions, §7 scoring/knockouts, §8 JSON forensics, and §9 deliverables. Activate skills: n8n-workflow-forensics-and-reliability, oss-architecture-and-license-diligence, product-strategy-and-commercialization, and security-privacy-and-compliance.

Scope only these capabilities:
OPS-01, OPS-02, OPS-03,
REC-01, REC-02, REC-03, REC-04, REC-05, REC-06, REC-07, REC-08,
WEB-01.

Also read docs/products/03_KEMET_RECEPTIONIST.md and the Shared Platform spec in AI_BUILD_PACK.md §7.

For each capability:
- Search zie619.github.io/n8n-workflows with the guide's search pack, synonyms, categories, triggers, and integrations.
- Verify serious candidates in Zie619/n8n-workflows raw JSON and official docs for WebKMT substitutes.
- Shortlist maximum 3. Record exact title, verified Copy ID if available, raw JSON URL/GitHub path, search trail, node/integration inventory, Code/HTTP/security findings, paid dependencies, provenance/license status, substitution map, score, verdict, and rebuild test plan.
- Classify REBUILD, ADAPT IN SANDBOX, REFERENCE ONLY, or REJECT. If none qualify, mark GAP and propose an official-API skeleton.
- Never select from a card/title alone. Do not import, activate, use credentials, or write product code.

Deliver one report/file named N8N_SHORTLIST_BATCH_A.md with executive summary, coverage matrix, shortlist table, workflow cards, rejection log, gap list, and top rebuild sequence. Stop for my review.
```

**Owner gate:** approve, reject, or send back each primary pattern. Check exact URLs, knockout issues, paid dependencies, and whether Dify/source systems—not n8n—should own the logic.

---

### Prompt 3 — Convert approved patterns into a rebuild backlog

Start a build-planning session if needed. Upload the core files + `N8N_SHORTLIST_BATCH_A.md`, then paste:

```text
Convert only my approved Batch A patterns into a build-ready backlog. Do not code yet.

Read AI_BUILD_PACK.md §5–§7, AGENT_PROMPT_SEQUENCE.md §§3–5, docs/products/03_KEMET_RECEPTIONIST.md, and N8N_SHORTLIST_BATCH_A.md. Activate API/events, AI/RAG, n8n reliability, Design, Security, QA, and DevOps skills.

Create REBUILD_BACKLOG_BATCH_A.md. For each approved capability specify:
- WKMT_* workflow/system name and business proof metric
- Trigger and sanitized input/output schema
- Source-of-truth system and official API/webhook documentation to verify
- Tenant config fields; environment/credential NAMES only
- Idempotency key, retry/backoff, dead-letter/replay, and stop conditions
- Shared subflows/gateway endpoints required
- Design surfaces/states and Security controls/tests required
- Test fixtures: happy, duplicate/replay, invalid, unauthorized, dependency failure, Arabic/time-zone
- Acceptance tests, build complexity, and owner blockers that can be mocked

Then propose:
1. Separate product workspace/repo structure following AI_BUILD_PACK §5.
2. The first three increments in dependency order.
3. The exact local demo that must pass before real WhatsApp/Cal/CRM credentials are requested.
4. Anything that should be built in gateway/Dify/source system instead of n8n.

Stop for my approval. Do not create code or import workflows.
```

**Owner gate:** approve only the first three increments and the workspace location. Everything else stays backlog.

---

### Prompt 4 — Design + Security pre-build brief for the first slice

Use this before building any client-facing widget/form/dashboard or public integration:

```text
Produce a DESIGN + SECURITY PRE-BUILD BRIEF for Increment 0/1 only. Do not code yet.

Read AGENT_PROMPT_SEQUENCE.md §3 and §4, AI_BUILD_PACK.md §§5–7, docs/products/03_KEMET_RECEPTIONIST.md, and REBUILD_BACKLOG_BATCH_A.md.

Design brief:
- Primary users and task flows
- Surfaces/components/states, including loading/empty/error/success/permission states
- Design tokens/brand variables, Arabic RTL + English content needs
- WCAG 2.2 AA checks, keyboard/focus/form-error plan, mobile breakpoints
- Proof/conversion events and client-safe copy rules
- Exact screenshots/tests that will prove design quality

Security brief:
- Assets, actors, trust boundaries, and data-flow diagram/table
- Tenant isolation, auth/RBAC, webhook/API, upload/SSRF, rate-limit and replay controls as applicable
- Secrets/dependency/provenance rules; credential names only
- PII/consent/retention/log redaction rules
- AI/prompt-injection/tool-allowlist controls
- Security tests and go/no-go evidence for local demo vs public demo vs pilot

End with: design decisions needing my approval, security decisions needing my approval, and items safely mocked. Stop.
```

**Owner gate:** approve the user flow, visual/content direction, threat boundaries, and what remains mocked.

---

### Prompt 5 — Build Increment 0: Shared Platform skeleton

Open the agent in the approved **separate product workspace/repo**, then paste:

```text
Build INCREMENT 0 ONLY: Shared Platform local skeleton.

Follow AI_BUILD_PACK.md §5 and §7, REBUILD_BACKLOG_BATCH_A.md, and the approved Design + Security brief. Work only in this product workspace. Do not modify the WebKMT webfront unless I explicitly assign a webfront integration task.

Deliver:
- Local Docker Compose skeleton for the owned gateway, owner-operated n8n, and mocked/stubbed Dify + doc-intel boundaries needed for Batch A.
- .env.example with validated variable names/safe placeholders. No real secrets.
- One fake clinic/services seed tenant and sanitized fixtures.
- Gateway health endpoint, tenant-config lookup, structured logs with correlation/tenant IDs and PII redaction.
- OPS-01/OPS-02 foundations in the correct layer: error/dead-letter visibility and webhook idempotency/deduplication.
- Sanitized workflow exports + workflow README/test payloads if n8n workflows are created.
- Smoke tests proving clean startup, unknown/unauthorized tenant rejection, malformed payload rejection, duplicate webhook = one effect, dependency failure = visible dead-letter/error, and documented backup/restore impact.

Do not integrate real WhatsApp, Cal, CRM, email sending, payments, or client data. Use mocks/fixtures.
Run the tests, update README/RUNBOOK/build log, and finish with AI_BUILD_PACK.md §15 handoff including exact commands/results. Stop after Increment 0.
```

**Owner gate:** follow the README from a clean start. Reject “works” without duplicate/failure/unauthorized evidence.

---

### Prompt 6 — Build Increment 1: Receptionist instant lead intake (REC-01)

Paste only after Increment 0 passes:

```text
Build INCREMENT 1 ONLY: REC-01 Instant Lead Response with fixtures/mocks.

Read docs/products/03_KEMET_RECEPTIONIST.md, the approved REC-01 backlog entry/workflow card, and the Design + Security brief. Activate Design and Security packs.

User story:
Website lead form payload → gateway validation/deduplication/consent check → fake CRM/lead record created once → owner-alert mock → customer-acknowledgement mock → timestamps/audit prove ordering and response path.

Requirements:
- Arabic and English payload fixtures with realistic phone/name/service fields.
- Duplicate/replayed payload creates one lead/effect; invalid/missing-consent payload is rejected or quarantined safely.
- Dependency failure goes to dead-letter and can be replayed safely.
- Owner alert is action-oriented; customer copy is externalized/localizable.
- Form/widget states are accessible and mobile/RTL-safe if a test surface is included.
- No real WhatsApp, email, CRM, Dify, or secrets yet.
- Update tests, demo script, README/RUNBOOK notes, and BUILD_LOG.

Prove acceptance, duplicate, invalid, unauthorized/tenant, dependency-failure, and Arabic/time-zone cases. Finish with AI_BUILD_PACK.md §15 handoff. Do not start REC-02.
```

**Owner gate:** run the demo. Confirm the lead appears once, alerts are understandable, and failures are visible/recoverable.

---

### Prompt 7 — Generic one-increment build loop (reuse for every next capability)

```text
Build only [CAPABILITY ID / INCREMENT NAME] for [PRODUCT].

Read:
- AI_BUILD_PACK.md §3 and §5 quality gates
- docs/products/[DEDICATED PRODUCT FILE]
- The approved workflow card/backlog entry: [ID]
- The approved Design + Security brief/checklists for this surface
- Current BUILD_LOG and ADRs

Before coding, state a concise brief: user/outcome, scope, non-goals, source-of-truth/API contracts, design surfaces/states, security controls, mocks/blockers, and acceptance tests.

Then implement the smallest complete vertical slice:
- Configuration over forks; official APIs/webhooks; secrets only via environment names/values supplied outside chat.
- Idempotency, bounded retries, stop conditions, audit logs, and safe replay for events.
- Accessible, responsive, Arabic RTL-ready client surfaces with realistic content and error states.
- Tenant isolation, least privilege, validation, rate limits, and PII minimization.
- Tests for happy, duplicate/replay, invalid, unauthorized/cross-tenant, dependency failure, Arabic/time-zone, and restore impact as applicable.

Update code/config, sanitized workflow/DSL artifacts, seed/fixtures, README, RUNBOOK, CLONE_CHECKLIST, DEMO_SCRIPT, VERSIONS/LICENSE notes, and BUILD_LOG in the same change.
Run verification and finish with AI_BUILD_PACK.md §15 handoff. Do not start the next capability.
```

**Owner gate:** demo + test evidence + known limits. If the agent cannot run a test, the increment is “implemented, unverified,” not done.

---

## 7. Product build order and dedicated files

| Step | Build | Dedicated spec | First proof increment | Add/research next |
|---:|---|---|---|---|
| 0 | Shared Platform v1 | `AI_BUILD_PACK.md` §7 | Gateway + OPS-01/OPS-02 + seed tenant | Mocks for Dify/doc-intel/channels |
| 1 | ③ Kemet Receptionist | [`products/03_KEMET_RECEPTIONIST.md`](./products/03_KEMET_RECEPTIONIST.md) | REC-01 lead intake, then REC-02/04 service+booking skeleton | REC-05/06/07/08 |
| 2 | ④ Kemet Websites | [`products/04_KEMET_WEBSITES.md`](./products/04_KEMET_WEBSITES.md) | One Payload clinic/services template + WEB-01 form to Receptionist | WEB-02..08; add `TEMPLATE_GALLERY.md` |
| 3 | ① Kemet Business OS | [`products/01_KEMET_BUSINESS_OS.md`](./products/01_KEMET_BUSINESS_OS.md) | Golden ERPNext site + ERP-01 Invoice Inbox draft pipeline | ERP-03 approvals, ERP-04 reminders; add `ERP_PRODUCT.md` |
| 4 | Public demo promotion | Runbooks from Steps 0–3 | Deploy tested artifacts to VPS demo; restore test | Owner accounts/domains; no production client data |
| 5 | ② Kemet Store | [`products/02_KEMET_STORE.md`](./products/02_KEMET_STORE.md) | Bagisto golden store + STORE-01/02 order/payment skeleton | STORE-04/05; Saudi/payment gates |
| 6 | ⑤ Marketing Suite v1 | [`products/05_KEMET_MARKETING_SUITE.md`](./products/05_KEMET_MARKETING_SUITE.md) | MKT-01 consent sync + one Mautic journey + MKT-04 scheduling path | Platform developer apps started by owner early |
| 7 | ⑤ Intelligence v2 | Product ⑤ §V2 | INT-03 reviews or INT-06 competitor diff with evidence | INT-01/02/04/05; paid data only pass-through |

### Research batches after Batch A

Run these only when the corresponding product approaches:

- **Batch B:** `WEB-02`–`WEB-08`, `ERP-01`–`ERP-04`
- **Batch C:** `STORE-01`–`STORE-12`
- **Batch D:** `MKT-01`–`MKT-13`, `INT-01`–`INT-10`

Reuse Prompt 2 with the batch IDs and relevant dedicated product spec. Research can run in a separate session while a build increment is underway, but its output cannot change scope until you approve it.

### Product-entry prompt (use when starting each product)

```text
Start [PRODUCT NAME] using its dedicated spec: docs/products/[FILE].

Do not build yet. Produce a product-entry brief:
1. Buyer/users, painful moment, 60-second demo, proof metrics.
2. V1 scope/non-goals and first three vertical increments.
3. Approved repos/versions to verify and pin; license/white-label posture.
4. Source-of-truth data, integrations, workflow capability IDs, and shared-platform dependencies.
5. Seed/demo data needed.
6. Design surfaces/states, Arabic RTL/accessibility plan, and design evidence required.
7. Threat model, tenant/data boundaries, secrets/dependencies, compliance gates, and security evidence required.
8. Acceptance tests and clone/runbook deliverables.
9. Owner-only accounts/approvals and what will be mocked.
10. Cost/support risks and stop/ask conditions.

Reference exact sections from the dedicated spec, AI_BUILD_PACK, PRODUCT_STACK, and OPEN_SOURCE_STACK. Stop for my approval before coding.
```

---

## 8. Owner-only parallel tasks (do not delegate secrets to the agent)

Prepare these yourself when the relevant gate approaches:

- Test domain/subdomains and VPS access method.
- Meta/WhatsApp test setup and later client-number onboarding through official channels.
- Cal.com test account/event types and calendar connections.
- Demo social accounts and, for Product ⑤, platform developer-app submissions (Meta/YouTube/TikTok approvals can be slow).
- Payment-provider sandbox/merchant accounts for Product ②; merchants own production accounts/legal duties.
- Email sending domain and DNS access for SPF/DKIM/DMARC in Product ⑤.
- Any accountant/legal review required for ZATCA, consumer policies, privacy, or regulated claims.

Tell the agent only the **names/purposes/status** of accounts and environment variables. Enter secret values directly into the local/VPS secret store or `.env` outside chat.

---

## 9. Carry-forward rules between sessions

At the end of every session, save and re-upload/attach in the next session:

1. The agent's §15 handoff
2. Updated `BUILD_LOG.md`
3. Approved backlog and any new ADRs
4. Shortlist/workflow cards for active capabilities
5. Design + Security briefs/checklists for active surfaces
6. Test evidence summary and known blockers

Start the next session with:

```text
Continue WebKMT from the attached handoff/build log. Treat AI_BUILD_PACK.md §3 as the operating system and AGENT_PROMPT_SEQUENCE.md as the phase order. Summarize current state, last verified increment, blockers, and the single next increment you recommend. Do not code until I approve that next increment.
```

---

## 10. Stop conditions

Stop the agent and correct course if it:

- Tries to build all five products or a sixth platform at once.
- Imports community n8n JSON into production or asks for real credentials in chat.
- Cannot cite exact workflow title/raw URL/API docs for a recommendation.
- Substitutes a new engine/repo without an ADR and your approval.
- Patches upstream cores before proving no extension path exists.
- Claims payment, tax/ZATCA, WhatsApp, AI accuracy, or social-listening capability without implemented evidence.
- Produces UI without Arabic RTL/accessibility/error-state evidence.
- Produces integrations without tenant isolation, signed/idempotent event handling, or failure tests.
- Calls work production-ready without deployment, monitoring, backup/restore, and acceptance evidence.

The desired rhythm is: **orient → research → approve → backlog → design/security brief → build one slice → prove → document → repeat.**
