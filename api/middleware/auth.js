const { verifyToken } = require('../models/verification')
// const authMap = {
//     '/orders/getOrderList':[-1,0,1,2],
//     '/orders/createOrder':[0,1],
//     '/orders/updateOrder':[-1,0,1,2],
//     '/orders/deleteOrder':[-1,0,1,2],
//     '/orders/createAdditionOrderItem':[],
//     '/orders/updateOrderDetailAssignQuantity':[0,1,2],
//     '/orders/checkOrderRepeated':[],
//     '/orders/exportDailyMeetSummary':[0,1,2],
//     '/orders/getDailyOrderStatus':[],
// }

async function auth(req, res, next) {
    const token = req.headers['token'];
    let userInfo = {}
    if(req.path === '/users/login'){
        next()
        return
    }

    await verifyToken(token, true).then(tokenResult => {
        if (tokenResult.success === true) {
            userInfo = tokenResult.userInfo
            req.userInfo = tokenResult.userInfo
            next()
        } else {
            res.json(tokenResult)
            return
        }
    })
}

module.exports = auth