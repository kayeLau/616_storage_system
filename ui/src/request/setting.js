import request from '@/utils/request'

export function readSetting(data){
    return request({
        url: '/setting/read',
        method: 'post',
        data,
      });
}

export function updateSetting(data){
  return request({
      url: '/setting/update',
      method: 'post',
      data,
    });
}