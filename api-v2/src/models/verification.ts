const jwt = require('jsonwebtoken')
const config = require('../config/development_config')
import { Member } from '../entity/Member';
import { readApiByPath } from '../models/apiManage_model'
import AppDataSource from '../data-source';
const memberRepository = AppDataSource.getRepository(Member);

interface UserInfo {
    shopId: String,
    auth: Number,
    ipAddress?: String
}

interface verifyTokenResult {
    msg: String
    success: Boolean
    userInfo?: UserInfo
}

// 驗證用戶Token
// @ params
// getUser 是否需要取得用戶資料
export async function verifyToken(token, ip, getUser = false): Promise<verifyTokenResult> {
    const time = Math.floor(Date.now() / 1000);

    if (token) {
        return jwt.verify(token, config.secret, async (err, decode) => {
            if (!err && decode.exp > time) {
                let userInfo: UserInfo
                if (getUser) {
                    userInfo = await memberRepository
                        .createQueryBuilder("member")
                        .where('member.id = :id', { id: decode.data })
                        .getOne()
                }
                return {
                    msg: "token verify success",
                    success: true,
                    userInfo: userInfo ? userInfo : {}
                }
            } else {
                return {
                    msg: "token verify fail",
                    success: false,
                }
            }
        })
    }

    return {
        msg: "token not exist",
        success: false
    }
}

// 驗證用戶權限
export async function verifyaAuth(url, auth): Promise<verifyTokenResult> {
    await readApiByPath(url).then(res => {
        if (res.success) {
            return {
                msg: "auth verify success",
                success: true,
            }
        }
    })

    return {
        msg: "auth verify fail",
        success: false,
    }
}