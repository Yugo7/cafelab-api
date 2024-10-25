import express from 'express';
import Stripe from 'stripe';
import { createClient } from "@supabase/supabase-js";
import { getProducts, getSubscriptionById } from "../services/products.service.js";
import {createOrder} from "../services/order.service.js";
import { createStripeCustomer } from "../services/stripe.service.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const frontendUrl = 'https://cafelab.pt/';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


router.post("/create-customer", async (req, res) => {
    const customer = req.body;
    console.log('customer:', customer);
    createStripeCustomer(customer.email, customer.name)
    res.send(customer);
});

router.post("/create-checkout-session", async (req, res) => {


    console.log('session body:', req.body.subscription);
    const date = new Date();
    date.setMonth(date.getMonth() + 7);
    date.setDate(25);
    date.setHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    const { id, variety, coffee, payment } = req.body.subscription;
    const subscription = await getSubscriptionById(id);


    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: subscription.price_id,
                quantity: 1
            },
        ],
        success_url: frontendUrl + 'success',
        cancel_url: frontendUrl + 'cancel',
        allow_promotion_codes: true,
        custom_fields: [
            {
              key: 'special_instructions',
              label: {
                type: 'custom',
                custom: 'Mande-nos uma mensagem',
              },
              type: 'text',
            },
          ],
        //subscription_data: { billing_cycle_anchor: unixTimestamp },
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['PT']
        },
        locale: 'pt'
    });

    subscription.variety = variety;
    subscription.coffee = coffee;

    let preco = subscription.price * payment;
    const { data, error } = await supabase
        .from('order')
        .insert([
            {
                products: subscription,
                status: 'PENDING',
                total: preco,
                session_id: session.id,
            }
        ]);

    if (error) {
        console.log('Error creating order:', error);
    }

    console.log('session:', session);
    res.json({ session });
});


router.post("/create-checkout", async (req, res) => {

    console.log(req.body)
    const user = req.body.cart.user;
    const cart = req.body.cart;

    const order = await createOrder(cart, user);
    console.log('order:', order);

    const productDetails = order.products.map((product) => {
        return {
            price: product.price_id,
            quantity: product.quantity
        };
    });

    const sessionConfig = {
        allow_promotion_codes: true,
        custom_fields: [
            {
              key: 'special_instructions',
              label: {
                type: 'custom',
                custom: 'Mande-nos uma mensagem',
              },
              type: 'text',
            },
          ],
        success_url: frontendUrl + 'success',
        cancel_url: frontendUrl + 'cancel',
        line_items: productDetails,
        mode: 'payment',
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['PT']
        },
        metadata: {
            order_id: order.id,
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 500,
                        currency: 'eur',
                    },
                    display_name: 'Envio por CTT',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    },
                },
            },
        ],
    };

    if (user) {
        sessionConfig.customer_email = user.username;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ session });
});

router.post("/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`🔔  Payment for ${session.amount_total} was successful!`);
            break;
        default:
            console.log(`🔔  Unhandled event type: ${event.type}`);
    }

    res.sendStatus(200);
});

export default router;