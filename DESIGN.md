# WEBKMT website design direction

Status: **Loud and flat (street poster)** — locked 2026-11-04 via the tasteskill run
(`Leonxlnx/taste-skill`, skill `design-taste-frontend`). Supersedes Operational
Cartography (2026-11-03), which the owner rejected as not the look he wanted.
Content source of truth: `docs/DEMO_KNOWLEDGE_PACK_WEBKMT.md` (v0.9).

## 1. The idea

WEBKMT's un-copyable asset is that it prints its prices and talks plainly.
So the public site is built like the notice other agencies will not pin in
their window: **the published price list becomes a street poster** — blunt
statements and prices at poster scale, flat colour fields, and photographs of
the businesses it serves stuck on. A "request a quote" competitor cannot run
this page; that is the test the idea passed.

The page opens and closes on the name: `WEBKMT` set full-bleed in the hero
("name across the middle") and again, at the same scale, at the foot of the
footer — a bracket the scroll closes.

## 2. Direction and redraws (tasteskill record)

- Drawn: `draw.mjs --sector agency --tone warm --sections features,showcase,how-it-works,about,proof,list,cta,footer`
  → three candidates; chose **`loud-flat-poster`** (seed 201687926).
- Redraw 1 `--redraw palette`: the dealt post-red/mustard-on-bone fought the
  existing blue/cyan brand mark; the second draw (acid mint/orange with
  black-and-white photos) fought the warm/human brief. Resolution per the
  skill's own rule ("keep the dealt proportions, take colours from the
  subject"): dealt *proportions* (one ground, one ink, one action colour, flat
  full-strength fields, one colour per panel) with the *subject's* colours —
  ink navy, brand blue/cyan fields, WhatsApp green as the single action
  colour, low-chroma bone paper. Photographs stay full-colour and warm.
- Redraw 2 `--redraw section:about=about-photo-tile-facts`: the dealt about
  blueprint needs people portraits; WEBKMT has none and inventing people
  would be fake proof. The redrawn blueprint (wide photo + colour tile +
  facts) carries real facts: base, hours, languages, published prices.
- Role swap: the dealt `list` blueprint (giant word + filled bar rows) cannot
  hold blog articles but holds the **price list** exactly, so `#prices` uses
  it and the blog keeps its existing frame, restyled.
- Adaptation: Anton and Work Sans have no Arabic (the asset does not exist),
  so Arabic display type is **Cairo 800/900** and Arabic text is **IBM Plex
  Sans Arabic** — two faces per script, declared in `css/poster.css`.

## 3. Palette (css/poster.css tokens, mirrored in css/design-system.css)

| Token | Hex | Use |
| --- | --- | --- |
| `--p-bg` | `#f4f3f1` | Page ground (low-chroma bone, not yellow cream) |
| `--p-surface` | `#e9e7e2` | Filled tiles, cards, bars |
| `--p-ink` | `#0a1e33` | All running text on light grounds |
| `--p-muted` | `#54636f` | Secondary notes only, never running text |
| `--p-accent` | `#127a3e` | The single action colour (Book, BOOK band, chat) |
| `--p-field-ink` | `#071b33` | Hero/footer/steps-of-ink fields |
| `--p-field-blue` | `#0f6fa8` | Mosaic head + process staircase field |
| `--p-field-cyan` | `#22c3d6` | Figure tile, map tile, one detail line |
| `--p-field-paper` | `#f4f3f1` | Output slips |

Rules: square corners everywhere (radius 0); no gradients; no shadow at rest
(only the real overlays: dropdown, modals); no hairlines or outlined boxes
except genuine form fields and the `data-ui` chat fragment; no glass
(backdrop-filter neutralised site-wide under `body.wk26`); no index numbers,
eyebrows or icon-card rows. Dark theme keeps the same fields, inverted ground.

## 4. Typography

Self-hosted OFL faces (built to woff2 statics from the google/fonts repo,
2026-11-04; licences in `assets/fonts/`), declared in `css/poster.css`:

- Latin display: **Anton** (hero/footer wordmark, section titles, poster words).
- Latin text: **Work Sans** 400/600.
- Arabic display: **Cairo** 800/900; Arabic text: **IBM Plex Sans Arabic** 400/600.
- **Manrope** 400/700 kept for legacy modal chrome only.
- Five public steps: small 13–14 / body 17–19 / lead 20–26 / head
  clamp(2.5rem, 1.2rem+5vw, 5.5rem) / wordmark ~26.5vw. Kept app chrome
  (auth, booking, admin, mini-app modals) retains its own functional scale.
- Headlines ≤ 2 lines at 1440/768/390; statements ≤ 36px desktop / 24px phone;
  body never below 16px; `text-wrap: balance/pretty`; tabular numerals on prices.

## 5. Layout

- One page margin everywhere: `--margin: clamp(16px, 3.2vw, 28px)`; section
  gap `clamp(88px, 8vw, 120px)`.
- Section order is the argument: name → pick your first system (mosaic of
  unlike tiles) → what you actually get (output slips over a full-bleed
  photo) → how we work (lines that step across) → yours to keep (photo +
  facts) → try it yourself (names-as-one-sentence + live analyzer) → PRICES
  (giant word + filled bars) → inspect the products (kept gallery) → latest
  insights (kept list) → contact (kept form) → BOOK (one word is the button)
  → footer (phone number as the headline, name bracket).
- Kept JS surfaces (portfolio masonry, blog grid, contact/newsletter forms,
  auth + mini-apps modals, chat widget) keep their behaviour; poster.css
  restyles them flat and folds them into the same frame.
