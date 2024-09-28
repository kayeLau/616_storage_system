import AppDataSource from '../data-source';
import { Shop } from '../entity/Shop';
import { Partition } from '../entity/Partition';
import { ShopProduct } from '../entity/ShopProduct';
import { getCurrentTime } from '../utils';
import { optionsGenerater } from './base_model';
const shopRepository = AppDataSource.getRepository(Shop);
const partitionRepository = AppDataSource.getRepository(Partition);
const shopProductRepository = AppDataSource.getRepository(ShopProduct);

export async function readShop(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "shop")
    return shopRepository
        .createQueryBuilder('shop')
        .where(conditions.join(" AND "), parameters)
        .orderBy("shop.shopOrder", "ASC")
        .skip((page - 1) * size)
        .take(size)
        .getMany()
        .then((result) => {
            return {
                data: result,
                page,
                size,
            };
        })
    }

export function readPartition() {
    return partitionRepository
        .createQueryBuilder()
        .getMany()
        .then((result) => {
            return {
                data: result
            };
        })
}

export async function createShop(data) {
    const existingShop = await shopRepository.createQueryBuilder()
        .where("shop.shopName = :shopName", { shopName: data.shopName })
        .andWhere("shop.shopCode = :shopCode", { shopCode: data.shopCode })
        .getOne()

    const maxShop = await shopRepository.createQueryBuilder()
        .select("MAX(shop.shopOrder)", "shopOrder")
        .getRawOne();

    const maxShopOrder = maxShop.shopOrder !== null ? maxShop.shopOrder : 0; 

    if (!existingShop) {
        const newMember = shopRepository.create({ ...data , shopOrder:maxShopOrder });
        await shopRepository.save(newMember);
        return newMember;
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export async function createPartition(data) {
    const existingPartition = await partitionRepository.createQueryBuilder()
        .where("partition.partitionName = :partitionName", { partitionName: data.partitionName })
        .getOne()

    if (!existingPartition) {
        const newPartition = partitionRepository.create({ ...data });
        await partitionRepository.save(newPartition);
        return newPartition;
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export async function updateShop(shopId, data) {
    const existingShop = await shopRepository.createQueryBuilder()
    .where("shop.shopName = :shopName", { shopName: data.shopName })
    .orWhere("shop.shopCode = :shopCode", { shopCode: data.shopCode })
    .getOne()

    if (!existingShop) {
        return shopRepository
        .createQueryBuilder()
        .update(Shop)
        .set({ ...data })
        .where("shop.shopId = :shopId", { shopId })
        .execute()
    } else {
        return {
            msg: "已存在重複的店舖",
            success: false
        };
    }
}

export function deleteShop(shopId) {
    return shopRepository
        .createQueryBuilder()
        .delete()
        .from(Shop)
        .where("shop.shopId = :shopId", { shopId })
        .execute()
}

export function deletePartition(id) {
    return partitionRepository
        .createQueryBuilder()
        .delete()
        .from(Partition)
        .where("id = :id", { id })
        .execute()
}

// export function deleteShopPartition(id) {
//     return partitionRepository
//         .createQueryBuilder()
//         .delete()
//         .from(Partition)
//         .where("id = :id", { id })
//         .execute()
// }

export function readBindProduct(options) {
    return shopProductRepository
    .createQueryBuilder()
    .where("shopId = :shopId", options)
    .getMany()
}

// function bindProductTOShop(productList) {
//     return customQuery(`INSERT IGNORE INTO shop_product_info (id,shopId, productId ,createDate,updateDate) VALUES ? `, [productList])
// }

// function setShopOrder(shopList) {
//     let shopOrder = ''
//     let updateDate = ''
//     let ids = []
//     const currentTime = getCurrentTime()
//     shopList.forEach(item => {
//         ids.push(item.shopId)
//         updateDate += `WHEN "${item.shopId}" THEN "${currentTime}" \n`
//         shopOrder += `WHEN "${item.shopId}" THEN ${Number(item.shopOrder)} \n`
//     })
//     return customQuery(`UPDATE shop_info SET
//             shopOrder=CASE shopId
//             ${shopOrder} END,
//             updateDate=CASE shopId
//             ${updateDate} END
//             WHERE shopId IN (?)`, [ids])
// }