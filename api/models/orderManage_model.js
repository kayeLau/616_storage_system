const { getCurrentTime, getSettingTimeRange } = require('../utils')
const { optionsSQLFromatter, createNew, updateItem, deleteItem, getItems, customQuery, checkRepeated } = require('./base_model')

// 如有修改訂單,沒有則創建訂單
function createNewOrder(data) {
    return checkRepeated("order_info", { orderShopId: data.orderShopId, orderDate: data.orderDate, department: data.department }, true)
        .then(async (res) => {
            const orderId = res.resource.length ? res.resource[0].id : data.id
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
            if (!res.resource.length) {
                delete data.orderList
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
    return customQuery(`INSERT IGNORE INTO order_detail_info (
        id,
        orderId,
        productCode,
        productName,
        orderQuantity,
        unit,
        standard,
        updateDate,
        orderMode) VALUES ? `, [list])
}


function checkOrderRepeated(table, options) {
    return checkRepeated(table, options, true).then(async res => {
        let resource = {}
        if (res.resource.length >= 1) {
            resource = res.resource[0]
            let params = {
                table: "order_detail_info",
                options: { orderId: resource.id },
                size: 999,
                page: 1
            }
            await getItems(params).then(res => {
                if (res.success) {
                    resource.children = res.resource
                }
            })
        }
        res.resource = resource
        return res
    })
}

function updateOrderDetailAssignQuantity(list) {
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
        let optionsSQL = optionsSQLFromatter(options, 'order_info')
        await customQuery(`SELECT COUNT(*) AS total FROM ( SELECT COUNT(*) AS total FROM order_info ${optionsSQL} GROUP BY orderCode) AS total`).then(res => {
            if (res.success) {
                result.total = res.resource[0].total || 0;
            }
        })
        await Promise.all(promiseList)
        result.msg = "get success"
        result.resource = orderItems
        result.success = true
        return result
    })
}

// 導出肉類總表
function getOrderExportList(options, size, page, summaryProductCodesMap, shopsList) {
    const result = {}

    return getOrderAndgroupby(options, size, page).then(async group => {
        const summaryProductCodes = Object.keys(summaryProductCodesMap)
        let orderItems = new Array(shopsList.length).fill(0).map(() => {
            return new Array(summaryProductCodes.length).fill(0).map(() => { return { assignQuantity: 0, unit: '' } })
        })
        const promiseList = group.map((item) => {
            return getItems({ table: "order_detail_info", options: { orderId: item.id }, size: 999, page: 1 }).then(res => {
                if (res.success) {
                    let index = shopsList.indexOf(item.shopName)
                    // 查product并賦值
                    orderItems[index] = summaryProductCodes.map(summaryProductCode => {
                        let target = res.resource.find(item => item.productCode === summaryProductCode)
                        return {
                            assignQuantity: target ? target.assignQuantity : 0,
                            unit: target ? target.unit : ''
                        }
                    })
                }
            })
        })
        await Promise.all(promiseList)
        result.msg = "get success"
        result.resource = { orderItems, productCode: Object.values(summaryProductCodesMap), shopName: shopsList }
        result.success = true
        return result
    })
}

// 根據orderCode groupby
async function getOrderAndgroupby(options, size, page) {
    const orderDateRange = await getSettingTimeRange()
    const orderDateStr = orderDateRange[0].substring(0, 10)
    const query = {
        table: "order_info",
        join: "order_info INNER JOIN shop_info ON orderShopId = shopId",
        columns: ` * , DATE_FORMAT(order_info.updateDate,'%Y-%m-%d %H:%i:%S') AS updateDate , DATE_FORMAT(order_info.createDate,'%Y-%m-%d') AS createDate , IF(order_info.orderDate = '${orderDateStr}',1,0) AS isToday`,
        options,
        size,
        page
    }
    return getItems(query).then(res => {
        let orderItems = []
        if (res.success) {
            orderItems = res.resource.reduce((group, order) => {
                let key = order.orderCode
                if (group[key]) {
                    group[key].id.push(order.id)
                    group[key].orderUserName.push(order.orderUserName)
                    group[key].department.push(order.department)
                } else {
                    group[key] = {
                        ...order,
                        id: [order.id],
                        orderUserName: [order.orderUserName],
                        department: [order.department]
                    };
                }
                return group;
            }, {});
        }
        return Object.values(orderItems)
    })
}

module.exports = {
    getOrderExportList,
    createNewOrder, updateOrderInformation, deleteOrderItem,
    getOrderItems, insertOrderItems, updateOrderDetailAssignQuantity, checkOrderRepeated
}