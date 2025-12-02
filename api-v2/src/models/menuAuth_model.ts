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
            "menuAuth.nameZh AS nameZh",
            "menuAuth.path AS path",
            "menuAuth.parentId AS parentId",
            "menuAuth.type AS type",
            "DATE_FORMAT(menuAuth.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
        ])
        .where(conditions.join(" AND "), parameters)
        .getRawMany()
        .then((result) => {
            return {
                success: true,
                data: generateMenuMap(result),
            };
        })
}

function generateMenuMap(list, root = 0) {
    const map = {};
    const roots = [];

    list.forEach(item => {
        if(item.type === 0){
            map[item.id] = { ...item, children: [] };
        } else {
            map[item.id] = { ...item };
        }
    });

    list.forEach(item => {
        if (item.parentId === root) {
            roots.push(map[item.id]);
        } else if (map[item.parentId]) {
            map[item.parentId].children.push(map[item.id]);
        }
    });

    return roots;
}
