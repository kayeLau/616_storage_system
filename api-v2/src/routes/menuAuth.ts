var express = require('express');
var router = express.Router();

const MenuAuthModifyMethod = require('../controllers/menuAuth_controller')

const menuAuthModifyMethod = new MenuAuthModifyMethod()

router.post('/readMenuAuth', menuAuthModifyMethod.readMenuAuth)

module.exports = router;
