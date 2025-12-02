import { readMenuAuth } from '../models/menuAuth_model';


module.exports = class MenuAuth {
    async readMenuAuth(req, res, next) {
        let options = { 
            auth: req.body.auth
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