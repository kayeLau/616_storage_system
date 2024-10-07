var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order_controller')

const orderModifyMethod = new OrderModifyMethod()

router.post('/readOrder',orderModifyMethod.readOrder)

router.post('/readOrderDetail',orderModifyMethod.readOrderDetail)

router.post('/createOrder',orderModifyMethod.createOrder)

// router.post('/deleteOrder',orderModifyMethod.deleteOrder)

// router.post('/createAdditionOrder',orderModifyMethod.createAdditionOrder)

// router.post('/updateOrderDetailAssignQuantity',orderModifyMethod.updateOrderDetailAssignQuantity)

// router.post('/checkOrderRepeated',orderModifyMethod.CheckOrderRepeated)

// router.post('/exportDailyMeetSummary',orderModifyMethod.ExportDailyMeetSummary)

// router.post('/getDailyOrderStatus',orderModifyMethod.getDailyOrderStatus)

// router.post('/readHistoryOrder',orderModifyMethod.readHistoryOrder)


module.exports = router;
