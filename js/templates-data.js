/**
 * WebKMT Template Gallery — catalog data
 * --------------------------------------
 * Each entry is a ready-to-launch website design a client can pick.
 * Edit prices/names/features here; the gallery (templates-gallery.js)
 * renders everything. `demoUrl: null` shows a "demo on request" button
 * (WhatsApp) until you put a live demo subdomain here.
 *
 * To add a template: copy an object, change id/cat/gradient/icon/texts.
 * Icons available: clinic, food, home, scissors, bag, briefcase, link, car
 */
window.WEBKMT_TEMPLATES = [
  {
    id: 'clinic-pro',
    cat: 'clinics',
    gradient: ['#0ea5e9', '#22d3ee'],
    icon: 'clinic',
    setup: '$499–$899',
    care: '$29–$49',
    days: { en: '2–3 days', ar: '2–3 أيام' },
    demoUrl: null,
    name: { en: 'Clinic Pro', ar: 'قالب العيادات' },
    tagline: {
      en: 'For dental, medical & aesthetic clinics that live on appointments.',
      ar: 'لعيادات الأسنان والطب والتجميل التي تعتمد على المواعيد.'
    },
    features: {
      en: ['Online booking with reminders', 'Doctor & service pages', 'WhatsApp chat button', 'Google Maps & patient reviews'],
      ar: ['حجز إلكتروني مع تذكيرات', 'صفحات الأطباء والخدمات', 'زر محادثة واتساب', 'خرائط جوجل وتقييمات المرضى']
    }
  },
  {
    id: 'restaurant-cafe',
    cat: 'food',
    gradient: ['#f59e0b', '#ef4444'],
    icon: 'food',
    setup: '$499–$899',
    care: '$29–$49',
    days: { en: '2–3 days', ar: '2–3 أيام' },
    demoUrl: null,
    name: { en: 'Restaurant & Café', ar: 'المطاعم والمقاهي' },
    tagline: {
      en: 'Menus, reservations, and photos that make people hungry — and book.',
      ar: 'قوائم وحجوزات وصور تفتح الشهية — وتجلب الحجوزات.'
    },
    features: {
      en: ['Digital menu with prices', 'Table reservations', 'Photo gallery', 'Location, hours & WhatsApp ordering'],
      ar: ['قائمة رقمية بالأسعار', 'حجز الطاولات', 'معرض صور', 'الموقع وساعات العمل والطلب عبر واتساب']
    }
  },
  {
    id: 'property-plus',
    cat: 'realestate',
    gradient: ['#6366f1', '#8b5cf6'],
    icon: 'home',
    setup: '$599–$1,199',
    care: '$39–$69',
    days: { en: '3–4 days', ar: '3–4 أيام' },
    demoUrl: null,
    name: { en: 'Property Plus', ar: 'قالب العقارات' },
    tagline: {
      en: 'For real-estate offices that want listings buyers actually browse.',
      ar: 'لمكاتب العقارات التي تريد عروضاً يتصفحها المشترون فعلاً.'
    },
    features: {
      en: ['Property listings with filters', 'Photo gallery per listing', 'WhatsApp inquiry per property', 'Agent profiles'],
      ar: ['عروض عقارية مع فلاتر بحث', 'معرض صور لكل عقار', 'استفسار واتساب لكل عقار', 'ملفات الوكلاء']
    }
  },
  {
    id: 'salon-spa',
    cat: 'services',
    gradient: ['#ec4899', '#f472b6'],
    icon: 'scissors',
    setup: '$399–$799',
    care: '$29–$49',
    days: { en: '2–3 days', ar: '2–3 أيام' },
    demoUrl: null,
    name: { en: 'Salon & Spa', ar: 'الصالونات والسبا' },
    tagline: {
      en: 'For salons, barbers & spas — bookings without the phone tag.',
      ar: 'للصالونات والحلاقين والسبا — حجوزات دون مكالمات متبادلة.'
    },
    features: {
      en: ['Service & price list', 'Online booking', 'Staff profiles', 'Instagram-style gallery'],
      ar: ['قائمة الخدمات والأسعار', 'حجز إلكتروني', 'ملفات فريق العمل', 'معرض بأسلوب إنستغرام']
    }
  },
  {
    id: 'shop-starter',
    cat: 'shops',
    gradient: ['#10b981', '#059669'],
    icon: 'bag',
    setup: '$699–$1,499',
    care: '$39–$79',
    days: { en: '3–5 days', ar: '3–5 أيام' },
    demoUrl: null,
    name: { en: 'Shop Starter', ar: 'المتجر الإلكتروني' },
    tagline: {
      en: 'Turn Instagram DMs into a real online store.',
      ar: 'حوّل رسائل إنستغرام إلى متجر إلكتروني حقيقي.'
    },
    features: {
      en: ['Product catalog & cart', 'Cash-on-delivery ready', 'WhatsApp order notifications', 'Coupons & offers'],
      ar: ['كتالوج منتجات وسلة شراء', 'جاهز للدفع عند الاستلام', 'إشعارات الطلبات عبر واتساب', 'كوبونات وعروض']
    }
  },
  {
    id: 'services-pro',
    cat: 'services',
    gradient: ['#334155', '#0aacb8'],
    icon: 'briefcase',
    setup: '$399–$799',
    care: '$29–$49',
    days: { en: '2–3 days', ar: '2–3 أيام' },
    demoUrl: null,
    name: { en: 'Services Pro', ar: 'الشركات والخدمات' },
    tagline: {
      en: 'For law firms, accountants, consultants & agencies.',
      ar: 'للمحاماة والمحاسبة والاستشارات والوكالات.'
    },
    features: {
      en: ['Services & team pages', 'Client intake / quote form', 'Credentials & trust sections', 'Appointment booking'],
      ar: ['صفحات الخدمات والفريق', 'نموذج استقبال العملاء وعروض الأسعار', 'أقسام الثقة والمؤهلات', 'حجز المواعيد']
    }
  },
  {
    id: 'link-in-bio',
    cat: 'creators',
    gradient: ['#84cc16', '#16a34a'],
    icon: 'link',
    setup: 'Free',
    care: 'Free',
    days: { en: 'Same day', ar: 'في نفس اليوم' },
    demoUrl: 'https://link.webkmt.com',
    name: { en: 'Link-in-Bio (KMT Link)', ar: 'صفحة الروابط (KMT Link)' },
    tagline: {
      en: 'One link for everything — powered by our free KMT Link platform.',
      ar: 'رابط واحد لكل شيء — عبر منصة KMT Link المجانية.'
    },
    features: {
      en: ['link.webkmt.com/yourname', 'Unlimited links & themes', 'QR code for print & tables', 'Click analytics'],
      ar: ['link.webkmt.com/اسمك', 'روابط وقوالب بلا حدود', 'رمز QR للمطبوعات والطاولات', 'تحليلات النقرات']
    }
  },
  {
    id: 'auto-services',
    cat: 'services',
    gradient: ['#f97316', '#ea580c'],
    icon: 'car',
    setup: '$399–$799',
    care: '$29–$49',
    days: { en: '2–3 days', ar: '2–3 أيام' },
    demoUrl: null,
    name: { en: 'Auto Services', ar: 'خدمات السيارات' },
    tagline: {
      en: 'For repair, rental & detailing — jobs booked while you work.',
      ar: 'للصيانة والتأجير والتلميع — أعمال تُحجز بينما تعمل.'
    },
    features: {
      en: ['Service booking form', 'Price list per service', 'Before / after gallery', 'WhatsApp job updates (add-on)'],
      ar: ['نموذج حجز الخدمة', 'قائمة أسعار لكل خدمة', 'معرض قبل / بعد', 'تحديثات حالة العمل عبر واتساب (إضافة)']
    }
  }
];
