import '../config.cjs';
import {createStripeProduct} from "./stripe.service.js";
import {getSupabaseClient} from "../utils/supabase.js";

const supabase = getSupabaseClient();

export async function getSubscriptionById(id) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id);
    if (error) throw error;

    return data[0];
}

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
    if (error) throw error;

    return data;
}

// Create a new product
export async function createProduct(productData) {
    console.log('productData:', productData);

    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

    if (error) {
        console.error('Error CREATING product:', error.message);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error('Product update failed or no data returned');
    }

    return data[0];
}

// Read a product by ID
export async function getProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id);
    if (error) throw error;

    return data[0];
}

// Update a product by ID
export async function updateProduct(id, productData) {
    console.log('Updating product with ID:', id);
    console.log('Product data:', productData);

    // Fetch the current product data
    const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) {
        console.error('Error fetching current product:', fetchError.message);
        throw fetchError;
    }

    // Check if the price has changed
    if (productData.preco && productData.preco !== currentProduct.preco) {
        // Create a new price on Stripe
        const stripeProduct = await createStripeProduct(
            currentProduct.nome_en,
            currentProduct.descricao_en,
            productData.preco,
            currentProduct.imagem
        );

        // Update the product data with the new price ID
        productData.price_id = stripeProduct.productPrice.id;
    }

    const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating product:', error.message);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error('Product update failed or no data returned');
    }

    return data[0];
}

// Delete a product by ID
export async function deleteProduct(id) {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    if (error) throw error;

    return data;
}