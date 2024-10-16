var express = require('express');
var router = express.Router();

const InventoryModifyMethod = require('../controllers/inventory_controller')

const inventoryModifyMethod = new InventoryModifyMethod()

router.post('/readInventory',inventoryModifyMethod.readInventory)

router.post('/createInventory',inventoryModifyMethod.createInventory)

router.post('/updateInventory',inventoryModifyMethod.updateInventory)

module.exports = router;