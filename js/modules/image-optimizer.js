/**
 * Image Optimization Module
 * Handles WebP/AVIF conversion, lazy loading, and responsive images
 */

class ImageOptimizer {
  constructor() {
    this.supportedFormats = {
      webp: false,
      avif: false
    };
    this.optimizedImages = new Map();
    this.conversionQueue = new Map();
    this.maxConcurrentConversions = 3;
    this.currentConversions = 0;
    
    this.init();
  }

  async init() {
    // Detect format support
    await this.detectFormatSupport();
    
    // Set up image optimization
    this.setupImageObserver();
    this.setupResponsiveImages();
    
    console.log('Image Optimizer initialized:', this.supportedFormats);
  }

  async detectFormatSupport() {
    this.supportedFormats.webp = await this.supportsWebP();
    this.supportedFormats.avif = await this.supportsAVIF();
  }

  supportsWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  supportsAVIF() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  setupImageObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.optimizeImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px 50px 0px',
      threshold: 0.01
    });

    // Observe all images that need optimization
    document.querySelectorAll('img[data-optimize], img.optimize').forEach(img => {
      observer.observe(img);
    });

    // Set up mutation observer for dynamic images
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const images = node.tagName === 'IMG' 
              ? [node] 
              : node.querySelectorAll('img[data-optimize], img.optimize');
            
            images.forEach(img => observer.observe(img));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupResponsiveImages() {
    // Update responsive images on viewport change
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateResponsiveImages();
      }, 250);
    });
  }

  async optimizeImage(img) {
    if (this.optimizedImages.has(img)) return;

    try {
      const originalSrc = img.src || img.dataset.src;
      if (!originalSrc) return;

      // Add to optimized set to prevent duplicate processing
      this.optimizedImages.set(img, { status: 'processing' });

      // Create optimized version
      const optimizedSrc = await this.createOptimizedVersion(originalSrc, img);
      
      if (optimizedSrc && optimizedSrc !== originalSrc) {
        // Update image source
        if (img.dataset.src) {
          img.dataset.src = optimizedSrc;
        } else {
          await this.loadOptimizedImage(img, optimizedSrc);
        }
        
        this.optimizedImages.set(img, { 
          status: 'completed', 
          originalSrc, 
          optimizedSrc,
          savedBytes: await this.calculateSavings(originalSrc, optimizedSrc)
        });
      } else {
        this.optimizedImages.set(img, { status: 'no-optimization' });
      }

    } catch (error) {
      console.warn('Image optimization failed:', error);
      this.optimizedImages.set(img, { status: 'failed', error: error.message });
    }
  }

  async createOptimizedVersion(originalSrc, img) {
    // Check if we already have an optimized version
    const cacheKey = this.getCacheKey(originalSrc, img);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Determine best format
    const bestFormat = this.getBestFormat(originalSrc);
    if (!bestFormat || bestFormat === this.getImageFormat(originalSrc)) {
      return originalSrc; // No optimization possible
    }

    try {
      // Convert image to best format
      const optimizedBlob = await this.convertImage(originalSrc, bestFormat, img);
      const optimizedUrl = URL.createObjectURL(optimizedBlob);
      
      // Cache the result
      this.setCache(cacheKey, optimizedUrl);
      
      return optimizedUrl;

    } catch (error) {
      console.warn('Image conversion failed:', error);
      return originalSrc;
    }
  }

  async convertImage(src, targetFormat, img) {
    // Queue conversion to prevent overwhelming the browser
    if (this.currentConversions >= this.maxConcurrentConversions) {
      return new Promise((resolve, reject) => {
        this.conversionQueue.set(Date.now(), { src, targetFormat, img, resolve, reject });
      });
    }

    this.currentConversions++;

    try {
      // Load original image
      const originalImage = await this.loadImage(src);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate optimal dimensions
      const { width, height } = this.calculateOptimalDimensions(originalImage, img);
      canvas.width = width;
      canvas.height = height;
      
      // Draw image
      ctx.drawImage(originalImage, 0, 0, width, height);
      
      // Convert to target format
      const quality = this.getOptimalQuality(targetFormat);
      const mimeType = `image/${targetFormat}`;
      
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Conversion failed'));
          }
        }, mimeType, quality);
      });

    } finally {
      this.currentConversions--;
      this.processConversionQueue();
    }
  }

  processConversionQueue() {
    if (this.conversionQueue.size === 0 || this.currentConversions >= this.maxConcurrentConversions) {
      return;
    }

    // Process next item in queue
    const [timestamp, { src, targetFormat, img, resolve, reject }] = this.conversionQueue.entries().next().value;
    this.conversionQueue.delete(timestamp);
    
    this.convertImage(src, targetFormat, img).then(resolve).catch(reject);
  }

  calculateOptimalDimensions(originalImage, img) {
    const containerWidth = img.clientWidth || img.naturalWidth || originalImage.width;
    const containerHeight = img.clientHeight || img.naturalHeight || originalImage.height;
    
    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate responsive dimensions
    const maxWidth = Math.min(containerWidth * dpr, originalImage.width);
    const maxHeight = Math.min(containerHeight * dpr, originalImage.height);
    
    // Maintain aspect ratio
    const aspectRatio = originalImage.width / originalImage.height;
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  getBestFormat(src) {
    const currentFormat = this.getImageFormat(src);
    
    // If already in optimal format, no conversion needed
    if (this.supportedFormats.avif && currentFormat !== 'avif') {
      return 'avif';
    }
    
    if (this.supportedFormats.webp && currentFormat !== 'webp' && currentFormat !== 'avif') {
      return 'webp';
    }
    
    return null; // No better format available
  }

  getImageFormat(src) {
    const extension = src.split('.').pop().toLowerCase().split('?')[0];
    return extension;
  }

  getOptimalQuality(format) {
    const qualityMap = {
      'webp': 0.85,
      'avif': 0.80,
      'jpeg': 0.85,
      'jpg': 0.85
    };
    
    return qualityMap[format] || 0.85;
  }

  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async loadOptimizedImage(img, optimizedSrc) {
    return new Promise((resolve, reject) => {
      const tempImg = new Image();
      tempImg.onload = () => {
        img.src = optimizedSrc;
        img.classList.add('optimized');
        resolve();
      };
      tempImg.onerror = reject;
      tempImg.src = optimizedSrc;
    });
  }

  updateResponsiveImages() {
    // Re-optimize images when viewport changes significantly
    const optimizedImages = Array.from(this.optimizedImages.keys());
    
    optimizedImages.forEach(img => {
      if (this.shouldReoptimize(img)) {
        this.optimizedImages.delete(img);
        this.optimizeImage(img);
      }
    });
  }

  shouldReoptimize(img) {
    const optimization = this.optimizedImages.get(img);
    if (!optimization || optimization.status !== 'completed') return false;
    
    // Check if image dimensions changed significantly
    const currentWidth = img.clientWidth;
    const optimizedWidth = optimization.optimizedWidth || currentWidth;
    
    return Math.abs(currentWidth - optimizedWidth) > 100;
  }

  // Cache management
  getCacheKey(src, img) {
    const width = img.clientWidth || 'auto';
    const height = img.clientHeight || 'auto';
    const dpr = window.devicePixelRatio || 1;
    
    return `img_${this.hashString(src)}_${width}x${height}_${dpr}`;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  setCache(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        ttl: 24 * 60 * 60 * 1000 // 24 hours
      };
      localStorage.setItem(`imgopt_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to cache optimized image:', error);
    }
  }

  getFromCache(key) {
    try {
      const cached = localStorage.getItem(`imgopt_${key}`);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp > data.ttl) {
        localStorage.removeItem(`imgopt_${key}`);
        return null;
      }

      return data.value;
    } catch (error) {
      console.warn('Failed to retrieve from cache:', error);
      return null;
    }
  }

  async calculateSavings(originalSrc, optimizedSrc) {
    try {
      const [originalSize, optimizedSize] = await Promise.all([
        this.getImageSize(originalSrc),
        this.getImageSize(optimizedSrc)
      ]);
      
      return originalSize - optimizedSize;
    } catch (error) {
      return 0;
    }
  }

  async getImageSize(src) {
    try {
      const response = await fetch(src, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Public API
  async optimizeAllImages() {
    const images = document.querySelectorAll('img');
    const promises = Array.from(images).map(img => this.optimizeImage(img));
    await Promise.allSettled(promises);
  }

  getOptimizationStats() {
    const stats = {
      totalImages: this.optimizedImages.size,
      optimized: 0,
      failed: 0,
      noOptimization: 0,
      totalSavings: 0
    };

    this.optimizedImages.forEach(optimization => {
      switch (optimization.status) {
        case 'completed':
          stats.optimized++;
          stats.totalSavings += optimization.savedBytes || 0;
          break;
        case 'failed':
          stats.failed++;
          break;
        case 'no-optimization':
          stats.noOptimization++;
          break;
      }
    });

    return stats;
  }

  // Helper function to create responsive picture element
  static createResponsivePicture(src, alt, options = {}) {
    const {
      sizes = '100vw',
      breakpoints = [480, 768, 1024, 1280],
      className = '',
      loading = 'lazy'
    } = options;

    const picture = document.createElement('picture');
    
    // Generate sources for different formats and sizes
    const formats = ['avif', 'webp'];
    
    formats.forEach(format => {
      const source = document.createElement('source');
      const srcset = breakpoints.map(width => {
        const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
        return `${optimizedSrc}?w=${width} ${width}w`;
      }).join(', ');
      
      source.srcset = srcset;
      source.sizes = sizes;
      source.type = `image/${format}`;
      picture.appendChild(source);
    });
    
    // Fallback image
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = loading;
    img.className = className;
    img.classList.add('optimize');
    
    picture.appendChild(img);
    return picture;
  }
}

// Initialize image optimizer
const imageOptimizer = new ImageOptimizer();

// Make available globally
window.imageOptimizer = imageOptimizer;

export default ImageOptimizer;