var mongoose = require("mongoose");
var Bicicleta = require("../../models/bicicleta");


describe("Testing Bicicletas", function() {

    beforeAll(function(done) {
        var mongoDb = 'mongodb+srv://usuario1:ZgCRi9bztAWExZ4@cluster0.yjasg.azure.mongodb.net/test'
        mongoose.connect(mongoDb, {useNewUrlParser: true, socketTimeoutMS: 0, keepAlive: true, reconnectTries: 30});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function() {
            console.log("We are connected to test database");
            done();
          });
    });

    afterEach(function(done) {        
        Bicicleta.deleteMany({}, function(error, success) {
            if(error) console.error("Error al finalizar" + error);            
            done();
        });
    });

    describe("Bicicleta.createInstance", () => {
        it("crea una instancia de bicicleta", (done) => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
            done();
        });
    });

    describe("Bicicleta.allBicis", () => {
        it("comienza vacia", (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe("Bicicleta.add", () => {
        it("agrega solo una bici", (done) => {
            var a = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(a, function(err, newBici) {
                if(err) console.log(err);
                Bicicleta.findOne({code: 1}, function(err, bici) {
                    expect(bici.code).toEqual(a.code);
                    done();
                })
            })
        });
    });

    describe("Bicicleta.findByCode", () => {
        it("debe devolver la bici con code 1", (done) => {
            Bicicleta.allBicis(function(err, bicis) {
                expect(bicis.length).toBe(0);

                var aBici1  = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici1, function(err, newBici) {
                    if(err) console.log(err);

                    var aBici2  = new Bicicleta({code: 2, color: "roja", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if(err) console.log(err);

                        Bicicleta.findByCode(1, function(err, targetBici) {
                            expect(targetBici.code).toBe(aBici1.code);
                            expect(targetBici.color).toBe(aBici1.color);
                            expect(targetBici.modelo).toBe(aBici1.modelo);
                            done();
                        });
                    });
                })
            })
        })
    });
});

// beforeEach(() => { Bicicleta.allBicis= [] });

// describe("Bicicleta.allBicis", () => {
//     it("Comienza vacia", () => {
//         expect(Bicicleta.allBicis.length).toBe(0);
//     })
// });

// describe("Bicicleta.add", () => {
//     it("agregamos una", () => {
//         expect(Bicicleta.allBicis.length).toBe(0);

//         var a = new Bicicleta(1, 'negra', 'Urbana', [3.385958, -76.524502]);
//         Bicicleta.add(a);

//         expect(Bicicleta.allBicis.length).toBe(1);
//         expect(Bicicleta.allBicis[0]).toBe(a);
//     })
// });

// describe("Bicicleta.findById", () => {
//     it("debe volver bicicleta con id 1", () => {
//         expect(Bicicleta.allBicis.length).toBe(0);

//         var a = new Bicicleta(1, 'negra', 'Urbana', [3.385958, -76.524502]);
//         var b = new Bicicleta(2, 'roja', 'Montaña', [3.385958, -76.524502]);
//         Bicicleta.add(a);
//         Bicicleta.add(b);

//         var targetBici = Bicicleta.findById(1);
//         expect(targetBici.id).toBe(1);
//         expect(targetBici.color).toBe(a.color);
//     })
// });