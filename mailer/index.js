// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');
const sgTransport = require("nodemailer-sendgrid-transport");

// Generate SMTP service account from ethereal.email
module.exports = {
    sendMail = async function (emailData) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        //let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let mailConfig;
        if(process.env.NODE_ENV === 'production'){
            const options = {
                auth: {
                    api_key: process.env.SENDGRID_API_SECRET
                }
            }
            mailConfig = sgTransport(options);
        } else {
            mailConfig = {
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.ETHEREAL_USER, // generated ethereal user
                    pass: process.env.ETHEREAL_PWD, // generated ethereal password
                },
            };
        }        

        let transporter = nodemailer.createTransport(mailConfig);

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'noreply@example.com', // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject ? emailData.subject : "Hello World", // Subject line
            html: emailData.body ? emailData.body : "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}