/**
 * WEBKMT Template Gallery — catalog data
 * --------------------------------------
 * Content rule (Knowledge Pack v0.8 §1A/§2): every purchasable website
 * design uses the same three plans. Do not add per-template setup or care
 * prices here; a template is the design, not a separate pricing SKU.
 *
 * Design rule (DESIGN.md): preview gradients are data, but they must use
 * only the harbor/navy/blue/cyan/teal family below — never category rainbow
 * colors. `demoUrl: null` means there is no public demo yet, so the UI asks
 * for a walkthrough instead of calling the card "live".
 *
 * To add a template: copy an object, change id/cat/gradient/icon/texts.
 * Icons available: clinic, food, home, scissors, bag, briefcase, link, car.
 */
window.WEBKMT_WEBSITE_PLANS = {
  files: {
    en: 'Plan 1 · USD 150 files only',
    ar: 'الخطة الأولى · 150 دولاراً للملفات فقط'
  },
  customized: {
    en: 'Plan 2 · USD 300–799 customized files',
    ar: 'الخطة الثانية · 300–799 دولاراً لملفات مخصصة'
  },
  ultimate: {
    en: 'Plan 3 · USD 800–1,599 Ultimate',
    ar: 'الخطة الثالثة · 800–1,599 دولاراً للخطة الشاملة'
  }
};

window.WEBKMT_TEMPLATES = [
  {
    id: 'clinic-pro',
    cat: 'clinics',
    gradient: ['#071B33', '#0F6FA8'],
    icon: 'clinic',
    demoUrl: null,
    name: { en: 'Clinic Pro', ar: 'قالب العيادات' },
    tagline: {
      en: 'For dental, medical & aesthetic clinics that depend on appointment enquiries.',
      ar: 'لعيادات الأسنان والطب والتجميل التي تعتمد على استفسارات المواعيد.'
    },
    features: {
      en: ['Doctor & service pages', 'Appointment-request path', 'WhatsApp enquiry button', 'Location & contact sections'],
      ar: ['صفحات الأطباء والخدمات', 'مسار طلب موعد', 'زر استفسار عبر واتساب', 'أقسام الموقع والتواصل']
    }
  },
  {
    id: 'restaurant-cafe',
    cat: 'food',
    gradient: ['#102A43', '#20C4D8'],
    icon: 'food',
    demoUrl: null,
    name: { en: 'Restaurant & Café', ar: 'المطاعم والمقاهي' },
    tagline: {
      en: 'Menus, photos and a clear route from appetite to reservation request.',
      ar: 'قوائم وصور ومسار واضح من فتح الشهية إلى طلب الحجز.'
    },
    features: {
      en: ['Digital menu sections', 'Reservation-request path', 'Photo gallery', 'Location, hours & WhatsApp enquiries'],
      ar: ['أقسام قائمة رقمية', 'مسار طلب الحجز', 'معرض صور', 'الموقع وساعات العمل واستفسارات واتساب']
    }
  },
  {
    id: 'property-plus',
    cat: 'realestate',
    gradient: ['#071B33', '#0E9488'],
    icon: 'home',
    demoUrl: null,
    name: { en: 'Property Plus', ar: 'قالب العقارات' },
    tagline: {
      en: 'For real-estate offices that want listings buyers can scan and enquire about quickly.',
      ar: 'لمكاتب العقارات التي تريد عروضاً يتصفحها المشترون ويستفسرون عنها بسرعة.'
    },
    features: {
      en: ['Property listing sections', 'Photo gallery per listing', 'WhatsApp enquiry per property', 'Agent profiles'],
      ar: ['أقسام عروض عقارية', 'معرض صور لكل عقار', 'استفسار واتساب لكل عقار', 'ملفات الوكلاء']
    }
  },
  {
    id: 'salon-spa',
    cat: 'services',
    gradient: ['#0F6FA8', '#20C4D8'],
    icon: 'scissors',
    demoUrl: null,
    name: { en: 'Salon & Spa', ar: 'الصالونات والسبا' },
    tagline: {
      en: 'For salons, barbers & spas that want fewer phone-tag booking conversations.',
      ar: 'للصالونات والحلاقين والسبا التي تريد محادثات حجز أقل عبر المكالمات المتبادلة.'
    },
    features: {
      en: ['Service & price list', 'Appointment-request path', 'Staff profiles', 'Visual gallery'],
      ar: ['قائمة الخدمات والأسعار', 'مسار طلب موعد', 'ملفات فريق العمل', 'معرض بصري']
    }
  },
  {
    id: 'shop-starter',
    cat: 'shops',
    gradient: ['#0B4F6C', '#0E9488'],
    icon: 'bag',
    demoUrl: null,
    name: { en: 'Catalogue Starter', ar: 'بداية الكتالوج' },
    tagline: {
      en: 'A product catalogue that sends enquiries to WhatsApp. Full checkout belongs in WEBKMT Store.',
      ar: 'كتالوج منتجات يرسل الاستفسارات إلى واتساب. والدفع الكامل مكانه WEBKMT Store.'
    },
    features: {
      en: ['Product catalogue sections', 'Offers & featured products', 'WhatsApp enquiry per product', 'Delivery & contact information'],
      ar: ['أقسام كتالوج منتجات', 'عروض ومنتجات مميزة', 'استفسار واتساب لكل منتج', 'معلومات التوصيل والتواصل']
    }
  },
  {
    id: 'services-pro',
    cat: 'services',
    gradient: ['#071B33', '#0F6FA8'],
    icon: 'briefcase',
    demoUrl: null,
    name: { en: 'Services Pro', ar: 'الشركات والخدمات' },
    tagline: {
      en: 'For law firms, accountants, consultants & agencies that sell expertise.',
      ar: 'للمحاماة والمحاسبة والاستشارات والوكالات التي تبيع الخبرة.'
    },
    features: {
      en: ['Services & team pages', 'Consultation / quote form', 'Credentials sections', 'Meeting-request path'],
      ar: ['صفحات الخدمات والفريق', 'نموذج استشارة / عرض سعر', 'أقسام المؤهلات', 'مسار طلب اجتماع']
    }
  },
  {
    id: 'auto-services',
    cat: 'services',
    gradient: ['#0B4F6C', '#20C4D8'],
    icon: 'car',
    demoUrl: null,
    name: { en: 'Auto Services', ar: 'خدمات السيارات' },
    tagline: {
      en: 'For repair, rental & detailing businesses that need clearer job enquiries.',
      ar: 'لأعمال الصيانة والتأجير والتلميع التي تحتاج استفسارات عمل أوضح.'
    },
    features: {
      en: ['Service enquiry form', 'Price list per service', 'Before / after gallery', 'WhatsApp enquiry path'],
      ar: ['نموذج استفسار عن الخدمة', 'قائمة أسعار لكل خدمة', 'معرض قبل / بعد', 'مسار استفسار عبر واتساب']
    }
  }
];
