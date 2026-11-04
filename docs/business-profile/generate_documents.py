#!/usr/bin/env python3
"""Generate the WEBKMT Business Profile 2026 and Systems Catalog 2026.

Two documents, two jobs:
- Business Profile: tells clients, partners, valuators and investors what to
  think about WEBKMT (problem, positioning, model, market, proof, direction).
- Systems Catalog: sells to clients/leads (offers, exact prices, plan and
  care tables, fair use, FAQ, call to action).

Design: Operational Cartography (same identity as webkmt.com / DESIGN.md) —
ink navy, accessible blue, cyan/teal route accents, Manrope for Latin and
IBM Plex Sans Arabic for Arabic accents. Content guardrails come from
docs/DEMO_KNOWLEDGE_PACK_WEBKMT.md v0.8: only approved prices, honest
status labels, no client names/testimonials/metrics, no native-ZATCA claim.

Dependencies: reportlab (see requirements.txt). Arabic shaping uses
arabic-reshaper + python-bidi when installed; without them Arabic accents
are silently skipped and the documents remain complete.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Sequence

from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfgen import canvas as pdf_canvas

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "business_profile_data.json"
OUTPUT_DIR = ROOT / "output"
ASSETS = ROOT / "assets"
FONTS = ASSETS / "fonts"
ICON_DARK = ASSETS / "webkmt-mark-on-ink.png"    # composited for the cover
ICON_LIGHT = ASSETS / "webkmt-mark-on-white.png"  # composited for page headers

PAGE_W, PAGE_H = A4
MARGIN = 17 * mm
CONTENT_W = PAGE_W - 2 * MARGIN  # ~501pt

# --- Operational Cartography tokens (mirror css/design-system.css) ---
INK = HexColor("#071B33")
INK2 = HexColor("#0B2A4A")
INK3 = HexColor("#102A43")
PRIMARY = HexColor("#0F6FA8")
CYAN = HexColor("#20C4D8")
TEAL = HexColor("#0E9488")
PAPER = HexColor("#F7FAFC")
SOFT = HexColor("#EEF6FA")
SOFT2 = HexColor("#E2EEF5")
MUTED = HexColor("#526B7D")
LINE = HexColor("#D8E6EF")
LINE_STRONG = HexColor("#B9D2E2")
GREEN = HexColor("#157A3C")
WHITE = colors.white
FAINT_ON_DARK = HexColor("#AECADB")
SOFT_ON_DARK = HexColor("#D5E9F4")

F_REG = "Manrope"
F_MED = "Manrope-Medium"
F_SEMI = "Manrope-SemiBold"
F_BOLD = "Manrope-Bold"
F_AR = "PlexArabic"
F_AR_SEMI = "PlexArabic-Semi"
HAS_ARABIC = False


def register_fonts() -> None:
    """Manrope + IBM Plex Sans Arabic from repo assets; Helvetica fallback."""
    global HAS_ARABIC, F_REG, F_MED, F_SEMI, F_BOLD
    needed = {
        F_REG: FONTS / "Manrope-Regular.ttf",
        F_MED: FONTS / "Manrope-Medium.ttf",
        F_SEMI: FONTS / "Manrope-SemiBold.ttf",
        F_BOLD: FONTS / "Manrope-Bold.ttf",
    }
    if all(p.exists() for p in needed.values()):
        for name, path in needed.items():
            pdfmetrics.registerFont(TTFont(name, str(path)))
        pdfmetrics.registerFontFamily(F_REG, normal=F_REG, bold=F_BOLD, italic=F_REG, boldItalic=F_BOLD)
        for fam in (F_MED, F_SEMI, F_BOLD):
            pdfmetrics.registerFontFamily(fam, normal=fam, bold=F_BOLD, italic=fam, boldItalic=F_BOLD)
    else:  # pragma: no cover - offline fallback
        F_REG = F_MED = F_SEMI = "Helvetica"
        F_BOLD = "Helvetica-Bold"
    ar_reg, ar_semi = FONTS / "IBMPlexSansArabic-Regular.ttf", FONTS / "IBMPlexSansArabic-SemiBold.ttf"
    if ar_reg.exists() and ar_semi.exists():
        try:
            import arabic_reshaper  # noqa: F401
            from bidi.algorithm import get_display  # noqa: F401

            pdfmetrics.registerFont(TTFont(F_AR, str(ar_reg)))
            pdfmetrics.registerFont(TTFont(F_AR_SEMI, str(ar_semi)))
            HAS_ARABIC = True
        except Exception:
            HAS_ARABIC = False


def ar(text: str) -> str:
    """Shape Arabic for ReportLab (visual order). No-op text fallback ''."""
    if not HAS_ARABIC:
        return ""
    import arabic_reshaper
    from bidi.algorithm import get_display

    return get_display(arabic_reshaper.reshape(text))


# --------------------------------------------------------------------------
# Styles
# --------------------------------------------------------------------------

def styles() -> dict[str, ParagraphStyle]:
    s: dict[str, ParagraphStyle] = {}

    def add(name, **kw):
        s[name] = ParagraphStyle(name, **kw)

    add("h1", fontName=F_BOLD, fontSize=25, leading=30, textColor=INK, spaceAfter=6)
    add("h2", fontName=F_BOLD, fontSize=15.5, leading=20, textColor=INK, spaceBefore=10, spaceAfter=5)
    add("h3", fontName=F_BOLD, fontSize=11.5, leading=15, textColor=INK3, spaceBefore=8, spaceAfter=3)
    add("lead", fontName=F_REG, fontSize=11.5, leading=18, textColor=MUTED, spaceAfter=8)
    add("body", fontName=F_REG, fontSize=9.8, leading=15.5, textColor=HexColor("#243A4F"), spaceAfter=6)
    add("body_med", fontName=F_MED, fontSize=9.8, leading=15.5, textColor=HexColor("#243A4F"), spaceAfter=6)
    add("small", fontName=F_REG, fontSize=8.6, leading=13, textColor=MUTED, spaceAfter=4)
    add("tiny", fontName=F_REG, fontSize=7.8, leading=11.5, textColor=MUTED)
    add("kicker", fontName=F_BOLD, fontSize=8.2, leading=11, textColor=PRIMARY, spaceAfter=4)
    add("kicker_cyan", fontName=F_BOLD, fontSize=8.2, leading=11, textColor=TEAL, spaceAfter=4)
    add("cell", fontName=F_REG, fontSize=8.8, leading=13, textColor=HexColor("#243A4F"))
    add("cell_b", fontName=F_SEMI, fontSize=8.8, leading=13, textColor=INK)
    add("cell_h", fontName=F_BOLD, fontSize=8.4, leading=12, textColor=WHITE)
    add("cell_small", fontName=F_REG, fontSize=8.2, leading=12, textColor=MUTED)
    add("cell_c", fontName=F_REG, fontSize=8.8, leading=13, textColor=HexColor("#243A4F"), alignment=TA_CENTER)
    add("price", fontName=F_BOLD, fontSize=17, leading=21, textColor=INK)
    add("price_dark", fontName=F_BOLD, fontSize=17, leading=21, textColor=WHITE)
    add("thesis", fontName=F_BOLD, fontSize=12.5, leading=17, textColor=INK, spaceAfter=2)
    add("thesis_sup", fontName=F_REG, fontSize=9.6, leading=15, textColor=MUTED)
    add("dark_h", fontName=F_BOLD, fontSize=14, leading=18, textColor=WHITE, spaceAfter=4)
    add("dark_b", fontName=F_REG, fontSize=9.6, leading=15, textColor=SOFT_ON_DARK)
    add("ar", fontName=F_AR_SEMI, fontSize=13, leading=20, textColor=CYAN, alignment=TA_RIGHT)
    add("qa_q", fontName=F_BOLD, fontSize=10.2, leading=14, textColor=INK, spaceBefore=7, spaceAfter=2)
    add("qa_a", fontName=F_REG, fontSize=9.5, leading=15, textColor=HexColor("#243A4F"), spaceAfter=5)
    return s


S = styles()


def _esc(text: str) -> str:
    """Escape & for paragraph markup; smarten quotes/apostrophes in copy.

    Attribute quotes in our markup are single and never sit between two
    letters, so the apostrophe rule cannot corrupt tags.
    """
    import re

    text = text.replace("&", "&amp;")
    text = re.sub(r"(?<=[A-Za-z])'(?=[A-Za-z])", "\u2019", text)
    text = re.sub(r"(?<=[A-Za-z])'(?=[\s.,;:!?\u2014-])", "\u2019", text)
    out, opening = [], True
    for ch in text:
        if ch == '"':
            out.append("\u201c" if opening else "\u201d")
            opening = not opening
        else:
            out.append(ch)
    return "".join(out)


def P(text: str, style: str = "body") -> Paragraph:
    return Paragraph(_esc(text), S[style])


# --------------------------------------------------------------------------
# Drawn components (route motif, checks, route diagram, QR)
# --------------------------------------------------------------------------

class Check(Flowable):
    """Vector check mark (Manrope has no ✓ glyph)."""

    def __init__(self, size: float = 9, color: HexColor = TEAL):
        super().__init__()
        self.size = size
        self.color = color

    def wrap(self, availWidth, availHeight):
        return self.size, self.size

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(self.color)
        c.setLineWidth(1.7)
        c.setLineCap(1)
        c.setLineJoin(1)
        s = self.size
        p = c.beginPath()
        p.moveTo(0.08 * s, 0.52 * s)
        p.lineTo(0.38 * s, 0.16 * s)
        p.lineTo(0.94 * s, 0.86 * s)
        c.drawPath(p, stroke=1, fill=0)
        c.restoreState()


class RouteMotif(Flowable):
    """Hairline with route nodes — the Operational Cartography signature."""

    def __init__(self, width: float = CONTENT_W, height: float = 16, dark: bool = False):
        super().__init__()
        self.width, self.height, self.dark = width, height, dark

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        y = self.height / 2
        c.saveState()
        c.setStrokeColor(HexColor("#2A4A68") if self.dark else LINE)
        c.setLineWidth(1)
        c.line(0, y, self.width, y)
        c.setStrokeColor(CYAN)
        c.setLineWidth(2.4)
        c.line(0, y, 64, y)
        for x, col in [(0, CYAN), (64, PRIMARY if not self.dark else CYAN)]:
            c.setFillColor(INK if self.dark else WHITE)
            c.setStrokeColor(col)
            c.setLineWidth(1.6)
            c.circle(x + 4, y, 4, stroke=1, fill=1)
            c.setFillColor(col)
            c.circle(x + 4, y, 1.7, stroke=0, fill=1)
        c.setFillColor(TEAL)
        c.setStrokeColor(TEAL)
        c.circle(self.width - 4, y, 3.2, stroke=1, fill=1)
        c.restoreState()


class RouteDiagram(Flowable):
    """Horizontal 5-node route: label over node, caption under."""

    def __init__(self, steps: Sequence[tuple[str, str]], width: float = CONTENT_W, height: float = 86):
        super().__init__()
        self.steps, self.width, self.height = steps, width, height

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        n = len(self.steps)
        y = self.height - 34
        xs = [26 + i * (self.width - 52) / (n - 1) for i in range(n)]
        c.saveState()
        # connecting spine
        grad_steps = 60
        for i in range(grad_steps):
            t = i / grad_steps
            c.setStrokeColor(HexColor("#20C4D8") if t < 0.5 else TEAL)
            c.setLineWidth(2)
            x0 = xs[0] + t * (xs[-1] - xs[0])
            x1 = xs[0] + (i + 1) / grad_steps * (xs[-1] - xs[0])
            c.line(x0, y, x1, y)
        for i, (x, (label, caption)) in enumerate(zip(xs, self.steps)):
            c.setFillColor(WHITE)
            c.setStrokeColor(PRIMARY if i % 2 == 0 else TEAL)
            c.setLineWidth(2)
            c.circle(x, y, 11, stroke=1, fill=1)
            c.setFillColor(INK)
            c.setFont(F_BOLD, 10)
            c.drawCentredString(x, y - 3.4, str(i + 1))
            c.setFont(F_BOLD, 8.6)
            c.setFillColor(INK)
            # label may be two lines via |
            lines = label.split("|")
            for j, ln in enumerate(lines):
                c.drawCentredString(x, y + 20 - j * 10, ln)
            c.setFont(F_REG, 7.6)
            c.setFillColor(MUTED)
            for j, ln in enumerate(caption.split("|")):
                c.drawCentredString(x, y - 24 - j * 9.5, ln)
        c.restoreState()


def qr(value: str, size: float = 92) -> Drawing:
    widget = QrCodeWidget(value)
    x0, y0, x1, y1 = widget.getBounds()
    w, h = max(1.0, x1 - x0), max(1.0, y1 - y0)
    d = Drawing(size, size, transform=[size / w, 0, 0, size / h, -x0 * size / w, -y0 * size / h])
    d.add(widget)
    return d


# --------------------------------------------------------------------------
# Layout helpers
# --------------------------------------------------------------------------

def section(number: str, kicker: str, title: str, lead: str = "") -> list[Flowable]:
    chip = Table(
        [[P(f"<font color='#FFFFFF'>{number}</font>", "cell_h")]],
        colWidths=[30],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PRIMARY),
            ("ROUNDEDCORNERS", [5, 5, 5, 5]),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]),
    )
    head = Table(
        [[chip, [P(kicker.upper(), "kicker"), P(title, "h1")]]],
        colWidths=[36, CONTENT_W - 36],
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    )
    out: list[Flowable] = [head, Spacer(1, 2)]
    if lead:
        out.append(P(lead, "lead"))
    out += [RouteMotif(), Spacer(1, 8)]
    return out


class _ListFlowable(Flowable):
    """Builds its inner table at wrap() time so nested lists always fit
    the column they land in (fixed-width tables overflow two_col cells)."""

    def __init__(self, builder):
        super().__init__()
        self._builder = builder
        self._t: Table | None = None

    def wrap(self, availWidth, availHeight):
        self._t = self._builder(availWidth)
        return self._t.wrap(availWidth, availHeight)

    def draw(self):
        if self._t is not None:
            self._t.drawOn(self.canv, 0, 0)


def bullets(items: Sequence[str], style: str = "body", gap: float = 3) -> Flowable:
    def build(aw: float) -> Table:
        rows = [[P("<font color='#0E9488'>•</font>", style), P(t, style)] for t in items]
        return Table(rows, colWidths=[14, aw - 14], style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), gap / 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), gap / 2),
        ]))

    return _ListFlowable(build)


def checklist(items: Sequence[str], style: str = "body") -> Flowable:
    def build(aw: float) -> Table:
        rows = [[Check(), P(t, style)] for t in items]
        return Table(rows, colWidths=[18, aw - 18], style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 2.6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2.6),
        ]))

    return _ListFlowable(build)


def data_table(headers: Sequence[str], rows: Sequence[Sequence[str]], widths: Sequence[float],
               header_bg: HexColor = INK, align_center_cols: Sequence[int] = ()) -> Table:
    data = [[P(h, "cell_h") for h in headers]]
    for r in rows:
        data.append([P(c, "cell_c" if i in align_center_cols else "cell")
                     for i, c in enumerate(r)])
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.6, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, SOFT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for col in align_center_cols:
        style.append(("ALIGN", (col, 0), (col, -1), "CENTER"))
    return Table(data, colWidths=list(widths), repeatRows=1, style=TableStyle(style))


def fact_chips(facts: Sequence[tuple[str, str]]) -> Table:
    """Row of big-number/short-label facts (only verifiable facts)."""
    cells = []
    for big, small in facts:
        cells.append([P(f"<font color='#0F6FA8'><b>{big}</b></font>", "price"),
                      P(small, "small")])
    w = CONTENT_W / len(cells)
    return Table([cells], colWidths=[w] * len(cells), style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))


def band(title: str, body: str, dark: bool = False) -> Table:
    content = [P(title, "dark_h" if dark else "h3"), P(body, "dark_b" if dark else "body")]
    return Table([[content]], colWidths=[CONTENT_W], style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK if dark else SOFT),
        ("ROUNDEDCORNERS", [10, 10, 10, 10]),
        ("BOX", (0, 0), (-1, -1), 0.7, INK2 if dark else LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (-1, -1), 13),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
    ]))


def two_col(left: list[Flowable], right: list[Flowable], lw: float = 0.5) -> Table:
    return Table([[left, right]], colWidths=[CONTENT_W * lw - 8, CONTENT_W * (1 - lw) - 8],
                 spaceBefore=2, spaceAfter=2, hAlign="LEFT", style=TableStyle([
                     ("VALIGN", (0, 0), (-1, -1), "TOP"),
                     ("LEFTPADDING", (0, 0), (0, 0), 0),
                     ("RIGHTPADDING", (0, 0), (0, 0), 8),
                     ("LEFTPADDING", (1, 0), (1, 0), 8),
                     ("RIGHTPADDING", (1, 0), (1, 0), 0),
                     ("TOPPADDING", (0, 0), (-1, -1), 0),
                     ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                 ]))


def thesis_list(items: Sequence[tuple[str, str]]) -> Table:
    rows = []
    for i, (head, sup) in enumerate(items, 1):
        num = P(f"<font color='#20C4D8'><b>{i:02d}</b></font>", "price")
        rows.append([num, [P(head, "thesis"), P(sup, "thesis_sup")]])
    return Table(rows, colWidths=[52, CONTENT_W - 52], style=TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.7, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))


# --------------------------------------------------------------------------
# Page drawing (cover + inner furniture) with Page X of Y
# --------------------------------------------------------------------------

class NumberedCanvas(pdf_canvas.Canvas):
    """Two-pass canvas so footers can show total page count."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved: list[dict] = []

    def showPage(self):
        self._saved.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved)
        for state in self._saved:
            self.__dict__.update(state)
            if self._pageNumber > 1:
                self.setFont(F_REG, 7.6)
                self.setFillColor(MUTED)
                self.drawRightString(PAGE_W - MARGIN, 12.5 * mm,
                                     f"Page {self._pageNumber} of {total}")
            super().showPage()
        super().save()


