import AppDataSource from '../data-source';
import { Inventory } from '../entity/Inventory';
import { optionsGenerater } from './common/base_model';
const inventoryRepository = AppDataSource.getRepository(Inventory);

export async function readInventory(options) {
    const { conditions, parameters } = optionsGenerater(options, "inventory")

    return inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoin("inventory.shop", "shop")
        .select([
            "inventory.id AS id",
            "inventory.productId AS productId",
            "inventory.shopId AS shopId",
            "inventory.orderQuantity AS orderQuantity",
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
                        id:item.id,
                        children:{}
                    }
                }
                data[item.shopId].children[item.productId] = item.orderQuantity
            })
            return {
                success: true,
                data:Object.values(data)
            };
        })
}

// 檢查重複
export async function checkOrderRepeated(options) {
    const { conditions, parameters } = optionsGenerater(options, "inventory")

    return inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoin("inventory.product", "product")
        .select([
            "inventory.id AS id",
            "inventory.productId AS productId",
            "inventory.shopId AS shopId",
            "inventory.orderQuantity AS orderQuantity",
            "inventory.month AS month",
            "product.classify AS classify",
            "product.productCode AS productCode",
            "product.productName AS productName",
            "product.standard AS standard",
        ])
        .where(conditions.join(" AND "), parameters)
        .getRawMany()
        .then(result => {
            return {
                success: true,
                data:result
            }
        })
}

export async function createInventory(data) {
    await inventoryRepository.save(data)
    return { success: true };
}

export function updateInventory(list, userInfo) {
    return inventoryRepository
        .createQueryBuilder()
        .update(Inventory)
        .set({
            orderQuantity: () => "CASE id " +
                list.map(detail => `WHEN ${detail.id} THEN ${detail.orderQuantity}`).join(' ') +
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