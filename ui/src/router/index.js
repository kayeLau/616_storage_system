import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '../layout/default.vue'

const routes = [
  {
    path: '/appOrder',
    component: layout,
    children:[{
      path:'',
      name: 'appOrder',
      component: () => import('../views/appOrder.vue')
    }]
  },
  {
    path: '/order',
    component: layout,
    children:[{
      path:'',
      name: 'Order',
      component: () => import('../views/Order.vue')
    }]
  },
  {
    path: '/shop',
    component: layout,
    children:[{
      path:'',
      name: 'Shop',
      component: () => import('../views/Shop.vue')
    }]
  },
  {
    path: '/product',
    component: layout,
    children:[{
      path:'',
      name: 'Product',
      component: () => import('../views/Product.vue')
    }]
  },
  {
    path: '/user',
    component: layout,
    children:[{
      path:'',
      name: 'User',
      component: () => import('../views/User.vue')
    }]
  },
  {
    path: '/setting',
    component: layout,
    children:[{
      path:'',
      name: 'Setting',
      component: () => import('../views/Setting.vue')
    }]
  },
  {
    path: '/data',
    component: layout,
    children:[{
      path:'',
      name: 'Data',
      component: () => import('../views/Data.vue')
    }]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: layout,
    redirect: () => {
      return { path: '/login' }
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
