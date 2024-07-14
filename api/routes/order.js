var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order_controller')

const orderModifyMethod = new OrderModifyMethod()

router.post('/getOrderList',orderModifyMethod.getOrderList)

router.post('/getOrderDetail',orderModifyMethod.getOrderDetail)

router.post('/createOrder',orderModifyMethod.postCreateOrder)

router.post('/deleteOrder',orderModifyMethod.postDeleteOrder)

router.post('/createAdditionOrderItem',orderModifyMethod.postAdditionOrder)

router.post('/updateOrderDetailAssignQuantity',orderModifyMethod.postupdateOrderDetailAssignQuantity)

router.post('/checkOrderRepeated',orderModifyMethod.postCheckOrderRepeated)

router.post('/exportDailyMeetSummary',orderModifyMethod.postExportDailyMeetSummary)

router.post('/getDailyOrderStatus',orderModifyMethod.getDailyOrderStatus)

router.post('/postHistoryOrder',orderModifyMethod.postHistoryOrder)


module.exports = router;
