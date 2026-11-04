# WEBKMT website design audit and direction

Status: locked for the 2026 public-website refactor.
Content source of truth: `docs/DEMO_KNOWLEDGE_PACK_WEBKMT.md` v0.8.

## Tooling installed / checked

- UI/UX Pro Max CLI 2.15.0 installed globally in the sandbox and initialized for Claude with `uipro init --ai claude`.
- Anthropic `frontend-design` skill installed from `anthropics/skills`.
- Impeccable CLI 4.8.0 was run through npm. Its direct project installer could not download from `impeccable.style` in this sandbox, so the same Impeccable skill was installed from `pbakaus/impeccable` on GitHub. The Impeccable detector itself runs from npm.
- Audit command used: `npx impeccable detect index.html templates.html case-study.html css`.

## Existing design-token map

The website does have tokens; the problem is drift and duplication, not total absence.

| Area | Current state found |
| --- | --- |
| CSS inventory | 17 CSS files, about 322 KB. The main pages link 12 bundles directly, and bundles import more files. |
| Variables | 276 custom-property declarations / about 199 unique matched definitions, with repeated and conflicting values. |
| Colour | Primary teal `#0aacb8` competes with secondary indigo `#6366f1`, dark-theme violet `#7c3aed`, amber `#f59e0b`, and one-off rainbow tool gradients. 67 unique hex colours were found. |
| Typography | CSS names Inter/Poppins, but those Latin fonts are not loaded on the homepage. Cairo and Noto Sans Arabic are loaded. Latin therefore falls back unpredictably by OS. |
| Elevation | 135 `box-shadow` declarations and 64 unique shadow recipes; glass/inset highlights are used as decoration. |
| Radius | 285 radius declarations and 35 unique values, mixing token radii with hard-coded 6–50px values. |
| Responsive rules | 102 media queries across 20 forms, including 479/480, 767/768 and 1023/1024 variants. |
| Gradients | 107 gradient declarations and 45 unique recipes. The visual language is gradient-led rather than content-led. |
| Inline styling | 64 inline `style=` attributes in `index.html`, including the hero, tool buttons and technology chips. |
| Brand asset | Homepage references missing `assets/logo.svg`. `assets/logo-white.svg` and `assets/favicon.ico` are the same 1.19 MB SVG payload. |

## Impeccable detector findings

Baseline: **62 primary anti-patterns + 13 advisory notes**.

Highest-frequency issues:

- 19 low-contrast findings.
- 15 thick side-tab/card-stripe patterns.
- 12 gradient-text patterns.
- 4 undersized functional text instances.
- 4 kicker-above-heading patterns.
- 3 broken/empty images.
- 3 overused-font findings.
- 2 icon-tile-stack feature-card patterns.
- Purple/violet AI-palette and dark-glow findings.
- Bounce easing and em-dash overuse advisories.

Manual findings that matter commercially:

1. The hero spends its strongest visual area on four rainbow free-tool buttons. It does not show WEBKMT's actual job: connecting first enquiry to operations.
2. Glassmorphism, particles, gradient washes and identical offer cards make the company look like a generic SaaS template rather than an accountable systems installer.
3. Offer copy and prices conflict with Knowledge Pack v0.8 throughout HTML, both locale files, template data, portfolio data and chatbot context.
4. The portfolio architecture is built around client testimonials, ratings and metrics, while the approved proof policy is confidential clients + live products/demos/tools only.
5. Technology chips use 10px letters and hard-coded brand colours; they are neither legible nor a useful buying signal.

## Locked visual direction: Operational Cartography

Style archetype: **refined B2B editorial minimalism**.

The memorable device is a restrained route map derived from the WEBKMT mark: connected nodes and diagonal spans show the customer's path through a business. The hero's job is to make the operating system visible, not to display decorative cards or statistics.

Concept wireframe:

```text
[ WEBKMT mark ]                         Systems  Templates  Demos  Contact

Ready-to-run systems                    First enquiry
for growing Middle East businesses           │
                                             ● Instant reply
Websites, WhatsApp AI, commerce,            │
ERP and automation.                          ● Qualified lead
                                             │
[ Request discovery ] [ View systems ]       ● Order / job record
                                             │
                                             ● Operations + follow-up
```

### Palette

| Token | Hex | Use |
| --- | --- | --- |
| `--wk-ink-950` | `#071B33` | Hero/footer fields, headings on light surfaces |
| `--wk-ink-800` | `#102A43` | Primary text |
| `--wk-blue-700` | `#0F6FA8` | Primary action/link colour (AA on white and surface-soft) |
| `--wk-cyan-500` | `#20C4D8` | Logo/route accent only; never body text on white |
| `--wk-teal-600` | `#0E9488` | Secondary route/status accent |
| `--wk-paper` | `#F7FAFC` | Light page field |
| `--wk-surface` | `#FFFFFF` | Cards and forms |
| `--wk-muted` | `#526B7D` | Secondary text on light surfaces |
| `--wk-line` | `#D8E6EF` | Hairlines and component borders |
| `--wk-whatsapp` | `#157A3C` | WhatsApp action only (AA vs white) |

Purple and amber are retired from the public brand layer. Gradients may appear only inside the supplied logo mark, template artwork, or a very subtle navy hero field. Text is always solid.

### Typography

- Latin: **Manrope**, 400–800. It is geometric and commercial without defaulting to Inter.
- Arabic: **IBM Plex Sans Arabic**, 400–700. It pairs with Manrope's technical tone better than a traditional Naskh display face for this product.
- Arabic rule: when `lang="ar"` or `dir="rtl"`, the Arabic family becomes primary for headings and body.
- Type scale: display clamp(2.65rem, 6vw, 4.7rem); H2 clamp(2rem, 4vw, 3rem); H3 1.25rem; body 1rem/1.65; small functional text minimum 0.8125rem.
- Default alignment is start-aligned. Centred type is reserved for the final contact call.