- Motion (gated on `prefers-reduced-motion: no-preference` via
  `html.wk26-anim`): settle-in reveals, a slow drift on the showcase photo,
  the wordmark scaling toward its footer size across the first screen, and
  one tool name lit at a time in the proof sentence. The reduced-motion page
  is the finished page: every hidden start state lives inside the media
  query, and dialogs are display-gated, not visibility-gated.

## 6. Content rules (unchanged from v0.9 knowledge pack, plus one new rule)

- Public names: WEBKMT Websites / Chat / Store / ERP / Automate; Marketing is
  roadmap only. Prices only as published (150 / 300–799 / 800–1,599 / 300+29 /
  899 / 1,400 + care 59/119/229); Automate, Store add-ons and taxes are
  official-quote items.
- No client identities, testimonials, ratings, counts or outcome metrics.
  Proof = products, demos, free tools, business profile.
- No ZATCA/compliance claims; merchant-owned validation during implementation.
- Contacts: info@webkmt.com, WhatsApp +90 501 361 7795 (WEBKMT general
  contact), LinkedIn company page, X @webkemet, Instagram @webkmt.
- **New (owner instruction 2026-11-04): the base stack is never named in
  public content.** No ERPNext, Bagisto, Payload, Dify, Gemini, Supabase,
  framework or open-source-project names in pages, locales, portfolio data,
  chatbot knowledge or PDFs. Products are WEBKMT systems; configuration
  detail belongs in the official written quote. The knowledge pack records
  this as boundary rule 19 (v0.9).

## 7. Implementation map

- `css/poster.css` — the poster layer (tokens, @font-face, composition,
  legacy neutralizers under `body.wk26`). Loaded last on all three pages.
- `css/design-system.css` — shared `--wk-*` primitives retokened to the
  poster palette for kept components and subpages.
- `js/poster.js` — reveal observer, name scaling, proof-name cycling; all
  gated behind `html.wk26-anim`.
- `index.html` — rebuilt public sections; kept ids/anchors (`#services`,
  `#portfolio`, `#process`, `#tools`, `#mini-apps`, `#insights`, `#contact`,
  `#newsletter`), kept form/auth/modal hooks, `data-i18n` on all new copy.
- `locales/{en,ar}.json` — `poster.*` keys for every new string, both scripts.
- `mini-apps/website-analyzer.html` — accepts `?url=` from the proof form and
  runs the same check the visitor asked for (the page's live thing).
- Legacy bundles (`main-bundle`, `components-bundle`, …) still load beneath
  the poster layer; retiring them remains a later increment.

## 8. QA record — 2026-11-04 (tasteskill lint + inspect, Chromium 153)

- Static lint on the five touched front-end files: **0 findings** (the wider
  repo lint still reports the legacy bundles that load beneath the layer).
- `inspect.mjs` at 1440/768/390, before (Operational Cartography):
  **14 FAIL / 5 WARN**. After: **0 FAIL / 4 WARN**.
- Defended WARNs (deliberate, listed per skill): `card-rows` (the kept
  JS-driven gallery and blog list are grids by function, restyled flat);
  `size-count` (kept app chrome keeps its functional scale; the public
  reading surface runs five steps); `no-footage` (no honest clip exists for
  this subject and none could be sourced from the sandbox; the showcase
  photo carries a slow drift as the moving picture); `ragged-edges` (the
  staircase indents and tile insets are the dealt blueprints' geometry, not
  placement drift).
- RTL verified in Chromium with `localStorage.language=ar`: `dir=rtl`,
  mirrored composition, Arabic display in Cairo, wordmark stays Latin Anton
  (legacy `[dir=rtl] h1..h3` element rules are overridden explicitly).
- Critique round 1 (references/critique.md): design 8 · usability 8 ·
  creativity 8 · content 8 → **overall 8.0**, no caps applied. Top problems
  found and fixed in-round: hero wordmark falling back to the Arabic stack
  in RTL; the insights grid spinning forever without a CMS (now an honest
  empty state); masonry cards leaving white pockets (cards now fill cells).
- Owner round 3 (six modifications): navy is now a TEXT colour only (hero,
  slips, steps, footer retokened to bone/surface/paper; green and cyan carry
  the colour fields); #services rebuilt as five prominent product cards with
  published price chips and booking links plus a start-here card; a three-door
  journey (hero CTA row, journey strip, BOOK / SIGN UP / MESSAGE conversion
  band, auth modal opened in sign-up mode); five regenerated Gulf-SMB
  photographs with explicit aspect-ratio + object-fit containment; contact
  voids and overlap closed; staircase and card grids made responsive at
  1440/768/390. Meter 0 FAIL / 6 defended WARN; critique round 3 scored
  8.5/8.5/8/8 -> 8.4. Full log in `.taste-skill/notes.md`.
- Critique round 2 (re-run in environment, full log in
  `.taste-skill/notes.md`): meter still 0 FAIL / 4 WARN; three visible
  problems fixed (masonry track override restored to the bundle auto-fit
  with narrow cards stretched; tablet hero rhythm and in-flow photo strip;
  desktop hero base rest) plus one composition hole (gallery first paint
  left three empty tracks beside the last card; `js/poster.js` now stretches
  the final card's row via inline `grid-column: start / -1`). Scores:
  design 8.5 · usability 8 · creativity 8 · content 8 → **overall 8.2**.
  Loop stopped at round 2 of the skill's 3-round cap: no further
  stranger-visible problem in the sheets.
- Screenshots: `.taste-skill/before/home/` (previous look) and
  `.taste-skill/after/home/` incl. `rtl-*.jpg` (working files, not committed).
