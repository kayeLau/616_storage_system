import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'
import { ElMessage  } from 'element-plus'


const service = axios.create({
    baseURL: "/616/api", // api 的 base_url
    timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
            // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            config.headers['token'] = getToken()
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
      const res = response.data ? response.data : response
      if (!res.success || res.success === false) {
        const msg = '登录失效，请重新登录！'
        if (res.msg === "token verify fail") {
          ElMessage ({ type: 'error', message: msg })
          setTimeout(() => {
            removeToken()
            location.reload()
          },1000);
          return Promise.reject('error')
        }
      } 
      return res
    },
    error => {
      console.log('err' + error)// for debug
      return Promise.reject(error)
    }
  )
  
  export default service

