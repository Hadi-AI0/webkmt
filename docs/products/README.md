# WebKMT Dedicated Product Specs

These files split the five WebKMT products into standalone, product-specific build specifications. They are the detailed source of truth for each product's scope, architecture, modules, acceptance tests, and copy-paste agent prompt.

| Order | Product | Dedicated spec |
|---:|---|---|
| ① | Kemet Business OS (ERP) | [`01_KEMET_BUSINESS_OS.md`](./01_KEMET_BUSINESS_OS.md) |
| ② | Kemet Store (E-commerce) | [`02_KEMET_STORE.md`](./02_KEMET_STORE.md) |
| ③ | Kemet Receptionist (Service & Acquisition AI) | [`03_KEMET_RECEPTIONIST.md`](./03_KEMET_RECEPTIONIST.md) |
| ④ | Kemet Websites (Templates + Client-Managed CMS) | [`04_KEMET_WEBSITES.md`](./04_KEMET_WEBSITES.md) |
| ⑤ | Kemet Marketing Suite | [`05_KEMET_MARKETING_SUITE.md`](./05_KEMET_MARKETING_SUITE.md) |

## How these fit with the other docs

- [`../AI_BUILD_PACK.md`](../AI_BUILD_PACK.md) remains the common operating system: master prompt, shared skills, artifact contract, quality gates, shared platform, and handoff format.
- [`../AGENT_PROMPT_SEQUENCE.md`](../AGENT_PROMPT_SEQUENCE.md) is the exact ordered prompt runbook for moving from orientation to workflow research to building, including recommended Design and Security skill packs.
- [`../PRODUCT_STACK.md`](../PRODUCT_STACK.md) remains the frozen five-product portfolio/architecture overview.
- [`../OPEN_SOURCE_STACK.md`](../OPEN_SOURCE_STACK.md) remains the component/license/deployment decision record.
- [`../ERP_PRODUCT.md`](../ERP_PRODUCT.md) remains useful deep research for Product ①; the dedicated ① spec is the build-facing source of truth.

## Anti-drift rule

Product-specific changes go in the dedicated product file first. Update portfolio summaries only when a cross-product decision changes.
