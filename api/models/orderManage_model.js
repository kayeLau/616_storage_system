const db = require('./connection_db')
const { getCurrentTime } = require('../utils')
const { optionsSQLFromatter, createNew, updateItem, deleteItem, getItems } = require('./base_model')

function createNewOrder(data) {
    let createDateRange = data.createDateRange
    return checkOrderRepeated("order_info", { orderShopId: data.orderShopId, createDate: createDateRange })
        .then(async (res) => {
            const orderId = res.resource ? res.resource.id : data.id
            let orderList = data.orderList.map(item => {
                return [
                    item.id ? item.id : '',
                    orderId,
                    item.productCode,
                    item.productName,
                    item.orderQuantity,
                    item.unit,
                    item.standard,
                    data.updateDate,
                    item.orderMode
                ]
            })
            if(!res.resource){
                delete data.orderList
                delete data.createDateRange
                createNew("order_info", data) // 訂單
            }else{
                await deleteItem("order_detail_info", 'orderId', orderId)
            }
            return orderList
        })
        .then((orderList) => insertOrderItems(orderList)) // 訂單明細
        .catch(err => err)
}

function insertOrderItems(list) {
    let result = {}
    result.success = false
    return new Promise((resolve, reject) => {
        // 需要用二維數組插入
        if (Array.isArray(list) && Array.isArray(list[0])) {
            db.query(`INSERT IGNORE INTO order_detail_info (
                id,
                orderId,
                productCode,
                productName,
                orderQuantity,
                unit,
                standard,
                updateDate,
                orderMode) VALUES ? `, [list], (err) => {
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
                console.log(err)
                reject(result)
                return
            }
            if (row.length >= 1) {
                result.msg = row.length + " item have find"
                result.success = true
                result.resource = row[0]
                getItems("order_detail_info", { orderId: result.resource.id }, 999, 1).then(res => {
                    if (res.success) {
                        result.resource.children = res.resource
                    }
                    resolve(result)
                })
            } else {
                result.msg = "success"
                result.success = true
                resolve(result)
            }
        })
    })
}

function updateOrderDetailAssignQuantity(list,orderId){
    let result = {}
    result.success = false
    return new Promise((resolve, reject) => {
        if (Array.isArray(list)) {
            let assignQuantity = ''
            let status = ''
            let remark = ''
            let updateDate = ''
            let ids = []
            const currentTime = getCurrentTime()
            list.forEach(item => {
                ids.push(item.id)
                assignQuantity += `WHEN ${item.id} THEN ${Number(item.assignQuantity)} \n`
                status += `WHEN ${item.id} THEN ${Number(1)} \n`
                updateDate += `WHEN ${item.id} THEN "${currentTime}" \n`
                remark += `WHEN ${item.id} THEN "${item.remark}" \n`
            })
            db.query(`UPDATE order_detail_info SET
            assignQuantity=CASE id
            ${assignQuantity} END,
            status=CASE id
            ${status} END,
            remark=CASE id
            ${remark} END,
            updateDate=CASE id
            ${updateDate} END
            WHERE id IN (?)`, [ids], (err) => {
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
    }).then(res => {
        if(res.success){
            setOrderItemStatus(orderId)
            return res
        }
    })
}

function updateOrderInformation(orderId, data) {
    return updateItem("order_info", data, 'id', orderId)
}

function setOrderItemStatus(orderId) {
    getItems("order_detail_info", { orderId }, 999, 1).then(res => {
        if (res.success) {
            let orderDetailStatus = res.resource.find(item => item.status === 0 || item.status === null)
            console.log(res.resource)
            return orderDetailStatus
        }
    }).then(orderDetailStatus => {
        console.log(orderDetailStatus)
        if(!orderDetailStatus){
            updateOrderInformation(orderId, {status:1})
        }else{
            updateOrderInformation(orderId, {status:0})
        }
    }).catch(err => {
        console.log(err)
    })
}

function deleteOrderItem(shopId) {
    return deleteItem("order_info", 'shopId', shopId)
}

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

module.exports = { createNewOrder, updateOrderInformation, deleteOrderItem, getOrderItems , insertOrderItems , updateOrderDetailAssignQuantity , setOrderItemStatus , checkOrderRepeated }