# 01 — Kemet Business OS (ERP)

> **Dedicated standalone product build spec.** This file is the product-specific source of truth for scope, architecture, modules, acceptance tests, and the copy-paste build prompt. Common rules still come from the master build pack.
>
> **Read with:**
> - [`../AI_BUILD_PACK.md`](../AI_BUILD_PACK.md) — master system prompt, common skills, artifact contract, quality gates, and handoff format
> - [`../AGENT_PROMPT_SEQUENCE.md`](../AGENT_PROMPT_SEQUENCE.md) — exact ordered prompts and recommended agent skill packs, including Design and Security
> - [`../PRODUCT_STACK.md`](../PRODUCT_STACK.md) — frozen five-product architecture and cross-product decisions
> - [`../OPEN_SOURCE_STACK.md`](../OPEN_SOURCE_STACK.md) — approved repos, licenses, deployment and white-label guardrails
> - [`../N8N_WORKFLOW_SELECTION_GUIDE.md`](../N8N_WORKFLOW_SELECTION_GUIDE.md) — workflow capability IDs, search packs, scoring, and rebuild rules
> - [`../ERP_PRODUCT.md`](../ERP_PRODUCT.md) — earlier deep ERP research, editions, positioning, and ZATCA/Arabic notes

## How an agent should use this file

1. Load the Master System Prompt from `AI_BUILD_PACK.md` §3.
2. Load this dedicated spec and the relevant task brief; do not load unrelated product specs unless integrating across products.
3. Activate the Design and Security skill packs in `AGENT_PROMPT_SEQUENCE.md` before any client-facing surface, integration, public demo, or production gate.
4. Build one tested vertical slice at a time and finish with the handoff format in `AI_BUILD_PACK.md` §15.

## Product-specific design focus

Back-office usability, role-based dashboards, dense-data clarity, print formats, Arabic/RTL reports, error-tolerant imports, and review queues operators can trust.

## Product-specific security focus

Financial segregation of duties, least-privilege roles, immutable audit trails, safe data imports, draft-only document automation, signed approval actions, backups, and ZATCA production gates.

---

## Commercial contract

- **Buyer/users:** owner/manager, accountant, salesperson, purchaser, warehouse staff, approvers.
- **Pain:** company runs on spreadsheets, paper, chat messages, and memory; invoices/stock/approvals are slow and error-prone.
- **Promise:** one pre-configured business operating system for sales, purchasing, stock, accounting, approvals, and reports — flat product packaging rather than per-user ERP rent (final offer/pricing remains in `RESCUE_PLAN.md`).
- **Proof metrics:** onboarding/clone effort, invoice-processing time, approval cycle time, stock accuracy, overdue receivables, month-end/report preparation time.
- **60-second demo:** WhatsApp/upload an Arabic supplier invoice → draft Purchase Invoice appears with matched supplier/lines/totals → manager approves an expense/purchase from WhatsApp → audit trail and updated record appear.

## Approved architecture

- **Core:** ERPNext/Frappe shared bench, one site per client.
- **WebKMT layer:** Frappe configuration/app artifacts for industry kits, roles, print formats, dashboards, import templates, workflow definitions, and integration endpoints. No ERPNext core patches.
- **Document intake:** email/upload/WhatsApp → gateway/n8n → doc-intel → Dify structured extraction/validation assistance → ERPNext REST API draft records.
- **Approvals:** ERPNext Workflow as source of truth; n8n/Evolution sends actionable WhatsApp notifications; signed, expiring, one-time action links/tokens call owned gateway; gateway verifies actor/state and updates ERPNext.
- **Reports/alerts:** ERPNext reports/dashboards; n8n scheduled AR aging/payment chaser, low-stock, pending-approval digests.

## V1 scope

