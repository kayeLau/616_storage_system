import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '../layout/index.vue'

const routes = [
  {
    path: '/appFood',
    component: layout,
    children:[{
      path:'',
      name: 'appFood',
      component: () => import('../views/appFood.vue')
    }]
  },
  {
    path: '/order',
    component: layout,
    children:[{
      path:'',
      name: 'Order',
      component: () => import('../views/Order/index.vue')
    }]
  },
  {
    path: '/appOrderDetail/:orderCode',
    component: layout,
    children:[{
      path:'',
      name: 'appOrderDetail',
      component: () => import('../views/Order/appOrderDetail.vue')
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
    path: '/menu',
    component: layout,
    children:[{
      path:'',
      name: 'menu',
      component: () => import('../views/Menu/index.vue')
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
      component: () => import('../views/Setting/index.vue')
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
    path: '/appInventory',
    component: layout,
    children:[{
      path:'',
      name: 'appInventory',
      component: () => import('../views/appInventory.vue')
    }]
  },
  {
    path: '/inventory',
    component: layout,
    children:[{
      path:'',
      name: 'Inventory',
      component: () => import('../views/Inventory.vue')
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
