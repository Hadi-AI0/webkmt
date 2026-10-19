/**
 * Logger Middleware
 * Request/response logging and monitoring
 */

const { supabase } = require('../config/supabase');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// Get color based on status code
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  if (statusCode >= 200) return colors.green;
  return colors.white;
};

// Get method color
const getMethodColor = (method) => {
  switch (method) {
    case 'GET': return colors.green;
    case 'POST': return colors.yellow;
    case 'PUT': return colors.blue;
    case 'DELETE': return colors.red;
    case 'PATCH': return colors.magenta;
    default: return colors.white;
  }
};

// Format duration
const formatDuration = (ms) => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// Get client info
const getClientInfo = (req) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const referer = req.headers.referer || req.headers.referrer || '';
  
  return { ip, userAgent, referer };
};

// Main logger middleware
const logger = (req, res, next) => {
  const startTime = Date.now();
  const { ip, userAgent, referer } = getClientInfo(req);
  
  // Generate unique request ID
  req.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override res.end to capture response details
  res.end = function(chunk, encoding) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const statusCode = res.statusCode;
    const contentLength = res.get('content-length') || (chunk ? chunk.length : 0);
    
    // Console logging
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusColor = getStatusColor(statusCode);
    const methodColor = getMethodColor(method);
    
    console.log(
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${methodColor}${method}${colors.reset} ` +
      `${url} ` +
      `${statusColor}${statusCode}${colors.reset} ` +
      `${colors.gray}${formatDuration(duration)}${colors.reset} ` +
      `${colors.gray}${contentLength}b${colors.reset} ` +
      `${colors.gray}${ip}${colors.reset}`
    );
    
    // Log to Supabase in production (async, non-blocking)
    if (process.env.NODE_ENV === 'production' && shouldLogToSupabase(req, res)) {
      setImmediate(() => {
        logToSupabase({
          requestId: req.requestId,
          timestamp: new Date(startTime),
          method,
          url,
          statusCode,
          duration,
          contentLength: parseInt(contentLength) || 0,
          ip,
          userAgent,
          referer,
          userId: req.user?.uid || null,
          query: Object.keys(req.query).length > 0 ? req.query : null,
          headers: filterHeaders(req.headers)
        });
      });
    }
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Determine if request should be logged to Supabase
const shouldLogToSupabase = (req, res) => {
  // Don't log health checks and static assets
  if (req.url === '/api/health') return false;
  if (req.url.startsWith('/assets/')) return false;
  if (req.url.startsWith('/css/')) return false;
  if (req.url.startsWith('/js/')) return false;
  if (req.url.endsWith('.ico')) return false;
  if (req.url.endsWith('.png')) return false;
  if (req.url.endsWith('.jpg')) return false;
  if (req.url.endsWith('.svg')) return false;
  if (req.url.endsWith('.webp')) return false;
  
  // Always log API calls
  if (req.url.startsWith('/api/')) return true;
  
  // Log errors
  if (res.statusCode >= 400) return true;
  
  // Log slow requests (> 5 seconds)
  const duration = Date.now() - req.startTime;
  if (duration > 5000) return true;
  
  return false;
};

// Filter sensitive headers
const filterHeaders = (headers) => {
  const filtered = { ...headers };

  // Remove sensitive headers
  delete filtered.authorization;
  delete filtered.cookie;
  delete filtered['x-api-key'];
  delete filtered['x-auth-token'];

  // Only include defined values to avoid DB errors
  const result = {};
  if (filtered['user-agent']) result['user-agent'] = filtered['user-agent'];
  if (filtered.accept) result.accept = filtered.accept;
  if (filtered['accept-language']) result['accept-language'] = filtered['accept-language'];
  if (filtered['accept-encoding']) result['accept-encoding'] = filtered['accept-encoding'];
  if (filtered['content-type']) result['content-type'] = filtered['content-type'];
  if (filtered['content-length']) result['content-length'] = filtered['content-length'];
  if (filtered.referer) result.referer = filtered.referer;
  if (filtered.origin) result.origin = filtered.origin;

  return result;
};

// Log to Supabase
const logToSupabase = async (logData) => {
  try {
    if (supabase) {
      const eventData = {
        type: 'request',
        event_name: `HTTP ${logData.method} ${logData.url}`,
        page: logData.url,
        category: JSON.stringify(logData.query || {}),
        label: logData.method,
        value: logData.statusCode,
        user_agent: logData.userAgent,
        ip_address: logData.ip,
        created_at: logData.timestamp ? new Date(logData.timestamp).toISOString() : new Date().toISOString()
      };
      const { error } = await supabase.from('analytics_events').insert([eventData]);
      if (error) console.warn('Failed to log request to Supabase:', error.message);
    }
  } catch (error) {
    console.error('Failed to log request to Supabase:', error);
  }
};

// Error logger
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const { ip, userAgent } = getClientInfo(req);
  
  console.error(
    `${colors.red}[ERROR]${colors.reset} ` +
    `${colors.gray}[${timestamp}]${colors.reset} ` +
    `${req.method} ${req.originalUrl} ` +
    `${colors.gray}${ip}${colors.reset}\n` +
    `${colors.red}${err.message}${colors.reset}\n` +
    `${colors.gray}${err.stack}${colors.reset}`
  );
  
  // Log error to Supabase
  if (process.env.NODE_ENV === 'production') {
    setImmediate(() => {
      logErrorToSupabase({
        requestId: req.requestId,
        timestamp: new Date(),
        method: req.method,
        url: req.originalUrl,
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
        ip,
        userAgent,
        userId: req.user?.uid || null
      });
    });
  }
  
  next(err);
};

// Log error to Supabase
const logErrorToSupabase = async (errorData) => {
  try {
    if (supabase) {
      const eventData = {
        type: 'error',
        event_name: errorData.message || 'Error',
        page: errorData.url,
        category: errorData.stack || '',
        label: errorData.method,
        value: errorData.statusCode,
        user_agent: errorData.userAgent,
        ip_address: errorData.ip,
        created_at: new Date().toISOString()
      };
      const { error } = await supabase.from('analytics_events').insert([eventData]);
      if (error) console.warn('Failed to log error to Supabase:', error.message);
    }
  } catch (error) {
    console.error('Failed to log error to Supabase:', error);
  }
};

// Access logger for security monitoring
const accessLogger = (req, res, next) => {
  // Log suspicious activity
  if (isSuspiciousRequest(req)) {
    const timestamp = new Date().toISOString();
    const { ip, userAgent } = getClientInfo(req);
    
    console.warn(
      `${colors.yellow}[SUSPICIOUS]${colors.reset} ` +
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${req.method} ${req.originalUrl} ` +
      `${colors.gray}${ip}${colors.reset} ` +
      `${colors.yellow}${userAgent}${colors.reset}`
    );
    
    // Log to Supabase for security monitoring
    if (process.env.NODE_ENV === 'production') {
      setImmediate(() => {
        logSecurityToSupabase({
          type: 'suspicious_request',
          timestamp: new Date(),
          method: req.method,
          url: req.originalUrl,
          ip,
          userAgent,
          headers: filterHeaders(req.headers),
          body: req.body ? JSON.stringify(req.body).substring(0, 1000) : null
        });
      });
    }
  }
  
  next();
};

