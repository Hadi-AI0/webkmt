/**
 * WebKMT Scraper Service — powered by Crawlee (CheerioCrawler)
 * ------------------------------------------------------------
 * Our Apify replacement: open-source, self-hosted, $0. Crawlee is built
 * by the Apify team; CheerioCrawler fetches pages with browser-like
 * headers/TLS (got-scraping) and parses them with Cheerio — ideal for
 * website audits and lead research (contact-info extraction).
 *
 * No API key. No external service. Runs in-process on the VPS.
 * For JavaScript-heavy sites, a PlaywrightCrawler variant can be added
 * later (heavier — only if a real need appears).
 *
 * Main entry: extractPage(url) -> structured page data.
 */

const os = require('os');
const path = require('path');

// Keep Crawlee's runtime storage out of the project directory,
// and keep its (verbose) logging quiet in server logs.
if (!process.env.CRAWLEE_STORAGE_DIR) {
  process.env.CRAWLEE_STORAGE_DIR = path.join(os.tmpdir(), 'webkmt-crawlee');
}
if (!process.env.CRAWLEE_LOG_LEVEL) {
  process.env.CRAWLEE_LOG_LEVEL = 'WARNING';
}

const { CheerioCrawler } = require('crawlee');

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;
const SOCIAL_HOSTS = [
  'facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com',
  'youtube.com', 'tiktok.com', 'wa.me', 'api.whatsapp.com'
];

function unique(arr, max = 20) {
  return [...new Set(arr.filter(Boolean))].slice(0, max);
}

function extractFromPage($, pageUrl, html) {
  const base = new URL(pageUrl);

  const title = ($('title').first().text() || '').trim();
  const description = ($('meta[name="description"]').attr('content') || '').trim();
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const lang = $('html').attr('lang') || '';
  const generator = $('meta[name="generator"]').attr('content') || '';

  const h1 = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 10);
  const h2 = $('h2').map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 15);

  // Rough visible text: clone body, drop non-content elements
  const $body = $('body').clone();
  $body.find('script, style, noscript, svg, iframe').remove();
  const text = $body.text().replace(/\s+/g, ' ').trim();
  const wordCount = text ? text.split(' ').length : 0;

  // Links: internal / external / social
  const hrefs = $('a[href]').map((_, el) => $(el).attr('href')).get();
  const internal = [], external = [], socials = [];
  for (const href of hrefs) {
    try {
      const u = new URL(href, base);
      if (!/^https?:$/.test(u.protocol)) continue;
      if (SOCIAL_HOSTS.some(h => u.hostname === h || u.hostname.endsWith('.' + h))) socials.push(u.toString());
      else if (u.hostname === base.hostname) internal.push(u.toString());
      else external.push(u.toString());
    } catch (_) { /* skip malformed hrefs */ }
  }

  const images = $('img');
  const missingAlt = images.filter((_, el) => !($(el).attr('alt') || '').trim()).length;

  // Contact info: mailto/tel links + regex over raw HTML and visible text
  const mailtos = $('a[href^="mailto:"]').map((_, el) => ($(el).attr('href') || '').replace(/^mailto:/i, '').split('?')[0].trim().toLowerCase()).get();
  const tels = $('a[href^="tel:"]').map((_, el) => ($(el).attr('href') || '').replace(/^tel:/i, '').trim()).get();
  const emailsFound = (html.match(EMAIL_RE) || []).map(e => e.toLowerCase());
  const phonesFound = (text.match(PHONE_RE) || [])
    .map(p => p.trim())
    .filter(p => p.replace(/\D/g, '').length >= 9);

  return {
    title,
    description,
    canonical,
    lang,
    generator,
    headings: { h1, h2 },
    wordCount,
    textSample: text.slice(0, 1500),
    links: {
      internalCount: unique(internal, 1000).length,
      externalCount: unique(external, 1000).length,
      internalSample: unique(internal, 20)
    },
    images: { total: images.length, missingAlt },
    forms: $('form').length,
    structuredData: $('script[type="application/ld+json"]').length,
    contact: {
      emails: unique([...mailtos, ...emailsFound], 10),
      phones: unique([...tels, ...phonesFound], 10),
      socials: unique(socials, 12)
    }
  };
}

/**
 * Extract structured data from a single page.
 * @param {string} url absolute http(s) URL (validate/sanitize before calling)
 * @param {{timeoutMs?: number}} [opts]
 * @returns {Promise<{success:boolean, url:string, finalUrl?:string, statusCode?:number, data?:object, error?:string}>}
 */
async function extractPage(url, opts = {}) {
  const timeoutMs = opts.timeoutMs || 30000;
  let result = null;
  let failure = null;

  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 1,
    maxConcurrency: 1,
    maxRequestRetries: 1,
    requestHandlerTimeoutSecs: Math.ceil(timeoutMs / 1000),
    async requestHandler({ $, request, response, body }) {
      const html = typeof body === 'string' ? body : (body ? body.toString() : $.html());
      const finalUrl = request.loadedUrl || url;
      result = {
        success: true,
        url,
        finalUrl,
        statusCode: response ? response.statusCode : undefined,
        data: extractFromPage($, finalUrl, html)
      };
    },
    failedRequestHandler({ request }, error) {
      failure = error && error.message ? error.message : 'request_failed';
    }
  });

  try {
    await Promise.race([
      crawler.run([url]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('scrape_timeout')), timeoutMs))
    ]);
  } catch (e) {
    try { await crawler.teardown(); } catch (_) { /* best effort */ }
    return { success: false, url, error: e.message || 'scrape_failed' };
  }

  if (result) return result;
  return { success: false, url, error: failure || 'scrape_failed' };
}

module.exports = { extractPage };
