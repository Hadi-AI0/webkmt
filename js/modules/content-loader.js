/**
 * Dynamic Content Loader
 * Loads page sections on demand to improve initial page load
 */

class ContentLoader {
  constructor() {
    this.loadedSections = new Set();
    this.loadQueue = new Map();
    this.maxConcurrentLoads = 3;
    this.currentLoads = 0;
  }

  async loadContentSections() {
    // Define sections to load in priority order
    const sections = [
      {
        id: 'services',
        template: 'sections/services.html',
        module: 'js/modules/services.js',
        priority: 1
      },
      {
        id: 'portfolio',
        template: 'sections/portfolio.html',
        module: 'js/modules/portfolio.js',
        priority: 2
      },
      {
        id: 'process',
        template: 'sections/process.html',
        module: 'js/modules/process.js',
        priority: 3
      },
      {
        id: 'mini-apps',
        template: 'sections/mini-apps.html',
        module: 'js/modules/mini-apps.js',
        priority: 4
      },
      {
        id: 'testimonials',
        template: 'sections/testimonials.html',
        module: 'js/modules/testimonials.js',
        priority: 5
      },
      {
        id: 'tools',
        template: 'sections/tools.html',
        module: 'js/modules/tools.js',
        priority: 6
      },
      {
        id: 'blog',
        template: 'sections/blog.html',
        module: 'js/modules/blog.js',
        priority: 7
      },
      {
        id: 'contact',
        template: 'sections/contact.html',
        module: 'js/modules/contact.js',
        priority: 8
      },
      {
        id: 'newsletter',
        template: 'sections/newsletter.html',
        module: 'js/modules/newsletter.js',
        priority: 9
      },
      {
        id: 'footer',
        template: 'sections/footer.html',
        module: 'js/modules/footer.js',
        priority: 10
      }
    ];

    // Load sections based on viewport and user interaction
    await this.initializeContentLoading(sections);
  }

  async initializeContentLoading(sections) {
    const container = document.getElementById('content-sections');
    if (!container) {
      console.error('Content sections container not found');
      return;
    }

    // Sort sections by priority
    sections.sort((a, b) => a.priority - b.priority);

    // Load critical sections immediately
    const criticalSections = sections.filter(s => s.priority <= 2);
    const deferredSections = sections.filter(s => s.priority > 2);

    // Load critical sections
    for (const section of criticalSections) {
      await this.loadSection(section, container);
    }

    // Set up intersection observer for deferred sections
    this.setupDeferredLoading(deferredSections, container);

    // Load remaining sections based on user interaction
    this.setupInteractionLoading(deferredSections, container);
  }

  setupDeferredLoading(sections, container) {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all sections after a delay
      setTimeout(() => {
        sections.forEach(section => this.loadSection(section, container));
      }, 2000);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const section = sections.find(s => s.id === sectionId);
          if (section) {
            this.loadSection(section, container);
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      rootMargin: '200px 0px 200px 0px',
      threshold: 0.1
    });

