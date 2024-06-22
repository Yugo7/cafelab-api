

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

    console.log('subscription:', data[0]);
    return data[0];
}