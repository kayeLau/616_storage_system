import AppDataSource from '../data-source';
import { Member } from '../entity/Member';

export function loginCheck(data) {
    const memberRepository = AppDataSource.getRepository(Member);
    return memberRepository
        .createQueryBuilder('member')
        .where("member.name = :name AND member.password = :password", data)
        .getOne()
}