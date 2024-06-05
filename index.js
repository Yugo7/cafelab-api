import express from 'express';
import productsRouter from './routes/products.router';
import ordersRouter from './routes/orders.router';
import eventsRouter from './routes/events.router';

const app = express();

// enable JSON body parser
app.use(express.json());

// Use products router
app.use('/products', productsRouter);
// Use orders router
app.use('/orders', ordersRouter);
// Use events router
app.use('/events', eventsRouter);

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

export default app;