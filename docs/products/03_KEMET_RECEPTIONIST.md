# 03 — Kemet Receptionist (Service & Acquisition AI)

> **Dedicated standalone product build spec.** This file is the product-specific source of truth for scope, architecture, modules, acceptance tests, and the copy-paste build prompt. Common rules still come from the master build pack.
>
> **Read with:**
> - [`../AI_BUILD_PACK.md`](../AI_BUILD_PACK.md) — master system prompt, common skills, artifact contract, quality gates, and handoff format
> - [`../AGENT_PROMPT_SEQUENCE.md`](../AGENT_PROMPT_SEQUENCE.md) — exact ordered prompts and recommended agent skill packs, including Design and Security
> - [`../PRODUCT_STACK.md`](../PRODUCT_STACK.md) — frozen five-product architecture and cross-product decisions
> - [`../N8N_WORKFLOW_SELECTION_GUIDE.md`](../N8N_WORKFLOW_SELECTION_GUIDE.md) — workflow capability IDs, search packs, scoring, and rebuild rules
> - [`../OPEN_SOURCE_STACK.md`](../OPEN_SOURCE_STACK.md) — Dify operating model, Evolution/Chatwoot/Cal licensing and integration guardrails

## How an agent should use this file

1. Load the Master System Prompt from `AI_BUILD_PACK.md` §3.
2. Load this dedicated spec and the relevant task brief; do not load unrelated product specs unless integrating across products.
3. Activate the Design and Security skill packs in `AGENT_PROMPT_SEQUENCE.md` before any client-facing surface, integration, public demo, or production gate.
4. Build one tested vertical slice at a time and finish with the handoff format in `AI_BUILD_PACK.md` §15.

## Product-specific design focus

Conversational UX, clear AI/human handoff, accessible embeddable widget design, concise Arabic/English microcopy, transparent booking states, and owner alerts designed for action in seconds.

## Product-specific security focus

Tenant/KB isolation, prompt-injection defense, PII minimization, tool authorization, official WhatsApp channels, consent and follow-up stop rules, rate limits, usage logs, and safe human escalation.

---

## Commercial contract

- **Buyer/users:** business owner, front desk/support/sales staff, website visitors, WhatsApp customers/leads.
- **Pain:** repetitive questions, missed after-hours inquiries, slow lead response, no-shows, leads scattered across channels.
- **Promise:** every inquiry receives a fast, useful, branded response; service questions are answered from approved knowledge; qualified leads are captured, alerted, booked, and followed up automatically; humans take over with context.
- **Proof metrics:** median first-response time, conversations resolved without staff, qualified leads, bookings, after-hours captures, handoff rate, no-show rate, follow-up replies, AI cost per conversation.
- **60-second demo:** message a fake Arabic clinic on WhatsApp → Receptionist answers and books a real slot; submit a website lead form → instant reply, qualification, CRM row, and owner alert occur before the prospect looks up.

## Approved architecture

`Website widget / WhatsApp / webform / Chatwoot channels → owned gateway → Dify golden app(s) → tool/API calls (Cal, CRM/ERP/store, doc-intel) → Evolution/Chatwoot/n8n follow-up and reporting`

- **Dify:** intent routing, RAG, field extraction, answer generation, summaries. Golden DSL cloned per client app; KB source documents versioned separately.
- **Gateway:** tenant resolution, channel identity, config, rate limits, session/consent, usage logs, tool authorization, response policy, provider abstraction.
- **Evolution API:** official WhatsApp Cloud API for client numbers; Baileys only disposable demos.
- **Chatwoot:** human inbox/handoff and omnichannel history.
- **Cal.com:** availability/booking truth.
- **n8n:** lead routing, reminders, follow-up ladders, CRM sync, reports, watchdogs.

## V1 scope

1. **Golden clinic/services demo tenant** with Arabic/English KB, services, FAQs, policies, working hours, booking rules, escalation contacts, and seed conversations.
2. **Website widget** owned/branded, embeddable, mobile/accessible, locale-aware, with privacy/consent notice and human-contact fallback.
3. **WhatsApp service flow:** greeting/identity, language detection, grounded FAQ/service answers, structured field collection, booking/reschedule/cancel through Cal, reminders, human handoff with summary/transcript.
4. **Acquisition flow:** webform/WhatsApp/ad-response entry → response target under 60 seconds where channel/provider permits → deduplication → configurable qualification fields → lead score/status → CRM/Baserow/ERPNext or client CRM record → owner alert with summary/contact action → Day 1/3/7 (configurable) follow-up ladder that stops on reply/booking/opt-out/human takeover.
5. **KB operations:** source intake from documents/web pages through doc-intel/Dify; approval/version/freshness manifest; test-question evaluation; no unapproved auto-publication of changed policies/prices.
6. **Safety/policy:** grounded-answer and uncertainty rules, no invented prices/availability/discounts/medical/legal advice, emergency/professional escalation scripts by niche, prompt-injection and cross-tenant isolation tests, PII minimization/retention.
7. **Reporting:** weekly owner report and internal dashboard data: volume, first-response median, resolved/handoff, leads/bookings, after-hours, follow-up outcomes, token/API cost, top unanswered questions.

## V2 scope

- Additional Chatwoot channels (Instagram/Facebook/Telegram/email) after WhatsApp/web are reliable.
- Voice only as a separately priced/approved module after latency, consent, recording, and cost analysis.
- Deeper ERP/store tools (order status, invoice balance, appointment history) with authenticated identity checks.

## Acceptance tests

1. Evaluation set of at least 50 representative Arabic/English questions (plus Turkish if enabled): grounded accuracy, refusal/escalation, and formatting meet documented thresholds; no cross-tenant facts.
2. Booking creates/reschedules/cancels through Cal; conflicts/provider outages produce safe alternatives and never claim success without confirmation.
3. Website lead test produces deduped CRM record, instant customer response workflow, owner alert, and measurable timestamps.
4. Follow-up ladder stops on reply, booking, opt-out, human takeover, and max attempts; business hours/time zones honored.
5. Human handoff in Chatwoot includes summary, collected fields, intent, urgency, and transcript link/context.
6. Prompt-injection, malicious file/link, abusive, emergency, unknown-policy, and provider-timeout cases follow policy.
7. Usage/cost/rate-limit logs are tenant-scoped; widget passes mobile/accessibility/RTL checks; backup/restore covers DSL/KB sources/config, not secrets.

## Product ③ agent prompt

```text
Build Kemet Receptionist v1 under the WebKMT Master System Prompt as the flagship service-and-acquisition AI. Build the owned gateway and embeddable web widget, Dify golden chatflow/DSL with approved KB sources, official WhatsApp integration design through Evolution, Chatwoot handoff, Cal booking, CRM lead capture/deduplication, owner alerts, reminders, and stop-safe n8n follow-up ladders. Seed an Arabic/English clinic or services demo and maintain an evaluation set for grounded answers, escalation, prompt injection, tenant isolation, booking conflicts/outages, lead speed, and cost logging. Never invent prices or availability; call authoritative APIs and escalate uncertainty. Prove the 60-second service+booking and lead-response demos, then package DSL/KB manifests, sanitized workflows, runbook, clone checklist, reports, security/license notes, costs, and known limits.
```

---

## Maintenance rule

When this product's scope, architecture, modules, acceptance tests, or build prompt changes, update this dedicated file first. Then update only the summary/cross-reference in `AI_BUILD_PACK.md` and `PRODUCT_STACK.md` so the documents do not drift.