    // Create placeholder elements for each section
    sections.forEach(section => {
      const placeholder = document.createElement('section');
      placeholder.id = section.id;
      placeholder.className = 'section-placeholder lazy-content';
      placeholder.innerHTML = `
        <div class="container">
          <div class="section-loading">
            <div class="loading-spinner"></div>
            <p>Loading ${section.id}...</p>
          </div>
        </div>
      `;
      container.appendChild(placeholder);
      observer.observe(placeholder);
    });
  }

  setupInteractionLoading(sections, container) {
    // Load sections on user interaction
    let interactionOccurred = false;
    
    const loadOnInteraction = () => {
      if (interactionOccurred) return;
      interactionOccurred = true;
      
      // Load remaining sections
      const remainingSections = sections.filter(s => !this.loadedSections.has(s.id));
      remainingSections.forEach(section => {
        setTimeout(() => this.loadSection(section, container), section.priority * 100);
      });
    };

    // Listen for user interactions
    ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
      document.addEventListener(event, loadOnInteraction, { once: true, passive: true });
    });

    // Fallback: load after 3 seconds
    setTimeout(loadOnInteraction, 3000);
  }

  async loadSection(section, container) {
    if (this.loadedSections.has(section.id)) {
      return;
    }

    // Check concurrent load limit
    if (this.currentLoads >= this.maxConcurrentLoads) {
      this.loadQueue.set(section.id, { section, container });
      return;
    }

    this.currentLoads++;

    try {
      const placeholder = document.getElementById(section.id);
      let sectionElement = placeholder;

      if (!sectionElement) {
        sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        container.appendChild(sectionElement);
      }

      // Add loading state
      sectionElement.classList.add('loading');

      // Load HTML template
      if (section.template) {
        try {
          const html = await this.loadTemplate(section.template);
          sectionElement.innerHTML = html;
        } catch (error) {
          console.warn(`Failed to load template for ${section.id}:`, error);
          sectionElement.innerHTML = this.getFallbackContent(section.id);
        }
      }

      // Load and initialize module
      if (section.module) {
        try {
          const module = await import(section.module);
          if (module.default && typeof module.default === 'function') {
            await module.default(sectionElement);
          }
          if (module.init && typeof module.init === 'function') {
            await module.init(sectionElement);
          }
        } catch (error) {
          console.warn(`Failed to load module for ${section.id}:`, error);
        }
      }

      // Update state
      sectionElement.classList.remove('loading', 'section-placeholder');
      sectionElement.classList.add('loaded');
      this.loadedSections.add(section.id);

      // Process any lazy-load elements in the new content
      if (window.lazyLoader) {
        window.lazyLoader.refresh();
      }

      // Dispatch loaded event
      sectionElement.dispatchEvent(new CustomEvent('sectionloaded', {
        detail: { sectionId: section.id, element: sectionElement }
      }));

    } catch (error) {
      console.error(`Failed to load section ${section.id}:`, error);
    } finally {
      this.currentLoads--;
      this.processLoadQueue();
    }
  }

  async loadTemplate(templatePath) {
    // Try to load from cache first
    const cacheKey = `template_${templatePath}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Fetch template
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Cache the template
    this.setCache(cacheKey, html);
    
    return html;
  }

  processLoadQueue() {
    if (this.loadQueue.size === 0 || this.currentLoads >= this.maxConcurrentLoads) {
      return;
    }

    // Load next item in queue
    const [sectionId, { section, container }] = this.loadQueue.entries().next().value;
    this.loadQueue.delete(sectionId);
    this.loadSection(section, container);
  }

  getFallbackContent(sectionId) {
    const fallbacks = {
      services: `
        <div class="container">
          <header class="section__header">
            <h2 class="section__title">Our Services</h2>
            <p class="section__description">Comprehensive digital solutions tailored to your business needs</p>
          </header>
          <div class="services-grid">
            <div class="service-card">
              <h3>Web Development</h3>
              <p>Custom websites and web applications built with modern technologies.</p>
            </div>
            <div class="service-card">
              <h3>Mobile Apps</h3>
              <p>Native and cross-platform mobile applications for iOS and Android.</p>
            </div>
            <div class="service-card">
              <h3>Digital Marketing</h3>
              <p>Strategic marketing campaigns to grow your online presence.</p>
            </div>
          </div>
        </div>
      `,
      contact: `
        <div class="container">
          <header class="section__header">
            <h2 class="section__title">Get In Touch</h2>
            <p class="section__description">Ready to start your next project? Let's discuss how we can help you achieve your goals</p>
          </header>
          <div class="contact-form">
            <form>
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit" class="btn btn--primary">Send Message</button>
            </form>
          </div>
        </div>
      `
    };

    return fallbacks[sectionId] || `
      <div class="container">
        <div class="section-error">
          <h2>Section Unavailable</h2>
          <p>This section could not be loaded. Please try refreshing the page.</p>
        </div>
      </div>
    `;
  }

  // Simple cache implementation
  setCache(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000 // 5 minutes
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to cache template:', error);
    }
  }

  getFromCache(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > data.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.warn('Failed to retrieve from cache:', error);
      return null;
    }
  }

  // Public API
  async loadSectionById(sectionId) {
    // Force load a specific section
    const container = document.getElementById('content-sections');
    if (!container) return false;

    const section = { id: sectionId, template: `sections/${sectionId}.html`, module: `js/modules/${sectionId}.js`, priority: 1 };
    await this.loadSection(section, container);
    return true;
  }

  isLoaded(sectionId) {
    return this.loadedSections.has(sectionId);
  }

  getLoadedSections() {
    return Array.from(this.loadedSections);
  }
}

// Export the loader function
export async function loadContentSections() {
  const loader = new ContentLoader();
  await loader.loadContentSections();
  window.contentLoader = loader;
}

export default ContentLoader;