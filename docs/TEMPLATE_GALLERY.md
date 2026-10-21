# Template Gallery — "Pick a design, we launch it for you"

> **What it is:** A client-facing catalog on webkmt.com where a business owner **browses live demo websites/apps by business type, picks the one they like, and contacts you to launch it** — rebranded with their content, on their domain, within days. This is *not* a download store for developers (that idea stays postponed, see [`RESCUE_PLAN.md`](./RESCUE_PLAN.md) §1): it's a **sales accelerator** for Offer A. Payment is handled personally (§5) — no storefront needed.
>
> **Why it works:** SMB owners can't visualize "a custom website." They *can* say "I want that one, but blue." Picking beats imagining → faster yes, fixed price, near-zero delivery risk for you.

---

## 1. How a purchase flows (manual checkout, on purpose)

```
Client browses /templates → opens LIVE demo → clicks "Launch this for my business"
→ lands on WhatsApp (message pre-filled with template name) or the quote wizard (template pre-selected)
→ 15-min call: confirm pages/features/domain → Documenso agreement
→ You send payment details: bank transfer (IBAN) / Wise — or a card payment link (§5)
→ 50% deposit received → you deploy from the template's golden image, swap content/branding
→ Launch on their domain → balance paid → care plan starts
```

Every listing shows: **live demo link · what it includes · setup price range · monthly care plan · typical launch time · what can be customized.** Showing prices filters tire-kickers before they reach your WhatsApp.

## 2. Starter catalog (launch with 6–8, grow by recycling client work)

✏️ Prioritize your beachhead niche (RESCUE_PLAN §3.3). Suggested initial set:

| # | Template (working name) | For | Base to build from |
|---|---|---|---|
| 1 | Clinic Pro | Dental/medical/aesthetic clinics | Astro/Next theme + Cal.com booking + WhatsApp |
| 2 | Restaurant & Café | F&B | Theme + menu pages + reservations + Google reviews |
| 3 | Property Plus | Real-estate offices | Listings template (Payload CMS collections) |
| 4 | Salon & Spa | Beauty/barbers | Theme + Cal.com + service price list |
| 5 | Shop Starter | Instagram sellers → real store | Bagisto or WooCommerce theme |
| 6 | Services Pro | Law/accounting/consulting/agency | Corporate theme + Documenso-ready intake |
| 7 | Link-in-Bio ⭐ | Creators, IG shops, anyone | **Your own KMT Link** — free self-serve, or "done-for-you" micro-offer |
| 8 | Auto Services | Repair/rental/detailing | Theme + booking + job-status via WhatsApp add-on |

App-style templates (dashboards/internal tools) join later using the admin templates in [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) §C — list them as "business app starters" once Offer C clients ask.

**Growth rule:** every finished client project, anonymized with the client's permission, becomes a new gallery template. In a year the gallery is your portfolio *and* your product shelf.

## 3. Sourcing templates legally (read before adding anything)

| Source | License reality | Safe use |
|---|---|---|
| GitHub themes/templates (**MIT / Apache-2.0**) — Astro official themes, Payload templates, Medusa starters, many Next.js templates | 🟢 Use, modify, deploy for clients freely | ✅ Preferred. Keep license file in repo. |
| WordPress.org themes | 🟡 GPL | ✅ Deploy for clients; fine. |
| Free template sites (HTML5 UP, BootstrapMade free tier, similar) | 🟠 Often attribution-required (CC-BY style); redistribution of the raw template usually **prohibited** | ⚠️ Only deploy as a finished client site with credit intact, or buy the no-attribution license. Never offer the raw files. |
| ThemeForest / paid marketplaces | 🟠 Regular license = **one end product per purchase** | ⚠️ Buy one license *per client launch*. You may show a demo; you may not reuse one purchase for 10 clients. |
| Your own past projects | Yours (check client contracts) | ✅ Anonymize content/logos; get OK if identifiable. |

Rule of thumb: you're selling the **launched website + service**, never the template files themselves. When in doubt, MIT/Apache/GPL sources only.

## 4. Implementation on webkmt.com (small, fits your current stack)

- [ ] `/templates` page: filterable card grid (category filters: Clinics · Food · Shops · Services · All) — reuse your existing glassmorphism components; data from a Supabase `templates` table or a JSON file to start ✏️
- [ ] Each card: screenshot, name, niche, setup-from price, care-plan price, **[View Live Demo]** **[Launch This → WhatsApp]**
- [ ] Demos hosted as subdomains via Coolify wildcard: `demo-clinic.webkmt.com` etc. Static/template demos cost ~0 RAM; stop heavy demo containers when idle (8 GB budget)
- [ ] WhatsApp deep link per template: `wa.me/<you>?text=I'm interested in the "Clinic Pro" template for my business`
- [ ] Quote wizard: add hidden `template` parameter so submissions arrive pre-tagged (your `contacts` table + n8n routing already support the flow)
- [ ] Admin: manage listings from your existing admin dashboard (one more tab) — title, category, demo URL, prices, features, active flag
- [ ] Kemet (chatbot) update: recommend 2–3 templates when a visitor describes their business type, then offer the booking link

## 5. Getting paid (your manual-first model)

**Default (no gateway):** after the call, you send an invoice (from your ERP/Invoice Ninja) with payment details — local bank transfer (IBAN) for TR clients, Wise/bank details for GCC/international. Deposit 50% before customization, balance at launch (RESCUE_PLAN §9.1).

**Card payment links when needed — Merchant of Record options** (they become the legal seller, handle VAT/sales tax globally, and pay you out; you just send a link):

| | Dodo Payments | Lemon Squeezy |
|---|---|---|
| Fees | ~4% + 40¢ (+1.5% international cards) | ~5% + 50¢ |
| Seller onboarding | ~177 countries incl. individuals; actively targets markets Stripe ignores | Turkey listed as supported for sellers |
| Payouts | Twice-monthly by default; small payout fee/threshold — ✏️ confirm current TR terms | LS is being folded into Stripe Managed Payments (2026) — Türkiye bank payout reports are mixed; verify with a test sale |
| Best use | **Start here** for card links (per-project payment links + care-plan subscriptions) | Backup option |

Practical setup: create one product per offer ("Website Launch — Deposit 50%", "Care Plan $49/mo"…) and paste payment links into invoices/WhatsApp. For recurring care plans with local clients, standing bank transfer instructions are simpler and fee-free — use MoR mainly for international clients and template deposits. ✏️ Whichever you pick, run one small test transaction end-to-end to your bank before a real client does. (This is operational guidance, not tax/legal advice — as revenue grows, one hour with a local accountant pays for itself.)

## 6. Per-template production checklist (the golden image)

For each template, keep in your private `webkmt-delivery` repo:
- [ ] Source repo (forked, license file intact) + your customization branch
- [ ] `docker-compose`/Coolify config + `.env.example`
- [ ] 15-minute launch checklist: clone → env → domain → swap logo/colors/content → forms to client's WhatsApp/email → analytics (Umami) → backup schedule → uptime check
- [ ] Demo content pack (placeholder text/images per niche, EN/AR/TR)
- [ ] Screenshot set for the listing card

## 7. Targets ✏️

- Gallery live with **6 templates** before heavy outreach in the matching niches (RESCUE_PLAN Phase 2)
- **+1 template per completed client project** (recycled)
- Track: demo views → WhatsApp clicks → calls → launches (Umami events). Templates with views but no clicks need better screenshots/pricing, not more traffic.
