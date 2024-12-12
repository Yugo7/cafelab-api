import { createClient } from '@supabase/supabase-js';

import axios from 'axios';
import {getSupabaseClient} from "../../utils/supabase.js";

const supabaseClient = getSupabaseClient();

const vercelApiUrl = 'https://vercel.com/api';
const vercelToken = process.env.VERCEL_TOKEN;


export const fetchAnalyticsData = async (start, end) => {
    try {
        console.log('Fetching analytics data...');
        let { data, error } = await supabaseClient
            .from('analytcs')
            .select('date, accesses, visitors')
            .gte('date', start)
            .lte('date', end);

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

const vercelApiClient = axios.create({
    baseURL: vercelApiUrl,
    headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
    }
});

export const fetchAnalyticsDataByCountry = async (start, end) => {

    console.log('Vercel token:', start, end);
    const endpoint = '/web-analytics/stats';
    const params = {
        environment: 'production',
        from: start,
        to: end,
        tz: 'America/New_York',
        type: 'country',
        teamId: 'yugo7s-projects',
        projectId: 'cafelab-fe',
    };

    try {
        const response = await vercelApiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Vercel API: ${error.message}`);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw new Error('Failed to fetch data from Vercel API');
    }
};

export const fetchAnalyticsDataByDevice = async (start, end) => {
    console.log('Vercel token:', start, end);
    const endpoint = '/web-analytics/stats';
    const params = {
        environment: 'production',
        from: start,
        to: end,
        tz: 'America/New_York',
        type: 'device_type',
        teamId: 'yugo7s-projects',
        projectId: 'cafelab-fe',
    };

    try {
        const response = await vercelApiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Vercel API: ${error.message}`);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw new Error('Failed to fetch data from Vercel API');
    }
};

export const fetchAnalyticsDataByOS = async (start, end) => {
    console.log('Vercel token:', start, end);
    const endpoint = '/web-analytics/stats';
    const params = {
        environment: 'production',
        from: start,
        to: end,
        tz: 'America/New_York',
        type: 'os_name',
        teamId: 'yugo7s-projects',
        projectId: 'cafelab-fe',
    };

    try {
        const response = await vercelApiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Vercel API: ${error.message}`);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw new Error('Failed to fetch data from Vercel API');
    }
};

export const fetchAnalyticsDataByReferrer = async (start, end) => {
    console.log('Vercel token:', start, end);
    const endpoint = '/web-analytics/stats';
    const params = {
        environment: 'production',
        from: start,
        to: end,
        tz: 'America/New_York',
        type: 'referrer',
        teamId: 'yugo7s-projects',
        projectId: 'cafelab-fe',
    };

    try {
        const response = await vercelApiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Vercel API: ${error.message}`);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw new Error('Failed to fetch data from Vercel API');
    }
};