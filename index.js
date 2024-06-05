import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();

// enable JSON body parser
app.use(express.json());

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sbkrffeyngcjbzrwhvdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3JmZmV5bmdjamJ6cndodmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTM2MjgsImV4cCI6MjAyODc2OTYyOH0.COR1kdIkfK19CRDIrdwmI2CQD8VXdnF46cc0Ql8ofyU';
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', async (req, res) => {
    let { data, error } = await supabase
        .from('products')
        .select('*')

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default app;