/**
 * WebKMT Initialization Manager
 * Coordinates module loading and initialization to prevent race conditions
 */

class InitializationManager {
  constructor() {
    this.modules = new Map();
    this.loadOrder = [
      'supabase-config',
      'supabase-auth-manager',
      'supabase-shared-services',
      'supabase-data-sync',
      'language-manager',
      'performance-utils',
      'ui-enhancements',
      'content-loader',
      'forms-enhanced',
      'portfolio-simple',
      'chatbot',
      'mini-apps-manager',
      'mini-apps-integrated',
      'blog-manager',
      'auth-ui',
      'testimonials-carousel'
    ];
    this.initialized = new Set();
    this.dependencies = new Map();
    this.isReady = false;
  }

  registerModule(name, initFunction, dependencies = []) {
    this.modules.set(name, {
      init: initFunction,
      dependencies,
      status: 'pending'
    });
    this.dependencies.set(name, dependencies);
  }

  async initializeModules() {
    console.log('🚀 WebKMT Initialization Manager starting...');

    try {
      // Initialize modules in dependency order
      for (const moduleName of this.loadOrder) {
        await this.initializeModule(moduleName);
      }

      // Initialize any remaining modules not in loadOrder
      for (const [moduleName] of this.modules) {
        if (!this.initialized.has(moduleName)) {
          await this.initializeModule(moduleName);
        }
      }

      this.isReady = true;
      document.dispatchEvent(new CustomEvent('webkmt:ready'));
      console.log('✅ All WebKMT modules initialized successfully');

    } catch (error) {
      console.error('❌ WebKMT initialization failed:', error);
      document.dispatchEvent(new CustomEvent('webkmt:error', { detail: error }));
    }
  }

  async initializeModule(name) {
    if (this.initialized.has(name)) {
      return true;
    }

    const module = this.modules.get(name);
    if (!module) {
      console.warn(`⚠️ Module "${name}" not registered, skipping...`);
      return false;
    }

    // Check dependencies
    const dependencies = this.dependencies.get(name) || [];
    for (const dep of dependencies) {
      if (!this.initialized.has(dep)) {
        await this.initializeModule(dep);
      }
    }

    try {
      console.log(`🔧 Initializing ${name}...`);
      module.status = 'initializing';

      if (typeof module.init === 'function') {
        await module.init();
      }

      module.status = 'ready';
      this.initialized.add(name);
      console.log(`✅ ${name} initialized`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to initialize ${name}:`, error);
      module.status = 'error';
      throw error;
    }
  }

  waitForModule(name) {
    return new Promise((resolve) => {
      if (this.initialized.has(name)) {
        resolve();
        return;
      }

      const checkInit = () => {
        if (this.initialized.has(name)) {
          resolve();
        } else {
          setTimeout(checkInit, 50);
        }
      };
      checkInit();
    });
  }

  isModuleReady(name) {
    return this.initialized.has(name);
  }

  getStatus() {
    const status = {};
    for (const [name, module] of this.modules) {
      status[name] = module.status;
    }
    return status;
  }
}

// Global initialization manager
window.initManager = new InitializationManager();

// Auto-register existing global initializers
if (typeof window !== 'undefined') {
  // Register modules that exist
  if (window.supabaseManager) {
    window.initManager.registerModule('supabase-config', () => Promise.resolve());
  }

  if (window.languageManager) {
    window.initManager.registerModule('language-manager', () => window.languageManager.init?.(), ['supabase-config']);
  }

  if (window.authManager) {
    window.initManager.registerModule('supabase-auth-manager', () => window.authManager.init?.(), ['supabase-config']);
  }

  // Register consolidated bundles
  if (window.lazyLoader && window.errorReporter) {
    window.initManager.registerModule('performance-utils', () => Promise.resolve(), ['supabase-config']);
  }

  if (window.uiEnhancements && window.servicesEnhancement && window.mobileCollapse) {
    window.initManager.registerModule('ui-enhancements', () => {
      console.log('🎨 UI Enhancements initialized');
      // Verify key UI elements
      const hamburger = document.querySelector('.hamburger-enhanced');
      const themeToggle = document.querySelector('.theme-toggle-enhanced');
      console.log('🍔 Hamburger element found:', !!hamburger);
      console.log('🌙 Theme toggle found:', !!themeToggle);
      return Promise.resolve();
    }, ['language-manager', 'performance-utils']);
  }

  // Register chatbot when available
  setTimeout(() => {
    if (window.chatbot || window.ChatBot) {
      window.initManager.registerModule('chatbot', () => {
        console.log('🤖 AI Chatbot initialized');
        // Verify chatbot is working
        const fab = document.querySelector('.chatbot-trigger');
        console.log('🎯 Chatbot FAB element found:', !!fab);
        console.log('🤖 Chatbot instance available:', !!window.chatbot);
        return Promise.resolve();
      }, ['supabase-config', 'ui-enhancements']);
    } else {
      console.warn('⚠️ Chatbot not found, retrying...');
      setTimeout(() => {
        if (window.chatbot || window.ChatBot) {
          window.initManager.registerModule('chatbot', () => {
            console.log('🤖 AI Chatbot initialized (delayed)');
            return Promise.resolve();
          }, ['supabase-config', 'ui-enhancements']);
        }
      }, 1000);
    }
  }, 100);
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📋 DOM loaded, starting coordinated initialization...');
  window.initManager.initializeModules();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InitializationManager;
}