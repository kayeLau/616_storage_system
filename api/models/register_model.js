const { checkRepeated, createNew, updateItem, getItems, getAllItem, deleteItem } = require('./base_model')

function toRegister(memberData) {
    return checkRepeated({ table: "member_info", options: { name: memberData.name } })
        .then(() => createNew("member_info", memberData))
        .catch(err => err)
}

function updateUserInformation(id, data) {
    return updateItem("member_info", data, 'id', id)
}

function deleteUsersItem(id) {
    return deleteItem("member_info", 'id', id)
}

function getUsersItems(options, size, page) {
    return getItems({ table: "member_info", options, size, page })
}

function getUser(id) {
    return getAllItem("member_info", { id })
}

module.exports = { toRegister, updateUserInformation, getUsersItems, getUser, deleteUsersItem }