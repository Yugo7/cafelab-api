import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProducts } from './products.service.js';

let transporter = nodemailer.createTransport({
    host: 'smtp-pt.securemail.pro', // replace with your SMTP server host
    port: 465, // replace with your SMTP server port
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'yugo@yuna.pt', // replace with your SMTP server email
        pass: process.env.CAFELAB_EMAIL_APP // replace with your SMTP server password
    }
});

function generateOrderHTML(order) {
    let productsHTML = '';
    for (let product of order.products) {
        productsHTML += `
            <tr>
                <th>${product.name}</th>
                <th>${product.price}</th>
            </tr>
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

async function generateProductsHtml(order) {
    let productsHTML = '';
    const dbProducts = await getProducts();

    for (let orderProduct of order.products) {
        const dbProduct = dbProducts.find(product => product.id === orderProduct.id);
        if (dbProduct) {
            console.log('DB Product: ', dbProduct);
            productsHTML += `
			<tr>
				<td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
					<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
						<tr>
							<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
								<div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
									<p style="margin: 0; word-break: break-word;">${dbProduct.nome_pt}</p>

									<p style="margin: 0; word-break: break-word;">&nbsp; - ${dbProduct.origem}</p>
									<p style="margin: 0; word-break: break-word;">&nbsp; - ${order.variety}</p>
									<p style="margin: 0; word-break: break-word;">&nbsp;</p>
								</div>
							</td>
						</tr>
					</table>
				</td>
				<td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
					<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
						<tr>
							<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
								<div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
									<p style="margin: 0; word-break: break-word;">€${dbProduct.preco}</p>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>F
        `;
    
        }
    }

    return productsHTML;
}

// Create a function to send emails
export async function sendEmail(to, subject, order) {

    const productsHtml = await generateProductsHtml(order)
    console.log('Order: ', order.products);
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const templatePath = path.join(dirname, '../templates/email/order-new.html');
    const content = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = content.replace('{{products}}', productsHtml);

    let info = await transporter.sendMail({
        from: '"CafeLab PT" <yugo@yuna.pt>',
        to: to,
        subject: subject,
        html: htmlContent
        //generateOrderHTML({ customer: { name: 'João' }, products: [{ name: 'Café', price: 2.5 }], total: 2.5 }), // html body
    });

    console.log('Message sent: %s', info.messageId);
}