import express from 'express';
const router = express.Router();
import { fetchAnalyticsData } from '../services/vercel/analytics.service.js';

router.get('/vercel-analytics', async (req, res) => {
    try {
        const data = await fetchAnalyticsData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;