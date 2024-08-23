import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net', // replace with your SMTP server host
    port: 465, // replace with your SMTP server port
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'atendimento@cafelab.pt', // replace with your SMTP server email
        pass: process.env.CAFELAB_EMAIL_APP // replace with your SMTP server password
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
    //const dirname = path.dirname(fileURLToPath(import.meta.url));

    // Read the HTML content from the order.html file
    //const content = fs.readFileSync(path.join(dirname, '../templates/email/order.html'), 'utf8');

    let info = await transporter.sendMail({
        from: '"CafeLab PT" <atendimento@cafelab.pt>', // sender address
        to: "japa_yugo@hotmail.com", // list of receivers
        subject: "assunto", // Subject line
        html: "test", // HTML body
        // attachments: [
        //     {
        //         filename: path.basename(attachmentPath), // Extract filename from path
        //         path: attachmentPath // File path
        //     }
        // ]
    });

    console.log('Message sent: %s', info.messageId);
}