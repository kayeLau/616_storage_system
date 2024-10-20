import request from '@/utils/request'

export function readOrder(data){
    return request({
        url: '/order/readOrder',
        method: 'post',
        data,
      });
}

export function readOrderDetail(data){
    return request({
        url: '/order/readOrderDetail',
        method: 'post',
        data,
      });
}

export function createOrder(data){
  return request({
      url: '/order/createOrder',
      method: 'post',
      data,
    });
}

export function createAdditionOrder(data){
  return request({
      url: '/order/createAdditionOrder',
      method: 'post',
      data,
    });
}

export function checkOrderRepeated(data){
  return request({
      url: '/order/checkOrderRepeated',
      method: 'post',
      data,
    });
}

export function updateAssignQuantity(data){
  return request({
      url: '/order/updateAssignQuantity',
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

export function exportDailyMeetSummary(data){
  return request({
      url: '/order/exportDailyMeetSummary',
      method: 'post',
      data,
    });
}

export function getDailyOrderStatus(data){
  return request({
      url: '/order/getDailyOrderStatus',
      method: 'post',
      data,
    });
}

export function readHistoryOrder(data){
  return request({
      url: '/order/readHistoryOrder',
      method: 'post',
      data,
    });
}