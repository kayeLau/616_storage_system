const { getCurrentTime } = require('../utils')
const { getShopItems, createNewShop, updateShopInformation, deleteShopItem, bindProductTOShop, getBandProducts,
    getPartitionItems, createNewPartition, deletePartitionItem, deleteShopProductItem , setShopOrder } = require('../models/shopManage_model')
const { generateUUID } = require('../models/encryption');

module.exports = class Shop {

    async getShopList(req, res, next) {
        const options = { shopType: req.body.shopType }
        const size = parseInt(req.body.size) || 999
        const page = parseInt(req.body.page) || 1
        let partitionDict = {}
        await getPartitionItems({}, 999, 1).then(result => {
            if (result.success) {
                result.resource.forEach(item => {
                    partitionDict[item.id] = item.partitionName
                });
            }
        })

        getShopItems(options, size, page).then(result => {
            result.resource.forEach(item => {
                item.shopPartition = item.shopPartition.split(',').map(item => Number(item))
                item.shopPartitionName = item.shopPartition.map(item => partitionDict[item])
            })
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 獲取分區
    getPartitionList(req, res, next) {
        getPartitionItems({}, 999, 1).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 創建店舖資料
    async postCreateShop(req, res, next) {
        let lastShopOrder = 0
        await getShopItems({}, 999, 1).then(res => {
            if (res.success) {
                res.resource.forEach(item => {
                    lastShopOrder = Math.max(lastShopOrder, item.shopOrder)
                })
            }
        })
        const shopData = {
            shopId: generateUUID(),
            shopCode: req.body.shopCode,
            shopType: req.body.shopType,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime(),
            shopOrder: Number(lastShopOrder) + 1
        }

        createNewShop(shopData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 創建分區
    postCreatePartition(req, res, next) {
        const partitionData = {
            partitionName: req.body.partitionName,
            updateDate: getCurrentTime()
        }

        createNewPartition(partitionData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 更改店舖資料
    postUpdateShop(req, res, next) {
        const shopId = req.body.shopId
        const shopData = {
            shopType: req.body.shopType,
            shopCode: req.body.shopCode,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
            updateDate: getCurrentTime(),
        }

        updateShopInformation(shopId, shopData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 刪除分店
    async postDeleteShopItem(req, res, next) {
        const shopId = req.body.shopId

        try {
            await deleteShopProductItem(shopId)
            deleteShopItem(shopId).then(result => {
                res.json(result)
            })
        } catch (err) {
            next(err)
        }
    }

    // 刪除分區
    postDeletePartitionItem(req, res, next) {
        const id = req.body.id

        deletePartitionItem(id).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    // 獲取禁銷列表
    getBindProductList(req, res, next) {
        const options = req.body.shopId ? { shopId: req.body.shopId } : {}
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        getBandProducts(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    // 設置禁售產品
    async postBindProductToShop(req, res, next) {
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

    postSetShopOrder(req, res, next) {
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