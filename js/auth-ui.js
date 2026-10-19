/**
 * Authentication UI Controller
 * Handles authentication modal and user interface interactions
 * Uses Supabase Auth for sign-in, sign-up, and session management
 */

import './supabase-config.js';

class AuthUI {
    constructor() {
        this.modal = null;
        this.isSignUpMode = false;
        this.authManager = null;
        
        this.init();
    }

    async init() {
        this.bindElements();
        this.attachEventListeners();

        // Wait for auth manager to be available
        await this.waitForAuthManager();

        // Update UI based on current auth state
        this.updateAuthUI();
    }

    bindElements() {
        // Modal elements
        this.modal = document.getElementById('authModal');
        this.modalBackdrop = document.getElementById('authModalBackdrop');
        this.modalClose = document.getElementById('authModalClose');
        this.modalTitle = document.getElementById('authModalTitle');

        // Auth controls
        this.loginBtn = document.getElementById('loginBtn');

        this.userMenu = document.getElementById('userMenu');
        this.userAvatarBtn = document.getElementById('userAvatarBtn');
        this.userDropdown = document.getElementById('userDropdown');
        this.userName = document.getElementById('userName');
        this.userEmail = document.getElementById('userEmail');
        this.userAvatar = document.getElementById('userAvatar');
        this.logoutBtn = document.getElementById('logoutBtn');

        
        // Form elements
        this.authForm = document.getElementById('authForm');
        this.emailInput = document.getElementById('authEmail');
        this.passwordInput = document.getElementById('authPassword');
        this.displayNameInput = document.getElementById('authDisplayName');
        this.displayNameGroup = document.getElementById('displayNameGroup');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.submitBtn = document.getElementById('authSubmitBtn');
        this.submitBtnText = this.submitBtn.querySelector('.btn-text');
        this.submitBtnLoader = this.submitBtn.querySelector('.btn-loader');
        
        // Social login buttons
        this.googleSignInBtn = document.getElementById('googleSignInBtn');
        this.githubSignInBtn = document.getElementById('githubSignInBtn');
        
        // Form switching
        this.authSwitchText = document.getElementById('authSwitchText');
        this.authSwitchBtn = document.getElementById('authSwitchBtn');
        this.forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
        
        // Messages
        this.messagesContainer = document.getElementById('authMessages');
    }

