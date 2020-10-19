var express = require("express");
var router = express.Router();
var control = require("../../controllers/api/authController");

router.get("/authenticate", control.authenticate);
router.get("/forgotPassword", control.forgotPassword);

module.exports = router;