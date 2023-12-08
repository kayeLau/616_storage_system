const { getCurrentTime, getTodayTimeRange } = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getOrderItems, createNewOrder, updateOrderInformation, deleteOrderItem, insertOrderItems, updateOrderDetailAssignQuantity, checkOrderRepeated } = require('../models/orderManage_model')
const { verifyToken } = require('../models/verification')

module.exports = class order {
    getOrderList(req, res, next) {
        const options = { updateDate: req.body.updateDate, department: req.body.department, orderShopId: req.body.orderShopId }
        const size = req.body.size
        const page = req.body.page

        getOrderItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })

    }

    postCheckOrderRepeated(req, res, next) {
        const token = req.headers['token'];

        verifyToken(token, true).then(tokenResult => {
            if (tokenResult.success === true) {
                const orderData = {
                    orderShopId: tokenResult.userInfo.shopId,
                    createDate: getTodayTimeRange(),
                }
                checkOrderRepeated("order_info", orderData).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postCreateOrder(req, res, next) {
        const token = req.headers['token'];

        verifyToken(token, true).then(tokenResult => {
            const orderData = {
                id: generateUUID(),
                status: 0,
                orderList: req.body.orderList,
                orderUserId: tokenResult.userInfo.id,
                orderUserName: tokenResult.userInfo.name,
                orderShopId: tokenResult.userInfo.shopId,
                orderShopName: tokenResult.userInfo.shopName,
                department: tokenResult.userInfo.auth,
                createDateRange: getTodayTimeRange(),
                createDate: getCurrentTime(),
                updateDate: getCurrentTime()
            }
            if (tokenResult.success === true) {
                createNewOrder(orderData).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
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
                    item.orderQuantity,
                    item.unit,
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