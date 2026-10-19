/**
 * Supabase Client Configuration
 * Provides a single Supabase client instance
 * for authentication and database access across all frontend modules.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase project credentials (public keys — safe to expose client-side)
const SUPABASE_URL = window.SUPABASE_URL || 'https://jnhzngtyrutvoarfprgk.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuaHpuZ3R5cnV0dm9hcmZwcmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NTc5NzksImV4cCI6MjEwMDUzMzk3OX0.OqoKZcnCXbPEZJcLVC7k2dLUTxBBgs6Mfu4VN_YGlCw';

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('✅ Supabase client initialized');

// Export the single client instance for all modules to share
export { supabase };

// Supabase Manager: wraps the client with useful helpers and lazy access
class SupabaseManager {
  constructor() {
    this.client = supabase;
    this.initialized = true;
  }

  getClient() {
    return this.client;
  }

  isInitialized() {
    return this.initialized;
  }

  // Convenience: returns the current auth session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.warn('getSession error:', error);
    return session;
  }

  // Convenience: returns the current authenticated user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) console.warn('getUser error:', error);
    return user;
  }
}

// Create and expose the global manager
const supabaseManager = new SupabaseManager();
window.supabaseManager = supabaseManager;

// Expose a unified WebKMT namespace (replaces the scattered window.* globals)
window.WebKMT = window.WebKMT || {};
window.WebKMT.supabase = supabase;

export { supabaseManager };
