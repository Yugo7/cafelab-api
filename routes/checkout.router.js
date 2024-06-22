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
        .from('contacts')
        .insert([req.body]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});


const stripe = require('stripe')('sk_test_51P7j13RqqMn2mwDS7pkJfII6UNTrZGHDUrhN66LqVBX7W2fvrqu5H1Vmq0qgcp9b9kHGxNAZoaLoMHjl7sqyXwYM00YYDIn8zt');
const session = await stripe.checkout.sessions.create({
    success_url: 'https://example.com/success',
    line_items: [
        {
            price: 'price_1PUNakRqqMn2mwDSgZgrxSxz',
            quantity: 2,
        },
    ],
    mode: 'payment',
});

export default router;