import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCustomer(email, name) {
    const customerSearchRes = await searchCustomer(`email:\'${email}\'`);
    console.log('customerSearchRes:', customerSearchRes);

    if (customerSearchRes.data.length > 0) {
        return customerSearchRes.data[0];
    }
    else {
        const stripeCustomer = await stripe.customers.create({
            email: email,
            name: name,
        });
        return stripeCustomer;
    }
}

export async function searchCustomer(query) {
    const customerSearchRes = await stripe.customers.search({
        query: query,
    });

    return customerSearchRes;
}

export async function cancelSubscription(query) {
    const subscription = await stripe.subscriptions.update(
        '{{SUBSCRIPTION_ID}}',
        {
            cancel_at_period_end: true,
        }
    );
}

export async function createStripeProduct(name, description, price, imageUrl) {
    try {
        const product = await stripe.products.create({
            name: name,
            description: description,
            images: [imageUrl],
        });
        const productPrice = await createStripePrice(product.id, price)

        return { product, productPrice };
    } catch (error) {
        console.error('Error creating Stripe product:', error.message);
        throw error;
    }
}

export async function createStripePrice(productId, price) {
    try {
        return await stripe.prices.create({
            unit_amount: price * 100,
            currency: 'eur',
            product: productId,
        });
    } catch (error) {
        console.error('Error creating Stripe price:', error.message);
        throw error;
    }
}

export async function getInvoice(invoiceId) {
    try {
        return await stripe.invoices.retrieve(invoiceId);
    } catch (error) {
        console.error('Error retrieving invoice:', error.message);
        throw error;
    }
}