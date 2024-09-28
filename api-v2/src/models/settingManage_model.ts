// const { updateItem, getItems } = require('./base_model')
import AppDataSource from '../data-source';
import { Setting } from '../entity/Setting';

export function updateSetting(data) {
    return AppDataSource.getRepository(Setting)
        .createQueryBuilder()
        .update(Setting)
        .set({ name: data.name, value: data.value })
        .where("id = :id", { id: data.id })
        .execute()
}

export function readSetting(options) {
    return AppDataSource.getRepository(Setting)
        .createQueryBuilder('setting')
        .where("setting.name = :name", options)
        .getOne()
}