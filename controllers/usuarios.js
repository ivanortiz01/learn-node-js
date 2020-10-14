var Usuario = require("../models/usuario");
var Token = require("../models/token");

module.exports = {
    list: function(req, res, next) {
        Usuario.find({}, (err, usuarios) => {
            res.render("usuarios/index", {usuarios: usuarios});
        });
    },
    update_get: function(req, res, next) {
        Usuario.findById(req.params.id, function(err, usuario) {
            res.render("usuarios/update", { errors: {}, usuario: usuario});
        })
    },
    update: function(req, res, next) {
        var update_values = { nombre: req.body.nombre };
        Usuario.findByIdAndUpdate(req.params.id, update_values, function(err, usuario) {
            if(err) {
                console.log(err);
                res.render("usuarios/update", {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            } else {
                res.redirect("/usuarios");
            }
        });
    },
    create_get: function(req, res, next) {
        res.render("usuarios/create", {errors:{}, usuario: new Usuario() });
    },
    create: function(req, res, next) {
        var newUSer = {nombre: req.body.nombre, email: req.body.email, password: req.body.password};

        if(req.body.password != req.body.confirm_password) {
            res.render("usuarios/create", {
                errors: {
                    confirm_password: {
                        message: 'No coinciden las contraseñas'
                    }
                },
                usuario: new Usuario(newUSer)            
            });
            return;
        }
        
        Usuario.create(newUSer, function(err, nuevoUsuario) {
            if(err) {
                console.log(err);
                res.render("usuarios/create", {errors: err.errors, usuario: new Usuario(newUSer)});
            } else {
                nuevoUsuario.enviarMensajeBienvenida();
                res.redirect("/usuarios");
            }
        });
    },
    delete: function(req, res, next) {
        Token.findOneAndDelete({_userID: req.body.id}, function(err) {
            Usuario.findByIdAndDelete(req.body.id, function(err) {
                if(err) {
                    next(err);
                } else {
                    res.redirect("/usuarios");
                }
            });
        });        
    }

}