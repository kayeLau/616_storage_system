const { getCurrentTime, getTodayTimeRange } = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getOrderItems, createNewOrder, updateOrderInformation, deleteOrderItem, insertOrderItems, updateOrderDetailAssignQuantity, checkOrderRepeated } = require('../models/orderManage_model')

module.exports = class order {
    getOrderList(req, res, next) {
        console.log(req.userInfo)
        const options = { updateDate: req.body.updateDate, department: req.body.department, orderShopId: req.body.shopId }
        const size = req.body.size
        const page = req.body.page

        getOrderItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })

    }

    postCheckOrderRepeated(req, res, next) {
        const userInfo = req.userInfo
        console.log(req.userInfo)

        const orderData = {
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            createDate: getTodayTimeRange(),
        }

        checkOrderRepeated("order_info", orderData).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    postCreateOrder(req, res, next) {
        const userInfo = req.userInfo

        const orderData = {
            id: generateUUID(),
            status: 0,
            orderList: req.body.orderList,
            orderUserId: userInfo.id,
            orderUserName: userInfo.name,
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            createDateRange: getTodayTimeRange(),
            createDate: getCurrentTime(),
            updateDate: getCurrentTime()
        }
        createNewOrder(orderData).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    postAdditionOrder(req, res, next) {
        const updateDate = getCurrentTime()
        let orderList = req.body.orderList
        if (Array.isArray(orderList)) {
            orderList = orderList.map(item => {
                return [
                    item.orderId,
                    item.productCode,
                    item.productName,
                    item.assignQuantity,
                    item.orderQuantity,
                    item.unit,
                    item.standard,
                    updateDate,
                    item.orderMode
                ]
            })
        }

        insertOrderItems(orderList).then(result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    postupdateOrderDetailAssignQuantity(req, res, next) {
        const data = req.body.assignQuantitys
        const orderId = req.body.orderId
        updateOrderDetailAssignQuantity(data, orderId).then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
            res.json(err)
        })
    }

    postUpdateOrder(req, res, next) {
        const orderId = req.body.orderId
        const orderData = {
            orderType: req.body.orderType,
            orderName: req.body.orderName,
            updateDate: getCurrentTime()
        }

        updateOrderInformation(orderId, orderData).then(result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    postDeleteOrder(req, res, next) {
        const orderId = req.body.orderId

        deleteOrderItem(orderId).then(result => {
            console.log(result)
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

}