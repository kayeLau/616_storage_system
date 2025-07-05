import { readSettingTimeRange } from '../utils';
import {
    readOrder, readOrderDetail, createOrder, createOrderDetail, readHistoryOrder,
    updateAssignQuantity, setOrderState, exportOrderMeat, checkOrderRepeated
} from '../models/orderManage_model';
import { readShop } from '../models/shopManage_model';
import { readProduct } from '../models/productManage_model';

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
    assignQuantity?: string,
    orderMode: number,
    updateDate: string,
    orderId: string,
    remark?: string,
    lastEditBy?: string
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
    // 獲取訂單
    async readOrder(req, res, next) {
        const userInfoAuth = Number(req.userInfo.auth)
        const orderShopId = userInfoAuth === 0 || userInfoAuth === 1 ? req.userInfo.shopId : userInfoAuth === -1 ? req.body.orderShopId : "";
        const options = { updateDate: req.body.updateDate, orderShopId }
        const size = req.body.size || 20
        const page = req.body.page || 1
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

    // 獲取訂單明細
    async readOrderDetail(req, res, next) {
        const orderId = req.body.orderId
        readOrderDetail(orderId).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 查看訂單明細項匯總
    async readOrderDatailSummary(req, res, next) {
        const options = { updateDate: req.body.updateDate, orderShopId: req.body.orderShopId }
        const result = new Map()
        const size = req.body.size || 20
        const page = req.body.page || 1
        try {
            const orderIds: Array<String> = await readOrder(options, 999, 1).then(res => {
                if (res.success) {
                    return res.data.map(item => item.id)
                }
                return []
            })

            console.log(orderIds)

            for (const orderId of orderIds) {
                const orderDetail = await readOrderDetail(orderId).then(res => res.data)
                orderDetail.forEach(item => {
                    if (!result.has(item.productId)) {
                        result.set(item.productId, {
                            productId: item.productId,
                            orderQuantity: item.orderQuantity,
                            assignQuantity: item.assignQuantity || 0,
                            productName: item.productName,
                            productCode: item.productCode,
                            unit: item.unit,
                            standard: item.standard,
                            classify: item.classify,
                            freezersNum: item.freezersNum,
                        })
                    } else {
                        const currentValue = result.get(item.productId)
                        currentValue.orderQuantity += item.orderQuantity
                        currentValue.assignQuantity += item.assignQuantity ||  0
                        result.set(item.productId, currentValue)
                    }
                })
            }

            const startIndex = (page - 1) * size;
            const endIndex = startIndex + size;

            res.json({
                success: true,
                data: Array.from(result.values()).slice(startIndex, endIndex),
                total: result.size
            })
        } catch (err) {
            next(err)
        }
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
    createAdditionOrder(req, res, next) {
        const userInfo = req.userInfo
        let orderList = req.body.orderList
        if (Array.isArray(orderList) && orderList.length) {
            const orderId = orderList[0].orderId
            orderList = orderList.map(item => {
                return {
                    orderId: item.orderId,
                    productId: item.productId,
                    orderQuantity: item.orderQuantity,
                    assignQuantity: item.assignQuantity,
                    orderMode: item.orderMode,
                    remark: item.remark,
                    status: item.assignQuantity === null || item.assignQuantity === undefined ? 0 : 1,
                    lastEditBy: userInfo.name
                }
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

    // 查看當天是否已下單
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
        try {
            await updateAssignQuantity(data, userInfo)
            await setOrderState(orderId)
            res.json({ success: true })
        } catch (err) {
            next(err)
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
        //排序
        const shopsList = await readShop({}, 999, 1).then(result => {
            if (result.success) {
                return result.data.map(item => item.shopName).filter(item => orderedShops.has(item))
            }
        })

        await readProduct({ summary: exportType }, 999, 1).then(result => {
            result.data.forEach(item =>
                summaryProductIdsMap[item.productId] = {
                    productName: item.productName,
                    freezersNum: item.freezersNum,
                    unit: item.unit,
                    orderItems: new Array(shopsList.length).fill(0)
                }
            )
        })

        await exportOrderMeat({ orderDate: exportDate }, 999, 1, summaryProductIdsMap, shopsList).then(result => {
            if (result.success) {
                res.json(result)
            }
        }).catch(err => {
            next(err)
        })
    }

    async readHistoryOrder(req, res, next) {
        const options = { orderCode: req.body.orderCode }
        const size = req.body.size
        const page = req.body.page
        readHistoryOrder(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

}