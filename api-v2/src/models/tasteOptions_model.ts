import AppDataSource from '../data-source';
import { TasteOptions } from '../entity/TasteOptions';
import { optionsGenerater } from './base_model';
const tasteOptionsRepository = AppDataSource.getRepository(TasteOptions);

export async function readTasteOptions(options) {
    const { conditions, parameters } = optionsGenerater(options, "tasteOptions")

    return tasteOptionsRepository
        .createQueryBuilder("tasteOptions")
        .select([
            "tasteOptions.id AS id",
            "tasteOptions.disable AS disable",
            "tasteOptions.flag AS flag",
            "tasteOptions.title AS title",
            "tasteOptions.label AS label",
            "tasteOptions.value AS value",
            "DATE_FORMAT(tasteOptions.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
        ])
        .where(conditions.join(" AND "), parameters)
        .groupBy('tasteOptions.flag')
        .getRawMany()
        .then((result) => {
            return {
                success: true,
                data: result
            };
        })
}

export async function createTasteOptions(data) {
    if (!data.flag) {
        const newFlag = tasteOptionsRepository.createQueryBuilder("tasteOptions")
            .select('MAX(tasteOptions.flag)', 'flag')
            .getOne()
        data.flag = newFlag
    } else {
        const existingTasteOptions = await tasteOptionsRepository.createQueryBuilder("tasteOptions")
            .where("tasteOptions.flag = :flag", { flag: data.flag })
            .getOne()
        if(!existingTasteOptions) return { success: false }
    }

    const newTasteOptions = tasteOptionsRepository.create({ ...data });
    await tasteOptionsRepository.save(newTasteOptions);
    return { ...newTasteOptions, success: true };
}

export function updateTasteOptions(tasteOptionsId, data) {
    return tasteOptionsRepository
        .createQueryBuilder()
        .update(TasteOptions)
        .set({ ...data })
        .where("tasteOptions.tasteOptionsId = :tasteOptionsId", { tasteOptionsId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

export function deleteTasteOptions(tasteOptionsId) {
    return tasteOptionsRepository
        .createQueryBuilder()
        .delete()
        .from(TasteOptions)
        .where("tasteOptions.tasteOptionsId = :tasteOptionsId", { tasteOptionsId })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}