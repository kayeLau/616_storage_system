const jwt = require('jsonwebtoken')
const config = require('../../config/development_config')
import { Member } from '../../entity/Member';
import { readApiByPath } from '../../models/apiManage_model'
import AppDataSource from '../../data-source';
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
export async function verifyToken(token: string | undefined, getUser = false, ip: string): Promise<verifyTokenResult> {
    if (token) {
        return jwt.verify(token, config.secret, async (err, decode) => {
            const time = Math.floor(Date.now() / 1000);
            if (!err && decode.exp > time) {
                let userInfo: UserInfo
                // 获取用户资料
                if (getUser) {
                    userInfo = await memberRepository
                        .createQueryBuilder("member")
                        .where('member.id = :id', { id: decode.data })
                        .getOne()

                    // 获对比ip
                    if (userInfo.ipAddress && userInfo.ipAddress !== ip) {
                        return {
                            success: false,
                            msg: "token verify fail",
                            ip: userInfo.ipAddress
                        }
                    }
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
export function verifyaAuth(url: String, auth:Number): Promise<verifyTokenResult> {
    return readApiByPath(url).then(res => {
        if (res && res.success && res.data) {
            const accessList = res.data.access.split(',')
            const passAuth = accessList.includes(String(auth)) || accessList.includes('*') || auth === -1
            if (passAuth) {
                return {
                    msg: "auth verify success",
                    success: true,
                }
            }
        }
        
        return {
            msg: "沒有權限",
            success: false,
        }
    }).catch(err => {
        return {
            msg: "權限驗證錯誤",
            success: false,
        }
    })
}