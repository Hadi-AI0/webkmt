# 04 — Kemet Websites (Templates + Client-Managed CMS)

> **Dedicated standalone product build spec.** This file is the product-specific source of truth for scope, architecture, modules, acceptance tests, and the copy-paste build prompt. Common rules still come from the master build pack.
>
> **Read with:**
> - [`../AI_BUILD_PACK.md`](../AI_BUILD_PACK.md) — master system prompt, common skills, artifact contract, quality gates, and handoff format
> - [`../AGENT_PROMPT_SEQUENCE.md`](../AGENT_PROMPT_SEQUENCE.md) — exact ordered prompts and recommended agent skill packs, including Design and Security
> - [`../PRODUCT_STACK.md`](../PRODUCT_STACK.md) — frozen five-product architecture and cross-product decisions
> - [`../OPEN_SOURCE_STACK.md`](../OPEN_SOURCE_STACK.md) — approved repos, licenses, deployment and white-label guardrails
> - [`../N8N_WORKFLOW_SELECTION_GUIDE.md`](../N8N_WORKFLOW_SELECTION_GUIDE.md) — workflow capability IDs, search packs, scoring, and rebuild rules
> - [`../TEMPLATE_GALLERY.md`](../TEMPLATE_GALLERY.md) — Template Gallery sales surface and manual payment/launch flow

## How an agent should use this file

1. Load the Master System Prompt from `AI_BUILD_PACK.md` §3.
2. Load this dedicated spec and the relevant task brief; do not load unrelated product specs unless integrating across products.
3. Activate the Design and Security skill packs in `AGENT_PROMPT_SEQUENCE.md` before any client-facing surface, integration, public demo, or production gate.
4. Build one tested vertical slice at a time and finish with the handoff format in `AI_BUILD_PACK.md` §15.

## Product-specific design focus

Reusable design systems and niche templates, client-safe CMS editorial UX, Arabic RTL typography, WCAG-conscious components, local-business conversion, and performance budgets.

## Product-specific security focus

CMS roles and editorial guardrails, secure forms/uploads, spam defenses, session/admin protection, dependency updates, backups/restore, and safe publishing workflows.

---

## Commercial contract

- **Buyer/users:** business owner/marketer who edits content; visitors/leads; WebKMT operator who launches/hosts templates.
- **Pain:** outdated website and developer dependency for every text/photo/offer change.
- **Promise:** choose a proven niche template, launch rebranded quickly, and safely edit everyday content without a developer while WebKMT handles hosting/updates/backups under a care plan.
- **Proof metrics:** clone/launch effort, client edit-task success/time, page performance, form conversion, support requests for routine edits, uptime.
- **60-second demo:** edit a headline, price/offer, and photo in the CMS → preview/publish → live page updates → submit the lead form → Receptionist/CRM receives it instantly.

## Approved architecture

- **Core:** Payload CMS, one instance per client from a golden template codebase/config; Postgres and managed media storage per deployment.
- **Template system:** shared block/component library, design tokens, niche seed content, locale framework, SEO defaults, analytics/lead integrations. Structural innovation becomes a reusable template feature, not a one-off client fork.
- **Astro variant:** only as a deliberately separate lightweight landing-page template family after the Payload golden path is proven; do not split v1 effort across two architectures without an ADR.
- **Lead path:** forms → owned gateway/n8n → Receptionist/CRM/owner alert with spam/consent controls.

## V1 scope

1. **Two golden templates:** (a) clinic/health or appointment-led services; (b) professional/local services. Restaurant/real-estate variants follow after clone proof.
2. **Content model:** site settings, header/footer/navigation, pages with reusable blocks, services, team, testimonials, FAQs, offers, blog/posts, media, forms/submissions, redirects, users/roles, SEO fields, locales.
3. **Block library:** hero, trust/logos, services, benefits/process, pricing/offers, gallery, testimonials, FAQ, team, CTA, contact/map, blog list/detail. Each block has validation, responsive behavior, accessibility, empty-state rules, and editor help text.
4. **Client-safe CMS:** admin branding, editor/admin roles, drafts/preview/publish workflow supported by the chosen Payload setup, media alt-text/crop guidance, locked structural settings, audit/activity where available, concise client guide and training checklist.
5. **Conversion/SEO:** metadata/Open Graph, sitemap/robots, structured data for local business/services/FAQ where valid, analytics events, WhatsApp click-to-chat, contact/booking CTAs, Google Business Profile launch checklist.
6. **Forms/security:** validation, honeypot/rate limit/CAPTCHA-ready adapter, consent text, submission notifications/storage, spam quarantine, file-upload restrictions if enabled.
7. **Operations:** seed/reset, domain/TLS checklist, redirects, backups/restore, media optimization, cache/performance budgets, update/rollback procedure.

## Acceptance tests

1. Clone each golden template, apply new logo/colors/fonts/content/locales, and launch locally using only the checklist.
2. A non-technical editor test completes: edit hero, add service, change price/offer, publish blog post, replace image with alt text, update hours/phone; no code or broken layout.
3. Arabic RTL + English pages, mobile/tablet/desktop, keyboard/focus/contrast, and form errors pass checks.
4. Form submission reaches gateway/CRM/owner alert once; spam/duplicate/provider-failure behavior is safe and visible.
5. SEO outputs validate (metadata, canonical/robots/sitemap/structured data) and performance budgets are recorded.
6. Roles prevent editors from destructive/admin-only actions; backup/restore includes DB/media/config and restores a working site.
7. Broken links/images and missing required content are caught by pre-launch checks.

## Product ④ agent prompt

```text
Build Kemet Websites v1 under the WebKMT Master System Prompt. Use Payload CMS as a per-client golden template system and deliver two cloneable niche templates (appointment-led clinic/services and professional/local services) with a shared accessible block library, design tokens, Arabic RTL + English locales, client-safe editorial roles/help, SEO/structured data, analytics/WhatsApp CTAs, spam-resistant forms wired to the gateway/Receptionist, seed content, and backup/restore/update procedures. Prove a non-technical editor can complete routine edits without breaking layout, forms reach CRM exactly once, performance/accessibility budgets pass, and a full clone/restore works from the checklist. Do not create one-off client forks or split v1 across a second site architecture without an ADR. Package demo scripts, client guide, runbook, clone checklist, license/version notes, costs, and known limits.
```

---

## Maintenance rule

When this product's scope, architecture, modules, acceptance tests, or build prompt changes, update this dedicated file first. Then update only the summary/cross-reference in `AI_BUILD_PACK.md` and `PRODUCT_STACK.md` so the documents do not drift.
