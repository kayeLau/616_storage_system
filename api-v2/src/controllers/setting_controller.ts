import { updateSetting, readSetting , readAllSetting } from '../models/settingManage_model';

module.exports = class Setting {

    readSetting(req, res, next) {
        const options = req.body.name ? { name: req.body.name } : {}
        readSetting(options).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    readAllSetting(req, res, next) {
        readAllSetting().then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    updateSetting(req, res, next) {
        const data = {
            name: req.body.name,
            value: req.body.value,
            id: req.body.id,
        }

        updateSetting(data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}