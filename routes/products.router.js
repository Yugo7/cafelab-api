import express from 'express';
import { createClient } from '@supabase/supabase-js';
import {uploadBlob} from "../services/vercel/blob.service.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sbkrffeyngcjbzrwhvdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3JmZmV5bmdjamJ6cndodmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTM2MjgsImV4cCI6MjAyODc2OTYyOH0.COR1kdIkfK19CRDIrdwmI2CQD8VXdnF46cc0Ql8ofyU';
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

    const promoImage = req.files.promoImage ? await uploadBlob(req.files.promoImage) : null;
    const postImage = req.files.postImage ? await uploadBlob(req.files.postImage) : null;

    const eventData = {
        name: req.body.name,
        date: req.body.date,
        description: req.body.description,
        local: req.body.local,
        imagePromotion: promoImage ? promoImage.url : null,
        imageFinish: postImage ? postImage.url : null,
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