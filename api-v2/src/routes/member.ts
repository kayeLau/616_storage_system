var express = require('express');
var router = express.Router();

const UserModifyMethod = require('../controllers/member_controller')

const userModifyMethod = new UserModifyMethod()

router.post('/register',userModifyMethod.register)

router.post('/login', userModifyMethod.login);

router.post('/logout', userModifyMethod.logout);

router.post('/update', userModifyMethod.update);

router.post('/delete', userModifyMethod.delete);

router.post('/read', userModifyMethod.read);

// router.post('/readMember', userModifyMethod.readMember);

module.exports = router;
