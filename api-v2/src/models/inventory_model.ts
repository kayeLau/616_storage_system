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
        .select([
            "inventory.shopId AS shopId",
            "inventory.shopCode AS shopCode",
            "inventory.shopName AS shopName",
            "inventory.shopType AS shopType",
            "inventory.shopOrder AS shopOrder",
            "inventory.productCount AS productCount",
            "inventory.shopPartition AS shopPartition",
            "DATE_FORMAT(inventory.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
        ])
        .where(conditions.join(" AND "), parameters)
        .orderBy("shop.shopOrder", "ASC")
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