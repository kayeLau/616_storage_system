import request from '@/utils/request'

export function getShopList(data){
    return request({
        url: '/shops/getShopList',
        method: 'post',
        data,
      });
}

export function getPartitionList(data){
    return request({
        url: '/shops/getPartitionList',
        method: 'post',
        data,
      });
}

export function createShop(data){
  return request({
      url: '/shops/createShop',
      method: 'post',
      data,
    });
}

export function updateShop(data){
  return request({
      url: '/shops/updateShop',
      method: 'post',
      data,
    });
}

export function deleteShop(data){
  return request({
      url: '/shops/deleteShop',
      method: 'post',
      data,
    });
}

export function getBindProductList(data){
  return request({
      url: '/shops/getBindProductList',
      method: 'post',
      data,
    });
}

export function bindProductToShop(data){
  return request({
      url: '/shops/bindProductToShop',
      method: 'post',
      data,
    });
}