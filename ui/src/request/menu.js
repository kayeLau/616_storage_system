import request from '@/utils/request'

export function readMenu(data){
    return request({
        url: '/menu/readMenu',
        method: 'post',
        data,
      });
}

export function createMenu(data){
  return request({
      url: '/menu/createMenu',
      method: 'post',
      data,
    });
}

export function updateMenu(data){
  return request({
      url: '/menu/updateMenu',
      method: 'post',
      data,
    });
}

export function readTasteOptions(data){
  return request({
      url: '/menu/readTasteOptions',
      method: 'post',
      data,
    });
}

export function createTasteOptions(data){
  return request({
      url: '/menu/createTasteOptions',
      method: 'post',
      data,
    });
}
