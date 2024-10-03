import { readShop, readPartition, createShop, createPartition, updateShop, deleteShop, deletePartition,
    bindProductTOShop, readBindProduct, setShopOrder } from '../models/shopManage_model';

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
            const shopList = result.data.map(item => {
                const shopPartitionArr = item.shopPartition.split(',').map(item => Number(item))
                return {
                    ...item,
                    shopPartition: shopPartitionArr,
                    shopPartitionName: shopPartitionArr.map(item => partitionDict[item])
                }
            })
            res.json({
                success: true,
                data: shopList
            })
        })
    }

    // 獲取分區
    readPartition(req, res, next) {
        readPartition().then(result => {
            res.json(result)
        })
    }

    // 創建店舖資料
    async createShop(req, res, next) {
        if (!req.body.shopName || !req.body.shopCode) {
            res.json({ success: false, msg: '缺少商店名稱或商店編號' })
            return
        }
        const shopData = {
            shopCode: req.body.shopCode,
            shopType: req.body.shopType,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
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
            res.json({ success: false, msg: '缺少分區名稱' })
            return
        }
        const data = { partitionName: req.body.partitionName }
        createPartition(data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 更改店舖資料
    updateShop(req, res, next) {
        if (!req.body.shopName || !req.body.shopCode) {
            res.json({ success: false, msg: '缺少商店名稱或商店編號' })
            return
        }
        const id = req.body.shopId
        const data = {
            shopType: req.body.shopType,
            shopCode: req.body.shopCode,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
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
        if (!req.body.shopId) {
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
        interface productList {
            shopId: string;
            productId: number;
        }
        const productList: Array<productList> = req.body.productList
        if (!productList.length) {
            return {
                success: false,
                msg: '缺少禁售產品列表'
            }
        }
        const shopId = productList[0].shopId
        await bindProductTOShop(shopId, productList).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    setShopOrder(req, res, next) {
        interface shopList {
            shopId: string;
            shopOrder: number;
        }
        const shopList: Array<shopList> = req.body.shopList
        if (!shopList.length) {
            return {
                success: false,
                msg: '缺少商店列表'
            }
        }
        setShopOrder(shopList).then(result => {
            if (res.success) {
                res.json(result)
            }
        }).catch(err => {
            next(err)
        })
    }
}