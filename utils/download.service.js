import axios from 'axios';
import {uploadPdfToBlob} from '../services/vercel/blob.service.js';
import dotenv from 'dotenv';

dotenv.config();

async function downloadPdf(url) {
    console.log('Downloading PDF from:', url);
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else {
            console.error('Error message:', error.message);
        }
        throw error;
    }
}

export async function downloadAndUploadPdf(pdfUrl, orderId) {
    const pdfData = await downloadPdf(pdfUrl);
    return await uploadPdfToBlob('receipt-order' + orderId + Date.now(), pdfData);
}