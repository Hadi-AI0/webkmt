/**
 * Data Routes
 * Handles generic data operations via Supabase
 * Used for mini-app session data and user-scoped data writes.
 */

const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Allowed table names to prevent SQL injection via dynamic table routing
const ALLOWED_TABLES = ['mini_app_sessions', 'kmtlink_profiles', 'blogs', 'profiles'];

const validateTable = (table) => ALLOWED_TABLES.includes(table);

// Save / create a row
router.post('/save', async (req, res) => {
  try {
    const { table, data } = req.body;
    const userId = req.user?.uid;

    if (!table || !data) {
      return res.status(400).json({ success: false, error: 'Table and data are required' });
    }

    if (!validateTable(table)) {
      return res.status(403).json({ success: false, error: 'Table access not allowed' });
    }

    const rowData = {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from(table)
      .insert([rowData])
      .select();

    if (error) throw error;

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Data save error:', error);
    res.status(500).json({ success: false, error: 'Failed to save data' });
  }
});

// Get rows for the authenticated user from a given table
router.get('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const userId = req.user?.uid;
    const { limit = 10, offset = 0 } = req.query;

    if (!validateTable(table)) {
      return res.status(403).json({ success: false, error: 'Table access not allowed' });
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Data fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});

// Get a specific row by ID (ownership enforced)
router.get('/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;
    const userId = req.user?.uid;

    if (!validateTable(table)) {
      return res.status(403).json({ success: false, error: 'Table access not allowed' });
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Ownership check (admin bypasses)
    if (data.user_id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to access this document' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Document fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch document' });
  }
});

// Update a row by ID (ownership enforced)
router.put('/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;
    const { data: updatePayload } = req.body;
    const userId = req.user?.uid;

    if (!validateTable(table)) {
      return res.status(403).json({ success: false, error: 'Table access not allowed' });
    }

    if (!updatePayload) {
      return res.status(400).json({ success: false, error: 'Data is required' });
    }

    // Verify ownership first
    const { data: existing, error: fetchError } = await supabase
      .from(table)
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    if (existing.user_id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to update this document' });
    }

    const { error } = await supabase
      .from(table)
      .update({ ...updatePayload, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error('Data update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update data' });
  }
});

// Delete a row by ID (ownership enforced)
router.delete('/:table/:id', async (req, res) => {
  try {
    const { table, id } = req.params;
    const userId = req.user?.uid;

    if (!validateTable(table)) {
      return res.status(403).json({ success: false, error: 'Table access not allowed' });
    }

    // Verify ownership first
    const { data: existing, error: fetchError } = await supabase
      .from(table)
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    if (existing.user_id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this document' });
    }

    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Data delete error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete data' });
  }
});

module.exports = router;