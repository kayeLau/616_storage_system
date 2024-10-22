const jwt = require('jsonwebtoken')
const config = require('../config/development_config')
import { Member } from '../entity/Member';
import AppDataSource from '../data-source';
const memberRepository = AppDataSource.getRepository(Member);

interface UserInfo {
    shopId: String,
    auth: Number,
    ipAddress?:String
}

interface verifyTokenResult {
    msg: String
    success: Boolean
    userInfo?: UserInfo
}
// @ params
// getUser 是否需要取得用戶資料
export async function verifyToken(token, getUser = false): Promise<verifyTokenResult> {
    const time = Math.floor(Date.now() / 1000);

    if (token) {
        return jwt.verify(token, config.secret, async (err, decode) => {
            if (!err && decode.exp > time) {
                if (getUser) {
                    const userInfo: UserInfo = await memberRepository
                        .createQueryBuilder("member")
                        .where('member.id = :id', { id: decode.data })
                        .getOne()
                    return {
                        msg: "token verify success",
                        success: true,
                        userInfo
                    }
                }
                return {
                    msg: "token verify success",
                    success: true
                }
            } else {
                return {
                    msg: "token verify fail",
                    success: false,
                }
            }
        })
    } else {
        return {
            msg: "token not exist",
            success: false
        }
    }
}