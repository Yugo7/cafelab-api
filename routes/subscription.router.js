import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/:id', async (req, res) => {
    const { name, email, phone, description } = req.body;
    const userId = req.params.id;
    const { data, error } = await supabase
        .from('contacts')
        .insert([
            {
                name: `automated request from user: ${userId}`,
                email,
                phone,
                description: "cancel subscription request"
            }
        ]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

router.post('/cancel/:id', async (req, res) => {
    const userId = req.params.id;
    const { data, error } = await supabase
        .from('order')
        .select()
        .eq('id', userId);
    console.log('error:', error);

    return res.status(200).json(data);
});

export default router;