import '../config.cjs';
import express from 'express';
import multer from 'multer';
import { uploadBlob, createAd, getAds, getAdById, updateAd, deleteAd } from '../services/ads.service.js';
import {createCoupon, createPromotionCode, getAllCouponsWithPromotionCodes} from '../services/stripe.service.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.post('/', upload.single('adImage'), async (req, res) => {
    console.log('Received POST request with body:', req.body);
    console.log('Received file:', req.file);

    try {
        const adImage = req.file ? await uploadBlob(req.file) : null;

        const adData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: adImage ? adImage.url : null,
            link: req.body.link
        };

        const data = await createAd(adData);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await getAds();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:id', upload.single('adImage'), async (req, res) => {
    console.log('Received UPDATE request with ID:', req.params.id);

    try {
        const adImage = req.file ? await uploadBlob(req.file) : null;

        const adData = {
            ...(req.body.title && { title: req.body.title }),
            ...(req.body.description && { description: req.body.description }),
            ...(adImage && { imageUrl: adImage.url }),
            ...(req.body.link && { link: req.body.link })
        };

        console.log('Updating ad with data:', adData);

        const data = await updateAd(req.params.id, adData);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).json({ error: 'Error processing request' });
    }
});

router.post('/coupons', async (req, res) => {
    const {
        amount_off,
        applies_to,
        duration,
        duration_in_months,
        expand,
        id,
        max_redemptions,
        name,
        percent_off,
        redeem_by,
        code, customer, expires_at, restrictions
    } = req.body;

    try {
        const coupon = await createCoupon({
            amount_off,
            applies_to,
            duration,
            duration_in_months,
            expand,
            id,
            max_redemptions,
            name,
            percent_off,
            redeem_by
        });

        const promotionCode = await createPromotionCode({
            coupon: coupon.id,
            code: code,
            customer: customer,
            expires_at: expires_at,
            max_redemptions: max_redemptions,
            restrictions: restrictions
        });

        res.status(200).json({ coupon, promotionCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/coupons', async (req, res) => {
    try {
        const couponsWithPromotionCodes = await getAllCouponsWithPromotionCodes();
        res.status(200).json(couponsWithPromotionCodes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await getAdById(req.params.id);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    console.log('Received DELETE request with ID:', req.params.id);
    try {
        const data = await deleteAd(req.params.id);
        return res.status(204).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


export default router;