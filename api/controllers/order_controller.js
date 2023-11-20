const { getCurrentTime , getTodayTimeRange} = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getOrderItems , createNewOrder , updateOrderInformation , deleteOrderItem , insertOrderItems , updateOrderDetailAssignQuantity , setOrderItemStatus} = require('../models/orderManage_model')
const { verifyToken } = require('../models/verification')

module.exports = class order {
    getOrderList(req, res, next){
        const token = req.headers['token'];
        const options = { updateDate: req.body.updateDate , department: req.body.department, orderShopId: req.body.orderShopId }
        const size = req.body.size
        const page = req.body.page

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                getOrderItems(options,size,page).then(result => {
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

        verifyToken(token,true).then(tokenResult => {
            const orderData = {
                id:generateUUID(),
                status:0,
                orderList:req.body.orderList,
                orderUserId: tokenResult.userInfo.id,
                orderUserName: tokenResult.userInfo.name,
                orderShopId: tokenResult.userInfo.shopId,
                orderShopName: tokenResult.userInfo.shopName,
                department:tokenResult.userInfo.auth,
                createDateRange:getTodayTimeRange(),
                createDate:getCurrentTime(),
                updateDate:getCurrentTime()
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
        }).catch(err => {
            console.log(err)
        })
    }

    postAdditionOrder(req, res, next){
        const token = req.headers['token'];
        const updateDate = getCurrentTime()
        let orderList = req.body.orderList
        if(Array.isArray(orderList)){
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

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                insertOrderItems(orderList).then(result => {
                    console.log(result)
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postupdateOrderDetailAssignQuantity(req, res, next){
        const token = req.headers['token'];

        verifyToken(token).then(tokenResult => {
            const data = req.body.assignQuantitys
            const orderId = req.body.orderId
            if (tokenResult.success === true) {
                updateOrderDetailAssignQuantity(data,orderId).then(result => {
                    res.json(result)
                }).catch(err => {
                    console.log(err)
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postUpdateOrder(req, res, next){
        const token = req.headers['token'];
        const orderId = req.body.orderId
        const orderData = {
            orderType: req.body.orderType,
            orderName: req.body.orderName,
            updateDate:getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                updateOrderInformation(orderId,orderData).then(result => {
                    console.log(result)
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postDeleteOrder(req, res, next){
        const token = req.headers['token'];
        const orderId = req.body.orderId

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                deleteOrderItem(orderId).then(result => {
                    console.log(result)
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }
}