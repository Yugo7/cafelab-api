import express from 'express';
const router = express.Router();
import {
    fetchAnalyticsData,
    fetchAnalyticsDataByCountry,
    fetchAnalyticsDataByDevice, fetchAnalyticsDataByOS, fetchAnalyticsDataByReferrer
} from '../services/vercel/analytics.service.js';

router.post('/vercel-analytics', async (req, res) => {
    const { start, end } = req.body;
    console.log(req.body)
    try {
        const data = await fetchAnalyticsData(start, end);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/vercel-analytics/statistics', async (req, res) => {
    const { start, end } = req.body;
    console.log(req.body)
    try {
        const country = await fetchAnalyticsDataByCountry(start, end);
        const device = await fetchAnalyticsDataByDevice(start, end);
        const os = await fetchAnalyticsDataByOS(start, end);
        const referrer = await fetchAnalyticsDataByReferrer(start, end);

        console.log('Country:', country);
        console.log('Device:', device);
        console.log('OS:', os);
        const data = {
            countries: { data: country.data },
            devices: { data: device.data },
            os: { data: os.data },
            referrers: { data: referrer.data },
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;