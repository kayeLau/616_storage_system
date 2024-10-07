import AppDataSource from '../data-source';
import { Product } from '../entity/Product';
import { ShopProduct } from '../entity/ShopProduct';
import { optionsGenerater } from './base_model';
const productRepository = AppDataSource.getRepository(Product);
const shopProductRepository = AppDataSource.getRepository(ShopProduct);

export async function readProduct(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "product")
    return productRepository
    .createQueryBuilder()
    .where(conditions.join(" AND "), parameters)
    .orderBy("product.productCode", "ASC")
    .skip((page - 1) * size)
    .take(size)
    .getMany()
    .then((result) => {
        return {
            success:true,
            data: result,
            page,
            size,
        };
    })
}

export async function readBandProduct(options){
    return shopProductRepository
    .createQueryBuilder()
    .where("shopProduct.shopId = :shopId",{ shopId:options.shopId })
    .getMany()
    .then((result) => {
        return result.map(item => Number(item.productId))
    })
}

export async function createProduct(data) {
    const existingProduct = await productRepository.createQueryBuilder()
        .where("product.productCode = :productCode", { productCode: data.productCode })
        .getOne()

    if (!existingProduct) {
        const newProduct = productRepository.create({ ...data });
        await productRepository.save(newProduct);
        return { ...newProduct, success: true };
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export function updateProduct(productId, data) {
        return productRepository
        .createQueryBuilder()
        .update(Product)
        .set({ ...data })
        .where("product.productId = :productId", { productId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function deleteProduct(productId) {
    return productRepository
    .createQueryBuilder()
    .delete()
    .from(Product)
    .where("product.productId = :productId", { productId })
    .execute()
    .then(() => { return { success: true } })
    .catch((err) => { 
        return Promise.reject({ success: false, message: err.message })
    })
}