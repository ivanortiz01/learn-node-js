var request = require("request");

describe("Bicicleta API", () => {

    beforeAll(function(done) {
        require("../../bin/www");
        done();
    });

    describe("GET BICICLETAS /", () => {
        it("Status 200", () => {
            request.get("http://localhost:3000/api/bicicletas", function (error, response, body) {
                expect(response.statusCode).toBe(200);
            });
        });
    });
});