    attachEventListeners() {
        // Find ALL Sign In buttons and connect them
        const loginButtons = [
            document.getElementById('loginBtn'),
            ...document.querySelectorAll('.auth-signin-btn'),
            ...document.querySelectorAll('.login-btn'),
            ...document.querySelectorAll('[data-action="login"]'),
            ...document.querySelectorAll('button[aria-label="Sign In"]'),
            ...Array.from(document.querySelectorAll('button')).filter(btn => {
                const text = btn.textContent.toLowerCase();
                return text.includes('sign in') && !btn.closest('.auth-modal');
            })
        ].filter(btn => btn !== null);

        // Connect all login buttons to show modal
        loginButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showModal();
            });
        });
        this.modalClose?.addEventListener('click', () => this.hideModal());
        this.modalBackdrop?.addEventListener('click', () => this.hideModal());
        
        // User menu
        this.userAvatarBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserMenu();
        });
        
        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.userMenu?.contains(e.target)) {
                this.closeUserMenu();
            }
        });
        
        // Logout
        this.logoutBtn?.addEventListener('click', () => this.handleLogout());
        
        // Form submission
        this.authForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Social login
        this.googleSignInBtn?.addEventListener('click', () => this.handleGoogleSignIn());
        this.githubSignInBtn?.addEventListener('click', () => this.handleGitHubSignIn());
        
        // Form switching
        this.authSwitchBtn?.addEventListener('click', () => this.toggleAuthMode());
        this.forgotPasswordBtn?.addEventListener('click', () => this.handleForgotPassword());
        
        // Password visibility toggle
        this.passwordToggle?.addEventListener('click', () => this.togglePasswordVisibility());
        
        // Close modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.hideModal();
            }
        });
    }

    async waitForAuthManager() {
        console.log('🔍 AuthUI: Waiting for auth manager...');

        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait

        while (!window.authManager && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (window.authManager) {
            console.log('✅ AuthUI: Got window.authManager after', attempts, 'attempts');
            this.authManager = window.authManager;

            // Subscribe to auth state changes
            this.authManager.subscribe((authData) => {
                console.log('📨 AuthUI: Received auth event from subscription:', authData?.event);
                this.updateAuthUI(authData);
            });
        } else {
            console.error('❌ AuthUI: Failed to get auth manager after', maxAttempts, 'attempts');
        }
    }

    showModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            this.emailInput?.focus();
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            this.clearForm();
            this.clearMessages();
        }
    }

    toggleUserMenu() {
        if (this.userMenu) {
            this.userMenu.classList.toggle('open');
        }
    }

    closeUserMenu() {
        if (this.userMenu) {
            this.userMenu.classList.remove('open');
        }
    }

    toggleAuthMode() {
        this.isSignUpMode = !this.isSignUpMode;
        
        if (this.isSignUpMode) {
            this.modalTitle.textContent = 'Sign Up';
            this.submitBtnText.textContent = 'Sign Up';
            this.authSwitchText.textContent = 'Already have an account?';
            this.authSwitchBtn.textContent = 'Sign in';
            this.displayNameGroup.style.display = 'flex';
            this.displayNameInput.required = true;
        } else {
            this.modalTitle.textContent = 'Sign In';
            this.submitBtnText.textContent = 'Sign In';
            this.authSwitchText.textContent = "Don't have an account?";
            this.authSwitchBtn.textContent = 'Sign up';
            this.displayNameGroup.style.display = 'none';
            this.displayNameInput.required = false;
        }
        
        this.clearMessages();
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = this.passwordToggle.querySelector('svg');
        if (isPassword) {
            icon.innerHTML = `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>`;
        } else {
            icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const displayName = this.displayNameInput.value.trim();
        
        if (!email || !password) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }

        if (!this.authManager) {
            this.showMessage('Authentication system not available', 'error');
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        try {
            let result;

            if (this.isSignUpMode) {
                if (!displayName) {
                    this.showMessage('Please enter your full name', 'error');
                    this.setLoading(false);
                    return;
                }
                result = await this.authManager.signUpWithEmail(email, password, displayName);
            } else {
                const rememberMe = this.rememberMeCheckbox.checked;
                result = await this.authManager.signInWithEmail(email, password, rememberMe);
            }

            if (result.success) {
                this.showMessage(`${this.isSignUpMode ? 'Account created' : 'Signed in'} successfully!`, 'success');
                setTimeout(() => {
                    this.hideModal();
                }, 1500);
            } else {
                this.showMessage(result.error || 'Authentication failed', 'error');
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showMessage('An unexpected error occurred', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleGoogleSignIn() {
        if (!this.authManager) {
            this.showMessage('Authentication system not available', 'error');
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        try {
            const result = await this.authManager.signInWithGoogle();

            if (result.success) {
                this.showMessage('Signed in with Google successfully!', 'success');
                setTimeout(() => {
                    this.hideModal();
                }, 1500);
            } else {
                this.showMessage(result.error || 'Google sign-in failed', 'error');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showMessage('Google sign-in failed', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleGitHubSignIn() {
        if (!this.authManager) {
            this.showMessage('Authentication system not available', 'error');
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        try {
            const result = await this.authManager.signInWithGitHub();

            if (result.success) {
                this.showMessage('Signed in with GitHub successfully!', 'success');
                setTimeout(() => {
                    this.hideModal();
                }, 1500);
            } else {
                this.showMessage(result.error || 'GitHub sign-in failed', 'error');
            }
        } catch (error) {
            console.error('GitHub sign-in error:', error);
            this.showMessage('GitHub sign-in failed', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async handleForgotPassword() {
        const email = this.emailInput.value.trim();

        if (!email) {
            this.showMessage('Please enter your email address first', 'error');
            this.emailInput.focus();
            return;
        }

        if (!this.authManager) {
            this.showMessage('Authentication system not available', 'error');
            return;
        }

        try {
            const result = await this.authManager.resetPassword(email);

            if (result.success) {
                this.showMessage('Password reset email sent! Check your inbox.', 'success');
            } else {
                this.showMessage(result.error || 'Failed to send reset email', 'error');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            this.showMessage('Failed to send reset email', 'error');
        }
    }

    async handleLogout() {
        if (!this.authManager) return;

        try {
            const result = await this.authManager.signOut();

            if (result.success) {
                this.closeUserMenu();
                // UI will be updated automatically via auth state subscription
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    updateAuthUI(authData = null) {
        console.log('🔄 updateAuthUI called', authData);

        if (!authData && this.authManager) {
            authData = {
                isAuthenticated: this.authManager.isLoggedIn(),
                user: this.authManager.getUser()
            };
        }

        console.log('   Auth state:', authData?.isAuthenticated ? 'LOGGED IN' : 'LOGGED OUT');
        console.log('   User:', authData?.user?.email || 'None');

        if (authData && authData.isAuthenticated && authData.user) {
            console.log('   ✅ Showing authenticated UI');

            // Show authenticated state
            if (this.loginBtn) {
                this.loginBtn.style.display = 'none';
                console.log('      - Login button hidden');
            } else {
                console.warn('      ⚠️ Login button not found!');
            }

            if (this.userMenu) {
                this.userMenu.style.display = 'block';
                console.log('      - User menu shown');
            } else {
                console.warn('      ⚠️ User menu not found!');
            }

            // Update user info
            if (this.userName) {
                this.userName.textContent = authData.user.displayName || authData.user.email?.split('@')[0] || 'User';
            }
            if (this.userEmail) {
                this.userEmail.textContent = authData.user.email || '';
            }

            if (authData.user.photoURL) {
                if (this.userAvatar) {
                    this.userAvatar.src = authData.user.photoURL;
                    this.userAvatar.style.display = 'block';
                }
            } else {
                if (this.userAvatar) {
                    this.userAvatar.style.display = 'none';
                }
            }
        } else {
            console.log('   ℹ️ Showing unauthenticated UI');

            // Show unauthenticated state
            if (this.loginBtn) {
                this.loginBtn.style.display = 'flex';
            }
            if (this.userMenu) {
                this.userMenu.style.display = 'none';
            }
        }
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtnText.style.display = 'none';
            this.submitBtnLoader.style.display = 'flex';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtnText.style.display = 'block';
            this.submitBtnLoader.style.display = 'none';
        }
    }

    showAuthError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `auth-message ${type}`;
        messageEl.textContent = message;
        
        this.messagesContainer.innerHTML = '';
        this.messagesContainer.appendChild(messageEl);
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageEl.remove();
            }, 3000);
        }
    }

    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }

    clearForm() {
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.displayNameInput.value = '';
        this.rememberMeCheckbox.checked = false;
        this.passwordInput.type = 'password';

        // Reset password toggle icon
        const icon = this.passwordToggle.querySelector('svg');
        icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }


    // Public API for external use
    showAuthModal() {
        this.showModal();
    }

    hideAuthModal() {
        this.hideModal();
    }

    isAuthenticated() {
        return this.authManager ? this.authManager.isLoggedIn() : false;
    }

    getCurrentUser() {
        return this.authManager ? this.authManager.getUser() : null;
    }
}

// Robust initialization for modules
function initializeAuthUI() {
    // Wait for both DOM and Supabase to be ready
    function createAuthUI() {
        try {
            window.authUI = new AuthUI();
        } catch (error) {
            console.error('Error creating AuthUI instance:', error);
            // Retry after a short delay
            setTimeout(createAuthUI, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Add a small delay to ensure all modules are loaded
            setTimeout(createAuthUI, 100);
        });
    } else {
        // DOM is already ready - add a small delay to ensure all modules are loaded
        setTimeout(createAuthUI, 100);
    }
}

// Initialize immediately
// Initialize AuthUI
initializeAuthUI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthUI;
}