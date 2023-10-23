import { createRouter, createWebHistory } from 'vue-router'
import layout from '../layout/default.vue'

const routes = [
  {
    path: '/shop',
    component: layout,
    children:[{
      path:'',
      name: 'Shop',
      component: () => import(/* webpackChunkName: "home" */ '../views/Shop.vue')
    }]
  },
  {
    path: '/product',
    component: layout,
    children:[{
      path:'',
      name: 'Product',
      component: () => import(/* webpackChunkName: "about" */ '../views/Product.vue')
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
    component: import(/* webpackChunkName: "user" */ '../views/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
