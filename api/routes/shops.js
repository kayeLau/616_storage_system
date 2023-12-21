var express = require('express');
var router = express.Router();

const ShopModifyMethod = require('../controllers/shop_controller')

const shopModifyMethod = new ShopModifyMethod()

router.post('/getShopList',shopModifyMethod.getShopList)

router.post('/getPartitionList',shopModifyMethod.getPartitionList)

router.post('/createShop',shopModifyMethod.postCreateShop)

router.post('/updateShop',shopModifyMethod.postUpdateShop)

router.post('/deleteShop',shopModifyMethod.postDeleteShop)

router.post('/getBindProductList',shopModifyMethod.getBindProductList)

router.post('/bindProductToShop',shopModifyMethod.postBindProductToShop)


module.exports = router;
