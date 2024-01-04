const { updateSettingInformation, getSettingItems } = require('../models/settingManage_model')

module.exports = class Shop {

    getSettingList(req, res, next) {
        const options = req.body.name ? { shopType: req.body.name } : {}
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        getSettingItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    postUpdateSetting(req, res, next) {
        const name = req.body.name
        const data = {
            name: req.body.name,
            value: req.body.value,
        }

        updateSettingInformation(name, data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}