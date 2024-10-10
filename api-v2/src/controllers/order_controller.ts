import { readSettingTimeRange } from '../utils';
import { readOrder, readOrderDetail, createOrder, createOrderDetail, 
    updateAssignQuantity, setOrderState, exportOrderMeat , checkOrderRepeated} from '../models/orderManage_model';
import { readShop } from '../models/shopManage_model';

interface orderData {
    orderList: Array<orderList>,
    orderUserId: string,
    orderUserName: string,
    orderShopId: string,
    department: number,
    orderDate: string,
    orderCode: string,
}

interface orderList {
    id: string, // 訂單ID
    productId: number,
    orderQuantity: number,
    orderMode: number,
    updateDate: string,
    orderUserName: string // 最後修改人ID
}

interface summaryProductIdsMap {
    [key: string]: summaryProductItem;
}
interface summaryProductItem {
    productName: string,
    freezersNum: number,
    unit: string,
    orderItems: Array<number>
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

        const orderData: orderData = {
            orderList: req.body.orderList || [],
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

    // 管理員追加訂單
    additionOrder(req, res, next) {
        const userInfo = req.userInfo
        let orderList = req.body.orderList
        if (Array.isArray(orderList) && orderList.length) {
            const orderId = orderList[0].orderId
            orderList = orderList.map(item => {
                item.state = item.assignQuantity === null || item.assignQuantity === undefined ? 0 : 1
                item.lastEditBy = userInfo.name
                return item
            })
            createOrderDetail(orderList).then(async result => {
                await setOrderState(orderId)
                res.json(result)
            }).catch(err => {
                next(err)
            })
        } else {
            next()
        }
    }

    async checkOrderRepeated(req, res, next) {
        const userInfo = req.userInfo
        const orderDateRange = await readSettingTimeRange()
        const orderData = {
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            orderDate: orderDateRange[0].substring(0, 10),
        }

        await checkOrderRepeated(orderData).then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
            next(err)
        })
    }

    // 更改分配數量
    async updateAssignQuantity(req, res, next) {
        const data = req.body.assignQuantitys
        const userInfo = req.userInfo
        const orderId = req.body.orderId
        if (Array.isArray(data)) {
            await updateAssignQuantity(data, userInfo)
            await setOrderState(orderId)
        } else {
            next(new Error('voild input'))
        }
    }

    // 導出每日總表
    async exportDailyMeetSummary(req, res, next) {
        let summaryProductIdsMap: summaryProductIdsMap = {}
        let exportDate = req.body.exportDate
        let exportType = req.body.exportType
        let orderedShops = new Set()

        await readOrder({ orderDate: exportDate }, 999, 1).then(result => {
            result.data.forEach(item => orderedShops.add(item.shopName))
        })
        const shopsList = await readShop({}, 999, 1).then(result => {
            return result.data.map(item => item.shopName).filter(item => orderedShops.has(item))
        })

        await readOrderDetail({ summary: exportType }).then(result => {
            result.data.forEach(item =>
                summaryProductIdsMap[item.productId] = {
                    productName: item.productName,
                    freezersNum: item.freezersNum,
                    unit: item.unit,
                    orderItems: new Array(shopsList.length).fill(0)
                }
            )
        }).catch(err => {
            next(err)
        })

        await exportOrderMeat({ orderDate: exportDate }, 999, 1, summaryProductIdsMap, shopsList).then(result => {
            if (result.success) {
                res.json(result)
            }
        }).catch(err => {
            next(err)
        })
    }

    async postHistoryOrder(req, res, next) {
        const options = { orderCode: req.body.orderCode }
        const size = req.body.size
        const page = req.body.page
        readOrder(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

}