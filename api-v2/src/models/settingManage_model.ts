import AppDataSource from '../data-source';
import { Setting } from '../entity/Setting';

export function updateSetting(data) {
    return AppDataSource.getRepository(Setting)
        .createQueryBuilder('setting')
        .update(Setting)
        .set({ name: data.name, value: data.value })
        .where("setting.name = :name", { name: data.name })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

export function readSetting(options) {
    return AppDataSource.getRepository(Setting)
        .createQueryBuilder('setting')
        .where("setting.name = :name", { name: options.name })
        .getOne()
        .then(result => {
            return {
                data: result,
                success: true
            }
        })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}

export function readAllSetting() {
    return AppDataSource.getRepository(Setting)
        .createQueryBuilder('setting')
        .getMany()
        .then(result => {
            return {
                data: result,
                success: true
            }
        })
        .catch((err) => {
            return Promise.reject({ success: false, message: err.message })
        })
}