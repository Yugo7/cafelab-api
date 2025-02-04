
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