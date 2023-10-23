var express = require('express');
var router = express.Router();

const ProductModifyMethod = require('../controllers/product_controller')

const productModifyMethod = new ProductModifyMethod()

router.post('/getProductList',productModifyMethod.getProductList)

router.post('/createProduct',productModifyMethod.postCreateProduct)

router.post('/updateProduct',productModifyMethod.postUpdateProduct)

router.post('/deleteProduct',productModifyMethod.postDeleteProduct)


module.exports = router;
