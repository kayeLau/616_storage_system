import request from '@/utils/request'

export function readMember(data){
    return request({
        url: '/member/readMember',
        method: 'post',
        data,
      });
}

export function login(data){
  return request({
      url: '/member/login',
      method: 'post',
      data,
    });
}

export function logout(data){
  return request({
      url: '/member/logout',
      method: 'post',
      data,
    });
}

export function register(data){
  return request({
      url: '/member/register',
      method: 'post',
      data,
    });
}

export function updateMember(data){
  return request({
      url: '/member/updateMember',
      method: 'post',
      data,
    });
}

export function deleteMember(data){
  return request({
      url: '/user/deleteMember',
      method: 'post',
      data,
    });
}