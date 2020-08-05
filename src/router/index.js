/*
 * @Author: your name
 * @Date: 2020-06-17 22:12:31
 * @LastEditTime: 2020-07-18 19:36:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\router\index.js
 */ 
import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login/index.vue'
import index from '@/views/index.vue'
import Layout from '@/views/CommonMain'

Vue.use(VueRouter)

//解决重复点击路由报错
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {visitable:false},
  },
  { 
    path: "/dashboard",
    redirect: 'index',
    component: Layout,
    icon: "el-icon-user",
    children: [
      {
        path: '/index',
        name: 'index',
        component: index,
        title: "首页",
        icon: "el-icon-user",
      }
    ]
  },
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router