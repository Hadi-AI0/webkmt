/**
 * Main Application Entry Point
 * Initializes all modules and manages application lifecycle
 */

class WebKemetApp {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
    this.performanceMetrics = {};
    
    this.init();
  }

  async init() {
    console.log('🚀 WebKMT Application Starting...');
    
    try {
      // Initialize performance monitoring first
      await this.initializePerformanceMonitoring();
      
      // Initialize core modules
      await this.initializeCore();
      
      // Initialize enhanced components
      await this.initializeComponents();
      
      // Initialize lazy loading
      await this.initializeLazyLoading();
      
      // Set up theme management
      this.initializeThemeManagement();
      
      // Set up navigation
      this.initializeNavigation();
      
      // Initialize apps if present
      await this.initializeApps();
      
      // Final setup
      this.finalizeInitialization();
      
      console.log('✅ WebKMT Application Initialized Successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  async initializePerformanceMonitoring() {
    if (window.PerformanceMonitor) {
      this.modules.performance = new window.PerformanceMonitor();
      this.performanceMetrics.appStart = performance.now();
    }
  }

  async initializeCore() {
    // Language manager should already be initialized
    this.modules.languageManager = window.languageManager;
    
    // Initialize lazy loader
    if (window.LazyLoader) {
      this.modules.lazyLoader = new window.LazyLoader();
    }
  }

  async initializeComponents() {
    // Initialize enhanced components in order
    const components = [
      'HeroEnhanced',
      'ServicesEnhanced',
      'FormsEnhanced'
    ];

    for (const componentName of components) {
      try {
        if (window[componentName]) {
          this.modules[componentName.toLowerCase()] = new window[componentName]();
          console.log(`✓ ${componentName} initialized`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to initialize ${componentName}:`, error);
      }
    }
  }

  async initializeLazyLoading() {
    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"], [data-lazy]');
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            lazyObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => lazyObserver.observe(img));
    }
  }

  initializeThemeManagement() {
    // Theme management is handled by hero-enhanced.js to avoid conflicts
    // Skip theme toggle initialization here
  }


  initializeNavigation() {
    // Get mobile menu elements
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          hamburger?.setAttribute('aria-expanded', 'false');
          mobileMenu?.classList.remove('active');
          overlay?.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      });
    });
  }

  async initializeApps() {
    // Initialize mini-apps manager
    if (window.MiniAppsManager) {
      this.modules.miniApps = new window.MiniAppsManager();
    }

    // Initialize chatbot - DISABLED: Using static chatbot instead
    // if (window.ChatBot) {
    //   this.modules.chatbot = new window.ChatBot();
    // }
  }

  finalizeInitialization() {
    this.isInitialized = true;
    
    // Record initialization time
    if (this.modules.performance) {
      this.performanceMetrics.initTime = performance.now() - this.performanceMetrics.appStart;
      console.log(`📊 App initialization took ${this.performanceMetrics.initTime.toFixed(2)}ms`);
    }

    // Dispatch app ready event
    document.dispatchEvent(new CustomEvent('appReady', {
      detail: {
        modules: Object.keys(this.modules),
        initTime: this.performanceMetrics.initTime
      }
    }));

    // Remove loading states
    document.body.classList.remove('loading');
    
    // Show app content with fade-in
    document.body.classList.add('app-ready');
  }

  handleInitializationError(error) {
    console.error('Application initialization error:', error);
    
    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.className = 'app-error';
    errorDiv.innerHTML = `
      <h2>Oops! Something went wrong</h2>
      <p>The application failed to load properly. Please refresh the page to try again.</p>
      <button onclick="location.reload()">Refresh Page</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Track error
    if (window.gtag) {
      gtag('event', 'exception', {
        'description': error.message,
        'fatal': true
      });
    }
  }

  // Public API methods
  getModule(name) {
    return this.modules[name];
  }

  isReady() {
    return this.isInitialized;
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }
}

// Application startup
document.addEventListener('DOMContentLoaded', () => {
  // Add loading class initially
  document.body.classList.add('loading');
  
  // Initialize app
  window.webKemetApp = new WebKemetApp();
  
  // AI chatbot uses secure server-side proxy - no client-side API key needed
  console.log('🤖 AI chatbot ready - using secure server-side Gemini API proxy');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (window.webKemetApp?.modules.performance) {
    window.webKemetApp.modules.performance.handleVisibilityChange();
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('🌐 Connection restored');
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  console.log('📡 Connection lost');
  document.body.classList.add('offline');
});

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (window.gtag) {
    gtag('event', 'exception', {
      'description': event.error?.message || 'Unknown error',
      'fatal': false
    });
  }
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (window.gtag) {
    gtag('event', 'exception', {
      'description': event.reason?.message || 'Unhandled promise rejection',
      'fatal': false
    });
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebKemetApp;
}