const db = require('./connection_db')
const { checkRepeated, createNew , updateItem , deleteItem , getItems } = require('./base_model')

function createNewOrder(data) {
    return checkRepeated("order_info", "shopName", data.shopName)
        .then(() => createNew("order_info", data))
        .catch(err => err)
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
        if(res.success){
            orderItems = res.resource
        }
        return orderItems
    }).then(async orderItems => {
        const promiseList = orderItems.map((item,index) => {
            return getItems("order_detail_info", { orderId:item.id}, 999, 1).then(res => {
                if(res.success){
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
    }).catch( err => err )
}

module.exports = {createNewOrder , updateOrderInformation , deleteOrderItem , getOrderItems}