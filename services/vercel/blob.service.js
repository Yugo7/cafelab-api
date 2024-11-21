import {put} from '@vercel/blob';
import fs from 'fs';

export const uploadBlob = async (blob) => {
    try {
        console.log('uploading blob...');

        const promoImageFile = blob[0];
        const result = await put(promoImageFile.originalname, promoImageFile.buffer, {
            access: 'public',
        });

        console.log('Blob uploaded successfully:', result.url);
        return result;
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to upload blob: ' + error.message);
    }
};

