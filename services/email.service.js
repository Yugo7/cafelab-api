import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatCurrency } from './utils.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const logoHtml = fs.readFileSync(path.join(dirname, '../templates/email/header.html'), 'utf8');
const footerHtml = fs.readFileSync(path.join(dirname, '../templates/email/footer.html'), 'utf8');

let transporter = nodemailer.createTransport({
    host: 'smtp-pt.securemail.pro', // replace with your SMTP server host
    port: 465, // replace with your SMTP server port
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'cafelab@yuna.pt', // replace with your SMTP server email
        pass: process.env.CAFELAB_EMAIL_APP // replace with your SMTP server password
    }
});

async function generateProductsHtml(order) {
    let productsHTML = '';

    for (let orderProduct of order.products) {
        productsHTML += `
			<tr>
				<td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
					<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
						<tr>
							<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
								<div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
									<p style="margin: 0; word-break: break-word;">${orderProduct.name}</p>

									<p style="margin: 0; word-break: break-word;">&nbsp; - ${orderProduct.size}</p>
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
									<p style="margin: 0; word-break: break-word;">${formatCurrency(orderProduct.price)}</p>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
        `;

    }

    return productsHTML;
}

export async function sendOrderEmail(subject, customer, shipping, order) {

    console.log('Order: ', order);
    const headerHtml = await generateHeaderHtml(order);
    const productsHtml = await generateProductsHtml(order)
    const shippingDetailsHtml = await generateShippingDetailsHtml(shipping.details);

    const templatePath = path.join(dirname, '../templates/email/order-new.html');
    const content = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = content.replace('{{products}}', productsHtml).replace('{{order_id}}', order.id).replace('{{total}}', formatCurrency(order.total)).replace('{{shipping}}', formatCurrency(shipping.cost.amount_total / 100.0)).replace('{{shipping_details}}', shippingDetailsHtml).replace('{{header}}', headerHtml);

    let info = await transporter.sendMail({
        from: '"CafeLab PT" <atendimentocafelab@yuna.pt>',
        to: customer.email,
        subject: subject,
        html: htmlContent
        //generateOrderHTML({ customer: { name: 'João' }, products: [{ name: 'Café', price: 2.5 }], total: 2.5 }), // html body
    });

    console.log('Message sent: %s', info.messageId);
}

export async function sendPasswordTokenEmail(token, email) {

    console.log('Token: ', token);
    const templatePath = path.join(dirname, '../templates/email/password-change.html');
    const content = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = content.replace('{{resetLink}}', process.env.FRONTEND_URL + '/reset-password/' + token).replace('{{footer}}', footerHtml).replace('{{header}}', logoHtml);

    let info = await transporter.sendMail({
        from: '"CafeLab PT" <cafelab@yuna.pt>',
        to: email,
        subject: "Alteração da palavra-passe",
        html: htmlContent
    });

    console.log('Message sent: %s', info.messageId);
}

export async function generateShippingDetailsHtml(shipping) {
    return `
    <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tbody>
            <tr>
                <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 620px; margin: 0 auto;" width="620">
                        <tbody>
                            <tr>
                                <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#101112;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                    <p style="margin: 0; margin-bottom: 0px;"><strong>Dados de envio</strong></p>
													<p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                                    <p style="margin: 0; margin-bottom: 0px;">${shipping.name}</p>
                                                    <p style="margin: 0; margin-bottom: 0px;">${shipping.address.line1}</p>
                                                    ${shipping.address.line2 ? `<p style="margin: 0; margin-bottom: 0px;">${shipping.address.line2}</p>` : ''}
                                                    <p style="margin: 0; margin-bottom: 0px;">${shipping.address.postal_code}</p>
                                                    ${shipping.address.city || shipping.address.state || shipping.address.country ? `<p style="margin: 0;">${shipping.address.city ? shipping.address.city + ', ' : ''}${shipping.address.state ? shipping.address.state + ', ' : ''}${shipping.address.country}</p>` : ''}
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#101112;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
                                                    <p style="margin: 0; margin-bottom: 16px;">&nbsp;</p>
                                                    <p style="margin: 0;">Prazo de entrega: 5-7 dias úteis</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>`
}


export async function generateHeaderHtml(order) {
    
    console.log('Order: ', order);
    const textSubscription = `chegará em sua morada a partir do dia 02 de cada mês.`;
    const textOrder = `enviaremos em ate 72h úteis.`;

    const headerText = `Prepararemos sua encomenda com carinho e ` + (order.products.some(product => product.id > 900) ? textSubscription : textOrder);

    return `
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
																<div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:20px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:24px;">
																	<p style="margin: 0;"><strong>Pedido ${order.id}</strong></p>
																	<p style="margin: 0; word-break: break-word;"><strong>Obrigado pela compra! </strong></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:25px;padding-left:10px;padding-right:10px;padding-top:10px;">
																<div style="color:#71777D;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
																	<p style="margin: 0; word-break: break-word;">${headerText}&nbsp;</p>
																	<p style="margin: 0; word-break: break-word;">&nbsp;</p>
																	<p style="margin: 0; word-break: break-word;">&nbsp;</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>`
}