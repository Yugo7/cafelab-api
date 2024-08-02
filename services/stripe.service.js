import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCustomer(email, name) {
    const customerSearchRes = await searchCustomer(`email:\'${email}\'`);
    console.log('customerSearchRes:', customerSearchRes);

    if (customerSearchRes.data.length > 0) {
        return customerSearchRes[0];
    }
    else {
    const customer = await stripe.customers.create({
        email: email,
        name: name,
    });
    return customer;
    }
}

export async function searchCustomer(query) {
    const customerSearchRes = await stripe.customers.search({
        query: query,
    });

    return customerSearchRes;
}