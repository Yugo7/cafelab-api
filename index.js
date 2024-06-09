import cors from 'cors';
import express from 'express';
import productsRouter from './routes/products.router.js';
import ordersRouter from './routes/orders.router.js';
import eventsRouter from './routes/events.router.js';
import stripeRouter from './routes/stripe.router.js';
import menuRouter from './routes/menu.router.js';

const app = express();

// Enable CORS
app.use(cors());

// enable JSON body parser
app.use(express.json());

// Use products router
app.use('/products', productsRouter);
// Use orders router
app.use('/orders', ordersRouter);
// Use events router
app.use('/events', eventsRouter);
// Use stripe router
app.use('/menu', menuRouter);
// Use stripe router
app.use('/sp', stripeRouter);

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;