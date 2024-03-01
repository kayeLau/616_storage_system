const { getCurrentTime } = require('../utils')
const { getProductItems, createNewProduct, updateProductInformation, deleteProductItem } = require('../models/productManage_model')
const { getBandProducts } = require('../models/shopManage_model')
const { verifyToken } = require('../models/verification')

module.exports = class product {
    async getProductList(req, res, next) {
        const token = req.headers['token'];
        let options = { freezersNum: req.body.freezersNum, disable: req.body.disable, productName: req.body.productName , summary:req.body.summary}
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
                    .then(res => res.resource.map(item => item.productCode))
                options.department = auth
                options.disable = 0
            }

            await getProductItems(options, size, page).then(result => {
                if (auth !== -1) {
                    result.resource = result.resource.filter(item => {
                        let isBand = bandList.indexOf(item.productCode) // 禁售商品
                        return isBand === -1 ? true : false
                    })
                }
                res.json(result)
            })
        } catch (err) {
            next(err)
        }

    }

    postCreateProduct(req, res, next) {
        const productData = {
            productCode: req.body.productCode,
            productName: req.body.productName,
            classify:req.body.classify,
            freezersNum: req.body.freezersNum,
            department: req.body.department,
            standard: req.body.standard,
            unit: req.body.unit,
            disable: req.body.disable,
            summary:req.body.summary,
            prompt:0,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime()
        }

        createNewProduct(productData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    postUpdateProduct(req, res, next) {
        const productId = req.body.productId
        const productData = {
            classify:req.body.classify,
            productName: req.body.productName,
            freezersNum: req.body.freezersNum,
            department: req.body.department,
            standard: req.body.standard,
            unit: req.body.unit,
            disable: req.body.disable,
            summary:req.body.summary,
            prompt:req.body.prompt,
            updateDate: getCurrentTime()
        }

        updateProductInformation(productId, productData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    postDeleteProduct(req, res, next) {
        const productId = req.body.productId

        deleteProductItem(productId).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}