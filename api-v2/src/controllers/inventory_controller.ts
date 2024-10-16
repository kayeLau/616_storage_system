import { readInventory, createInventory, updateInventory } from '../models/inventory_model';
import { readProduct } from '../models/productManage_model';
import { readShop } from '../models/shopManage_model';

interface createInventory {
    shopId: string,
    productId: number,
    id: number,
    remain: number,
    editBy: string,
    uniqueCode: string
}

interface updateInventory {
    id: number,
    remain: number,
    editBy: string
}

module.exports = class Inventony {
    // 獲取盤點列表
    async readInventory(req, res, next) {
        const options = { shopId: req.body.shopId }
        const size = parseInt(req.body.size) || 999
        const page = parseInt(req.body.page) || 1
        try {
            const product = await readProduct({}, 999, 1)
            const shop = await readShop({}, 999, 1)
            const inventory = await readInventory(options, size, page)
            res.json({
                success: true,
                product: product.data,
                shop: shop.data,
                inventory: inventory.data
            })
        } catch (err) {
            next(err)
        }
    }

    createInventory(req, res, next) {
        const data: Array<createInventory> = req.body.inventoryList.map(item => {
            item.uniqueCode = item.shopId + '-' + item.month + '-' + item.productId
            return item
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

}