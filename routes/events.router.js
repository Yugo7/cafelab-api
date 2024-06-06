// events.router.js
import '../config.cjs';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create
router.post('/', async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .insert([req.body]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Read
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Read
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Update
router.put('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .update(req.body)
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Delete
router.delete('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default router;