import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getEvent(eventId) {
    const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('id', eventId)
        .single();
    if (error) throw error;
    return data;
}

export async function getEventByEventTypeIdAndType(eventId, type) {
    try {
        const { data, error } = await supabase
            .from('webhook_events')
            .select('*')
            .eq('event_type_id', eventId)
            .eq('type', type)
            .limit(1);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching invoice:', error.message);
        return { error: error.message };
    }
}

export async function getOrder(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
    if (error) throw error;
    return data;
}