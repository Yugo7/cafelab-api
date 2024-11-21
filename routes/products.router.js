import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { uploadBlob } from '../services/vercel/blob.service.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/sections', (req, res) => {
    const eventTypes = ['CAFE', 'BOUTIQUE'];
    return res.status(200).json(eventTypes);
});

// Read
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Read
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Update
router.put('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .update(req.body)
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Delete
router.delete('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default router;