// Detect suspicious requests
const isSuspiciousRequest = (req) => {
  const url = req.originalUrl.toLowerCase();
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  
  // Common attack patterns
  const suspiciousPatterns = [
    'admin', 'wp-admin', 'wp-login', 'phpmyadmin',
    'xmlrpc', '.php', '.asp', '.jsp',
    'shell', 'cmd', 'eval', 'script',
    'select', 'union', 'drop', 'insert',
    '<script>', 'javascript:', 'onload=',
    '../', '.env', 'config', 'backup'
  ];
  
  // Check URL for suspicious patterns
  if (suspiciousPatterns.some(pattern => url.includes(pattern))) {
    return true;
  }
  
  // Check for bot/scanner user agents
  const suspiciousAgents = [
    'scanner', 'bot', 'crawler', 'spider',
    'nikto', 'sqlmap', 'nessus', 'burp'
  ];
  
  if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
    return true;
  }
  
  return false;
};

// Log security event to Supabase
const logSecurityToSupabase = async (eventData) => {
  try {
    if (supabase) {
      const eventDataMapped = {
        type: 'security',
        event_name: eventData.type || 'Security Event',
        page: eventData.url || '',
        category: JSON.stringify(eventData.headers || {}),
        label: eventData.method || '',
        value: 0,
        user_agent: eventData.userAgent || '',
        ip_address: eventData.ip || '',
        created_at: new Date().toISOString()
      };
      const { error } = await supabase.from('analytics_events').insert([eventDataMapped]);
      if (error) console.warn('Failed to log security event to Supabase:', error.message);
    }
  } catch (error) {
    console.error('Failed to log security event to Supabase:', error);
  }
};

module.exports = {
  logger,
  errorLogger,
  accessLogger
};