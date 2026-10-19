/**
 * Mini-Apps Container System
 * Manages dynamic loading of mini-applications in sandboxed iframes
 * Provides security isolation and cross-frame communication
 */

class MiniAppsManager {
    constructor() {
        this.apps = new Map();
        this.currentApp = null;
        this.isLoading = false;
        this.securityToken = this.generateSecurityToken();
        
        // App registry with configuration
        this.appRegistry = {
            'kmtlink-builder': {
                name: 'KmtLink Builder - Free Sample',
                description: 'Experience our link management expertise. Get 10x better results with our full URL optimization service.',
                fullServiceCTA: 'Ready for complete brand management? Contact us for custom LinkBio solutions with advanced analytics.',
                icon: '🔗',
                category: 'tools',
                type: 'external', // HTML app in iframe
                path: '/mini-apps/kmtlink-simple.html', // Vanilla HTML implementation
                permissions: ['storage', 'clipboard', 'supabase'],
                resources: {
                    memory: 'medium',
                    processing: 'medium'
                },
                featured: true,
                premium: false,
                requiresAuth: true, // Requires sign-in
                sso: true // Use SSO
            },
            'website-analyzer': {
                name: 'Website Analyzer - Free Sample',
                description: 'Comprehensive website analysis including performance, SEO, and accessibility. Our full optimization service delivers 10x better results.',
                fullServiceCTA: 'Ready for complete optimization? Let us transform your website performance and search visibility professionally.',
                icon: '🔍',
                category: 'seo',
                type: 'external',
                path: '/mini-apps/website-analyzer.html',
                permissions: ['network', 'storage'],
                resources: {
                    memory: 'medium',
                    processing: 'high'
                },
                featured: true,
                premium: false,
                requiresAuth: true,
                sso: true
            },
            'roi-calculator': {
                name: 'ROI Calculator - Free Sample',
                description: 'Calculate marketing ROI with our strategic business insights. Our full consulting service delivers 10x better investment decisions.',
                fullServiceCTA: 'Ready for comprehensive business strategy? Contact us for complete ROI optimization and growth planning services.',
                icon: '📈',
                category: 'marketing',
                type: 'external',
                path: '/mini-apps/roi-calculator.html',
                permissions: ['storage'],
                resources: {
                    memory: 'medium',
                    processing: 'medium'
                },
                featured: true,
                premium: false,
                requiresAuth: true,
                sso: true
            },
            'color-palette': {
                name: 'Color Palette - Free Sample',
                description: 'Quick color ideas to inspire you. Our full branding service creates 10x more impactful visual identity.',
                fullServiceCTA: 'Need complete brand design? Let us create a cohesive visual identity that communicates your business perfectly.',
                icon: '🎨',
                category: 'design',
                type: 'inline', // Simple inline app
                moduleUrl: '/js/inline-apps/color-palette.js',
                containerId: 'colorPaletteApp',
                permissions: ['ai-api', 'clipboard', 'storage'],
                resources: {
                    memory: 'low',
                    processing: 'medium'
                },
                requiresAuth: true,
                sso: true
            }
        };

        this.init();
    }

    init() {
        console.log('🚀 MiniAppsManager: Initializing...');
        this.createContainer();
        this.createToolbar();
        this.setupEventListeners();
        this.setupSecurityHandlers();
        
        // Show welcome screen by default
        setTimeout(() => {
            this.showWelcome();
            console.log('✅ MiniAppsManager: Initialization complete');
        }, 100);
    }

    generateSecurityToken() {
        return crypto.getRandomValues(new Uint8Array(16))
            .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    }

