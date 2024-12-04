import {createClient} from '@supabase/supabase-js';
import {getProducts} from "./products.service.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function createOrder(cart, user, type) {
    const allProducts = await getProducts();

    const orderProducts = cart.items.map((item) => {
        const productItem = allProducts.find(p => p.id === item.id);
        return {
            id: productItem.id,
            name: productItem.nome_pt,
            price: productItem.preco,
            secao: productItem.secao,
            size: productItem.size_pt,
            price_id: productItem.price_id,
            quantity: item.quantity
        };
    });

    const {data, error} = await supabase
        .from('order')
        .insert(
            {
                user_id: user?.username ?? null,
                user: user ?? null,
                products: orderProducts,
                variety: cart.variety,
                status: 'CREATED',
                type: type,
                total: 0,
            }
        )
        .select();

    if (error) {
        console.log('error:', error);
        return res.status(500).json({error: error.message})
    }
    return data[0];
}

export async function getOrder(orderId) {
    const {data, error} = await supabase
        .from('order')
        .select('*')
        .eq('id', orderId)
        .single();
    if (error) throw error;
    return data;
}

export async function updateOrder(orderId, orderData) {
    const {data, error} = await supabase
        .from('order')
        .update(orderData)
        .eq('id', orderId)
        .select();

    if (error) {
        console.log('Error from Supabase:', error ? error.message : 'error message not found');
        throw {error: error.message};
    }

    console.log('Updated order data:', data);
    return data[0];
}

export async function deleteOrder(orderId) {
    const {data, error} = await supabase
        .from('order')
        .delete()
        .eq('id', orderId);
    if (error) throw error;
    return data;
}
export async function getAllOrders() {
    try {
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .gt('total', 0)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error('Error fetching orders');
        }

        return data;
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        return { error: error.message };
    }
}
export async function getOrdersByUserId(userId) {
    try {
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error('Error fetching orders for user');
        }

        return data;
    } catch (error) {
        console.error('Error fetching orders for user:', error.message);
        return { error: error.message };
    }
}
