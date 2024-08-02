import { createClient } from '@supabase/supabase-js';
import {createStripeCustomer} from "../services/stripe.service.js";


const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);


export async function createCustomer(customer) {
    try {
        console.log('customer:', customer.email);
        const stripeCustomer = await createStripeCustomer(customer.email, customer.name);

        const { data, error } = await supabase.auth.signUp({
            email: customer.email,
            password: customer.password,
            options: {
                data: {
                    name: customer.name,
                    age: customer.age,
                    gender: customer.gender,
                    stripeId: stripeCustomer.id,
                    role: "customer",
                },
            },
        });

        if (error) {
            throw error;
        }

        console.log('error:', error);
        console.log('data:', data);
        return data;
    } catch (error) {
        console.error('Error creating customer:', error.message);
        throw error;
    }
}

export const changePassword = async (email) => {
    try {
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://cafelab.pt/account/update-password',
        })
    } catch (e) {
        throw e;
    }
};

