/**
 * Cal.com Booking Proxy
 * ---------------------
 * Keeps the Cal API key strictly server-side. The website booking
 * modal (js/booking.js) only ever talks to these endpoints.
 *
 * Environment variables:
 *   CAL_API_KEY       (required)  e.g. cal_live_... — set in .env, NEVER commit it
 *   CAL_API_BASE      (optional)  default: https://api.cal.com/v2
 *                                 (point this at a self-hosted Cal instance later)
 *   CAL_EVENT_TYPE_ID (optional)  force one specific event type id
 *
 * API versions (per Cal.com docs):
 *   bookings/me: 2024-08-13 · slots: 2024-09-04 · event-types: 2024-06-14 (fallback 2024-08-13)
 */

const express = require('express');
const router = express.Router();

const CAL_API_BASE = (process.env.CAL_API_BASE || 'https://api.cal.com/v2').replace(/\/+$/, '');
const CAL_API_KEY = process.env.CAL_API_KEY || '';
const FORCED_EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID ? Number(process.env.CAL_EVENT_TYPE_ID) : null;

const V_BOOKINGS = '2024-08-13';
const V_ME = '2024-08-13';
const V_SLOTS = '2024-09-04';
const V_EVENT_TYPES_TRY = ['2024-06-14', '2024-08-13'];

async function calFetch(pathname, { method = 'GET', version = V_BOOKINGS, body } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(`${CAL_API_BASE}${pathname}`, {
      method,
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': version,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal
    });
    let json = null;
    try { json = await res.json(); } catch (_) { /* non-JSON error body */ }
    if (!res.ok) {
      const err = new Error(`Cal API error ${res.status}`);
      err.status = res.status;
      err.payload = json;
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

// ---- event-type discovery (cached 5 min) ----
let cache = { at: 0, username: null, eventTypes: null };
const CACHE_MS = 5 * 60 * 1000;

function normalizeEventTypes(json) {
  let list = [];
  if (Array.isArray(json?.data)) list = json.data;
  else if (Array.isArray(json?.data?.event_types)) list = json.data.event_types;
  else if (Array.isArray(json?.data?.eventTypes)) list = json.data.eventTypes;
  return list
    .filter(et => et && et.id != null && et.hidden !== true)
    .map(et => ({
      id: Number(et.id),
      title: et.title || et.slug || 'Appointment',
      slug: et.slug || '',
      lengthInMinutes: et.lengthInMinutes || et.length || 30
    }));
}

async function discover() {
  if (cache.eventTypes && Date.now() - cache.at < CACHE_MS) return cache;

  let username = null;
  try {
    const me = await calFetch('/me', { version: V_ME });
    username = me?.data?.username || me?.data?.user?.username || null;
  } catch (_) { /* username is optional */ }

  const qs = username ? `?username=${encodeURIComponent(username)}` : '';
  let eventTypes = null;
  let lastErr = null;
  for (const v of V_EVENT_TYPES_TRY) {
    try {
      const json = await calFetch(`/event-types${qs}`, { version: v });
      eventTypes = normalizeEventTypes(json);
      break;
    } catch (e) { lastErr = e; }
  }
  if (!eventTypes) throw lastErr || new Error('event-types discovery failed');

  cache = { at: Date.now(), username, eventTypes };
  return cache;
}

function pickRecommended(eventTypes) {
  if (FORCED_EVENT_TYPE_ID && eventTypes.some(e => e.id === FORCED_EVENT_TYPE_ID)) {
    return FORCED_EVENT_TYPE_ID;
  }
  const audit = eventTypes.find(e => /audit/i.test(e.title) || /audit/i.test(e.slug));
  return (audit || eventTypes[0] || {}).id || null;
}

// ---- GET /api/cal/event-types ----
router.get('/event-types', async (req, res) => {
  if (!CAL_API_KEY) {
    return res.json({ success: true, configured: false, eventTypes: [] });
  }
  try {
    const { eventTypes } = await discover();
    let list = eventTypes;
    if (FORCED_EVENT_TYPE_ID && !list.some(e => e.id === FORCED_EVENT_TYPE_ID)) {
      list = [{ id: FORCED_EVENT_TYPE_ID, title: 'Free Audit Call', slug: '', lengthInMinutes: 30 }];
    }
    res.json({ success: true, configured: true, eventTypes: list, recommendedId: pickRecommended(list) });
  } catch (e) {
    console.error('Cal event-types error:', e.status || '', e.message);
    res.status(502).json({ success: false, configured: true, error: 'cal_unavailable' });
  }
});

// ---- GET /api/cal/slots?eventTypeId=&date=YYYY-MM-DD&timeZone= ----
router.get('/slots', async (req, res) => {
  if (!CAL_API_KEY) {
    return res.json({ success: true, configured: false, slots: [] });
  }
  const eventTypeId = Number(req.query.eventTypeId);
  const date = String(req.query.date || '');
  const timeZone = String(req.query.timeZone || 'UTC').slice(0, 64);
  if (!eventTypeId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, error: 'invalid_params' });
  }
  try {
    const qs = new URLSearchParams({ eventTypeId: String(eventTypeId), start: date, end: date, timeZone });
    const json = await calFetch(`/slots?${qs}`, { version: V_SLOTS });
    const day = (json?.data && json.data[date]) || [];
    const slots = day.map(s => (typeof s === 'string' ? s : s.start)).filter(Boolean);
    res.json({ success: true, configured: true, date, slots });
  } catch (e) {
    console.error('Cal slots error:', e.status || '', e.message);
    res.status(502).json({ success: false, error: 'cal_unavailable' });
  }
});

