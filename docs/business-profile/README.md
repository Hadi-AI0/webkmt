# WEBKMT Business Profile

This folder contains the source and output for the WEBKMT Business Profile 2026.

## Deliverable

- `output/WEBKMT_Business_Profile_2026.pdf` — 15-page A4 business profile for sending to prospects and partners.

## Source files

- `business_profile_data.json` — structured company/contact/product/pricing data used by the generator.
- `generate_business_profile.py` — custom `business_profile` PDF generator built by extending the installed `business-document-generator` skill's JSON → Python → PDF workflow.
- `assets/webkmt-logo-icon.png` — supplied high-resolution gradient mark on black.
- `assets/webkmt-logo-icon-transparent.png` — cropped transparent derivative created for page layouts.
- `assets/webkmt-logo-lockup.jpg` — supplied blue square WEBKMT lockup.
- `requirements.txt` — Python packages needed to regenerate the PDF.

## Why the skill was extended

The upstream `business-document-generator` skill supports proposal, business-plan and budget cover-page overlays, but it does not include a business-profile template or generate profile body pages. The generator in this folder therefore keeps the skill's JSON + ReportLab/PyPDF approach and adds a Purpose-built WEBKMT design with original copy, product pages, pricing tables and QR codes.

## Regenerate

From the repository root:

```bash
pip install -r docs/business-profile/requirements.txt
python3 docs/business-profile/generate_business_profile.py
```

The PDF is written to:

```text
docs/business-profile/output/WEBKMT_Business_Profile_2026.pdf
```

## Content guardrails

Copy and prices are based on `docs/DEMO_KNOWLEDGE_PACK_WEBKMT.md` v0.8. The profile intentionally:

- labels WEBKMT Chat as pilot deployments;
- labels WEBKMT Marketing as in development;
- treats Store add-ons/management and Automate/Marketing prices as official-quote items;
- does not publish client names, logos, testimonials, counts or outcome metrics;
- does not claim native ZATCA compliance — Saudi e-invoicing is scoped and validated per merchant.
