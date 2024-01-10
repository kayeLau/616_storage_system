const db = require('./connection_db')
const { getCurrentTime } = require('../utils')
const { optionsSQLFromatter, createNew, updateItem, deleteItem, getItems, customQuery } = require('./base_model')

// 如有修改訂單,沒有則創建訂單
function createNewOrder(data) {
    let createDateRange = data.createDateRange
    return checkOrderRepeated("order_info", { orderShopId: data.orderShopId, createDate: createDateRange, department: data.department })
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
            if (!res.resource) {
                delete data.orderList
                delete data.createDateRange
                createNew("order_info", data) // 訂單
            } else {
                await deleteItem("order_detail_info", 'orderId', orderId)
            }
            return orderList
        })
        .then((orderList) => createNewOrderItems(orderList)) // 訂單明細
        .catch(err => err)
}

// 倉庫追加時用
function insertOrderItems(list) {
    return customQuery(`INSERT IGNORE INTO order_detail_info (
            orderId,
            productCode,
            productName,
            assignQuantity,
            orderQuantity,
            unit,
            standard,
            updateDate,
            orderMode,
            status) VALUES ? `, [list])
}

function createNewOrderItems(list) {
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
        let optionsSQL = optionsSQLFromatter(options, table)
        db.query(`SELECT * FROM ${table} ${optionsSQL}`, (err, row) => {
            if (err) {
                result.msg = "server error,please try again"
                result.success = false
                reject(result)
                return
            }
            if (row.length >= 1) {
                result.msg = row.length + " item have find"
                result.success = true
                result.resource = row[0]
                let params = {
                    table: "order_detail_info",
                    options: { orderId: result.resource.id },
                    size: 999,
                    page: 1
                }
                getItems(params).then(res => {
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

function updateOrderDetailAssignQuantity(list, orderId) {
    let result = {}
    result.success = false
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
        remark += `WHEN ${item.id} THEN "${item.remark || '-'}" \n`
    })
    return customQuery(`UPDATE order_detail_info SET
            assignQuantity=CASE id
            ${assignQuantity} END,
            status=CASE id
            ${status} END,
            remark=CASE id
            ${remark} END,
            updateDate=CASE id
            ${updateDate} END
            WHERE id IN (?)`, [ids])
}

function updateOrderInformation(orderId, data) {
    return updateItem("order_info", data, 'id', orderId)
}

function deleteOrderItem(shopId) {
    return deleteItem("order_info", 'shopId', shopId)
}

// 獲取訂單
function getOrderItems(options, size, page) {
    const result = {}
    return getOrderAndgroupby(options, size, page).then(async orderItems => {
        const promiseList = orderItems.map((item, index) => {
            return getItems({ table: "order_detail_info", options: { orderId: item.id }, size: 999, page: 1 }).then(res => {
                if (res.success) {
                    let status = res.resource.find(item => item.status === 0)
                    orderItems[index].status = status ? 0 : 1
                    orderItems[index].children = res.resource
                }
            })
        })
        await customQuery('SELECT COUNT(*) AS total FROM ( SELECT COUNT(*) AS total FROM order_info GROUP BY orderCode) AS total').then(res => {
            if(res.success){
                result.total = res.resource[0].total || 0;
            }
        })
        await Promise.all(promiseList)
        result.msg = "get success"
        result.resource = orderItems
        result.success = true
        return result
    }).catch(err => { console.log(err) })
}

// 導出肉類總表
function getOrderExportList(options, size, page, summaryProductCodesMap) {
    const result = {}
    return getOrderAndgroupby(options, size, page).then(async orderItems => {
        const shopName = []
        const promiseList = orderItems.map((item, index) => {
            return getItems({ table: "order_detail_info", options: { orderId: item.id }, size: 999, page: 1 }).then(res => {
                if (res.success) {
                    shopName.push(item.shopName)
                    orderItems[index] = Object.keys(summaryProductCodesMap).map(summaryProductCode => {
                        let target = res.resource.find(item => item.productCode === summaryProductCode)
                        return {
                            assignQuantity:target ? target.assignQuantity : 0,
                            unit:target ? target.unit : ''
                        }
                    })
                }
            })
        })
        await Promise.all(promiseList)
        result.msg = "get success"
        result.resource = { orderItems, productCode: Object.values(summaryProductCodesMap) , shopName}
        result.success = true
        return result
    }).catch(err => { console.log(err) })
}

// 根據orderCode groupby
function getOrderAndgroupby(options, size, page) {
    return getItems({ table: "order_info", join: "order_info INNER JOIN shop_info ON orderShopId = shopId", options, size, page }).then(res => {
        let orderItems = []
        if (res.success) {
            orderItems = res.resource.reduce((group, order) => {
                let key = order.orderCode
                if (group[key]) {
                    group[key].id.push(order.id)
                    group[key].orderUserName.push(order.orderUserName)
                    group[key].department.push(order.department)
                } else {
                    group[key] = { ...order, id: [order.id], orderUserName: [order.orderUserName], department: [order.department] };
                }
                return group;
            }, {});
        }
        return Object.values(orderItems)
    })
}

module.exports = {
    getOrderExportList, getOrderAndgroupby,
    createNewOrder, updateOrderInformation, deleteOrderItem,
    getOrderItems, insertOrderItems, updateOrderDetailAssignQuantity, checkOrderRepeated
}