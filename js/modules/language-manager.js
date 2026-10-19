/**
 * Language Manager Module
 * Handles multi-language support (English/Arabic) with RTL
 */

class LanguageManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.isRTL = false;
    this.supportedLanguages = ['en', 'ar'];
    this.fallbackLanguage = 'en';
    
    this.init();
  }

  async init() {
    // Load saved language preference
    this.currentLanguage = localStorage.getItem('language') || this.detectBrowserLanguage();
    
    // Load translations
    await this.loadTranslations();
    
    // Apply language
    this.applyLanguage();
    
    // Set up language toggle
    this.setupLanguageToggle();
    
    console.log(`🌐 Language Manager initialized: ${this.currentLanguage}`);
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    return this.supportedLanguages.includes(langCode) ? langCode : this.fallbackLanguage;
  }

  async loadTranslations() {
    try {
      const response = await fetch(`locales/${this.currentLanguage}.json`);
      if (response.ok) {
        this.translations = await response.json();
      } else {
        console.warn(`Failed to load translations for ${this.currentLanguage}, using fallback`);
        await this.loadFallbackTranslations();
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      await this.loadFallbackTranslations();
    }
  }

  async loadFallbackTranslations() {
    try {
      const response = await fetch(`locales/${this.fallbackLanguage}.json`);
      if (response.ok) {
        this.translations = await response.json();
      }
    } catch (error) {
      console.error('Error loading fallback translations:', error);
      this.translations = {};
    }
  }

  applyLanguage() {
    const html = document.documentElement;
    this.isRTL = this.currentLanguage === 'ar';
    
    // Set language and direction
    html.setAttribute('lang', this.currentLanguage);
    html.setAttribute('dir', this.isRTL ? 'rtl' : 'ltr');
    
    // Add language class for CSS targeting
    html.className = html.className.replace(/\blang-\w+\b/g, '');
    html.classList.add(`lang-${this.currentLanguage}`);
    
    // Update all translatable elements
    this.translatePage();
    
    // Update language toggle button
    this.updateLanguageToggle();
    
    // Dispatch language change event
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { 
        language: this.currentLanguage, 
        isRTL: this.isRTL,
        translations: this.translations
      }
    }));
  }

  translatePage() {
    // Translate elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Translate aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = this.getTranslation(key);
      
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Translate meta tags
    this.updateMetaTags();
  }

  updateMetaTags() {
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const title = document.querySelector('title');
    
    if (metaDescription && this.translations.meta?.description) {
      metaDescription.setAttribute('content', this.translations.meta.description);
    }
    
    if (metaKeywords && this.translations.meta?.keywords) {
      metaKeywords.setAttribute('content', this.translations.meta.keywords);
    }
    
    if (title && this.translations.meta?.title) {
      title.textContent = this.translations.meta.title;
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle && this.translations.meta?.title) {
      ogTitle.setAttribute('content', this.translations.meta.title);
    }
    
    if (ogDescription && this.translations.meta?.description) {
      ogDescription.setAttribute('content', this.translations.meta.description);
    }
  }

  getTranslation(key) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return typeof value === 'string' ? value : null;
  }

  setupLanguageToggle() {
    const toggleBtn = document.querySelector('.lang-toggle-enhanced');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }
  }

  updateLanguageToggle() {
    const toggleBtn = document.querySelector('.lang-toggle-enhanced');
    if (toggleBtn) {
      toggleBtn.textContent = this.currentLanguage.toUpperCase();
      toggleBtn.setAttribute('aria-label', 
        this.currentLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'
      );
    }
  }

  async toggleLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    await this.setLanguage(newLanguage);
  }

  async setLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.warn(`Unsupported language: ${language}`);
      return;
    }

    if (language === this.currentLanguage) {
      return;
    }

    // Add transition class to prevent jarring changes
    document.body.classList.add('language-transition');

    this.currentLanguage = language;
    localStorage.setItem('language', language);
    
    await this.loadTranslations();
    this.applyLanguage();
    
    // Remove transition class after a short delay
    setTimeout(() => {
      document.body.classList.remove('language-transition');
    }, 300);

    // Track language change
    if (window.gtag) {
      gtag('event', 'language_change', {
        'language': language
      });
    }
  }

  // Method to dynamically translate text
  translate(key, fallback = '') {
    return this.getTranslation(key) || fallback;
  }

  // Method to format text with parameters
  formatTranslation(key, params = {}) {
    let text = this.getTranslation(key);
    if (!text) return '';
    
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{{\\s*${param}\\s*}}`, 'g'), params[param]);
    });
    
    return text;
  }

  // Get current language info
  getCurrentLanguage() {
    return {
      code: this.currentLanguage,
      isRTL: this.isRTL,
      name: this.currentLanguage === 'ar' ? 'العربية' : 'English'
    };
  }

  // Method to add new translations dynamically
  addTranslations(newTranslations) {
    this.translations = { ...this.translations, ...newTranslations };
  }
}

// Initialize language manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageManager;
}