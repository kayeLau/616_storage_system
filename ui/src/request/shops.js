import request from '@/utils/request'

export function readShop(data){
    return request({
        url: '/shop/readShop',
        method: 'post',
        data,
      });
}

export function readPartition(data){
    return request({
        url: '/shop/readPartition',
        method: 'post',
        data,
      });
}

export function createShop(data){
  return request({
      url: '/shop/createShop',
      method: 'post',
      data,
    });

}
export function createPartition(data){
  return request({
      url: '/shop/createPartition',
      method: 'post',
      data,
    });
}

export function updateShop(data){
  return request({
      url: '/shop/updateShop',
      method: 'post',
      data,
    });
}

export function deleteShop(data){
  return request({
      url: '/shop/deleteShop',
      method: 'post',
      data,
    });
}

export function deletePartition(data){
  return request({
      url: '/shop/deletePartition',
      method: 'post',
      data,
    });
}

export function readBindProduct(data){
  return request({
      url: '/shops/readBindProduct',
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

export function setShopOrder(data){
  return request({
      url: '/shops/setShopOrder',
      method: 'post',
      data,
    });
}