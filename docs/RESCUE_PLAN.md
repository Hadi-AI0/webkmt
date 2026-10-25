# WebKMT — Rescue & Growth Plan (v2)

> **What this is:** A practical, zero-budget plan to turn WebKMT from a struggling "we build everything" agency into a productized **business-systems installer** with recurring monthly revenue.
>
> **How to use this file:** It's a living document. Work through the checklists top to bottom — the order matters (each phase unlocks the next). Anything marked ✏️ is a decision/number you should edit for your market. Keep the Decision Log (§13) updated.
>
> **Companion files:**
> - [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) — vetted catalog of open-source repos, with license warnings
> - [`ERP_PRODUCT.md`](./ERP_PRODUCT.md) — spec for your "better than Odoo" product (Offer C)
> - [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md) — the pick-a-design catalog + manual payment flow (Offer A)
>
> **Last updated:** ✏️ 2026-10-20 (v2.1 — VPS specs, ERP product, Template Gallery, mini-apps kept) · **Status legend:** `- [ ]` todo · `- [x]` done

---

## 0. TL;DR — The whole strategy in one paragraph

You don't have a skills problem or a website problem. You have a **pipeline problem** and a **proof problem**. So: stop waiting for inbound leads and stop offering 8 custom services. Instead, install **ready-made open-source systems** (CRM/ERP, WhatsApp AI receptionist, booking, invoicing, store) on the VPS you already own, sell them as **3–4 fixed-price packages with a monthly care fee**, and win clients by **showing each prospect a live demo + a free audit of their current setup** before asking for money. Get the first 3 clients at near-cost in exchange for real testimonials and referrals (replacing the placeholder proof on your site today), then let care-plan MRR + referrals compound. Your AI agent does the heavy lifting on delivery, content, and paperwork; you do sales calls and relationships. Everything below costs **$0** beyond what you already pay for.

**New one-line positioning (✏️ edit freely):**
> *"WebKMT installs ready-to-run business systems — website, WhatsApp AI receptionist, online booking, invoicing & CRM — live in days, for one monthly fee."*

---

## 1. Honest review of your old growth plan

Your instinct to be skeptical was right. The old plan is well-written but built on a false assumption: **that you have traffic and leads to convert.** Here's the item-by-item verdict:

| Old plan item | Verdict | Why |
|---|---|---|
| Cal.com booking widget | ✅ **Keep** | Cheap, real friction-killer. Do it. |
| Kemet white-label ("AI agent as a service") | ✅ **Keep — promote to core offer** | Your most sellable idea. But sell it **WhatsApp-first**, not website-widget-first. Your market lives on WhatsApp. |
| Real testimonials | ✅ **Keep** | But you can't "collect" testimonials without clients first. Solved by the free-pilot tactic in §6.4. |
| Case-study SEO content engine | ⚠️ **Demote** | SEO takes 6–12 months to pay. A business fighting for survival needs cash this quarter. Write case studies *from real pilot clients* as a byproduct, max 1/month. |
| Mini-apps freemium subscription ($19/mo) | ⚠️ **Postpone the paywall, keep ALL the mini-apps** | A Pro tier needs thousands of users you don't have yet. Instead every mini-app stays live and free with a specific job in the funnel (§4 table). Make the Website Analyzer *usable with no login* — it's an outreach weapon first. Revisit subscriptions only if real usage data ever justifies them. |
| Templates marketplace | ✅ **Keep — but redefined** | As a self-serve *download store for developers* it would fail (no audience). As a **client-facing Template Gallery** — businesses pick a live demo design, contact you, pay manually, you launch it — it's a genuine sales accelerator. That's the version in this plan (§4 Offer A + [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md)). |
| Domain reseller | ❌ **Drop** | Pennies per sale, real support burden, pure distraction. Just register client domains at cost as part of delivery. |
| AI prompt packs / ebooks | ❌ **Drop** | Zero audience = zero sales. Give the knowledge away free as content instead (§6.5). |
| Partner/referral portal | ⚠️ **Demote & simplify** | Do partnerships *manually* with a handshake + spreadsheet first (§6.6). Build a portal only if volume justifies it. |
| Vertical SaaS (pick one industry) | ⚠️ **Reframe** | Right instinct, wrong sequence. Don't guess the vertical — let your first paying clients reveal it, then double down (§3.3). |
| Month 1–12 timeline | ❌ **Replace** | Solo schedules slip; dependency order doesn't. This plan is phased by "what unlocks what" instead (§12). |

**The two things the old plan completely missed:**

1. **No outbound motion at all.** Every item assumes visitors arrive on their own. With no audience, no ads budget, and a new domain's SEO weight, inbound alone will starve you. §6 fixes this.
2. **Your fake proof is a liability, not an asset.** The site currently presents case studies claiming *"$2.3M annual cost savings," "50,000+ active users," "featured in Saudi Design Week 2024,"* plus placeholder testimonials. If any prospect checks (and serious ones do), you're finished — and in TR/GCC business circles, word travels. §8.1 is your first fix, before any marketing.

---

## 2. What you're actually working with

