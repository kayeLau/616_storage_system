import { createRouter, createWebHistory } from 'vue-router'
import layout from '../layout/default.vue'

const routes = [
  {
    path: '/appOrder',
    component: layout,
    children:[{
      path:'',
      name: 'appOrder',
      component: () => import(/* webpackChunkName: "app-order" */ '../views/appOrder.vue')
    }]
  },
  {
    path: '/order',
    component: layout,
    children:[{
      path:'',
      name: 'Order',
      component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
    }]
  },
  {
    path: '/shop',
    component: layout,
    children:[{
      path:'',
      name: 'Shop',
      component: () => import(/* webpackChunkName: "shop" */ '../views/Shop.vue')
    }]
  },
  {
    path: '/product',
    component: layout,
    children:[{
      path:'',
      name: 'Product',
      component: () => import(/* webpackChunkName: "product" */ '../views/Product.vue')
    }]
  },
  {
    path: '/user',
    component: layout,
    children:[{
      path:'',
      name: 'User',
      component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
    }]
  },
  {
    path: '/login',
    component: import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/',
    component: layout,
    redirect: () => {
      return { path: '/order' }
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
