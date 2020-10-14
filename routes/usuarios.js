var express = require('express');
var router = express.Router();
var control = require("../controllers/usuarios")

router.get('/', control.list);
router.get('/create', control.create_get);
router.post('/create', control.create);
router.get('/:id/update', control.update_get);
router.post('/:id/update', control.update);
router.post('/:id/delete', control.delete);

module.exports = router;