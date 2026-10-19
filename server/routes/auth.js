/**
 * Authentication Routes
 * Handles Supabase Auth operations
 */

const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Helper function to check if email should be admin
const isAdminUser = (email) => {
  return email && email.toLowerCase() === 'info@webkmt.com';
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Create user in Supabase Auth (using admin/service client)
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email for convenience
      user_metadata: { display_name: displayName }
    });

    if (error) {
      throw error;
    }

    // Note: The SQL database trigger 'on_auth_user_created' automatically
    // inserts a record in public.profiles table and sets role/plan

    res.json({
      success: true,
      data: {
        user: {
          uid: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name || displayName
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    // Get user details from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Get user profile from public.profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          uid: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          photoURL: profile.photo_url,
          role: profile.role,
          plan: profile.plan,
          preferences: profile.preferences,
          createdAt: profile.created_at
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    const { displayName, preferences, photoURL } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (displayName !== undefined) updateData.display_name = displayName;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (photoURL !== undefined) updateData.photo_url = photoURL;

    // Update in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (profileError) {
      throw profileError;
    }

    // Update in Supabase Auth user_metadata if needed
    const authUpdateData = {};
    if (displayName !== undefined) authUpdateData.display_name = displayName;
    if (photoURL !== undefined) authUpdateData.avatar_url = photoURL;

    if (Object.keys(authUpdateData).length > 0) {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: authUpdateData
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Generate password reset link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${req.protocol}://${req.get('host')}/`
      }
    });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Password reset link generated',
      link: process.env.NODE_ENV === 'development' ? data.properties?.action_link : undefined
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete user
router.delete('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Delete user from auth (profiles table will cascade delete)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('User deletion error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Set user role (admin operation)
router.post('/set-claims', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const { data: { user: requester }, error: reqError } = await supabase.auth.getUser(token);
    if (reqError || !requester) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    const { uid, role } = req.body;

    // Verify the requester is authorized to set admin role (only info@webkmt.com can perform role changes)
    if (!isAdminUser(requester.email)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Only admins can assign roles.'
      });
    }

    if (role === 'admin' && !isAdminUser(email)) {
      // Just check the target user email if we can query it
      const { data: targetUser } = await supabase.auth.admin.getUserById(uid);
      if (targetUser && !isAdminUser(targetUser.user?.email)) {
        return res.status(403).json({
          success: false,
          error: 'Admin role can only be set for info@webkmt.com'
        });
      }
    }

    // Update the profile role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: role })
      .eq('id', uid);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'User role updated successfully'
    });

  } catch (error) {
    console.error('Set role error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;