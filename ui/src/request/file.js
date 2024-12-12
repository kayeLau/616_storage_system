import request from '@/utils/request'

export function readLogsName(data) {
    return request({
      url: '/file/readLogsName',
      method: 'post',
      data,
    });
  }
  
  export function downloadLog(data) {
    return request({
      url: '/file/downloadLog',
      method: 'post',
      data,
    });
  }