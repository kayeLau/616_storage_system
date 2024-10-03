import { loginCheck } from '../models/login';
import { toRegister, updateMember, readMember, deleteMember , toLogin } from '../models/member_model';
// import { getPartitionItems } from '../models/shopManage_model';
import { hashPassword } from '../models/encryption';


module.exports = class Member {
    static setUserInfoByRule(data) {
        const userInfoRule = {
            '-1': ['shopPartition', 'shopId', 'shopName'],
            '0': ['shopPartition'],
            '1': ['shopPartition'],
            '2': ['shopId', 'shopName'],
            '3':['shopPartition', 'shopId', 'shopName']
        }
        const userAuth = userInfoRule[data.auth]
        if(userAuth){
            userAuth.forEach(key => {
                data[key] = null
            });
            return data
        }else{
            return {}
        }

    }

    // 註冊
    register(req, res, next) {
        const password = hashPassword(req.body.password);

        const memberData = Member.setUserInfoByRule({
            name: req.body.name,
            password,
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopPartition: req.body.shopPartition,
            online:0,
        })


        toRegister(memberData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 登入
    login(req, res, next) {
        const memberData = {
            name: req.body.name,
            password: hashPassword(req.body.password),
            isForceLogin:req.body.force,
            ip:req.header('x-forwarded-for') || req.connection.remoteAddress
        };
        toLogin(memberData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    logout(req, res ,next){
        const userInfo = req.userInfo
        updateMember(userInfo.id, { online: 0 , ipAddress:null }).then(result => {
            res.json({success: true})
        }).catch(err => {
            next(err)
        })
    }

    // 更改個人資料
    updateMember(req, res, next) {
        const memberData = Member.setUserInfoByRule({
            // password: hashPassword(req.body.password),
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopPartition: req.body.shopPartition,
        })

        const id = req.body.id
        updateMember(id, memberData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 刪除個人資料
    deleteMember(req, res, next) {
        const id = req.body.id

        deleteMember(id).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    async readMember(req, res, next) {
        const options = { auth: req.body.auth, shopId: req.body.shopId }
        const size = parseInt(req.body.size) || 999
        const page = parseInt(req.body.page) || 1

        readMember(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

}