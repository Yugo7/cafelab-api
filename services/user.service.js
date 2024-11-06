import {createClient} from '@supabase/supabase-js';
import {createStripeCustomer} from "../services/stripe.service.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET;

export async function createGuest(customer) {

    createUser({...customer, role: ['guest'], isGuest: true});
}

export async function createCustomer(customer) {
    console.log('customer:', customer);
    const {data: stripeCustomer, error} = await createStripeCustomer(user.email, user.name);

    if (error) {
        console.error('Error creating stripe customer:', error.message);
        throw error;
    }

    createUser({customer, stripe_id: stripeCustomer.id, role: ['customer'], isGuest: false});
}

async function createUser(user) {
    try {
        console.log('user:', user);
        if (!user.password) {
            console.log('Password is null, setting a default password');
            user.password = generateRandomPassword();
            console.log(user.password);
        }
        const hashedPassword = await bcrypt.hash(user.password , 10);

        const { data, error } = await supabase
            .from('user')
            .insert([
                {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    birthday: user.birthdate,
                    address: user.address,
                    stripe_id: user.stripe_id,
                    role: user.role,
                    is_guest: user.isGuest,
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
        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        
        const { data, error } = await supabase
            .from('password_tokens')
            .insert([
                {
                    user_id: user.id,
                    token: token,
                    expires_at: expiresAt.toISOString(),
                },
            ]);

        if (error) {
            throw error;
        }

        //await sendPasswordResetEmail(user.email, token);
        console.log('Password reset token sent successfully: ', token);

        return {
            success: true,
            message: 'Password reset token sent successfully',
        };
    } catch (error) {
        console.error('Error requesting password reset:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const { data: tokenData, error: tokenError } = await supabase
            .from('password_tokens')
            .select('*')
            .eq('token', token)
            .single();

            console.log('tokenData:', tokenData);   

        if (tokenError || !tokenData) {
            throw new Error('Invalid or expired token');
        }

        const now = new Date();
        const tokenExpiryDate = new Date(tokenData.expires_at);

        if (tokenExpiryDate.toISOString() < now.toISOString()) {
            throw new Error('Token has expired');
        }

        const user = await getUserById(tokenData.user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const { data, error } = await supabase
            .from('user')
            .update({ password: hashedNewPassword })
            .eq('id', user.id);

        if (error) {
            throw error;
        }

        await supabase
            .from('password_tokens')
            .delete()
            .eq('token', token);

        return {
            success: true,
            message: 'Password changed successfully',
        };
    } catch (error) {
        console.error('Error resetting password:', error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

export async function updateUser(user) {
    try {
        let updateData = {};

        if (user.username !== undefined) updateData.username = user.username;
        if (user.name !== undefined) updateData.name = user.name;
        if (user.nif !== undefined) updateData.nif = user.nif;
        if (user.email !== undefined) updateData.email = user.email;
        if (user.birthday !== undefined) updateData.birthday = user.birthday;
        if (user.address !== undefined) updateData.address = user.address;
        if (user.stripe_id !== undefined) updateData.stripe_id = user.stripe_id;
        if (user.guest_stripe_ids !== undefined) updateData.guest_stripe_ids = user.guest_stripe_ids;
        if (user.role !== undefined) updateData.role = user.role;
        if (user.is_guest !== undefined) updateData.is_guest = user.is_guest;

        console.log('user:', user);
        const { data, error } = await supabase
            .from('user')
            .update({nif: "teste"})
            .eq('id', user.id)
            .select();

        if (error) {
            console.error('Error from Supabase:', error);
            throw error;
        }
        console.log('updateData:', data);
        return data[0];
    } catch (error) {
        console.error('Error updating user:', error.message);
        return { error: error.message };
    }
}

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

async function getUserById(id) {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', id);

        if (error) {
            throw new Error('Error fetching user');
        }

        return data[0];
    } catch (error) {
        console.error('Error fetching user by id:', error.message);
        return null;
    }
}

export async function createGuestOrUpdateUser(customer_details, stripe_id) {
    const user = await getUserByEmail(customer_details.email);
    console.log('user:', user);
    if (!user) {
        await createGuest({
            name: customer_details.name,
            username: customer_details.email,
            email: customer_details.email,
            address: customer_details.address,
            stripe_id: stripe_id,
        });
    } else {
        let guestStripeIds = user.guest_stripe_ids || [];
        if (stripe_id && !guestStripeIds.includes(stripe_id)) {
            guestStripeIds.push(stripe_id);
        }
        console.log('guestStripeIds: ', guestStripeIds);
        await updateUser({
            id: user.id,
            guest_stripe_ids: guestStripeIds, 
            nif: "niftest"
        });
    }
}

const getToken = async (user) => {
    return jwt.sign({id: user.id, email: user.email, role: user.role}, JWT_SECRET, {expiresIn: '1h'});
}


function generateRandomPassword(length = 16) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}