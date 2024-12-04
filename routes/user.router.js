import express from 'express';

const router = express.Router();
import {
    createCustomer,
    resetPassword,
    requestChangePassword,
    signInUser,
    getAllUsers
} from "../services/user.service.js";
import {getOrdersByUserId} from "../services/order.service.js";

// Create
router.post('/', async (req, res) => {
    const incoming = req.body.customer;
    const { data, error } = await createCustomer(incoming);
    if (error) return res.status(500).json({ error: error });
    return res.status(200).json(data);
});

// Change Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const { data, error } = await requestChangePassword(email);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

// Change Password
router.post('/change-password/:token', async (req, res) => {
    const { password } = req.body;
    const { data, error } = await resetPassword(req.params.token, password);
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

router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get orders by user ID
router.get('/:userId/orders', async (req, res) => {
    try {
        const orders = await getOrdersByUserId(req.params.userId);
        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ msg: "No orders found for this user" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

export default router;