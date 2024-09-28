var express = require('express');
var router = express.Router();

const ShopModifyMethod = require('../controllers/shop_controller')

const shopModifyMethod = new ShopModifyMethod()

router.post('/readShop',shopModifyMethod.readShop)

router.post('/readPartition',shopModifyMethod.readPartition)

router.post('/createShop',shopModifyMethod.createShop)

router.post('/createPartition',shopModifyMethod.createPartition) // 創建分區

router.post('/updateShop',shopModifyMethod.updateShop)

router.post('/deletePartition',shopModifyMethod.deletePartition)

router.post('/deleteShop',shopModifyMethod.deleteShop)

router.post('/readBindProduct',shopModifyMethod.readBindProduct) // 分店可售商品列表

router.post('/bindProductToShop',shopModifyMethod.bindProductToShop) // 綁定分店可售商品

router.post('/setShopOrder',shopModifyMethod.setShopOrder)


module.exports = router;
