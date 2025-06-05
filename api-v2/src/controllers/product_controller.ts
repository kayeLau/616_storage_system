import { readProduct, readBandProduct, createProduct, updateProduct, deleteProduct } from '../models/productManage_model';

module.exports = class product {
    async readProduct(req, res, next) {
        const userInfo = req.userInfo
        let options = { 
            freezersNum: req.body.freezersNum, 
            disable: req.body.disable,
            productName: req.body.productName, 
            summary: req.body.summary, 
            classify: req.body.classify,
        }
        const size = req.body.size || 999
        const page = req.body.page || 1
        let bandList = []
        try {
            const auth = userInfo.auth
            if (!(auth === -1 || auth === 2)) {
                bandList = await readBandProduct({ shopId: userInfo.shopId })
                options.disable = 0 // 只查可用的产品
            }else{
                options.disable = options.disable ? options.disable : [1,0] // 只查可用及禁用的产品
            }

            await readProduct(options, size, page).then(result => {
                if (!(auth === -1 || auth === 2)) {
                    result.data = result.data.filter(item => {
                        const isBand = bandList.indexOf(item.productId) // 禁售商品
                        return isBand === -1 ? true : false
                    })
                }
                res.json(result)
            })
        } catch (err) {
            next(err)
        }

    }

    createProduct(req, res, next) {
        const productData = {
            productCode: req.body.productCode,
            productName: req.body.productName,
            classify: req.body.classify,
            freezersNum: req.body.freezersNum,
            department: req.body.department,
            standard: req.body.standard,
            unit: req.body.unit,
            disable: req.body.disable,
            summary: req.body.summary,
            prompt: 0,
        }

        createProduct(productData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    updateProduct(req, res, next) {
        const productId = req.body.productId
        const productData = {
            classify: req.body.classify,
            productName: req.body.productName,
            freezersNum: req.body.freezersNum,
            department: req.body.department,
            standard: req.body.standard,
            unit: req.body.unit,
            disable: req.body.disable,
            summary: req.body.summary,
            prompt: req.body.prompt,
        }

        updateProduct(productId, productData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    deleteProduct(req, res, next) {
        const productId = req.body.productId

        deleteProduct(productId).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}