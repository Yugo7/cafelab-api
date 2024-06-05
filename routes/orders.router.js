import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sbkrffeyngcjbzrwhvdq.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create
router.post('/', async (req, res) => {
    const { data, error } = await supabase
        .from('order')
        .insert([req.body]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Read
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('order')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Read
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('order')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Update
router.put('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('order')
        .update(req.body)
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Delete
router.delete('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('order')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default router;