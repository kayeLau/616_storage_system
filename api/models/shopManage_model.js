const db = require('./connection_db')
const { checkRepeated, createNew, updateItem, deleteItem, getItems } = require('./base_model')

function createNewShop(data) {
    return checkRepeated("shop_info", "shopName", data.shopName)
        .then(() => createNew("shop_info", data))
        .catch(err => err)
}

function updateShopInformation(shopId, data) {
    return updateItem("shop_info", data, 'shopId', shopId)
}

function deleteShopItem(shopId) {
    return deleteItem("shop_info", 'shopId', shopId)
}

function getShopItems(options, size, page) {
    return getItems({table:"shop_info", options, size, page})
}

function getPartitionItems(options, size, page){
    return getItems({table:"partition_info", options, size, page})
}

function getBandProducts(options, size, page) {
    return getItems({table:"shop_product_info", options, size, page})
}

function bindProductTOShop(productList) {
    let result = {}
    result.success = false
    return new Promise((resolve, reject) => {
        if (Array.isArray(productList) && Array.isArray(productList[0])) {
            console.log(productList)
            db.query(`INSERT IGNORE INTO shop_product_info (id,shopId, productCode,createDate,updateDate) VALUES ? `, [productList] , (err) => {
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
        }else{
            result.msg = "unexp"
            reject(result)
        }
    })
}


module.exports = { getShopItems, createNewShop, updateShopInformation, deleteShopItem, bindProductTOShop , getBandProducts , getPartitionItems}