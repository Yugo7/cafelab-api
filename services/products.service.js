import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSubscriptionById(id) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id);
    if (error) throw error;

    return data[0];
}

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
    if (error) throw error;

    return data;
}