import AppDataSource from '../data-source';
import { MenuAuth } from '../entity/MenuAuth';
const menuAuthRepository = AppDataSource.getRepository(MenuAuth);

export async function readMenuAuth(options) {
    const auth = options.auth
    const isTree = options.isTree

    return menuAuthRepository
        .createQueryBuilder("menuAuth")
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
        .getRawMany()
        .then((result) => {
            if (auth === -1) {
                result = result.filter(item => item.name !== "appFood");
            } else {
                result = result.filter(item => {
                    const auths = item.auth.split(',');
                    return auths.includes(String(auth)) || auths.includes("*");
                });
            }

            return {
                success: true,
                data: isTree ? generateMenuMap(result) : result,
            };
        })
}

function generateMenuMap(list, root = 0) {
    const map = {};
    const roots = [];

    list.forEach(item => {
        if (item.type === 0) {
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
