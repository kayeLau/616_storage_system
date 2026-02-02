import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '../layout/index.vue'
import { getToken } from '@/utils/auth'
import { useMenuAuth } from '@/hooks/useAuth';
const { generateRoutes } = useMenuAuth();
let isAdded = false

const routes = [
  {
    path: '/appFood',
    name: 'appFood',
    component: () => import('../views/appFood.vue')
  },
  {
    path: '/appOrderDetail/:orderCode',
    name: 'appOrderDetail',
    component: () => import('../views/Order/appOrderDetail.vue')
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('../views/Shop.vue')
  },
  {
    path: '/product',
    name: 'product',
    component: () => import('../views/Product.vue')
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('../views/Menu/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/User.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Setting/index.vue')
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('../views/Data.vue')
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('../views/Inventory.vue')
  },
]

const baseRouters = {
  history: createWebHashHistory(),
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/',
      name: 'root',
      component: layout,
      redirect: '/order',
      children: [
        {
          path: '/order',
          name: 'order',
          component: () => import('../views/Order/index.vue')
        }
      ]
    },
  ]
}
const router = createRouter(baseRouters)

async function addDynamicRoutes() {
  const accessRoutes = await generateRoutes(routes)
  accessRoutes.forEach(route => {
    router.addRoute('root', route)
  })
  isAdded = true
}

export async function clearDynamicRoutes() {
  isAdded = false
  router.addRoute({
    path: '/',
    name: 'root',
    component: layout,
    redirect: '/order',
    children: [
      {
        path: '/order',
        name: 'order',
        component: () => import('../views/Order/index.vue')
      }
    ]
  },)
}

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (!hasToken) {
    isAdded = false
    return to.path === '/login' ? next() : next('/login')
  }

  if (to.path === '/login') {
    return next('/order')
  }

  if (!isAdded) {
    await addDynamicRoutes()
    return next({ ...to, replace: true })
  }

  if (!router.hasRoute(to.name) && to.path !== '/404') {
    return next('/404')
  }

  next()
})

export default router
