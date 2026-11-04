# WEBKMT documents — Business Profile & Systems Catalog 2026

Two documents, two jobs (split in November 2026 after the first merged
profile/catalog read as an information dump):

| Document | Job | Audience |
|---|---|---|
| `output/WEBKMT_Business_Profile_2026.pdf` (11 pp) | Tell readers **what to think about WEBKMT**: the problem, positioning, product route, delivery model, business model, market focus, proof posture, direction, company facts | Prospective clients, partners, valuators, investors |
| `output/WEBKMT_Catalog_2026.pdf` (12 pp) | **Sell**: how buying works, decision guide, per-system offers with published prices, plan/care comparison tables, fair use, FAQ, CTA with QR codes | Clients and leads |

Website-served copies live in `assets/` at the repo root
(`assets/WEBKMT_Business_Profile_2026.pdf`, `assets/WEBKMT_Catalog_2026.pdf`) —
the profile path is unchanged from the previous edition so existing site
links keep working.

## Source files

- `generate_documents.py` — the current generator (both PDFs). Manrope +
  IBM Plex Sans Arabic, Operational Cartography palette (same identity as
  webkmt.com / `DESIGN.md`), route-node motif, QR codes, `Page X of Y`.
- `business_profile_data.json` — structured company/contact data (URLs for
  the QR codes come from here).
- `generate_business_profile.py` — **deprecated** generator for the old
  merged 15-page profile. Kept for reference; do not use for new editions.
- `assets/` — supplied logo files; `assets/fonts/` — Manrope (4 weights) and
  IBM Plex Sans Arabic (2 weights) with their licences;
  `assets/webkmt-mark-on-ink.png` / `webkmt-mark-on-white.png` — logo
  composited onto flat backgrounds (ReportLab would not embed the source
  PNG's alpha as an SMask, so compositing guarantees clean rendering).
- `requirements.txt` — Python packages needed to regenerate.

## Content guardrails

Copy follows `docs/DEMO_KNOWLEDGE_PACK_WEBKMT.md` v0.8: only approved
published prices; honest maturity labels (Chat = pilot deployments,
Marketing = in development); no client names, logos, testimonials or
metrics; ZATCA framed as merchant-owned and validated per business, never
blanket-claimed; human-quote-only items (Store add-ons/renewal, Automate,
taxes/fees) shown as "official quote". Keep future editions inside the
same rules — update the Knowledge Pack first, then the PDFs.

## Regenerate

From the repository root:

```bash
pip install -r docs/business-profile/requirements.txt
python3 docs/business-profile/generate_documents.py
cp docs/business-profile/output/WEBKMT_Business_Profile_2026.pdf assets/
cp docs/business-profile/output/WEBKMT_Catalog_2026.pdf assets/
```

Without `arabic-reshaper`/`python-bidi` the build still succeeds; the
Arabic cover accents are simply skipped.

QA habit that caught real defects in this edition: render every page to
PNG (e.g. PyMuPDF `page.get_pixmap(dpi=100)`) and inspect before shipping —
nested fixed-width tables overflow two-column cells, which is why
`bullets()`/`checklist()` in the generator build at wrap time.
