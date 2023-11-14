const db = require('./connection_db')
const { checkRepeated, createNew , updateItem , getItems , getAllItem } = require('./base_model')

function toRegister(memberData) {
    return checkRepeated("member_info","name",memberData.name)
        .then(() => createNew("member_info",memberData))
        .catch(err => err)
}

function updateUserInformation(id,data){
    return updateItem("member_info",data,'id',id)
}

function getUsersItems(options, size, page) {
    return getItems("member_info", options, size, page)
}

function getUser(id){
    return getAllItem("member_info",{id})
}

module.exports = { toRegister , updateUserInformation , getUsersItems , getUser }