// ---- POST /api/cal/bookings ----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/bookings', async (req, res) => {
  if (!CAL_API_KEY) {
    return res.status(503).json({ success: false, error: 'booking_not_configured' });
  }
  const { eventTypeId, start, name, email, phone, notes, timeZone, language } = req.body || {};
  const tz = String(timeZone || 'UTC').slice(0, 64);

  if (!Number(eventTypeId) || !start || isNaN(Date.parse(start)) ||
      !name || String(name).trim().length < 2 || !EMAIL_RE.test(String(email || ''))) {
    return res.status(400).json({ success: false, error: 'invalid_booking' });
  }

  const attendee = {
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 160),
    timeZone: tz
  };
  if (phone) attendee.phoneNumber = String(phone).trim().slice(0, 32);
  if (language && ['en', 'ar'].includes(language)) attendee.language = language;

  const startISO = new Date(start).toISOString();
  const fullPayload = {
    eventTypeId: Number(eventTypeId),
    start: startISO,
    attendee,
    metadata: { source: 'webkmt-website', ...(notes ? { notes: String(notes).slice(0, 500) } : {}) }
  };

  try {
    let json;
    try {
      json = await calFetch('/bookings', { method: 'POST', version: V_BOOKINGS, body: fullPayload });
    } catch (firstErr) {
      // Some Cal setups reject metadata / optional attendee fields — retry minimal.
      console.warn('Cal booking retrying with minimal payload after:', firstErr.status || '', firstErr.message);
      const minimal = {
        eventTypeId: fullPayload.eventTypeId,
        start: startISO,
        attendee: { name: attendee.name, email: attendee.email, timeZone: tz }
      };
      json = await calFetch('/bookings', { method: 'POST', version: V_BOOKINGS, body: minimal });
    }
    const b = json?.data || {};
    res.json({
      success: true,
      booking: {
        uid: b.uid || null,
        id: b.id || null,
        title: b.title || b.eventType?.title || 'Audit Call',
        start: b.start || startISO,
        end: b.end || null
      }
    });
  } catch (e) {
    console.error('Cal booking error:', e.status || '', e.message, JSON.stringify(e.payload || {}).slice(0, 300));
    res.status(502).json({ success: false, error: 'booking_failed' });
  }
});

module.exports = router;
