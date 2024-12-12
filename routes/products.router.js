import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { uploadBlob } from '../services/vercel/blob.service.js';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../services/products.service.js';
import { createStripeProduct } from '../services/stripe.service.js';

dotenv.config();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const router = express.Router();

router.get('/sections', (req, res) => {
    const eventTypes = ['CAFE', 'BOUTIQUE'];
    return res.status(200).json(eventTypes);
});

// Create
router.post('/', upload.single('image'), async (req, res) => {
    console.log('Received POST request with body:', req.body);
    console.log('Received file:', req.file);

    try {
        const image = req.file ? await uploadBlob(req.file) : null;

        const productData = {
            nome_pt: req.body.nome_pt,
            descricao_pt: req.body.descricao_pt,
            origem: req.body.origem,
            grao: req.body.grao,
            preco: req.body.preco,
            imagem: image ? image.url : null,
            secao: req.body.secao,
            descricao_en: req.body.descricao_en,
            nome_en: req.body.nome_en,
            price_id: req.body.price_id,
            size_pt: req.body.size_pt,
            size_en: req.body.size_en,
            is_active: req.body.is_active !== undefined ? req.body.is_active : true
        };

        const stripeProduct = await createStripeProduct(productData.nome_en, productData.descricao_en, productData.preco);

        productData.price_id = stripeProduct.productPrice.id;

        console.log('Creating product with data:', productData);

        const product = await createProduct(productData);

        console.log('Creation successful, data:', product);
        return res.status(201).json(product);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: 'Error processing request' });
    }
});

// Read all products
router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Read a product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Update a product by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    console.log('Received UPDATE request with ID:', req.params.id);
    console.log('Received PUT request with body:', req.body);
    console.log('Received file:', req.file);

    try {
        const image = req.file ? await uploadBlob(req.file) : null;

        const productData = {
            ...(req.body.nome_pt && { nome_pt: req.body.nome_pt }),
            ...(req.body.descricao_pt && { descricao_pt: req.body.descricao_pt }),
            ...(req.body.origem && { origem: req.body.origem }),
            ...(req.body.grao && { grao: req.body.grao }),
            ...(req.body.preco && { preco: req.body.preco }),
            ...(image && { imagem: image.url }),
            ...(req.body.secao && { secao: req.body.secao }),
            ...(req.body.descricao_en && { descricao_en: req.body.descricao_en }),
            ...(req.body.nome_en && { nome_en: req.body.nome_en }),
            ...(req.body.price_id && { price_id: req.body.price_id }),
            ...(req.body.size_pt && { size_pt: req.body.size_pt }),
            ...(req.body.size_en && { size_en: req.body.size_en }),
            ...(req.body.is_active !== undefined && { is_active: req.body.is_active })
        };

        console.log('Updating product with data:', productData);

        const product = await updateProduct(req.params.id, productData);

        console.log('Update successful, data:', product);
        return res.status(200).json(product);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: 'Error processing request' });
    }
});

// Delete a product by ID (mark as inactive)
router.delete('/:id', async (req, res) => {
    try {
        const productData = { is_active: false };
        const product = await updateProduct(req.params.id, productData);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;