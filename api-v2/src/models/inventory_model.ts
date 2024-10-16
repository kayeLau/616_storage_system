import AppDataSource from '../data-source';
import { Inventory } from '../entity/Inventory';
import { optionsGenerater } from './base_model';
const inventoryRepository = AppDataSource.getRepository(Inventory);

export async function readInventory(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "inventory")
    const total = await inventoryRepository
        .createQueryBuilder("inventory")
        .where(conditions.join(" AND "), parameters)
        .getCount();

    return inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoin("inventory.shop", "shop")
        .leftJoin("inventory.product", "product")
        .select([
            "inventory.id AS id",
            "inventory.shopId AS shopId",
            "inventory.productId AS productId",
            "inventory.shopId AS shopId",
            "inventory.remain AS remain",
            "inventory.month AS month",
            "inventory.editBy AS editBy",
            "shop.shopName As shopName",
            "product.productCode As productCode",
            "product.productName As productName",
            "product.unit As unit",
            "product.standard As standard",
            "product.classify As classify",
            "product.freezersNum As freezersNum",
            "DATE_FORMAT(inventory.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
        ])
        .where(conditions.join(" AND "), parameters)
        .skip((page - 1) * size)
        .take(size)
        .getRawMany()
        .then((result) => {
            return {
                success: true,
                data: result,
                page,
                size,
                total
            };
        })
}

export async function createInventory(data) {
    await inventoryRepository
    .createQueryBuilder()
    .insert()
    .into(Inventory)
    .values(data)
    .orIgnore()
    .updateEntity(false)
    .execute();
    return { success: true };
}

export function updateInventory(list, userInfo) {
    return inventoryRepository
        .createQueryBuilder()
        .update(Inventory)
        .set({
            remain: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN ${detail.remain}`).join(' ') +
                " END",
            editBy: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN ${userInfo.name}`).join(' ') +
                " END",
        })
        .whereInIds(list.map(detail => detail.id))
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}