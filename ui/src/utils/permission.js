import router from '../router'
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'


router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if(to.path === '/login' && hasToken){
    next('/order')
    return
  }
  
  if(to.path === '/login'){
    next()
    return
  }

  if (hasToken) {
    next()
  } else {
      next('/login')
  }
})

router.afterEach(() => {})
