import { verifyToken, verifyaAuth } from '../models/verification'


async function auth(req, res, next) {
    const token = req.headers['token'];
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const path = req.path
    if (path === '/member/login') {
        next()
        return
    }

    try {
        await verifyToken(token, true, ip).then(tokenResult => {
            if (tokenResult.success === true) {
                req.userInfo = tokenResult.userInfo
            } else {
                res.json(tokenResult)
                return
            }
        })
        await verifyaAuth(path, req.userInfo.auth).then(tokenResult => {
            if (tokenResult.success === true) {
                next()
            } else {
                res.json(tokenResult)
                return
            }
        })

    } catch (err) {
        next(err)
    }

}

module.exports = auth