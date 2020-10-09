var Bicicleta = require("../../models/bicicleta");

exports.bicicleta_list = function(req, res) {
    Bicicleta.allBicis(function(err, bicis) {
        console.log(bicis);
        res.status(200).json({
            bicicletas: bicis
        });
    });    
}