import express from 'express';
import {createOrder, getAllOrders, getOrdersByUserId, updateOrder, deleteOrder} from '../services/order.service.js';

const router = express.Router();

// Create
router.post('/', async (req, res) => {
    try {
        const data = await createOrder(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all orders
router.get('/', async (req, res) => {
    try {
        const data = await getAllOrders();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read orders by user ID
router.get('/:userid', async (req, res) => {
    try {
        const data = await getOrdersByUserId(req.params.userid);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const data = await updateOrder(req.params.id, req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const data = await deleteOrder(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;