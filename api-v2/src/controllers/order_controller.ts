import { readSettingTimeRange } from '../utils';
import { readOrder, readOrderDetail, createOrder } from '../models/orderManage_model';
import { readShop } from '../models/shopManage_model';

interface orderData {
    orderList:Array<orderList>,
    orderUserId: string,
    orderUserName: string,
    orderShopId: string,
    department: number,
    orderDate: string,
    orderCode: string,
}

interface orderList {
    id:string, // 訂單ID
    productId:number,
    orderQuantity:number,
    orderMode:number,
    updateDate:string,
    orderUserName:string // 最後修改人ID
}

module.exports = class order {
    async readOrder(req, res, next) {
        const userInfoAuth = Number(req.userInfo.auth)
        const orderShopId = userInfoAuth === 0 || userInfoAuth === 1 ? req.userInfo.shopId : userInfoAuth === -1 ? req.body.orderShopId : "";
        const options = { updateDate: req.body.updateDate, orderShopId }
        const size = req.body.size || 1
        const page = req.body.page || 20
        if (userInfoAuth === 2) {
            let shopIdList = await readShop({}, 999, 1).then(result => {
                if (result.success) {
                    return result.data
                        .filter(item => item.shopPartition.split(',').find(item => item === String(req.userInfo.shopPartition)))
                        .map(item => item.shopId)
                }
            }).catch(() => [])
            options.orderShopId = shopIdList
        }
        readOrder(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    async readOrderDetail(req, res, next) {
        const orderId = req.body.orderId
        readOrderDetail(orderId).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 前線員工建立新訂單
    async createOrder(req, res, next) {
        const userInfo = req.userInfo
        const orderDateRange = await readSettingTimeRange()
        const dateStr = orderDateRange[0].substring(0, 10).replaceAll('-', '')

        const orderData:orderData = {
            orderList: req.body.orderList,
            orderUserId: userInfo.id,
            orderUserName: userInfo.name,
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            orderDate: orderDateRange[0].substring(0, 10),
            orderCode: userInfo.shopId + '-' + dateStr,
        }

        createOrder(orderData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

}