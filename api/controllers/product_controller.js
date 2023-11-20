const { getCurrentTime } = require('../utils')
// const { generateUUID } = require('../models/encryption');
const { getProductItems, createNewProduct, updateProductInformation, deleteProductItem } = require('../models/productManage_model')
const { getBandProducts } = require('../models/shopManage_model')
const { verifyToken } = require('../models/verification')

module.exports = class product {
    async getProductList(req, res, next) {
        const token = req.headers['token'];
        let options = { freezersNum: req.body.freezersNum, disable: req.body.disable , productName: req.body.productName }
        const size = req.body.size
        const page = req.body.page
        let bandList = []
        try {
            const tokenResult = await verifyToken(token, true)

            if (tokenResult.success === false) {
                res.json(tokenResult)
                return
            }

            const auth = tokenResult.userInfo.auth
            if (auth !== -1) {
                bandList = await getBandProducts({ shopId: tokenResult.userInfo.shopId }, 999, 1)
                .then( res=> res.resource.map(item => item.productCode) )
                options.department = auth
                options.disable = 0
            }

            await getProductItems(options, size, page).then(result => {
                if (auth !== -1) {
                    result.resource = result.resource.filter(item => {
                        let isBand = bandList.indexOf(item.productCode) // 禁售商品
                        return isBand === -1  ? true : false
                    })
                }
                res.json(result)
            })
        } catch (err) {
            console.log(err)
            res.json(err)
        }

    }

    postCreateProduct(req, res, next) {
        const token = req.headers['token'];
        const productData = {
            productCode: req.body.productCode,
            productName: req.body.productName,
            freezersNum: req.body.freezersNum,
            department: req.body.department,
            standard: req.body.standard,
            unit: req.body.unit,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                createNewProduct(productData).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postUpdateProduct(req, res, next) {
        const token = req.headers['token'];
        const productCode = req.body.productCode
        const productData = {
            productName: req.body.productName,
            freezersNum: req.body.freezersNum,
            department: req.body.department,
            standard: req.body.standard,
            unit: req.body.unit,
            disable: req.body.disable,
            updateDate: getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                updateProductInformation(productCode, productData).then(result => {
                    console.log(result)
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postDeleteProduct(req, res, next) {
        const token = req.headers['token'];
        const productCode = req.body.productCode

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                deleteProductItem(productCode).then(result => {
                    console.log(result)
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }
}