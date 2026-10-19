/**
 * Integrated Mini-Apps Modal System
 * Modern, responsive modal with collapsible app selector
 */

class IntegratedMiniApps {
    constructor() {
        this.apps = {
            'website-analyzer': {
                name: 'Website Analyzer',
                url: '/mini-apps/website-analyzer.html',
                description: 'Comprehensive website analysis - performance, SEO, and accessibility'
            },
            'roi-calculator': {
                name: 'ROI Calculator',
                url: '/mini-apps/roi-calculator.html',
                description: 'Calculate marketing return on investment'
            },
            'color-palette': {
                name: 'Color Palette',
                url: '/mini-apps/color-palette.html',
                description: 'Generate beautiful color palettes'
            },
            'kmt-link': {
                name: 'KMT Link',
                url: '/mini-apps/kmtlink-simple.html',
                description: 'Smart link management tool'
            }
        };

        this.currentApp = null;
        this.modal = null;
        this.appSelector = null;
        this.modalContent = null;
        this.isCollapsed = false;
        
        this.init();
    }

    init() {
        console.log('🚀 IntegratedMiniApps: Initializing...');
        
        this.setupElements();
        this.setupEventListeners();
        
        console.log('✅ IntegratedMiniApps: Ready');
    }

    setupElements() {
        this.modal = document.getElementById('miniAppsModal');
        this.appSelector = document.getElementById('appSelector');
        this.modalContent = document.getElementById('modalContent');
        
        if (!this.modal || !this.appSelector || !this.modalContent) {
            console.error('Required modal elements not found');
            return;
        }
    }

