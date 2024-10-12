import request from '@/utils/request'

export function readSetting(data){
    return request({
        url: '/setting/readSetting',
        method: 'post',
        data,
      });
}

export function readAllSetting(data){
    return request({
        url: '/setting/readAllSetting',
        method: 'post',
        data,
      });
}

export function updateSetting(data){
  return request({
      url: '/setting/updateSetting',
      method: 'post',
      data,
    });
}