import AppDataSource from '../data-source';
import { Menu } from '../entity/Menu';
import { optionsGenerater } from './base_model';
const menuRepository = AppDataSource.getRepository(Menu);

export async function readMenu(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "menu")
    const total = await menuRepository
    .createQueryBuilder("menu")
    .where(conditions.join(" AND "), parameters)
    .getCount();

    return menuRepository
    .createQueryBuilder("menu")
    .select([
        "menu.id AS id",
        "menu.disable AS disable",
        "menu.comboId AS comboId",
        "menu.classify AS classify",
        "menu.options AS options",
        "menu.foodCode AS foodCode",
        "menu.price AS price",
        "menu.name AS name",
        "menu.introduce AS introduce",
        "DATE_FORMAT(menu.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
    ])
    .where(conditions.join(" AND "), parameters)
    .orderBy("menu.foodCode", "ASC")
    .skip((page - 1) * size)
    .take(size)
    .getRawMany()
    .then((result) => {
        return {
            success:true,
            data: result,
            page,
            size,
            total
        };
    })
}

export async function createMenu(data) {
    const newMenu = menuRepository.create({ ...data });
    await menuRepository.save(newMenu);
    return { ...newMenu, success: true };
}

export function updateMenu(menuId, data) {
        return menuRepository
        .createQueryBuilder()
        .update(Menu)
        .set({ ...data })
        .where("menu.menuId = :menuId", { menuId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function deleteMenu(menuId) {
    return menuRepository
    .createQueryBuilder()
    .delete()
    .from(Menu)
    .where("menu.menuId = :menuId", { menuId })
    .execute()
    .then(() => { return { success: true } })
    .catch((err) => { 
        return Promise.reject({ success: false, message: err.message })
    })
}