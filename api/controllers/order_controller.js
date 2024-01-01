const { getCurrentTime , getSettingTimeRange } = require('../utils')
const { generateUUID } = require('../models/encryption');
const { getOrderItems, createNewOrder, updateOrderInformation, deleteOrderItem, insertOrderItems, updateOrderDetailAssignQuantity, checkOrderRepeated } = require('../models/orderManage_model')
const { getShopItems } = require('../models/shopManage_model')

module.exports = class order {
    async getOrderList(req, res, next) {
        const userInfoAuth = Number(req.userInfo.auth)
        const orderShopId = userInfoAuth === 0 || userInfoAuth === 1 ?  req.userInfo.shopId : "";
        const options = { updateDate: req.body.updateDate, orderShopId }
        const size = req.body.size
        const page = req.body.page

        if(userInfoAuth === 2){
            let shopIdList = await getShopItems({shopPartition:req.userInfo.shopPartition}, 999, 1).then(result => {
                if(result.success){
                    return result.resource.map(item => item.shopId)
                }
            }).catch(err => [])
            options.orderShopId = shopIdList
        }

        getOrderItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
            res.json(err)
        })

    }

    async postCheckOrderRepeated(req, res, next) {
        const userInfo = req.userInfo
        const createDate = await getSettingTimeRange()

        const orderData = {
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            createDate,
        }

        checkOrderRepeated("order_info", orderData).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    async postCreateOrder(req, res, next) {
        const userInfo = req.userInfo
        const createDateRange = await getSettingTimeRange()

        const orderData = {
            id: generateUUID(),
            status: 0,
            orderList: req.body.orderList,
            orderUserId: userInfo.id,
            orderUserName: userInfo.name,
            orderShopId: userInfo.shopId,
            department: userInfo.auth,
            createDateRange,
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