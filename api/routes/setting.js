var express = require('express');
var router = express.Router();

const SettingModifyMethod = require('../controllers/setting_controller')

const settingModifyMethod = new SettingModifyMethod()

router.post('/getSettingList',settingModifyMethod.getSettingList)

router.post('/updateSetting',settingModifyMethod.postUpdateSetting)


module.exports = router;
