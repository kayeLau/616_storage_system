const { checkRepeated, createNew , updateItem , deleteItem , getItems } = require('./base_model')

function createNewProduct(data) {
    return checkRepeated("product_info",{productCode:data.productCode})
        .then(() => createNew("product_info",data))
        .catch(err => err)
}

function updateProductInformation(productId,data){
    return updateItem("product_info",data,'productId',productId)
}

function deleteProductItem(productId){
    return deleteItem("product_info",'productId',productId)
}

function getProductItems(options,size,page){
    return getItems({table:"product_info",options,size,page,primaryKey:'productId'})
}

module.exports = { getProductItems , createNewProduct , updateProductInformation , deleteProductItem }