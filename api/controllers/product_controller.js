const loginCheck = require('../models/login')
var { getCurrentTime } = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getProductItems , createNewProduct , updateProductInformation , deleteProductItem } = require('../models/productManage_model')
const { verifyToken } = require('../models/verification')
const config = require('../config/development_config')
const jwt = require('jsonwebtoken')

module.exports = class product {
    getProductList(req, res, next){
        const token = req.headers['token'];
        const options = req.body.productType ? { shopType: req.body.productType } : {}
        const size = req.body.size
        const page = req.body.page

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                getProductItems(options,size,page).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postCreateProduct(req, res, next) {
        const token = req.headers['token'];
        const productData = {
            productId:generateUUID(),
            productType: req.body.productType,
            productName: req.body.productName,
            createDate:getCurrentTime(),
            updateDate:getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                createNewProduct(productData).then(result => {
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

    postUpdateProduct(req, res, next){
        const token = req.headers['token'];
        const productId = req.body.productId
        const productData = {
            productType: req.body.productType,
            productName: req.body.productName,
            updateDate:getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                updateProductInformation(productId,productData).then(result => {
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

    postDeleteProduct(req, res, next){
        const token = req.headers['token'];
        const productId = req.body.productId

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                deleteProductItem(productId).then(result => {
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