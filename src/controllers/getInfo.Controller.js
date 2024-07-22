const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = require('../global/_var');
const path = require('path');
const { verifyEmail } = require('../models/poliza');

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(toEmail, docPath) {
    try {
        const accessTokenInfo = await oauth2Client.getAccessToken();
        const accessToken = accessTokenInfo.token;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'polizaqui.contact@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOption = {
            from: 'PolizaSupport <polizaqui.contact@gmail.com>',
            to: toEmail,
            subject: 'Poliza Emitida',
            html: `
              <img src="cid:logo" width="250" height="100">
              <p>Hola ${toEmail},</p>
              <p>Gracias por confiar en PolizaQui y adquirir nuestra póliza de Responsabilidad Civil Vehicular (RCV). Valoramos enormemente tu confianza en nosotros. Adjunto encontrarás tu documento de RCV. Para cualquier consulta adicional, no dudes en contactarnos.</p>
              <p>Atentamente:</p>
              <p>polizaqui.contact@gmail.com</p>
              <p>Telefono: (+58) 4147232513</p>
            `,
            attachments: [
                {
                    filename: 'logotipo.jpeg',
                    path: path.join(__dirname, '../assets/logotipo.jpeg'),
                    cid: 'logo'
                },
                {
                    filename: 'APIOCC01.pdf',
                    path: docPath
                }
            ]
        };

        const result = await transport.sendMail(mailOption);
        console.log(`Email sent successfully to ${toEmail}`);
        return result;

    } catch (err) {
        console.error('Error in sendMail function:', err);
        return err;
    }
}

const controller = {};

controller.PolizaDoc = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body);
        const user = await verifyEmail({ email });
        console.log(user);
        if (!user.status) {
            res.status(user.code).json({ error: user.message });
        } else {
            const docPath = path.join(__dirname, '../assets/APIOCC01.pdf');
            const mailResult = await sendMail(email, docPath);

            if (mailResult instanceof Error) {
                res.status(500).json({ error: 'Error al enviar el correo electrónico' });
            } else {
                res.status(user.code).json(user);
            }
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Error en el Servidor' });
    }
}

module.exports = controller;
