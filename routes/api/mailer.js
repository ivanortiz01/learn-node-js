var express = require("express");
var router = express.Router();
var control = require("../../controllers/api/mailerController");

router.get("/:email", control.send_mail);

module.exports = router;