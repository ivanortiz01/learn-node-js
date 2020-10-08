var express = require('express');
var router = express.Router();
var control = require("../controllers/bicicleta")

router.get('/', control.bicicleta_list);

module.exports = router;