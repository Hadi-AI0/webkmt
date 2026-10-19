/**
 * Testimonials Carousel
 * Handles the one-at-a-time display of testimonials with navigation
 */

class TestimonialsCarousel {
  constructor() {
    this.currentIndex = 0;
    this.testimonials = [];
    this.dots = [];
    this.init();
  }

  init() {
    // Get all testimonial elements
    this.testimonials = document.querySelectorAll('.testimonial-card');
    this.dots = document.querySelectorAll('.carousel-dot');
    
    // Get navigation buttons
    this.prevBtn = document.querySelector('.carousel-btn--prev');
    this.nextBtn = document.querySelector('.carousel-btn--next');

    if (!this.testimonials.length) return;

    // Set up initial state
    this.showTestimonial(0);
    
    // Add event listeners
    this.addEventListeners();
    
    // Start auto-rotation
    this.startAutoRotation();
  }

  addEventListeners() {
    // Previous button
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.stopAutoRotation();
        this.previousTestimonial();
        this.startAutoRotation();
      });
    }

    // Next button  
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.stopAutoRotation();
        this.nextTestimonial();
        this.startAutoRotation();
      });
    }

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.stopAutoRotation();
        this.showTestimonial(index);
        this.startAutoRotation();
      });
    });

    // Pause on hover
    const carousel = document.querySelector('.testimonials__carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoRotation());
      carousel.addEventListener('mouseleave', () => this.startAutoRotation());
    }
  }

  showTestimonial(index) {
    // Remove active class from all testimonials
    this.testimonials.forEach(testimonial => {
      testimonial.classList.remove('active');
    });

    // Remove active class from all dots
    this.dots.forEach(dot => {
      dot.classList.remove('carousel-dot--active');
    });

    // Set current index
    this.currentIndex = index;

    // Show current testimonial
    if (this.testimonials[this.currentIndex]) {
      this.testimonials[this.currentIndex].classList.add('active');
    }

    // Update active dot
    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add('carousel-dot--active');
    }
  }

  nextTestimonial() {
    const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.showTestimonial(nextIndex);
  }

  previousTestimonial() {
    const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.showTestimonial(prevIndex);
  }

  startAutoRotation() {
    this.stopAutoRotation(); // Clear any existing interval
    this.autoRotationInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000); // Change testimonial every 5 seconds
  }

  stopAutoRotation() {
    if (this.autoRotationInterval) {
      clearInterval(this.autoRotationInterval);
      this.autoRotationInterval = null;
    }
  }

  // Public method to update testimonials dynamically
  refresh() {
    this.testimonials = document.querySelectorAll('.testimonial-card');
    this.dots = document.querySelectorAll('.carousel-dot');
    if (this.testimonials.length > 0) {
      this.showTestimonial(0);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.testimonialsCarousel = new TestimonialsCarousel();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestimonialsCarousel;
}