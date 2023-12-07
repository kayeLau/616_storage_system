const { updateSettingInformation, getSettingItems } = require('../models/settingManage_model')
const { verifyToken } = require('../models/verification')

module.exports = class Shop {

    getSettingList(req, res, next){
        const token = req.headers['token'];
        const options = req.body.name ? { shopType: req.body.name } : {}
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                getSettingItems(options,size,page).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

    postUpdateSetting(req, res, next){
        const token = req.headers['token'];
        const name = req.body.name
        const data = {
            name: req.body.name,
            value: req.body.value,
        }

        verifyToken(token).then(tokenResult => {
            if (tokenResult.success === true) {
                updateSettingInformation(name,data).then(result => {
                    res.json(result)
                }).catch(err => {
                    res.json(err)
                })
            } else {
                res.json(tokenResult)
            }
        })
    }

}