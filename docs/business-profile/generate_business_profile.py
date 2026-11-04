#!/usr/bin/env python3
"""Generate the WEBKMT business profile PDF.

This extends the installed `business-document-generator` skill's
JSON -> Python -> PDF workflow. The bundled skill only overlays cover-page
fields on proposal/business-plan/budget templates, so this script adds a
Purpose-built `business_profile` document type with WEBKMT branding,
original body copy, product pages, pricing tables, and contact QR codes.

Dependencies: reportlab, pypdf (verification only), pillow (asset prep only).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, Sequence

from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib import colors
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader, simpleSplit
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

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "business_profile_data.json"
OUTPUT_DIR = ROOT / "output"
OUTPUT_PATH = OUTPUT_DIR / "WEBKMT_Business_Profile_2026.pdf"
ASSETS = ROOT / "assets"
ICON = ASSETS / "webkmt-logo-icon-transparent.png"
LOCKUP = ASSETS / "webkmt-logo-lockup.jpg"

PAGE_W, PAGE_H = A4

# Brand palette sampled from the supplied WEBKMT marks.
BLACK = HexColor("#02070D")
NAVY = HexColor("#071B33")
NAVY_2 = HexColor("#0B2A4A")
INK = HexColor("#17324A")
MUTED = HexColor("#617B90")
BLUE = HexColor("#1AB2F3")
BLUE_DARK = HexColor("#147FB8")
CYAN = HexColor("#20C4D8")
TEAL = HexColor("#10B7A8")
ROYAL = HexColor("#2E75CD")
PALE = HexColor("#EEF7FC")
PALE_2 = HexColor("#E3F2FA")
LINE = HexColor("#D8E8F3")
WHITE = colors.white

FONT = "DejaVuSans"
FONT_BOLD = "DejaVuSans-Bold"


def register_fonts() -> None:
    """Register DejaVu when available; otherwise fall back to PDF core fonts."""
    global FONT, FONT_BOLD
    candidates = [
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        ("C:/Windows/Fonts/DejaVuSans.ttf", "C:/Windows/Fonts/DejaVuSans-Bold.ttf"),
    ]
    for regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont(FONT, regular))
            pdfmetrics.registerFont(TTFont(FONT_BOLD, bold))
            pdfmetrics.registerFontFamily(
                FONT, normal=FONT, bold=FONT_BOLD, italic=FONT, boldItalic=FONT_BOLD
            )
            return
    FONT = "Helvetica"
    FONT_BOLD = "Helvetica-Bold"


def lerp(a: int, b: int, t: float) -> float:
    return (a + (b - a) * t) / 255.0


def gradient_color(top: tuple[int, int, int], bottom: tuple[int, int, int], t: float) -> Color:
    return Color(lerp(top[0], bottom[0], t), lerp(top[1], bottom[1], t), lerp(top[2], bottom[2], t))


class CoverSpacer(Flowable):
    """Occupies the first flow frame while the cover is drawn in onPage."""

    def __init__(self, width: float = 1, height: float = 690):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        pass


class DiagonalMotif(Flowable):
    """A restrained brand rule with a small diamond echoing the logo centre."""

    def __init__(self, width: float = 501, height: float = 22):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        c = self.canv
        y = self.height / 2
        c.saveState()
        c.setStrokeColor(LINE)
        c.setLineWidth(1)
        c.line(0, y, self.width, y)
        c.setLineCap(1)
        c.setStrokeColor(BLUE)
        c.setLineWidth(4)
        c.line(0, y, 88, y)
        c.setStrokeColor(TEAL)
        c.line(self.width - 42, y, self.width, y)
        cx = self.width / 2
        c.setFillColor(CYAN)
        path = c.beginPath()
        path.moveTo(cx, y + 5)
        path.lineTo(cx + 5, y)
        path.lineTo(cx, y - 5)
        path.lineTo(cx - 5, y)
        path.close()
        c.drawPath(path, stroke=0, fill=1)
        c.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    ss = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker",
            parent=ss["Normal"],
            fontName=FONT_BOLD,
            fontSize=8,
            leading=10,
            textColor=BLUE_DARK,
            spaceAfter=7,
            alignment=TA_LEFT,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=ss["Heading1"],
            fontName=FONT_BOLD,
            fontSize=25,
            leading=30,
            textColor=NAVY,
            spaceAfter=10,
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=ss["Heading2"],
            fontName=FONT_BOLD,
            fontSize=15,
            leading=19,
            textColor=NAVY_2,
            spaceBefore=11,
            spaceAfter=6,
            keepWithNext=True,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=ss["Heading3"],
            fontName=FONT_BOLD,
            fontSize=10.5,
            leading=14,
            textColor=NAVY_2,
            spaceBefore=8,
            spaceAfter=4,
            keepWithNext=True,
        ),
        "lead": ParagraphStyle(
            "lead",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=11.2,
            leading=17,
            textColor=HexColor("#425E74"),
            spaceAfter=10,
        ),
        "body": ParagraphStyle(
            "body",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=9.2,
            leading=14.2,
            textColor=INK,
            spaceAfter=7,
        ),
        "small": ParagraphStyle(
            "small",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=7.8,
            leading=11.2,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "caption": ParagraphStyle(
            "caption",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=7.2,
            leading=10,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "cardTitle": ParagraphStyle(
            "cardTitle",
            parent=ss["Normal"],
            fontName=FONT_BOLD,
            fontSize=10,
            leading=13,
            textColor=NAVY,
            spaceAfter=4,
        ),
        "cardBody": ParagraphStyle(
            "cardBody",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=8.4,
            leading=12.4,
            textColor=HexColor("#405C72"),
        ),
        "tableHead": ParagraphStyle(
            "tableHead",
            parent=ss["Normal"],
            fontName=FONT_BOLD,
            fontSize=8,
            leading=10.5,
            textColor=WHITE,
        ),
        "tableBody": ParagraphStyle(
            "tableBody",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=8.1,
            leading=11.4,
            textColor=INK,
        ),
        "tableBodyBold": ParagraphStyle(
            "tableBodyBold",
            parent=ss["Normal"],
            fontName=FONT_BOLD,
            fontSize=8.1,
            leading=11.4,
            textColor=NAVY,
        ),
        "price": ParagraphStyle(
            "price",
            parent=ss["Normal"],
            fontName=FONT_BOLD,
            fontSize=14,
            leading=17,
            textColor=BLUE_DARK,
            alignment=TA_CENTER,
            spaceAfter=3,
        ),
        "center": ParagraphStyle(
            "center",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=9.2,
            leading=14,
            textColor=INK,
            alignment=TA_CENTER,
        ),
        "ctaTitle": ParagraphStyle(
            "ctaTitle",
            parent=ss["Normal"],
            fontName=FONT_BOLD,
            fontSize=22,
            leading=27,
            textColor=WHITE,
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "ctaBody": ParagraphStyle(
            "ctaBody",
            parent=ss["Normal"],
            fontName=FONT,
            fontSize=10,
            leading=15,
            textColor=HexColor("#DCEEFF"),
            alignment=TA_CENTER,
        ),
    }


S: dict[str, ParagraphStyle]


def P(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text, S[style])


def section_intro(kicker: str, title: str, lead: str) -> list[Flowable]:
    return [
        P(kicker.upper(), "kicker"),
        P(title, "h1"),
        P(lead, "lead"),
        DiagonalMotif(),
        Spacer(1, 6),
    ]


def bullets(items: Sequence[str], width: float = 501, style: str = "body") -> Table:
    rows = [[P("<font color='#159CCB'>•</font>", "body"), P(item, style)] for item in items]
    table = Table(rows, colWidths=[14, width - 14], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    return table


def cards_grid(
    cards: Sequence[tuple[str, str]],
    cols: int = 2,
    width: float = 501,
    accent: HexColor = BLUE,
) -> Table:
    col_w = width / cols
    cells: list[list[Flowable]] = []
    for i in range(0, len(cards), cols):
        row: list[Flowable] = []
        for title, body in cards[i : i + cols]:
            row.append([P(title, "cardTitle"), P(body, "cardBody")])
        while len(row) < cols:
            row.append([P("", "cardBody")])
        cells.append(row)  # type: ignore[arg-type]

    table = Table(cells, colWidths=[col_w] * cols, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.45, LINE),
                ("LINEABOVE", (0, 0), (-1, 0), 3, accent),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def styled_table(
    headers: Sequence[str],
    rows: Sequence[Sequence[str]],
    widths: Sequence[float],
    bold_first: bool = True,
    zebra: bool = True,
) -> Table:
    data: list[list[Paragraph]] = [[P(h, "tableHead") for h in headers]]
    for row in rows:
        out_row: list[Paragraph] = []
        for j, cell in enumerate(row):
            style = "tableBodyBold" if (bold_first and j == 0) else "tableBody"
            out_row.append(P(cell, style))
        data.append(out_row)

    table = Table(data, colWidths=list(widths), repeatRows=1, hAlign="LEFT")
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY_2),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("BOX", (0, 0), (-1, -1), 0.7, NAVY_2),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if zebra:
        for r in range(1, len(data)):
            if r % 2 == 0:
                commands.append(("BACKGROUND", (0, r), (-1, r), PALE))
    table.setStyle(TableStyle(commands))
    return table


def info_band(title: str, body: str, bg: HexColor = PALE, accent: HexColor = BLUE) -> Table:
    cell = [[[P(title, "cardTitle"), P(body, "cardBody")]]]
    table = Table(cell, colWidths=[501], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("LINEBEFORE", (0, 0), (0, -1), 4, accent),
                ("LEFTPADDING", (0, 0), (-1, -1), 13),
                ("RIGHTPADDING", (0, 0), (-1, -1), 13),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return table


def price_cards(cards: Sequence[tuple[str, str, str]], width: float = 501) -> Table:
    cols = len(cards)
    col_w = width / cols
    row = []
    for label, price, body in cards:
        row.append(
            [
                P(label.upper(), "caption"),
                P(price, "price"),
                P(body, "cardBody"),
            ]
        )
    table = Table([row], colWidths=[col_w] * cols, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.8, BLUE),
                ("INNERGRID", (0, 0), (-1, -1), 0.45, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def qr_drawing(value: str, size: float = 86) -> Drawing:
    widget = QrCodeWidget(value)
    widget.barWidth = size
    widget.barHeight = size
    widget.barBorder = 0
    x1, y1, x2, y2 = widget.getBounds()
    drawing = Drawing(x2 - x1, y2 - y1)
    drawing.add(widget)
    return drawing


def draw_centered_wrapped(
    canvas,
    text: str,
    y: float,
    font: str,
    size: float,
    leading: float,
    max_width: float,
    color: HexColor,
) -> float:
    canvas.setFont(font, size)
    canvas.setFillColor(color)
    lines = simpleSplit(text, font, size, max_width)
    for line in lines:
        canvas.drawCentredString(PAGE_W / 2, y, line)
        y -= leading
    return y


def draw_cover(canvas, doc) -> None:
    canvas.saveState()

    # Dark vertical gradient.
    bands = 110
    for i in range(bands):
        y = PAGE_H - (i + 1) * PAGE_H / bands
        t = i / (bands - 1)
        canvas.setFillColor(gradient_color((3, 18, 34), (6, 42, 78), t))
        canvas.rect(0, y, PAGE_W, PAGE_H / bands + 1, stroke=0, fill=1)

    # thin diagonal brand lines in the background.
    canvas.setStrokeColor(HexColor("#123C63"))
    canvas.setLineWidth(1)
    for x in range(-180, int(PAGE_W) + 100, 46):
        canvas.line(x, PAGE_H - 70, x + 145, PAGE_H - 245)
    canvas.setStrokeColor(HexColor("#0E517E"))
    canvas.setLineWidth(4)
    canvas.setLineCap(1)
    canvas.line(28, 148, 186, 226)
    canvas.line(409, 226, 567, 148)

    # Top identity line.
    canvas.setFillColor(WHITE)
    canvas.setFont(FONT_BOLD, 11)
    canvas.drawString(42, PAGE_H - 48, "WEBKMT")
    canvas.setFillColor(HexColor("#9ADFFF"))
    canvas.setFont(FONT, 8)
    canvas.drawRightString(PAGE_W - 42, PAGE_H - 48, "webkmt.com")

    # Hero mark.
    if ICON.exists():
        canvas.drawImage(
            ImageReader(str(ICON)),
            PAGE_W / 2 - 155,
            455,
            width=310,
            height=282,
            mask="auto",
            preserveAspectRatio=True,
        )

    canvas.setFont(FONT_BOLD, 34)
    canvas.setFillColor(WHITE)
    canvas.drawCentredString(PAGE_W / 2, 420, "WEBKMT")

    canvas.setFont(FONT_BOLD, 12)
    canvas.setFillColor(CYAN)
    canvas.drawCentredString(PAGE_W / 2, 393, "BUSINESS PROFILE 2026")

    y = draw_centered_wrapped(
        canvas,
        "Ready-to-run digital systems for growing Middle East businesses",
        352,
        FONT_BOLD,
        22,
        28,
        470,
        WHITE,
    )
    draw_centered_wrapped(
        canvas,
        "Websites · WhatsApp AI · E-commerce · ERP · Automation",
        y - 8,
        FONT,
        10.5,
        15,
        470,
        HexColor("#C8E9FA"),
    )

    # Bottom facts.
    canvas.setFillColor(HexColor("#9ADFFF"))
    canvas.setFont(FONT_BOLD, 8)
    canvas.drawCentredString(PAGE_W / 2, 108, "BASED IN Türkiye")
    canvas.setFillColor(WHITE)
    canvas.setFont(FONT, 10)
    canvas.drawCentredString(PAGE_W / 2, 88, "Serving Saudi Arabia, the Gulf and the wider Middle East")
    canvas.setFillColor(HexColor("#8FBDD4"))
    canvas.setFont(FONT, 8)
    canvas.drawCentredString(PAGE_W / 2, 58, "info@webkmt.com  ·  WhatsApp +90 501 361 7795  ·  November 2026")

    canvas.restoreState()


def draw_later_page(canvas, doc) -> None:
    canvas.saveState()

    # Header.
    canvas.setFillColor(WHITE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    if ICON.exists():
        canvas.drawImage(
            ImageReader(str(ICON)),
            42,
            PAGE_H - 39,
            width=22,
            height=20,
            mask="auto",
            preserveAspectRatio=True,
        )
    canvas.setFillColor(NAVY)
    canvas.setFont(FONT_BOLD, 8)
    canvas.drawString(70, PAGE_H - 33, "WEBKMT")
    canvas.setFillColor(MUTED)
    canvas.setFont(FONT, 7.5)
    canvas.drawRightString(PAGE_W - 42, PAGE_H - 33, "Business Profile 2026")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.7)
    canvas.line(42, PAGE_H - 46, PAGE_W - 42, PAGE_H - 46)

    # Footer.
    canvas.setStrokeColor(LINE)
    canvas.line(42, 34, PAGE_W - 42, 34)
    canvas.setFillColor(MUTED)
    canvas.setFont(FONT, 7)
    canvas.drawString(42, 22, "WEBKMT · webkmt.com · info@webkmt.com")
    canvas.drawRightString(PAGE_W - 42, 22, str(doc.page))
    canvas.restoreState()


def build_story(data: dict) -> list[Flowable]:
    story: list[Flowable] = []

    # Page 1 is drawn by onFirstPage.
    story.extend([CoverSpacer(), PageBreak()])

    # ------------------------------------------------------------------ 02
    story.extend(
        section_intro(
            "At a glance",
            "One partner for your customer-facing and operating systems",
            "WEBKMT helps small and medium-sized businesses replace disconnected tools and manual follow-up with installed, configured and managed digital systems — without starting every project from a blank page.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Who we serve",
                    "Small and medium-sized businesses, with our main market in Saudi Arabia and clients served across the Gulf and wider Middle East.",
                ),
                (
                    "Where we work",
                    "An online-first agency based in Türkiye, working in English and Saudi/Gulf-friendly Arabic, with calls on WhatsApp or Google Meet.",
                ),
                (
                    "What we build",
                    "Business websites, WhatsApp and website AI, e-commerce, ERP, workflow automation and selected custom web systems.",
                ),
                (
                    "How we work",
                    "We package proven open-source platforms and ready-made designs into systems configured for your business, then help you run them.",
                ),
            ],
            cols=2,
        )
    )
    story.append(Spacer(1, 14))
    story.append(P("Inside this profile", "h2"))
    story.append(
        styled_table(
            ["Section", "What you will find"],
            [
                ["Our approach", "Who WEBKMT is, the problem we solve, and how an engagement works."],
                ["Product ecosystem", "The five WEBKMT systems and how they fit together."],
                ["Product pages", "What each system does, who it suits, what is included, and what remains scoped."],
                ["Commercial snapshot", "Approved starting prices, payment model, and items confirmed in the official quote."],
                ["Why WEBKMT", "Ownership, Arabic-first delivery, transparent entry points, and human accountability."],
            ],
            [135, 366],
        )
    )
    story.append(Spacer(1, 13))
    story.append(
        info_band(
            "A practical starting point",
            "Most clients do not need everything at once. Start with the bottleneck that is costing enquiries, sales or staff time — then connect the next system when the first one is working.",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 03
    story.extend(
        section_intro(
            "Who we are",
            "Digital systems, installed for the way your business actually runs",
            "WEBKMT is an online digital systems agency for companies and SMBs. We turn mature, ready-made technology into business systems your team can use from day one.",
        )
    )
    story.append(
        P(
            "Many growing businesses already have some combination of a website, WhatsApp, spreadsheets, accounting files, social accounts and staff knowledge that lives only in people’s heads. The problem is rarely a lack of software. It is that the pieces do not work together, enquiries wait too long for a reply, and every routine task depends on someone remembering to do it."
        )
    )
    story.append(
        P(
            "WEBKMT closes those gaps. We design the customer journey, install the system, configure it around your services and data, and stay involved after launch through hosting, maintenance and support options."
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Ready to run",
                    "Templates, proven open-source platforms and repeatable implementation patterns reduce build time and avoid unnecessary custom software.",
                ),
                (
                    "Configured, not generic",
                    "Your branding, services, products, prices, policies, users and workflows are set up for your business — not left as demo content.",
                ),
                (
                    "Arabic and English",
                    "Customer-facing systems are designed for Saudi/Gulf audiences as well as English-speaking customers and partners.",
                ),
                (
                    "Human accountability",
                    "Automation handles speed and repetition. People remain responsible for exceptions, judgement calls, quotes and sensitive matters.",
                ),
            ],
            cols=2,
            accent=TEAL,
        )
    )
    story.append(Spacer(1, 14))
    story.append(P("Our positioning", "h2"))
    story.append(
        info_band(
            "Get customers → respond instantly → sell → run the business → automate and grow",
            "WEBKMT Websites creates the front door. WEBKMT Chat captures and answers demand. WEBKMT Store sells online. WEBKMT ERP runs operations. WEBKMT Automate connects the steps in between, and WEBKMT Marketing is being developed to complete the growth loop.",
            bg=HexColor("#F3FBFD"),
            accent=CYAN,
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        bullets(
            [
                "Published entry prices for the core offers, instead of making every first step a custom quotation.",
                "Open-source foundations and client ownership of business data and purchased templates.",
                "A direct, senior-led delivery model: the people scoping your system stay close to implementation and support.",
            ]
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        styled_table(
            ["Discover", "Respond", "Sell", "Operate", "Grow"],
            [["Website", "Chat", "Store", "ERP + Automate", "Marketing (roadmap)"]],
            [100, 100, 100, 100, 101],
            bold_first=False,
            zebra=False,
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 04
    story.extend(
        section_intro(
            "The problem we solve",
            "Growth breaks when every step is manual",
            "A business can lose revenue long before it has a ‘big technology problem’. Usually the leaks are small, repeated and invisible.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Slow first response",
                    "A prospect messages after hours, waits, and quietly chooses a competitor who replied first.",
                ),
                (
                    "Scattered information",
                    "Prices, product details and policies sit across chats, files and staff memory, so answers vary by person.",
                ),
                (
                    "Leads without a system",
                    "Enquiries arrive by form, WhatsApp and social media but are not consistently qualified, recorded or followed up.",
                ),
                (
                    "Operations in spreadsheets",
                    "Stock, invoices, orders and customer records are copied between tools until reporting becomes slow and unreliable.",
                ),
            ],
            cols=2,
            accent=ROYAL,
        )
    )
    story.append(P("The WEBKMT response", "h2"))
    story.append(
        styled_table(
            ["Business moment", "Connected system", "Result you can manage"],
            [
                ["A visitor finds you", "WEBKMT Websites / Store", "Clear offer, trust signals and a direct path to enquire or buy."],
                ["A customer asks a question", "WEBKMT Chat", "Instant acknowledgement and answers grounded in your approved information."],
                ["A lead is ready to talk", "Qualification + CRM handoff", "Contact details, need and context captured with consent for your team."],
                ["An order or invoice moves", "WEBKMT ERP / Store", "One operational record for customers, stock, sales and finance."],
                ["A routine step repeats", "WEBKMT Automate", "Reminders, notifications, summaries and data movement without manual chasing."],
            ],
            [130, 150, 221],
        )
    )
    story.append(Spacer(1, 13))
    story.append(
        info_band(
            "Our design rule",
            "Automate the predictable. Escalate the ambiguous. Never make the customer wait just to learn that their message was received.",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 05
    story.extend(
        section_intro(
            "Product ecosystem",
            "Five systems, one operating picture",
            "Each WEBKMT product can start on its own. Together they form a practical digital operating system for an SMB.",
        )
    )
    product_rows = [
        [p["name"], p["role"], p["engagement"], p["starting_price"]] for p in data["products"]
    ]
    story.append(
        styled_table(
            ["System", "Purpose", "Engagement", "Commercial entry"],
            product_rows,
            [112, 190, 94, 105],
        )
    )
    story.append(Spacer(1, 14))
    story.append(P("How to choose your first system", "h2"))
    story.append(
        cards_grid(
            [
                (
                    "Start with Websites if…",
                    "Your current site is missing, outdated, slow to explain your offer, or not turning visits into enquiries.",
                ),
                (
                    "Start with Chat if…",
                    "Customers already message you, but replies are delayed and the same questions consume staff time.",
                ),
                (
                    "Start with Store if…",
                    "You need a serious online catalogue and checkout rather than handling every order through chat.",
                ),
                (
                    "Start with ERP if…",
                    "Finance, inventory, sales and team operations have outgrown spreadsheets and disconnected apps.",
                ),
            ],
            cols=2,
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        P(
            "Status is stated deliberately. “Scoped implementation” means we confirm modules, data, integrations and responsibilities before issuing the official quote. “Pilot deployments” means the client works closely with WEBKMT while the package is being hardened. WEBKMT Marketing is in development; early partner enquiries are welcome, but it is not presented as a finished off-the-shelf product in this profile.",
            "small",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 06
    story.extend(
        section_intro(
            "WEBKMT Websites",
            "A credible front door — from template files to a fully managed year",
            "Choose a ready-made business design, then decide how much of the work WEBKMT should handle for you.",
        )
    )
    story.append(
        price_cards(
            [
                (
                    "Plan 1 · Files only",
                    "USD 150",
                    "Template code files delivered within a maximum of two days after payment. Yours to use, modify or resell after full payment.",
                ),
                (
                    "Plan 2 · Customized files",
                    "USD 300–799",
                    "We adapt the design and structure to your business and deliver customized files ready for your deployment.",
                ),
                (
                    "Plan 3 · Ultimate",
                    "USD 800–1,599",
                    "Customization, initial content writing, hosting, annual maintenance and minor edits during the year.",
                ),
            ]
        )
    )
    story.append(P("What a WEBKMT website is designed to do", "h2"))
    story.append(
        bullets(
            [
                "Explain your offer quickly and guide visitors to call, message, request a quote or buy.",
                "Present services, products, proof, FAQs and contact routes in a clean Arabic/English-ready structure.",
                "Work properly on mobile, where most customer discovery and WhatsApp enquiries begin.",
                "Provide a foundation that can later connect to WEBKMT Chat, Store, ERP and automation.",
            ]
        )
    )
    story.append(
        styled_table(
            ["Step", "What happens", "Typical timing"],
            [
                ["Choose", "Browse live template demos and select the closest design and plan.", "Same day"],
                ["Confirm", "For Plans 2–3, we scope pages, branding, content, domain and features.", "Short discovery call"],
                ["Deliver", "Files only, customized files, or a hosted Ultimate website depending on plan.", "Plan 1: max. 2 days after payment; other plans confirmed in quote"],
                ["Improve", "Add pages, chat, store, automations or maintenance as the business grows.", "By agreement"],
            ],
            [72, 285, 144],
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        info_band(
            "Ownership",
            "After full payment, the purchased template is yours — including the right to modify it or resell it. Third-party components remain under their own licences.",
            accent=TEAL,
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 07
    story.extend(
        section_intro(
            "WEBKMT Chat",
            "Never miss or delay a customer inquiry",
            "An Arabic/English AI receptionist for WhatsApp and your website that answers from approved business information, qualifies enquiries and brings a human in when needed.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "For Service",
                    "Instant acknowledgement, grounded answers to routine questions, and escalation when the answer is missing, sensitive or outside policy.",
                ),
                (
                    "For Sales",
                    "Guided discovery, need and budget qualification, consented contact capture, and a structured lead handoff to your team.",
                ),
                (
                    "Built from your material",
                    "Your services, price lists, FAQs and policies are loaded into an approved knowledge base. The assistant should say it needs to check rather than invent an answer.",
                ),
                (
                    "Human by design",
                    "Customers can ask for a person. Pricing exceptions, complaints, regulated questions and complex requests stay with humans.",
                ),
            ],
            cols=2,
            accent=CYAN,
        )
    )
    story.append(P("How an enquiry flows", "h2"))
    story.append(
        styled_table(
            ["Stage", "System behaviour"],
            [
                ["1 · Receive", "The customer writes on WhatsApp or the website. The system acknowledges immediately, day or night."],
                ["2 · Understand", "The message is classified by intent and urgency; Arabic and English are the primary launch languages."],
                ["3 · Answer", "Approved knowledge is retrieved and used to answer in plain language, with only approved prices and policies."],
                ["4 · Qualify", "Useful details — need, timing, location, budget band and contact — are collected naturally and with consent."],
                ["5 · Hand off", "Your team receives the lead context, or the conversation is escalated when a human should take over."],
            ],
            [105, 396],
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        price_cards(
            [
                ("Setup", "USD 300", "One business, one WhatsApp entry point and website entry point, one knowledge base."),
                ("Standard plan", "USD 29/mo", "Fair use: up to 5,000 classified inbound messages and 3,000 AI-generated answers monthly."),
                ("Knowledge updates", "4 batches/mo", "Initial loading of up to 20 source documents or 100,000 words is included in setup."),
            ]
        )
    )
    story.append(Spacer(1, 7))
    story.append(
        P(
            "WEBKMT Chat is currently offered through closely managed pilot deployments. Appointment requests are captured for human confirmation until booking integration is enabled for the deployment. Meta or provider charges for business-initiated template/campaign messages are not included in the USD 29 plan and are confirmed separately.",
            "small",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 08
    story.extend(
        section_intro(
            "WEBKMT Store",
            "A complete e-commerce system you control",
            "For businesses ready to move beyond taking every order manually through chat, WEBKMT Store provides a full online selling foundation that can grow with the catalogue and market.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Storefront and catalogue",
                    "Product categories, search, product pages, promotions and a mobile-first shopping experience in Arabic/English-ready RTL/LTR layouts.",
                ),
                (
                    "Orders and customers",
                    "Checkout, customer accounts, order management, fulfilment statuses and operational views for the store team.",
                ),
                (
                    "Multi-market readiness",
                    "Multi-currency/channel and inventory structures can be configured for the markets and sales model agreed in scope.",
                ),
                (
                    "Extensible platform",
                    "Built on the open-source Bagisto platform and prepared as a repeatable WEBKMT deployment that can be tailored per client.",
                ),
            ],
            cols=2,
            accent=ROYAL,
        )
    )
    story.append(P("Basic plan", "h2"))
    story.append(
        price_cards(
            [
                ("WEBKMT Store Basic", "USD 899", "Initial setup plus one year of hosting only. This gives you the platform foundation without bundling unpriced management work."),
                ("Separately scoped", "Official quote", "Catalogue/content loading, design customization, payment/shipping integrations, add-ons and ongoing management are itemized before work begins."),
            ]
        )
    )
    story.append(P("Saudi and regional selling — handled honestly", "h2"))
    story.append(
        bullets(
            [
                "Payment gateways, shipping providers, tax and invoicing requirements are confirmed against the merchant’s country, registrations and chosen providers during scoping.",
                "For Saudi Arabia, e-invoicing/ZATCA work is treated as a dedicated localization and integration scope. The merchant’s commercial registration, VAT and platform onboarding remain under the merchant’s control.",
                "We do not label a store ‘compliant’ until the exact legal, payment and invoicing path has been validated for that merchant.",
            ]
        )
    )
    story.append(
        info_band(
            "Best fit",
            "Retailers, wholesalers and product-led SMBs that need a real catalogue, checkout and order operation — and want to own the store platform rather than build the business entirely inside a marketplace or chat thread.",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 09
    story.extend(
        section_intro(
            "WEBKMT ERP",
            "Finance, stock, sales and operations in one system",
            "An ERPNext-based implementation service that gives growing companies an integrated operating core without per-user software pricing from WEBKMT.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Financial core",
                    "Accounting, invoicing, receivables/payables, payments, assets, cost centres and reporting.",
                ),
                (
                    "Inventory and supply chain",
                    "Items, warehouses, purchasing, stock movements, batch/serial/expiry and delivery.",
                ),
                (
                    "Commercial operations",
                    "CRM, quotations, sales orders, customers, support and POS by scope.",
                ),
                (
                    "People and projects",
                    "Employees, attendance, leave, payroll setup, projects, tasks and approvals.",
                ),
                (
                    "Manufacturing options",
                    "BOMs, work orders, planning and quality for makers and assemblers.",
                ),
                (
                    "Arabic/English working",
                    "Bilingual RTL interface, roles, dashboards and reports by team.",
                ),
            ],
            cols=3,
            accent=BLUE_DARK,
        )
    )
    story.append(P("Commercial model", "h2"))
    story.append(
        styled_table(
            ["Item", "WEBKMT model"],
            [
                ["Implementation setup", "<b>USD 1,400 flat</b> for the agreed standard implementation scope. Larger migrations, custom development and integrations are quoted explicitly."],
                ["User pricing", "No WEBKMT per-user ERP licence. Care is priced by hosting/support workload — not by counting seats."],
                ["Localization", "Country tax/e-invoicing and payroll rules are dedicated implementation work, verified with the client’s accountant/HR."],
            ],
            [128, 373],
        )
    )
    story.append(P("Managed care tiers", "h2"))
    story.append(
        styled_table(
            ["Tier", "Price", "Included care"],
            [
                ["Essential", "USD 59/mo", "One company, managed hosting/SSL, daily backups retained 7 days, next-business-day support, 1 minor change/month."],
                ["Growth", "USD 119/mo", "Up to 2 companies/branches, 30-day backups, same-business-day priority, up to 4 minor changes or 2 hours/month, monthly health summary."],
                ["Scale", "USD 229/mo", "Multi-company/high-volume, 90-day backups, urgent priority, up to 8 minor changes or 5 hours/month, quarterly review."],
            ],
            [92, 82, 327],
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        P(
            "Care covers the configuration WEBKMT delivered: updates, monitoring, backup/restore assistance, break-fix support, user/permission administration and the tier’s minor-change allowance. New modules, custom development, data entry/bookkeeping, statutory filing, major migrations, hardware and large training programmes are separate scopes.",
            "small",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 10
    story.extend(
        section_intro(
            "WEBKMT Automate & custom systems",
            "Connect the work between your systems",
            "When staff copy data, chase reminders or repeat the same digital steps every day, automation can give that time back — if the process is scoped properly.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Lead and customer workflows",
                    "New enquiry alerts, follow-up tasks, review requests, appointment-request routing and customer notifications.",
                ),
                (
                    "Finance and operations",
                    "Payment reminders, invoice/document routing, stock or threshold alerts, approvals and recurring summaries.",
                ),
                (
                    "Document intake",
                    "Forms and documents can be classified or converted into structured tasks, with OCR/document modules scoped inside the system that needs them.",
                ),
                (
                    "Reporting",
                    "Scheduled sales, operations or website summaries assembled from connected systems instead of manual spreadsheet copying.",
                ),
            ],
            cols=2,
            accent=TEAL,
        )
    )
    story.append(P("Flexible project work", "h2"))
    story.append(
        P(
            "Alongside the packaged systems, WEBKMT can scope legitimate work to build, manage, fix or host websites, landing pages, web applications and mobile-app projects, and to introduce AI into an existing business process. A flexible request is assessed for feasibility, timeline and fit before we commit — it is not converted into an automatic promise."
        )
    )
    story.append(
        styled_table(
            ["Automation stage", "Purpose"],
            [
                ["Audit", "Map the current process, tools, owners, exceptions and data quality."],
                ["Design", "Choose the smallest reliable workflow; define approvals, retries and human fallback."],
                ["Build & test", "Connect systems, handle duplicates/failures, and test with realistic cases."],
                ["Operate", "Monitor errors, refine templates and expand only where the workflow proves valuable."],
            ],
            [135, 366],
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        info_band(
            "Pricing",
            "Automation and custom work are quoted after discovery because the cost depends on the tools, data and exceptions involved. Your official quote will separate setup, third-party charges and any ongoing care.",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 11
    story.extend(
        section_intro(
            "WEBKMT Marketing · Roadmap",
            "Completing the growth loop",
            "WEBKMT Marketing is the fifth system in the ecosystem: a full-scale marketing management layer that will connect campaigns and content to the leads and customers already moving through your WEBKMT systems.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Campaign management",
                    "Email and customer journeys, segments, forms and landing pages managed from a structured marketing workspace.",
                ),
                (
                    "Social operations",
                    "Planning and scheduling across connected channels, with approvals and a clear publishing calendar.",
                ),
                (
                    "Lead lifecycle",
                    "Connect campaign engagement to enquiry, qualification and follow-up instead of treating marketing and sales as separate lists.",
                ),
                (
                    "Market visibility",
                    "Owned-channel, review, search and competitor-web monitoring where data access is legitimate and available.",
                ),
            ],
            cols=2,
            accent=CYAN,
        )
    )
    story.append(Spacer(1, 14))
    story.append(
        info_band(
            "Current status",
            "WEBKMT Marketing is in development and is not sold as a finished standard package in this profile. Businesses interested in shaping an early deployment can discuss a partner project; scope, channels, data sources and any third-party costs will be defined in an official quote.",
            bg=HexColor("#FFF8E8"),
            accent=HexColor("#E3A008"),
        )
    )
    story.append(P("Why it belongs in the ecosystem", "h2"))
    story.append(
        bullets(
            [
                "Your website and store already capture demand; marketing should be able to nurture the people who are not ready today.",
                "Your chat and CRM already hold customer intent; campaigns should respond to real needs rather than sending the same message to everyone.",
                "Your ERP knows what customers bought; future growth activity can become more relevant without recreating customer data in another tool.",
            ]
        )
    )
    story.append(
        P(
            "Until the standard product is ready, WEBKMT can scope focused website, content and automation work that supports growth — without labelling it as the finished Marketing suite.",
            "body",
        )
    )
    story.append(P("Useful preparation for early partners", "h2"))
    story.append(
        cards_grid(
            [
                ("Clean the audience data", "Bring customer and lead lists, consent status and segments into an agreed structure."),
                ("Connect capture points", "Make website, store and chat enquiries measurable and attributable before increasing campaign volume."),
                ("Prepare the content engine", "Define offers, proof, FAQs and reusable Arabic/English content blocks for campaigns."),
                ("Agree the growth scoreboard", "Choose a small set of enquiry, conversion and repeat-purchase measures the business will review."),
            ],
            cols=2,
            accent=TEAL,
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 12
    story.extend(
        section_intro(
            "How we work",
            "A clear path from first call to a running system",
            "No endless discovery for a standard need. No vague build for a complex one. Each project moves through the same accountable stages.",
        )
    )
    story.append(
        styled_table(
            ["Stage", "WEBKMT", "Client"],
            [
                ["1 · Discover", "Understand the business, bottleneck, current tools and success criteria.", "Name one decision-maker and share the current process honestly."],
                ["2 · Scope & quote", "Recommend the smallest suitable system; separate included work, exclusions and third-party costs.", "Approve scope, price, data/content responsibilities and timeline."],
                ["3 · Configure / build", "Install, brand, configure users, content, products, workflows and integrations in scope.", "Provide logo, texts, data, account access and registrations where needed."],
                ["4 · Review & train", "Test realistic cases, correct the agreed items and show the team how to work in the system.", "Review with the people who will use it and confirm launch readiness."],
                ["5 · Launch", "Go live, monitor the first use and resolve launch issues under the agreed support route.", "Start using the new process consistently."],
                ["6 · Care & grow", "Maintain, update and improve under the selected program; propose the next bottleneck to solve.", "Keep source information current and tell us when policies or offers change."],
            ],
            [92, 205, 204],
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        cards_grid(
            [
                (
                    "Communication",
                    "Discovery and review calls are held on WhatsApp call or Google Meet. Email and WhatsApp are the standard written routes.",
                ),
                (
                    "Response",
                    "WEBKMT operates online 24/7. Automated systems respond instantly; standard human follow-up is targeted within one business day.",
                ),
                (
                    "Timelines",
                    "Typical ranges are confirmed in the quote after scope and client inputs are known. Waiting time for content, payments or registrations sits outside the build clock.",
                ),
                (
                    "Change control",
                    "Useful new ideas are welcome — and are quoted as changes when they fall outside the agreed scope, so cost and delivery stay visible.",
                ),
            ],
            cols=2,
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        info_band(
            "What we need from you",
            "Brand files, business texts, product/service data, relevant account/domain access, business registrations for payment or invoicing work, and one person able to make decisions and review progress.",
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 13
    story.extend(
        section_intro(
            "Commercial snapshot",
            "Transparent entry points, exact scope in writing",
            "The prices below are the approved starting points for standard packages. Your signed official quote confirms scope, timeline, included items and any third-party charges.",
        )
    )
    story.append(
        styled_table(
            ["Offer", "Approved entry price", "What it means"],
            [
                ["Website Plan 1", "USD 150", "Template code files only; max. 2 days after payment."],
                ["Website Plan 2", "USD 300–799", "Files customized for your business."],
                ["Website Plan 3 Ultimate", "USD 800–1,599", "Customization, content writing, hosting, annual maintenance and minor edits."],
                ["WEBKMT Chat", "USD 300 + USD 29/mo", "Pilot setup and standard fair-use plan described in this profile."],
                ["WEBKMT Store Basic", "USD 899", "Initial setup + 1 year hosting only; add-ons/management quoted separately."],
                ["WEBKMT ERP", "USD 1,400 + care", "Flat implementation setup; care Essential 59 / Growth 119 / Scale 229 per month."],
                ["Automate / Marketing", "Official quote", "Priced after discovery by workflow, channels, data and operating scope."],
            ],
            [132, 125, 244],
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        cards_grid(
            [
                (
                    "Package ceiling",
                    "No WEBKMT service package exceeds USD 10,000. If a need is larger, we phase it into separately approved packages.",
                ),
                (
                    "Payment schedule",
                    "Template files are paid in full before delivery. Scoped services normally start at 50% with the balance at delivery; monthly/annual programmes are paid in advance.",
                ),
                (
                    "Payment methods",
                    "IBAN, Western Union or crypto. Payment details are provided by a human after the official quote is agreed.",
                ),
                (
                    "Taxes and third-party fees",
                    "Applicable taxes, transfer/provider charges, licences and usage fees are itemized in the official quote where relevant; they are not hidden inside a headline package price.",
                ),
            ],
            cols=2,
            accent=ROYAL,
        )
    )
    story.append(Spacer(1, 7))
    story.append(
        P(
            "Summary commercial terms in this profile are for orientation. Cancellation/refund treatment, delivery conditions, client-input dependencies and care exclusions are governed by the signed quote or contract for the specific engagement.",
            "small",
        )
    )
    story.append(P("How to get an exact price", "h3"))
    story.append(
        styled_table(
            ["1 · Send the bottleneck", "2 · Short discovery", "3 · Official quote"],
            [[
                "Tell us what is slow, manual or missing.",
                "We confirm scope, inputs, integrations and the smallest useful start.",
                "Included work, exclusions, timeline and terms — in writing.",
            ]],
            [167, 167, 167],
            bold_first=False,
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 14
    story.extend(
        section_intro(
            "Why WEBKMT",
            "Built for owners who need systems, not software homework",
            "We focus on the combination Middle East SMBs ask for most: speed, ownership, Arabic/English delivery and one accountable partner after launch.",
        )
    )
    story.append(
        cards_grid(
            [
                (
                    "Open-source foundations",
                    "Proven platforms reduce licence lock-in and let the system be tailored to the client rather than forcing every business into identical SaaS limits.",
                ),
                (
                    "Ownership of the asset",
                    "Your business data remains yours. Purchased website templates are owned after full payment, and export/handover paths are discussed before launch.",
                ),
                (
                    "Arabic-first, not translated later",
                    "Saudi/Gulf customer language, RTL needs and WhatsApp behaviour are treated as core design inputs for regional deployments.",
                ),
                (
                    "No per-user ERP pricing",
                    "WEBKMT ERP care is based on operating and support workload, helping teams collaborate without a new licence conversation for every seat.",
                ),
                (
                    "Start small, connect later",
                    "A USD 150 template or a focused chat pilot can be the first step toward a store, ERP and automated operations — in the order the business needs.",
                ),
                (
                    "Honest capability boundaries",
                    "We label pilot and roadmap items clearly, keep humans in sensitive decisions, and do not present unvalidated compliance or performance claims as fact.",
                ),
            ],
            cols=2,
            accent=BLUE,
        )
    )
    story.append(P("Proof and confidentiality", "h2"))
    story.append(
        P(
            "WEBKMT focuses on small and medium-sized businesses in Saudi Arabia, the Gulf and the wider Middle East. For legal and confidentiality reasons, this profile does not publish client identities, logos, testimonials or outcome metrics. The most reliable way to evaluate us is to inspect our live website, template demos, free tools and product experiences — then discuss your exact operating needs directly with the team."
        )
    )
    story.append(
        info_band(
            "Try before you commit",
            "Visit webkmt.com to explore the Template Gallery and free business tools, including the Website Analyzer and ROI Calculator. Then send us the result or describe your bottleneck on WhatsApp.",
            accent=TEAL,
        )
    )
    story.append(PageBreak())

    # ------------------------------------------------------------------ 15
    # Closing / CTA page. It sits on the standard page background but uses a
    # full-width dark panel for a strong finish.
    cta_inner = [
        [
            Image(str(ICON), width=72, height=65, mask="auto"),
        ],
        [P("Let’s build the system your business runs on", "ctaTitle")],
        [
            P(
                "Book a short discovery conversation. Tell us where enquiries, sales or operations are getting stuck — we will recommend the smallest WEBKMT system that solves that problem first.",
                "ctaBody",
            )
        ],
    ]
    cta_table = Table(cta_inner, colWidths=[439], hAlign="CENTER")
    cta_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 24),
                ("RIGHTPADDING", (0, 0), (-1, -1), 24),
                ("TOPPADDING", (0, 0), (0, 0), 16),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 18),
            ]
        )
    )
    outer = Table([[cta_table]], colWidths=[501], hAlign="LEFT")
    outer.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY),
                ("BOX", (0, 0), (-1, -1), 1, NAVY_2),
                ("LEFTPADDING", (0, 0), (-1, -1), 31),
                ("RIGHTPADDING", (0, 0), (-1, -1), 31),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(outer)
    story.append(Spacer(1, 12))

    contact_cards = [
        [
            qr_drawing(data["whatsapp_url"], 78),
            qr_drawing(data["website"], 78),
        ],
        [
            P("<b>Chat on WhatsApp</b><br/>+90 501 361 7795", "center"),
            P("<b>Visit WEBKMT</b><br/>webkmt.com", "center"),
        ],
    ]
    qr_table = Table(contact_cards, colWidths=[230, 230], hAlign="CENTER")
    qr_table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                ("BACKGROUND", (0, 1), (-1, 1), PALE),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 16),
                ("RIGHTPADDING", (0, 0), (-1, -1), 16),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(qr_table)
    story.append(Spacer(1, 12))

    contact_rows = [
        ["Email", "<link href='mailto:info@webkmt.com' color='#147FB8'>info@webkmt.com</link>"],
        ["WhatsApp", "<link href='https://wa.me/905013617795' color='#147FB8'>+90 501 361 7795</link> — WEBKMT general contact"],
        ["Calls", "WhatsApp call or Google Meet, confirmed by the team after your message"],
        ["LinkedIn", "<link href='https://www.linkedin.com/company/webkmt' color='#147FB8'>linkedin.com/company/webkmt</link>"],
        ["X", "<link href='https://x.com/webkemet' color='#147FB8'>@webkemet</link>"],
        ["Instagram", "<link href='https://www.instagram.com/webkmt/' color='#147FB8'>@webkmt</link>"],
        ["Base / market", "Based in Türkiye · Serving Saudi Arabia, the Gulf and the wider Middle East · Online 24/7"],
    ]
    story.append(styled_table(["Contact", "Details"], contact_rows, [112, 389]))
    story.append(Spacer(1, 11))

    lockup_row = Table(
        [
            [
                Image(str(LOCKUP), width=52, height=52),
                P(
                    "<b><font color='#071B33' size='12'>WEBKMT</font></b><br/>"
                    "<font color='#617B90'>Ready-to-Run Business Systems: Websites, WhatsApp AI, ERP &amp; Automation</font>",
                    "body",
                ),
            ]
        ],
        colWidths=[78, 360],
        hAlign="CENTER",
    )
    lockup_row.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(lockup_row)
    story.append(Spacer(1, 9))
    story.append(
        P(
            "Business Profile v1.0 · November 2026. Product availability, standard-package scope and prices are confirmed in the official quote for each engagement. Client identities are intentionally not published in this profile.",
            "caption",
        )
    )

    return story


def main() -> None:
    global S
    register_fonts()
    S = make_styles()
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT_PATH),
        pagesize=A4,
        rightMargin=42,
        leftMargin=42,
        topMargin=62,
        bottomMargin=48,
        title="WEBKMT Business Profile 2026",
        author="WEBKMT",
        subject="Ready-to-run digital systems for growing Middle East businesses",
        keywords="WEBKMT, business profile, websites, WhatsApp AI, ERP, e-commerce, automation",
    )
    doc.build(build_story(data), onFirstPage=draw_cover, onLaterPages=draw_later_page)
    print(f"Generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
