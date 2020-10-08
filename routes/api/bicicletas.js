var express = require("express");
var router = express.Router();
var control = require("../../controllers/api/bicicletasControlller");

router.get("/", control.bicicleta_list);

module.exports = router;