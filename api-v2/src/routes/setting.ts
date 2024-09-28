var express = require('express');
var router = express.Router();

const SettingModifyMethod = require('../controllers/setting_controller')

const settingModifyMethod = new SettingModifyMethod()

router.post('/read',settingModifyMethod.read)

router.post('/update',settingModifyMethod.update)


module.exports = router;
