import { getSupabaseClient } from '../utils/supabase.js';

const supabase = getSupabaseClient();

export const uploadBlob = async (file) => {
    const { data, error } = await supabase.storage
        .from('ads')
        .upload(`public/${file.originalname}`, file.buffer, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }

    const { publicURL, error: urlError } = supabase.storage
        .from('ads')
        .getPublicUrl(`public/${file.originalname}`);

    if (urlError) {
        console.error('Error getting public URL:', urlError.message);
        throw urlError;
    }

    return { url: publicURL };
};

export const createAd = async (adData) => {
    const { data, error } = await supabase
        .from('ads')
        .insert([adData]);

    if (error) {
        console.error('Error inserting ad:', error.message);
        throw error;
    }

    return data;
};

export const getAds = async () => {
    const { data, error } = await supabase
        .from('ads')
        .select('*');

    if (error) {
        console.error('Error fetching ads:', error.message);
        throw error;
    }

    return data;
};

export const getAdById = async (id) => {
    const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id);

    if (error) {
        console.error('Error fetching ad:', error.message);
        throw error;
    }

    return data;
};

export const updateAd = async (id, adData) => {
    const { data, error } = await supabase
        .from('ads')
        .update(adData)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating ad:', error.message);
        throw error;
    }

    return data;
};

export const deleteAd = async (id) => {
    const { data, error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting ad:', error.message);
        throw error;
    }

    return data;
};