class WkDoc(SimpleDocTemplate):
    doc_title = ""
    cover = {}


def draw_cover(canvas, doc: WkDoc) -> None:
    cfg = doc.cover
    canvas.saveState()
    # background: flat ink with a deeper diagonal panel
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(INK2)
    p = canvas.beginPath()
    p.moveTo(PAGE_W * 0.42, PAGE_H)
    p.lineTo(PAGE_W, PAGE_H)
    p.lineTo(PAGE_W, PAGE_H * 0.30)
    p.lineTo(PAGE_W * 0.66, PAGE_H * 0.62)
    p.close()
    canvas.setFillAlpha(0.55)
    canvas.drawPath(p, stroke=0, fill=1)
    canvas.setFillAlpha(1)

    # route constellation (nodes + polyline) across upper right
    nodes = [(0.52, 0.86), (0.63, 0.78), (0.72, 0.83), (0.82, 0.72), (0.90, 0.78), (0.95, 0.66)]
    canvas.setLineWidth(1.6)
    for (x0, y0), (x1, y1) in zip(nodes, nodes[1:]):
        canvas.setStrokeColor(CYAN)
        canvas.setStrokeAlpha(0.75)
        canvas.line(x0 * PAGE_W, y0 * PAGE_H, x1 * PAGE_W, y1 * PAGE_H)
    canvas.setStrokeAlpha(1)
    for i, (x, y) in enumerate(nodes):
        cx, cy = x * PAGE_W, y * PAGE_H
        canvas.setFillColor(INK)
        canvas.setStrokeColor(CYAN if i % 2 == 0 else TEAL)
        canvas.setLineWidth(1.8)
        canvas.circle(cx, cy, 6.5, stroke=1, fill=1)
        canvas.setFillColor(CYAN if i % 2 == 0 else TEAL)
        canvas.circle(cx, cy, 2.4, stroke=0, fill=1)

    # mark
    if ICON_DARK.exists():
        canvas.drawImage(str(ICON_DARK), MARGIN, PAGE_H - 58 * mm, width=34 * mm, height=31 * mm,
                         preserveAspectRatio=True)

    y = PAGE_H - 78 * mm
    canvas.setFillColor(WHITE)
    canvas.setFont(F_BOLD, 44)
    canvas.drawString(MARGIN, y, "WEBKMT")
    y -= 13 * mm
    canvas.setFillColor(CYAN)
    canvas.setFont(F_BOLD, 10.5)
    canvas.drawString(MARGIN, y, cfg["kicker"].upper())
    y -= 16 * mm
    canvas.setFillColor(WHITE)
    canvas.setFont(F_BOLD, 27)
    for line in cfg["title_lines"]:
        canvas.drawString(MARGIN, y, line)
        y -= 11.5 * mm
    y -= 2 * mm
    canvas.setFillColor(SOFT_ON_DARK)
    canvas.setFont(F_REG, 12.5)
    for line in cfg["sub_lines"]:
        canvas.drawString(MARGIN, y, line)
        y -= 7 * mm

    arabic_line = ar(cfg.get("arabic", ""))
    if arabic_line:
        canvas.setFillColor(CYAN)
        canvas.setFont(F_AR_SEMI, 14.5)
        canvas.drawString(MARGIN, y - 4 * mm, arabic_line)

    # bottom fact strip
    strip_y = 34 * mm
    canvas.setStrokeColor(HexColor("#24466B"))
    canvas.setLineWidth(0.8)
    canvas.line(MARGIN, strip_y + 14 * mm, PAGE_W - MARGIN, strip_y + 14 * mm)
    facts = cfg["facts"]
    fw = CONTENT_W / len(facts)
    for i, (big, small) in enumerate(facts):
        x = MARGIN + i * fw
        canvas.setFillColor(CYAN)
        canvas.setFont(F_BOLD, 11)
        canvas.drawString(x, strip_y + 6 * mm, big)
        canvas.setFillColor(FAINT_ON_DARK)
        canvas.setFont(F_REG, 7.8)
        canvas.drawString(x, strip_y, small)

    canvas.setFillColor(FAINT_ON_DARK)
    canvas.setFont(F_REG, 8.5)
    canvas.drawString(MARGIN, 16 * mm, cfg["footer_left"])
    canvas.drawRightString(PAGE_W - MARGIN, 16 * mm, cfg["footer_right"])
    canvas.restoreState()