| Asset | Reality check | How this plan uses it |
|---|---|---|
| Hostinger VPS | **2 vCPU · 8 GB RAM · 100 GB disk · 8 TB bandwidth** | Becomes your **client-systems factory** via Coolify (§5). Sized allocation in §5.3: the full shared stack + an ERPNext bench serving ~8–15 light ERP clients + many static/template sites. This is enough server to reach survival MRR without upgrades. |
| webkmt.com website | Technically solid, commercially overloaded, proof is placeholder | Repositioned around 3 offers + live demos (§8). |
| Personal phone number | Fine for now | WhatsApp Business profile properly set up (§7.3). Get a cheap second SIM/eSIM when revenue allows. |
| Gmail (business-named) | Sending as `@gmail.com` hurts credibility & deliverability | Send as `info@webkmt.com` via Zoho Mail free tier or Cloudflare Email Routing — $0 (§7.3). |
| Supabase free tier | ⚠️ Free projects **pause after ~7 days inactivity**, max 2 free projects | Keep for your own site (add an uptime ping, §7.2). For client apps, self-host Supabase/Postgres on your VPS instead. |
| Capable AI agent | Your unfair advantage | Delivery, audits, proposals, content, translations (EN/AR/TR), docs (§7.1). |
| GitHub account | Distribution + credibility channel you're not using | Public demo repos, templates, build-in-public proof (§6.5). |
| Mini-apps (Analyzer, KMT Link, ROI calc, Palette, Scheduler) | Already built; **all of them stay** | Each gets a specific funnel job (§4 table). Analyzer → **free audit lead magnet** (your #1 outreach tool). KMT Link → free brand product + the "Link-in-Bio" listing in your Template Gallery. Maintenance mode only — no *new* mini-apps until the MRR baseline is hit. |
| Kemet chatbot (Gemini) | Working RAG-ish assistant on your own site | Becomes the template for the client-facing AI receptionist offer (§4, Offer B). |

**Constraints to respect:** budget ≈ $0 · team = you · time is your only currency · one VPS = one point of failure (backups are non-negotiable, §11).

---

## 3. The new positioning

### 3.1 The mental shift

| ❌ Old framing (agency) | ✅ New framing (systems installer) |
|---|---|
| "We build custom ERP/CRM/POS/apps…" | "We install your business system: bookings + WhatsApp assistant + invoicing, live this week." |
| Client buys *your hours & risk* | Client buys *a working outcome they've already seen in a demo* |
| Every project starts from zero | Every project starts from a deployed open-source base, ~80% done |
| One-time payment, then hunt again | Setup fee + **monthly care plan (MRR)** on every client |
| Competitor = every dev agency & freelancer on earth | Competitor = the client's notebook, Excel file, and missed WhatsApp messages |

You are not competing with agencies anymore. You're competing with **chaos and missed calls** — a much easier sale.

### 3.2 Who to sell to first (pick by access, not by market-size slides)

Sell to businesses that are: (a) reachable by you today, (b) visibly losing money from a fixable operational gap, (c) able to pay a small monthly fee without a procurement department.

**Best-fit pool for TR + GCC SMBs** (✏️ circle the 2–3 you have any personal/local access to):

- Dental / medical / aesthetic clinics — appointment chaos, no-shows, WhatsApp overload
- Real-estate offices — leads scattered across WhatsApp, no follow-up system
- Restaurants / cafés / cloud kitchens — reservations, menus, repeat-customer offers
- Beauty salons / barbers / spas — booking + reminders = instant ROI
- Car services / rental / detailing — bookings, job tracking, invoicing
- Small e-commerce / Instagram sellers — orders in DMs, no store, manual everything
- Wholesalers / small manufacturers / traders — inventory + invoicing in Excel
- Training centers / tutors / gyms — scheduling, memberships, payment reminders
- Law / accounting / consulting offices — client intake, document signing, invoicing

### 3.3 The vertical rule

Don't pick your niche from this list by guessing. **Your first 3–5 paying clients pick it for you.** Whichever type says "yes" fastest becomes your beachhead: then build your demo, case study, and outreach list 100% around that vertical ("the booking system for Istanbul dental clinics" beats "software for everyone" every time). ✏️ Record the emerging pattern in the Decision Log (§13).

### 3.4 What you say "no" to

Custom from-scratch builds, native mobile apps, and "AI model fine-tuning" disappear from your headline offers. They stay available as **high-ticket add-ons quoted only after a paid discovery** (§9.2) — if a client truly needs one, they'll pay properly; if not, you just saved weeks. (On fine-tuning specifically: 95% of clients asking for it actually need a RAG chatbot over their own documents — which is Offer B. Sell them the outcome, skip the GPU bills.)

---

## 4. The offer menu (productized, fixed-price, demo-able)

Four offers. Each maps to open-source bases detailed in [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md). Prices are USD anchors — ✏️ convert/adjust per market (charge GCC clients in USD/SAR/AED; local TR clients may need TRY pricing — but anchor to USD value either way).

### Offer A — "Presence" · Business website that actually converts
- **What the client gets:** Fast multi-language site (✏️ EN/AR/TR as needed) on a proven template, WhatsApp click-to-chat everywhere, Google Maps + reviews embedded, online booking or quote form, basic local SEO + Google Business Profile setup.
- **Built from:** Astro/Next.js template + Payload CMS (or WordPress if the client insists on familiarity) — see Stack doc §C.
- **Setup:** $399–$899 · **Care plan:** $29–$49/mo
- **Your delivery time:** 1–2 days with templates + AI-written copy.
- **How it's sold:** through your **Template Gallery** ([`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md)) — the client browses live demo designs by business type, picks one, messages you, pays manually (bank details or a card link you send), and you launch it rebranded. The gallery *is* the pitch for this offer.

### Offer B — "Receptionist" · WhatsApp + website AI assistant ⭐ *(your flagship — lead with this)*
- **What the client gets:** An AI assistant trained on *their* prices, services, and FAQs that answers customers 24/7 on WhatsApp and their website, books appointments into a real calendar, captures leads, and hands off to a human in one shared inbox. Reminder messages before appointments.
- **Built from:** Evolution API (WhatsApp, **official Meta Cloud API channel** for client numbers) + Chatwoot (shared inbox) + AnythingLLM (RAG over client docs) + Cal.com (booking) + n8n (glue: reminders, lead notifications).
- **Setup:** $499–$1,200 · **Monthly:** $79–$149/mo (your AI API cost per client is typically $2–15/mo on Gemini-class models — the rest is margin).
- **Why it sells:** The demo is irresistible — *"message this number right now and watch it book you."* Nobody in their local market is offering this wrapped, installed, and maintained.

### Offer C — "Kemet Business OS" · your better-than-Odoo ERP product ⭐ *(✏️ confirm the product name)*
- **What the client gets:** One system replacing their Excel/notebook chaos: accounting, quotations & invoices, inventory, purchasing, POS, HR-lite, reports — deployed, pre-configured for their industry, their data imported, simplified per-role screens, WhatsApp invoice/reminder notifications, training included.
- **Built from:** **ERPNext** (100% open-source, no paywalled edition, native Arabic/RTL, ZATCA Phase 2 community apps for Saudi clients) + your own configuration app (starter kits, print formats, WhatsApp layer). One Frappe "bench" hosts *many* client sites — huge cost advantage. **Dolibarr** = the "Lite" edition for micro-businesses. Full product spec: [`ERP_PRODUCT.md`](./ERP_PRODUCT.md).
- **Setup:** $800–$4,000 by edition · **Monthly:** $49–$299 **flat — unlimited users** (this is the anti-Odoo headline: Odoo charges per user, forever; you don't).
- **Why it sells:** *"Everything Odoo does, nothing paywalled, no per-user fees, your data on your server — and it's already set up for a business like yours."*

### Offer D — "Automate" · Automation sprint (your foot-in-the-door)
- **What the client gets:** 3–5 concrete automations from a fixed menu: new lead → instant WhatsApp/email follow-up + CRM entry; invoice sent → polite payment reminders; job done → Google review request; form submission → spreadsheet + notification; weekly sales summary to owner's WhatsApp; social posts auto-scheduled.
- **Built from:** n8n running **on your instance** (this is license-safe — see §11.2) + Postiz for social scheduling.
- **Setup:** $300–$900 · **Monthly:** $49–$99/mo
- **Why it sells:** Cheapest "yes," fastest visible win, and it makes you the person who knows their operations — the natural upsell into A/B/C.

### The Care Plan (attach to *everything* — this is the business)
Hosting on your VPS · SSL · daily backups · uptime monitoring · security updates · ✏️ 1–2 small change requests/mo · monthly 1-page report (visitors, bookings, chats answered). **Rule: nothing ships without a care plan.** A client who won't pay $29–99/mo for maintenance is a future support nightmare — politely decline.

### Mini-apps — they all stay; each one gets a job

Nothing gets removed. Every mini-app keeps running, free, and each is assigned a role so it earns its place in the funnel instead of sitting behind a login:

| Mini-app | Its job now | Change needed |
|---|---|---|
| **Website Analyzer** | Top-of-funnel audit engine — the tool behind your outreach audits (§6.2) | Usable **without login**; email only for the full PDF report → feeds CRM |
| **KMT Link** | Free public product (backlinks + brand on every profile) + the **"Link-in-Bio" listing in the Template Gallery** — a done-for-you micro-offer for Instagram sellers/creators | Add "Powered by WebKMT — get yours" footer if not present; list it in the gallery |
| **ROI Calculator** | Sales-call & content asset: *"see what missed bookings cost you"* | Link it from Offer A/B sections + audit emails |
| **Color Palette Studio** | Branding teaser inside Offer A delivery (client picks palette during onboarding) | Link from Template Gallery "customize your look" copy |
| **Social Media Scheduler** (simulation) | Demo bridge → upsell to the *real* scheduling service (Postiz, Offer D add-on) | Add a "want this for real?" CTA to Offer D |
| **Kemet chatbot** | The living demo of Offer B on your own site | Point it at offers, templates & booking (§8.2) |

Rule: maintenance mode — fix bugs, no new mini-apps until the MRR baseline (§9.3). If usage ever justifies it, a Pro tier can return as a Phase-4 experiment.

### Retire from the headline (site structure only — nothing deleted)
"8 services" grid, mobile apps, AI fine-tuning, generic "digital transformation consulting" — these move to a quiet "also available / via paid discovery" position (§3.4, §9.2) so the 4 offers own the homepage.

---

## 5. The delivery factory — build on your PC, host on the VPS

Goal: any offer above should be **deployable in under ~2 hours** from a saved recipe, not re-engineered per client. **Development happens on your PC** (Docker Compose per product, golden artifacts in Git — see [`PRODUCT_STACK.md`](./PRODUCT_STACK.md) §1A); everything in this section is **hosting tier 1** — public demos + the first batch of clients, deploy-only from Git, expanded (or moved to client VPS) as MRR grows. Nothing is developed on the VPS.

### 5.1 Base layer (install once)
- [ ] **Coolify** (Apache-2.0, ~55k★) on the VPS — your one-click deployment panel; 280+ service templates, automatic SSL, per-client projects. *(Dokploy is a lighter alternative if RAM is very tight — see Stack doc.)*
- [ ] **Uptime Kuma** — monitor every client system; alerts to your WhatsApp/email.
- [ ] **Backups:** Coolify scheduled DB/volume backups → **Cloudflare R2** (10 GB free) daily. Test one restore. (Non-negotiable — see §11.3.)
- [ ] **Umami** — privacy-friendly analytics for your site + client sites (feeds the monthly care-plan report).
- [ ] Wildcard DNS: `*.webkmt.com` (or a cheap separate domain ✏️) → client demos at `clinic-demo.webkmt.com` etc. Real clients get their own domain pointed at your VPS.

### 5.2 Always-on shared services (install once, serve many clients)
- [ ] **n8n** (your instance only) — all automation glue, yours and clients'.
- [ ] **Chatwoot** — one instance, one "account" per client (inboxes stay separate).
- [ ] **Evolution API** — one instance, one WhatsApp instance per client number. ⚠️ Pin **v2.3.7** (v2.4+ requires activation) and use the **official Meta Cloud API** channel for client production numbers (Baileys/unofficial connections get numbers banned — demos only).
- [ ] **AnythingLLM** — one workspace per client (their docs → their chatbot brain).
- [ ] **Cal.com** — one instance, one team/calendar per client.
- [ ] **Documenso** — proposals & contracts with e-signature (yours + sellable to law/accounting clients).
- [ ] **ERPNext bench** — install once; first sites = **your own agency invoicing + the sales demo** (dogfooding), client sites added per sale. **Dolibarr** on first Lite-edition sale. See [`ERP_PRODUCT.md`](./ERP_PRODUCT.md) §10.
- [ ] **Your own CRM:** twenty or Baserow — your prospect pipeline lives here from day one.

### 5.3 Capacity budget — your actual VPS: 2 vCPU · 8 GB RAM · 100 GB disk · 8 TB bandwidth

| Service | Typical idle RAM | Runs for |
|---|---|---|
| Coolify itself | ~0.8–1.2 GB | everything |
| Chatwoot (Rails+Sidekiq+PG+Redis) | ~1–1.5 GB | all clients (shared) |
| n8n | ~0.3–0.5 GB | all clients (shared) |
| Evolution API | ~0.3–0.6 GB | all clients (shared) |
| AnythingLLM | ~0.4–0.8 GB | all clients (shared) |
| ERPNext bench | ~2–4 GB | **many clients** (multi-site!) |
| Dolibarr instance | ~0.2–0.4 GB | per client |
| Static/template client sites | ~0–0.1 GB each | per client |

**Your 8 GB allocation (everything above, running together):** OS+Coolify ~1.2 GB · ERPNext bench ~2–3 GB · Chatwoot ~1.2 GB · n8n 0.4 · Evolution 0.5 · AnythingLLM 0.6 · Cal.com 0.4 · Umami 0.2 · Uptime Kuma 0.1 · your website 0.3 → **≈ 6.9–7.9 GB — it fits, but with thin headroom.** Rules that keep it stable:
- Add a **2–4 GB swap file**; tune ERPNext Gunicorn workers for 2 vCPU.
- **Stop idle demo containers** (Template Gallery demos, Documenso if unused that week) — Coolify makes this one click; demos restart in seconds before a sales call.
- **100 GB disk is your real constraint**, not RAM: Docker images are fat (ERPNext ~2–3 GB, Chatwoot ~1.5 GB…). Prune images monthly, push client attachments/backups to Cloudflare R2, keep ≥20 GB free.
- 2 vCPU is fine for SMB workloads (mostly idle); run builds/upgrades off-hours.
- **Never run LLMs locally on this CPU VPS for clients** — API models (Gemini-class) cost pennies; local inference would eat the whole box.

### 5.4 The "golden image" rule
Every time you finish a client setup, immediately spend 30 minutes saving: the docker-compose/Coolify config, the n8n workflow exports, the chatbot prompt template, the onboarding checklist — into a private `webkmt-delivery` GitHub repo. Client #5 should take **⅓ the time** of client #1. This repo quietly becomes your most valuable asset (and, later, your template products).

---

## 6. Client acquisition — the zero-budget playbook

This is the section your old plan was missing. Ordered by speed-to-cash.

### 6.1 Build the prospect list (your first real asset)
- [ ] Pick **one niche + one city** to start (e.g., dental clinics, Istanbul ✏️).
- [ ] Manually harvest Google Maps results into your CRM: business name, owner name if visible, phone/WhatsApp, Instagram, website (or lack of), rating/review count.
- [ ] Score each prospect by *visible pain*: no website · website with no booking · active Instagram but orders only via DM · bad/no Google reviews management · WhatsApp number listed but clearly manual.
- [ ] Target list size: **100 scored prospects** before switching niches. (Your AI agent can help clean/qualify the list; respect platform ToS — manual/assisted collection of *public business contact info* only, no spam blasting.)

### 6.2 The audit hook (your unfair outreach weapon)
For the top-scored prospects, per prospect (~10 min with your AI agent):
1. Run **your own Website Analyzer** on their site (or review their Instagram/Maps presence if they have no site).
2. Produce a **1-page audit** (PDF): 3 specific problems found, what each is costing them, 1 screenshot. Use the template in `docs/assets/` ✏️ (create once, reuse forever).
3. Record a **2–3 minute screen video** (free: OBS) walking through the audit in your voice, ending with: *"Here's a working demo of how [similar business] fixed this — try it: [demo link / WhatsApp number]."*
4. Send audit + video. This is not a pitch — it's a gift with a door in it. Response rates crush cold "we make websites" messages.

### 6.3 Live demos (build once, sell forever)
- [ ] Demo 1: **Clinic receptionist** — fake clinic site + WhatsApp AI that books appointments (Offer B). ✏️ niche per §3.3
- [ ] Demo 2: **Business OS** — Dolibarr/ERPNext with realistic sample data (Offer C).
- [ ] Demo 3: **Template website** in your lead niche (Offer A).
Rule: **every outreach message, social post, and call ends with "try the live demo."** A prospect who has *used* the thing needs almost no convincing.

### 6.4 The free-pilot close (how you get real proof, fast)
For your first ✏️ 3 clients, offer: **"Free setup (normally $X), you only pay the monthly care fee, cancel anytime — in exchange for a testimonial, a case study, and 2 introductions if you're happy."**
- You're not working free — you're *buying* proof + referrals + MRR with setup labor you currently can't sell anyway.
- Get the testimonial ask in writing (Documenso) **before** you start.
- These 3 replace every placeholder on your website. One real "our no-shows dropped 40%" beats ten invented case studies.

### 6.5 Channels, ranked for your situation
1. **Direct outreach** (Instagram DM + WhatsApp Business message to publicly listed business numbers + email) with the audit hook — fastest, free, controllable. One thoughtful message + max one follow-up. Never mass-blast (bans + reputation).
2. **Local walk-ins & relationships** (Istanbul): barbers, clinics, cafés near you. Show the WhatsApp demo on *their* phone. A solopreneur's superpower is being a real local human.
3. **Google Business Profile for WebKMT** — free; captures "software company near me" searches; ask every pilot client for a Google review here.
4. **Build-in-public content:** short videos (TikTok/Reels/Shorts — one recording, three uploads; TR voice + AR/EN subtitles via AI): *"I gave this salon an AI receptionist in one day — watch it book a haircut."* Post ✏️ 3×/week. Simultaneously: GitHub activity (public template repos) + LinkedIn posts for GCC reach.
5. **Partners** (§6.6) — other people's client lists, zero ad spend.
6. **Freelance platforms** (Upwork/Fiverr productized gigs: *"I will install a WhatsApp AI booking assistant for your clinic"*) — treat as a **cash-flow bridge and testimonial farm**, not the main business. Take clients off-platform only within platform rules.
7. **SEO/blog** — last priority; publish only real case studies as they happen.

### 6.6 Partners who already have your clients
Pitch: *"You keep your client relationship; I install the system under your brand or mine; you get ✏️ 15% of setup + ✏️ 10% of monthly for a year."*
- Accountants / business consultants (they know every SMB's pain)
- POS hardware & cash-register sellers (natural Offer-C pairing)
- Print/signage/brand-design shops (they're asked "do you do websites?" weekly)
- Social-media freelancers (their clients need systems behind the content)
- Photographers/videographers serving restaurants, hotels, clinics
Track partners in your CRM. No portal needed until you have 10+ active partners.

### 6.7 The numbers that make this work (✏️ set your own targets)
| Activity | Target | Expected yield |
|---|---|---|
| Prospects researched & scored | 20/day | 100/wk list growth |
| Audit-based outreaches | 10–15/day | — |
| Replies / conversations | — | 2–5/week once audits are good |
| Demo calls booked | — | 1–3/week |
| Closes | — | 1–2 per 4–6 calls (rises sharply after pilot proof exists) |

If replies ≈ 0 after 100 outreaches: the audit or niche is wrong — change one variable, retest. Log it (§13). **Outreach is a daily habit, not a campaign.** Protect ✏️ 90 minutes/day for it before any building.

### 6.8 Momentum loop (how this compounds)
Pilot clients → real testimonials/case studies → website becomes believable → outreach reply rate rises → referrals from happy clients + partners → care-plan MRR covers your costs → you can afford to say no to bad projects → delivery templates get faster → margins rise → *then* (and only then) consider the self-serve/digital-products version of the old marketplace idea — the client-facing Template Gallery runs from Phase 2 regardless.

---

## 7. Automate your own agency (eat your own cooking)

### 7.1 AI-agent job list (delegate these to your agent, always)
Audits & prospect research summaries · first-draft proposals (from your call notes) · website copy & translations (EN/AR/TR) · chatbot knowledge-base prep from client docs · social captions & video scripts · monthly care-plan reports · onboarding docs & training scripts · code/template customization · this plan's upkeep.

### 7.2 n8n workflows to build for WebKMT itself (in this order)
- [ ] **Lead capture:** site form/quote wizard → CRM row + instant WhatsApp ping to you + auto-reply to lead with Cal.com link.
- [ ] **Audit requests:** analyzer submission → report generated → emailed + lead into CRM sequence.
- [ ] **Supabase keep-alive:** scheduled ping so your free-tier project never pauses. (Also ping every client system into Uptime Kuma.)
- [ ] **Signed = started:** Documenso webhook on signature → create project checklist + first invoice draft + kickoff message.
- [ ] **Review engine:** 7 days after launch → ask client for Google review + testimonial form (feeds §6.4 proof).
- [ ] **Monthly care report:** Umami + Uptime Kuma + Chatwoot stats → 1-page PDF → sent to client (this email is why care plans don't get cancelled).
- [ ] **Backup watchdog:** alert you if any backup is >26h old.

### 7.3 Professional-basics fixes ($0)
- [ ] **Domain email sending:** Zoho Mail free tier *or* Cloudflare Email Routing (+ Gmail "Send mail as"). Never pitch from `@gmail.com`.
- [ ] **WhatsApp Business** on your number: catalog (= your 4 offers), greeting message, quick-reply templates (pricing, demo links, booking link), away message.
- [ ] **Cal.com** "Free 20-min systems audit call" event type — every CTA points here.
- [ ] **Proposal/contract/invoice templates** (Documenso + Invoice Ninja or your ERP): fixed scope, 2 revision rounds, 50% deposit, care-plan terms, testimonial clause for pilots.

---

## 8. Website fixes (webkmt.com) — in priority order

### 8.1 🔴 Fix first — credibility triage
- [ ] **Remove or replace every unverifiable claim:** the "$2.3M savings / 50,000+ users / Saudi Design Week" case-study metrics and placeholder testimonials. Until pilot proof exists, label showcase work honestly as **"Live demo systems — try them"** (which is *stronger* anyway).
- [ ] Remove fake-looking stats counters if any; replace with demo links.

### 8.2 🟠 Then — restructure around the offers
- [ ] Hero: new positioning line (§0) + two CTAs: **"Try a live demo"** and **"Book a free audit call"** (Cal.com). WhatsApp stays as secondary.
- [ ] Replace the 8-services grid with the **4 offers + care plan**, each with starting price and a demo link. (Showing prices *increases* qualified leads and filters time-wasters.)
- [ ] "Live Demos" section: the 3 demo systems from §6.3 with one-click access + demo WhatsApp number.
- [ ] **`/templates` Template Gallery** page: live-demo cards by business type with prices + "Launch this" WhatsApp CTAs ([`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md) §4).
- [ ] Point Kemet (your chatbot) at the new offers; when a visitor shows intent, Kemet recommends 2–3 matching templates and offers the Cal.com booking + demo links (this was the old plan's best tactical idea — keep it).

### 8.3 🟡 Then — lead-magnet plumbing
- [ ] **Ungate the Website Analyzer** (no login to run; email required only to receive the full PDF report) → wire submissions into n8n (§7.2).
- [ ] One niche landing page per proven vertical as pilots land (e.g., `/clinics`) using that pilot's case study.
- [ ] Keep the blog, but only publish real case studies + "systems teardown" posts recycled from your videos.

---

## 9. Money rules

### 9.1 Payment discipline (non-negotiable)
- **50% deposit before work, 50% at launch.** Care plans prepaid monthly (✏️ or quarterly at a small discount).
- No deposit = no start. No exceptions "for exposure."
- **Payments are manual-first, by design:** the client talks to you → you send an invoice (from your ERP) with payment details — bank transfer (IBAN) locally, Wise/bank details internationally. When a card link is genuinely needed, use a Merchant of Record: **Dodo Payments** (~4% + 40¢; onboards individuals from ~177 countries incl. Türkiye; twice-monthly payouts) as primary, **Lemon Squeezy** (~5% + 50¢; Turkey supported for sellers, but it's being folded into Stripe Managed Payments — verify payout with a test sale) as backup. Details + per-offer payment-link setup: [`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md) §5. ✏️ Keep whatever you use aligned with your legal/tax status.

### 9.2 Paid discovery for anything custom
Anything outside Offers A–D → **$99–$199 paid "Systems Roadmap"** (audit + written plan + fixed quote; fee credited if they proceed). This single rule eliminates free-consulting time sinks and tire-kickers.

### 9.3 The MRR math that saves the business
| Care-plan clients | Avg monthly fee | MRR | What it covers |
|---|---|---|---|
| 5 | $79 | ~$395 | VPS + APIs + tools, several times over |
| 10 | $99 | ~$990 | Survival baseline — business stops dying |
| 25 | $129 | ~$3,225 | Real salary territory; hire/upgrade options open |

Setup fees are your growth fuel; **care plans are your salary.** Optimize every decision for "does this add/protect MRR?"

### 9.4 Say-no list
Equity/revenue-share instead of payment · "pay after we launch and see results" · unlimited revisions (2 rounds, then paid) · 24/7 support promises (offer ✏️ business-hours response) · projects requiring tech you'd have to learn from zero under deadline · clients who refuse the care plan.

---

## 10. What to STOP doing (explicitly)

- ❌ Building new platform features on webkmt.com "for later" (no self-serve digital-download store, no partner portal, no freemium billing) until the MRR baseline is hit. *(The client-facing Template Gallery is different — it's Offer A's sales tool, Phase 2.)*
- ❌ Building *new* mini-apps until the MRR baseline. The existing five all stay live and free — give them distribution (§4 table), not siblings.
- ❌ Presenting demo/placeholder work as real client results.
- ❌ Quoting custom builds before paid discovery.
- ❌ Learning a new stack per project — standardize on the Stack doc.
- ❌ Waiting for inbound. Outreach happens daily, before building (§6.7).
- ❌ Chasing enterprise/"50k budget" leads — your buyer is the owner-operator who can say yes in one call.

---

## 11. Risks & guardrails

### 11.1 WhatsApp number safety (your #1 operational risk)
Unofficial WhatsApp connections (Baileys mode in Evolution API) violate Meta's terms and **get numbers banned** — catastrophic if it's a client's main business number. Rules:
- Client production numbers → **official Meta WhatsApp Cloud API** only (first 1,000 conversations/month free tier; per-conversation pricing after — pass through in pricing).
- Baileys mode → your own demo/internal numbers only.
- Never send bulk unsolicited broadcasts from any number you care about.

### 11.2 License compliance (summary — full detail in Stack doc)
- **MIT/Apache** (Chatwoot core, Payload, Medusa, AnythingLLM…): white-label & resell freely, keep notices.
- **GPL/AGPL** (ERPNext, Dolibarr, Documenso, Cal.com…): totally fine to host for clients and charge for setup/hosting/support. If you *modify* AGPL code and offer it as a service, you must offer your modified source — so **configure and extend via plugins/settings; don't fork-patch cores.**
- **Fair-code / source-available** (n8n, NocoDB since Jan 2026, Directus): use internally and to *deliver services*, but you may **not** white-label or sell access to the tool itself. n8n's own FAQ allows building/running client workflows on your instance and charging for that work — clients just can't log into the editor. Sell *outcomes* ("lead follow-up automation"), never "n8n accounts."
- **Chatwoot branding:** custom branding is an Enterprise feature — keep default branding in the free CE or budget for premium later; don't strip it.
- Evolution API: Apache-2.0 + attribution/usage-notice conditions; **pin v2.3.7** to avoid the v2.4+ activation requirement.
- When in doubt: read the repo's LICENSE before selling anything built on it. (This section is guidance, not legal advice.)

### 11.3 Continuity
- Daily backups to Cloudflare R2 + one tested restore per month. One VPS failure must never become a client-data loss.
- Document a per-client **exit export** (their data, in standard formats) — paradoxically, this *increases* trust and closes deals ("you own your data, leave anytime").
- Basics for KVKK (TR) / PDPL (SA): collect minimum personal data, have a one-page data-processing note in contracts ✏️.

### 11.4 Burnout guardrail (solo-specific)
Cap concurrent builds at ✏️ 2. Care-plan support hours are bounded in the contract. Your scarcest asset is you.

---

## 12. The sequence (phases, not dates — finish a phase before starting the next)

### Phase 0 — Stop the bleeding (credibility + basics)
- [x] Remove/replace fake proof on the site (§8.1) — done 2026-10-20: portfolio + case studies are now honest live demos
- [ ] Domain email sending working (§7.3)
- [ ] WhatsApp Business profile + quick replies (§7.3)
- [x] Cal.com audit-call booking live (§7.3) — done 2026-10-21: native booking modal via Cal API proxy (key in `.env`). Remaining: create the "Free Audit Call" event type in the Cal dashboard.
- [x] Offers + starting prices on the website (§8.2) — done 2026-10-20 (4 offers + care strip live)
- [x] Ungate Website Analyzer → lead capture (§8.3) — done 2026-10-21: guest access, wired to the real SEO API (the page previously faked results!), lead form + downloadable HTML report.

### Phase 1 — Build the factory
- [ ] Coolify + R2 backups + Uptime Kuma + Umami (§5.1)
- [ ] n8n + lead-capture & keep-alive workflows (§7.2)
- [ ] Chatwoot + Evolution API (pinned) + AnythingLLM (§5.2)
- [ ] Your CRM stood up (twenty/Baserow) (§5.2)
- [ ] **ERPNext bench up — WebKMT's own invoicing running on it** + ERP demo site ([`ERP_PRODUCT.md`](./ERP_PRODUCT.md) §10)
- [ ] 3 live demos (§6.3) + `webkmt-delivery` private repo started (§5.4)

### Phase 2 — First clients (proof over profit)
- [ ] **Template Gallery live with 6 templates** + demo subdomains ([`TEMPLATE_GALLERY.md`](./TEMPLATE_GALLERY.md))
- [ ] 100-prospect scored list (§6.1)
- [ ] Audit template + video workflow (§6.2)
- [ ] Daily outreach habit running (§6.7)
- [ ] 3 free-pilot clients signed with testimonial clause (§6.4)
- [ ] Pilots delivered → testimonials, Google reviews, case studies live
- [ ] 2 partner conversations/week (§6.6)

### Phase 3 — Charge properly & compound
- [ ] Setup fees at full price; pilots converted to standard care plans
- [ ] Beachhead vertical chosen from evidence (§3.3) → niche landing page + list #2 in that vertical
- [ ] Monthly care-report automation live (§7.2)
- [ ] Content rhythm 3×/week from real client wins (§6.5)
- [ ] Offer C (ERP) golden image after first 2 installs (§5.4)
- [ ] Hit 10 care-plan clients → **survival baseline** 🎯

### Phase 4 — Only after baseline (revive old-plan ideas, now with an audience)
- [ ] *Optionally* add self-serve checkout (Dodo/Lemon Squeezy) to the Template Gallery and package internal templates as digital products — only if gallery traffic proves the demand
- [ ] Partner portal *if* partner volume demands it
- [ ] One vertical SaaS experiment *if* the same customization keeps recurring across 5+ clients in your beachhead
- [ ] Consider: second VPS, part-time support help, raising prices 20% (do this regularly — existing clients grandfathered ✏️)

---

## 13. Decision log & monthly review (✏️ fill in — keep at top of your workflow)

### Decision log
| Date | Decision | Why | Revisit when |
|---|---|---|---|
| ✏️ | Lead niche #1 = ______ | ______ | After 100 outreaches |
| 2026-10-20 | ERP product = **ERPNext-based "Kemet Business OS"** (Dolibarr = Lite edition) | 100% open (nothing paywalled), multi-site bench, Arabic/RTL + ZATCA apps | After first 2 ERP clients |
| 2026-10-20 | "Marketplace" = client-facing **Template Gallery** with manual payment (bank/Wise; Dodo/Lemon Squeezy links when needed) | Clients pick designs visually; no store build needed; payment stays personal | If gallery volume ever demands self-serve checkout |
| 2026-10-20 | All 5 mini-apps stay, free, each with a funnel job | They're distribution assets, not products (yet) | If usage data justifies a Pro tier |
| | | | |

### Monthly review (30 min, first ✏️ Monday)
- MRR: $______ (care-plan clients: ______) · Setup revenue: $______
- Outreaches sent: ______ · Calls: ______ · Closes: ______ · Close rate: ______%
- Best channel this month: ______________ · Worst time sink: ______________
- One delivery step to templatize next: ______________
- Price experiment running: ______________ · Result: ______________
- Next month's single priority: ______________

---

## Appendix A — First-message scripts (adapt to TR/AR; personalize the bracketed parts — never mass-send)

**Instagram/WhatsApp DM (audit hook):**
> Hi [Name], I help [clinics] in [city] stop losing bookings to missed messages. I did a quick free check of [Business]'s online setup and found [specific issue, e.g., "your Google page has no booking link, and your WhatsApp replies after hours go unanswered"]. I made you a 2-minute video showing the 3 fixes — want me to send it? No pitch, just the video.

**Follow-up (after sending the video):**
> Here's a live demo of the assistant I set up for a [similar business] — message this number and try booking: [link/number]. If you'd like this on your own number, I install it free for the first [3 businesses this month] in exchange for feedback — you only cover the small monthly running cost. 15-min call to see if it fits? [Cal.com link]

**Partner pitch:**
> Your clients keep asking you about websites/booking systems, right? I install ready-made systems (website, WhatsApp booking assistant, invoicing) under the hood — you introduce me, I handle everything, you get [15%] of setup and [10%] monthly for a year. Want me to show you the 2-minute demo you'd be sharing?

**Discovery-call questions (steal these):**
1. Walk me through what happens when a new customer contacts you today.
2. Where do inquiries get lost or answered late?
3. What do you do in Excel/notebooks that you hate most?
4. If this worked perfectly, what would change in numbers? (bookings, hours, sales)
5. Who besides you will use it daily? · 6. What have you tried before and why did it fail?

## Appendix B — Audit one-pager outline (build once as a template)
Header: business name + date + "Prepared free by WebKMT" → **Snapshot:** where customers find them today (Maps/IG/site) → **3 leaks:** (problem → evidence screenshot → estimated cost in missed bookings/sales) → **The fix:** the relevant Offer, in one sentence → **Proof:** live demo link/QR → **Next step:** QR to Cal.com audit call. One page. Always.

---
*Companion: [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) — every repo behind these offers, with licenses, RAM costs, and ready-made "golden combos."*
RCE_STACK.md) — every repo behind these offers, with licenses, RAM costs, and ready-made "golden combos."*
 and [10%] monthly for a year. Want me to show you the 2-minute demo you'd be sharing?

**Discovery-call questions (steal these):**
1. Walk me through what happens when a new customer contacts you today.
2. Where do inquiries get lost or answered late?
3. What do you do in Excel/notebooks that you hate most?
4. If this worked perfectly, what would change in numbers? (bookings, hours, sales)
5. Who besides you will use it daily? · 6. What have you tried before and why did it fail?

## Appendix B — Audit one-pager outline (build once as a template)
Header: business name + date + "Prepared free by WebKMT" → **Snapshot:** where customers find them today (Maps/IG/site) → **3 leaks:** (problem → evidence screenshot → estimated cost in missed bookings/sales) → **The fix:** the relevant Offer, in one sentence → **Proof:** live demo link/QR → **Next step:** QR to Cal.com audit call. One page. Always.

---
*Companion: [`OPEN_SOURCE_STACK.md`](./OPEN_SOURCE_STACK.md) — every repo behind these offers, with licenses, RAM costs, and ready-made "golden combos."*
RCE_STACK.md) — every repo behind these offers, with licenses, RAM costs, and ready-made "golden combos."*
