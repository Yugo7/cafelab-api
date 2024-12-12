import {put} from '@vercel/blob';

export const uploadBlob = async (blob) => {
    try {
        console.log('uploading blob...');

        const imageFile = Array.isArray(blob) ? blob[0] : blob;
        console.log('blob:', blob);
        const result = await put(imageFile.originalname, imageFile.buffer, {
            access: 'public',
        });

        console.log('Blob uploaded successfully:', result.url);
        return result;
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to upload blob: ' + error.message);
    }
};


export const uploadPdfToBlob = async (blobName, data) => {
    try {
        console.log('uploading pdf...');
        console.log('blobName:', blobName);
        console.log('data:', data);

        const result = await put(blobName, data, {
            access: 'public',
        });
        return result.url;
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to upload blob: ' + error.message);
    }
};
