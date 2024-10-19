import AppDataSource from '../data-source';
import { Inventory } from '../entity/Inventory';
import { optionsGenerater } from './base_model';
const inventoryRepository = AppDataSource.getRepository(Inventory);

export async function readInventory(options) {
    const { conditions, parameters } = optionsGenerater(options, "inventory")

    return inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoin("inventory.shop", "shop")
        .select([
            "inventory.id AS id",
            "inventory.shopId AS shopId",
            "inventory.productId AS productId",
            "inventory.shopId AS shopId",
            "inventory.remain AS remain",
            "inventory.month AS month",
            "inventory.editBy AS editBy",
            "shop.shopName As shopName",
            "DATE_FORMAT(inventory.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
        ])
        .where(conditions.join(" AND "), parameters)
        .getRawMany()
        .then((result) => {
            const data = {}
            result.forEach(item => {
                if(!data[item.shopId]){
                    data[item.shopId] = {
                        shopId:item.shopId,
                        shopName:item.shopName,
                        id:item.id
                    }
                }
                data[item.shopId][item.productCode] = item.remain
            })
            return {
                success: true,
                data:Object.values(data)
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