import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../services/email.service.js';
import { getEventByEventTypeIdAndType } from '../services/webhooks-events.service.js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveWebhookEvent(event) {
    console.log('Saving webhook event:', event);
    const { id, eventTypeId, info, createdAt, type } = event;

    const {data, error} = await supabase
    .from('webhook_events')
    .upsert([
        {
            id: id,
            event_type_id: eventTypeId,
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

    const eventData = event.data.object

    const shipping = {
        details: eventData.shipping_details,
        cost: eventData.shipping_cost
    }
    const customer = eventData.customer_details

    console.log('eventData:', eventData);
    const invoice = await getEventByEventTypeIdAndType(eventData.invoice, 'invoice.payment_succeeded')

    console.log('invoice:', invoice[0].data);
    const { data, error } = await supabase
        .from('order')
        .update({ 
            status: 'PAYMENT_SUCCESSFUL',
            total: eventData.amount_total/100,
            user_id: eventData.customer_details.email,
            session_id: eventData.id,
            note: eventData.custom_fields[0].text.value,
            receipt_url: invoice[0].data.object.invoice_pdf,
         })
        .eq('id', event.data.object.metadata.order_id)
        .select();

    if (error) {
        console.error('Error updating order:', event.data.object.id);
        return { error: 'Error updating order' };
    }

    
    //sendEmail('Order Confirmation', customer, shipping, data[0]);

    console.log('Order updated successfully:', event.data.object.metadata.order_id);
    return { data: 'Order updated successfully' };
}