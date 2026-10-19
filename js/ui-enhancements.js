/**
 * UI Enhancements - Simplified
 * Essential UI functionality following codebase patterns
 */

class UIEnhancements {
  constructor() {
    console.log('🎨 UI Enhancements initializing...');

    // DOM elements
    this.hamburger = document.querySelector('.hamburger-enhanced');
    this.mobileMenu = document.querySelector('.mobile-menu-enhanced');
    this.mobileOverlay = document.querySelector('.mobile-menu-overlay');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.themeToggles = document.querySelectorAll('.theme-toggle-enhanced');
    this.langToggles = document.querySelectorAll('.lang-toggle');

    // State
    this.isMenuOpen = false;
    this.lastScrollY = 0;

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupNavigation();
    this.setupThemeToggles();
    this.setupLanguageToggles();
    this.setupScrollEffects();
    console.log('✅ UI Enhancements initialized');
  }

  /**
   * Mobile menu functionality
   */
  setupMobileMenu() {
    if (!this.hamburger || !this.mobileMenu) return;

    // Hamburger click handler
    this.hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Overlay click handler
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileMenu?.classList.add('active');
    this.hamburger?.classList.add('active');

    // Create overlay if it doesn't exist
    if (!this.mobileOverlay) {
      this.createMobileOverlay();
    }
    this.mobileOverlay?.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Update aria attributes
    this.hamburger?.setAttribute('aria-expanded', 'true');
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileMenu?.classList.remove('active');
    this.hamburger?.classList.remove('active');
    this.mobileOverlay?.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';

    // Update aria attributes
    this.hamburger?.setAttribute('aria-expanded', 'false');
  }

  createMobileOverlay() {
    if (this.mobileOverlay) return;

    this.mobileOverlay = document.createElement('div');
    this.mobileOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(this.mobileOverlay);

    this.mobileOverlay.addEventListener('click', () => {
      this.closeMobileMenu();
    });
  }

  /**
   * Navigation functionality
   */
  setupNavigation() {
    // Smooth scrolling for nav links
    this.navLinks.forEach(link => {
      if (link.hash) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.hash);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      }
    });
  }

  /**
   * Theme toggle functionality
   */
  setupThemeToggles() {
    this.themeToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: newTheme }
    }));
  }

  /**
   * Language toggle functionality
   */
  setupLanguageToggles() {
    this.langToggles.forEach(toggle => {
      toggle.addEventListener('click', async (e) => {
        e.preventDefault();
        const lang = toggle.dataset.lang || (toggle.textContent.includes('AR') ? 'ar' : 'en');
        await this.switchLanguage(lang);
      });
    });
  }

  async switchLanguage(lang) {
    try {
      if (window.languageManager && typeof window.languageManager.setLanguage === 'function') {
        await window.languageManager.setLanguage(lang);
      } else {
        console.warn('Language manager not available');
      }
    } catch (error) {
      console.error('Error switching language:', error);
    }
  }

  /**
   * Header scroll effects
   */
  setupScrollEffects() {
    const header = document.querySelector('.header, .header-enhanced');
    if (!header) return;

    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      // Hide/show header on scroll
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      // Add background on scroll
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      this.lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  /**
   * Cleanup method
   */
  destroy() {
    // Remove event listeners and cleanup
    this.closeMobileMenu();
    if (this.mobileOverlay && this.mobileOverlay.parentNode) {
      this.mobileOverlay.parentNode.removeChild(this.mobileOverlay);
    }
  }
}

/**
 * Services enhancement for visibility only
 */
class ServicesEnhancement {
  constructor() {
    this.serviceCards = [];
    this.setupServiceCards();
    this.animateCardsIn();
  }

  setupServiceCards() {
    // Get service cards with correct class name
    this.serviceCards = document.querySelectorAll('.service-card-enhanced');
  }

  animateCardsIn() {
    // Make service cards visible with staggered animation
    this.serviceCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100); // Stagger by 100ms
    });
  }
}

/**
 * Mobile section collapse functionality
 */
class MobileCollapse {
  constructor() {
    this.setupCollapsibleSections();
    this.setupMobileSectionToggles();
  }

