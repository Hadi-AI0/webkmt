# WebKMT Platform — Comprehensive Architecture & Feature Specification

> **Platform Version**: 1.0.0 (Production Release Architecture)  
> **Repository Name**: `webkmt` (`web-kemet`)  
> **Production Domain**: [webkmt.com](https://webkmt.com) | [link.webkmt.com](https://link.webkmt.com)  
> **Target Audience**: Modern businesses, SMEs, enterprises, and startups in the GCC (Saudi Arabia, UAE, etc.) and global markets.

---

## 1. Executive Summary & Purpose

### What the Website Is For
**WebKMT** is the primary digital platform and customer touchpoint for **WebKMT**, a high-end software solutions and digital transformation agency. 

Historically conceived with a digital marketing agency angle, the platform has evolved into an **engineering-first custom software solutions firm** operating under the core value proposition:  
> *"We Build the Software Your Business Runs On — Custom websites, mobile apps, AI tools, CRMs, POS systems, and automation pipelines engineered for real-world results."*

The website serves four primary strategic functions:
1. **Commercial Positioning & Credibility**: Demonstrates WebKMT's capability to deliver alternatives to bloated, expensive off-the-shelf software (such as Odoo, Brightpearl, Salesforce, and HubSpot) through bespoke software engineering.
2. **Product-Led Lead Generation (PLG)**: Rather than relying solely on static sales text, the platform hosts an interactive ecosystem of live, production-grade **Mini-Apps** (e.g., KMT Link, Website Analyzer, ROI Calculator, Color Palette Studio). Prospective clients experience WebKMT's engineering prowess firsthand, turning casual visitors into qualified inbound leads.
3. **Structured Sales Qualification**: Features an interactive 5-step project scoping wizard and direct WhatsApp integration to capture high-intent leads and route them immediately to sales engineering.
4. **Bilingual Regional Operations**: Built natively for the GCC and MENA markets, offering complete bi-directional support (English LTR and Arabic RTL) with localized typography and contextualized service offerings.

---

## 2. Platform Architecture Overview

WebKMT employs a hybrid architecture optimized for sub-second First Contentful Paint (FCP), tight security, and high maintainability:

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                       |
|  +--------------------+  +--------------------+  +---------------------------------+  |
|  |   Landing Page     |  |   Case Studies     |  |     Mini-Apps Sandbox Hub       |  |
|  |   (index.html)     |  | (case-study.html)  |  | (KMT Link, Analyzer, ROI, etc.) |  |
|  +--------------------+  +--------------------+  +---------------------------------+  |
|  | UI: Glassmorphism / Dark-Light Theme / Cairo & Noto Sans Arabic / CSS Bundles   |  |
|  | JS: Vanilla ES6+ Modules / InitializationManager / Performance & Auth Managers   |  |
+---------------------------------------------------------------------------------------+
                                           │
                                    HTTP / REST / WSS
                                           ▼
+---------------------------------------------------------------------------------------+
|                                 APPLICATION SERVER                                    |
|                              (Node.js + Express.js)                                   |
|  +---------------------------------------------------------------------------------+  |
|  | Middleware: Helmet (CSP) | Rate-Limiter | Input Sanitizer | Compression | Logger|  |
|  +---------------------------------------------------------------------------------+  |
|  |  /api/auth       | Registration, Token Verification, Profile Management         |  |
|  |  /api/contact    | Multi-step Quotes, General Contact, Newsletter               |  |
|  |  /api/mini-apps  | SSRF-protected SEO Auditing & Speed Testing Engines           |  |
|  |  /api/gemini-chat| Authenticated AI Proxy to Google Gemini 1.5 Flash            |  |
|  |  /api/data       | User-scoped session data persistence                         |  |
|  |  /:username      | Dynamic Bio-Link routing (link.webkmt.com vanity profiles)   |  |
|  |  /js/supabase-...| Dynamic secure client config injection                       |  |
+---------------------------------------------------------------------------------------+
                                           │
                         PostgreSQL Queries / RLS / Auth Admin
                                           ▼
+---------------------------------------------------------------------------------------+
|                              BACKEND CLOUD & DATABASE                                 |
|                                     (Supabase)                                        |
|  +---------------------------------------------------------------------------------+  |
|  | PostgreSQL Database with Row-Level Security (RLS) & Role-Based Access Control   |  |
|  | Collections/Tables: profiles, blogs, kmtlink_profiles, contacts, newsletter,    |  |
|  |                     mini_app_sessions, analytics_events                         |  |
|  | Triggers: Auto-creation of user profiles on auth.users registration             |  |
|  | Supabase Auth: Email/Password, Google OAuth, GitHub OAuth                       |  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Business Features & Value Propositions

### 3.1 Core Service Offerings
The platform showcases eight distinct, high-margin software engineering services:

1. **Web & Mobile Applications**: Full-stack, high-performance web applications and cross-platform mobile apps (React Native / Flutter) built for extreme scalability and seamless UX.
2. **Custom AI Tools**: Purpose-built enterprise artificial intelligence implementations, including document ingestion pipelines, automated agentic workflows, and customer service bots.
3. **Tailored CRM & ERP Systems**: Custom alternatives to rigid enterprise platforms (e.g., Odoo, SAP, Brightpearl), matching a company's exact operational logic without recurring per-seat subscription lock-in.
4. **Point of Sale (POS) Systems**: Customized retail, dining, and hospitality management software combining multi-currency billing, real-time inventory synchronization, and offline resilience.
5. **Automation Pipelines**: End-to-end integration workflows connecting disparate SaaS tools, eliminating manual spreadsheet entry, and automating business processes.
6. **Internal Tools & Portals**: Purpose-built internal management consoles, executive KPI dashboards, team management systems, and employee scheduling engines.
7. **System Optimization & Refactoring**: Codebase refactoring, database query tuning, architecture overhauls, and infrastructure cost reductions for existing software.
8. **Strategic Tech Consulting**: Architectural planning, digital transformation roadmaps, tech stack evaluation, and vendor selection for executive leadership.

### 3.2 Lead Generation & Conversion Engines
- **Interactive 5-Step Quote Wizard**:
  - *Step 1 (Scope)*: Selects required deliverables (Web App, Mobile App, AI Tool, CRM/ERP, POS, Automation, Internal Tool).
  - *Step 2 (Status)*: Identifies whether the project is a greenfield build or an overhaul of an existing system.
  - *Step 3 (Timeline)*: Flags urgency (`ASAP`, `1-3 months`, `3-6 months`, `Flexible`).
  - *Step 4 (Budget Range)*: Filters investment scale (`Under $5k`, `$5k-$15k`, `$15k-$50k`, `$50k+`, `Custom discussion`).
  - *Step 5 (Lead Capture)*: Captures name, email, phone/WhatsApp, and optional brief notes; instantly persists data into the database and confirms submission.
- **Contextual WhatsApp Direct Connect**: Every service card and conversion point includes one-click WhatsApp routing with pre-populated message intents (e.g., `https://wa.me/905013617795?text=Hi! I'm interested in a Custom AI Tool.`), minimizing friction for GCC clients who favor messaging apps over traditional email.
- **Newsletter Subscription Funnel**: An automated subscription component for capturing long-tail leads interested in tech insights and automation trends.

### 3.3 Product-Led Growth: The Mini-Apps Ecosystem
WebKMT provides free, functional tools directly on the site, demonstrating technical competence while capturing user registrations:
- **KMT Link**: A complete bio-link platform (competing with Linktree) that lets users register, build customized multi-link mobile landing pages, generate QR codes, and publish under public vanity URLs (`link.webkmt.com/:username`).
- **Website Analyzer**: Instant automated auditing tool evaluating any website's SEO health, speed metrics, mobile optimization, and accessibility, complete with actionable technical fixes and an upsell prompt for WebKMT optimization services.
- **ROI Calculator**: Interactive financial modeling tool allowing business owners to input monthly visitors, conversion rates, average order values, and marketing spend to calculate projected financial returns across web overhauls, SEO, and paid campaigns.
- **Color Palette Studio**: Brand design harmony generator providing monochromatic, analogous, triadic, and complementary palettes with one-click export to CSS variables, JSON, and Adobe palettes.
- **Social Media Scheduler**: Visual campaign calendar simulation illustrating WebKMT's automation capabilities for cross-platform marketing teams.

### 3.4 Deep-Dive Case Studies & Social Proof
- Dynamic dedicated Case Study presentation system (`case-study.html?id=X`) presenting granular project breakdowns:
  1. **Next-Gen Corporate ERP**: 52% efficiency boost, 60% reduction in manual data entry, and $2.3M annual cost savings for a manufacturing enterprise.
  2. **Al-Wadi Premium Saudi Poultry E-Commerce**: End-to-end halal e-commerce platform with IoT cold-chain temperature monitoring, serving 50,000+ active users with a 300% surge in online sales.
  3. **Coffee Jadla Brand Identity**: Complete packaging, Arabic typography, and interior retail design featured in Saudi Design Week 2024.
  4. **AI-Powered Multi-Platform Content CMS**: Multi-channel distribution platform with automated posting schedules and 400% content engagement growth.
- **Client Testimonial Carousel**: Bilingual testimonials with client ratings and credentials.

---

## 4. Technical Features & Implementation

### 4.1 Frontend Engineering
- **Vanilla Modern JavaScript Architecture**: Built without heavy framework dependencies (React/Vue/Angular on the main landing page), eliminating hydration overhead and enabling ultra-fast initial page loads.
- **Centralized Initialization Manager (`InitializationManager`)**: Enforces deterministic, asynchronous dependency loading to eliminate race conditions across 16 modular subsystems (`supabase-config`, `auth-manager`, `language-manager`, `performance-utils`, `ui-enhancements`, `portfolio`, `chatbot`, `blog-manager`, etc.).
- **Glassmorphism Design System**:
  - Layered CSS variables with translucent card backgrounds (`backdrop-filter: blur(12px)`).
  - Ambient particle animations in the hero viewport.
  - Native dark/light mode toggle with pre-render script execution in `<head>` to prevent Flash of Unstyled Content (FOUC).
  - Modularized stylesheet structure (`main-bundle.css`, `components-bundle.css`, `portfolio-bundle.css`, `forms-auth-bundle.css`, `mini-apps-integrated.css`, `responsive-fixes.css`).
- **Internationalization (i18n) Engine (`LanguageManager`)**:
  - Full bidirectional support (`ltr` and `rtl`).
  - Seamless English / Arabic switching without page reload via `data-i18n` attribute scanning and DOM string replacement.
  - Typographic pairing: `Inter` and system sans-serif for Latin scripts; Google Fonts `Cairo` and `Noto Sans Arabic` for Arabic scripts.

### 4.2 Backend & API Architecture (Node.js & Express)
- **Dynamic Configuration Endpoint (`/js/supabase-config.js`)**: The backend dynamically serves client-side Supabase configuration directly from server environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`), ensuring configuration agility between local, staging, and production environments.
- **Vanity Bio-Link Dynamic Router (`/:username`)**: Express catches incoming wildcard slugs, checks the Supabase `kmtlink_profiles` database for public profile existence, and serves the rendered bio-link profile page (`mini-apps/kmtlink-public-profile.html`) with zero external redirects.
- **External Analysis Proxies (`/api/mini-apps/*`)**:
  - Real-time SEO auditing (`seo-analyzer.js`) via HTML parsing (`cheerio`) to analyze meta tags, headers, OpenGraph, Twitter cards, and image alt tags.
  - Real-time website speed benchmark runner (`speed-tester.js`).
- **Health Check & Diagnostics (`/api/health`)**: Reports server status, timestamp, Node environment, and active database connection state.

### 4.3 Database Architecture & Security (Supabase / PostgreSQL)
The platform utilizes a structured relational database with PostgreSQL Row Level Security (RLS) enforcing strict tenant separation:
- `public.profiles`: Extends `auth.users` with `user_role` (`admin` / `user`), `user_plan` (`free` / `premium`), user preferences (JSONB), and timestamps. Includes an auto-trigger on new authentication signups.
- `public.blogs`: Full CMS schema supporting title, slug, Markdown/HTML content, excerpt, category, tags array, featured image, read time, and publishing status.
- `public.kmtlink_profiles`: Bio-link user configurations storing username, display name, bio, profile image, links schema (JSONB), visual theme customizations (JSONB), and analytics counters.
- `public.contacts`: Multi-step quote briefs, contact inquiries, source attribution, read/replied flags, and client metadata.
- `public.newsletter`: Email subscriber registry with source tracking and active status.
- `public.mini_app_sessions`: Session cache storing tool inputs, generated outputs, and completion metrics.
- **Security-Definer Function (`is_admin()`)**: PostgreSQL stored procedure validating whether the requesting authenticated JWT belongs to an admin role, bypassing circular RLS dependencies.

### 4.4 Artificial Intelligence: Google Gemini Integration
- **Server-Side AI Proxy (`/api/gemini-chat`)**: Routes chatbot conversations securely through the Node server to Google's Gemini 1.5 Flash API (`gemini-1.5-flash-001:generateContent`), keeping API credentials strictly isolated from the client.
- **Context-Aware Chatbot Widget (`ChatBot`)**:
  - Floating glassmorphism conversation UI.
  - Pre-seeded with a comprehensive corporate knowledge base covering WebKMT's service definitions, process, contact information, and tech capabilities.
  - Multi-language awareness (responds dynamically in English or Arabic based on user language).
  - Conversation context windowing with history management.
  - Safety thresholds and input length constraints.

### 4.5 Security Hardening & Threat Mitigation
- **Content Security Policy (CSP) via Helmet.js**: Explicit whitelisting of trusted scripts (`cdn.jsdelivr.net`, Google Analytics), styles, font sources, and connect endpoints (`*.supabase.co`, `wss://*.supabase.co`).
- **Multi-Tier Rate Limiting (`express-rate-limit`)**:
  - General API Limiter: 100 requests per 15-minute window per IP.
  - Auth Limiter: 5 failed attempts per 15 minutes to prevent brute-force attacks.
  - Tool Limiter: 10 requests per 15 minutes for computational mini-app endpoints.
- **SSRF & Private Network Defense**: The mini-app URL analyzer explicitly blocks private IP ranges (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`) to prevent Server-Side Request Forgery attacks.
- **Automated Input Sanitization Middleware**: Intercepts all incoming `POST`, `PUT`, and `PATCH` payloads, stripping malicious `<script>` tags, inline `javascript:` pseudo-protocols, and `on*` event handlers.
- **CORS Restrictions**: Strict origin filtering permitting requests exclusively from approved WebKMT production and staging origins.

### 4.6 Operations Management & Admin Dashboard
When authenticated with an administrative account (e.g., `info@webkmt.com`), an in-page administrative dashboard unlocks:
- **Tab 1: Blog CMS**: Full publishing interface with live preview, auto-slug generation, category assignments, draft/published toggling, and rich formatting.
- **Tab 2: Leads Viewer**: Real-time table displaying incoming quote requests from the 5-step wizard, contact form submissions, timestamps, contact details, and project budgets.
- **Tab 3: User Directory**: Overview of registered platform users, email addresses, joined dates, and assigned plan tiers.

### 4.7 Performance & PWA Architecture
- **Service Worker (`sw.js`)**: Implements advanced caching strategies:
  - *Cache-First*: Static JS/CSS bundles (30-day cache) and media assets/images (7-day cache).
  - *Network-First*: Dynamic API endpoints and database operations.
- **HTTP Compression**: Gzip/Brotli compression middleware (`compression`) active on all responses.
- **Asset Optimization**: SVG icons used inline to avoid HTTP roundtrips; external web fonts preconnected with `crossorigin`.

---

## 5. Technology Stack Summary

| Layer | Technologies / Libraries |
| :--- | :--- |
| **Frontend Core** | Vanilla JavaScript (ES6+ Modules), HTML5 (Semantic), CSS3 (Custom Variables, Flexbox, CSS Grid) |
| **Styling & Effects** | Glassmorphism UI, Responsive Bundles, CSS Keyframe Animations |
| **Typography** | `Cairo`, `Noto Sans Arabic`, `Inter`, System UI Sans-serif |
| **Backend Runtime** | Node.js (>=16.0.0), Express.js 4.18 |
| **Database & Auth** | Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth JS SDK v2) |
| **AI Engine** | Google Gemini 1.5 Flash (`@google/generative-ai` / REST API via server proxy) |
| **Security & Middleware** | Helmet.js 7.0, express-rate-limit 6.8, CORS 2.8, Custom XSS Sanitizer |
| **Parsing & Utilities** | Cheerio 1.0 (HTML parsing for analyzer), node-fetch 3.3, dotenv 16.3 |
| **Deployment & Ops** | PM2 (`ecosystem.config.js`), Nginx Reverse Proxy, SSL / HTTPS, PWA Service Worker |

---

## 6. Project Directory Reference

```
web-kemet/
├── index.html                     # Primary high-performance landing page
├── case-study.html                # Dynamic case study viewer (?id=1..4)
├── package.json                   # Dependencies and npm scripts
├── ecosystem.config.js            # PM2 process manager configuration
├── sw.js                          # Service worker caching engine
│
├── api/                           # Specialized API services
│   └── mini-apps/                 # SEO & performance analysis engines
│
├── css/                           # Modular stylesheets
│   ├── main-bundle.css            # Base layouts, resets, variables
│   ├── components-bundle.css      # Reusable buttons, cards, modals
│   ├── portfolio-bundle.css       # Portfolio grids and lightboxes
│   ├── forms-auth-bundle.css      # Auth and multi-step forms
│   ├── mini-apps-integrated.css   # Mini-app modal & container styles
│   ├── hero-enhanced.css          # Hero particles & grid styles
│   ├── blog-dynamic.css           # Insights grid & blog reading styles
│   └── admin-blog.css             # Operations dashboard & CMS styles
│
├── js/                            # Client-side JavaScript modules
│   ├── initialization-manager.js  # Load-order coordinator & event bus
│   ├── main.js                    # Application lifecycle orchestrator
│   ├── supabase-config.js         # Client Supabase configuration loader
│   ├── auth-ui.js                 # Modal authentication controller
│   ├── chatbot.js                 # Gemini AI assistant widget
│   ├── portfolio-simple.js        # Portfolio data & lightbox controller
│   ├── blog-manager.js            # Admin CMS & blog loader
│   ├── admin-dashboard.js         # Admin dashboard tab controller
│   ├── forms-enhanced.js          # Multi-step quote form logic
│   ├── mini-apps-integrated.js    # Mini-apps iframe & modal integration
│   ├── shared/
│   │   └── supabase-auth-manager.js # Auth state subscriber & session manager
│   └── modules/
│       └── language-manager.js    # English/Arabic i18n & RTL switcher
│
├── mini-apps/                     # Standalone interactive web tools
│   ├── kmtlink-simple.html        # Bio-link page builder
│   ├── kmtlink-public-profile.html# Rendered public vanity bio-links
│   ├── website-analyzer.html      # SEO & accessibility audit tool
│   ├── roi-calculator.html        # Multi-channel marketing ROI calculator
│   ├── color-palette.html         # Brand color scheme generator
│   └── social-scheduler.html      # Social media campaign planner
│
├── server/                        # Express.js backend application
│   ├── app.js                     # Server entry point & route definitions
│   ├── config/supabase.js         # Supabase client with service role key
│   ├── middleware/                # Security, logging, and error handlers
│   └── routes/                    # API endpoints (auth, data, contact, gemini)
│
├── supabase/                      # Database configuration
│   └── schema.sql                 # PostgreSQL DDL, enums, tables, and RLS rules
│
└── locales/                       # Bilingual translation dictionaries
    ├── en.json                    # English translations
    └── ar.json                    # Arabic translations
```

