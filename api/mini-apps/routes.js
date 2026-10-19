/**
 * Mini-Apps API Routes
 * Express routes for mini-app backend services
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import service handlers
const { handleSEOAnalysis } = require('./seo-analyzer');
const { handleSpeedTest } = require('./speed-tester');

// Rate limiting for API calls
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many API requests, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Enhanced validation middleware
const validateRequest = (req, res, next) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({
            success: false,
            error: 'URL parameter is required',
            code: 'MISSING_URL'
        });
    }

    if (typeof url !== 'string' || url.length > 2048) {
        return res.status(400).json({
            success: false,
            error: 'URL must be a string and less than 2048 characters',
            code: 'INVALID_URL_FORMAT'
        });
    }

    try {
        const parsedUrl = new URL(url);
        
        // Security checks
        const allowedProtocols = ['http:', 'https:'];
        if (!allowedProtocols.includes(parsedUrl.protocol)) {
            return res.status(400).json({
                success: false,
                error: 'Only HTTP and HTTPS protocols are allowed',
                code: 'INVALID_PROTOCOL'
            });
        }

        // Prevent private/local network access
        const hostname = parsedUrl.hostname.toLowerCase();
        const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        const privateRanges = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.)/;
        
        if (process.env.NODE_ENV === 'production') {
            if (blockedHosts.includes(hostname) || privateRanges.test(hostname)) {
                return res.status(400).json({
                    success: false,
                    error: 'Private network URLs are not allowed',
                    code: 'PRIVATE_NETWORK_BLOCKED'
                });
            }
        }

        // Store sanitized URL
        req.body.url = parsedUrl.toString();
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: 'Invalid URL format',
            code: 'INVALID_URL_FORMAT'
        });
    }

    next();
};

// Request logging middleware
const logRequest = (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;
    
    res.send = function(body) {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        
        if (res.statusCode >= 400) {
            console.log(`Request body:`, JSON.stringify(req.body, null, 2));
            console.log(`Response:`, typeof body === 'string' ? body : JSON.stringify(body));
        }
        
        originalSend.call(this, body);
    };
    
    next();
};

// SEO Analyzer endpoint
router.post('/seo-analyzer', logRequest, apiLimiter, validateRequest, async (req, res) => {
    try {
        await handleSEOAnalysis(req, res);
    } catch (error) {
        console.error('SEO Analyzer route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            code: 'SEO_ANALYSIS_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

// Speed Tester endpoint
router.post('/speed-test', logRequest, apiLimiter, validateRequest, async (req, res) => {
    try {
        await handleSpeedTest(req, res);
    } catch (error) {
        console.error('Speed Tester route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            code: 'SPEED_TEST_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Mini-apps API is running',
        timestamp: new Date().toISOString(),
        services: {
            seoAnalyzer: 'available',
            speedTester: 'available'
        }
    });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
    res.json({
        name: 'Mini-Apps API',
        version: '1.0.0',
        endpoints: {
            '/api/mini-apps/seo-analyzer': {
                method: 'POST',
                description: 'Analyze website SEO performance',
                parameters: {
                    url: 'string (required) - Website URL to analyze'
                },
                rateLimit: '10 requests per 15 minutes'
            },
            '/api/mini-apps/speed-tester': {
                method: 'POST',
                description: 'Test website speed and performance',
                parameters: {
                    url: 'string (required) - Website URL to test',
                    strategy: 'string (optional) - "desktop", "mobile", or "both" (default: "desktop")',
                    categories: 'array (optional) - Categories to test (default: ["performance"])'
                },
                rateLimit: '10 requests per 15 minutes'
            },
            '/api/mini-apps/health': {
                method: 'GET',
                description: 'API health check'
            }
        },
        usage: {
            example: {
                url: 'https://example.com',
                strategy: 'desktop'
            }
        }
    });
});

module.exports = router;