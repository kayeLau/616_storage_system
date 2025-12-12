import { readMenuAuth } from '../models/menuAuth_model';


module.exports = class MenuAuth {
    async readMenuAuth(req, res, next) {
        const isTree = req.body.isTree || false
        const options = { 
            auth: req.body.auth,
        }

        try {
            await readMenuAuth(options, isTree).then(result => {
                res.json(result)
            })
        } catch (err) {
            next(err)
        }

    }

}