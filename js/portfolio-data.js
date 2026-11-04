/**
 * WEBKMT portfolio/product-proof data — single source of truth
 * -------------------------------------------------------------
 * Used by the homepage cards (js/portfolio-simple.js) and the product
 * overview page (case-study.html). Keep claims aligned to Knowledge Pack
 * v0.8: no client identities, testimonials, ratings, invented metrics or
 * “live demo” labels. Thumbnails are abstract SVG product diagrams.
 */
window.WEBKMT_PORTFOLIO_DATA = [
  {
    "id": 1,
    "category": "systems",
    "title": {
      "en": "WEBKMT ERP — Guided System Overview",
      "ar": "WEBKMT ERP — نظرة موجّهة إلى النظام"
    },
    "client": {
      "en": "WEBKMT product · Scoped implementation",
      "ar": "منتج WEBKMT · تنفيذ حسب النطاق"
    },
    "description": {
      "en": "A complete business system for finance, inventory, sales/CRM, people and operations. This is a guided product overview, not a client case study or self-service live demo.",
      "ar": "نظام أعمال متكامل للمالية والمخزون والمبيعات/CRM والأشخاص والعمليات. هذه نظرة موجّهة إلى المنتج، وليست دراسة حالة عميل أو عرضاً حياً ذاتياً."
    },
    "duration": {
      "en": "Scoped implementation",
      "ar": "تنفيذ حسب النطاق"
    },
    "year": {
      "en": "2026",
      "ar": "2026"
    },
    "challenge": {
      "en": "Small businesses often run on spreadsheets, notebooks and disconnected apps, so invoices, stock and customer records drift apart.",
      "ar": "تعمل كثير من الشركات الصغيرة عبر جداول ودفاتر وتطبيقات منفصلة، فتتشتت الفواتير والمخزون وسجلات العملاء."
    },
    "solution": {
      "en": "WEBKMT configures the system around the client’s accounts, warehouses, users, items and workflows, then supports it under the selected care tier.",
      "ar": "تهيئ WEBKMT النظام حول حسابات العميل ومستودعاته ومستخدميه وأصنافه وسير عمله، ثم تدعمه وفق فئة الرعاية المختارة."
    },
    "results": {
      "en": "What to inspect: module scope, Arabic/English interface, care boundaries and the data preparation needed before go-live. Country e-invoicing, including ZATCA, is scoped only after the merchant’s requirements are validated.",
      "ar": "ما يجب فحصه: نطاق الوحدات، الواجهة العربية/الإنجليزية، حدود الرعاية، وتجهيز البيانات قبل الإطلاق. ولا يُحدَّد نطاق الفوترة الإلكترونية المحلية، بما فيها ZATCA، إلا بعد التحقق من متطلبات التاجر."
    },
    "features": {
      "en": [
        "Accounting & invoicing",
        "Inventory & warehouses",
        "Sales, CRM & purchasing",
        "HR & projects where scoped",
        "Arabic/English with RTL support",
        "Updates & backups by care tier"
      ],
      "ar": [
        "المحاسبة والفوترة",
        "المخزون والمستودعات",
        "المبيعات وCRM والمشتريات",
        "الموارد البشرية والمشاريع حسب النطاق",
        "العربية/الإنجليزية مع دعم RTL",
        "التحديثات والنسخ الاحتياطي حسب فئة الرعاية"
      ]
    },
    "services": {
      "en": [
        "Discovery & scope",
        "Configuration",
        "Data preparation",
        "Training & care"
      ],
      "ar": [
        "الاستكشاف وتحديد النطاق",
        "التهيئة",
        "تجهيز البيانات",
        "التدريب والرعاية"
      ]
    },
    "teamSize": {
      "en": "Configured per client",
      "ar": "يُهيأ لكل عميل"
    },
    "platform": {
      "en": "Guided walkthrough",
      "ar": "جولة موجّهة"
    },
    "thumbnail": "assets/portfolio/webkmt-erp-overview.svg",
    "liveUrl": null,
    "caseStudyUrl": "case-study.html?id=1",
    "technologies": [
      "Accounting & invoicing",
      "Inventory & warehouses",
      "Arabic/English with RTL",
      "Care by workload"
    ]
  },
  {
    "id": 2,
    "category": "automation",
    "title": {
      "en": "WEBKMT Chat — Pilot Receptionist",
      "ar": "WEBKMT Chat — موظف الاستقبال التجريبي"
    },
    "client": {
      "en": "WEBKMT product · Pilot deployments",
      "ar": "منتج WEBKMT · نشر تجريبي"
    },
    "description": {
      "en": "An Arabic/English website and WhatsApp receptionist: instant acknowledgement, answers from approved information, qualification, consented contact capture and human handoff.",
      "ar": "موظف استقبال للموقع وواتساب بالعربية والإنجليزية: تأكيد فوري، وإجابات من معلومات معتمدة، وتأهيل، والتقاط بيانات بالموافقة، وتسليم بشري."
    },
    "duration": {
      "en": "Pilot deployments",
      "ar": "نشر تجريبي"
    },
    "year": {
      "en": "2026",
      "ar": "2026"
    },
    "challenge": {
      "en": "Service businesses lose enquiries when WhatsApp and website messages wait until staff are available.",
      "ar": "تخسر شركات الخدمات استفسارات عندما تنتظر رسائل واتساب والموقع حتى يتاح الفريق."
    },
    "solution": {
      "en": "WEBKMT is deploying the service first for itself through a controlled pilot path. Answers stay grounded in approved tenant information; appointment requests are captured for human confirmation in the current pilot scope.",
      "ar": "تنشر WEBKMT الخدمة أولاً لنفسها عبر مسار تجريبي مضبوط. وتبقى الإجابات مبنية على معلومات المستأجر المعتمدة؛ وتُجمع طلبات المواعيد لتأكيد بشري في النطاق التجريبي الحالي."
    },
    "results": {
      "en": "What to inspect: the response loop, approved-knowledge boundary and escalation path. This is not presented as a finished client deployment or a public self-service live demo.",
      "ar": "ما يجب فحصه: حلقة الاستجابة، وحدود المعرفة المعتمدة، ومسار التصعيد. ولا يُقدَّم هذا كنشر عميل منتهٍ أو عرض حي عام ذاتي."
    },
    "features": {
      "en": [
        "Instant acknowledgement",
        "Approved-information answers",
        "Lead qualification",
        "Consented contact capture",
        "Human escalation",
        "Arabic + English"
      ],
      "ar": [
        "تأكيد استلام فوري",
        "إجابات من معلومات معتمدة",
        "تأهيل العملاء المحتملين",
        "التقاط بيانات التواصل بالموافقة",
        "تصعيد بشري",
        "العربية + الإنجليزية"
      ]
    },
    "services": {
      "en": [
        "Knowledge setup",
        "Workflow configuration",
        "Pilot review",
        "Fair-use operation"
      ],
      "ar": [
        "إعداد المعرفة",
        "تهيئة سير العمل",
        "مراجعة النشر التجريبي",
        "التشغيل ضمن الاستخدام العادل"
      ]
    },
    "teamSize": {
      "en": "One business per standard plan",
      "ar": "نشاط واحد في الخطة القياسية"
    },
    "platform": {
      "en": "Website + WhatsApp",
      "ar": "الموقع + واتساب"
    },
    "thumbnail": "assets/portfolio/webkmt-chat-pilot.svg",
    "liveUrl": null,
    "caseStudyUrl": "case-study.html?id=2",
    "technologies": [
      "WhatsApp",
      "Website chat",
      "Approved knowledge",
      "Human handoff"
    ]
  },
  {
    "id": 3,
    "category": "websites",
    "title": {
      "en": "WEBKMT Websites — Template Gallery",
      "ar": "WEBKMT Websites — معرض القوالب"
    },
    "client": {
      "en": "Available now",
      "ar": "متاح الآن"
    },
    "description": {
      "en": "Browse ready-made business designs and choose files only, customized files or Ultimate. After full payment, the purchased template is yours, subject to third-party component licences.",
      "ar": "تصفح تصاميم أعمال جاهزة واختر الملفات فقط أو ملفات مخصصة أو الخطة الشاملة. وبعد السداد الكامل يصبح القالب المشترى لك، مع بقاء مكونات الطرف الثالث تحت تراخيصها."
    },
    "duration": {
      "en": "Files within 2 days",
      "ar": "الملفات خلال يومين"
    },
    "year": {
      "en": "2026",
      "ar": "2026"
    },
    "challenge": {
      "en": "Many SMBs know they need a website but cannot judge the result from a blank proposal.",
      "ar": "تعرف كثير من الشركات الصغيرة أنها تحتاج موقعاً، لكنها لا تستطيع تقييم النتيجة من عرض فارغ."
    },
    "solution": {
      "en": "The gallery organizes designs by business type, while one shared three-plan model keeps price, delivery and ownership clear.",
      "ar": "ينظم المعرض التصاميم حسب نوع النشاط، بينما يبقي نموذج الخطط الثلاث المشترك السعر والتسليم والملكية واضحة."
    },
    "results": {
      "en": "What to inspect: the current designs, the three plan boundaries and the payment/ownership terms before ordering.",
      "ar": "ما يجب فحصه: التصاميم الحالية، وحدود الخطط الثلاث، وشروط الدفع والملكية قبل الطلب."
    },
    "features": {
      "en": [
        "Plan 1 · USD 150 files only",
        "Plan 2 · USD 300–799 customized files",
        "Plan 3 · USD 800–1,599 Ultimate",
        "Template ownership after full payment",
        "Arabic/English-ready structure",
        "Business-type filters"
      ],
      "ar": [
        "الخطة الأولى · 150 دولاراً للملفات فقط",
        "الخطة الثانية · 300–799 دولاراً لملفات مخصصة",
        "الخطة الثالثة · 800–1,599 دولاراً للشاملة",
        "ملكية القالب بعد السداد الكامل",
        "بنية جاهزة للعربية والإنجليزية",
        "فلاتر حسب نوع النشاط"
      ]
    },
    "services": {
      "en": [
        "Template selection",
        "Customization",
        "Content writing in Ultimate",
        "Hosting in Ultimate"
      ],
      "ar": [
        "اختيار القالب",
        "التخصيص",
        "كتابة المحتوى في الشاملة",
        "الاستضافة في الشاملة"
      ]
    },
    "teamSize": {
      "en": "Design catalogue",
      "ar": "كتالوج تصاميم"
    },
    "platform": {
      "en": "Online gallery",
      "ar": "معرض إلكتروني"
    },
    "thumbnail": "assets/portfolio/webkmt-websites-gallery.svg",
    "liveUrl": "/templates",
    "caseStudyUrl": "case-study.html?id=3",
    "technologies": [
      "Responsive web",
      "Arabic/English-ready",
      "WhatsApp enquiry paths"
    ]
  },
  {
    "id": 4,
    "category": "websites",
    "title": {
      "en": "WEBKMT Platform — Website, Tools & Profile",
      "ar": "منصة WEBKMT — الموقع والأدوات والملف التعريفي"
    },
    "client": {
      "en": "WEBKMT’s own public platform",
      "ar": "منصة WEBKMT العامة"
    },
    "description": {
      "en": "The website you are browsing: bilingual product information, working free tools, accounts and a downloadable business profile.",
      "ar": "الموقع الذي تتصفحه: معلومات منتجات ثنائية اللغة، وأدوات مجانية عاملة، وحسابات، وملف تعريفي قابل للتنزيل."
    },
    "duration": {
      "en": "Public website",
      "ar": "موقع عام"
    },
    "year": {
      "en": "2026",
      "ar": "2026"
    },
    "challenge": {
      "en": "An agency website can claim expertise without giving visitors anything real to evaluate.",
      "ar": "يمكن لموقع وكالة أن يدّعي الخبرة دون إعطاء الزوار شيئاً حقيقياً لتقييمه."
    },
    "solution": {
      "en": "WEBKMT publishes working tools and current product information so visitors can inspect the platform before starting a sales conversation.",
      "ar": "تنشر WEBKMT أدوات عاملة ومعلومات منتجات حالية كي يفحص الزوار المنصة قبل بدء محادثة بيع."
    },
    "results": {
      "en": "What to inspect: the Website Analyzer, ROI Calculator, Colour Palette, KMT Link and the 2026 business profile.",
      "ar": "ما يجب فحصه: محلل المواقع، وحاسبة العائد، ولوحة الألوان، وKMT Link، والملف التعريفي لعام 2026."
    },
    "features": {
      "en": [
        "Free Website Analyzer",
        "Free ROI Calculator",
        "Colour Palette",
        "KMT Link",
        "Bilingual EN/AR",
        "Business Profile PDF"
      ],
      "ar": [
        "محلل مواقع مجاني",
        "حاسبة عائد مجانية",
        "لوحة الألوان",
        "KMT Link",
        "ثنائي اللغة EN/AR",
        "ملف PDF تعريفي"
      ]
    },
    "services": {
      "en": [
        "Product information",
        "Free tools",
        "Lead capture",
        "Business profile"
      ],
      "ar": [
        "معلومات المنتجات",
        "الأدوات المجانية",
        "التقاط العملاء المحتملين",
        "الملف التعريفي"
      ]
    },
    "teamSize": {
      "en": "WEBKMT platform",
      "ar": "منصة WEBKMT"
    },
    "platform": {
      "en": "This website",
      "ar": "هذا الموقع"
    },
    "thumbnail": "assets/portfolio/webkmt-platform-tools.svg",
    "liveUrl": "/#mini-apps",
    "caseStudyUrl": "case-study.html?id=4",
    "technologies": [
      "Bilingual website",
      "Free working tools",
      "Customer accounts",
      "Business profile"
    ]
  }
];
