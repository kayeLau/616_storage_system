import AppDataSource from '../data-source';
import { Member } from '../entity/Member';
import { optionsGenerater } from './base_model';
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');
const memberRepository = AppDataSource.getRepository(Member);

export async function toRegister(data) {
    const existingMember = await memberRepository
        .createQueryBuilder("member")
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
        .offset((page - 1) * size)
        .limit(size)
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
    try {
        const targetUser = await memberRepository
            .createQueryBuilder("member")
            .where("member.name = :name", { name: memberData.name })
            .andWhere("member.password = :password", { password: memberData.password })
            .getOne()

        if (!targetUser) {
            return {
                success: false,
                msg: "請輸入正確的帳號或密碼。"
            }
        }

        if (!memberData.isForceLogin) {
            if (targetUser.ipAddress && targetUser.ipAddress !== memberData.ip) {
                return {
                    success: false,
                    msg: "用戶" + targetUser.ipAddress + "正在使用",
                    ip: targetUser.ipAddress,
                    isUsing: true
                };
            }
        }

        const token = jwt.sign({ data: targetUser.id }, config.secret, { expiresIn: '5h' });
        await updateMember(targetUser.id, { online: 1, ipAddress: memberData.ip });
        return {
            success: true,
            token,
            userInfo: {
                name: targetUser.name,
                shopId: targetUser.shopId,
                // shopName: targetUser.shopName, // Uncomment when needed
                auth: targetUser.auth,
            },
            msg: "歡迎 " + targetUser.name + " 的登入！",
        };

    } catch (err) {
        console.error('Login error:', err);
        return {
            success: false,
            msg:err.message
        };
    }
}
