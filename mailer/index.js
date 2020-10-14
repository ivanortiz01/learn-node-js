// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

var mailer = {}

// Generate SMTP service account from ethereal.email
mailer.sendMail = async function (emailData) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'tyrique.dickens@ethereal.email', // generated ethereal user
            pass: 'ETSazCbH9MZd4BUWUW', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'noreply@example.com', // sender address
        to: emailData.email, // list of receivers
        subject: emailData.subject ? emailData.subject : "Hello World", // Subject line
        html: emailData.body ? emailData.body :"<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = mailer;