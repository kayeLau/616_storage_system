const db = require('./connection_db')
const { optionsSQLFromatter, createNew, updateItem, deleteItem, getItems } = require('./base_model')

function createNewOrder(data) {
    let createDateRange = data.createDateRange
    let orderList = data.orderList.map(item => {
        return [
            data.id,
            item.productCode,
            item.productName,
            item.orderQuantity,
            item.unit,
            data.updateDate
        ]
    })
    delete data.createDateRange
    delete data.orderList
    return checkOrderRepeated("order_info", { orderShopId: data.orderShopId, createDate: createDateRange })
        .then(() => createNew("order_info", data))
        .then(() => insertOrderItems(orderList))
        .catch(err => err)
}

function insertOrderItems(list) {
    let result = {}
    result.success = false
    return new Promise((resolve, reject) => {
        // 需要用二維數組手插入
        if (Array.isArray(list) && Array.isArray(list[0])) {
            db.query(`INSERT IGNORE INTO order_detail_info (
                orderId,
                productCode,
                productName,
                orderQuantity,
                unit,
                updateDate) VALUES ? `, [list], (err) => {
                if (err) {
                    result.msg = "server error,please try again"
                    reject(result)
                    console.log(err)
                    return
                }
                result.msg = "success"
                result.success = true
                resolve(result)
            })
        } else {
            result.msg = "wrong input"
            reject(result)
        }
    })
}

function checkOrderRepeated(table, options) {
    let result = {}
    return new Promise((resolve, reject) => {
        let optionsSQL = optionsSQLFromatter(options)
        db.query(`SELECT * FROM ${table} ${optionsSQL}`, (err, row) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                reject(result)
                console.log(err)
                return
            }
            if (row.length >= 1) {
                result.msg = "item always exist"
                result.success = false
                reject(result)
            } else {
                result.msg = "success"
                result.success = true
                resolve(result)
            }
        })
    })
}

function updateOrderInformation(shopId, data) {
    return updateItem("order_info", data, 'shopId', shopId)
}

function deleteOrderItem(shopId) {
    return deleteItem("order_info", 'shopId', shopId)
}

// function getOrderDetailItems(options, size, page){
//     return getItems("order_detail_info", options, size, page)
// }

function getOrderItems(options, size, page) {
    const result = {}
    return getItems("order_info", options, size, page).then(res => {
        let orderItems = []
        if (res.success) {
            orderItems = res.resource
        }
        return orderItems
    }).then(async orderItems => {
        const promiseList = orderItems.map((item, index) => {
            return getItems("order_detail_info", { orderId: item.id }, 999, 1).then(res => {
                if (res.success) {
                    orderItems[index].children = res.resource
                }
            })
        })
        await Promise.all(promiseList)
        return orderItems
    }).then(orderItems => {
        result.msg = "get success"
        result.resource = orderItems
        result.success = true
        return result
    }).catch(err => err)
}

module.exports = { createNewOrder, updateOrderInformation, deleteOrderItem, getOrderItems }