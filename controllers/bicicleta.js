const Bicicleta = require("../models/bicicleta");
var Biblioteca = require("../models/bicicleta");

exports.bicicleta_list = function(req, res) {
    res.render("bicicletas/index", {bicis: Bicicleta.allBicis});
}