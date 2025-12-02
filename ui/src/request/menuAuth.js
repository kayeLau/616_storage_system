import request from '@/utils/request'

export function readMenuAuth(data){
    return request({
        url: '/menuAuth/readMenuAuth',
        method: 'post',
        data,
      });
}