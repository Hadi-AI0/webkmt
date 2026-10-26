# 05 — Kemet Marketing Suite

> **Dedicated standalone product build spec.** This file is the product-specific source of truth for scope, architecture, modules, acceptance tests, and the copy-paste build prompt. Common rules still come from the master build pack.
>
> **Read with:**
> - [`../AI_BUILD_PACK.md`](../AI_BUILD_PACK.md) — master system prompt, common skills, artifact contract, quality gates, and handoff format
> - [`../AGENT_PROMPT_SEQUENCE.md`](../AGENT_PROMPT_SEQUENCE.md) — exact ordered prompts and recommended agent skill packs, including Design and Security
> - [`../PRODUCT_STACK.md`](../PRODUCT_STACK.md) — frozen five-product architecture and cross-product decisions
> - [`../N8N_WORKFLOW_SELECTION_GUIDE.md`](../N8N_WORKFLOW_SELECTION_GUIDE.md) — workflow capability IDs, search packs, scoring, and rebuild rules
> - [`../OPEN_SOURCE_STACK.md`](../OPEN_SOURCE_STACK.md) — Mautic/Postiz decisions, platform approvals, licensing and honest data-source limits

## How an agent should use this file

1. Load the Master System Prompt from `AI_BUILD_PACK.md` §3.
2. Load this dedicated spec and the relevant task brief; do not load unrelated product specs unless integrating across products.
3. Activate the Design and Security skill packs in `AGENT_PROMPT_SEQUENCE.md` before any client-facing surface, integration, public demo, or production gate.
4. Build one tested vertical slice at a time and finish with the handoff format in `AI_BUILD_PACK.md` §15.

## Product-specific design focus

Email/social content design systems, approval workflows, readable growth reports, alert prioritization, accessible templates, and bilingual campaign microcopy.

## Product-specific security focus

OAuth/token protection, consent and suppression, sender-domain authentication, platform-terms compliance, approval-gated public replies, PII-safe analytics, and lawful intelligence collection.

---

## Commercial contract

- **Buyer/users:** owner/marketer, sales/support staff responding to conversations, WebKMT operator running managed marketing operations.
- **Pain:** email list unused, irregular social posting, conversations scattered, no visibility into reviews/sentiment/competitor moves, multiple subscriptions and manual reports.
- **Promise:** one owned marketing operating system for campaigns/journeys, social scheduling, unified conversations, review/brand alerts, competitor watch, and a clear monthly growth report — with honest data-source coverage.
- **Proof metrics:** list growth, campaign/journey revenue or conversions, deliverability, posts shipped on schedule, mention/review response time, sentiment trend, competitor moves caught, report preparation time.
- **60-second demo:** new store product/lead triggers a segmented email journey; a week of social posts is approved/scheduled; a negative review/mention is classified, drafted, alerted, and answered after human approval; owner sees one report.

## Approved architecture

- **Mautic per client:** contacts/segments, campaigns, journeys, scoring, forms/landing pages, sending configuration, unsubscribe/suppression, campaign analytics.
- **Postiz shared/unmodified:** connected social accounts/workspaces, scheduling/cross-posting through API/n8n where supported; WebKMT reports/approval surfaces are client-facing, not the Postiz console.
- **Chatwoot shared:** DMs/comments/email/WhatsApp conversations and human handoff, shared with Product ③.
- **Dify:** copy variants, personalization assistance, reply drafts, sentiment/intent/topic/urgency classification within evaluated limits.
- **n8n:** event triggers, syncs, content pipeline, alerts, report assembly, watchdogs.
- **Owned intelligence service:** lawful collectors/APIs → normalized mentions/reviews/competitor observations → classification → alert/report store. Reuse the existing WebKMT scraper patterns where lawful/appropriate; respect robots, terms, authentication, and rate limits.

## V1 scope — campaigns, scheduling, conversations, report

