/**
 * Contact Routes
 * Handles contact form submissions and inquiries using Supabase
 */

const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Contact form submission
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message, phone, company, service } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
      message: message.trim(),
      source: 'website',
      source_details: {
        subject: subject ? subject.trim() : 'General Inquiry',
        service: service || 'general',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || '',
        status: 'new'
      },
      read: false,
      replied: false
    };

    // Save to Supabase (using admin privileges/service client on server side)
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select();

    if (error) {
      throw error;
    }

    const docId = data[0]?.id || 'local-' + Date.now();
    console.log(`📧 Contact form saved to Supabase: ${docId} from ${email}`);

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: docId,
        status: 'submitted'
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again later.'
    });
  }
});

// Newsletter subscription
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name, preferences } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('newsletter')
      .select('id')
      .eq('email', normalizedEmail);

    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email is already subscribed to our newsletter'
      });
    }

    // Save subscription
    const subscriptionData = {
      email: normalizedEmail,
      name: name || null,
      active: true,
      source: 'website'
    };

    const { data, error } = await supabase
      .from('newsletter')
      .insert([subscriptionData])
      .select();

    if (error) {
      throw error;
    }

    console.log(`New newsletter subscription: ${data[0]?.id} - ${normalizedEmail}`);

    res.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: {
        id: data[0]?.id,
        email: normalizedEmail
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter. Please try again later.'
    });
  }
});

// Unsubscribe from newsletter
router.post('/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Deactivate newsletter subscription
    const { data, error } = await supabase
      .from('newsletter')
      .update({ active: false })
      .eq('email', normalizedEmail)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in our newsletter list'
      });
    }

    console.log(`Newsletter unsubscribe: ${normalizedEmail}`);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe. Please try again later.'
    });
  }
});

// Get contact form submissions (protected admin endpoint)
router.get('/submissions', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('contacts')
      .select('*')
      .order('submitted_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (status) {
      query = query.eq('read', status === 'responded' || status === 'closed');
    }

    const { data: submissions, error } = await query;

    if (error) {
      throw error;
    }

    // Clean data for response
    const cleaned = submissions.map(sub => ({
      ...sub,
      ip: undefined,
      userAgent: undefined
    }));

    res.json({
      success: true,
      data: cleaned
    });

  } catch (error) {
    console.error('Contact submissions fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact submissions'
    });
  }
});

// Update contact submission status (protected admin endpoint)
router.put('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const isRead = ['responded', 'closed'].includes(status);
    const isReplied = status === 'responded';

    const { error } = await supabase
      .from('contacts')
      .update({
        read: isRead,
        replied: isReplied,
        source_details: {
          status,
          notes
        }
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Contact submission updated successfully'
    });

  } catch (error) {
    console.error('Contact submission update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact submission'
    });
  }
});

// Quote request (for project inquiries)
router.post('/quote', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      company, 
      projectType, 
      budget, 
      timeline, 
      description,
      features 
    } = req.body;

    // Validation
    if (!name || !email || !projectType || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, project type, and description are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const quoteData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
      message: description.trim(), // Maps description to message column
      source: 'quote-request',
      source_details: {
        projectType,
        budget: budget || 'not-specified',
        timeline: timeline || 'flexible',
        features: features || [],
        ip: req.ip,
        userAgent: req.headers['user-agent'] || '',
        status: 'new'
      },
      read: false,
      replied: false
    };

    const { data, error } = await supabase
      .from('contacts')
      .insert([quoteData])
      .select();

    if (error) {
      throw error;
    }

    const docId = data[0]?.id || 'local-' + Date.now();
    console.log(`New quote request saved to Supabase: ${docId} from ${email}`);

    res.json({
      success: true,
      message: 'Thank you for your quote request! We will review your project and get back to you within 24 hours.',
      data: {
        id: docId,
        status: 'submitted'
      }
    });

  } catch (error) {
    console.error('Quote request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit quote request. Please try again later.'
    });
  }
});

module.exports = router;