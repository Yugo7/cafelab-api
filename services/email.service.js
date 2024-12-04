import nodemailer from 'nodemailer';
import {promises as fs} from 'fs';
import {formatCurrency} from './utils.js';
import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);


const logoHtml = '<table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">\n' +
    '    <tr>\n' +
    '        <td align="center" bgcolor="#ffffff" style="padding:0;Margin:0;background-color:#ffffff">\n' +
    '            <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">\n' +
    '                <tr>\n' +
    '                    <td align="left" style="padding:20px;Margin:0">\n' +
    '                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
    '                            <tr>\n' +
    '                                <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">\n' +
    '                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
    '                                        <tr>\n' +
    '                                            <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://cafelab.pt" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#666666;font-size:14px"><img src="https://fhdwzhs.stripocdn.email/content/guids/CABINET_9aa060212a2ca0f423493465feef71fa5c2d40818b5dfdd67e2c9d9b4679cf9a/images/cafelab.jpg" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="200" title="Logo"></a></td>\n' +
    '                                        </tr>\n' +
    '                                    </table></td>\n' +
    '                            </tr>\n' +
    '                        </table></td>\n' +
    '                </tr>\n' +
    '            </table></td>\n' +
    '    </tr>\n' +
    '</table>';
const footerHtml = `<table className="row row-14" align="center" width="100%" border="0" cellPadding="0" cellSpacing="0"
                           role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <tbody>
    <tr>
        <td>
            <table className="row-content stack" align="center" border="0" cellPadding="0" cellSpacing="0"
                   role="presentation"
                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                   width="620">
                <tbody>
                <tr>
                    <td className="column column-1" width="100%"
                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table className="social_block block-1" width="100%" border="0" cellPadding="15" cellSpacing="0"
                               role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                                <td className="pad">
                                    <div className="alignment" align="center">
                                        <table className="social-table" width="111px" border="0" cellPadding="0"
                                               cellSpacing="0" role="presentation"
                                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                            <tr>
                                                <td style="padding:0 5px 0 0px;"><a
                                                    href="https://www.facebook.com/cafelablisbon" target="_blank"><img
                                                    src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/facebook@2x.png"
                                                    width="32" height="auto" alt="Facebook" title="Facebook"
                                                    style="display: block; height: auto; border: 0;"/></a></td>
                                                <td style="padding:0 5px 0 0px;"><a
                                                    href="https://www.instagram.com/cafelabpt/" target="_blank"><img
                                                    src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/instagram@2x.png"
                                                    width="32" height="auto" alt="Instagram" title="Instagram"
                                                    style="display: block; height: auto; border: 0;"/></a></td>
                                                <td style="padding:0 5px 0 0px;"><a
                                                    href="https://www.tiktok.com/@cafelabpt" target="_blank"><img
                                                    src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/tiktok@2x.png"
                                                    width="32" height="auto" alt="TikTok" title="TikTok"
                                                    style="display: block; height: auto; border: 0;"/></a></td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <table className="divider_block block-2" width="100%" border="0" cellPadding="0" cellSpacing="0"
                               role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                                <td className="pad"
                                    style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                    <div className="alignment" align="center">
                                        <table border="0" cellPadding="0" cellSpacing="0" role="presentation"
                                               width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tr>
                                                <td className="divider_inner"
                                                    style="font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;">
                                                    <span style="word-break: break-word;">&#8202;</span></td>
                                            </tr>
                                        </table>
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
</table>
<table className="row row-15" align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <tbody>
    <tr>
        <td>
            <table className="row-content stack" align="center" border="0" cellPadding="0" cellSpacing="0"
                   role="presentation"
                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;"
                   width="620">
                <tbody>
                <tr>
                    <td className="column column-1" width="100%"
                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table className="paragraph_block block-1" width="100%" border="0" cellPadding="0"
                               cellSpacing="0" role="presentation"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                                <td className="pad" style="padding-left:10px;padding-right:10px;">
                                    <div
                                        style="color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">&nbsp;</div>
                                </td>
                            </tr>
                        </table>
                        <table className="paragraph_block block-2" width="100%" border="0" cellPadding="0"
                               cellSpacing="0" role="presentation"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                                <td className="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                    <div
                                        style="color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                        <p style="margin: 0;">Av. Moçambique 14 A, 2780-027 Oeiras</p>
                                        <p style="margin: 0;">cafelabpt@gmail.com</p>
                                        <p style="margin: 0;">(+351) 214 420 636</p>
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
</table>
`;
const content = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

    <head>
    <title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"><!--<![endif]-->
            <style>
                * {
                box-sizing: border-box;
            }

                body {
                margin: 0;
                padding: 0;
            }

                a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
            }

                #MessageViewBody a {
                color: inherit;
                text-decoration: none;
            }

                p {
                line-height: inherit
            }

                .desktop_hide,
                .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
            }

                .image_block img+div {
                display: none;
            }

                sup,
                sub {
                line-height: 0;
                font-size: 75%;
            }

                @media (max-width:640px) {
                .social_block.desktop_hide .social-table {
                display: inline-block !important;
            }

                .image_block div.fullWidth {
                max-width: 100% !important;
            }

                .mobile_hide {
                display: none;
            }

                .row-content {
                width: 100% !important;
            }

                .stack .column {
                width: 100%;
                display: block;
            }

                .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }

                .desktop_hide,
                .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }
            }
            </style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
        </head>

        <body class="body" style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
            <tbody>
            <tr>
                <td>
                    <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #333; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-right: 10px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:15px;padding-top:15px;width:100%;padding-right:0px;padding-left:0px;">
                                                        <div class="alignment" align="center" style="line-height:10px">
                                                            <div class="fullWidth" style="max-width: 384px;"><img src="https://5ed75916ab.imgdist.com/pub/bfra/i5vq6pgr/vhb/u2z/a5a/cafelab.jpg" style="display: block; height: auto; border: 0; width: 100%;" width="384" alt="Image" title="Image" height="auto"></div>
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
                    </table>
                    <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                                        <div class="alignment" align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #222222;"><span style="word-break: break-word;">&#8202;</span></td>
                                                                </tr>
                                                            </table>
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
                    </table>
                    <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                        <div class="alignment" align="center" style="line-height:10px">
                                                            <div style="max-width: 248px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/18/okok.gif" style="display: block; height: auto; border: 0; width: 100%;" width="248" alt="Image" title="Image" height="auto"></div>
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
                    </table>
                    {{header}}
                    {{shipping_details}}
                    <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #333; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                        <div style="color:#FFFFFF;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                                            <p style="margin: 0; word-break: break-word;">PRODUTOS</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                        <div style="color:#FFFFFF;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                                            <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word;">PREÇO</span></p>
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
                    </table>
                    <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #333; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    {{products}}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #333; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                        <div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:right;mso-line-height-alt:16.8px;">
                                                            <p style="margin: 0; word-break: break-word;">Envio por ctt:</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                                        <div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                                            <p style="margin: 0; word-break: break-word;">{{shipping}}</p>
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
                    </table>
                    <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="divider_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad">
                                                        <div class="alignment" align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;"><span style="word-break: break-word;">&#8202;</span></td>
                                                                </tr>
                                                            </table>
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
                    </table>
                    <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #333; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;">
                                                        <div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                                            <p style="margin: 0; word-break: break-word;"><strong>TOTAL</strong><br></p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;">
                                                        <div style="color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                                            <p style="margin: 0; word-break: break-word;">{{total}}</p>
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
                    </table>
                    <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                        <div class="alignment" align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;"><span style="word-break: break-word;">&#8202;</span></td>
                                                                </tr>
                                                            </table>
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
                    </table>
                    <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad">
                                                        <h1 style="margin: 0; color: #7747FF; direction: ltr; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 34px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 40.8px;"><span class="tinyMce-placeholder" style="word-break: break-word;"><span style="word-break: break-word; color: #000000;">Compartilhe seu café nas redes sociais e nos marque</span>😄</span></h1>
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
                    </table>
                    <table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="social_block block-1" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad">
                                                        <div class="alignment" align="center">
                                                            <table class="social-table" width="111px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                                                <tr>
                                                                    <td style="padding:0 5px 0 0px;"><a href="https://www.facebook.com/cafelablisbon" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/facebook@2x.png" width="32" height="auto" alt="Facebook" title="Facebook" style="display: block; height: auto; border: 0;"></a></td>
                                                                    <td style="padding:0 5px 0 0px;"><a href="https://www.instagram.com/cafelabpt/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/instagram@2x.png" width="32" height="auto" alt="Instagram" title="Instagram" style="display: block; height: auto; border: 0;"></a></td>
                                                                    <td style="padding:0 5px 0 0px;"><a href="https://www.tiktok.com/@cafelabpt" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/tiktok@2x.png" width="32" height="auto" alt="TikTok" title="TikTok" style="display: block; height: auto; border: 0;"></a></td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table class="divider_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                                        <div class="alignment" align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;"><span style="word-break: break-word;">&#8202;</span></td>
                                                                </tr>
                                                            </table>
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
                    </table>
                    <table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-left:10px;padding-right:10px;">
                                                        <div style="color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">&nbsp;</div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                <tr>
                                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                                        <div style="color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
                                                            <p style="margin: 0;">Av. Moçambique 14 A, 2780-027 Oeiras</p>
                                                            <p style="margin: 0;">cafelabpt@gmail.com</p>
                                                            <p style="margin: 0;">(+351) 214 420 636</p>
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
                    </table>
                    <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                        <tr>
                            <td>
                                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 620px; margin: 0 auto;" width="620">
                                    <tbody>
                                    <tr>
                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                            <table class="empty_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                    <td class="pad">
                                                        <div></div>
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
                    </table>
                </td>
            </tr>
            </tbody>
        </table><!-- End -->
        </body>

    </html>`;

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

    // const content = await fs.readFile(process.cwd() + '/templates/email/order-new.html', 'utf8');

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
    const content = `<!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Change</title>
