import express from 'express';

const router = express.Router()
import {createCustomer} from "../services/user.service.js";


// Create
router.post('/', async (req, res) => {
    const user = req.body;
    const {data, error} = createCustomer(user)
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

export default router;