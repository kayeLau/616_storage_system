var express = require('express');
var router = express.Router();

const SettingModifyMethod = require('../controllers/setting_controller')

const settingModifyMethod = new SettingModifyMethod()

router.post('/readSetting',settingModifyMethod.readSetting)

router.post('/readAllSetting',settingModifyMethod.readAllSetting)

router.post('/updateSetting',settingModifyMethod.updateSetting)


module.exports = router;
