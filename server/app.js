/**
 * WebKMT Backend Server
 * Express.js server with Supabase integration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Supabase client
const { supabase } = require('./config/supabase');

// Import routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const analyticsRoutes = require('./routes/analytics');
const contactRoutes = require('./routes/contact');
const { handleGeminiRequest } = require('./routes/gemini-proxy');

// Import middleware
const { authenticate } = require('./middleware/authenticate');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');

const app = express();
app.set('trust proxy', 1); // Required for express-rate-limit behind Nginx proxy
const PORT = process.env.PORT || 8083;

// Validate Supabase connection on startup
(async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection verified successfully');
  } catch (error) {
    console.warn('⚠️  Supabase connection check failed:', error.message);
    console.log('📋 To enable full functionality, add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env');
  }
})();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://googletagmanager.com",
        "https://www.google.com",
        "https://apis.google.com",
        "https://cdn.jsdelivr.net"  // Supabase JS SDK
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      connectSrc: [
        "'self'",
        // Supabase endpoints
        "https://*.supabase.co",
        "wss://*.supabase.co",
        // External APIs
        "https://api.apify.com",
        "https://colormind.io",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://region1.google-analytics.com",
        "https://stats.g.doubleclick.net",
        "https://googletagmanager.com",
        "https://www.googletagmanager.com",
        "https://accounts.google.com",
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://www.google.com"
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW_MS || 900000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path.startsWith('/api/health') ||
           req.path.startsWith('/css/') ||
           req.path.startsWith('/js/') ||
           req.path.startsWith('/assets/');
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.' },
  skipSuccessfulRequests: true
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// CORS configuration
const getAllowedOrigins = () => {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  }
  const productionOrigins = ['https://webkmt.com', 'https://www.webkmt.com', 'https://link.webkmt.com'];
  const developmentOrigins = ['http://localhost:8083', 'http://localhost:3000', 'http://127.0.0.1:5500'];
  return process.env.NODE_ENV === 'production'
    ? [...productionOrigins, ...developmentOrigins]
    : developmentOrigins;
};

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));

// Body parsing & compression
app.use(compression());

// Input sanitization middleware
const validateAndSanitizeInput = (req, res, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return next();

  if (req.body && typeof req.body === 'object') {
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim()
        .substring(0, 10000);
    };

    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (typeof obj[key] === 'string') obj[key] = sanitizeString(obj[key]);
          else if (typeof obj[key] === 'object' && obj[key] !== null) sanitizeObject(obj[key]);
        }
      }
    };

    sanitizeObject(req.body);
  }
  next();
};

app.use(express.json({ limit: '5mb', strict: true, type: 'application/json' }));
app.use(express.urlencoded({ extended: false, limit: '5mb', parameterLimit: 100 }));
app.use(validateAndSanitizeInput);

// Custom middleware
app.use(logger);

// Dynamic Supabase client config route using server .env credentials
app.get('/js/supabase-config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`/**
 * Supabase Client Configuration (Server Dynamic)
 * Provides a single Supabase client instance for authentication and database access.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = '${process.env.SUPABASE_URL || 'https://placeholder.supabase.co'}';
const SUPABASE_ANON_KEY = '${process.env.SUPABASE_ANON_KEY || ''}';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('✅ Supabase client initialized dynamically from server config');

export { supabase };

class SupabaseManager {
  constructor() {
    this.client = supabase;
    this.initialized = true;
  }
  getClient() { return this.client; }
  isInitialized() { return this.initialized; }
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.warn('getSession error:', error);
    return session;
  }
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) console.warn('getUser error:', error);
    return user;
  }
}

const supabaseManager = new SupabaseManager();
window.supabaseManager = supabaseManager;
window.WebKMT = window.WebKMT || {};
window.WebKMT.supabase = supabase;

export { supabaseManager };
`);
});

// Static files
app.use(express.static(path.join(__dirname, '../'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', authenticate, dataRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/mini-apps', require('../api/mini-apps/routes'));

// Client-side error reporting stub (prevents 404 spam in console)
app.post('/api/errors', (req, res) => res.sendStatus(200));

// Secure Gemini AI Proxy
app.post('/api/gemini-chat', generalLimiter, handleGeminiRequest);

// Template Gallery page (clean URL) — must stay above the /:username handler
app.get('/templates', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates.html'));
});

// Bio-link handler for link.webkmt.com/{username}
app.get('/:username', async (req, res) => {
  const username = req.params.username;

  const skipRoutes = ['api', 'mini-apps', 'js', 'css', 'assets', 'images', 'fonts', 'supabase'];
  if (username.includes('.') || skipRoutes.some(r => username.startsWith(r))) {
    return res.sendFile(path.join(__dirname, '..', 'index.html'));
  }

  try {
    // Check if this username exists in Supabase kmtlink_profiles table
    const { data: profile, error } = await supabase
      .from('kmtlink_profiles')
      .select('id, username, is_public')
      .eq('username', username)
      .eq('is_public', true)
      .single();

    if (profile && !error) {
      return res.sendFile(path.join(__dirname, '..', 'mini-apps', 'kmtlink-public-profile.html'));
    }

    res.sendFile(path.join(__dirname, '..', 'index.html'));
  } catch (error) {
    console.error('Error checking bio-link profile:', error);
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    backend: 'supabase'
  });
});

// Catch-all: serve SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WebKMT Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Backend: Supabase`);
  console.log(`📂 Serving static files from: ${path.join(__dirname, '../')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => { console.log('SIGTERM received, shutting down gracefully'); process.exit(0); });
process.on('SIGINT', () => { console.log('SIGINT received, shutting down gracefully'); process.exit(0); });

module.exports = app;