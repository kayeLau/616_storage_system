const { getCurrentTime, getSettingTimeRange } = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getOrderItems, createNewOrder, updateOrderInformation, deleteOrderItem, insertOrderItems, updateOrderDetailAssignQuantity, checkOrderRepeated, getOrderExportList } = require('../models/orderManage_model')
const { getProductItems } = require('../models/productManage_model')
const { getShopItems } = require('../models/shopManage_model')

module.exports = class order {
    async getOrderList(req, res, next) {
        const userInfoAuth = Number(req.userInfo.auth)
        const orderShopId = userInfoAuth === 0 || userInfoAuth === 1 ? req.userInfo.shopId : userInfoAuth === -1 ? req.body.orderShopId : "";
        const options = { updateDate: req.body.updateDate, orderShopId }
        const size = req.body.size
        const page = req.body.page

        if (userInfoAuth === 2) {
            let shopIdList = await getShopItems({ shopPartition: req.userInfo.shopPartition }, 999, 1).then(result => {
                if (result.success) {
                    return result.resource.map(item => item.shopId)
                }
            }).catch(() => [])
            options.orderShopId = shopIdList
        }

        getOrderItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    async postCheckOrderRepeated(req, res, next) {
        const userInfo = req.userInfo
        const orderDateRange = await getSettingTimeRange()

        const orderData = {
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            orderDate: orderDateRange[0].substring(0, 10),
        }

        await checkOrderRepeated("order_info", orderData).then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
            next(err)
        })
    }

    async postCreateOrder(req, res, next) {
        const userInfo = req.userInfo
        const orderDateRange = await getSettingTimeRange()
        const dateStr = orderDateRange[0].substring(0, 10).replaceAll('-', '')

        const orderData = {
            id: generateUUID(),
            orderList: req.body.orderList,
            orderUserId: userInfo.id,
            orderUserName: userInfo.name,
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            orderDate: orderDateRange[0].substring(0, 10),
            orderCode: userInfo.shopId + '-' + dateStr,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime()
        }

        if (!orderData.orderList.length) {
            res.json({ msg: "wrong input", success: false })
        }

        createNewOrder(orderData).then(result => {
            res.json({ success: result.success, msg: result.msg })
        }).catch(err => {
            next(err)
        })
    }

    postAdditionOrder(req, res, next) {
        const updateDate = getCurrentTime()
        let orderList = req.body.orderList
        if (Array.isArray(orderList) && orderList.length) {
            orderList = orderList.map(item => {
                let state = item.assignQuantity === null || item.assignQuantity === undefined ? 0 : 1 
                return [
                    item.orderId,
                    item.productId,
                    item.assignQuantity,
                    item.orderQuantity,
                    updateDate,
                    item.orderMode,
                    state
                ]
            })
            insertOrderItems(orderList).then(result => {
                res.json(result)
            }).catch(err => {
                next(err)
            })
        } else {
            next()
        }
    }

    postupdateOrderDetailAssignQuantity(req, res, next) {
        const data = req.body.assignQuantitys
        const userInfo = req.userInfo
        if (Array.isArray(data)) {
            updateOrderDetailAssignQuantity(data,userInfo).then(result => {
                res.json(result)
            }).catch(err => {
                next(err)
            })
        } else {
            next(new Error('voild input'))
        }
    }

    postUpdateOrder(req, res, next) {
        const orderId = req.body.orderId
        const orderData = {
            orderType: req.body.orderType,
            orderName: req.body.orderName,
            updateDate: getCurrentTime()
        }

        updateOrderInformation(orderId, orderData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    postDeleteOrder(req, res, next) {
        const orderId = req.body.orderId

        deleteOrderItem(orderId).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    async getDailyOrderStatus(req, res, next) {
        let result = {}
        try {
            let exportDate = req.body.exportDate
            const dailyOrderList = await getOrderItems({ orderDate: exportDate }, 999, 1).then(result => {
                if (result.success) {
                    return result
                }
            })
            result.success = true
            result.total = dailyOrderList.total
            res.json(result)
        } catch (err) {
            next(err)
        }
    }

    async postExportDailyMeetSummary(req, res, next) {
        let summaryProductIdsMap = {}
        let exportDate = req.body.exportDate
        let exportType = req.body.exportType
        
        const shopsList = await getShopItems({ shopPartition: req.userInfo.shopPartition }, 999, 1).then(result => {
            if (result.success) {
                return result.resource.map(item => item.shopName)
            }
        }).catch(err => {
            next(err)
        })

        await getProductItems({ summary: exportType }, 999, 1).then(result => {
            if (result.success) {
                result.resource
                .forEach(item =>
                    summaryProductIdsMap[item.productId] = {
                        productName:item.productName , 
                        freezersNum:item.freezersNum ,
                        unit:item.unit,
                        orderItems:new Array(shopsList.length).fill(0)
                    }
                )
            }
        }).catch(err => {
            next(err)
        })

        await getOrderExportList({ orderDate: exportDate }, 999, 1, summaryProductIdsMap, shopsList).then(result => {
            if (result.success) {
                res.json(result)
            }
        }).catch(err => {
            next(err)
        })

    }

}