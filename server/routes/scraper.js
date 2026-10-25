/**
 * Scraper API — POST /api/scraper/extract { url }
 * ------------------------------------------------
 * Structured single-page extraction via Crawlee (server/services/scraper.js).
 * Built for audit recon & lead research: title/meta/headings/text/links/images
 * plus contact info (emails, phones, socials).
 *
 * Public but rate-limited (10/15 min/IP) and SSRF-guarded exactly like the
 * Website Analyzer API. No API key — the scraper is self-hosted.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { extractPage } = require('../services/scraper');

const router = express.Router();

const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many scrape requests, please try again later.', code: 'RATE_LIMITED' }
});

const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
const PRIVATE_RANGES = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.)/;

function validateUrl(req, res, next) {
  let { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL parameter is required', code: 'MISSING_URL' });
  }
  if (typeof url !== 'string' || url.length > 2048) {
    return res.status(400).json({ success: false, error: 'URL must be a string and less than 2048 characters', code: 'INVALID_URL_FORMAT' });
  }
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ success: false, error: 'Only HTTP and HTTPS protocols are allowed', code: 'INVALID_PROTOCOL' });
    }
    const hostname = parsed.hostname.toLowerCase();
    if (process.env.NODE_ENV === 'production' && (BLOCKED_HOSTS.includes(hostname) || PRIVATE_RANGES.test(hostname))) {
      return res.status(400).json({ success: false, error: 'Private network URLs are not allowed', code: 'PRIVATE_NETWORK_BLOCKED' });
    }
    req.body.url = parsed.toString();
  } catch (_) {
    return res.status(400).json({ success: false, error: 'Invalid URL format', code: 'INVALID_URL_FORMAT' });
  }
  next();
}

router.post('/extract', scraperLimiter, validateUrl, async (req, res) => {
  const started = Date.now();
  const result = await extractPage(req.body.url);
  console.log(`[scraper] ${req.body.url} -> ${result.success ? 'ok' : 'FAIL: ' + result.error} (${Date.now() - started}ms)`);
  res.status(result.success ? 200 : 502).json(result);
});

module.exports = router;
