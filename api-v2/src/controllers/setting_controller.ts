import { updateSetting, readSetting } from '../models/settingManage_model';
import { getCurrentTime } from '../utils';

module.exports = class Setting {

    read(req, res, next) {
        const options = req.body.name ? { name: req.body.name } : {}
        readSetting(options).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    update(req, res, next) {
        const data = {
            name: req.body.name,
            value: req.body.value,
            id: req.body.id,
            updateDate: getCurrentTime()
        }

        updateSetting(data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}