import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// Get all water logs for a user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's water logs
router.get('/:userId/today', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', todayTimestamp)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new water log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, amount, timestamp } = req.body;

    if (!user_id || !amount || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: user_id, amount, timestamp' });
    }

    const { data, error } = await supabase
      .from('water_logs')
      .insert([{ user_id, amount, timestamp }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a water log
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('water_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Water log deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a water log
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, timestamp } = req.body;

    const { data, error } = await supabase
      .from('water_logs')
      .update({ amount, timestamp })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
