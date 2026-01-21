import AppDataSource from '../data-source';
import { Shop } from '../entity/Shop';
import { Partition } from '../entity/Partition';
import { ShopProduct } from '../entity/ShopProduct';
import { optionsGenerater } from './common/base_model';
const shopRepository = AppDataSource.getRepository(Shop);
const partitionRepository = AppDataSource.getRepository(Partition);
const shopProductRepository = AppDataSource.getRepository(ShopProduct);

export async function readShop(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "shop")
    const total = await shopRepository
    .createQueryBuilder("shop")
    .where(conditions.join(" AND "), parameters)
    .getCount();

    return shopRepository
        .createQueryBuilder('shop')
        .select([
            "shop.shopId AS shopId",
            "shop.shopCode AS shopCode",
            "shop.shopName AS shopName",
            "shop.shopType AS shopType",
            "shop.shopOrder AS shopOrder",
            "shop.productCount AS productCount",
            "shop.shopPartition AS shopPartition",
            "DATE_FORMAT(shop.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
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

export function readPartition() {
    return partitionRepository
        .createQueryBuilder("partition")
        .getMany()
        .then((result) => {
            return { success: true, data: result };
        })
}

export async function createShop(data) {
    const existingShop = await shopRepository.createQueryBuilder("shop")
        .where("shop.shopName = :shopName", { shopName: data.shopName })
        .andWhere("shop.shopCode = :shopCode", { shopCode: data.shopCode })
        .getOne()

    const maxShop = await shopRepository.createQueryBuilder("shop")
        .select("MAX(shop.shopOrder)", "shopOrder")
        .getRawOne();

    const maxShopOrder = maxShop.shopOrder !== null ? maxShop.shopOrder++ : 0;

    if (!existingShop) {
        const newShop = shopRepository.create({ ...data, shopOrder: maxShopOrder });
        await shopRepository.save(newShop);
        return { ...newShop, success: true };
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export async function createPartition(data) {
    const existingPartition = await partitionRepository.createQueryBuilder("partition")
        .where("partition.partitionName = :partitionName", { partitionName: data.partitionName })
        .getOne()

    if (!existingPartition) {
        const newPartition = partitionRepository.create({ ...data });
        await partitionRepository.save(newPartition);
        return { ...newPartition, success: true };
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export async function updateShop(shopId, data) {
    return shopRepository
    .createQueryBuilder()
    .update(Shop)
    .set({ ...data })
    .where("shop.shopId = :shopId", { shopId })
    .execute()
    .then((result) => {
        return { success: true, data: result };
    })
    .catch((err) => { 
        return Promise.reject({ success: false, message: err.message })
    })
}

export function deleteShop(shopId) {
    return shopRepository
        .createQueryBuilder()
        .delete()
        .from(Shop)
        .where("shop.shopId = :shopId", { shopId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function deletePartition(id) {
    return partitionRepository
        .createQueryBuilder()
        .delete()
        .from(Partition)
        .where("id = :id", { id })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function readBindProduct(options) {
    return shopProductRepository
        .createQueryBuilder("shop")
        .where("shop.shopId = :shopId", options)
        .getMany()
        .then((result) => {
            return { success: true, data: result };
        })
}

export async function bindProductTOShop(shopId, productList) {
    await deleteShopPartition(shopId)
    return shopProductRepository
        .createQueryBuilder()
        .insert()
        .into(ShopProduct)
        .values(productList)
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

async function deleteShopPartition(shopId) {
    return shopProductRepository
        .createQueryBuilder()
        .delete()
        .from(ShopProduct)
        .where("shopId = :shopId", { shopId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export async function setShopOrder(shopList) {
    return shopRepository
        .createQueryBuilder()
        .update(Shop)
        .set({
            shopOrder: () => "CASE shopId " +
                shopList.map(shop => `WHEN '${shop.shopId}' THEN ${shop.shopOrder}`).join(' ') +
                " END"
        })
        .whereInIds(shopList.map(shop => shop.shopId))
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}