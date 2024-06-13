import express from 'express';

const router = express.Router();
import Stripe from 'stripe';
import {createClient} from "@supabase/supabase-js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sbkrffeyngcjbzrwhvdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3JmZmV5bmdjamJ6cndodmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTM2MjgsImV4cCI6MjAyODc2OTYyOH0.COR1kdIkfK19CRDIrdwmI2CQD8VXdnF46cc0Ql8ofyU';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post("/create-customer", async (req, res) => {
    const { email, name } = req.body;
    const customer = await stripe.customers.create({
        email: email,
        name: name,
    });
    res.send(customer);
});

router.post('/create-subscription', async (req, res) => {
    const { email, card } = req.body;

    const customer = await stripe.customers.create({ email });

    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: card,
        customer: customer.id,
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: 'price_1PB4tGRqqMn2mwDSTS2p1BJq' }],
        default_payment_method: paymentMethod.id,
    });

    res.json({ subscription: subscription });
});

router.post("/create-checkout-session", async (req, res) => {

    console.log('session body:', req.body.subscription);
    const date = new Date();
    date.setMonth(date.getMonth() + 7);
    date.setDate(25);
    date.setHours(0, 0, 0, 0); // Set the time to 00:00:00

    const unixTimestamp = Math.floor(date.getTime() / 1000);

    const { priceId, preco } = req.body.subscription;
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: 1
            },
        ],
        success_url: 'https://cafelab-fe.vercel.app/success',
        cancel_url: 'https://cafelab-fe.vercel.app/cancel',
        //subscription_data: { billing_cycle_anchor: unixTimestamp },
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['PT']
        },
        locale: 'pt'
    });

    // Create an order in your database with the session data
    const { data, error } = await supabase
        .from('order')
        .insert([
            {
                products: req.body.subscription,
                payment_status: 'PENDING',
                total: preco,
                session_id: session.id
            }
        ]);

    if (error) {
        console.log('Error creating order:', error);
    }

    console.log('session:', session);
    res.json({ session });
});

export default router;