import router from '../router'
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'


router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    next()
    return
  }

  if (getToken()) {
    next()
  } else {
      next('/login')
  }
})

router.afterEach(() => {})