def draw_inner(canvas, doc: WkDoc) -> None:
    if doc.page == 1:
        draw_cover(canvas, doc)
        return
    canvas.saveState()
    # header
    if ICON_LIGHT.exists():
        canvas.drawImage(str(ICON_LIGHT), MARGIN, PAGE_H - 15.5 * mm, width=11 * mm, height=10 * mm,
                         preserveAspectRatio=True)
    canvas.setFillColor(INK)
    canvas.setFont(F_BOLD, 9)
    canvas.drawString(MARGIN + 13 * mm, PAGE_H - 12.8 * mm, "WEBKMT")
    canvas.setFillColor(MUTED)
    canvas.setFont(F_REG, 8)
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 12.8 * mm, doc.doc_title.upper())
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.8)
    canvas.line(MARGIN, PAGE_H - 17.5 * mm, PAGE_W - MARGIN, PAGE_H - 17.5 * mm)
    canvas.setStrokeColor(CYAN)
    canvas.setLineWidth(2.2)
    canvas.line(MARGIN, PAGE_H - 17.5 * mm, MARGIN + 42, PAGE_H - 17.5 * mm)
    # footer
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.8)
    canvas.line(MARGIN, 16 * mm, PAGE_W - MARGIN, 16 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(F_REG, 7.6)
    canvas.drawString(MARGIN, 12.5 * mm, "WEBKMT · info@webkmt.com · WhatsApp +90 501 361 7795 · webkmt.com")
    canvas.restoreState()


class CoverSpacer(Flowable):
    def wrap(self, availWidth, availHeight):
        return 1, availHeight - 6

    def draw(self):
        pass


# --------------------------------------------------------------------------
# Shared content atoms
# --------------------------------------------------------------------------

def qr_block(site_url: str, wa_url: str) -> Table:
    left = [qr(site_url, 84), Spacer(1, 4), P("<b>webkmt.com</b>", "small"),
            P("Systems, templates & free tools", "tiny")]
    right = [qr(wa_url, 84), Spacer(1, 4), P("<b>WhatsApp us</b>", "small"),
             P("+90 501 361 7795 — replies 24/7", "tiny")]
    t = Table([[left, right]], colWidths=[CONTENT_W / 2 - 8, CONTENT_W / 2 - 8],
              style=TableStyle([
                  ("VALIGN", (0, 0), (-1, -1), "TOP"),
                  ("LEFTPADDING", (0, 0), (-1, -1), 10),
                  ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                  ("TOPPADDING", (0, 0), (-1, -1), 4),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
              ]))
    return t


# --------------------------------------------------------------------------
# DOCUMENT 1 — Company profile (persuasion)
# --------------------------------------------------------------------------

def profile_story(data: dict) -> list[Flowable]:
    F: list[Flowable] = [CoverSpacer(), PageBreak()]

    # -- 01 What to think about WEBKMT --
    F += section("01", "The short version", "What to think about WEBKMT",
                 "If you read one page, read this one. WEBKMT is an early-stage, owner-led "
                 "systems company built on a simple conviction: a small business should be "
                 "able to buy a working system the way it buys equipment — see the price, "
                 "know what is included, own what it paid for.")
    F.append(thesis_list([
        ("We sell working systems, not hours.",
         "Websites, customer response, e-commerce, ERP and automation — delivered as "
         "configured, ready-to-run products with published entry prices, not open-ended "
         "agency retainers."),
        ("Your business keeps the asset.",
         "Every system is built on proven open-source cores, white-labelled and configured "
         "per client. Templates are owned 100% after payment; ERP data lives on the client's "
         "own server. No per-user licence rent, no lock-in by design."),
        ("Arabic-first, Gulf-aware, honest about compliance.",
         "Based in Türkiye, focused on Saudi Arabia and the wider Middle East, working in "
         "Arabic (Saudi/Gulf-friendly) and English. Matters like Saudi e-invoicing are "
         "validated per merchant — never blanket-claimed in a brochure."),
        ("AI with a human hand on the wheel.",
         "Our customer-response AI answers only from information the business has approved, "
         "captures enquiries with consent, and hands over to a person. Speed where it is "
         "safe, judgement where it matters."),
        ("Small on purpose — for now.",
         "You deal directly with the owner-led team that scopes and ships your system. "
         "Repeatable golden builds, not headcount, are how we scale."),
    ]))
    F.append(Spacer(1, 10))
    F.append(fact_chips([
        ("5", "sellable systems, one connected route"),
        ("2", "working languages: Arabic + English"),
        ("24/7", "online operation, instant first response"),
        ("USD 150", "lowest published entry price"),
        ("100%", "template ownership after full payment"),
    ]))
    F.append(PageBreak())

    # -- 02 The problem --
    F += section("02", "The problem", "Small businesses leak money in the gaps between tools",
                 "Most SMBs we meet do not have a technology problem. They have a "
                 "<b>continuity</b> problem: attention arrives in one place, enquiries wait "
                 "in another, and the record of what happened lives nowhere.")
    pains = [
        ("<b>The unanswered enquiry.</b> A prospect messages on WhatsApp at 21:40. Nobody "
         "replies until morning — if at all. The sale quietly goes to whoever answered first."),
        ("<b>The spreadsheet business.</b> Invoices in one file, stock in another, customer "
         "history in someone's phone. Every report is archaeology; every absence is a crisis."),
        ("<b>The per-seat rent.</b> Mainstream SaaS charges per user, per month, forever — "
         "in dollars, in English, on someone else's roadmap. The business rents its own "
         "operations and owns nothing."),
        ("<b>The opaque quote.</b> \"Request a quote\" for everything, prices discovered "
         "after three meetings. Owners delay decisions because they cannot compare."),
        ("<b>The language gap.</b> Tools built for other markets treat Arabic and RTL as "
         "an afterthought — in the very markets where customers expect Arabic first."),
    ]
    F.append(bullets(pains))
    F.append(Spacer(1, 8))
    F.append(band("Our reading of the market",
                  "Middle East SMBs do not need more software accounts. They need the "
                  "<b>route</b> connected: be found, respond instantly, sell, keep the record, "
                  "automate the repetition — installed as one coherent system, at a price "
                  "published before the first call. That is the gap WEBKMT was built to close."))
    F.append(Spacer(1, 10))
    F.append(P("Every leak above has a station that closes it", "h3"))
    F.append(data_table(
        ["The leak", "The station that closes it"],
        [
            ["Unanswered enquiries, day and night", "<b>WEBKMT Chat</b> — instant approved answers and lead capture, 24/7"],
            ["No presence that converts attention into enquiries", "<b>WEBKMT Websites</b> — a site built around the enquiry, from USD 150"],
            ["Selling by chat thread and spreadsheet", "<b>WEBKMT Store</b> — catalogue, checkout and orders in one system"],
            ["Records scattered across files and phones", "<b>WEBKMT ERP</b> — one operating record for the whole business"],
            ["Repetitive follow-ups done by hand (or not at all)", "<b>WEBKMT Automate</b> — reminders, follow-ups and reports that run themselves"],
        ],
        [196, 305],
    ))
    F.append(PageBreak())

    # -- 03 What WEBKMT is --
    F += section("03", "What WEBKMT is", "One connected route, five systems",
                 "Think of a business as a route a customer travels. WEBKMT installs the "
                 "stations on that route — each one useful alone, compounding together.")
    F.append(RouteDiagram([
        ("GET FOUND", "WEBKMT|Websites"),
        ("RESPOND|INSTANTLY", "WEBKMT|Chat"),
        ("SELL ONLINE", "WEBKMT|Store"),
        ("RUN THE|BUSINESS", "WEBKMT|ERP"),
        ("AUTOMATE &|GROW", "WEBKMT|Automate"),
    ]))
    F.append(Spacer(1, 6))
    F.append(two_col(
        [P("Installers, not rent-collectors", "h3"),
         P("We configure mature open-source platforms — the same class of foundations "
           "large companies run (ERPNext for operations, Bagisto for commerce, a headless "
           "CMS line for websites, Google Gemini models behind our own gateways for AI) — "
           "into systems branded and tuned for one business at a time. The client buys a "
           "configured asset and optional care, not a seat at our table forever.", "body")],
        [P("Productised, not bespoke-by-default", "h3"),
         P("Each system starts from a maintained <b>golden build</b>: pre-configured, "
           "documented and cloneable. That is how a small team delivers predictably — "
           "and how published entry prices are possible at all. Custom work is scoped "
           "honestly on top, never smuggled into a package.", "body")],
    ))
    F.append(Spacer(1, 4))
    F.append(P("Proven foundations, productised by WEBKMT", "h3"))
    F.append(data_table(
        ["Foundation", "Its role in a WEBKMT system"],
        [
            ["<b>ERPNext</b> (open source)", "Operations core inside WEBKMT ERP — accounting, inventory, sales, HR"],
            ["<b>Bagisto</b> (open source)", "Commerce core inside WEBKMT Store — catalogue, checkout, orders"],
            ["<b>Headless CMS</b> (open source)", "Client-managed content behind WEBKMT Websites and template installs"],
            ["<b>Google Gemini</b> models", "Classification and answer generation for WEBKMT Chat, behind WEBKMT validation gateways"],
            ["<b>Meta WhatsApp Cloud API</b>", "The official WhatsApp channel for client deployments — never unofficial gateways"],
        ],
        [150, 351],
    ))
    F.append(Spacer(1, 8))
    F.append(band("What we are not",
                  "Not a generalist agency selling hours. Not a SaaS reseller marking up "
                  "someone else's seats. Not a \"growth partner\" with unverifiable case-study "
                  "wallpaper. Our proof is inspectable instead: this website, the template "
                  "gallery, the free tools and guided product walkthroughs."))
    F.append(PageBreak())

    # -- 04 Portfolio & maturity --
    F += section("04", "Portfolio", "The systems, and how ready each one is",
                 "We label maturity plainly. A pilot is called a pilot; work in development "
                 "is not sold as finished. Full specifications and prices are in the "
                 "companion <b>Systems Catalog 2026</b>.")
    F.append(data_table(
        ["System", "Role on the route", "Status", "Published entry"],
        [
            ["<b>WEBKMT Websites</b>", "Business websites from ready designs, three clear plans", "Available now", "USD 150"],
            ["<b>WEBKMT Chat</b>", "WhatsApp + website AI receptionist: instant approved answers, lead capture, handoff", "Pilot deployments", "USD 300 + 29/mo"],
            ["<b>WEBKMT Store</b>", "Complete e-commerce system, Arabic/English storefront", "Scoped implementation", "USD 899"],
            ["<b>WEBKMT ERP</b>", "Finance, inventory, sales, people and operations in one record", "Scoped implementation", "USD 1,400 + care"],
            ["<b>WEBKMT Automate</b>", "Workflow automation between the tools a business already uses", "Scoped projects", "Official quote"],
            ["<b>WEBKMT Marketing</b>", "Campaigns, content and customer-growth system", "In development", "Partner enquiries"],
        ],
        [118, 205, 92, 86],
    ))
    F.append(Spacer(1, 8))
    F.append(P("Why this order matters", "h3"))
    F.append(P("The portfolio follows the customer's journey and the client's cash flow. A "
               "business can start where it hurts most — usually presence or response — for "
               "a few hundred dollars, prove value, then connect the next station. Every "
               "station makes the others more valuable: the store feeds the same record the "
               "ERP keeps; the receptionist answers from the same approved information the "
               "website publishes.", "body"))
    F.append(P("A note on the pilot label", "h3"))
    F.append(P("WEBKMT Chat is being hardened the way serious software should be: first on "
               "our own business as tenant zero, behind gateways that validate every "
               "generated answer against approved prices and facts before anything is sent. "
               "Pilot clients join that standard knowingly, with human fallback from day one.", "body"))
    F.append(PageBreak())

    # -- 05 Delivery model --
    F += section("05", "How we work", "Golden builds in, running systems out",
                 "Delivery is engineered to be repeatable: the same five moves, whichever "
                 "station on the route we are installing.")
    F.append(RouteDiagram([
        ("DISCOVER", "30-min call|bottleneck first"),
        ("SCOPE &|QUOTE", "written scope|fixed inclusions"),
        ("CONFIGURE", "from a golden|build, not zero"),
        ("REVIEW &|TRAIN", "real cases with|your people"),
        ("LAUNCH &|CARE", "monitored, backed|up, supported"),
    ]))
    F.append(Spacer(1, 6))
    F.append(two_col(
        [P("Typical timelines (confirmed in the quote)", "h3"),
         bullets([
             "Template files: <b>within 2 days</b> of payment",
             "Customized website files: typically 3–7 working days",
             "Ultimate website: typically 1–3 weeks",
             "WEBKMT Chat setup: typically 3–7 working days after materials",
             "Store initial setup: typically 1–3 weeks after inputs",
             "ERP implementation: typically 2–6 weeks by scope",
         ], style="cell")],
        [P("What we ask from the client", "h3"),
         bullets([
             "Logo and brand files",
             "Content, product and service information",
             "Domain / hosting or account access where applicable",
             "Business registrations for payments and invoicing",
             "One decision-maker we can reach",
         ], style="cell"),
         P("The clock pauses while we wait for inputs, payments or registrations — "
           "and we say so in the quote, up front.", "small")],
    ))
    F.append(Spacer(1, 6))
    F.append(band("Care is a product, not an afterthought",
                  "Systems drift: content changes, platforms update, questions multiply. Our "
                  "care programs bundle managed hosting and SSL, scheduled updates with "
                  "post-update checks, daily backups with restore help, monitoring, "
                  "break-fix support for what we delivered, and a monthly allowance of small "
                  "changes — tiered by workload, never by user count."))
    F.append(PageBreak())

    # -- 06 Business model --
    F += section("06", "Business model", "Published prices in front, care subscriptions behind",
                 "For partners and valuators: how WEBKMT intends to make money, stated "
                 "without ornament.")
    F.append(data_table(
        ["Revenue line", "How it works", "Client sees"],
        [
            ["<b>Setup & packages</b>", "Fixed published entry prices (USD 150 – 1,400); scoped work quoted in writing; hard ceiling — no package above USD 10,000", "The price before the first call"],
            ["<b>Care subscriptions</b>", "Monthly care for Chat operations and ERP (USD 29; USD 59/119/229 by workload) and annual website maintenance inside Ultimate", "One predictable line item"],
            ["<b>Expansion</b>", "Each installed station creates the context for the next: website → response → store/ERP → automation", "Start where it hurts, grow when ready"],
            ["<b>Custom & scoped work</b>", "Fixes, hosting help, web apps and AI/automation projects, owner-scoped after discovery", "A written quote, or a clear no"],
        ],
        [110, 245, 146],
    ))
    F.append(Spacer(1, 8))
    F.append(two_col(
        [P("Why the economics can work", "h3"),
         bullets([
             "<b>Open-source cores</b> mean our cost base is engineering and care — not licence resale margins shared with a platform vendor.",
             "<b>Golden builds</b> convert one client's delivery work into every future client's starting point.",
             "<b>Published prices</b> shorten sales cycles: the conversation starts at fit and scope, not at \"what will this cost?\".",
             "<b>Free tools</b> (analyzer, calculators, link builder) earn attention and qualify demand at near-zero marginal cost.",
         ], style="cell")],
        [P("What we will not do for revenue", "h3"),
         bullets([
             "Invent metrics, logos or testimonials to look bigger than we are.",
             "Sell a system as finished while it is in pilot or development.",
             "Lock a client in by withholding their data, files or credentials.",
             "Quote a price the written scope cannot support.",
         ], style="cell")],
    ))
    F.append(PageBreak())

    # -- 07 Market --
    F += section("07", "Market focus", "Saudi Arabia and the Gulf first, the Middle East as home ground",
                 "Focus is a feature. We would rather be exactly right for one market than "
                 "approximately relevant everywhere.")
    F.append(two_col(
        [P("Where we stand", "h3"),
         bullets([
             "<b>Base:</b> Türkiye — operating online, 24/7.",
             "<b>Core market:</b> Saudi Arabia and the Gulf; serving the wider Middle East.",
             "<b>Languages:</b> Arabic (Saudi/Gulf-friendly) and English across site, systems and AI answers, with RTL-aware interfaces.",
             "<b>Buyer:</b> owners of small and mid-sized companies who feel the enquiry leak and the spreadsheet ceiling personally.",
         ], style="cell")],
        [P("How we handle local rules", "h3"),
         P("Saudi commerce has real requirements — business registration, payment "
           "onboarding, and ZATCA e-invoicing among them. Those belong to the merchant "
           "and are validated <b>per business during implementation</b>. We scope and "
           "integrate accordingly; we do not print \"fully compliant\" on a brochure and "
           "hope. Partners evaluating us should read that as a risk posture, not a gap.", "body")],
    ))
    F.append(Spacer(1, 6))
    F.append(band("The wedge",
                  "Arabic-first delivery + published prices + client ownership is a rare "
                  "combination in this market segment, where the alternatives are global "
                  "per-seat SaaS in English, or opaque local agency quotes. WEBKMT is built "
                  "to be the obvious third option for an SMB owner who wants a system, "
                  "a price, and their name on the asset."))
    F.append(PageBreak())

    # -- 08 Proof & principles --
    F += section("08", "Proof & principles", "Don't take our word for it — inspect the work",
                 "Client identities are confidential and stay that way, for legal reasons. "
                 "So our proof is designed to be examined, not admired.")
    F.append(two_col(
        [P("What you can inspect today", "h3"),
         checklist([
             "<b>webkmt.com</b> itself — bilingual, productised offers, live assistant",
             "The <b>template gallery</b> with the same three plans on every design",
             "<b>Free working tools</b> — Website Analyzer, ROI Calculator, Color Palette, KMT Link",
             "<b>Guided product overviews</b> on request — what each system does, and honestly what it does not yet do",
             "This profile's companion <b>Systems Catalog</b> — every published price in one place",
         ], style="cell")],
        [P("Principles we operate by", "h3"),
         checklist([
             "<b>Official quotes govern.</b> Scope, exclusions and third-party charges in writing before work begins.",
             "<b>Approved information only.</b> AI answers are grounded in what the business approved — and validated before sending.",
             "<b>Humans confirm commitments.</b> Appointments and prices beyond the published list are confirmed by a person.",
             "<b>Ownership is real.</b> Files, data and exports remain the client's; leaving is always possible.",
             "<b>Confidentiality by default.</b> We market our products, never our clients' identities.",
         ], style="cell")],
    ))
    F.append(PageBreak())

    # -- 09 Direction --
    F += section("09", "Direction", "Where WEBKMT is going next",
                 "Sequenced by dependency, not by calendar promises.")
    F.append(thesis_list([
        ("Chat: pilot → general availability.",
         "Complete the receptionist's hardening on our own tenant — answer quality gates, "
         "booking and human handoff — then open standard deployments at the published price."),
        ("Store: golden image → repeatable Saudi-ready installs.",
         "Freeze the commerce golden build and the merchant-validation checklist so each "
         "new store is a configuration exercise, not a research project."),
        ("Marketing: from development to fifth station.",
         "Bring the campaign/content system to the same productised standard, closing the "
         "route from first click to repeat customer."),
        ("Care: the quiet compounding layer.",
         "Grow the subscription base that keeps every installed system updated, backed up "
         "and answered for — the revenue that funds the roadmap."),
        ("Partnerships, carefully.",
         "Referral and delivery partnerships with people who already serve Gulf SMBs are "
         "welcome conversations — where incentives stay aligned with the end client's outcome."),
    ]))
    F.append(Spacer(1, 8))
    F.append(band("What a partner or investor should expect from us",
                  "Small numbers, honestly labelled, growing from productised delivery "
                  "rather than headcount. We publish our prices, label our pilots, keep our "
                  "clients' names out of our marketing — and intend to still be doing exactly "
                  "that when the numbers are bigger.", dark=True))
    F.append(PageBreak())

    # -- 10 Snapshot & contact --
    F += section("10", "Company snapshot", "Facts & how to reach us",
                 "Everything on this page is verifiable today.")
    F.append(data_table(
        ["", ""],
        [
            ["<b>Company</b>", "WEBKMT — ready-to-run business systems (websites, WhatsApp AI, e-commerce, ERP, automation)"],
            ["<b>Base</b>", "Türkiye · operating online 24/7"],
            ["<b>Markets</b>", "Saudi Arabia and the Gulf first; wider Middle East served"],
            ["<b>Languages</b>", "Arabic (Saudi/Gulf-friendly) and English"],
            ["<b>Team model</b>", "Owner-led specialist team; clients deal directly with the people who scope and ship"],
            ["<b>Pricing posture</b>", "Published entry prices; written official quotes; no package above USD 10,000"],
            ["<b>Payments</b>", "IBAN · Western Union · Crypto — details shared by a human after the official quote"],
            ["<b>Email</b>", "info@webkmt.com"],
            ["<b>WhatsApp</b>", "+90 501 361 7795 (general WEBKMT contact)"],
            ["<b>Web</b>", "webkmt.com · LinkedIn /company/webkmt · X @webkemet · Instagram @webkmt"],
        ],
        [112, 389],
    ))
    F.append(Spacer(1, 10))
    F.append(qr_block(data["website"], data["whatsapp_url"]))
    F.append(Spacer(1, 10))
    F.append(band("Start the conversation",
                  "Tell us where the route breaks in your business — enquiries, sales, "
                  "operations or manual work. A 30-minute discovery call (WhatsApp or Google "
                  "Meet) ends with a clear recommendation and, where it fits, a written quote. "
                  "For offers and exact prices, ask for the <b>WEBKMT Systems Catalog 2026</b>."))
    F.append(Spacer(1, 8))
    F.append(P("Document note: Business Profile 2026, November 2026. Product maturity labels "
               "and prices reflect the published position at issue; the signed official quote "
               "governs any engagement. Client identities are withheld for legal reasons.", "tiny"))
    return F


# --------------------------------------------------------------------------
# DOCUMENT 2 — Systems catalog (selling)
# --------------------------------------------------------------------------

def price_cards(cards: Sequence[tuple[str, str, str, str, bool]]) -> Table:
    """cards: (label, price, unit, blurb, featured)"""
    cells = []
    for label, price, unit, blurb, featured in cards:
        ps = "price_dark" if featured else "price"
        ls = ParagraphStyle("x", parent=S["kicker"], textColor=CYAN if featured else PRIMARY)
        bs = ParagraphStyle("y", parent=S["small"], textColor=SOFT_ON_DARK if featured else MUTED)
        cells.append([Paragraph(_esc(label.upper()), ls), P(price, ps),
                      Paragraph(_esc(unit), ParagraphStyle("z", parent=S["cell_b"],
                                  textColor=WHITE if featured else INK)),
                      Paragraph(_esc(blurb), bs)])
    w = CONTENT_W / len(cells)
    style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), WHITE),
    ]
    for i, c in enumerate(cards):
        if c[4]:
            style.append(("BACKGROUND", (i, 0), (i, 0), INK))
    return Table([cells], colWidths=[w] * len(cells), style=TableStyle(style))


