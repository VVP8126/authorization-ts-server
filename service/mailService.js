const nodemailer = require("nodemailer");

class MailService {
    
    constructor() {
        // Attention: Mail.ru doesn't work at the moment of this project creation !!!
        // It's necessary to rework project for gamil.com - have no wish !
        this.transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",                  // "smtp.gmail.com",
            port: 465,                             // 587,
            secure: true,                          // false,
            auth: {
                user: process.env.SMTP_MAIL,       // "vpav0782@gmail.com",
                pass: process.env.SMTP_PASS,       // "p_18_Lov_62_hCi!_30",
            },
            tls: {
                rejectUnauthorized: false, // do not fail on invalid certs
            },
        });
    }

    async sendActivationMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_MAIL,
                to,
                subject: "Account activation",
                text: "",
                html:
                `<div><h1>Pass link for activation</h1><a href="${link}">Activate account</a></div>`
            });
        } catch (error) {
            console.log("Error in sendActivationMail(...) while send data from smtp server");
            console.log(error);
        }
    }
}
module.exports = new MailService();
