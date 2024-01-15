const { checkRepeated, createNew , updateItem , deleteItem , getItems } = require('./base_model')

function createNewProduct(data) {
    return checkRepeated("product_info",{productCode:data.productCode})
        .then(() => createNew("product_info",data))
        .catch(err => err)
}

function updateProductInformation(productCode,data){
    return updateItem("product_info",data,'productCode',productCode)
}

function deleteProductItem(productCode){
    return deleteItem("product_info",'productCode',productCode)
}

function getProductItems(options,size,page){
    return getItems({table:"product_info",options,size,page})
}

module.exports = { getProductItems , createNewProduct , updateProductInformation , deleteProductItem }