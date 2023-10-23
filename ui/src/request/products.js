import request from '@/utils/request'

export function getProductList(data){
    return request({
        url: '/products/getProductList',
        method: 'post',
        data,
      });
}

export function createProduct(data){
  return request({
      url: '/products/createProduct',
      method: 'post',
      data,
    });
}

export function updateProduct(data){
  return request({
      url: '/products/updateProduct',
      method: 'post',
      data,
    });
}

export function deleteProduct(data){
  return request({
      url: '/products/deleteProduct',
      method: 'post',
      data,
    });
}