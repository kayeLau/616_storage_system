const { getCurrentTime } = require('../utils')
const { getShopItems, createNewShop, updateShopInformation, deleteShopItem, bindProductTOShop, getBandProducts , getPartitionItems} = require('../models/shopManage_model')
const { generateUUID } = require('../models/encryption');

module.exports = class Shop {

    getShopList(req, res, next) {
        const options = { shopType: req.body.shopType }
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        getShopItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    getPartitionList(req, res, next){
        getPartitionItems({}, 999, 1).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    postCreateShop(req, res, next) {
        const shopData = {
            shopId: generateUUID(),
            shopCode: req.body.shopCode,
            shopType: req.body.shopType,
            shopName: req.body.shopName,
            partition:req.body.partition,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime()
        }

        createNewShop(shopData).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }


    postUpdateShop(req, res, next) {
        const shopId = req.body.shopId
        const shopData = {
            shopType: req.body.shopType,
            shopCode: req.body.shopCode,
            shopName: req.body.shopName,
            partition:req.body.partition,
            updateDate: getCurrentTime()
        }

        updateShopInformation(shopId, shopData).then(result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    postDeleteShop(req, res, next) {
        const shopId = req.body.shopId

        deleteShopItem(shopId).then(result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.json(err)
        })

    }

    getBindProductList(req, res, next) {
        const options = req.body.shopId ? { shopId: req.body.shopId } : {}
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        getBandProducts(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })

    }

    postBindProductToShop(req, res, next) {
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

    }
}