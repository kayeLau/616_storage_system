import AppDataSource from '../data-source';
import { Member } from '../entity/Member';
import { optionsGenerater } from './base_model';
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');

export async function toRegister(data) {
    const memberRepository = AppDataSource.getRepository(Member);

    const existingMember = await memberRepository
        .createQueryBuilder()
        .where("member.name = :name", { name: data.name })
        .getOne()

    if (!existingMember) {
        const newMember = memberRepository.create({ ...data });
        await memberRepository.save(newMember);
        return { ...newMember, success: true };
    } else {
        return {
            msg: "創建項已存在",
            success: false
        };
    }
}

export function updateMember(id, data) {
    return AppDataSource.getRepository(Member)
        .createQueryBuilder()
        .update(Member)
        .set({ ...data })
        .where("id = :id", { id })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function deleteMember(id) {
    return AppDataSource.getRepository(Member)
        .createQueryBuilder()
        .delete()
        .from(Member)
        .where("id = :id", { id })
        .execute()
        .then(() => { return { success: true } })
        .catch((err) => { 
            return Promise.reject({ success: false, message: err.message })
        })
}

export function readMember(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "member")
    return AppDataSource.getRepository(Member)
        .createQueryBuilder("member")
        .leftJoinAndSelect("member.partition", "partition")
        .where(conditions.join(" AND "), parameters)
        .skip((page - 1) * size)
        .take(size)
        .getMany()
        .then((result) => {
            return {
                success: true,
                data: result,
                page,
                size,
            };
        })
}

// function readMember(id) {
//     return AppDataSource.getRepository(Member)
//         .createQueryBuilder("member")
//         .where("member.id = :id", id)
//         .getOne()
// }

export async function toLogin(memberData) {
    console.log(memberData)
    const targetUser = AppDataSource.getRepository(Member)
        .createQueryBuilder("member")
        .where("member.name = :name", { name: memberData.name })
        .andWhere("member.password = :password", { password: memberData.password })
        .getOne()

    return targetUser.then(res => {
        if (!res) {
            return {
                success: false,
                msg: "請輸入正確的帳號或密碼。"
            }
        }

        if (!memberData.isForceLogin) {
            if (res.ipAddress && res.ipAddress !== memberData.ip) {
                return {
                    success: false,
                    msg: "用戶" + res.ipAddress + "正在使用",
                    ip: res.ipAddress,
                    isUsing: true
                }
            }
        }
        const token = jwt.sign({ data: res.id }, config.secret, { expiresIn: '5h' });
        updateMember(res.id, { online: 1, ipAddress: memberData.ip })
        return {
            success: true,
            token,
            userInfo: {
                name: res.name,
                shopId: res.shopId,
                // shopName: res.shopName, todo
                auth: res.auth,
            },
            msg: "歡迎 " + res.name + " 的登入！",
        }
    })
}
