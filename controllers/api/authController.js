const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { restart } = require("nodemon");
const Usuario = require("../../models/usuario");

module.exports = {
    authenticate: function (req, res, next) {
        Usuario.findOne({ email: req.body.email }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (userInfo === null) {
                    return restart.status(401).json({ status: "error", message: "usuario invalido", data: null });
                }

                if (userInfo != null && userInfo.validPassword(req.body.password)) {
                    userInfo.save(function (err, user) {
                        const token = jwt.sign({ id: user.__id }, req.app.get('secretKey'), { expiresIn: '8d' });
                        res.status(200).json({ message: 'usuario encontrado', data: { usuario: user, token: token } });
                    });
                } else {
                    return res.status(401).json({ status: "error", message: "usuario invalido", data: null });
                }
            }
        })
    },
    forgotPassword: function (req, res, next) {
        Usuario.findOne({ email: req.body.email }, function (err, usuario) {
            if (!usuario) {
                return res.status(401).json({ message: "usuario invalido", data: null });
            }

            usuario.resetPassword(function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json({ message: "Se envio correo electronico para restablecer la contraseña", data: null });
            });
        });
    },
    authFacebookToken: function(req, res, next){
        if (req.user){
            req.user.save().then( () => {
                const token = jwt.sign({id: req.user.id}, req.app.get('secretKey'), {expiresIn: '7d'});
                res.status(200).json({message: "Usuario encontrado o creado", data: {user: req.user, token: token}});
            }).catch( (err) =>{
                console.log(err);
                res.status(500).json({message: err.message});
            });
        } else {
            res.status(401);
        }
    }
}