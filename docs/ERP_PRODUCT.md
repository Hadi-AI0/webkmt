# Product Spec — "Better than Odoo" Business OS

> **Working name:** ✏️ **Kemet Business OS** *(pick your own product name — never use "Odoo" or "ERPNext" in the product name; "Odoo alternative" in descriptions is fine)*
> **Built on:** [ERPNext](https://github.com/frappe/erpnext) (GPL-3.0) + Frappe framework (MIT) + your own configuration app & WhatsApp layer
> **Companion docs:** [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) §4 Offer C · [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) §D

---

## 1. The pitch (one paragraph)

Odoo locks growing businesses into per-user monthly fees forever — and its free Community edition quietly withholds the full accounting app, pushing everyone to paid Enterprise. **Kemet Business OS gives an SMB the whole system — accounting, inventory, sales, purchasing, POS, HR, CRM — for one flat monthly fee no matter how many employees use it**, pre-configured for their industry, in Arabic/Turkish/English, with WhatsApp notifications built in, and their data on a server they control. Nothing is paywalled because the base software is 100% open-source; what the client pays WebKMT for is *setup, configuration, hosting, training, and support* — which is exactly what you should be selling.

## 2. Why ERPNext is the base (and not the alternatives)

| Criterion | ERPNext ✅ | Odoo Community | Dolibarr | Build your own |
|---|---|---|---|---|
| Full accounting (double-entry) | ✅ Included | ❌ Full app is Enterprise-only | ⚠️ Basic | Months of work |
| Everything in one product (ERP+HR+CRM+POS) | ✅ (+HRMS/CRM apps) | ⚠️ Best apps are Enterprise | ✅ but simpler | ❌ |
| Per-user fees | None, ever | None on CE, but Enterprise pressure | None | — |
| License freedom to host & sell services | 🟡 GPL-3.0 — hosting/configuring for clients is fine; don't fork-patch the core (extend via your own app) | 🟡 LGPL open-core | 🟡 GPL | — |
| Multi-client on one install | ✅ **One "bench" = many client sites** (huge VPS cost advantage) | ⚠️ Multi-db possible, heavier | One instance each (but tiny) | — |
| Arabic / RTL | ✅ Native Arabic UI + RTL + bilingual invoice printing | ✅ Good | ⚠️ Partial | ❌ |
| Saudi ZATCA e-invoicing (Phase 2) | ✅ Open-source community apps exist (UBL 2.1 XML, QR, Fatoora clearance) — validate per client before promising | ✅ via localization (full = Enterprise) | ❌ | ❌ |
| Turkish language | ⚠️ Community translation exists, may be incomplete — your AI agent can help complete it for your clients (and it's a legit contribution back) | ✅ | ⚠️ | — |
| Ease for end users | Good, **after your simplification layer (§4)** | Polished | Simplest, dated UI | — |

**Role of Dolibarr:** keep it as "Business OS Lite" for micro-businesses (1–5 people) who would drown in ERPNext. Same sales motion, smaller ticket.

## 3. What's inside (module map)

**Core (ERPNext):** Accounting & invoicing · Sales & quotations · Purchasing · Inventory/stock (multi-warehouse, batches, barcodes) · Manufacturing-lite (BOM, work orders) · Built-in POS · Projects & tasks · Assets · Multi-currency (TRY/SAR/AED/USD) · Role-based permissions · Print formats (branded invoices) · Reports & dashboards
**Frappe family apps (same ecosystem):** HRMS (employees, attendance, leave, payroll) · CRM (leads/deals pipeline) · LMS (only if a training client appears)
**Your layer (the actual product differentiation — §4):** industry starter kits · simplified workspaces · WhatsApp notifications · onboarding wizard & training · ZATCA app configured (KSA clients)
**Community apps to evaluate per client:** ZATCA Phase 2 apps (e.g., `ERPGulf/saudi-phase-2`, `Beveren-Software-Inc/ZATCA_Integration` — check license & test in sandbox first) · POS Awesome (retail POS UI)

## 4. "Comprehensive yet easy" — your simplification layer

ERPNext out of the box intimidates small businesses. Your product = removing that fear. Concretely:

1. **Industry starter kits** (build one per niche as you win clients): chart of accounts, tax templates (KDV/VAT rates), item groups, print formats, and sample data pre-loaded for: ✏️ retail/shop · wholesale/trading · services/agency · small manufacturing · clinic-with-pharmacy-stock…
2. **Role workspaces:** owner sees money dashboards; cashier sees POS + today's sales; warehouse sees stock moves. Nobody sees the 40 modules they don't use. (ERPNext workspaces + role permissions — configuration, not code.)
3. **WhatsApp layer** (via your n8n + Evolution API): invoice sent → customer gets PDF on WhatsApp · payment overdue → polite reminder · stock below level → owner alert · daily 9pm sales summary to owner's WhatsApp. *This is the feature owners actually fall in love with.*
4. **Onboarding package:** data-import templates (Excel), 1-page "daily routine" cheat sheets per role (EN/AR/TR via your AI agent), 1 recorded training session the client keeps.
5. **Customization rule:** all your tweaks live in **your own Frappe app** (e.g., `kemet_os`: custom fields, print formats, fixtures, starter-kit data) installed on top of stock ERPNext. Never patch core files → upgrades stay safe, GPL obligations stay simple.

## 5. Packaging & pricing (✏️ adjust to market)

| Edition | For | Includes | Setup | Monthly (flat, unlimited users) |
|---|---|---|---|---|
| **Lite** (Dolibarr) | Solo/micro, invoicing + stock | Install, import, training | $500–$900 | $49–$79 |
| **Starter** (ERPNext) | 3–15 staff, sales/stock/accounting | Core modules + starter kit + WhatsApp invoices | $1,000–$2,000 | $99–$149 |
| **Growth** (ERPNext+) | 10–50 staff | + HR/payroll, POS, multi-warehouse, ZATCA (KSA), owner WhatsApp reports | $2,000–$4,000 | $179–$299 |
| Add-ons | any | Extra company/branch, custom reports, e-store sync, migration from Odoo/Excel | quoted | — |

**The anti-Odoo math (use in sales):** Odoo Online ≈ $20–30 **per user/month** → a 15-person company pays **$300–450/mo forever** and still doesn't own its data setup. Kemet OS: **one flat fee, all 15 users included.** Over 3 years the difference is five figures — say that sentence on every call.

## 6. Running it on your VPS (2 vCPU / 8 GB / 100 GB)

- Deploy with the official `frappe/frappe_docker` setup under Coolify; **one bench → one site per client** (`clientname.yourdomain.com` → later their domain).
- Realistic budget: bench (MariaDB + Redis + workers) ~2–3 GB RAM serving **~8–15 light SMB sites**; tune Gunicorn workers for 2 vCPU. Add swap. ERPNext sites are mostly idle — SMBs are not high-traffic.
- Disk discipline (100 GB total): client file attachments → S3-compatible storage (Cloudflare R2) via Frappe S3 settings; nightly per-site backups to R2 (ERPNext has built-in backup + Dropbox/S3 options); prune Docker images monthly.
- **Upgrade policy (write it into contracts):** pin a version, upgrade on a schedule (✏️ quarterly), always rehearse on a demo site first, never upgrade during a client's month-end close.
- Stop/idle non-essential demo containers when the bench needs headroom.

## 7. Demo & sales assets (build once)

- [ ] Demo site with a realistic ✏️ trading company (200 items, customers, open invoices) in EN + AR
- [ ] 5-minute demo script: create quotation → convert to invoice → customer receives it on WhatsApp → record payment → stock auto-decreases → owner gets evening WhatsApp summary → show profit report. *That sequence is the whole pitch.*
- [ ] One-page comparison sheet: Kemet OS vs Odoo (cost over 1/3 years, accounting included?, data ownership, user limits)
- [ ] Migration offer: "We move you from Excel/Odoo — your items, customers, and opening balances included in setup"

## 8. Honest limits — what NOT to promise

- **Turkey e-Fatura:** official integration requires licensed private integrators — do **not** promise native e-Fatura. Position as "runs your operations; connects alongside your existing e-Fatura provider" and revisit if a client funds the integration.
- **ZATCA (KSA):** claim "ZATCA Phase 2 ready" only after you've tested the chosen community app end-to-end in ZATCA's sandbox. Compliance details change; the client's accountant signs off, not you.
- **Offline POS:** ERPNext POS is browser-based with limited offline behavior — retail clients with flaky internet need expectations set (or evaluate POS Awesome).
- **Scope:** ERP projects balloon. Fixed module menu per edition; everything else = paid add-on. Two training sessions included, then support hours per care plan.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Frappe learning curve slows delivery | First install = your own agency books (dogfood). Build starter kits incrementally per client. |
| An upgrade breaks a client site | Pinned versions, demo-site rehearsal, per-site backups before any change |
| One VPS fails → all ERP clients down | Nightly offsite backups + documented restore (test it); when ERP MRR > ✏️ $500, split ERP clients onto their own VPS |
| Client outgrows shared bench | That's success: migrate them to a dedicated VPS, charge more |
| Community ZATCA app abandoned | Test before committing; budget add-on pricing to maintain/switch apps |

## 10. Build checklist (in dependency order)

- [ ] Install ERPNext bench via Coolify; create **your own agency site** and run WebKMT's invoicing on it
- [ ] Create `kemet_os` custom app skeleton (fixtures, print formats) in your private delivery repo
- [ ] Build Starter-kit #1 for your beachhead niche + demo data
- [ ] Wire WhatsApp notifications (n8n + Evolution): invoice PDF, payment reminder, daily summary
- [ ] Demo site + 5-min video + comparison one-pager (§7)
- [ ] First pilot client (free setup, care plan only — per RESCUE_PLAN §6.4) → starter-kit #1 hardens
- [ ] Optional by demand: ZATCA sandbox validation · HRMS kit · POS kit
