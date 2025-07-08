import { readMenu, createMenu, updateMenu, deleteMenu } from '../models/menu_model';

module.exports = class menu {
    async readMenu(req, res, next) {
        let options = { 
            disable: req.body.disable,
            name: req.body.name, 
            classify: req.body.classify,
        }
        const size = req.body.size || 999
        const page = req.body.page || 1
        try {
            await readMenu(options, size, page).then(result => {
                res.json(result)
            })
        } catch (err) {
            next(err)
        }

    }

    createMenu(req, res, next) {
        const data = {
            foodCode: req.body.foodCode,
            name: req.body.name,
            classify: req.body.classify,
            options: req.body.options,
            price: req.body.price,
            introduce: req.body.introduce,
            comboId: req.body.comboId,
            disable: req.body.disable
        }

        createMenu(data).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    updateMenu(req, res, next) {
        const id = req.body.menuId
        const date = {
            foodCode: req.body.foodCode,
            name: req.body.name,
            classify: req.body.classify,
            options: req.body.options,
            price: req.body.price,
            introduce: req.body.introduce,
            comboId: req.body.comboId,
            disable: req.body.disable
        }

        updateMenu(id, date).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }

    deleteMenu(req, res, next) {
        const menuId = req.body.menuId

        deleteMenu(menuId).then(result => {
            res.json(result)
        }).catch(err => {
            next(err)
        })
    }
}