import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// Get user settings
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no settings found, return default settings
      if (error.code === 'PGRST116') {
        return res.json(null);
      }
      throw error;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user settings
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, ...settings } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing required field: user_id' });
    }

    // Check if settings exist
    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', user_id)
      .single();

    let result;
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user_id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('user_settings')
        .insert([{ user_id, ...settings }])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user settings (partial update)
router.patch('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
