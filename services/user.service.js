import { createClient } from '@supabase/supabase-js';
import { createStripeCustomer } from "../services/stripe.service.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET;

export async function createCustomer(customer) {
    try {
        console.log('customer:', customer);
        const stripeCustomer = await createStripeCustomer(customer.email, customer.name);

        console.log('customer:', customer);
        console.log('stripeCustomer:',stripeCustomer);
        const hashedPassword = await bcrypt.hash(customer.password, 10);

        const { data, error } = await supabase
            .from('user')
            .insert([
                {
                    username: customer.name,
                    email: customer.email,
                    password: hashedPassword,
                    birthday: customer.birthdate,
                    address: customer.address,
                    stripe_id: stripeCustomer.id,
                    role: ['customer'],
                },
            ])
            .select('*');

        if (error) {
            throw error;
        }
        return getToken(data[0]);
    } catch (error) {
        console.error('Error creating customer:', error.message);
        return { error: error.message };
    }
}

export async function signInUser(email, password) {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

        console.log('user:', error);
        if (error) {
            throw error;
        }

        const user = data;
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id, name:user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        return {
            success: true,
            message: 'Sign-in successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                birthdate: user.birthdate,
                address: user.address,
                stripeId: user.stripeId,
                role: user.role,
            },
        };
    } catch (error) {
        console.error('Error signing in:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
}

export const requestChangePassword = async (email) => {

    try {
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://cafelab.pt/account/update-password',
        })
    } catch (e) {
        throw e;
    }
};

export const changePassword = async (email, newPassword) => {
    try {
        console.log('email:', email);
        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const { data, error } = await supabase
            .from('user')
            .update({ password: hashedNewPassword })
            .eq('id', user.id);

        return {
            success: true,
            message: 'Password changed successfully',
        };
    } catch (error) {
        console.error('Error changing password:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

export async function getUserByEmail(email) {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email);

        if (error) {
            throw new Error('Error fetching user');
        }

        return data[0];
    } catch (error) {
        console.error('Error fetching user by email:', error.message);
        return null;
    }
}
const getToken = async (user) => { 
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return token;
}
