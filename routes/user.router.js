import express from 'express';

const router = express.Router();
import { createCustomer, changePassword, signInUser } from "../services/user.service.js";

// Create
router.post('/', async (req, res) => {
    const incoming = req.body.customer;
    const { data, error } = await createCustomer(incoming);
    if (error) return res.status(500).json({ error: error });
    return res.status(200).json(data);
});

// Change Password
router.post('/change-password', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await changePassword(email, password);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const { token, error } = await signInUser(email, password);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(token);
});

export default router;