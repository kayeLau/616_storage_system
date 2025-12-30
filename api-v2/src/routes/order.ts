var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order_controller')

const orderModifyMethod = new OrderModifyMethod()

router.post('/readOrder',(req, res, next) => orderModifyMethod.readOrder(req, res, next))

router.post('/readOrderDetail',orderModifyMethod.readOrderDetail)

router.post('/readOrderDatailSummary',orderModifyMethod.readOrderDatailSummary)

router.post('/createOrder',orderModifyMethod.createOrder)

// router.post('/deleteOrder',orderModifyMethod.deleteOrder)

router.post('/createAdditionOrder',orderModifyMethod.createAdditionOrder)

router.post('/updateAssignQuantity',orderModifyMethod.updateAssignQuantity)

router.post('/checkOrderRepeated',orderModifyMethod.checkOrderRepeated)

router.post('/exportDailyMeetSummary',orderModifyMethod.exportDailyMeetSummary)

// router.post('/readDailyOrderStatus',orderModifyMethod.readDailyOrderStatus)

router.post('/readHistoryOrder',orderModifyMethod.readHistoryOrder)


module.exports = router;
