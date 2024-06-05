import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();

// enable JSON body parser
app.use(express.json());

// Create a single supabase client for interacting with your database
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', async (req, res) => {
    let { data, error } = await supabase
        .from('your-table')
        .select('*')

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default app;