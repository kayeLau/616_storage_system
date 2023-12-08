const { verifyToken } = require('../models/verification')

async function auth(req, res, next) {
    const token = req.headers['token'];
    if(req.path === '/users/login'){
        next()
        return
    }
    await verifyToken(token, true).then(tokenResult => {
        if (tokenResult.success === true) {
            console.log('middleware work')
            next()
        } else {
            res.json(tokenResult)
        }
    })
}

module.exports = auth