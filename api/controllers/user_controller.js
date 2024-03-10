const loginCheck = require('../models/login')
const { toRegister, updateUserInformation, getUsersItems, getUser, deleteUsersItem } = require('../models/register_model')
const { getPartitionItems } = require('../models/shopManage_model')
var { getCurrentTime, checkNull } = require('../utils')
const { generateUUID, hashPassword } = require('../models/encryption');
const config = require('../config/development_config')
const jwt = require('jsonwebtoken')

module.exports = class Member {
    static setUserInfoByRule(data) {
        const userInfoRule = {
            '-1': ['shopPartition', 'shopId', 'shopName'],
            '0': ['shopPartition'],
            '1': ['shopPartition'],
            '2': ['shopId', 'shopName']
        }
        const userAuth = userInfoRule[data.auth]
        userAuth.forEach(key => {
            data[key] = null
        });
        return data
    }

    // 註冊
    postRegister(req, res, next) {
        const password = hashPassword(req.body.password);

        const memberData = Member.setUserInfoByRule({
            id: generateUUID(),
            name: req.body.name,
            password,
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
            online:0,
            createDate: getCurrentTime(),
            updateDate: getCurrentTime(),
        })


        toRegister(memberData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
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
                updateUserInformation(rows[0].id, { online: 1 })
                res.json({
                    success: true,
                    token,
                    userInfo: {
                        name: rows[0].name,
                        shopId: rows[0].shopId,
                        shopName: rows[0].shopName,
                        auth: rows[0].auth,
                    },
                    msg: "歡迎 " + rows[0].name + " 的登入！",
                })
            }
        }).catch(err => {
            next(err)
        })
    }

    postLogout(req, res ,next){
        const userInfo = req.userInfo
        updateUserInformation(userInfo.id, { online: 0 }).then(result => {
            res.json({
                success: true
            })
        }).catch(err => {
            next(err)
        })
    }

    // 更改個人資料
    postUpdateUser(req, res, next) {
        const memberData = Member.setUserInfoByRule({
            // password: hashPassword(req.body.password),
            updateDate: getCurrentTime(),
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopName: req.body.shopName,
            shopPartition: req.body.shopPartition,
        })

        const id = req.body.id
        updateUserInformation(id, memberData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 刪除個人資料
    postDeleteUser(req, res, next) {
        const id = req.body.id

        deleteUsersItem(id).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    async getUsersList(req, res, next) {
        const options = { auth: req.body.auth, shopId: req.body.shopId }
        const size = parseInt(req.body.size)
        const page = parseInt(req.body.page)
        let partitionDict = {}
        await getPartitionItems({}, 999, 1).then(result => {
            if (result.success) {
                result.resource.forEach(item => {
                    partitionDict[item.id] = item.partitionName
                });
            }
        })

        getUsersItems(options, size, page).then(result => {
            result.resource.forEach(item => {
                item.shopPartitionName = partitionDict[item.shopPartition]
            })
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    getUser() {
        getUser(tokenResult.data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}