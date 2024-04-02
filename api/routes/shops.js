var express = require('express');
var router = express.Router();

const ShopModifyMethod = require('../controllers/shop_controller')

const shopModifyMethod = new ShopModifyMethod()

router.post('/getShopList',shopModifyMethod.getShopList)

router.post('/getPartitionList',shopModifyMethod.getPartitionList)

router.post('/createShop',shopModifyMethod.postCreateShop)

router.post('/createPartition',shopModifyMethod.postCreatePartition)

router.post('/deletePartitionItem',shopModifyMethod.postDeletePartitionItem)

router.post('/updateShop',shopModifyMethod.postUpdateShop)

router.post('/deleteShop',shopModifyMethod.postDeleteShopItem)

router.post('/getBindProductList',shopModifyMethod.getBindProductList)

router.post('/bindProductToShop',shopModifyMethod.postBindProductToShop)

router.post('/postSetShopOrder',shopModifyMethod.postSetShopOrder)


module.exports = router;
