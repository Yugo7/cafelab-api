import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveWebhookEvent(event) {
    const { id, info, createdAt, type } = event;

    const {data, error} = await supabase
    .from('webhook_events')
    .upsert([
        {
            id: id,
            data: info,
            created_at: createdAt,
            type: type,
        }
    ]);

    if (error) {
        console.error('Error saving webhook event:', error.message);
    }
    return {data, error};
}

export async function handleEventByType(event) {
    const { type } = event;

    switch (type) {
        case 'checkout.session.completed':
            return handleCheckoutSessionCompleted(event);
        default:
            console.log(`Unhandled event type: ${type} id: ${event.id}`);   
            return { error: `Unhandled event type: ${type} id: ${event.id}` };
    }
}

async function handleCheckoutSessionCompleted(event) {
    console.log('Handling checkout.session.completed:', event.data.object.metadata.order_id);

    const { data, error } = await supabase
        .from('order')
        .update({ 
            status: 'PAYMENT_SUCCESSFUL',
            total: event.data.object.amount_total/100,
            user_id: event.data.object.customer_details.email,
            session_id: event.data.object.id,
         })
        .eq('id', event.data.object.metadata.order_id);

    if (error) {
        console.error('Error updating order:', event.data.object.id);
        return { error: 'Error updating order' };
    }

    console.log('Order updated successfully:', event.data.object.metadata.order_id);
    return { data: 'Order updated successfully' };
}