1. **Mautic golden instance:** brand/theme configuration, sender domain checklist (SPF/DKIM/DMARC), contact import/dedupe/consent fields, segments/tags, scoring starter rules, forms/landing-page templates, email templates (Arabic/English), unsubscribe/suppression verification.
2. **Starter journeys:** welcome/lead nurture, abandoned cart (from Product ②), post-purchase/review request handoff, dormant-customer reactivation (Reach playbook), appointment/service follow-up (from Product ③). Each has entry/exit, frequency caps, consent checks, test contacts, and reporting.
3. **Postiz golden setup:** agency developer-app/account checklist, workspace per client, channel connection guide, content calendar process, media naming/approval workflow, API/n8n draft/schedule path where verified, token-expiry/failure alerts.
4. **Unified conversations:** Chatwoot routing/labels, AI draft reply with mandatory approval rules by risk, escalation and SLA/response-time reporting.
5. **Monthly growth report v1:** email, social, conversation, lead/order source metrics with definitions and data-freshness; generated from stored data/exports, not hand-assembled screenshots.
6. **Operations:** cron/queue monitoring for Mautic, backup/restore, sending limits/reputation checklist, social token health, role/access matrix.

## V2 scope — intelligence and competitor watch

1. **Owned-channel intelligence:** comments/DMs/reviews from connected accounts; near-real-time only where provider APIs/webhooks actually support it.
2. **Workable public sources:** YouTube Data API within quota, Google Business Profile/Places where authorized/available, RSS/news/blogs and client-approved web sources, scheduled lawful crawls.
3. **Classification/evaluation:** sentiment, intent, topic, urgency, language/dialect; labeled Arabic/English evaluation set; confidence and human review; spike/complaint alerts.
4. **Competitor Watch:** competitor website/page diffs (price/promo/product claims), public review count/rating changes where lawfully available, content/RSS changes, manual/assisted Meta Ad Library checks; evidence snapshots and monthly digest.
5. **Engagement loop:** listen → classify → draft → human approve → respond via approved channel → log outcome. No fully autonomous public replies for complaints, crises, legal/medical/financial topics, or low confidence.

## V3 / pass-through only

- X/Twitter or third-party social-listening data only with client-approved paid API/data budgets and contractual/terms review.
- No Reddit-dependent architecture, TikTok/open-Instagram firehose promises, credential sharing, fake engagement, or TOS-evading scrapers.

## Acceptance tests

1. Clone Mautic golden instance; import/dedupe test contacts with consent states; suppressed/unsubscribed contacts receive nothing.
2. Each starter journey triggers from test lead/order/appointment events, exits correctly, respects frequency/time-zone rules, and reports conversions.
3. Sender-domain preflight catches missing SPF/DKIM/DMARC; bounce/complaint/unsubscribe handling is documented/tested with provider sandbox where available.
4. Schedule test posts to owned/sandbox social accounts; expired token/API failure alerts the operator and does not silently drop content.
5. Incoming test conversation receives an AI draft; risky/low-confidence drafts require approval; SLA/report data is correct.
6. Monthly report regenerates from source data with metric definitions, totals reconciled to Mautic/Postiz/Chatwoot samples.
7. V2 classifiers meet documented evaluation thresholds by language/category; competitor diff produces evidence-linked alert without false “real-time” claim.
8. Backup/restore covers Mautic DB/files/config, Postiz data/config, workflow exports, report/intel data; secrets/tokens are re-entered/rotated per runbook, never committed.

## Product ⑤ agent prompt

```text
Build Kemet Marketing Suite in phases under the WebKMT Master System Prompt. For v1, deliver a cloneable per-client Mautic golden setup with consent/dedupe/segments/scoring/templates and tested starter journeys, a shared unmodified Postiz scheduling setup with workspace/token-health operations, Chatwoot conversation workflows with approval-gated AI drafts, n8n event/report glue, and a reproducible monthly growth report. Prove suppression/unsubscribe safety, journey entry/exit, sender-domain preflight, scheduling failure alerts, report reconciliation, tenant isolation, and backup/restore. For v2, add lawful owned-channel/YouTube/review/web collectors, evaluated Arabic/English sentiment-intent classification, alerts, and evidence-based Competitor Watch. Never promise X/Reddit/TikTok/open-Instagram firehose listening or use TOS-evading collection; paid data is v3 pass-through. Package the universal artifact contract with platform approval checklists, costs, risks, and known limits.
```

---

## Maintenance rule

When this product's scope, architecture, modules, acceptance tests, or build prompt changes, update this dedicated file first. Then update only the summary/cross-reference in `AI_BUILD_PACK.md` and `PRODUCT_STACK.md` so the documents do not drift.
