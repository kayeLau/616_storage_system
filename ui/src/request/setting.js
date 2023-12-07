import request from '@/utils/request'

export function getSettingList(data){
    return request({
        url: '/setting/getSettingList',
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