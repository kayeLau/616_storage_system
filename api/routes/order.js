var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order_controller')

const orderModifyMethod = new OrderModifyMethod()

router.post('/getOrderList',orderModifyMethod.getOrderList)

router.post('/createOrder',orderModifyMethod.postCreateOrder)

router.post('/updateOrder',orderModifyMethod.postUpdateOrder)

router.post('/deleteOrder',orderModifyMethod.postDeleteOrder)

router.post('/createAdditionOrderItem',orderModifyMethod.postAdditionOrder)


module.exports = router;
