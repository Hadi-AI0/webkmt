/**
 * Authentication Middleware
 * Verifies Supabase JWT tokens for protected routes
 */

const { supabase } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required. Please provide a Bearer token.'
      });
    }

    const idToken = authHeader.replace('Bearer ', '');

    if (!idToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization format. Token is required.'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(idToken);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Authentication failed.'
      });
    }

    // Get user data from public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found. Please contact support.'
      });
    }

    // Attach user info to request
    req.user = {
      uid: user.id,
      email: user.email,
      emailVerified: !!user.email_confirmed_at,
      displayName: profile.display_name || user.user_metadata?.display_name || '',
      photoURL: profile.photo_url || user.user_metadata?.avatar_url || '',
      plan: profile.plan || 'free',
      preferences: profile.preferences || {},
      role: profile.role || 'user',
      isAdmin: profile.role === 'admin', 
      createdAt: profile.created_at,
      lastLoginAt: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null
    };

    // Update last seen timestamp (every 5 minutes max)
    const now = Date.now();
    const lastUpdate = global.userLastSeenUpdates = global.userLastSeenUpdates || {};

    if (!lastUpdate[user.id] || (now - lastUpdate[user.id]) > 300000) { // 5 minutes
      lastUpdate[user.id] = now;

      // Update asynchronously to not block the request
      supabase
        .from('profiles')
        .update({
          last_seen_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .then(({ error: updateError }) => {
          if (updateError) {
            console.warn('Failed to update last_seen_at:', updateError);
          }
        });
    }

    next();

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed. Please sign in again.',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const idToken = authHeader.replace('Bearer ', '');

    if (!idToken) {
      req.user = null;
      return next();
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(idToken);
    
    if (user && !error) {
      // Get user data from public.profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        req.user = {
          uid: user.id,
          email: user.email,
          emailVerified: !!user.email_confirmed_at,
          displayName: profile.display_name || '',
          photoURL: profile.photo_url || '',
          plan: profile.plan || 'free',
          preferences: profile.preferences || {},
          role: profile.role || 'user',
          isAdmin: profile.role === 'admin'
        };
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    console.warn('Optional authentication failed:', error);
    req.user = null;
    next();
  }
};

// Role-based authorization middleware
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userRole = req.user.role || 'user';
    const hasRole = requiredRoles.includes(userRole);

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Plan-based authorization middleware
const requirePlan = (requiredPlans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userPlan = req.user.plan || 'free';
    
    if (!requiredPlans.includes(userPlan)) {
      return res.status(403).json({
        success: false,
        error: 'Plan upgrade required',
        required: requiredPlans,
        current: userPlan
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requirePlan
};