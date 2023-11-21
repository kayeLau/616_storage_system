const { getCurrentTime, checkNull } = require('../utils')
const { getShopItems , createNewShop , updateShopInformation , deleteShopItem , bindProductTOShop , getBandProducts} = require('../models/shopManage_model')
const { generateUUID } = require('../models/encryption');
const { verifyToken } = require('../models/verification')
// const config = require('../config/development_config')
// const jwt = require('jsonwebtoken')

module.exports = class Shop {

    getShopList(req, res, next){
        const token = req.headers['token'];
        const options = req.body.shopType ? { shopType: req.body.shopType } : {}
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                getShopItems(options,size,page).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postCreateShop(req, res, next) {
        const token = req.headers['token'];
        const shopData = {
            shopId:generateUUID(),
            shopCode: req.body.shopCode,
            shopType: req.body.shopType,
            shopName: req.body.shopName,
            createDate:getCurrentTime(),
            updateDate:getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                createNewShop(shopData).then(result => {
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

    postUpdateShop(req, res, next){
        const token = req.headers['token'];
        const shopId = req.body.shopId
        const shopData = {
            shopType: req.body.shopType,
            shopCode: req.body.shopCode,
            shopName: req.body.shopName,
            updateDate:getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                updateShopInformation(shopId,shopData).then(result => {
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

    postDeleteShop(req, res, next){
        const token = req.headers['token'];
        const shopId = req.body.shopId

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                deleteShopItem(shopId).then(result => {
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

    getBindProductList(req, res, next){
        const token = req.headers['token'];
        const options = req.body.shopId ? { shopId: req.body.shopId } : {}
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                getBandProducts(options,size,page).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postBindProductToShop(req, res, next){
        const token = req.headers['token'];

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                let productList = req.body.productList
                productList = productList.map(item => {
                    return [
                        item.shopId + '-' + item.productCode,
                        item.shopId,
                        item.productCode,
                        getCurrentTime(),
                        getCurrentTime()
                    ]
                })
                bindProductTOShop(productList).then(result => {
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