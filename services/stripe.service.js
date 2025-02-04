import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCustomer(email, name) {
    const customerSearchRes = await searchCustomer(`email:\'${email}\'`);
    console.log('customerSearchRes:', customerSearchRes);

    if (customerSearchRes.data.length > 0) {
        return customerSearchRes.data[0];
    } else {
        return await stripe.customers.create({
            email: email,
            name: name,
        });
    }
}

export async function searchCustomer(query) {
    return stripe.customers.search({
        query: query,
    });
}

export async function cancelSubscription(subscriptionId) {
    try {
        return await stripe.subscriptions.cancel(
            subscriptionId
        );
    } catch (error) {
        console.error('Error creating Stripe product:', error.message);
        throw error;
    }
}

export async function resumeSubscription(subscriptionId) {
    try {
        return await stripe.subscriptions.resume(
            subscriptionId,
            {
                billing_cycle_anchor: 'unchanged',
            }
        );
    } catch (error) {
        console.error('Error creating Stripe product:', error.message);
        throw error;
    }
}

export async function createStripeProduct(name, description, price, imageUrl) {
    try {
        const product = await stripe.products.create({
            name: name,
            description: description,
            images: [imageUrl],
        });
        const productPrice = await createStripePrice(product.id, price)

        return {product, productPrice};
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

export async function createCoupon(params) {
    try {
        return await stripe.coupons.create({
            amount_off: params.amount_off,
            applies_to: params.applies_to,
            currency: "eur",
            max_redemptions: params.max_redemptions,
            name: params.name,
            percent_off: params.percent_off,
            redeem_by: params.redeem_by,
        });
    } catch (error) {
        console.error('Error creating coupon:', error.message);
        throw error;
    }
}

export async function createPromotionCode(params) {
    try {
        return await stripe.promotionCodes.create({
            coupon: params.coupon,
            active: true,
            code: params.code,
            customer: params.customer,
            expand: params.expand,
            expires_at: params.expires_at,
            max_redemptions: params.max_redemptions,
            restrictions: params.restrictions,
        });
    } catch (error) {
        console.error('Error creating promotion code:', error.message);
        throw error;
    }
}

export async function getAllCouponsWithPromotionCodes() {
    try {
        const coupons = await stripe.coupons.list();
        return await Promise.all(coupons.data.map(async (coupon) => {
            const promotionCodes = await stripe.promotionCodes.list({coupon: coupon.id});
            return {...coupon, promotionCodes: promotionCodes.data};
        }));
    } catch (error) {
        console.error('Error fetching coupons with promotion codes:', error.message);
        throw error;
    }
}