"use strict";

const { google } = require('googleapis');
const nodemailer = require("nodemailer");
const { nodeMailer: { USER_MAILER, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } } = require('../configs/config');
const { logger } = require('../configs/config.logger');


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (toMailer) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: USER_MAILER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Tuna kite 👻 😱" 2014leesin@gmail.com', // sender address
            to: toMailer, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Chúc mừng bạn đã đăng kí tài khoản thành công", // plain text body
            html: "<b>Chúc mừng bạn đã đăng kí tài khoản thành công</b>", // html body
        });

        console.log(info);
    } catch (error) {
        logger.error("Error to send mail::", error);
    }
};

module.exports = sendMail;