# 02 — Kemet Store (E-commerce)

> **Dedicated standalone product build spec.** This file is the product-specific source of truth for scope, architecture, modules, acceptance tests, and the copy-paste build prompt. Common rules still come from the master build pack.
>
> **Read with:**
> - [`../AI_BUILD_PACK.md`](../AI_BUILD_PACK.md) — master system prompt, common skills, artifact contract, quality gates, and handoff format
> - [`../AGENT_PROMPT_SEQUENCE.md`](../AGENT_PROMPT_SEQUENCE.md) — exact ordered prompts and recommended agent skill packs, including Design and Security
> - [`../PRODUCT_STACK.md`](../PRODUCT_STACK.md) — frozen five-product architecture and cross-product decisions
> - [`../N8N_WORKFLOW_SELECTION_GUIDE.md`](../N8N_WORKFLOW_SELECTION_GUIDE.md) — workflow capability IDs, search packs, scoring, and rebuild rules
> - [`../OPEN_SOURCE_STACK.md`](../OPEN_SOURCE_STACK.md) — Bagisto decision and the Saudi store/ZATCA/payment pack

## How an agent should use this file

1. Load the Master System Prompt from `AI_BUILD_PACK.md` §3.
2. Load this dedicated spec and the relevant task brief; do not load unrelated product specs unless integrating across products.
3. Activate the Design and Security skill packs in `AGENT_PROMPT_SEQUENCE.md` before any client-facing surface, integration, public demo, or production gate.
4. Build one tested vertical slice at a time and finish with the handoff format in `AI_BUILD_PACK.md` §15.

## Product-specific design focus

Conversion-first storefronts, mobile Arabic RTL browsing/checkout, trust and policy clarity, accessible product discovery, fast media, and low-friction merchant operations.

## Product-specific security focus

PSP-hosted payment scope, verified idempotent webhooks, customer-account protection, admin RBAC, order/PII minimization, fraud/refund controls, media/upload safety, and merchant-owned compliance gates.

---

## Commercial contract

- **Buyer/users:** merchant/owner, store operator, support staff, online shoppers, B2B buyers where enabled.
- **Pain:** orders through DMs/spreadsheets, no reliable online payment/stock/order process.
- **Promise:** a complete, owned online store cloned from a golden image, localized and operationally ready, with Saudi-market configuration where applicable.
- **Proof metrics:** clone/launch effort, checkout completion, page performance, order-processing time, abandoned-cart recovery, repeat/review rate, support tickets per order.
- **60-second demo:** browse Arabic RTL storefront → add product → sandbox checkout → order + stock + customer notification + admin alert appear → AI assistant answers a product question using live catalog/policy data.

## Approved architecture

- **Core:** Bagisto instance per client; WebKMT theme/packages/configuration; no core edits.
- **Payments:** merchant-owned PSP accounts; provider modules/adapters selected per market; invoice/tax actions triggered from verified payment webhooks, idempotently.
- **AI/support:** Receptionist engine with catalog/policy retrieval and live API lookups for price/stock/order status.
- **Marketing:** events to Mautic/n8n for abandoned cart, post-purchase, reviews, winback; consent and suppression respected.
- **ERP route:** optional Product ① synchronization/ZATCA route after both v1s are stable.

## V1 scope

1. **Golden store** with demo catalog: categories, attributes, simple/configurable products, variants, inventory, search/filter/sort, promotions/coupons, customer accounts/guest checkout, wishlist/compare only if native and useful.
2. **Checkout/operations:** cart, addresses, shipping zones/methods, tax/VAT-inclusive display rules, COD/bank transfer where applicable, one sandbox online-payment path, orders, invoices/shipments/refunds, transactional email, WhatsApp order alerts/status through approved channels.
3. **Localization:** Arabic + English at minimum for Saudi golden image; Turkish configuration retained where supported; RTL, currencies, address/phone formats, localized policies/templates.
4. **Saudi pack configuration:** merchant legal placeholders (legal name, CR, VAT number, contacts/policies), National Address-ready fields, payment/shipping/BNPL adapter slots documented from the Stack doc, Arabic invoice/print requirements, launch checklist distinguishing merchant duties from WebKMT setup.
5. **Merchandising/content:** homepage sections, banners, CMS pages, SEO metadata/sitemap, analytics events, product import template with image/attribute validation.
6. **Modules:** AI shopping assistant grounded in live catalog/policies; delivered-order Review Collector trigger; abandoned-cart event export to Marketing Suite; supplier-invoice intake handoff to Product ①/doc-intel where sold.
7. **Operations:** media/storage config, cache/queue/search choices documented, backup/restore, admin roles, security hardening, demo reset.

## Non-goals/gates

- Do not promise a payment method, BNPL, shipping carrier, or ZATCA compliance until the merchant account/adapter/sandbox/production verification exists.
- Do not build a marketplace/custom storefront platform in v1. Medusa/custom builds require a separate high-ticket ADR.
- Do not trigger invoices from browser success pages; use verified payment webhooks/server-side order state.

## Acceptance tests

1. Clone golden store, import demo catalog, configure brand/locales/currency/tax/shipping using only the checklist.
2. Complete guest/account checkout on mobile and desktop in Arabic RTL and English; stock, order emails/status, admin records are correct.
3. Replay, duplicate, malformed, and unsigned payment webhooks cause no duplicate order/invoice/payment effects.
4. Refund/return and out-of-stock/variant edge cases behave safely; AI assistant refuses/guards when live price/stock lookup fails.
5. Review request fires only after eligible delivery and routes unhappy customers privately; abandoned-cart event respects consent/frequency rules.
6. Performance/accessibility/security checks meet documented budgets; backup/restore includes DB/media/config.
7. Saudi launch checklist clearly shows incomplete merchant-owned items and blocks a “compliant/live” claim until verified.

## Product ② agent prompt

```text
Build Kemet Store v1 under the WebKMT Master System Prompt. Use Bagisto as a per-client golden image and customize through themes/packages/configuration, never core edits. Deliver a localized Arabic RTL + English demo store with catalog/import, variants/inventory, search, promotions, guest/account checkout, shipping/tax configuration, sandbox payment and verified idempotent webhooks, orders/refunds, transactional notifications, SEO/analytics, Saudi launch/compliance configuration, AI shopping assistant using live catalog/policy APIs, review/cart event hooks to the Marketing Suite, hardened admin roles, and backup/restore. Prove cloneability, mobile checkout, webhook replay safety, stock/refund correctness, AI grounding, performance/accessibility, and restore. Clearly separate merchant-owned legal/payment/ZATCA duties from implemented technical features and do not claim unverified compliance. Package the universal artifact contract.
```

---

## Maintenance rule

When this product's scope, architecture, modules, acceptance tests, or build prompt changes, update this dedicated file first. Then update only the summary/cross-reference in `AI_BUILD_PACK.md` and `PRODUCT_STACK.md` so the documents do not drift.
