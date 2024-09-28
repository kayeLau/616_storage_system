const { getCurrentTime } = require('../utils')
const { readShop, readPartition, createShop, createPartition, updateShop, deleteShop, deletePartition ,
    bindProductTOShop, readBindProduct, deleteShopProductItem, setShopOrder } = require('../models/shopManage_model')
const { generateUUID } = require('../models/encryption');

module.exports = class Shop {

    // 獲取分店列表
    async readShop(req, res, next) {
        const options = { shopType: req.body.shopType }
        const size = parseInt(req.body.size) || 999
        const page = parseInt(req.body.page) || 1
        const partitionDict = {}
        await readPartition().then(result => {
            result.data.forEach(item => {
                partitionDict[item.id] = item.partitionName
            })
        })
        await readShop(options, size, page).then(result => {
            result.data.forEach(item => {
                item.shopPartition = item.shopPartition.split(',').map(item => Number(item))
                item.shopPartitionName = item.shopPartition.map(item => partitionDict[item])
            })
            res.json(result)
        })
    }

    // 獲取分區
    readPartition(req, res, next) {
        readPartition().then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 創建店舖資料
    async createShop(req, res, next) {
        if (!req.body.shopName || !req.body.shopCode) {
            res.json({
                success: false,
                msg: '缺少商店名稱或商店編號'
            })
        }
        const shopData = {
            shopId: generateUUID(),
            shopCode: req.body.shopCode,
            shopType: req.body.shopType,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime(),
        }
        createShop(shopData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 創建分區
    createPartition(req, res, next) {
        if (!req.body.partitionName) {
            res.json({
                success: false,
                msg: '缺少分區名稱'
            })
        }
        const data = {
            partitionName: req.body.partitionName,
            updateDate: getCurrentTime()
        }
        createPartition(data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 更改店舖資料
    updateShop(req, res, next) {
        if (!req.body.shopName || !req.body.shopCode) {
            res.json({
                success: false,
                msg: '缺少商店名稱或商店編號'
            })
        }
        const id = req.body.shopId
        const data = {
            shopType: req.body.shopType,
            shopCode: req.body.shopCode,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
            updateDate: getCurrentTime(),
        }
        updateShop(id, data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 刪除分店
    deleteShop(req, res, next) {
        const shopId = req.body.shopId
        deleteShop(shopId).then(result => {
            res.json(result)
        }).catch((err) => {
            next(err)
        })
    }

    // 刪除分區
    deletePartition(req, res, next) {
        const id = req.body.id
        deletePartition(id).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    // 獲取禁銷列表
    readBindProduct(req, res, next) {
        if(!req.body.shopId){
            return {
                success: false,
                msg: '缺少商店編號'
            }
        }
        const options = req.body.shopId ? { shopId: req.body.shopId } : {}
        readBindProduct(options).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    // 設置禁售產品
    async bindProductToShop(req, res, next) {
        let productList = req.body.productList
        const shopId = productList[0].shopId
        productList = productList.map(item => {
            return [
                item.shopId + '-' + item.productId,
                item.shopId,
                item.productId,
                getCurrentTime(),
                getCurrentTime()
            ]
        })


        if (Array.isArray(productList) && Array.isArray(productList[0])) {
            await deleteShopProductItem(shopId)
            await bindProductTOShop(productList).then(result => {
                res.json(result)
            }).catch(err => {
                next(err)
            })
        } else {
            next(new Error('voild input'))
        }
    }

    setShopOrder(req, res, next) {
        const shopList = req.body.shopList
        if (Array.isArray(shopList)) {
            setShopOrder(shopList).then(result => {
                if (res.success) {
                    res.json(result)
                }
            }).catch(err => {
                next(err)
            })
        } else {
            next(new Error('voild input'))

        }
    }
}