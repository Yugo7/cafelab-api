import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { uploadBlob } from '../services/vercel/blob.service.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/sections', (req, res) => {
    const eventTypes = ['CAFE', 'BOUTIQUE'];
    return res.status(200).json(eventTypes);
});

// Create
router.post('/', upload.fields([
    { name: 'promoImage', maxCount: 1 }
]), async (req, res) => {
    console.log('Received POST request with body:', req.body);
    console.log('Received files:', req.files);

    const promoImage = req.files.promoImage ? await uploadBlob(req.files.promoImage[0]) : null;

    const eventData = {
        name: req.body.name,
        date: req.body.date,
        description: req.body.description,
        local: req.body.local,
        imagePromotion: promoImage ? promoImage.url : null,
        instagramUrl: req.body.instagramUrl
    };

    const { data, error } = await supabase
        .from('events')
        .insert([eventData]);

    if (error) {
        console.error('Error inserting event:', error.message);
        return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
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