import request from '@/utils/request'

export function readApi(data){
  return request({
      url: '/api/readApi',
      method: 'post',
      data,
    });
}

export function updateApi(data){
return request({
    url: '/api/updateApi',
    method: 'post',
    data,
  });
}

export function createApi(data){
return request({
    url: '/api/createApi',
    method: 'post',
    data,
  });
}