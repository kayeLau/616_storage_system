import AppDataSource from '../data-source';
import { MenuAuth } from '../entity/MenuAuth';
import { optionsGenerater } from './base_model';
const menuAuthRepository = AppDataSource.getRepository(MenuAuth);

export async function readMenuAuth(options) {
    const { conditions, parameters } = optionsGenerater(options, "menuAuth")

    return menuAuthRepository
    .createQueryBuilder("MenuAuth")
    .select([
        "menuAuth.id AS id",
        "menuAuth.auth AS auth",
        "menuAuth.name AS name",
        "menuAuth.path AS path",
        "menuAuth.parentId AS parentId",
        "menuAuth.type AS type",
        "DATE_FORMAT(menu.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
    ])
    .where(conditions.join(" AND "), parameters)
    .orderBy("menu.index", "ASC")
    .getRawMany()
    .then((result) => {
        return {
            success:true,
            data: result,
        };
    })
}
