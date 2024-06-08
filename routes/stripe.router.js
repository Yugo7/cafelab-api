import express from 'express';

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post("/create-customer", async (req, res) => {
    const { email, name } = req.body;
    const customer = await stripe.customers.create({
        email: email,
        name: name,
    });
    console.log('Payload:', req.body);
    console.log('Result:', customer);
    res.send(customer);
});

router.post("/update-customer-address", async (req, res) => {
    const { customerId, shippingInfo } = req.body;
    const customer = await stripe.customers.update(customerId, {
        address: {
            line1: shippingInfo.address.line1,
            city: shippingInfo.address.city,
            postal_code: shippingInfo.address.postal_code,
            country: shippingInfo.address.country,
        },
    });
    res.send(customer);
});

router.post("/create-payment-method", async (req, res) => {
    const { card, email, customerId } = req.body;
    const { error, paymentMethod } = await stripe.paymentMethods.create({
        type: 'card',
        card: card,
        billing_details: {
            email: email,
        },
    });

    if (error) {
        res.status(400).send({ error: error });
        return;
    }

    const attachedPaymentMethod = await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
    });

    if (error) {
        res.status(400).send({ error: error });
        return;
    }

    res.send(attachedPaymentMethod);
});

router.post("/create-subscription", async (req, res) => {
    const { stripeCustomer, priceId } = req.body;
    const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer,
        items: [{price: priceId}],
        payment_settings: {
            payment_method_types: ['card'],
            save_default_payment_method: 'on_subscription',
        },
    });

    if (subscription.error) {
        res.status(400).send({ error: subscription.error });
        return;
    }

    res.send(subscription);
});

module.exports = router;