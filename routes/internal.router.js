import express from 'express';
const router = express.Router();
import { fetchAnalyticsData } from '../services/vercel/analytics.service.js';

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

export default router;