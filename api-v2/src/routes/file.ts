var express = require('express');
var router = express.Router();

const FileModifyMethod = require('../controllers/file_controller')

const fileModifyMethod = new FileModifyMethod()

router.post('/readLogsName',fileModifyMethod.readLogsName)

router.post('/downloadLog',fileModifyMethod.downloadLog)

module.exports = router;