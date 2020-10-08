var Bicicleta = function (id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function() {
    return `id: ${this.id} | color: ${this.color}`;
}

Bicicleta.allBicis = [];
Bicicleta.add = function(aBici) {
    Bicicleta.allBicis.push(aBici);
};

Bicicleta.findById = function(aBiciID) {
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciID);
    if (aBici) {
        return aBici;
    } else {
        throw new Error(`No existe una bicicleta con ID ${aBiciID}`);
    }
}

Bicicleta.add(new Bicicleta(1, 'rojo', 'urbana', [3.395065, -76.527833]));
Bicicleta.add(new Bicicleta(2, 'blanca', 'urbana', [3.385958, -76.524502]));

module.exports = Bicicleta