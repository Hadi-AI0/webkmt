/**
 * Enhanced Forms JavaScript - Newsletter and Contact Forms
 * Handles form interactions, validation, and API integration preparation
 */

class FormsManager {
    constructor() {
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        this.initNewsletterForm();
        this.initMainNewsletterForm();
        this.initQuoteForm();
        this.setupLanguageListener();
    }

    setupLanguageListener() {
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.updateFormLabels();
        });
    }

    // ===============================================
    // Newsletter Form Management
    // ===============================================

    initNewsletterForm() {
        const form = document.querySelector('.newsletter-form-enhanced');
        if (!form) return;

        this.newsletterState = {
            step: 1,
            email: '',
            name: '',
            isValid: false
        };

        this.setupNewsletterEvents();
    }

    setupNewsletterEvents() {
        const emailInput = document.querySelector('#newsletter-email-enhanced');
        const nameStep = document.querySelector('#newsletter-name-step');
        const form = document.querySelector('.newsletter-form-enhanced');

        if (emailInput) {
            emailInput.addEventListener('input', (e) => {
                this.handleEmailInput(e.target.value);
            });

            emailInput.addEventListener('blur', (e) => {
                this.validateEmail(e.target);
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                this.handleNewsletterSubmit(e);
            });
        }
    }

    handleEmailInput(email) {
        this.newsletterState.email = email;
        const isValidEmail = this.isValidEmail(email);
        const emailInput = document.querySelector('#newsletter-email-enhanced');
        const nameStep = document.querySelector('#newsletter-name-step');
        
        if (isValidEmail && this.newsletterState.step === 1) {
            // Show success icon
            this.showInputIcon(emailInput, 'success');
            
            // Expand to show name field after delay
            setTimeout(() => {
                this.expandToNameStep();
            }, 500);
        } else if (!isValidEmail && email.length > 0) {
            this.showInputIcon(emailInput, 'error');
        } else {
            this.hideInputIcon(emailInput);
        }
    }

    expandToNameStep() {
        const nameStep = document.querySelector('#newsletter-name-step');
        const emailStep = document.querySelector('#newsletter-email-step');
        
        if (nameStep && emailStep) {
            emailStep.classList.add('completed');
            nameStep.classList.add('active');
            this.newsletterState.step = 2;

            // Focus on name input after animation
            setTimeout(() => {
                const nameInput = document.querySelector('#newsletter-name-enhanced');
                if (nameInput) {
                    nameInput.focus();
                    nameInput.addEventListener('input', (e) => {
                        this.newsletterState.name = e.target.value;
                        this.updateSubmitButton();
                    });
                }
            }, 300);
        }
    }

    updateSubmitButton() {
        const button = document.querySelector('.newsletter-button-enhanced');
        const isValid = this.isValidEmail(this.newsletterState.email) && 
                       this.newsletterState.name.trim().length > 1;
        
        if (button) {
            button.disabled = !isValid;
            if (isValid) {
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    ${this.getTranslation('newsletter.subscribe')}
                `;
            }
        }
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const button = document.querySelector('.newsletter-button-enhanced');
        const messageContainer = document.querySelector('#newsletter-message');
        
        // Show loading state
        this.setButtonLoading(button, true);
        
        try {
            const response = await this.submitNewsletterData({
                email: this.newsletterState.email,
                name: this.newsletterState.name,
                language: this.currentLanguage,
                source: 'website_footer',
                timestamp: new Date().toISOString()
            });

            if (response.success) {
                this.showMessage(messageContainer, 'success', this.getTranslation('newsletter.success'));
                this.resetNewsletterForm();
            } else {
                throw new Error(response.message || 'Subscription failed');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showMessage(messageContainer, 'error', this.getTranslation('newsletter.error'));
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    async submitNewsletterData(data) {
        // Prepare for API integration
        console.log('Newsletter subscription data:', data);
        
        // Simulate API call for now
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Subscribed successfully' });
            }, 1500);
        });

        // TODO: Replace with actual API call
        /*
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            return await response.json();
        } catch (error) {
            throw new Error('Network error');
        }
        */
    }

    // ===============================================
    // Main Newsletter Form (Footer)
    // ===============================================

    initMainNewsletterForm() {
        const form = document.querySelector('.newsletter__form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleMainNewsletterSubmit(form);
        });
    }

    async handleMainNewsletterSubmit(form) {
        const emailInput = form.querySelector('input[name="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!email) {
            this.showNewsletterMessage(form, 'Please enter a valid email address', 'error');
            return;
        }

        // Set loading state
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';

        try {
            const response = await fetch('/api/contact/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                this.showNewsletterMessage(form, data.message || 'Successfully subscribed!', 'success');
                emailInput.value = '';
            } else {
                this.showNewsletterMessage(form, data.error || 'Subscription failed', 'error');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showNewsletterMessage(form, 'Network error. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    showNewsletterMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `newsletter-message newsletter-message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem;
            border-radius: 4px;
            font-size: 0.875rem;
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
            ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        `;

        form.appendChild(messageEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    // ===============================================
    // Multi-Step Quote Form Management
    // ===============================================

    initQuoteForm() {
        this.quoteForm = document.getElementById('quoteForm');
        if (!this.quoteForm) return;

        this.currentStep = 1;
        this.totalSteps = 5;
        this.quoteData = {
            projectType: [],
            systemStatus: '',
            timeline: '',
            budget: '',
            name: '',
            email: '',
            phone: '',
            message: ''
        };

        this.setupQuoteEvents();
    }

    setupQuoteEvents() {
        // Next buttons
        const nextBtns = this.quoteForm.querySelectorAll('.next-step');
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateStep(this.currentStep)) {
                    this.currentStep++;
                    this.updateQuoteUI();
                }
            });
        });

        // Prev buttons
        const prevBtns = this.quoteForm.querySelectorAll('.prev-step');
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentStep--;
                this.updateQuoteUI();
            });
        });

        // Submit form
        this.quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.validateStep(this.currentStep)) {
                await this.submitQuoteForm();
            }
        });

        // Collect checkboxes for Step 1
        const checkboxes = this.quoteForm.querySelectorAll('input[name="project_type"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    this.quoteData.projectType.push(cb.value);
                } else {
                    this.quoteData.projectType = this.quoteData.projectType.filter(val => val !== cb.value);
                }
            });
        });
    }

    validateStep(step) {
        if (step === 1) {
            if (this.quoteData.projectType.length === 0) {
                alert('Please select at least one project type.');
                return false;
            }
            return true;
        }
        
        if (step === 2) {
            const status = this.quoteForm.querySelector('input[name="system_status"]:checked');
            if (!status) {
                alert('Please select a system status.');
                return false;
            }
            this.quoteData.systemStatus = status.value;
            return true;
        }

        if (step === 3) {
            const timeline = this.quoteForm.querySelector('input[name="timeline"]:checked');
            if (!timeline) {
                alert('Please select a timeline.');
                return false;
            }
            this.quoteData.timeline = timeline.value;
            return true;
        }

        if (step === 4) {
            const budget = this.quoteForm.querySelector('input[name="budget"]:checked');
            if (!budget) {
                alert('Please select a budget range.');
                return false;
            }
            this.quoteData.budget = budget.value;
            return true;
        }

        if (step === 5) {
            const name = this.quoteForm.querySelector('input[name="name"]').value.trim();
            const email = this.quoteForm.querySelector('input[name="email"]').value.trim();
            if (!name || !email) {
                alert('Name and Email are required.');
                return false;
            }
            if (!this.isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return false;
            }
            this.quoteData.name = name;
            this.quoteData.email = email;
            this.quoteData.phone = this.quoteForm.querySelector('input[name="phone"]').value.trim();
            this.quoteData.message = this.quoteForm.querySelector('textarea[name="message"]').value.trim();
            return true;
        }

        return true;
    }

    updateQuoteUI() {
        // Hide all steps
        const steps = this.quoteForm.querySelectorAll('.form-step');
        steps.forEach(step => step.style.display = 'none');

        // Show current step
        const currentStepEl = this.quoteForm.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
            currentStepEl.classList.add('active');
        }

        // Update progress bar
        const progressBar = this.quoteForm.querySelector('#quoteProgress');
        const progressText = this.quoteForm.querySelector('#quoteProgressText');
        if (progressBar && progressText) {
            const percentage = ((this.currentStep - 1) / this.totalSteps) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    async submitQuoteForm() {
        const submitBtn = this.quoteForm.querySelector('#quoteSubmitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: this.quoteData.name,
                    email: this.quoteData.email,
                    phone: this.quoteData.phone,
                    message: `Quote Request Details:\n\n` +
                             `Project Types: ${this.quoteData.projectType.join(', ')}\n` +
                             `System Status: ${this.quoteData.systemStatus}\n` +
                             `Timeline: ${this.quoteData.timeline}\n` +
                             `Budget: ${this.quoteData.budget}\n\n` +
                             `Extra Details: ${this.quoteData.message}`,
                    subject: 'Quote Request',
                    service: 'custom_project'
                })
            });

            const data = await response.json();
            if (data.success) {
                // Show success state
                const steps = this.quoteForm.querySelectorAll('.form-step');
                steps.forEach(step => step.style.display = 'none');
                
                const successStep = this.quoteForm.querySelector('.success-state');
                if (successStep) {
                    successStep.style.display = 'block';
                }
                
                const progressContainer = this.quoteForm.querySelector('.form-progress');
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
            } else {
                alert(data.error || 'Failed to submit quote request.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        } catch (error) {
            console.error('Quote submission error:', error);
            alert('Network error. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async submitContactData(data) {
        // Prepare for API integration
        console.log('Contact form submission data:', data);

        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            throw new Error('Network error');
        }
    }

    // ===============================================
    // Utility Functions
    // ===============================================

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    showInputIcon(input, type) {
        const container = input.parentElement;
        let icon = container.querySelector('.input-icon');
        
        if (!icon) {
            icon = document.createElement('div');
            icon.className = 'input-icon';
            container.appendChild(icon);
        }
        
        icon.className = `input-icon show ${type}`;
        icon.innerHTML = type === 'success' ? 
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>' :
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    hideInputIcon(input) {
        const container = input.parentElement;
        const icon = container.querySelector('.input-icon');
        if (icon) {
            icon.classList.remove('show');
        }
    }

    showError(field, message) {
        const errorElement = field.parentElement.querySelector('.form-error') ||
                           field.parentElement.parentElement.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    hideError(field) {
        const errorElement = field.parentElement.querySelector('.form-error') ||
                           field.parentElement.parentElement.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    showMessage(container, type, message) {
        if (!container) return;
        
        container.className = `form-message ${type} show`;
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                ${type === 'success' ? 
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>' :
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
                }
                <span>${message}</span>
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            container.classList.remove('show');
        }, 5000);
    }

    setButtonLoading(button, isLoading) {
        if (!button) return;
        
        const originalText = button.textContent;
        
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <div class="button-loading">
                    <div class="button-spinner"></div>
                    <span>${this.getTranslation('common.sending')}</span>
                </div>
            `;
        } else {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    resetNewsletterForm() {
        this.newsletterState = {
            step: 1,
            email: '',
            name: '',
            isValid: false
        };
        
        document.querySelector('#newsletter-email-enhanced').value = '';
        document.querySelector('#newsletter-name-enhanced').value = '';
        document.querySelector('#newsletter-name-step').classList.remove('active');
        document.querySelector('#newsletter-email-step').classList.remove('completed');
    }

    resetContactForm() {
        this.contactState.currentStep = 1;
        this.contactState.data = {
            service: '',
            projectType: '',
            budget: '',
            timeline: '',
            description: '',
            name: '',
            email: '',
            phone: '',
            company: ''
        };
        
        // Reset form elements
        document.querySelectorAll('.service-option, .budget-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        document.querySelectorAll('.form-input-enhanced, .form-textarea-enhanced').forEach(el => {
            el.value = '';
            el.classList.remove('valid', 'invalid');
        });
        
        this.updateStepDisplay();
        this.updateProgressBar();
        this.updateNavigationButtons();
    }

    updateFormLabels() {
        // Update labels when language changes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.getTranslation(key);
        });
    }

    getTranslation(key) {
        // Integration with language manager
        if (window.languageManager) {
            return window.languageManager.getTranslation(key);
        }
        
        // Fallback translations
        const translations = {
            'newsletter.subscribe': 'Subscribe',
            'newsletter.success': 'Thank you for subscribing! You\'ll receive our latest updates.',
            'newsletter.error': 'Something went wrong. Please try again.',
            'contact.success': 'Thank you! Your message has been sent successfully.',
            'contact.error': 'Failed to send message. Please try again.',
            'validation.required': 'This field is required',
            'validation.email': 'Please enter a valid email address',
            'validation.phone': 'Please enter a valid phone number',
            'validation.name_min': 'Name must be at least 2 characters',
            'validation.description_min': 'Please provide more details (minimum 10 characters)',
            'common.sending': 'Sending...'
        };
        
        return translations[key] || key;
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formsManager = new FormsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormsManager;
}