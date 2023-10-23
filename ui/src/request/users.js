import request from '@/utils/request'

export function getUsersList(data){
    return request({
        url: '/users/getUsersList',
        method: 'post',
        data,
      });
}

export function login(data){
  return request({
      url: '/users/login',
      method: 'post',
      data,
    });
}

export function register(data){
  return request({
      url: '/users/register',
      method: 'post',
      data,
    });
}

export function updateUserInfo(data){
  return request({
      url: '/users/update',
      method: 'post',
      data,
    });
}