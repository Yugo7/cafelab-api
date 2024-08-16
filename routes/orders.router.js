import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sbkrffeyngcjbzrwhvdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3JmZmV5bmdjamJ6cndodmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTM2MjgsImV4cCI6MjAyODc2OTYyOH0.COR1kdIkfK19CRDIrdwmI2CQD8VXdnF46cc0Ql8ofyU';
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
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Read
router.get('/:userid', async (req, res) => {
    const { data, error } = await supabase
        .from('order')
        .select('*')
        .eq('user_id', req.params.userid)
        .order('created_at', { ascending: false });
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