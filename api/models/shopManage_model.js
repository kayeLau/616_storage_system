const db = require('./connection_db')
const { checkRepeated, createNew, updateItem, deleteItem, getItems , customQuery } = require('./base_model')
const { getCurrentTime } = require('../utils')

function createNewShop(data) {
    return checkRepeated("shop_info", {shopName:data.shopName})
        .then(() => createNew("shop_info", data))
        .catch(err => err)
}

function createNewPartition(data) {
    return checkRepeated("partition_info", {partitionName:data.partitionName})
        .then(() => createNew("partition_info", data))
        .catch(err => err)
}

function updateShopInformation(shopId, data) {
    return updateItem("shop_info", data, 'shopId', shopId)
}

function deleteShopItem(shopId) {
    return deleteItem("shop_info", 'shopId', shopId)
}

function deleteShopProductItem(shopId) {
    return deleteItem("shop_product_info", 'shopId', shopId)
}

function deletePartitionItem(id) {
    return deleteItem("partition_info", 'id', id)
}

async function getShopItems(options, size, page) {
    return getItems({table:"shop_info", options, size, page , primaryKey:'shopId' , orderby:'shopOrder' , sort:'ASC'})
}

function getPartitionItems(options, size, page){
    return getItems({table:"partition_info", options, size, page })
}

function getBandProducts(options, size, page) {
    return getItems({table:"shop_product_info", options, size, page})
}

function bindProductTOShop(productList) {
    return customQuery(`INSERT IGNORE INTO shop_product_info (id,shopId, productId ,createDate,updateDate) VALUES ? `, [productList])
}

function setShopOrder(shopList){
    let shopOrder = ''
    let updateDate = ''
    let ids = []
    const currentTime = getCurrentTime()
    shopList.forEach(item => {
        ids.push(item.shopId)
        updateDate += `WHEN "${item.shopId}" THEN "${currentTime}" \n`
        shopOrder += `WHEN "${item.shopId}" THEN ${Number(item.shopOrder)} \n`
    })
    return customQuery(`UPDATE shop_info SET
            shopOrder=CASE shopId
            ${shopOrder} END,
            updateDate=CASE shopId
            ${updateDate} END
            WHERE shopId IN (?)`, [ids])
}

module.exports = { getShopItems, createNewShop, updateShopInformation, deleteShopItem, bindProductTOShop , 
    getBandProducts , getPartitionItems , deletePartitionItem , createNewPartition , deleteShopProductItem , setShopOrder}