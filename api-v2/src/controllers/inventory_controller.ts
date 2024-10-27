import { readInventory, createInventory, updateInventory , checkOrderRepeated } from '../models/inventory_model';
import { readProduct } from '../models/productManage_model';
// import { readShop } from '../models/shopManage_model';

interface createInventory {
    shopId: string,
    productId: number,
    id: number,
    orderQuantity: number,
    editBy: string,
}

interface updateInventory {
    id: number,
    orderQuantity: number,
}

module.exports = class Inventony {
    static getCurrentMonth() {
        const date = new Date()
        return date.getFullYear() + '-' + (date.getMonth() + 1)
    }
    // 獲取盤點列表
    async readInventory(req, res, next) {
        const options = { 
            freezersNum: req.body.freezersNum,
            classify: req.body.classify
        }

        try {
            const product = await readProduct(options, 999, 1)
            const inventory = await readInventory({})
            res.json({
                success: true,
                product: product.data,
                inventory: inventory.data
            })
        } catch (err) {
            next(err)
        }
    }

    createInventory(req, res, next) {
        const userInfo = req.userInfo
        const month = Inventony.getCurrentMonth()
        const data: Array<createInventory> = req.body.inventoryList.map(item => {
            return {
                id:item.id || null,
                shopId: userInfo.shopId,
                productId: item.productId,
                orderQuantity: item.orderQuantity,
                month: month,
                editBy: userInfo.name,
            }
        })
        createInventory(data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    updateInventory(req, res, next) {
        const data: Array<updateInventory> = req.body.inventoryList
        const userInfo = req.userInfo

        updateInventory(data, userInfo).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    async checkInventoryRepeated(req, res, next) {
        const userInfo = req.userInfo
        const month = Inventony.getCurrentMonth()
        const options = { 
            shopId: userInfo.shopId,
            month
        }

        try {
            const product = await readProduct({}, 999, 1)
            const inventory = await checkOrderRepeated(options)
            res.json({
                success: true,
                product: product.data,
                inventory: inventory.data
            })
        } catch (err) {
            next(err)
        }
    }
}