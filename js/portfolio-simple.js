/**
 * Simple Portfolio System
 * Features: Basic portfolio display with modal functionality
 */

class SimplePortfolioManager {
  constructor() {
    console.log('🔨 SimplePortfolioManager constructor called');
    
    this.portfolioData = [];
    this.modal = null;
    this.modalTitle = null;
    this.modalImage = null;
    this.modalDescription = null;
    this.modalTechnologies = null;
    this.modalDuration = null;
    
    console.log('🔨 Calling init()...');
    this.init();
    console.log('✅ Constructor completed');
  }

  async init() {
    console.log('🔧 init() called');

    // Wait a bit to ensure DOM is fully ready
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      console.log('📊 Loading portfolio data...');
      this.loadPortfolioData();

      console.log('🎯 Setting up elements...');
      this.setupElements();

      // Test modal is accessible
      console.log('🧪 Portfolio modal test - Modal found:', !!this.modal);
      console.log('🧪 Portfolio grid found:', !!this.portfolioGrid);
      if (this.modal) {
        console.log('🧪 Modal ID:', this.modal.id);
        console.log('🧪 Modal classes:', this.modal.className);
      } else {
        console.error('🧪 Modal element not found during initialization!');
      }

      console.log('🔗 Setting up event listeners...');
      this.setupEventListeners();

      console.log('🎨 Rendering portfolio...');
      this.renderPortfolio();

      // Verify cards were created
      const cards = this.portfolioGrid?.children.length || 0;
      console.log('✅ Portfolio cards created:', cards);

      console.log('✅ Simple Portfolio Manager initialized successfully');
      console.log('✅ Portfolio data length:', this.portfolioData.length);
      console.log('✅ Modal element:', this.modal);
    } catch (error) {
      console.error('❌ Portfolio initialization failed:', error);
      console.error('❌ Error stack:', error.stack);
      this.showError('Failed to load portfolio');
    }
  }

  loadPortfolioData() {
    // Load all testimonials for carousel
    this.testimonialsData = [
      {
        quote: "We're onboarding a small number of pilot businesses right now: free setup on our Website, WhatsApp Receptionist, and Business OS packages — you only cover the monthly care plan, in exchange for honest feedback and a testimonial when you're happy.",
        author: "WebKMT Pilot Program",
        position: "Limited spots — apply on WhatsApp",
        avatar: "assets/logo-white.svg"
      }
    ];
    
    this.currentTestimonialIndex = 0;

    this.portfolioData = [
      {
            "id": 1,
            "category": "systems",
            "title": {
                  "en": "Kemet Business OS — ERP Live Demo",
                  "ar": "نظام كيميت للأعمال — عرض حي لنظام ERP"
            },
            "client": {
                  "en": "Demo System — WebKMT Product",
                  "ar": "نظام تجريبي — منتج WebKMT"
            },
            "description": {
                  "en": "A complete business management system — accounting, invoicing, inventory, POS, and HR — installed and pre-configured for small and mid-sized businesses. Everything Odoo does, with one flat monthly fee and unlimited users instead of per-seat pricing.",
                  "ar": "نظام متكامل لإدارة الأعمال — المحاسبة والفوترة والمخزون ونقاط البيع والموارد البشرية — يُثبَّت ويُهيَّأ مسبقاً للشركات الصغيرة والمتوسطة. كل ما يفعله Odoo، لكن برسم شهري ثابت واحد ومستخدمين بلا حدود بدلاً من التسعير لكل مستخدم."
            },
            "duration": {
                  "en": "Live Demo",
                  "ar": "عرض حي"
            },
            "year": {
                  "en": "2026",
                  "ar": "2026"
            },
            "challenge": {
                  "en": "Small businesses run on Excel files, notebooks, and disconnected apps — invoices get lost, stock counts drift, and owners can't see their numbers until it's too late.",
                  "ar": "تدير الشركات الصغيرة أعمالها عبر ملفات Excel ودفاتر ورقية وتطبيقات منفصلة — تضيع الفواتير، وتختلف أعداد المخزون، ولا يرى أصحاب العمل أرقامهم إلا بعد فوات الأوان."
            },
            "solution": {
                  "en": "Kemet Business OS bundles the proven open-source ERPNext with WebKMT's industry starter kits, simplified per-role screens, and WhatsApp notifications for invoices, stock alerts, and a nightly sales summary to the owner.",
                  "ar": "يجمع نظام كيميت للأعمال نظام ERPNext مفتوح المصدر المجرَّب مع حزم البدء المصممة لكل نشاط من WebKMT، وشاشات مبسطة حسب دور كل موظف، وإشعارات واتساب للفواتير وتنبيهات المخزون وملخص المبيعات الليلي للمالك."
            },
            "results": {
                  "en": "What you get: flat monthly pricing with unlimited users, an Arabic/Turkish/English interface, ZATCA-ready e-invoicing for Saudi businesses, and your data hosted on your own server.",
                  "ar": "ما ستحصل عليه: رسم شهري ثابت مع مستخدمين بلا حدود، وواجهة بالعربية والتركية والإنجليزية، وفوترة إلكترونية جاهزة لمتطلبات ZATCA في السعودية، وبياناتك مستضافة على خادمك الخاص."
            },
            "features": {
                  "en": [
                        "Invoicing & accounting",
                        "Inventory & multi-warehouse",
                        "Point of sale (POS)",
                        "HR & payroll",
                        "WhatsApp invoice & stock alerts",
                        "Arabic / Turkish / English"
                  ],
                  "ar": [
                        "الفوترة والمحاسبة",
                        "المخزون والمستودعات المتعددة",
                        "نقاط البيع",
                        "الموارد البشرية والرواتب",
                        "تنبيهات الفواتير والمخزون عبر واتساب",
                        "العربية / التركية / الإنجليزية"
                  ]
            },
            "thumbnail": "assets/portfolio/project-1.png",
            "liveUrl": "/templates",
            "technologies": [
                  "ERPNext",
                  "Frappe",
                  "MariaDB",
                  "Redis",
                  "Docker",
                  "WhatsApp API"
            ]
      },
      {
            "id": 2,
            "category": "automation",
            "title": {
                  "en": "WhatsApp AI Receptionist — Live Demo",
                  "ar": "موظف استقبال واتساب الذكي — عرض حي"
            },
            "client": {
                  "en": "Demo System — Clinic Booking",
                  "ar": "نظام تجريبي — حجوزات العيادات"
            },
            "description": {
                  "en": "An AI receptionist that answers customers on WhatsApp and your website around the clock, explains your services and prices, books appointments into a real calendar, and sends reminders — with a shared inbox where your team can take over anytime.",
                  "ar": "موظف استقبال بالذكاء الاصطناعي يرد على العملاء عبر واتساب وموقعك على مدار الساعة، يشرح خدماتك وأسعارك، يحجز المواعيد في تقويم حقيقي، ويرسل التذكيرات — مع صندوق وارد مشترك يستطيع فريقك التدخل فيه في أي وقت."
            },
            "duration": {
                  "en": "Live Demo",
                  "ar": "عرض حي"
            },
            "year": {
                  "en": "2026",
                  "ar": "2026"
            },
            "challenge": {
                  "en": "Clinics, salons, and service businesses lose bookings every day to missed calls and WhatsApp messages that go unanswered outside working hours.",
                  "ar": "تخسر العيادات والصالونات وشركات الخدمات حجوزات كل يوم بسبب المكالمات الفائتة ورسائل واتساب التي لا يُرد عليها خارج ساعات العمل."
            },
            "solution": {
                  "en": "We train an AI assistant on the business's own services, prices, and FAQs, connect it to WhatsApp and the website chat, and wire bookings and reminders through automation workflows.",
                  "ar": "ندرّب مساعداً ذكياً على خدمات نشاطك وأسعاره وأسئلته الشائعة، ونربطه بواتساب ومحادثة الموقع، ونوصل الحجوزات والتذكيرات عبر تدفقات أتمتة."
            },
            "results": {
                  "en": "What you get: instant replies 24/7 in Arabic, Turkish, and English; automatic bookings and reminders; and every lead captured into one inbox — no customer message left unanswered.",
                  "ar": "ما ستحصل عليه: ردود فورية على مدار الساعة بالعربية والتركية والإنجليزية، وحجوزات وتذكيرات تلقائية، وكل عميل محتمل يُسجَّل في صندوق وارد واحد — لا رسالة عميل دون رد."
            },
            "features": {
                  "en": [
                        "24/7 WhatsApp & website answers",
                        "Appointment booking & reminders",
                        "Trained on your prices & FAQs",
                        "Shared team inbox",
                        "Human handoff anytime",
                        "Arabic / Turkish / English"
                  ],
                  "ar": [
                        "ردود واتساب والموقع على مدار الساعة",
                        "حجز المواعيد والتذكيرات",
                        "مدرَّب على أسعارك وأسئلتك الشائعة",
                        "صندوق وارد مشترك للفريق",
                        "تحويل لموظف بشري في أي وقت",
                        "العربية / التركية / الإنجليزية"
                  ]
            },
            "thumbnail": "assets/portfolio/project-2.png",
            "liveUrl": "https://wa.me/905013617795?text=Hi! I would like to see the WhatsApp AI Receptionist live demo.",
            "technologies": [
                  "WhatsApp Cloud API",
                  "Chatwoot",
                  "AnythingLLM (RAG)",
                  "n8n",
                  "Cal.com"
            ]
      },
      {
            "id": 3,
            "category": "websites",
            "title": {
                  "en": "KMT Link — Link-in-Bio Platform",
                  "ar": "KMT Link — منصة صفحة الروابط"
            },
            "client": {
                  "en": "Live Product — Free to Use",
                  "ar": "منتج حي — مجاني للاستخدام"
            },
            "description": {
                  "en": "Our own free link-in-bio platform: one page for all your links with your name on it — link.webkmt.com/you. Built for creators, Instagram sellers, and small businesses that live on social media.",
                  "ar": "منصتنا المجانية لصفحة الروابط: صفحة واحدة لكل روابطك باسمك — link.webkmt.com/اسمك. مصممة للمبدعين وبائعي إنستغرام والشركات الصغيرة التي تعيش على وسائل التواصل."
            },
            "duration": {
                  "en": "Free Tool",
                  "ar": "أداة مجانية"
            },
            "year": {
                  "en": "2025",
                  "ar": "2025"
            },
            "challenge": {
                  "en": "Businesses on Instagram and TikTok can only share one link, so customers struggle to find their WhatsApp, location, menu, and store.",
                  "ar": "لا تستطيع الأنشطة على إنستغرام وتيك توك مشاركة سوى رابط واحد، فيجد العملاء صعوبة في الوصول إلى واتساب والموقع والقائمة والمتجر."
            },
            "solution": {
                  "en": "KMT Link gives every user a fast, customizable profile page with unlimited links, themes, QR codes, and click analytics — free, with an optional done-for-you setup.",
                  "ar": "تمنح KMT Link كل مستخدم صفحة ملف سريعة وقابلة للتخصيص مع روابط غير محدودة وقوالب ورموز QR وتحليلات للنقرات — مجاناً، مع خيار الإعداد الكامل نيابة عنك."
            },
            "results": {
                  "en": "Live and free to use today: create your page in minutes, share one link everywhere, and see exactly what your audience clicks.",
                  "ar": "متاح ومجاني اليوم: أنشئ صفحتك في دقائق، شارك رابطاً واحداً في كل مكان، واعرف بالضبط ما ينقر عليه جمهورك."
            },
            "features": {
                  "en": [
                        "Vanity URL: link.webkmt.com/you",
                        "Unlimited links & themes",
                        "QR code generator",
                        "Click analytics",
                        "Arabic & English interface",
                        "Free forever plan"
                  ],
                  "ar": [
                        "رابط مخصص: link.webkmt.com/اسمك",
                        "روابط وقوالب بلا حدود",
                        "مولّد رموز QR",
                        "تحليلات النقرات",
                        "يعمل بالعربية والإنجليزية",
                        "خطة مجانية للأبد"
                  ]
            },
            "thumbnail": "assets/portfolio/project-3.png",
            "liveUrl": "https://link.webkmt.com",
            "technologies": [
                  "Node.js",
                  "Express",
                  "Supabase",
                  "PostgreSQL",
                  "Vanilla JS"
            ]
      },
      {
            "id": 4,
            "category": "websites",
            "title": {
                  "en": "WebKMT Platform — This Website & Free Tools",
                  "ar": "منصة WebKMT — هذا الموقع وأدواته المجانية"
            },
            "client": {
                  "en": "Our Own Platform",
                  "ar": "منصتنا الخاصة"
            },
            "description": {
                  "en": "The website you're browsing right now: a bilingual (EN/AR) platform with user accounts, an AI assistant (Kemet), a blog, and a suite of free business tools — Website Analyzer, ROI Calculator, Color Palette Studio, and more.",
                  "ar": "الموقع الذي تتصفحه الآن: منصة ثنائية اللغة (EN/AR) مع حسابات مستخدمين ومساعد ذكاء اصطناعي (كيميت) ومدونة ومجموعة أدوات أعمال مجانية — محلل المواقع، وحاسبة العائد على الاستثمار، واستوديو الألوان، والمزيد."
            },
            "duration": {
                  "en": "Live Now",
                  "ar": "مباشر الآن"
            },
            "year": {
                  "en": "2026",
                  "ar": "2026"
            },
            "challenge": {
                  "en": "Most agency websites only claim expertise. We wanted visitors to experience working software before ever talking to us.",
                  "ar": "تدّعي معظم مواقع الوكالات الخبرة فقط. أردنا أن يجرّب الزوار برمجيات تعمل فعلاً قبل أن يتحدثوا إلينا."
            },
            "solution": {
                  "en": "We built our site as a product: production-grade mini-apps anyone can use free, an AI chatbot that answers from our own knowledge base, and a structured quote wizard connected to our lead flow.",
                  "ar": "بنينا موقعنا كمنتج: تطبيقات مصغرة بمستوى إنتاجي يمكن لأي شخص استخدامها مجاناً، وروبوت محادثة يجيب من قاعدة معرفتنا الخاصة، ومعالج عرض سعر منظم متصل بتدفق العملاء لدينا."
            },
            "results": {
                  "en": "Try everything on this page — run a free website audit, calculate your ROI, or chat with Kemet. It's the same engineering we install for clients.",
                  "ar": "جرّب كل شيء في هذه الصفحة — أجرِ تحليلاً مجانياً لموقعك، احسب عائد استثمارك، أو تحدث مع كيميت. إنها نفس الهندسة التي نثبّتها لعملائنا."
            },
            "features": {
                  "en": [
                        "5 free business mini-apps",
                        "Kemet AI assistant (Gemini)",
                        "Bilingual EN/AR with RTL",
                        "User accounts & admin dashboard",
                        "5-step project quote wizard",
                        "Blog & insights CMS"
                  ],
                  "ar": [
                        "5 تطبيقات أعمال مصغرة مجانية",
                        "مساعد كيميت الذكي (Gemini)",
                        "ثنائي اللغة EN/AR مع دعم RTL",
                        "حسابات مستخدمين ولوحة إدارة",
                        "معالج عرض سعر من 5 خطوات",
                        "مدونة ونظام إدارة محتوى"
                  ]
            },
            "thumbnail": "assets/portfolio/project-4.png",
            "liveUrl": "/#mini-apps",
            "technologies": [
                  "Node.js",
                  "Express",
                  "Supabase",
                  "Google Gemini",
                  "PWA"
            ]
      }
];
  }

  setupElements() {
    this.portfolioGrid = document.getElementById('portfolioGrid');
    this.modal = document.getElementById('portfolioModal');
    this.modalTitle = document.querySelector('.portfolio-modal__title');
    this.modalImage = document.getElementById('modalImage');
    this.modalDescription = document.querySelector('.modal-description-text');
    this.modalTechnologies = document.getElementById('technologiesGrid');
    this.modalDuration = document.querySelector('.modal-duration');
    
    // Action buttons
    this.liveWebsiteBtn = document.getElementById('liveWebsiteBtn');
    this.caseStudyBtn = document.getElementById('caseStudyBtn');
    this.shareProjectBtn = document.getElementById('shareProjectBtn');
    this.contactAboutProjectBtn = document.getElementById('contactAboutProject');

    if (!this.portfolioGrid) {
      throw new Error('Portfolio grid element not found');
    }
  }

  setupEventListeners() {
    // Portfolio item clicks
    document.querySelectorAll('.portfolio-card, .portfolio-item').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = card.dataset.project;
        if (projectId && this.portfolioData) {
          const project = this.portfolioData.find(p => p.id == projectId);
          if (project) {
            this.openModal(project);
          }
        }
      });
    });

    // Modal events - multiple fallback approaches
    if (this.modal) {
      // Method 1: Direct modal click handler
      this.modal.addEventListener('click', (e) => {
        console.log('🔧 Modal clicked, target:', e.target.className);
        
        // Handle backdrop click to close
        if (e.target === this.modal || e.target.classList.contains('portfolio-modal__backdrop')) {
          console.log('🔧 Backdrop clicked - closing modal');
          e.preventDefault();
          e.stopPropagation();
          this.closeModal();
          return;
        }
        
        // Handle close button click
        if (e.target.closest('.portfolio-modal__close')) {
          console.log('🔧 Close button clicked via closest!');
          e.preventDefault();
          e.stopPropagation();
          this.closeModal();
          return;
        }
      }, true); // Use capture phase
      
      // Method 2: Document-level event delegation for close buttons
      document.addEventListener('click', (e) => {
        if (e.target.closest('.portfolio-modal__close') && this.modal?.classList.contains('active')) {
          console.log('🔧 Close button clicked via document delegation!');
          e.preventDefault();
          e.stopPropagation();
          this.closeModal();
        }
      }, true);
    }

    // Action buttons
    if (this.liveWebsiteBtn) {
      this.liveWebsiteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLiveWebsiteClick();
      });
    }

    if (this.caseStudyBtn) {
      this.caseStudyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleCaseStudyClick();
      });
    }

    if (this.shareProjectBtn) {
      this.shareProjectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleShareProject();
      });
    }

    if (this.contactAboutProjectBtn) {
      this.contactAboutProjectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleContactAboutProject();
      });
    }

    // ENHANCED KEYBOARD NAVIGATION
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        console.log('🔧 Escape key pressed - closing modal');
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      }
    }, { capture: true });
  }

  renderPortfolio() {
    console.log('🎨 renderPortfolio() called');
    console.log('🎨 portfolioGrid exists:', !!this.portfolioGrid);
    console.log('🎨 portfolioData length:', this.portfolioData?.length || 0);

    if (!this.portfolioGrid) {
      console.error('❌ Portfolio grid not found during render');
      return;
    }

    this.portfolioGrid.innerHTML = '';

    // Mix portfolio cards with testimonial
    let cardIndex = 0;

    try {
      this.portfolioData.forEach((item, index) => {
        console.log(`🎨 Creating card ${index} for:`, item.title?.en || item.id);
        const card = this.createPortfolioCard(item, cardIndex);
        this.portfolioGrid.appendChild(card);
        cardIndex++;

        // Insert testimonial card after 2nd project
        if (index === 1) {
          console.log('🎨 Creating testimonial card');
          const testimonialCard = this.createTestimonialCard(cardIndex);
          this.portfolioGrid.appendChild(testimonialCard);
          cardIndex++;
        }
      });
      console.log('✅ Portfolio rendering completed, total cards:', this.portfolioGrid.children.length);
    } catch (error) {
      console.error('❌ Error during portfolio rendering:', error);
      this.showError('Error creating portfolio cards');
    }
  }

  createPortfolioCard(item, index) {
    const currentLang = this.getCurrentLanguage();
    const card = document.createElement('article');
    
    // More varied sizing with width variants
    const layoutPatterns = [
      { height: 'card-large', width: 'card-wide' },
      { height: 'card-small', width: 'card-normal' },
      { height: 'card-medium', width: 'card-narrow' },
      { height: 'card-medium', width: 'card-normal' },
      { height: 'card-large', width: 'card-normal' },
      { height: 'card-small', width: 'card-wide' }
    ];
    
    const layout = layoutPatterns[index % layoutPatterns.length];
    
    card.className = `portfolio-card-masonry ${layout.height} ${layout.width}`;
    card.dataset.category = item.category;
    card.dataset.project = item.id;
    card.style.animationDelay = `${index * 0.15}s`;

    const technologies = (item.technologies || []).slice(0, 4).map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    card.innerHTML = `
      <div class="card-image">
        <img 
          src="${item.thumbnail || 'assets/portfolio/placeholder.jpg'}" 
          alt="${item.title[currentLang] || item.title?.en || 'Project'}" 
          loading="lazy"
        >
        <div class="card-overlay">
          <button class="view-project-btn" data-project-id="${item.id}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View Details
          </button>
        </div>
      </div>
      <div class="card-content">
        <span class="card-category">${this.getCategoryName(item.category, currentLang)}</span>
        <h3 class="card-title">${item.title[currentLang] || item.title?.en || 'Project'}</h3>
        <p class="card-description">${this.getVariedDescription(item, currentLang, layout.height)}</p>
        <div class="card-technologies">
          ${technologies}
        </div>
        <div class="card-footer-row" style="display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem;">
          <div class="card-duration">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            ${item.duration[currentLang] || item.duration?.en || ''}
          </div>
          <a href="case-study.html?id=${item.id}" class="case-study-link" style="font-size:0.8rem;color:var(--color-primary);text-decoration:none;font-weight:600;display:flex;align-items:center;gap:0.25rem;" onclick="event.stopPropagation();">
            Case Study →
          </a>
        </div>
      </div>
    `;

    // Setup card click handler
    const viewBtn = card.querySelector('.view-project-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        console.log('🔧 View Details button clicked for project:', item.title?.en || item.id);
        e.stopPropagation();
        e.preventDefault();
        this.openModal(item);
      });
    }

    return card;
  }

  createTestimonialCard(index) {
    const card = document.createElement('article');
    card.className = 'portfolio-card-masonry card-testimonial card-medium card-normal';
    card.style.animationDelay = `${index * 0.15}s`;
    card.id = 'testimonialCard';

    const currentTestimonial = this.testimonialsData[this.currentTestimonialIndex];

    card.innerHTML = `
      <div class="testimonial-card-content">
        <div class="testimonial-header">
          <h3 class="testimonial-title">Pilot Program</h3>
          <div class="testimonial-counter">
            <span class="current">${this.currentTestimonialIndex + 1}</span> / <span class="total">${this.testimonialsData.length}</span>
          </div>
        </div>
        
        <div class="testimonial-content">
          <div class="testimonial-quote" id="testimonialQuote">${currentTestimonial.quote}</div>
          <div class="testimonial-author">
            <img class="testimonial-avatar" id="testimonialAvatar" src="${currentTestimonial.avatar}" alt="${currentTestimonial.author}" loading="lazy">
            <div class="testimonial-info">
              <h4 id="testimonialAuthor">${currentTestimonial.author}</h4>
              <p id="testimonialPosition">${currentTestimonial.position}</p>
            </div>
          </div>
          <div class="testimonial-stars">
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
          </div>
        </div>
        
        <div class="testimonial-navigation">
          <button class="testimonial-nav-btn prev-btn" id="prevTestimonial" aria-label="Previous testimonial">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <div class="testimonial-dots" id="testimonialDots">
            ${this.testimonialsData.map((_, i) => 
              `<button class="dot ${i === this.currentTestimonialIndex ? 'active' : ''}" data-index="${i}"></button>`
            ).join('')}
          </div>
          
          <button class="testimonial-nav-btn next-btn" id="nextTestimonial" aria-label="Next testimonial">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add event listeners for carousel navigation
    this.setupTestimonialCarousel(card);

    return card;
  }

  setupTestimonialCarousel(card) {
    const prevBtn = card.querySelector('#prevTestimonial');
    const nextBtn = card.querySelector('#nextTestimonial');
    const dots = card.querySelectorAll('.dot');

    // Previous button
    prevBtn.addEventListener('click', () => {
      this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
        ? this.testimonialsData.length - 1 
        : this.currentTestimonialIndex - 1;
      this.updateTestimonialContent();
    });

    // Next button
    nextBtn.addEventListener('click', () => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonialsData.length;
      this.updateTestimonialContent();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.currentTestimonialIndex = index;
        this.updateTestimonialContent();
      });
    });

    // Auto-rotate testimonials every 5 seconds
    this.startTestimonialAutoRotate();
  }

  updateTestimonialContent() {
    const currentTestimonial = this.testimonialsData[this.currentTestimonialIndex];
    const card = document.getElementById('testimonialCard');
    
    if (!card) return;

    // Update content with fade effect
    const quote = card.querySelector('#testimonialQuote');
    const avatar = card.querySelector('#testimonialAvatar');
    const author = card.querySelector('#testimonialAuthor');
    const position = card.querySelector('#testimonialPosition');
    const counter = card.querySelector('.current');
    const dots = card.querySelectorAll('.dot');

    // Add fade out effect
    const content = card.querySelector('.testimonial-content');
    content.style.opacity = '0.5';
    content.style.transform = 'translateY(10px)';

    setTimeout(() => {
      // Update content
      quote.textContent = currentTestimonial.quote;
      avatar.src = currentTestimonial.avatar;
      avatar.alt = currentTestimonial.author;
      author.textContent = currentTestimonial.author;
      position.textContent = currentTestimonial.position;
      counter.textContent = this.currentTestimonialIndex + 1;

      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentTestimonialIndex);
      });

      // Fade back in
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 200);
  }

  startTestimonialAutoRotate() {
    // Clear any existing interval
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }

    // Start new interval
    this.testimonialInterval = setInterval(() => {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonialsData.length;
      this.updateTestimonialContent();
    }, 5000);
  }

  stopTestimonialAutoRotate() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = null;
    }
  }

  getCategoryName(category, lang = 'en') {
    const categoryNames = {
      websites: { en: 'Websites', ar: 'المواقع الإلكترونية' },
      systems: { en: 'Business Systems', ar: 'أنظمة الأعمال' },
      branding: { en: 'Branding', ar: 'الهوية التجارية' },
      automation: { en: 'Automation', ar: 'الأتمتة' },
      mobile: { en: 'Mobile Apps', ar: 'تطبيقات الهاتف' }
    };
    
    return categoryNames[category]?.[lang] || category;
  }

  getVariedDescription(item, lang, sizeClass) {
    const fullDesc = item.description[lang] || item.description?.en || '';
    
    // Vary description length based on card size for natural masonry effect
    const lengths = {
      'card-large': 150,
      'card-medium': 100,
      'card-small': 80
    };
    
    const maxLength = lengths[sizeClass] || 100;
    return fullDesc.length > maxLength ? fullDesc.substring(0, maxLength) + '...' : fullDesc;
  }

  getCurrentLanguage() {
    return document.documentElement.lang || 'en';
  }

  openModal(project) {
    console.log('🔍 openModal called with project:', project);
    console.log('🔍 Modal element:', this.modal);
    console.log('🔍 Modal exists:', !!this.modal);
    console.log('🔍 Project exists:', !!project);
    
    if (!this.modal) {
      console.error('❌ Modal element not found! ID: portfolioModal');
      // Try to find modal again
      this.modal = document.getElementById('portfolioModal');
      console.log('🔄 Retry finding modal:', !!this.modal);
      if (!this.modal) {
        alert('Modal not found - please check HTML structure');
        return;
      }
    }
    
    if (!project) {
      console.error('❌ Project data missing');
      return;
    }

    console.log('🔧 Before adding active class - modal classes:', this.modal.className);
    
    this.populateModal(project);
    this.modal.classList.add('active');
    
    console.log('✅ After adding active class - modal classes:', this.modal.className);
    console.log('🔧 Modal computed style display:', window.getComputedStyle(this.modal).display);
    console.log('🔧 Modal computed style visibility:', window.getComputedStyle(this.modal).visibility);
    console.log('🔧 Modal computed style opacity:', window.getComputedStyle(this.modal).opacity);
    
    // EMERGENCY FIX: Force modal to show if CSS is not working
    if (window.getComputedStyle(this.modal).visibility === 'hidden') {
      console.warn('⚠️ Modal still hidden after adding active class - forcing visibility');
      this.modal.style.visibility = 'visible';
      this.modal.style.opacity = '1';
      this.modal.style.display = 'flex';
      this.modal.style.zIndex = '10000';
      this.modal.style.position = 'fixed';
      this.modal.style.top = '0';
      this.modal.style.left = '0';
      this.modal.style.right = '0';
      this.modal.style.bottom = '0';
      this.modal.style.background = 'rgba(0, 0, 0, 0.8)';
    }
    
    // EMERGENCY CONTENT FIX: Force modal container to proper width
    const modalContainer = this.modal.querySelector('.portfolio-modal__container');
    if (modalContainer) {
      modalContainer.style.width = '90vw';
      modalContainer.style.maxWidth = '1200px';
      modalContainer.style.minWidth = '350px';
      modalContainer.style.height = 'auto';
      modalContainer.style.minHeight = '60vh';
      console.log('🔧 Forced container width:', modalContainer.style.width);
    }
    
    // COMPREHENSIVE CSS CONFLICT OVERRIDE: Complete modal fix
    const emergencyCSS = document.createElement('style');
    emergencyCSS.textContent = `
      /* Base modal state - hidden by default */
      .portfolio-modal-enhanced {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 10001 !important;
        display: none !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        visibility: hidden !important;
        background: rgba(0, 0, 0, 0.8) !important;
        backdrop-filter: blur(8px) !important;
        pointer-events: none !important;
      }
      
      /* Force modal to show properly when active */
      .portfolio-modal-enhanced.active {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      
      /* Modal container responsive design */
      .portfolio-modal-enhanced.active .portfolio-modal__container {
        width: 90vw !important;
        max-width: 1200px !important;
        min-width: 350px !important;
        max-height: 90vh !important;
        background: var(--bg-secondary, #fff) !important;
        border-radius: 20px !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3) !important;
        overflow: hidden !important;
        position: relative !important;
        margin: auto !important;
      }
      
      /* Modal header */
      .portfolio-modal-enhanced .portfolio-modal__header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 1.5rem 2rem !important;
        border-bottom: 1px solid var(--border-color, #dee2e6) !important;
        background: var(--bg-primary, #f8f9fa) !important;
        flex-shrink: 0 !important;
      }
      
      /* Modal body responsive grid */
      .portfolio-modal-enhanced .portfolio-modal__body {
        display: grid !important;
        grid-template-columns: 1.2fr 1fr !important;
        flex: 1 !important;
        overflow: hidden !important;
        min-height: 400px !important;
      }
      
      /* Image section */
      .portfolio-modal-enhanced .portfolio-modal__image {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 2rem !important;
        background: var(--bg-primary, #f8f9fa) !important;
      }
      
      .portfolio-modal-enhanced .portfolio-modal__image img {
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        border-radius: 12px !important;
      }
      
      /* Info section with scrolling */
      .portfolio-modal-enhanced .portfolio-modal__info {
        padding: 2rem !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        background: var(--bg-secondary, #fff) !important;
      }
      
      /* Close button - highest priority */
      .portfolio-modal-enhanced .portfolio-modal__close {
        z-index: 10010 !important;
        pointer-events: auto !important;
        position: relative !important;
        cursor: pointer !important;
        background: var(--color-surface, #fff) !important;
        border: 2px solid var(--color-border, #dee2e6) !important;
        width: 3rem !important;
        height: 3rem !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
      }
      
      .portfolio-modal-enhanced .portfolio-modal__close:hover {
        background: var(--color-error, #dc3545) !important;
        color: white !important;
        border-color: var(--color-error, #dc3545) !important;
        transform: scale(1.05) !important;
      }
      
      .portfolio-modal-enhanced .portfolio-modal__close:active {
        transform: scale(0.95) !important;
      }
      
      .portfolio-modal-enhanced .portfolio-modal__close svg {
        width: 1.5rem !important;
        height: 1.5rem !important;
      }
      
      /* Mobile responsive - improved */
      @media (max-width: 768px) {
        .portfolio-modal-enhanced.active .portfolio-modal__container {
          width: 95vw !important;
          height: 95vh !important;
          max-height: 95vh !important;
          border-radius: 12px !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__body {
          grid-template-columns: 1fr !important;
          grid-template-rows: auto 1fr !important;
          gap: 0.5rem !important;
          padding: 0.5rem !important;
          overflow-y: auto !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__header {
          padding: 1rem !important;
          min-height: 60px !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__title {
          font-size: 1.2rem !important;
          line-height: 1.4 !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__close {
          width: 2.5rem !important;
          height: 2.5rem !important;
        }
        
        .portfolio-modal-enhanced .gallery-main {
          min-height: 200px !important;
          max-height: 40vh !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__image,
        .portfolio-modal-enhanced .portfolio-modal__info {
          padding: 1rem !important;
        }
        
        .portfolio-modal-enhanced .project-details-grid,
        .portfolio-modal-enhanced .metrics-grid-enhanced {
          grid-template-columns: 1fr !important;
          gap: 0.75rem !important;
        }
        
        .portfolio-modal-enhanced .technologies-grid {
          gap: 0.5rem !important;
        }
        
        .portfolio-modal-enhanced .tech-item {
          padding: 0.5rem 0.75rem !important;
          font-size: 0.85rem !important;
        }
      }
      
      /* Extra small mobile */
      @media (max-width: 480px) {
        .portfolio-modal-enhanced.active .portfolio-modal__container {
          width: 98vw !important;
          height: 98vh !important;
          border-radius: 8px !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__header {
          padding: 0.75rem !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__title {
          font-size: 1.1rem !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__body {
          padding: 0.25rem !important;
        }
        
        .portfolio-modal-enhanced .gallery-main {
          min-height: 180px !important;
        }
        
        .portfolio-modal-enhanced .portfolio-modal__info {
          padding: 0.75rem !important;
        }
      }
    `;
    if (!document.querySelector('#portfolio-modal-emergency-css')) {
      emergencyCSS.id = 'portfolio-modal-emergency-css';
      document.head.appendChild(emergencyCSS);
      console.log('🔧 Added comprehensive emergency CSS override');
    }
    
    // Escape key handler is already set up in setupEventListeners()
    
    // Enhanced backdrop click handling
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target.classList.contains('portfolio-modal__backdrop')) {
        console.log('🔧 Backdrop clicked - closing modal');
        this.closeModal();
      }
    });
    
    // Focus management
    this.modal.focus();
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal opened with all fixes applied');
  }

  closeModal() {
    console.log('🔧 closeModal() called');
    console.log('🔧 Modal exists:', !!this.modal);
    
    if (!this.modal) {
      console.error('❌ Modal not found in closeModal()');
      return;
    }

    console.log('🔧 Modal classes before close:', this.modal.className);
    console.log('🔧 Modal has active class:', this.modal.classList.contains('active'));

    // Remove active class to hide modal
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Force modal to be hidden
    this.modal.style.display = 'none';
    this.modal.style.opacity = '0';
    this.modal.style.visibility = 'hidden';
    this.modal.style.pointerEvents = 'none';
    
    console.log('🔧 Modal classes after close:', this.modal.className);
    console.log('🔧 Modal display after close:', this.modal.style.display);
    console.log('✅ Modal closed successfully');
  }

  populateModal(project) {
    console.log('🔧 populateModal called with project:', project);
    const currentLang = this.getCurrentLanguage();
    console.log('🔧 Current language:', currentLang);
    
    // Store current project for button handlers
    this.currentProject = project;
    
    // Header Section
    const modalTitle = this.modal.querySelector('.portfolio-modal__title');
    const modalCategory = this.modal.querySelector('.modal-category');
    const modalClient = this.modal.querySelector('.modal-client');
    
    if (modalTitle) {
      modalTitle.textContent = project.title[currentLang] || project.title?.en || 'No Title';
    }
    
    if (modalCategory) {
      modalCategory.textContent = this.getCategoryName(project.category, currentLang);
    }
    
    if (modalClient) {
      modalClient.textContent = project.client[currentLang] || project.client?.en || '';
    }
    
    // Image
    const modalImage = this.modal.querySelector('#modalImage');
    if (modalImage) {
      modalImage.src = project.thumbnail || 'assets/portfolio/placeholder.jpg';
      modalImage.alt = project.title[currentLang] || project.title?.en || '';
    }
    
    // Project Overview - Description
    const modalDescription = this.modal.querySelector('.modal-description-text');
    if (modalDescription) {
      modalDescription.textContent = project.description[currentLang] || project.description?.en || 'No Description';
    }
    
    // Project Details Grid
    const modalDuration = this.modal.querySelector('.modal-duration');
    const modalTeamSize = this.modal.querySelector('.modal-team-size');
    const modalLaunchDate = this.modal.querySelector('.modal-launch-date');
    const modalPlatform = this.modal.querySelector('.modal-platform');
    
    if (modalDuration) {
      modalDuration.textContent = project.duration[currentLang] || project.duration?.en || '';
    }
    
    if (modalTeamSize) {
      modalTeamSize.textContent = (project.teamSize && project.teamSize[currentLang]) || (project.teamSize && project.teamSize.en) || '3-5 members';
    }

    if (modalLaunchDate) {
      modalLaunchDate.textContent = (project.year && project.year[currentLang]) || (project.year && project.year.en) || '';
    }

    if (modalPlatform) {
      modalPlatform.textContent = (project.platform && project.platform[currentLang]) || (project.platform && project.platform.en) || 'Web & Mobile';
    }
    
    // Services Grid
    const servicesGrid = this.modal.querySelector('#servicesGrid');
    if (servicesGrid) {
      if (project.services && project.services[currentLang]) {
        const services = project.services[currentLang] || project.services?.en || [];
        servicesGrid.innerHTML = services.map(service =>
          `<div class="service-tag">${service}</div>`
        ).join('');
      } else {
        // Default services if not provided
        const defaultServices = ['Web Development', 'UI/UX Design', 'Database Design', 'API Integration'];
        servicesGrid.innerHTML = defaultServices.map(service =>
          `<div class="service-tag">${service}</div>`
        ).join('');
      }
    }
    
    // Technologies Grid
    const technologiesGrid = this.modal.querySelector('#technologiesGrid');
    if (technologiesGrid && project.technologies) {
      technologiesGrid.innerHTML = project.technologies.map(tech => 
        `<div class="tech-tag">${tech}</div>`
      ).join('');
    }
    
    // Challenge, Solution, Results Sections
    this.populateProjectSections(project, currentLang);
    
    // Key Metrics & Results
    const metricsGrid = this.modal.querySelector('#metricsGrid');
    if (metricsGrid && project.results) {
      const results = project.results[currentLang] || project.results?.en || '';
      // Extract metrics from results text
      const successLabel = window.languageManager?.translate('portfolio.modal.project_success') || (currentLang === 'ar' ? 'نجاح المشروع' : 'Project Success');
      metricsGrid.innerHTML = `
        <div class="metric-card">
          <div class="metric-value">100%</div>
          <div class="metric-label">${successLabel}</div>
        </div>
        <div class="metric-description">
          <p>${results}</p>
        </div>
      `;
    }
    
    // Features List
    this.populateFeaturesList(project, currentLang);
    
    // Testimonial Section
    this.populateTestimonial(project, currentLang);

    // Update button states
    this.updateActionButtons(project);
    
    // Trigger translation update for new dynamic content
    if (window.languageManager) {
      window.languageManager.translatePage();
    }
  }

  populateProjectSections(project, currentLang) {
    // Clear existing dynamic sections first
    const existingSubsections = this.modal.querySelectorAll('.info-subsection');
    existingSubsections.forEach(section => section.remove());
    
    // Add challenge, solution sections to the modal
    const projectOverview = this.modal.querySelector('.project-overview');
    if (projectOverview && (project.challenge || project.solution)) {
      let sectionsHTML = '';
      
      if (project.challenge) {
        const challenge = project.challenge[currentLang] || project.challenge?.en || '';
        const challengeTitle = window.languageManager?.translate('portfolio.modal.challenge') || (currentLang === 'ar' ? 'التحدي' : 'Challenge');
        sectionsHTML += `
          <div class="info-subsection">
            <h4 class="subsection-title">${challengeTitle}</h4>
            <p class="subsection-text">${challenge}</p>
          </div>
        `;
      }
      
      if (project.solution) {
        const solution = project.solution[currentLang] || project.solution?.en || '';
        const solutionTitle = window.languageManager?.translate('portfolio.modal.solution') || (currentLang === 'ar' ? 'الحل' : 'Solution');
        sectionsHTML += `
          <div class="info-subsection">
            <h4 class="subsection-title">${solutionTitle}</h4>
            <p class="subsection-text">${solution}</p>
          </div>
        `;
      }
      
      projectOverview.insertAdjacentHTML('beforeend', sectionsHTML);
    }
  }

  populateFeaturesList(project, currentLang) {
    // Clear existing features sections
    const existingFeatures = this.modal.querySelectorAll('.features-section');
    existingFeatures.forEach(section => section.remove());
    
    if (project.features) {
      const features = project.features[currentLang] || project.features?.en || [];
      const servicesSection = this.modal.querySelector('.services-provided');
      
      if (servicesSection && features.length > 0) {
        const featuresTitle = window.languageManager?.translate('portfolio.modal.features') || (currentLang === 'ar' ? 'المميزات الرئيسية' : 'Key Features');
        const featuresHTML = `
          <div class="info-section features-section">
            <h3 class="section-title">${featuresTitle}</h3>
            <div class="features-list">
              ${features.map(feature => `
                <div class="feature-item">
                  <div class="feature-icon">✓</div>
                  <div class="feature-text">${feature}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
        servicesSection.insertAdjacentHTML('afterend', featuresHTML);
      }
    }
  }

  populateTestimonial(project, currentLang) {
    const testimonialSection = this.modal.querySelector('.testimonial-section');
    if (testimonialSection && project.testimonial) {
      const testimonial = project.testimonial[currentLang] || project.testimonial?.en || {};
      const testimonialText = this.modal.querySelector('.testimonial-text');
      const authorName = this.modal.querySelector('.author-name');
      const authorPosition = this.modal.querySelector('.author-position');
      const avatarImage = this.modal.querySelector('.avatar-image');
      
      if (testimonialText) {
        const defaultText = window.languageManager?.translate('portfolio.modal.default_testimonial') || (currentLang === 'ar' ? 'عمل ممتاز ومهني للغاية.' : 'Excellent and professional work.');
        testimonialText.textContent = testimonial.text || defaultText;
      }
      
      if (authorName) {
        const defaultAuthor = window.languageManager?.translate('portfolio.modal.satisfied_client') || (currentLang === 'ar' ? 'عميل راض' : 'Satisfied Client');
        authorName.textContent = testimonial.author || defaultAuthor;
      }
      
      if (authorPosition) {
        const defaultPosition = window.languageManager?.translate('portfolio.modal.project_manager') || (currentLang === 'ar' ? 'مدير المشروع' : 'Project Manager');
        authorPosition.textContent = testimonial.position || defaultPosition;
      }
      
      if (avatarImage) {
        avatarImage.src = testimonial.avatar || 'assets/testimonials/default-avatar.jpg';
        avatarImage.alt = testimonial.author || 'Client Avatar';
      }
    }
  }

  handleModalClick(e) {
    console.log('🔧 handleModalClick triggered');
    console.log('🔧 Target element:', e.target.tagName);
    console.log('🔧 Target classes:', e.target.className);
    console.log('🔧 Target ID:', e.target.id);
    
    // Enhanced backdrop detection
    const isBackdrop = e.target.classList.contains('portfolio-modal__backdrop') || 
                      e.target.classList.contains('portfolio-modal-enhanced') ||
                      e.target === this.modal ||
                      e.target.id === 'portfolioModal';
    
    // Don't close if clicking inside modal content
    const isInsideContent = e.target.closest('.portfolio-modal__container');
    
    console.log('🔧 Is backdrop:', isBackdrop);
    console.log('🔧 Is inside content:', !!isInsideContent);
    
    if (isBackdrop && !isInsideContent) {
      console.log('🔧 Backdrop clicked - closing modal');
      e.preventDefault();
      e.stopPropagation();
      this.closeModal();
    }
  }

  showError(message) {
    if (this.portfolioGrid) {
      this.portfolioGrid.innerHTML = `
        <div class="portfolio-error">
          <h3>Error Loading Portfolio</h3>
          <p>${message}</p>
          <button onclick="window.portfolioManager.init()" class="retry-btn">
            Retry
          </button>
        </div>
      `;
    }
  }

  updateActionButtons(project) {
    // For demo purposes, enable/disable buttons based on project data
    if (this.liveWebsiteBtn) {
      if (project.liveUrl) {
        this.liveWebsiteBtn.style.display = 'flex';
        this.liveWebsiteBtn.href = project.liveUrl;
      } else {
        this.liveWebsiteBtn.style.display = 'none';
      }
    }

    if (this.caseStudyBtn) {
      // Always link to the dedicated case study page
      this.caseStudyBtn.style.display = 'flex';
      this.caseStudyBtn.href = `case-study.html?id=${project.id}`;
    }
  }

  handleLiveWebsiteClick() {
    if (this.currentProject && this.currentProject.liveUrl) {
      window.open(this.currentProject.liveUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Demo URL for projects without live URLs
      window.open('#', '_blank', 'noopener,noreferrer');
    }
  }

  handleCaseStudyClick() {
    if (this.currentProject && this.currentProject.caseStudyUrl) {
      window.open(this.currentProject.caseStudyUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For demo, scroll to contact section
      this.closeModal();
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }

  handleShareProject() {
    if (!this.currentProject) return;

    const currentLang = this.getCurrentLanguage();
    const projectTitle = this.currentProject.title[currentLang] || this.currentProject.title?.en || '';
    const projectDescription = this.currentProject.description[currentLang] || this.currentProject.description?.en || '';
    
    if (navigator.share) {
      // Use native Web Share API if available
      navigator.share({
        title: `WebKMT Portfolio - ${projectTitle}`,
        text: projectDescription,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      const shareText = `Check out this project: ${projectTitle} - ${projectDescription} ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        this.showNotification('Project link copied to clipboard!');
      }).catch(() => {
        // Ultimate fallback: show share modal or URL
        alert(`Share this project: ${window.location.href}`);
      });
    }
  }

  handleContactAboutProject() {
    if (!this.currentProject) return;

    const currentLang = this.getCurrentLanguage();
    const projectTitle = this.currentProject.title[currentLang] || this.currentProject.title?.en || '';
    
    // Close modal and scroll to contact form
    this.closeModal();
    
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill contact form with project info if possible
        setTimeout(() => {
          const messageField = document.querySelector('#contactMessage, [name="message"], textarea');
          if (messageField) {
            messageField.value = `I'm interested in discussing a project similar to "${projectTitle}". Please get in touch to discuss requirements and timeline.`;
            messageField.focus();
          }
        }, 500);
      }
    }, 300);
  }

  showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = 'portfolio-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10001;
      animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;

    // Add CSS animation if not exists
    if (!document.querySelector('#portfolio-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'portfolio-notification-styles';
      styles.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
function initPortfolio() {
  console.log('🚀 initPortfolio called, document.readyState:', document.readyState);
  
  if (document.readyState === 'loading') {
    console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('✅ DOMContentLoaded fired, initializing portfolio manager...');
      try {
        window.portfolioManager = new SimplePortfolioManager();
        console.log('✅ Portfolio manager created successfully:', window.portfolioManager);
      } catch (error) {
        console.error('❌ Error creating portfolio manager:', error);
      }
    });
  } else {
    console.log('✅ Document already ready, initializing portfolio manager immediately...');
    try {
      window.portfolioManager = new SimplePortfolioManager();
      console.log('✅ Portfolio manager created successfully:', window.portfolioManager);
    } catch (error) {
      console.error('❌ Error creating portfolio manager:', error);
    }
  }
}

// Auto-initialize
initPortfolio();

// Global fallback function for close modal
window.closePortfolioModal = function() {
  console.log('🔧 Global closePortfolioModal() called');
  if (window.portfolioManager && window.portfolioManager.closeModal) {
    window.portfolioManager.closeModal();
  } else {
    console.error('❌ Portfolio manager not available');
    // Emergency fallback - hide modal directly
    const modal = document.getElementById('portfolioModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      console.log('✅ Emergency modal close executed');
    }
  }
};