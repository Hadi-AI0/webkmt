/**
 * Supabase Authentication Manager
 * Core Authentication Manager
 * Handles authentication state, sign-in, sign-up, sign-out, and user profile management.
 */

import { supabase } from '../supabase-config.js';

class SupabaseAuthManager {
  constructor() {
    this.user = null;
    this.profile = null;
    this.isAuthenticated = false;
    this.authReady = false;
    this.subscribers = new Set();

    this._init();
  }

  // ─────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────

  _init() {
    // Listen for all auth state changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔐 Auth event: ${event}`);
      this.user = session?.user ?? null;
      this.isAuthenticated = !!this.user;

      if (this.user) {
        await this._loadProfile();
        this._notify(event === 'SIGNED_IN' ? 'login' : 'profile_updated');
      } else {
        this.profile = null;
        this._notify('logout');
      }

      this.authReady = true;
    });
  }

  // ─────────────────────────────────────────────
  // Authentication Methods
  // ─────────────────────────────────────────────

  async signInWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, user: this.getUserData() };
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  async signUpWithEmail(email, password, displayName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } }
      });
      if (error) throw error;
      return { success: true, user: this.getUserData() };
    } catch (error) {
      console.error('Email sign-up error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  async signInWithGitHub() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      this.user = null;
      this.profile = null;
      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  // ─────────────────────────────────────────────
  // User Profile Management
  // ─────────────────────────────────────────────

  async _loadProfile() {
    if (!this.user) { this.profile = null; return; }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();

      if (error) throw error;
      this.profile = data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.profile = null;
    }
  }

  async updateUserProfile(updates) {
    if (!this.user) return { success: false, error: 'User not authenticated' };

    try {
      // Map camelCase to snake_case column names
      const dbUpdates = {
        updated_at: new Date().toISOString()
      };
      if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
      if (updates.photoURL !== undefined)    dbUpdates.photo_url = updates.photoURL;
      if (updates.preferences !== undefined) dbUpdates.preferences = updates.preferences;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', this.user.id);

      if (error) throw error;

      await this._loadProfile();
      this._notify('profile_updated');
      return { success: true, user: this.getUserData() };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  // ─────────────────────────────────────────────
  // Password Management
  // ─────────────────────────────────────────────

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`
      });
      if (error) throw error;
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  async changePassword(newPassword) {
    if (!this.user) return { success: false, error: 'User not authenticated' };
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: this._errorMessage(error) };
    }
  }

  // ─────────────────────────────────────────────
  // Utility / Public API
  // ─────────────────────────────────────────────

  getUserData() {
    if (!this.user) return null;

    const base = {
      uid: this.user.id,
      email: this.user.email,
      displayName: this.user.user_metadata?.display_name || '',
      photoURL: this.user.user_metadata?.avatar_url || '',
      emailVerified: !!this.user.email_confirmed_at,
      isAnonymous: false
    };

    if (this.profile) {
      return {
        ...base,
        displayName: this.profile.display_name || base.displayName,
        photoURL: this.profile.photo_url || base.photoURL,
        role: this.profile.role || 'user',
        plan: this.profile.plan || 'free',
        preferences: this.profile.preferences || {},
        createdAt: this.profile.created_at
      };
    }

    return base;
  }

  getUser() { return this.getUserData(); }
  getCurrentUser() { return this.user; }
  getUserProfile() { return this.profile; }
  isLoggedIn() { return this.isAuthenticated; }
  isGuest() { return false; }
  isAdmin() { return this.profile?.role === 'admin'; }

  // Returns a Promise that resolves once auth state is determined
  waitForAuth() {
    return new Promise((resolve) => {
      if (this.authReady) return resolve(this.isAuthenticated);
      const unsub = this.subscribe(() => { unsub(); resolve(this.isAuthenticated); });
    });
  }

  // Get the current Supabase access token (for Bearer headers to our server)
  async getAccessToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  // ─────────────────────────────────────────────
  // Event / Subscriber System
  // ─────────────────────────────────────────────

  subscribe(callback) {
    this.subscribers.add(callback);
    if (this.authReady) {
      callback({
        event: this.isAuthenticated ? 'login' : 'logout',
        data: this.getUserData(),
        user: this.getUserData(),
        isAuthenticated: this.isAuthenticated
      });
    }
    return () => this.subscribers.delete(callback);
  }

  _notify(event) {
    this.subscribers.forEach(cb => {
      try {
        cb({ event, data: this.getUserData(), user: this.getUserData(), isAuthenticated: this.isAuthenticated });
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    });
  }

  // ─────────────────────────────────────────────
  // Error Messages
  // ─────────────────────────────────────────────

  _errorMessage(error) {
    const messages = {
      'Invalid login credentials': 'Incorrect email or password',
      'Email not confirmed': 'Please verify your email before signing in',
      'User already registered': 'An account with this email already exists',
      'Password should be at least 6 characters': 'Password must be at least 6 characters'
    };
    return messages[error.message] || error.message || 'An unexpected error occurred';
  }
}

// ─────────────────────────────────────────────
// Global singleton (drops into place of window.authManager)
// ─────────────────────────────────────────────
console.log('🔑 Creating Supabase Auth Manager...');
const supabaseAuthManager = new SupabaseAuthManager();
window.authManager = supabaseAuthManager;

// Register in unified namespace
window.WebKMT = window.WebKMT || {};
window.WebKMT.auth = supabaseAuthManager;

console.log('✅ Supabase Auth Manager ready:', !!window.authManager);

export default supabaseAuthManager;
