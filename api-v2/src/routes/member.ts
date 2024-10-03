var express = require('express');
var router = express.Router();

const UserModifyMethod = require('../controllers/member_controller')

const userModifyMethod = new UserModifyMethod()

router.post('/register',userModifyMethod.register)

router.post('/login', userModifyMethod.login);

router.post('/logout', userModifyMethod.logout);

router.post('/updateMember', userModifyMethod.updateMember);

router.post('/deleteMember', userModifyMethod.deleteMember);

router.post('/readMember', userModifyMethod.readMember);

// router.post('/readMember', userModifyMethod.readMember);

module.exports = router;
