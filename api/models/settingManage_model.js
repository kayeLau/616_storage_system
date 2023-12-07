const db = require('./connection_db')
const { updateItem, getItems } = require('./base_model')

function updateSettingInformation(name, data) {
    return updateItem("setting_info", data, 'name', name)
}

function getSettingItems(options, size, page) {
    return getItems("setting_info", options, size, page)
}


module.exports = { updateSettingInformation, getSettingItems }