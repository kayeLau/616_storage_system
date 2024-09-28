import { loginCheck } from '../models/login';
import { toRegister, updateMenber, readMembers, deleteMember , toLogin } from '../models/member_model';
// import { getPartitionItems } from '../models/shopManage_model';
import { getCurrentTime, checkNull } from '../utils';
import { generateUUID, hashPassword } from '../models/encryption';


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
        userAuth.forEach(key => {
            data[key] = null
        });
        return data
    }

    // 註冊
    register(req, res, next) {
        const password = hashPassword(req.body.password);

        const memberData = Member.setUserInfoByRule({
            id: generateUUID(),
            name: req.body.name,
            password,
            auth: req.body.auth,
            shopId: req.body.shopId,
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
    login(req, res, next) {
        const memberData = {
            name: req.body.name,
            password: hashPassword(req.body.password),
            updateDate: getCurrentTime(),
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
        updateMenber(userInfo.id, { online: 0 , ipAddress:null }).then(result => {
            res.json({
                success: true
            })
        }).catch(err => {
            next(err)
        })
    }

    // 更改個人資料
    update(req, res, next) {
        const memberData = Member.setUserInfoByRule({
            // password: hashPassword(req.body.password),
            updateDate: getCurrentTime(),
            auth: req.body.auth,
            shopId: req.body.shopId,
            shopPartition: req.body.shopPartition,
        })

        const id = req.body.id
        updateMenber(id, memberData).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    // 刪除個人資料
    delete(req, res, next) {
        const id = req.body.id

        deleteMember(id).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })

    }

    async read(req, res, next) {
        const options = { auth: req.body.auth, shopId: req.body.shopId }
        const size = parseInt(req.body.size) || 999
        const page = parseInt(req.body.page) || 1

        readMembers(options, size, page).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

}