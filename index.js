import express from 'express';
import productsRouter from './routes/products.router';

const app = express();

// enable JSON body parser
app.use(express.json());

// Use products router
app.use('/products', productsRouter);

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

export default app;