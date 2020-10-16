var express = require('express');
var router = express.Router();
var control = require("../controllers/token")

router.get('/confirmation/:token', control.confirmationGet);

module.exports = router;