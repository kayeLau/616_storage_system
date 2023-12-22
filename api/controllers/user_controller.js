const loginCheck = require('../models/login')
const { toRegister, updateUserInformation, getUsersItems, getUser, deleteUsersItem } = require('../models/register_model')
var { getCurrentTime, checkNull } = require('../utils')
const { generateUUID, hashPassword } = require('../models/encryption');
const config = require('../config/development_config')
const jwt = require('jsonwebtoken')

module.exports = class Member {
    // 註冊
    postRegister(req, res, next) {
        const password = hashPassword(req.body.password);

        const memberData = {
            id: generateUUID(),
            name: req.body.name,
            password,
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopName: req.body.shopName,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime(),
        }

        toRegister(memberData).then(result => {
            res.json(result)
        })
    }

    // 登入
    postLogin(req, res, next) {
        const memberData = {
            name: req.body.name,
            password: hashPassword(req.body.password),
            updateDate: getCurrentTime(),
        }
        loginCheck(memberData).then(rows => {
            if (checkNull(rows) === true) {
                res.json({
                    success: false,
                    msg: "請輸入正確的帳號或密碼。"
                })
            } else if (checkNull(rows) === false) {
                const token = jwt.sign({ data: rows[0].id }, config.secret, { expiresIn: '2h' });
                // res.setHeader('token', token);
                res.json({
                    success: true,
                    token,
                    userInfo: {
                        name: rows[0].name,
                        shopId: rows[0].shopId,
                        shopName: rows[0].shopName,
                        auth: rows[0].auth
                    },
                    msg: "歡迎 " + rows[0].name + " 的登入！",
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    // 更改個人資料
    postUpdateUser(req, res, next) {
        const memberData = {
            // password: hashPassword(req.body.password),
            updateDate: getCurrentTime(),
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopName: req.body.shopName
        }

        const id = req.body.id
        updateUserInformation(id, memberData).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    // 刪除個人資料
    postDeleteUser(req, res, next) {
        const id = req.body.id

        deleteUsersItem(id).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })

    }

    getUsersList(req, res, next) {
        const options = { auth: req.body.auth }
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)

        getUsersItems(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }

    getUser() {
        getUser(tokenResult.data).then(result => {
            res.json(result)
        }).catch(err => {
            res.json(err)
        })
    }
}