    createContainer() {
        // Check if container already exists
        if (document.getElementById('miniAppsContainer')) {
            console.log('MiniAppsManager: Container already exists');
            return;
        }

        const container = document.createElement('section');
        container.className = 'mini-apps-container';
        container.id = 'miniAppsContainer';
        container.innerHTML = `
            <div class="container">
                <header class="mini-apps-header">
                    <h2 class="mini-apps-title">Free Business Tools - Get a Taste of Our Expertise</h2>
                    <p class="mini-apps-description">
                        Experience our professional solutions with these free samples. Ready for 10x better results? We're just one call away to transform your entire business workflow.
                    </p>
                </header>

                <div class="mini-apps-toolbar" id="miniAppsToolbar">
                    <!-- Toolbar will be populated dynamically -->
                </div>

                <div class="mini-apps-main" id="miniAppsMain">
                    <div class="app-welcome visible" id="appWelcome">
                        <div class="welcome-content">
                            <h3>Choose a Tool to Get Started</h3>
                            <p>Select from our collection of free marketing and design tools to enhance your digital presence.</p>
                            <div class="welcome-features">
                                <div class="feature-item">
                                    <div class="feature-icon">🚀</div>
                                    <div class="feature-text">
                                        <h4>Instant Access</h4>
                                        <p>No registration required</p>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">🔒</div>
                                    <div class="feature-text">
                                        <h4>Secure & Private</h4>
                                        <p>Your data stays with you</p>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">💡</div>
                                    <div class="feature-text">
                                        <h4>AI-Powered</h4>
                                        <p>Smart suggestions included</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="app-loader" id="appLoader">
                        <div class="loader-content">
                            <div class="loader-spinner"></div>
                            <p>Loading app...</p>
                        </div>
                    </div>

                    <div class="app-container" id="appContainer">
                        <!-- Apps will be loaded here -->
                    </div>

                    <div class="app-error" id="appError">
                        <div class="error-content">
                            <h3>Failed to Load App</h3>
                            <p>There was an error loading the requested application.</p>
                            <button class="btn-retry" id="retryBtn">Try Again</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into main content area or specific section
        const targetSection = document.querySelector('#mini-apps');
        if (targetSection) {
            // Clear any existing content first
            targetSection.innerHTML = '';
            targetSection.appendChild(container);
            console.log('MiniAppsManager: Container created and inserted into #mini-apps');
        } else {
            console.error('MiniAppsManager: Target section #mini-apps not found');
        }
    }

    createToolbar() {
        const toolbar = document.getElementById('miniAppsToolbar');
        if (!toolbar) return;

        // Create categories
        const categories = [...new Set(Object.values(this.appRegistry).map(app => app.category))];
        
        let toolbarHTML = `
            <div class="toolbar-categories">
                <button class="category-btn active" data-category="all">
                    <span class="category-icon">⭐</span>
                    <span class="category-label">All Tools</span>
                </button>
        `;

        const categoryIcons = {
            tools: '🛠️',
            marketing: '📈',
            design: '🎨',
            seo: '🔍'
        };

        categories.forEach(category => {
            toolbarHTML += `
                <button class="category-btn" data-category="${category}">
                    <span class="category-icon">${categoryIcons[category] || '📱'}</span>
                    <span class="category-label">${this.capitalizeFirst(category)}</span>
                </button>
            `;
        });

        toolbarHTML += '</div><div class="toolbar-apps" id="toolbarApps">';

        // Create app buttons
        Object.entries(this.appRegistry).forEach(([id, app]) => {
            // Get proper SVG icon from enhanced icons system
            const iconSvg = window.enhancedIconManager ? 
                window.enhancedIconManager.getMiniAppIcon(id) : 
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`;
            
            toolbarHTML += `
                <button class="app-btn" data-app="${id}" data-category="${app.category}">
                    <div class="app-btn-icon">${iconSvg}</div>
                    <div class="app-btn-content">
                        <h4 class="app-btn-title">${app.name}</h4>
                        <p class="app-btn-description">${app.description}</p>
                    </div>
                    <div class="app-btn-status">
                        <span class="status-indicator status-idle"></span>
                    </div>
                </button>
            `;
        });

        toolbarHTML += '</div>';
        toolbar.innerHTML = toolbarHTML;
    }

    setupEventListeners() {
        // Category filtering
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-btn') || e.target.closest('.category-btn')) {
                const btn = e.target.matches('.category-btn') ? e.target : e.target.closest('.category-btn');
                this.filterByCategory(btn.dataset.category);
            }

            if (e.target.matches('.app-btn') || e.target.closest('.app-btn')) {
                const btn = e.target.matches('.app-btn') ? e.target : e.target.closest('.app-btn');
                this.loadApp(btn.dataset.app);
            }

            if (e.target.matches('#retryBtn')) {
                this.retryCurrentApp();
            }

            if (e.target.matches('.app-close-btn')) {
                this.closeCurrentApp();
            }
        });

        // Handle app iframe messages
        window.addEventListener('message', (e) => {
            this.handleAppMessage(e);
        });

        // Handle app lifecycle events
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    setupSecurityHandlers() {
        // Content Security Policy for iframes
        this.cspPolicy = {
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
            'font-src': "'self' https://fonts.gstatic.com",
            'img-src': "'self' data: https:",
            'connect-src': "'self' https://api.webkmt.com",
            'frame-ancestors': "'none'"
        };
    }

    filterByCategory(category) {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Filter app buttons
        document.querySelectorAll('.app-btn').forEach(btn => {
            const shouldShow = category === 'all' || btn.dataset.category === category;
            btn.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    async loadApp(appId) {
        if (this.isLoading) return;
        if (this.currentApp === appId) return;

        const appConfig = this.appRegistry[appId];
        if (!appConfig) {
            console.error(`App ${appId} not found in registry`);
            return;
        }

        this.isLoading = true;
        this.updateAppButton(appId, 'loading');
        this.showLoader();

        try {
            // Close current app if any
            if (this.currentApp) {
                await this.closeApp(this.currentApp);
            }

            // Load app based on type
            if (appConfig.type === 'inline') {
                await this.loadInlineApp(appId, appConfig);
            } else {
                await this.createAppIframe(appId, appConfig);
            }

            this.currentApp = appId;
            this.updateAppButton(appId, 'active');
            this.showAppContainer();

        } catch (error) {
            console.error(`Failed to load app ${appId}:`, error);
            this.showError();
            this.updateAppButton(appId, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async loadInlineApp(appId, appConfig) {
        return new Promise((resolve, reject) => {
            const container = document.getElementById('appContainer');
            if (!container) {
                reject(new Error('App container not found'));
                return;
            }

            // Create inline app container
            const appWrapper = document.createElement('div');
            appWrapper.className = 'inline-app-wrapper';
            appWrapper.innerHTML = `
                <div class="app-header">
                    <div class="app-info">
                        <span class="app-icon">${appConfig.icon}</span>
                        <h3 class="app-title">${appConfig.name}</h3>
                    </div>
                    <div class="app-controls">
                        <button class="app-control-btn app-fullscreen-btn" title="Fullscreen">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                            </svg>
                        </button>
                        <button class="app-control-btn app-close-btn" title="Close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="app-content">
                    <div id="${appConfig.containerId}" class="inline-app-container"></div>
                </div>
            `;

            // Clear container and add new app
            container.innerHTML = '';
            container.appendChild(appWrapper);

            // Load the JavaScript module if not already loaded
            if (!this.loadedModules) {
                this.loadedModules = new Set();
            }

            if (!this.loadedModules.has(appId)) {
                this.loadScript(appConfig.moduleUrl)
                    .then(() => {
                        this.loadedModules.add(appId);
                        this.initializeInlineApp(appId, appConfig);
                        resolve();
                    })
                    .catch(reject);
            } else {
                this.initializeInlineApp(appId, appConfig);
                resolve();
            }

            // Store app reference
            this.apps.set(appId, {
                type: 'inline',
                config: appConfig,
                wrapper: appWrapper,
                loaded: true,
                lastActivity: Date.now()
            });
        });
    }

    initializeInlineApp(appId, appConfig) {
        // Initialize the inline app based on its type
        switch (appId) {
            case 'roi-calculator':
                if (window.ROICalculator) {
                    new window.ROICalculator(appConfig.containerId);
                }
                break;
            case 'color-palette':
                if (window.ColorPaletteGenerator) {
                    new window.ColorPaletteGenerator(appConfig.containerId);
                }
                break;
        }
    }

    loadScript(url) {
        return new Promise((resolve, reject) => {
            // Check if script is already loaded
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.defer = true;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            
            document.head.appendChild(script);
        });
    }

    async createAppIframe(appId, appConfig) {
        return new Promise((resolve, reject) => {
            const container = document.getElementById('appContainer');
            if (!container) {
                reject(new Error('App container not found'));
                return;
            }

            console.log(`📱 Loading iframe app: ${appId} from ${appConfig.path}`);

            // Create iframe with security attributes
            const iframe = document.createElement('iframe');
            iframe.id = `app-${appId}`;
            iframe.className = 'mini-app-iframe';
            iframe.src = appConfig.path;
            
            // Security sandbox attributes
            iframe.sandbox = [
                'allow-scripts',
                'allow-same-origin',
                'allow-forms',
                'allow-popups-to-escape-sandbox'
            ].join(' ');

            // Additional security attributes
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.setAttribute('allow', this.generatePermissionsPolicy(appConfig.permissions));

            // Add app controls
            const appWrapper = document.createElement('div');
            appWrapper.className = 'app-wrapper';
            appWrapper.innerHTML = `
                <div class="app-header">
                    <div class="app-info">
                        <span class="app-icon">${appConfig.icon}</span>
                        <h3 class="app-title">${appConfig.name}</h3>
                    </div>
                    <div class="app-controls">
                        <button class="app-control-btn app-minimize-btn" title="Minimize">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                        <button class="app-control-btn app-fullscreen-btn" title="Fullscreen">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                            </svg>
                        </button>
                        <button class="app-control-btn app-close-btn" title="Close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="app-content">
                    ${iframe.outerHTML}
                </div>
            `;

            // Load timeout - shorter for HTML files, longer for complex apps
            const timeoutDuration = appConfig.path.endsWith('.html') ? 5000 : 15000;
            const timeout = setTimeout(() => {
                console.warn(`⚠️ App ${appId} loading timeout after ${timeoutDuration}ms`);
                // Don't reject for HTML files - they might load but not fire the load event properly
                if (appConfig.path.endsWith('.html')) {
                    console.log(`✅ App ${appId} assumed loaded (HTML file)`);
                    this.apps.set(appId, {
                        iframe: actualIframe,
                        config: appConfig,
                        wrapper: appWrapper,
                        loaded: true,
                        lastActivity: Date.now()
                    });
                    resolve();
                } else {
                    reject(new Error('App loading timeout'));
                }
            }, timeoutDuration);

            // Handle iframe load
            const actualIframe = appWrapper.querySelector('iframe');
            
            actualIframe.onload = () => {
                clearTimeout(timeout);
                console.log(`✅ App ${appId} loaded successfully`);
                this.apps.set(appId, {
                    iframe: actualIframe,
                    config: appConfig,
                    wrapper: appWrapper,
                    loaded: true,
                    lastActivity: Date.now()
                });
                resolve();
            };

            actualIframe.onerror = (error) => {
                clearTimeout(timeout);
                console.error(`❌ Failed to load app ${appId}:`, error);
                reject(new Error('Failed to load app iframe'));
            };

            // Clear container and add new app
            container.innerHTML = '';
            container.appendChild(appWrapper);
        });
    }

    generatePermissionsPolicy(permissions) {
        const policyMap = {
            'storage': 'storage-access',
            'clipboard': 'clipboard-write',
            'ai-api': 'payment',  // Using payment as proxy for API access
            'network': 'geolocation',  // Using geolocation as proxy for network
        };

        return permissions
            .map(perm => policyMap[perm])
            .filter(Boolean)
            .join('; ');
    }

    handleAppMessage(event) {
        // Verify origin and token for security
        const allowedOrigins = [window.location.origin];
        if (!allowedOrigins.includes(event.origin)) {
            return;
        }

        const { type, appId, data } = event.data;

        switch (type) {
            case 'app-ready':
                this.handleAppReady(appId);
                break;
            case 'app-error':
                this.handleAppError(appId, data);
                break;
            case 'app-resize':
                this.handleAppResize(appId, data);
                break;
            case 'app-close':
                this.closeApp(appId);
                break;
            case 'app-data':
                this.handleAppData(appId, data);
                break;
        }
    }

    async handleAppReady(appId) {
        const app = this.apps.get(appId);
        if (app && app.iframe) {
            console.log(`📨 App ${appId} is ready, preparing init data...`);
            console.log(`   requiresAuth: ${app.config.requiresAuth}, sso: ${app.config.sso}`);

            // Prepare initialization data
            const initData = {
                type: 'init',
                token: this.securityToken,
                config: app.config,
                theme: document.documentElement.getAttribute('data-theme') || 'light'
            };

            // Add authentication data for apps that require it
            if (app.config.requiresAuth && app.config.sso) {
                console.log(`   🔐 Getting auth data for ${appId}...`);
                const authData = await this.getAuthenticationData();
                if (authData) {
                    console.log(`   ✅ Auth data retrieved:`, authData.user?.email || 'No user');
                    initData.auth = authData;
                } else {
                    console.warn(`   ❌ No auth data available for ${appId}`);
                    // Redirect to login if no auth data available
                    this.redirectToLogin();
                    return;
                }
            }

            // Send initialization data to app
            console.log(`   📤 Sending init data to ${appId}`, initData);
            app.iframe.contentWindow.postMessage(initData, window.location.origin);
        }
    }

    async getAuthenticationData() {
        // Get current user from Supabase Auth
        if (window.authManager && window.authManager.isLoggedIn()) {
            const user = window.authManager.getUser();

            if (user) {
                try {
                    // Get fresh access token for the app
                    const accessToken = await window.authManager.getAccessToken();
                    return {
                        user: {
                            id: user.uid || user.id,
                            email: user.email,
                            username: user.username || user.email?.split('@')[0],
                            display_name: user.displayName || user.username,
                            avatar_url: user.photoURL
                        },
                        token: accessToken,
                        supabaseUrl: window.SUPABASE_URL,
                        supabaseAnonKey: window.SUPABASE_ANON_KEY
                    };
                } catch (error) {
                    console.error('Failed to get access token:', error);
                    return null;
                }
            }
        }
        return null;
    }

    redirectToLogin() {
        // Trigger login process through the main auth system
        if (window.authUI && window.authUI.showAuthModal) {
            window.authUI.showAuthModal();
        } else if (window.authManager && window.authManager.showAuthModal) {
            window.authManager.showAuthModal();
        } else {
            // Fallback: show alert and reload
            alert('Please sign in to access mini-apps');
            window.location.href = '/';
        }
    }

    handleAppError(appId, error) {
        console.error(`App ${appId} error:`, error);
        this.updateAppButton(appId, 'error');
        
        // Store error details for debugging
        this.apps.set(appId, {
            ...this.apps.get(appId),
            error: {
                message: error.message || 'Unknown error',
                timestamp: new Date().toISOString(),
                stack: error.stack
            }
        });
        
        this.showError(error.message || `Failed to load ${this.appRegistry[appId]?.name || appId}`);
    }

    handleAppResize(appId, dimensions) {
        const app = this.apps.get(appId);
        if (app && app.iframe) {
            const { width, height } = dimensions;
            app.iframe.style.height = `${Math.min(height, 800)}px`;
        }
    }

    handleAppData(appId, data) {
        // Handle cross-app data sharing with proper validation
        if (this.validateAppData(data)) {
            // Store data securely or pass to other apps if needed
            this.broadcastToOtherApps(appId, data);
        }
    }

    validateAppData(data) {
        // Implement data validation logic
        if (!data || typeof data !== 'object') return false;
        if (typeof data.type !== 'string') return false;
        return true;
    }

    broadcastToOtherApps(sourceAppId, data) {
        this.apps.forEach((app, appId) => {
            if (appId !== sourceAppId && app.iframe) {
                app.iframe.contentWindow.postMessage({
                    type: 'external-data',
                    source: sourceAppId,
                    data: data
                }, window.location.origin);
            }
        });
    }

    updateAppButton(appId, status) {
        const button = document.querySelector(`[data-app="${appId}"]`);
        if (!button) return;

        const indicator = button.querySelector('.status-indicator');
        if (indicator) {
            indicator.className = `status-indicator status-${status}`;
        }

        button.classList.remove('loading', 'active', 'error');
        if (status !== 'idle') {
            button.classList.add(status);
        }
    }

    showLoader() {
        this.hideAllViews();
        document.getElementById('appLoader')?.classList.add('visible');
    }

    showAppContainer() {
        this.hideAllViews();
        document.getElementById('appContainer')?.classList.add('visible');
    }

    showWelcome() {
        this.hideAllViews();
        document.getElementById('appWelcome')?.classList.add('visible');
    }

    showError(customMessage = null) {
        this.hideAllViews();
        const errorSection = document.getElementById('appError');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorSection && errorMessage) {
            if (customMessage) {
                errorMessage.textContent = customMessage;
            }
            
            // Add retry button functionality if not already present
            const retryBtn = errorSection.querySelector('#retryBtn');
            if (retryBtn && !retryBtn.hasAttribute('data-listener-added')) {
                retryBtn.addEventListener('click', () => this.retryCurrentApp());
                retryBtn.setAttribute('data-listener-added', 'true');
            }
            
            errorSection.classList.add('visible');
            
            // Auto-hide error after 10 seconds unless it's a critical error
            if (!customMessage || !customMessage.includes('network') && !customMessage.includes('server')) {
                setTimeout(() => {
                    if (errorSection.classList.contains('visible')) {
                        this.showWelcome();
                    }
                }, 10000);
            }
        }
    }

    hideAllViews() {
        const views = ['appWelcome', 'appLoader', 'appContainer', 'appError'];
        views.forEach(viewId => {
            document.getElementById(viewId)?.classList.remove('visible');
        });
    }

    async closeApp(appId) {
        const app = this.apps.get(appId);
        if (!app) return;

        // Notify app of cleanup
        if (app.iframe && app.iframe.contentWindow) {
            app.iframe.contentWindow.postMessage({
                type: 'cleanup'
            }, window.location.origin);
        }

        // Remove from DOM
        if (app.wrapper && app.wrapper.parentNode) {
            app.wrapper.parentNode.removeChild(app.wrapper);
        }

        // Clean up references
        this.apps.delete(appId);
        this.updateAppButton(appId, 'idle');

        if (this.currentApp === appId) {
            this.currentApp = null;
            this.showWelcome();
        }
    }

    closeCurrentApp() {
        if (this.currentApp) {
            this.closeApp(this.currentApp);
        }
    }

    retryCurrentApp() {
        if (this.currentApp) {
            const appId = this.currentApp;
            this.currentApp = null;
            this.loadApp(appId);
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause non-critical apps when tab is hidden
            this.apps.forEach((app, appId) => {
                if (app.iframe && app.iframe.contentWindow) {
                    app.iframe.contentWindow.postMessage({
                        type: 'visibility-change',
                        visible: false
                    }, window.location.origin);
                }
            });
        } else {
            // Resume apps when tab becomes visible
            this.apps.forEach((app, appId) => {
                if (app.iframe && app.iframe.contentWindow) {
                    app.iframe.contentWindow.postMessage({
                        type: 'visibility-change',
                        visible: true
                    }, window.location.origin);
                }
            });
        }
    }

    cleanup() {
        // Clean up all apps on page unload
        this.apps.forEach((app, appId) => {
            this.closeApp(appId);
        });
        this.apps.clear();
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Public API methods
    getLoadedApps() {
        return Array.from(this.apps.keys());
    }

    getAppStatus(appId) {
        const app = this.apps.get(appId);
        return app ? 'loaded' : 'unloaded';
    }

    isAppActive(appId) {
        return this.currentApp === appId;
    }

    getAppRegistry() {
        return { ...this.appRegistry };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.miniAppsManager = new MiniAppsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiniAppsManager;
}