def catalog_story(data: dict) -> list[Flowable]:
    F: list[Flowable] = [CoverSpacer(), PageBreak()]

    # -- How buying works --
    F += section("01", "Start here", "How buying from WEBKMT works",
                 "No mystery pricing, no three-meeting warm-up. Here is the whole path.")
    F.append(RouteDiagram([
        ("PICK A|STARTING POINT", "this catalog or|a discovery call"),
        ("CONFIRM|SCOPE", "short call — fit,|inputs, timeline"),
        ("OFFICIAL|QUOTE", "written scope, price|and exclusions"),
        ("PAY &|BUILD", "setups before work;|50/50 on scoped work"),
        ("LAUNCH &|CARE", "training, then care|if you choose it"),
    ]))
    F.append(Spacer(1, 6))
    F.append(two_col(
        [P("Payments, plainly", "h3"),
         bullets([
             "Methods: <b>IBAN, Western Union or crypto</b> — details come from a human with your quote, never from a bot or a PDF.",
             "Template files: 100% before delivery. Scoped services: typically 50% to start, 50% at delivery. Monthly/annual programs in advance.",
             "Taxes and third-party fees, where they apply, are itemised in the official quote.",
         ], style="cell")],
        [P("Our refund posture (summary)", "h3"),
         bullets([
             "Cancel before work starts: <b>full refund</b> of amounts paid.",
             "After work starts: completed milestones are payable; unused prepaid balance refunded within 14 days.",
             "Delivered template files are yours — non-refundable after delivery except non-delivery or unusable files (refund or replacement).",
             "Subscriptions cancel at the end of the paid period. The signed quote governs.",
         ], style="cell")],
    ))
    F.append(Spacer(1, 10))
    F.append(band("Every engagement, whatever the size",
                  "A written scope and official quote before work begins · a named human you "
                  "can reach on WhatsApp or email · a handover so your team can actually run "
                  "the system · your files, data and exports remain yours. That is the "
                  "standard at USD 150 and at USD 1,400 alike."))
    F.append(PageBreak())

    # -- Choose your starting point --
    F += section("02", "Decision guide", "Choose your starting point",
                 "Start where it hurts. Every station works alone and connects later.")
    F.append(data_table(
        ["If this is your problem…", "Start with", "Entry price", "Typical time"],
        [
            ["Customers can't find you, or your site doesn't turn visits into enquiries", "<b>WEBKMT Websites</b>", "USD 150", "2 days – 3 weeks by plan"],
            ["Enquiries wait hours for a reply; leads cool off or vanish", "<b>WEBKMT Chat</b> (pilot)", "USD 300 + 29/mo", "3–7 working days"],
            ["You sell by chat and spreadsheets; you need a real store", "<b>WEBKMT Store</b>", "USD 899", "1–3 weeks"],
            ["Invoices, stock and customer records live in different places", "<b>WEBKMT ERP</b>", "USD 1,400 + care", "2–6 weeks"],
            ["Your team copies data between tools and chases reminders manually", "<b>WEBKMT Automate</b>", "Official quote", "Scoped per workflow"],
            ["You need campaigns and content run as a system", "<b>WEBKMT Marketing</b> — in development", "Partner enquiries", "Early-partner basis"],
        ],
        [212, 118, 82, 89],
    ))
    F.append(Spacer(1, 8))
    F.append(band("Not sure? Start with the free audit",
                  "Run the <b>Website Analyzer</b> at webkmt.com — instant, self-serve. Leave "
                  "your details and a human-reviewed follow-up is targeted within 2 business "
                  "days. Or book a 30-minute discovery call on WhatsApp/Meet and leave with a "
                  "recommendation, whether or not it is us."))
    F.append(PageBreak())

    # -- Websites --
    F += section("03", "WEBKMT Websites — Available now", "Pick a design. Choose how much we do.",
                 "Ready business designs in three plans — <b>the same three plans for every "
                 "design</b>, so you compare designs, not price traps.")
    F.append(price_cards([
        ("Plan 1 — Files only", "USD 150", "one-time · files delivered",
         "The template code files, delivered within 2 days of payment. Yours 100% — modify or resell them.", False),
        ("Plan 2 — Customized files", "USD 300–799", "one-time · scoped on a call",
         "We adapt branding and structure to your business before delivering the files. Two revision rounds included.", False),
        ("Plan 3 — Ultimate", "USD 800–1,599", "one-time · managed first year",
         "Customization, content writing, hosting, annual maintenance and minor edits through the year.", True),
    ]))
    F.append(Spacer(1, 9))
    F.append(data_table(
        ["Included", "Plan 1", "Plan 2", "Plan 3 Ultimate"],
        [
            ["Template code files", "Yes", "Yes", "Yes"],
            ["Branding & structure customized for you", "—", "Yes", "Yes"],
            ["Revision rounds", "—", "2", "Scoped in quote"],
            ["Content writing", "—", "—", "Yes"],
            ["Hosting (first year)", "—", "—", "Yes"],
            ["Maintenance & minor edits (first year)", "—", "—", "Yes"],
            ["You own the template after full payment", "Yes", "Yes", "Yes"],
            ["Typical delivery", "Within 2 days", "3–7 working days", "1–3 weeks"],
        ],
        [196, 92, 102, 111], align_center_cols=(1, 2, 3),
    ))
    F.append(Spacer(1, 7))
    F.append(P("Third-party components inside a template keep their own licences. \"Minor edits\" "
               "means small text/image/content changes (fair use up to 4 requests/month) — new "
               "pages or features are scoped separately. Exact Plan 2/3 price is confirmed in "
               "your official quote by pages, features and content.", "small"))
    F.append(PageBreak())

    # -- Template gallery --
    F += section("04", "The designs", "Template gallery — seven starting points",
                 "Each design is Arabic/English-ready with a WhatsApp enquiry path built in. "
                 "Browse live previews at <b>webkmt.com/templates</b>.")
    designs = [
        ("<b>Clinic Pro</b>", "Dental, medical & aesthetic clinics that live on appointment enquiries — doctor/service pages, appointment-request path, location & contact sections."),
        ("<b>Restaurant & Café</b>", "Menus, photos and a clear route from appetite to reservation request — digital menu sections, photo gallery, hours & WhatsApp."),
        ("<b>Property Plus</b>", "Real-estate offices whose buyers scan fast — listing sections, photo gallery per property, WhatsApp enquiry per listing, agent profiles."),
        ("<b>Salon & Spa</b>", "Salons, barbers & spas replacing phone-tag booking — service & price list, appointment-request path, staff profiles, visual gallery."),
        ("<b>Catalogue Starter</b>", "A product catalogue that sends enquiries to WhatsApp — catalogue sections, featured offers, per-product enquiry. Full checkout lives in WEBKMT Store."),
        ("<b>Services Pro</b>", "Law firms, accountants, consultants & agencies selling expertise — services & team pages, credentials, consultation/quote form."),
        ("<b>Auto Services</b>", "Repair, rental & detailing businesses that need clearer job enquiries — service enquiry form, per-service price list, before/after gallery."),
    ]
    F.append(data_table(["Design", "Built for"], designs, [128, 373]))
    F.append(Spacer(1, 8))
    F.append(band("Can't find your business type?",
                  "Tell us on WhatsApp — we will suggest the closest current design or scope a "
                  "custom direction inside the same plan structure."))
    F.append(PageBreak())

    # -- Chat --
    F += section("05", "WEBKMT Chat — Pilot deployments", "Never miss or delay a customer enquiry",
                 "An Arabic/English AI receptionist on your WhatsApp number and website that "
                 "answers instantly — only from information <b>you</b> approved — and brings a "
                 "human in whenever it should.")
    F.append(RouteDiagram([
        ("ENQUIRY|ARRIVES", "WhatsApp or|your website"),
        ("INSTANT|ACK", "seconds,|24/7"),
        ("APPROVED|ANSWER", "your services,|prices, FAQs"),
        ("QUALIFY &|CAPTURE", "need, timing,|contact + consent"),
        ("HUMAN|FOLLOW-UP", "you confirm &|close the deal"),
    ]))
    F.append(Spacer(1, 4))
    F.append(price_cards([
        ("Setup", "USD 300", "one-time", "Knowledge-base build from your approved materials (up to 20 documents / 100,000 words loaded), WhatsApp + website entry points, testing with real questions.", False),
        ("Monthly", "USD 29", "per month · fair use", "Up to 5,000 inbound messages classified and 3,000 AI answers monthly, 4 knowledge-update batches, monitoring. Pilot terms confirmed in your quote.", True),
    ]))
    F.append(Spacer(1, 8))
    F.append(two_col(
        [P("Included", "h3"),
         checklist([
             "Instant acknowledgement on WhatsApp and your website",
             "Answers grounded in your approved services, prices and FAQs",
             "Lead qualification and consent-based contact capture",
             "Appointment requests captured for human confirmation",
             "Human handoff — no message left stranded with a bot",
         ], style="cell")],
        [P("Fair use, in the open", "h3"),
         bullets([
             "1 business · 1 WhatsApp number + website · 1 knowledge base",
             "Above the cap: acknowledgement, lead capture and escalation continue; AI answers pause until you approve an overage pack (<b>USD 9 / 1,000 extra answers</b>)",
             "Meta template/campaign charges, if any, pass through at cost — never bundled invisibly",
             "Never \"unlimited\" — sized honestly for SMB volume",
         ], style="cell")],
    ))
    F.append(P("Pilot honesty: WEBKMT Chat is in pilot deployment — hardened first on WEBKMT's "
               "own business, with every generated answer validated against approved facts "
               "before sending. Pilot clients get that standard plus human fallback from day one.", "small"))
    F.append(PageBreak())

    # -- Store --
    F += section("06", "WEBKMT Store — Scoped implementation", "Sell online on a system you own",
                 "A complete e-commerce foundation (open-source Bagisto core) configured "
                 "around your catalogue, payments and delivery — not a rented storefront theme.")
    F.append(price_cards([
        ("Store Basic", "USD 899", "setup + 1 year hosting",
         "Initial Store setup on our golden build and hosting for the first year. The starting point — scoped additions are quoted in writing.", True),
        ("Add-ons & management", "Official quote", "itemised per scope",
         "Payment/shipping specifics, extra features, content work, ongoing management and year-2 hosting renewal are scoped and itemised in your official quote.", False),
    ]))
    F.append(Spacer(1, 9))
    F.append(two_col(
        [P("The foundation includes", "h3"),
         checklist([
             "Catalogue, checkout, customer accounts and order management",
             "Arabic/English-ready RTL–LTR storefront",
             "Multi-currency and multi-warehouse capable core",
             "Configured on your domain, with your branding",
             "Handover session so your team can run daily operations",
         ], style="cell")],
        [P("Scoped per merchant (honestly)", "h3"),
         bullets([
             "Payment gateway onboarding (e.g. Saudi options such as PayTabs/HyperPay/Tabby) uses <b>your</b> merchant accounts and approvals.",
             "Saudi requirements — registration, and ZATCA e-invoicing where it applies — are <b>validated with your business inputs</b> during implementation.",
             "A gateway or a platform never by itself makes a merchant compliant; your quote states exactly what is included.",
         ], style="cell")],
    ))
    F.append(PageBreak())

    # -- ERP --
    F += section("07", "WEBKMT ERP — Scoped implementation", "One operating record for the whole business",
                 "WEBKMT configures the proven open-source <b>ERPNext</b> foundation around "
                 "your accounts, warehouses, users, items and workflows — then keeps it "
                 "running under a care tier sized by workload, <b>not by user count</b>.")
    F.append(two_col(
        [P("In the system", "h3"),
         checklist([
             "Accounting & invoicing",
             "Inventory & warehouses",
             "Sales, CRM & purchasing",
             "HR & projects where scoped",
             "Arabic/English interface with RTL support",
             "Your data on your own server",
         ], style="cell")],
        [P("Setup — USD 1,400 flat", "h3"),
         P("One flat implementation fee: installation on managed hosting, company/branch "
           "setup, users and permissions, opening data structure, core workflows configured "
           "to your operation, and team handover. Scope and timeline (typically 2–6 weeks) "
           "are confirmed in the official quote.", "body")],
    ))
    F.append(Spacer(1, 4))
    F.append(P("Care tiers — what \"care\" actually means", "h3"))
    F.append(P("Every tier: managed hosting & SSL, scheduled security/version updates with "
               "post-update checks, <b>daily backups</b> with restore assistance, uptime/"
               "resource monitoring, break-fix support for the configuration we delivered, "
               "and user/permission administration.", "body"))
    F.append(data_table(
        ["", "Essential — USD 59/mo", "Growth — USD 119/mo", "Scale — USD 229/mo"],
        [
            ["Companies / branches", "1 company", "Up to 2", "Multi-company / branch"],
            ["Backup retention", "7 days", "30 days", "90 days"],
            ["Support priority", "Next business day", "Priority, same business day", "Urgent priority"],
            ["Minor changes included", "1 / month", "Up to 4, or 2 support/config hours", "Up to 8, or 5 hours"],
            ["Reporting", "—", "Monthly health summary", "Quarterly review & optimization"],
            ["Resources", "Standard", "Higher", "Higher-volume"],
        ],
        [112, 122, 137, 130],
    ))
    F.append(Spacer(1, 6))
    F.append(P("Not included in care (scoped separately): new modules, custom development or "
               "integrations; data entry, bookkeeping or statutory filing; major migrations; "
               "third-party fees; POS/hardware; large training programs. Your tier is "
               "confirmed in the quote by workload and support needs — it is a support and "
               "resources tier, never a per-user licence.", "small"))
    F.append(PageBreak())

    # -- Automate + Marketing --
    F += section("08", "WEBKMT Automate · WEBKMT Marketing", "Remove the repetitive work, then grow",
                 "Two stations, two honest statuses: Automate is delivered as scoped projects "
                 "today; Marketing is in development and open to early partners.")
    F.append(two_col(
        [P("WEBKMT Automate — scoped projects", "h3"),
         checklist([
             "Instant lead follow-up on WhatsApp when a form lands",
             "Automatic payment reminders so nobody chases by hand",
             "Review requests after a completed job",
             "Weekly sales/operations summaries to your phone",
             "Document intake and structured task routing",
         ], style="cell"),
         P("Entered via a free audit/discovery. Pricing is per scoped workflow in an "
           "official quote — we would rather price the exact steps than sell you a "
           "\"platform\" you half-use.", "body")],
        [P("WEBKMT Marketing — in development", "h3"),
         P("A full marketing-management system (campaigns, journeys, content scheduling) "
           "built on proven open-source cores, held to the same productised standard as "
           "the rest of the route.", "body"),
         P("<b>Early-partner enquiries are open.</b> It is not sold as a finished package "
           "yet — partners shape the first release around real campaigns.", "body")],
    ))
    F.append(Spacer(1, 8))
    F.append(band("Also from WEBKMT",
                  "Beyond the packaged systems we accept scoped work across the same craft: "
                  "building, managing, fixing or hosting websites, web apps and landing "
                  "pages, plus AI enablement and business systemization. Feasibility and a "
                  "fixed quote are always confirmed by a human first."))
    F.append(PageBreak())

    # -- Care & tools --
    F += section("09", "Care & free tools", "Looked after after launch — and useful before you buy",
                 "Two kinds of ongoing value: care programs that keep systems healthy, and "
                 "free tools you can use today with no account gymnastics.")
    F.append(data_table(
        ["Program", "Covers", "Response"],
        [
            ["<b>Websites — Ultimate year</b>", "Hosting, maintenance, minor edits (fair use 4/month)", "Human follow-up within 1 business day"],
            ["<b>WEBKMT Chat monthly</b>", "Operations within fair use, monitoring, 4 KB updates/month", "Instant bot 24/7; humans within 1 business day"],
            ["<b>WEBKMT ERP care</b>", "Hosting/SSL, updates, daily backups, monitoring, break-fix, change allowance by tier", "By tier — up to urgent priority"],
            ["<b>Store Basic</b>", "Year-1 hosting included; management/care quoted separately", "Human follow-up within 1 business day"],
            ["<b>Existing-client outages</b>", "Treated as urgent priority, same-day attention", "As fast as possible — honestly, not a promised minute"],
        ],
        [128, 238, 135],
    ))
    F.append(Spacer(1, 8))
    F.append(P("Free tools at webkmt.com", "h3"))
    F.append(data_table(
        ["Tool", "What it does for you"],
        [
            ["<b>Website Analyzer</b>", "Instant audit of performance, SEO and accessibility — see what your current site is costing you"],
            ["<b>ROI Calculator</b>", "Estimate the return on a marketing or systems spend before you commit"],
            ["<b>Color Palette</b>", "Generate brand-ready palettes and export them for your designer"],
            ["<b>KMT Link</b>", "A clean link-in-bio page for your business under link.webkmt.com"],
            ["<b>Social Scheduler</b>", "Plan and simulate your posting rhythm"],
        ],
        [128, 373],
    ))
    F.append(PageBreak())

    # -- FAQ --
    F += section("10", "Questions", "Straight answers before you ask",
                 "The questions every buyer asks — answered the way we would on a call.")
    faqs = [
        ("Are these prices final?",
         "Entry prices in this catalog are published and real: USD 150 / 300–799 / 800–1,599 "
         "for websites, USD 300 + 29/mo for Chat, USD 899 Store Basic, USD 1,400 ERP setup "
         "plus care. Anything beyond published scope — Store add-ons, Automate workflows, "
         "taxes and third-party fees — is itemised in your official written quote before "
         "any work begins. No package exceeds USD 10,000."),
        ("Do I own what I buy?",
         "Yes. A purchased template is 100% yours after full payment — modify it, resell it. "
         "Your ERP data sits on your server, your store runs on your domain, and exports "
         "remain available. Third-party open-source components keep their own licences, "
         "as anywhere."),
        ("How do I pay?",
         "IBAN, Western Union or crypto. A human shares the details together with your "
         "official quote — never trust payment details that appear anywhere else."),
        ("Is Arabic properly supported?",
         "Arabic (Saudi/Gulf-friendly) and English across websites, Store, ERP and Chat "
         "answers, with RTL-aware interfaces. It is a first-class language here, not a "
         "translation plugin."),
        ("Is WEBKMT Store ZATCA-compliant?",
         "No platform can claim that for you. ZATCA obligations belong to your business; "
         "during implementation we validate your registration, invoice flow and gateway "
         "setup with your inputs and scope exactly what is included. Anyone promising "
         "blanket compliance in a brochure is selling, not informing."),
        ("How fast will I be live?",
         "Template files within 2 days; customized files typically 3–7 working days; "
         "Ultimate 1–3 weeks; Chat 3–7 working days after materials; Store 1–3 weeks after "
         "inputs; ERP 2–6 weeks by scope. Your quote confirms dates; the clock pauses "
         "while we wait for your inputs or registrations."),
        ("What do you need from me to start?",
         "Logo/brand files, your content and product/service information, domain or account "
         "access where relevant, business registrations for payments/invoicing, and one "
         "decision-maker we can reach."),
        ("What if it isn't right for me?",
         "Cancel before work starts for a full refund. After work starts, completed "
         "milestones are payable and any unused prepaid balance comes back within 14 days. "
         "Subscriptions run to the end of the paid period. The signed quote governs — "
         "summarised on page 2 of this catalog."),
    ]
    for q, a in faqs:
        F.append(P(q, "qa_q"))
        F.append(P(a, "qa_a"))
    F.append(PageBreak())

    # -- CTA --
    F += section("11", "Next step", "Tell us where the route breaks",
                 "Enquiries, sales, operations or manual work — bring the bottleneck. "
                 "A 30-minute discovery call (WhatsApp or Google Meet) ends with a clear "
                 "recommendation and, where it fits, a written official quote.")
    F.append(qr_block(data["website"], data["whatsapp_url"]))
    F.append(Spacer(1, 10))
    F.append(band("Prefer to look first?",
                  "Browse the template gallery and free tools at <b>webkmt.com</b>, run the "
                  "free Website Analyzer on your current site, and talk to the assistant on "
                  "our homepage — it answers from the same approved information in this "
                  "catalog. When you are ready, WhatsApp <b>+90 501 361 7795</b> or email "
                  "<b>info@webkmt.com</b>."))
    F.append(Spacer(1, 8))
    F.append(data_table(
        ["Checklist for your first message", ""],
        [
            ["Your business type and city", "So we point you at the right design/system"],
            ["The problem in one sentence", "\"Enquiries wait overnight\" beats a feature list"],
            ["What you already use", "Current site, tools, spreadsheets — anything"],
            ["Your rough budget band", "Under 300 · 300–899 · 900–1,799 · 1,800–4,999 · 5,000–10,000"],
            ["When you want to be live", "We confirm a realistic date in the quote"],
        ],
        [196, 305],
    ))
    F.append(Spacer(1, 8))
    F.append(P("Catalog note: Systems Catalog 2026, November 2026. Prices are published entry "
               "prices in USD; the signed official quote governs scope, timeline, inclusions "
               "and any taxes/fees. WEBKMT Chat is offered as pilot deployments; WEBKMT "
               "Marketing is in development. Client identities are withheld for legal reasons.", "tiny"))
    return F


# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------

def build(path: Path, title: str, cover: dict, story: list[Flowable]) -> None:
    doc = WkDoc(str(path), pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
                topMargin=24 * mm, bottomMargin=20 * mm,
                title=title, author="WEBKMT")
    doc.doc_title = title
    doc.cover = cover
    doc.build(story, onFirstPage=draw_inner, onLaterPages=draw_inner,
              canvasmaker=NumberedCanvas)
    print(f"wrote {path} ({path.stat().st_size:,} bytes)")


def main() -> None:
    register_fonts()
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(exist_ok=True)

    profile_cover = {
        "kicker": "Business Profile · 2026",
        "title_lines": ["Systems a small", "business can", "actually own."],
        "sub_lines": ["Ready-to-run websites, WhatsApp AI, e-commerce,",
                      "ERP and automation for Middle East SMBs."],
        "arabic": "أنظمة جاهزة للتشغيل تنمو مع نشاطك",
        "facts": [("5 systems", "one connected route"), ("AR + EN", "Arabic-first delivery"),
                  ("24/7", "online operation"), ("USD 150", "published entry price")],
        "footer_left": "Based in Türkiye · Serving Saudi Arabia, the Gulf & the Middle East",
        "footer_right": "webkmt.com",
    }
    catalog_cover = {
        "kicker": "Systems Catalog · 2026",
        "title_lines": ["Pick a system.", "See the price.", "Start this week."],
        "sub_lines": ["Websites, WhatsApp AI, online store, ERP and",
                      "automation — plans, prices and honest fine print."],
        "arabic": "كتالوج الأنظمة — أسعار معلنة بوضوح",
        "facts": [("USD 150", "website files from"), ("USD 29/mo", "AI receptionist"),
                  ("USD 899", "store basic + hosting"), ("USD 1,400", "ERP flat setup")],
        "footer_left": "All prices USD · Official written quote before work begins",
        "footer_right": "webkmt.com/templates",
    }

    build(OUTPUT_DIR / "WEBKMT_Business_Profile_2026.pdf",
          "WEBKMT Business Profile 2026", profile_cover, profile_story(data))
    build(OUTPUT_DIR / "WEBKMT_Catalog_2026.pdf",
          "WEBKMT Systems Catalog 2026", catalog_cover, catalog_story(data))


if __name__ == "__main__":
    main()
