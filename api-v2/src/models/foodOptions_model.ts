import AppDataSource from '../data-source';
import { FoodOptions } from '../entity/FoodOptions';
import { optionsGenerater } from './base_model';
const foodOptionsRepository = AppDataSource.getRepository(FoodOptions);

export async function readFoodOptions(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "foodOptions")
    const total = await foodOptionsRepository
    .createQueryBuilder("foodOptions")
    .where(conditions.join(" AND "), parameters)
    .getCount();

    return foodOptionsRepository
    .createQueryBuilder("foodOptions")
    .select([
        "foodOptions.foodOptionsId AS foodOptionsId",
        "foodOptions.foodOptionsCode AS foodOptionsCode",
        "foodOptions.department AS department",
        "foodOptions.freezersNum AS freezersNum",
        "foodOptions.classify AS classify",
        "foodOptions.foodOptionsName AS foodOptionsName",
        "foodOptions.unit AS unit",
        "foodOptions.standard AS standard",
        "foodOptions.disable AS disable",
        "foodOptions.summary AS summary",
        "foodOptions.prompt AS prompt",
        "DATE_FORMAT(foodOptions.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
    ])
    .where(conditions.join(" AND "), parameters)
    .orderBy("foodOptions.foodOptionsCode", "ASC")
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

export async function createFoodOptions(data) {
    const existingFoodOptions = await foodOptionsRepository.createQueryBuilder("foodOptions")
        .where("foodOptions.foodOptionsCode = :foodOptionsCode", { foodOptionsCode: data.foodOptionsCode })
        .getOne()

    if (!existingFoodOptions) {
        const newFoodOptions = foodOptionsRepository.create({ ...data });
        await foodOptionsRepository.save(newFoodOptions);
        return { ...newFoodOptions, success: true };
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export function updateFoodOptions(foodOptionsId, data) {
        return foodOptionsRepository
        .createQueryBuilder()
        .update(FoodOptions)
        .set({ ...data })
        .where("foodOptions.foodOptionsId = :foodOptionsId", { foodOptionsId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function deleteFoodOptions(foodOptionsId) {
    return foodOptionsRepository
    .createQueryBuilder()
    .delete()
    .from(FoodOptions)
    .where("foodOptions.foodOptionsId = :foodOptionsId", { foodOptionsId })
    .execute()
    .then(() => { return { success: true } })
    .catch((err) => { 
        return Promise.reject({ success: false, message: err.message })
    })
}