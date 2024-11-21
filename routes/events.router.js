// events.router.js
import '../config.cjs';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import {uploadBlob} from "../services/vercel/blob.service.js";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', upload.fields([
    { name: 'promoImage', maxCount: 1 },
    { name: 'postImage', maxCount: 1 }
]), async (req, res) => {
    console.log('Received POST request with body:', req.body);
    console.log('Received files:', req.files);

    try {
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
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: error.message });
    }
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
router.put('/:id', upload.fields([
    { name: 'promoImage', maxCount: 1 },
    { name: 'postImage', maxCount: 1 }
]), async (req, res) => {
    console.log('Received UPDATE request with ID:', req.params.id);
    console.log('Received PUT request with body:', req.body);
    console.log('Received files:', req.files);

    try {
        const promoImage = req.files.promoImage ? await uploadBlob(req.files.promoImage) : null;
        const postImage = req.files.postImage ? await uploadBlob(req.files.postImage) : null;

        const eventData = {
            ...(req.body.name && { name: req.body.name }),
            ...(req.body.date && { date: req.body.date }),
            ...(req.body.description && { description: req.body.description }),
            ...(req.body.local && { local: req.body.local }),
            ...(promoImage && { imagePromotion: promoImage.url }),
            ...(postImage && { imageFinish: postImage.url }),
            ...(req.body.instagramUrl && { instagramUrl: req.body.instagramUrl })
        };

        console.log('Updating event with data:', eventData);

        const { data, error } = await supabase
            .from('events')
            .update(eventData)
            .eq('id', req.params.id)
            .select();

        if (error) {
            console.error('Error updating event:', error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log('Update successful, data:', data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: 'Error processing request' });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    console.log('Received DELETE request with ID:', req.params.id);
    const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).json(data);
});

export default router;