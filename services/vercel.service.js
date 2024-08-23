import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchAnalyticsData = async () => {
    try {
        console.log('Fetching analytics data...');
        // Fetch data from 'access' table
        let { data, error } = await supabase
            .from('analytcs')
            .select('date, accesses, visitors');

        if (error) {
            console.error(error.message);
            throw new Error('Failed to fetch analytics data');
        }

        return data;
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to fetch analytics data');
    }
};
