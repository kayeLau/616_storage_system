const db = require('./connection_db')
const { checkRepeated, createNew , updateItem , deleteItem , getItems } = require('./base_model')

function createNewProduct(data) {
    return checkRepeated("product_info","shopName",data.shopName)
        .then(() => createNew("product_info",data))
        .catch(err => err)
}

function updateProductInformation(shopId,data){
    return updateItem("product_info",data,'shopId',shopId)
}

function deleteProductItem(shopId){
    return deleteItem("product_info",'shopId',shopId)
}

function getProductItems(options,size,page){
    return getItems("product_info",options,size,page)
}


module.exports = { getProductItems , createNewProduct , updateProductInformation , deleteProductItem }