    setupEventListeners() {
        // App card clicks to open modal
        document.querySelectorAll('.mini-app-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const appId = e.currentTarget.dataset.app;
                this.openModal(appId);
            });
        });

        // App tab clicks to switch apps
        document.querySelectorAll('.app-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const appId = e.currentTarget.dataset.app;
                this.switchApp(appId);
            });
        });

        // Modal close button
        const closeBtn = document.getElementById('miniAppsModalClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Modal backdrop click to close
        const backdrop = this.modal?.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeModal());
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Auto-collapse app selector when an app is loaded
        const resizeObserver = new ResizeObserver(() => {
            this.checkCollapse();
        });
        
        if (this.modalContent) {
            resizeObserver.observe(this.modalContent);
        }
    }

    openModal(appId) {
        if (!this.modal || !this.apps[appId]) {
            console.error('Cannot open modal:', { appId, hasModal: !!this.modal, hasApp: !!this.apps[appId] });
            return;
        }

        // Check if user is authenticated before opening mini-apps
        if (!this.checkAuthentication()) {
            this.showAuthPrompt();
            return;
        }

        console.log('Opening modal with app:', appId);
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Set active tab
        this.setActiveTab(appId);
        
        // Load app
        this.loadApp(appId);
        
        // Focus management
        this.modal.focus();
    }

    closeModal() {
        if (!this.modal) return;

        console.log('Closing modal');
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear content after animation
        setTimeout(() => {
            this.clearContent();
            this.currentApp = null;
            this.expandSelector();
        }, 300);
    }

    switchApp(appId) {
        if (!this.apps[appId] || this.currentApp === appId) return;

        console.log('Switching to app:', appId);
        
        this.setActiveTab(appId);
        this.loadApp(appId);
    }

    setActiveTab(appId) {
        // Remove active class from all tabs
        document.querySelectorAll('.app-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Add active class to selected tab
        const selectedTab = document.querySelector(`.app-tab[data-app="${appId}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
    }

    loadApp(appId) {
        const app = this.apps[appId];
        if (!app || !this.modalContent) {
            console.error('Cannot load app:', { appId, hasApp: !!app, hasModalContent: !!this.modalContent });
            return;
        }

        this.currentApp = appId;
        console.log('Loading app:', appId, 'URL:', app.url);
        
        // Show loading state
        this.showLoading();
        
        // Collapse selector after a delay to allow user to see the transition
        setTimeout(() => {
            this.collapseSelector();
        }, 500);

        // Create iframe for app
        const iframe = document.createElement('iframe');
        iframe.className = 'app-iframe';
        iframe.src = app.url;
        iframe.title = app.name;
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
        
        // Handle iframe load
        iframe.onload = () => {
            console.log(`App ${appId} iframe loaded successfully`);

            // Listen for app-ready message from child iframe
            const messageHandler = (event) => {
                if (event.data.type === 'app-ready' && event.data.appId === appId) {
                    console.log(`📨 ${appId} sent app-ready signal`);
                    this.sendAuthToApp(iframe, appId);
                    window.removeEventListener('message', messageHandler);
                }
            };
            window.addEventListener('message', messageHandler);
        };

        // Handle iframe error
        iframe.onerror = (error) => {
            console.error('Iframe error:', error);
            this.showError(`Failed to load ${app.name}`);
            console.error(`Failed to load app: ${appId}`);
        };

        // Add iframe to DOM after a short delay to ensure modal is ready
        setTimeout(() => {
            this.clearContent();
            this.modalContent.appendChild(iframe);
        }, 200);

        // Fallback timeout
        setTimeout(() => {
            if (this.modalContent.querySelector('.app-loading')) {
                console.warn(`App ${appId} timeout - still loading after 10s`);
                this.showError(`${app.name} is taking too long to load`);
            }
        }, 10000);
    }

    showLoading() {
        if (!this.modalContent) return;
        
        this.modalContent.innerHTML = `
            <div class="app-loading">
                <div class="loading-spinner"></div>
                <p>Loading ${this.apps[this.currentApp]?.name || 'app'}...</p>
            </div>
        `;
    }

    showError(message) {
        if (!this.modalContent) return;
        
        this.modalContent.innerHTML = `
            <div class="app-loading">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--color-danger); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">⚠️</div>
                <p style="color: var(--color-danger);">${message}</p>
                <button onclick="window.integratedMiniApps.retryCurrentApp()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }

    retryCurrentApp() {
        if (this.currentApp) {
            this.loadApp(this.currentApp);
        }
    }

    clearContent() {
        if (this.modalContent) {
            this.modalContent.innerHTML = '';
        }
    }

    collapseSelector() {
        if (this.appSelector && !this.isCollapsed) {
            this.appSelector.classList.add('collapsed');
            this.isCollapsed = true;
            console.log('App selector collapsed');
        }
    }

    expandSelector() {
        if (this.appSelector && this.isCollapsed) {
            this.appSelector.classList.remove('collapsed');
            this.isCollapsed = false;
            console.log('App selector expanded');
        }
    }

    async sendAuthToApp(iframe, appId) {
        console.log(`🔐 Sending auth data to ${appId}...`);

        // Get auth data from Supabase auth manager
        if (window.authManager && window.authManager.isLoggedIn()) {
            const user = window.authManager.getUser();

            if (user) {
                try {
                    const accessToken = await window.authManager.getAccessToken();
                    const authData = {
                        type: 'init',
                        appId: appId,
                        auth: {
                            user: {
                                id: user.id || user.uid,
                                email: user.email,
                                username: user.email?.split('@')[0],
                                display_name: user.user_metadata?.full_name || user.displayName || user.email?.split('@')[0],
                                avatar_url: user.user_metadata?.avatar_url || user.photoURL
                            },
                            token: accessToken
                        }
                    };

                    console.log(`✅ Sending auth data to ${appId}:`, authData.auth.user.email);
                    iframe.contentWindow.postMessage(authData, window.location.origin);
                } catch (error) {
                    console.error(`❌ Error getting auth token for ${appId}:`, error);
                }
            } else {
                console.warn(`⚠️ User not fully loaded for ${appId}`);
            }
        } else {
            console.log(`ℹ️ User not logged in, ${appId} will show login screen`);
        }
    }

    checkCollapse() {
        // Auto-collapse logic based on content
        const hasContent = this.modalContent?.querySelector('.app-iframe');
        
        if (hasContent && !this.isCollapsed) {
            this.collapseSelector();
        } else if (!hasContent && this.isCollapsed) {
            this.expandSelector();
        }
    }

    // Public API methods
    openApp(appId) {
        this.openModal(appId);
    }

    closeApp() {
        this.closeModal();
    }

    isModalOpen() {
        return this.modal?.classList.contains('active') || false;
    }

    getCurrentApp() {
        return this.currentApp;
    }

    getAvailableApps() {
        return Object.keys(this.apps);
    }

    // Authentication methods
    checkAuthentication() {
        // Check if Supabase Auth Manager is available and user is logged in
        if (window.authManager && window.authManager.isLoggedIn) {
            return window.authManager.isLoggedIn();
        }
        
        // Strict lead capture: No localStorage fallback allowed
        return false;
    }

    showAuthPrompt() {
        // Create authentication prompt overlay
        const authPrompt = document.createElement('div');
        authPrompt.className = 'auth-prompt-overlay';
        authPrompt.innerHTML = `
            <div class="auth-prompt-container">
                <div class="auth-prompt-content">
                    <div class="auth-prompt-header">
                        <h3>Sign In Required</h3>
                        <button class="auth-prompt-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="auth-prompt-body">
                        <p>Please sign in to access our free business tools and get personalized insights.</p>
                        <div class="auth-prompt-benefits">
                            <div class="benefit-item">
                                <span class="benefit-icon">🚀</span>
                                <span>Access all mini-apps</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">💾</span>
                                <span>Save your work</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">📊</span>
                                <span>Track your progress</span>
                            </div>
                        </div>
                    </div>
                    <div class="auth-prompt-actions">
                        <button class="btn btn-primary auth-signin-btn">Sign In</button>
                        <button class="btn btn-secondary auth-cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles for the auth prompt
        const style = document.createElement('style');
        style.textContent = `
            .auth-prompt-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .auth-prompt-container {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 16px;
                border: 1px solid rgba(96, 165, 250, 0.3);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 400px;
                width: 90%;
                animation: slideIn 0.3s ease;
            }

            .auth-prompt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px 0;
            }

            .auth-prompt-header h3 {
                color: #ffffff;
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }

            .auth-prompt-close {
                background: none;
                border: none;
                color: #9ca3af;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.2s;
            }

            .auth-prompt-close:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }

            .auth-prompt-body {
                padding: 20px 24px;
            }

            .auth-prompt-body p {
                color: #e5e7eb;
                margin: 0 0 20px 0;
                line-height: 1.6;
            }

            .auth-prompt-benefits {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .benefit-item {
                display: flex;
                align-items: center;
                gap: 12px;
                color: #d1d5db;
                font-size: 0.9rem;
            }

            .benefit-icon {
                font-size: 1.2rem;
            }

            .auth-prompt-actions {
                display: flex;
                gap: 12px;
                padding: 0 24px 24px;
            }

            .auth-prompt-actions .btn {
                flex: 1;
                padding: 12px 16px;
                border-radius: 8px;
                border: none;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .auth-prompt-actions .btn-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
            }

            .auth-prompt-actions .btn-primary:hover {
                background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
                transform: translateY(-1px);
                box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
            }

            .auth-prompt-actions .btn-secondary {
                background: rgba(75, 85, 99, 0.5);
                color: #d1d5db;
                border: 1px solid rgba(75, 85, 99, 0.8);
            }

            .auth-prompt-actions .btn-secondary:hover {
                background: rgba(75, 85, 99, 0.8);
                border-color: rgba(107, 114, 128, 1);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { transform: translateY(-20px) scale(0.95); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Add to DOM
        document.body.appendChild(authPrompt);

        // Event handlers
        const closePrompt = () => {
            authPrompt.remove();
            style.remove();
        };

        authPrompt.querySelector('.auth-prompt-close').addEventListener('click', closePrompt);
        authPrompt.querySelector('.auth-cancel-btn').addEventListener('click', closePrompt);
        authPrompt.querySelector('.auth-signin-btn').addEventListener('click', () => {
            closePrompt();
            // Use the proper auth-ui system
            if (window.authUI && window.authUI.showModal) {
                window.authUI.showModal();
            } else if (window.authUI && window.authUI.showAuthModal) {
                window.authUI.showAuthModal();
            } else if (document.querySelector('#loginBtn')) {
                document.querySelector('#loginBtn').click();
            } else {
                alert('Please sign in to access the mini-apps.');
            }
        });

        // Close on overlay click
        authPrompt.addEventListener('click', (e) => {
            if (e.target === authPrompt) {
                closePrompt();
            }
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closePrompt();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Auto-initialize when DOM is ready
function initIntegratedMiniApps() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.integratedMiniApps = new IntegratedMiniApps();
        });
    } else {
        window.integratedMiniApps = new IntegratedMiniApps();
    }
}

// Initialize
initIntegratedMiniApps();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegratedMiniApps;
}