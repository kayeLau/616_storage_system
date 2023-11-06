const { getCurrentTime } = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getOrderItems , createNewOrder , updateOrderInformation , deleteOrderItem } = require('../models/orderManage_model')
const { verifyToken } = require('../models/verification')

module.exports = class order {
    getOrderList(req, res, next){
        const token = req.headers['token'];
        const options = req.body.updateDate ? { updateDate: req.body.updateDate } : {}
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
        const orderData = {
            orderId:generateUUID(),
            orderType: req.body.orderType,
            orderName: req.body.orderName,
            createDate:getCurrentTime(),
            updateDate:getCurrentTime()
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                createNewOrder(orderData).then(result => {
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