### Layout and component rules

- 12-column desktop container capped at 1240px; section rhythm 7rem desktop / 4.5rem mobile.
- Borders carry structure: 1px `--wk-line`; major panels use `--wk-radius-panel: 20px`; controls use 12px; pills are status-only.
- Shadow hierarchy is intentionally shallow:
  - resting: `0 1px 2px rgb(7 27 51 / .05)`
  - raised: `0 16px 40px rgb(7 27 51 / .10)`
  - floating/modal: `0 24px 64px rgb(7 27 51 / .18)`
- Offer information is presented as an editorial product ledger with status, outcome, exact entry price and inclusions. Do not chop every fact into identical floating cards.
- Icons sit inline with headings or in the route map. No 64px icon tile stacked above every heading.
- Hero motion: one route-line/node sequence. No particles, bounce easing, parallax or reveal-every-section choreography. `prefers-reduced-motion` renders the final state.
- All interactive targets are at least 44px high where practical; focus is a 3px cyan/blue outline with offset.

### Content rules locked with the design

- Use current public names: WEBKMT Websites, WEBKMT Chat, WEBKMT Store, WEBKMT ERP, WEBKMT Automate. WEBKMT Marketing is roadmap only.
- Use only approved prices from Knowledge Pack v0.8. Automate, Store add-ons/management and Marketing are official-quote items.
- WEBKMT Chat is a pilot deployment. It answers from approved knowledge; it is not “trained” or fine-tuned. Appointment requests are captured for human confirmation.
- Do not publish client identities, testimonials, ratings, counts or outcome metrics. Proof surfaces are products, template demos, free tools and the business profile.
- Do not claim native ZATCA compliance. Saudi payment/tax/e-invoicing scope is validated per merchant during implementation.
- Public contacts are `info@webkmt.com`, WhatsApp `+90 501 361 7795`, LinkedIn company page, X `@webkemet`, Instagram `@webkmt`.

## Implementation map

- `css/design-system.css` is the single late-loaded public design layer. It defines `--wk-*` primitives and maps legacy variables/components to them while older bundles are retired incrementally.
- `index.html`, `templates.html`, `case-study.html`, both locale files, template data/gallery, portfolio data and chatbot context are aligned to v0.8.
- Template cards use one shared 3-plan model instead of conflicting per-template setup/care prices.
- The business profile PDF is exposed from `assets/` and linked as a proof/contact asset.

## QA record — 2026-11-04 (live-detector + browser pass)

Verified in a real Chromium (Puppeteer) against a local server, EN + AR (RTL), desktop 1440px and mobile 390px:

- **Scenarios (8/8 pass):** home desktop/mobile, templates desktop/mobile, ERP overview, Chat overview (mobile), home Arabic, templates Arabic (mobile). No horizontal overflow, no broken images, no stale v0.8-conflicting strings, exactly one chatbot widget, modal opens with zero stars/testimonials and a populated scope list, template filter narrows 7 → 1 correctly.
- **Impeccable live mode** (`impeccable@4.8.0 detect <url>`, computed styles — authoritative over static file mode):

  | Page | Warnings before → after | Advisories before → after |
  | --- | --- | --- |
  | `/` | 21 → 2 | 18 → 0 |
  | `/templates.html` | 15 → 5 | 20 → 0 |
  | `/case-study.html?id=1` | 6 → 0 | 6 → 0 |

- **Contrast corrections measured, not eyeballed:** primary `--wk-blue-700` `#147FB8` → `#0F6FA8` (4.4:1 → 5.4:1 on white; 4.0:1 → 5.0:1 on surface-soft) and `--wk-whatsapp` `#178A44` → `#157A3C` (white text 4.4:1 → 5.4:1). Live low-contrast findings went to zero on all three pages. Dark-on-dark defects fixed the same pass: footer wordmark and templates CTA-band copy now use the dark-surface ramp; form placeholders use `--wk-muted` at full opacity.
- **Static file mode caveat:** `detect` on the HTML/CSS files still reports findings from the legacy bundles that load *under* `css/design-system.css` (it does not resolve the final cascade). Those counts fall as legacy bundles are retired; they are not what visitors render.
- **Accepted warnings (deliberate, do not “fix” blindly):**
  - `icon-tile-stack` on offer cards — the 42px glyph is part of the product-ledger header row with status + price; headings/prices dominate.
  - `border-accent-on-rounded` on `.loading-spinner` — a functional spinner, not a card accent.
  - `ai-color-palette` on template-card previews — gradients are sampled from the owner-supplied WEBKMT mark and appear only as product artwork; all UI chrome is flat token colour.
- **Mini-apps:** all six tools serve 200 with no page errors and no stale commercial claims. The legacy violet/indigo/pink palette was token-mapped to `--wk-blue-700` / `--wk-ink-950` / `--wk-teal-600` values and the two unbranded titles now carry WEBKMT. Tool-internal layouts otherwise unchanged.
- **Inline-style sweep:** `templates.html` and `case-study.html` contain zero inline styles. `index.html` retains 40, all functional: `display:none` state toggles flipped by scripts (auth, form steps) and padding on hidden admin/dashboard tables. The overhaul introduced none.
- **Left for a later increment:** retire legacy CSS bundles beneath the design layer; hide the chat toggle pill while the widget is open; revisit mini-app internal layouts if tools are ever restyled end-to-end.
