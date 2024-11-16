import { verifyToken } from '../models/verification'
interface UserInfo {
    ipAddress?:String
}

async function auth(req, res, next) {
    const token = req.headers['token'];
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    let userInfo:UserInfo = {}
    if(req.path === '/member/login'){
        next()
        return
    }

    await verifyToken(token, true).then(tokenResult => {
        if (tokenResult.success === true) {
            userInfo = tokenResult.userInfo
            req.userInfo = tokenResult.userInfo
            if(userInfo.ipAddress && userInfo.ipAddress !== ip){
                res.json({
                    success:false,
                    msg:"token verify fail",
                    ip:userInfo.ipAddress
                })
                return
            }
            next()
        } else {
            res.json(tokenResult)
            return
        }
    }).catch(err => {
        next(err)
    })
}

module.exports = auth