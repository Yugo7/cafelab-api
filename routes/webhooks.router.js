import express from "express";
import {createClient} from "@supabase/supabase-js";
import { saveWebhookEvent, handleEventByType } from "../services/webhook.service.js";

const router = express.Router();

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://sbkrffeyngcjbzrwhvdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNia3JmZmV5bmdjamJ6cndodmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTM2MjgsImV4cCI6MjAyODc2OTYyOH0.COR1kdIkfK19CRDIrdwmI2CQD8VXdnF46cc0Ql8ofyU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create
router.post('/', async (req, res) => {
    const { id, data: info, created, type } = req.body;
    const createdAt = new Date(created * 1000).toISOString();
    const eventTypeId = info.object.id;

    const {data, error} = await saveWebhookEvent({ id, eventTypeId, info, createdAt, type });
    
    if (error) {
        console.log("error: ", error); 
        res.status(500).json("error");  
    }

    const result = await handleEventByType(req.body)
    res.json(result);
});

router.post('/invoice', async (req, res) => {
    const { id, data: info, created, type } = req.body;
    const createdAt = new Date(created * 1000).toISOString();
    const eventTypeId = info.object.id;

    const {data, error} = await saveWebhookEvent({ id, eventTypeId, info, createdAt, type });
    
    if (error) {
        console.log("error: ", error); 
        res.status(500).json("error");  
    }

    const result = await handleEventByType(req.body)
    res.json(result);
});

// Create
router.post('/checkout', async (req, res) => {
    const { id, data: info, created, type } = req.body;
    const createdAt = new Date(created * 1000).toISOString();
    const eventTypeId = info.object.id;

    const {data, error} = await saveWebhookEvent({ id, eventTypeId, info, createdAt, type });
    
    if (error) {
        console.log("error: ", error); 
        res.status(500).json("error");  
    }

    const result = await handleEventByType(req.body)
    res.json(result);
});

// Create
router.post('/subscription', async (req, res) => {
    const { id, data: info, created, type } = req.body;
    const createdAt = new Date(created * 1000).toISOString();
    const eventTypeId = info.object.id;

    const {data, error} = await saveWebhookEvent({ id, eventTypeId, info, createdAt, type });
    
    if (error) {
        console.log("error: ", error); 
        res.status(500).json("error");  
    }

    const result = await handleEventByType(req.body)
    res.json(result);
});

// Create
router.post('/test-payments', async (req, res) => {
    console.log("test webhooks working: ", req.body);

    res.json("ok");
});

// Create
router.post('/test-payments/invoice', async (req, res) => {
    console.log("invoice webhooks working: ", req.body);

    res.json("ok");
});

// Create
router.post('/test-payments/checkout', async (req, res) => {
    console.log("checkout webhooks working: ", req.body);

    res.json("ok");
});

// Create
router.post('/test-payments/subscription', async (req, res) => {
    console.log("subscription webhooks working: ", req.body);

    res.json("ok");
});
export default router;