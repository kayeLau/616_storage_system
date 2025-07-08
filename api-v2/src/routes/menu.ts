var express = require('express');
var router = express.Router();

const MenuModifyMethod = require('../controllers/menu_controller')

const menuModifyMethod = new MenuModifyMethod()

router.post('/readMenu',menuModifyMethod.readMenu)

router.post('/createMenu',menuModifyMethod.createMenu)

router.post('/updateMenu',menuModifyMethod.updateMenu)

router.post('/deleteMenu',menuModifyMethod.deleteMenu)

module.exports = router;
