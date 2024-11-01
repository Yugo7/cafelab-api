import { createClient } from '@supabase/supabase-js';
import { getProducts } from "../services/products.service.js";

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

    const { data, error } = await supabase
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
        return res.status(500).json({ error: error.message })
    }
    return data[0];
  }

  export async function  getOrder(orderId) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (error) throw error;
    return data;
  }

  export async function  updateOrder(orderId, orderData) {
    const { data, error } = await this.supabase
      .from('orders')
      .update(orderData)
      .eq('id', orderId);
    if (error) throw error;
    return data;
  }

  export async function  deleteOrder(orderId) {
    const { data, error } = await this.supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    if (error) throw error;
    return data;
  }
