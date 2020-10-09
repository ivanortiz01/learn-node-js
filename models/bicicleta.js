var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletasSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true}
    }
});

bicicletasSchema.statics.createInstance = function(code, color, modelo, ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
}

bicicletasSchema.method.toString = function() {
    return `id: ${this.id} | color: ${this.color}`;
};

bicicletasSchema.statics.allBicis = function(cb) {
    return this.find({}, cb);
}

bicicletasSchema.statics.add = function(aBici, cb) {
    this.create(aBici, cb);
}

bicicletasSchema.statics.findByCode = function(aCode, cb) {
    return this.findOne({code: aCode}, cb);
}

bicicletasSchema.statics.removeByCode = function(aCode, cb) {
    return this.deleteOne({code: aCode}, cb);
}

module.exports = mongoose.model('Bicicleta', bicicletasSchema);

// var Bicicleta = function (id, color, modelo, ubicacion) {
//     this.id = id;
//     this.color = color;
//     this.modelo = modelo;
//     this.ubicacion = ubicacion;
// }

// Bicicleta.prototype.toString = function() {
//     return `id: ${this.id} | color: ${this.color}`;
// }

// Bicicleta.allBicis = [];
// Bicicleta.add = function(aBici) {
//     Bicicleta.allBicis.push(aBici);
// };

// Bicicleta.findById = function(aBiciID) {
//     var aBici = Bicicleta.allBicis.find(x => x.id == aBiciID);
//     if (aBici) {
//         return aBici;
//     } else {
//         throw new Error(`No existe una bicicleta con ID ${aBiciID}`);
//     }
// }

// Bicicleta.add(new Bicicleta(1, 'rojo', 'urbana', [3.395065, -76.527833]));
// Bicicleta.add(new Bicicleta(2, 'blanca', 'urbana', [3.385958, -76.524502]));

// module.exports = Bicicleta