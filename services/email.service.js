import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cafelab86@gmail.com', // replace with your Gmail email
        pass: process.env.EMAIL_APP // replace with your Gmail password
    }
});

function generateOrderHTML(order) {
    let productsHTML = '';
    for (let product of order.products) {
        productsHTML += `
        
        `;
    }

    return `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, ${order.customer.name}!</p>
        <table>
            <tr>
                <th>Product</th>
                <th>Price</th>
            </tr>
            ${productsHTML}
        </table>
        <p>Total: ${order.total}</p>
    `;
}

// Create a function to send emails
export async function sendEmail(to, subject, attachmentPath) {
    // Get the directory of the current module
    const dirname = path.dirname(fileURLToPath(import.meta.url));

    // Read the HTML content from the order.html file
    const content = fs.readFileSync(path.join(dirname, '../templates/email/order.html'), 'utf8');

    let info = await transporter.sendMail({
        from: '"CafeLab PT" <cafelab86@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: content, // HTML body
        // attachments: [
        //     {
        //         filename: path.basename(attachmentPath), // Extract filename from path
        //         path: attachmentPath // File path
        //     }
        // ]
    });

    console.log('Message sent: %s', info.messageId);
}