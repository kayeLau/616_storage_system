import request from '@/utils/request'

export function readProduct(data){
    return request({
        url: '/product/readProduct',
        method: 'post',
        data,
      });
}

export function createProduct(data){
  return request({
      url: '/product/createProduct',
      method: 'post',
      data,
    });
}

export function updateProduct(data){
  return request({
      url: '/product/updateProduct',
      method: 'post',
      data,
    });
}

export function deleteProduct(data){
  return request({
      url: '/product/deleteProduct',
      method: 'post',
      data,
    });
}