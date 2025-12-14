import { readMenuAuth } from '../models/menuAuth_model';

module.exports = class MenuAuth {
    async readMenuAuth(req, res, next) {
        const userInfo = req.userInfo
        const options = { 
            auth: userInfo.auth,
            isTree: req.body.isTree || false,
        }

        try {
            await readMenuAuth(options).then(result => {
                res.json(result)
            })
        } catch (err) {
            next(err)
        }

    }

}