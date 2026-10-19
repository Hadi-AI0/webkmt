/**
 * Analytics Routes
 * Handles performance tracking and user analytics via Supabase
 */

const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Track page view
router.post('/pageview', async (req, res) => {
  try {
    const { page, referrer, userAgent, timestamp } = req.body;

    if (!page) {
      return res.status(400).json({ success: false, error: 'Page is required' });
    }

    const analyticsData = {
      type: 'pageview',
      page,
      referrer: referrer || '',
      user_agent: userAgent || '',
      ip_address: req.ip,
      created_at: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('analytics_events').insert([analyticsData]);
        if (error) console.warn('Failed to save pageview to Supabase:', error.message);
        else console.log(`📊 Pageview tracked: ${page}`);
      } catch (err) {
        console.warn('Analytics insert warning:', err.message);
      }
    } else {
      console.log('📊 Pageview tracked (local):', analyticsData);
    }

    res.json({ success: true, message: 'Pageview tracked' });
  } catch (error) {
    console.error('Pageview tracking error:', error);
    res.status(500).json({ success: false, error: 'Failed to track pageview' });
  }
});

// Track events (button clicks, form submissions, etc.)
router.post('/event', async (req, res) => {
  try {
    const { event, category, label, value, page } = req.body;

    if (!event) {
      return res.status(400).json({ success: false, error: 'Event name is required' });
    }

    const eventData = {
      type: 'event',
      event_name: event,
      category: category || '',
      label: label || '',
      value: value !== undefined ? parseFloat(value) || 0 : null,
      page: page || '',
      ip_address: req.ip,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('analytics_events').insert([eventData]);
        if (error) console.warn('Failed to save event to Supabase:', error.message);
        else console.log(`📊 Event tracked: ${event}`);
      } catch (err) {
        console.warn('Analytics insert warning:', err.message);
      }
    } else {
      console.log('📊 Event tracked (local):', eventData);
    }

    res.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({ success: false, error: 'Failed to track event' });
  }
});

// Track performance metrics
router.post('/performance', async (req, res) => {
  try {
    const { page, metrics } = req.body;

    if (!page || !metrics) {
      return res.status(400).json({ success: false, error: 'Page and metrics are required' });
    }

    const perfData = {
      type: 'performance',
      page,
      lcp:  metrics.lcp  ? parseFloat(metrics.lcp)  : null,
      fid:  metrics.fid  ? parseFloat(metrics.fid)  : null,
      cls:  metrics.cls  ? parseFloat(metrics.cls)  : null,
      ttfb: metrics.ttfb ? parseFloat(metrics.ttfb) : null,
      fcp:  metrics.fcp  ? parseFloat(metrics.fcp)  : null,
      ip_address: req.ip,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('analytics_events').insert([perfData]);
        if (error) console.warn('Failed to save performance metrics:', error.message);
        else console.log(`📊 Performance tracked for: ${page}`);
      } catch (err) {
        console.warn('Analytics insert warning:', err.message);
      }
    }

    res.json({ success: true, message: 'Performance metrics recorded' });
  } catch (error) {
    console.error('Performance tracking error:', error);
    res.status(500).json({ success: false, error: 'Failed to track performance metrics' });
  }
});

// Get analytics summary (admin only)
router.get('/summary', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    if (!supabase) {
      return res.json({ success: true, data: { pageviews: 0, events: 0, topPages: [] } });
    }

    const [pvResult, evResult, pagesResult] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('type', 'pageview')
        .gte('created_at', cutoff),
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('type', 'event')
        .gte('created_at', cutoff),
      supabase
        .from('analytics_events')
        .select('page')
        .eq('type', 'pageview')
        .gte('created_at', cutoff)
        .limit(200)
    ]);

    // Aggregate top pages from the raw data
    const pageCounts = {};
    (pagesResult.data || []).forEach(row => {
      if (row.page) pageCounts[row.page] = (pageCounts[row.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    res.json({
      success: true,
      data: {
        pageviews: pvResult.count || 0,
        events: evResult.count || 0,
        topPages,
        period: { days, from: cutoff, to: new Date().toISOString() }
      }
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics summary' });
  }
});

module.exports = router;