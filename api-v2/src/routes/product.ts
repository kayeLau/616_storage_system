var express = require('express');
var router = express.Router();

const ProductModifyMethod = require('../controllers/product_controller')

const productModifyMethod = new ProductModifyMethod()

router.post('/readProduct',productModifyMethod.readProduct)

router.post('/createProduct',productModifyMethod.createProduct)

router.post('/updateProduct',productModifyMethod.updateProduct)

// router.post('/deleteProduct',productModifyMethod.deleteProduct)


module.exports = router;
