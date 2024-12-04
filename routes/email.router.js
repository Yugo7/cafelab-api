import {activateEmailComm, deactivateEmailComm, sendOrderEmail} from '../services/email.service.js';
import express from "express";
import {signInUser} from "../services/user.service.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        await sendOrderEmail(email, subject, message);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/signup', async (req, res) => {
    const { email, name } = req.body;
    const result = await activateEmailComm(email, name);

    if (!result) {
        return res.status(500).json({ error: 'Failed to activate email' });
    }
    return res.status(200).json("Success");
});

router.post('/signout', async (req, res) => {
    const { email, reason, comment } = req.body;
    const result = await deactivateEmailComm(email, reason, comment);
    if (!result) {
        return res.status(500).json({ error: 'Failed to activate email' });
    }
    return res.status(200).json("Success");
});

export default router;