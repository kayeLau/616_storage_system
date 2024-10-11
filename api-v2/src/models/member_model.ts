import AppDataSource from '../data-source';
import { Member } from '../entity/Member';
import { optionsGenerater } from './base_model';
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
const memberRepository = AppDataSource.getRepository(Member);

export async function toRegister(data) {
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
    return memberRepository
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
    return memberRepository
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

export async function readMember(options, size, page) {
    const { conditions, parameters } = optionsGenerater(options, "member")
    const total = await memberRepository
    .createQueryBuilder("member")
    .where(conditions.join(" AND "), parameters)
    .getCount();

    return memberRepository
        .createQueryBuilder("member")
        .leftJoin("member.partition", "partition")
        .leftJoin("member.shop", "shop")
        .select([
            "member.id AS id",
            "member.name AS name",
            "member.password AS password",
            "member.auth AS auth",
            "member.shopPartition AS shopPartition",
            "member.shopId AS shopId",
            "shop.shopName AS shopName",
            "partition.partitionName AS partitionName",
            "DATE_FORMAT(member.updateDate, '%Y-%m-%d %H:%i:%S') AS updateDate"
        ])
        .where(conditions.join(" AND "), parameters)
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

// function readMember(id) {
//     return memberRepository
//         .createQueryBuilder("member")
//         .where("member.id = :id", id)
//         .getOne()
// }

export async function toLogin(memberData) {
    const targetUser = memberRepository
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
