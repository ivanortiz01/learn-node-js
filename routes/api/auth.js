var express = require("express");
var router = express.Router();
const passport = require('../../config/passport');
var control = require("../../controllers/api/authController");

router.get("/authenticate", control.authenticate);
router.get("/forgotPassword", control.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), control.authFacebookToken);

module.exports = router;