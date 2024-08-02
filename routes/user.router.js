import express from 'express';

const router = express.Router();
import { createCustomer, changePassword } from "../services/user.service.js";

// Create
router.post('/', async (req, res) => {
    const incoming = req.body;
    const { data, error } = createCustomer(incoming.customer);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Change Password
router.post('/change-password', async (req, res) => {
    const { email } = req.body;
    console.log('user:', email);
    const { data, error } = await changePassword(email);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default router;