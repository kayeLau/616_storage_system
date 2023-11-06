import request from '@/utils/request'

export function getOrderList(data){
    return request({
        url: '/orders/getOrderList',
        method: 'post',
        data,
      });
}

export function createOrder(data){
  return request({
      url: '/orders/createOrder',
      method: 'post',
      data,
    });
}

export function updateOrder(data){
  return request({
      url: '/orders/updateOrder',
      method: 'post',
      data,
    });
}

export function deleteOrder(data){
  return request({
      url: '/orders/deleteOrder',
      method: 'post',
      data,
    });
}