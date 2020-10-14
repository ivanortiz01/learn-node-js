var mailer = require("../../mailer");

exports.send_mail = function(req, res) {
    mailer.sendMail({email: req.params.email});
    res.status(200).json({
        message: 'Mensaje enviado correctamente'
    });
}