  setupCollapsibleSections() {
    const toggleButtons = document.querySelectorAll('[data-mobile-collapse]');

    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = button.dataset.mobileCollapse;
        this.toggleSection(sectionId);
      });
    });
  }

  setupMobileSectionToggles() {
    // Only apply on mobile/tablet devices
    if (window.innerWidth <= 768) {
      this.createSectionToggles();
    }

    // Re-check on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.createSectionToggles();
      } else {
        this.removeSectionToggles();
      }
    });

    // Watch for dynamic content changes (like portfolio items being loaded)
    const portfolioGrid = document.querySelector('#portfolioGrid, .portfolio__grid-masonry');
    const insightsGrid = document.querySelector('.insights__grid');

    if (portfolioGrid || insightsGrid) {
      const observer = new MutationObserver((mutations) => {
        let shouldRecheck = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if portfolio or insight cards were added
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList?.contains('portfolio-card-masonry') ||
                    node.classList?.contains('insight-card') ||
                    node.querySelector?.('.portfolio-card-masonry, .insight-card')) {
                  shouldRecheck = true;
                }
              }
            });
          }
        });

        if (shouldRecheck) {
          console.log('📱 Dynamic content detected, rechecking sections...');
          setTimeout(() => {
            this.recheckSections();
            // Icons are now inline SVG - no reinitialization needed
          }, 100); // Small delay to ensure DOM is ready
        }
      });

      if (portfolioGrid) {
        observer.observe(portfolioGrid, { childList: true, subtree: true });
      }
      if (insightsGrid) {
        observer.observe(insightsGrid, { childList: true, subtree: true });
      }
    }
  }

  getSectionsToCollapse() {
    return [
      { selector: '.services-enhanced', cardSelector: '.service-card-enhanced', minCards: 2, showCards: 1 },
      { selector: '.portfolio-enhanced', cardSelector: '.portfolio-card-masonry', minCards: 2, showCards: 1 },
      { selector: '.tools', cardSelector: '.tool-category', minCards: 2, showCards: 1 },
      { selector: '.insights', cardSelector: '.insight-card', minCards: 2, showCards: 1 }
    ];
  }

  createSectionToggles() {
    console.log('📱 Creating mobile section toggles...');
    // Find sections with many cards: services, portfolio, tools, insights
    // Note: testimonials is a carousel within portfolio, not a separate section
    const sectionsToCollapse = this.getSectionsToCollapse();

    sectionsToCollapse.forEach(({ selector, cardSelector, minCards, showCards }) => {
      const section = document.querySelector(selector);
      console.log(`📱 Checking section: ${selector}`, {
        found: !!section,
        cardSelector,
        minCards,
        showCards
      });
      if (!section) return;

      const cards = section.querySelectorAll(cardSelector);
      console.log(`📱 Section ${selector} has ${cards.length} cards (min: ${minCards})`);

      // For portfolio, exclude testimonials from the count
      let projectCards = cards;
      if (selector === '.portfolio-enhanced') {
        projectCards = Array.from(cards).filter(card => !card.classList.contains('card-testimonial'));
        console.log(`📱 Portfolio has ${projectCards.length} project cards (excluding testimonials)`);
        if (projectCards.length < minCards) return;
      } else {
        if (cards.length < minCards) return;
      }

      // Check if toggle already exists
      if (section.querySelector('.mobile-section-toggle')) return;

      // Create toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'mobile-section-toggle';
      const totalCards = selector === '.portfolio-enhanced' ? projectCards.length : cards.length;
      const remainingCards = totalCards - showCards;
      toggleBtn.innerHTML = `
        <span>Show ${remainingCards} More</span>
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 9l-7 7-7-7"/>
        </svg>
      `;

      // Add collapsed class to section initially
      section.classList.add('mobile-collapsed');

      // Insert toggle button at the bottom of the section
      section.appendChild(toggleBtn);

      // Add click handler
      toggleBtn.addEventListener('click', () => {
        this.toggleMobileSection(section, toggleBtn, totalCards, showCards);
      });
    });
  }

  removeSectionToggles() {
    // Remove all mobile section toggles and collapsed states
    document.querySelectorAll('.mobile-section-toggle').forEach(btn => btn.remove());
    document.querySelectorAll('.mobile-collapsed').forEach(section => {
      section.classList.remove('mobile-collapsed', 'mobile-expanded');
    });
  }

  recheckSections() {
    console.log('📱 Rechecking sections for dynamic content...');
    if (window.innerWidth <= 768) {
      // Remove existing toggles first
      this.removeSectionToggles();
      // Then recreate them
      this.createSectionToggles();
    }
  }

  toggleMobileSection(section, toggleBtn, cardCount, showCards) {
    const isCollapsed = section.classList.contains('mobile-collapsed');
    const spanElement = toggleBtn.querySelector('span');
    const remainingCards = cardCount - showCards;

    if (isCollapsed) {
      section.classList.remove('mobile-collapsed');
      section.classList.add('mobile-expanded');
      if (spanElement) spanElement.textContent = 'Show Less';
    } else {
      section.classList.add('mobile-collapsed');
      section.classList.remove('mobile-expanded');
      if (spanElement) spanElement.textContent = `Show ${remainingCards} More`;

      // Scroll to section header
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const isExpanded = section.classList.contains('expanded');
    section.classList.toggle('expanded');

    // Update button text
    const button = document.querySelector(`[data-mobile-collapse="${sectionId}"]`);
    if (button) {
      button.textContent = isExpanded ? 'Show More' : 'Show Less';
    }
  }
}

// Global initialization
function initUIEnhancements() {
  console.log('🚀 Starting UI enhancements initialization...');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createUIEnhancements();
    });
  } else {
    createUIEnhancements();
  }
}

function createUIEnhancements() {
  try {
    // Initialize main UI enhancements
    window.uiEnhancements = new UIEnhancements();

    // Initialize services enhancement
    window.servicesEnhancement = new ServicesEnhancement();

    // Initialize mobile collapse
    window.mobileCollapse = new MobileCollapse();

    // Icons are now inline SVG - no initialization needed

    console.log('✅ All UI enhancements initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing UI enhancements:', error);
  }
}

// Language change listener
document.addEventListener('languageChanged', () => {
  console.log('🌐 Language changed, updating UI...');
  // Re-initialize if needed
});

// Theme change listener
document.addEventListener('themeChanged', (e) => {
  console.log('🎨 Theme changed to:', e.detail?.theme);
});

// Auto-initialize
initUIEnhancements();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIEnhancements, ServicesEnhancement, MobileCollapse };
}