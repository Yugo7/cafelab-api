import { sendEmail } from '../services/email.service.js';
import express from "express";

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        await sendEmail(email, subject, message);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;