1. **Golden site template** for a trading/services SMB: company, chart of accounts starter, taxes/VAT structure, currencies, users/roles/permissions, numbering, print formats (Arabic/English), email/notification templates.
2. **Core operations:** customers, suppliers, items/services, price lists, quotations, sales orders/invoices, payments/receivables, purchase requests/orders/receipts/bills, stock/warehouses, expenses, basic reports/dashboards.
3. **Data onboarding:** CSV templates and validation/import scripts for opening balances, customers, suppliers, items, stock; dry-run and error report.
4. **Invoice Inbox v1:** intake, OCR/parse, supplier match, invoice number/date/currency/subtotal/VAT/total/line extraction, duplicate detection, arithmetic checks, ZATCA QR decode when present, confidence/review queue, **draft-only** Purchase Invoice creation. No automatic submission/payment.
5. **WhatsApp Approvals v1:** purchase/expense approval notification with approve/reject action, state/expiry/actor validation, audit trail, fallback link to ERPNext.
6. **Payment chaser v1:** configurable overdue ladder by email/WhatsApp with opt-out/stops, owner digest, no harassment/unbounded sends.
7. **Operations:** site backup/restore, user/role checklist, health checks, upgrade rehearsal, seed trading company, admin quick guide.

## V2 / gated scope

- Saudi ZATCA Phase 2 production e-invoicing through the verified route in `ERP_PRODUCT.md`/Stack docs: sandbox onboarding, CSID/UBL/hash/QR/reporting/clearance behavior, Arabic authoritative invoices, accountant/ZATCA test evidence. **Do not label compliant before the gate passes.**
- Additional industry kits (manufacturing, clinic/services, retail/POS) only after the trading/services golden site is clone-proven.
- Store→ERP order/inventory/invoice synchronization as a flagship integration after Products ① and ② v1 stabilize.

## Data and controls

- ERPNext is source of truth for accounting/stock/documents. Doc-intel/Dify outputs are proposals until validated/posted in ERPNext.
- Every integration-created record stores source, external IDs, correlation ID, confidence/review status where applicable.
- Financial automations require maker/checker or draft/review for low confidence, mismatched totals, duplicate invoice numbers, unknown suppliers, tax anomalies, and changed bank details.
- Role matrix must separate sales, purchasing, warehouse, accounting, approval, and system administration.

## Acceptance tests

1. Clone a golden site and load seed/import data using only the clone checklist.
2. Create quote → sales invoice → payment; stock and receivables/reports reconcile.
3. Process 10 representative Arabic/English supplier invoices (PDF/photo/scan): fields/lines meet agreed evaluation thresholds; duplicates/math errors are flagged; only drafts are created.
4. Approve/reject from WhatsApp with valid, expired, replayed, and unauthorized tokens; only the valid first action changes state and all attempts are auditable.
5. Overdue ladder sends only eligible reminders and stops after payment/reply/opt-out.
6. Backup and restore a site to a clean bench; users/roles/documents/files survive.
7. Arabic/RTL print/report samples render correctly; unauthorized roles cannot access restricted accounting data.

## Product ① agent prompt

```text
Build Kemet Business OS v1 under the WebKMT Master System Prompt and ERP_PRODUCT.md. Use ERPNext/Frappe as a shared bench with a golden trading/services site; customize through Frappe configuration/apps/import artifacts, never core patches. Deliver core sales/purchasing/stock/accounting setup, CSV onboarding, Arabic/English print formats, Invoice Inbox draft-only pipeline through doc-intel with confidence/duplicate/math validation, WhatsApp approvals with signed expiring one-time actions and audit, and a bounded payment-chaser. Seed a realistic trading company and prove clone, quote-to-payment, invoice-intake evaluation, approval security, reminder stop conditions, Arabic/RTL output, role isolation, and backup/restore. Treat ZATCA production compliance as a separate verified gate, not a claim. Package runbook, clone checklist, demo script, license/version notes, costs, and known limits.
```

---

## Maintenance rule

When this product's scope, architecture, modules, acceptance tests, or build prompt changes, update this dedicated file first. Then update only the summary/cross-reference in `AI_BUILD_PACK.md` and `PRODUCT_STACK.md` so the documents do not drift.