</head>
    <body>
    <div style="font-family: Arial, sans-serif; color: #333333;">
        {{header}}
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 20px;">
                    <table cellpadding="0" cellspacing="0" width="640px" style="border-collapse: collapse; background-color: #ffffff;">
                        <tr>
                            <td align="left" style="padding: 20px;">
                                <h1>Alteração da paalavra-passe</h1>
                                <p>We received a request to reset your password. Click the link below to change your password:</p>
                                <p><a href="{{resetLink}}" style="color: #1a73e8;">Reset Password</a></p>
                                <p>If you did not request a password change, please ignore this email or contact support if you have questions.</p>
                                <p>Thank you,<br>The CafeLab Team</p>
                            </td>
                        </tr>
                    </table>
            </tr>
        </table>
        {{footer}}
    </div>
    </body>
</html>`;

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

export async function activateEmailComm(email, name) {
    try {
        const { data, error } = await supabase
            .from('newsletter')
            .upsert(
                {
                    name: name,
                    email: email,
                    is_active: true
                },
                { onConflict: ['email'] } // specify the column(s) to check for conflicts
            )
            .select();

        if (error) throw error;

        return data[0];
    } catch (err) {
        console.error('Error activating email:', err);
        return null;
    }
}

export async function deactivateEmailComm(email, reason, comment) {
    console.log('Deactivation reason:', reason);
    console.log('Deactivation comment:', comment);

    try {
        const { data, error } = await supabase
            .from('newsletter')
            .update({ is_active: false })
            .eq('email', email)
            .select();

        if (error) throw error;

        return data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error('Error deactivating email:', err);
        return null;
    }
}