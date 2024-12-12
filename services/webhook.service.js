import { createClient } from '@supabase/supabase-js';
import { sendOrderEmail } from './email.service.js';
import { createGuestOrUpdateUser } from './user.service.js';
import { updateOrder } from './order.service.js';
import { getEventByEventTypeIdAndType } from './webhooks-events.service.js';
import { downloadAndUploadPdf } from './../utils/download.service.js';
import {getInvoice} from "./stripe.service.js";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveWebhookEvent(event) {
    console.log('Saving webhook event:', event.id);
    const { id, eventTypeId, info, createdAt, type } = event;

    const { data, error } = await supabase
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
    return { data, error };
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
    try {
        console.log('Handling checkout.session.completed:', event.data.object.metadata.order_id);

        const eventData = event.data.object

        const shipping = {
            details: eventData.shipping_details,
            cost: eventData.shipping_cost
        }
        const customer = eventData.customer_details

        const invoice = await getEventByEventTypeIdAndType(eventData.invoice, 'invoice.payment_succeeded')
        const stripeInvoice = await getInvoice(invoice[0].data.object.id)
        const pdfUrl = await downloadAndUploadPdf(stripeInvoice.invoice_pdf, eventData.metadata.order_id);

        const orderUpdateQuery = {
            status: 'PAYMENT_SUCCESSFUL',
            total: eventData.amount_total / 100,
            user_id: eventData.customer_details.email,
            session_id: eventData.id,
            note: eventData.custom_fields[0].text.value,
            receipt_url: pdfUrl,
        }

        const { data: updatedOrder } = await updateOrder(eventData.metadata.order_id, orderUpdateQuery)

        await sendOrderEmail('Order Confirmation', customer, shipping, updatedOrder);
        console.log('Order updated successfully:', eventData.metadata.order_id);

        await createGuestOrUpdateUser(eventData.customer_details, eventData.customer);

        return { data: 'Order updated successfully' };
    } catch (error) {
        console.error('Error in webhook processing:', error);
        return { error: 'Error in webhook processing' };
    }
}

async function downloadPdf(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
}