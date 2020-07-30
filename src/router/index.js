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
/* import Layout from '@/views/CommonMain' */
/* import Layout from '@/Layout/components/CommonMain'
import home from '@/views/user/index.vue'
import role from '@/views/role/index.vue'
import menu from '@/views/menu/index.vue'
import student from '@/views/Student.vue' */

Vue.use(VueRouter)

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {visitable:false},
  },
  /* {
    path: '/manage',
    component: Layout,
    meta: {visitable:true,title:"首页",icon:"el-icon-menu"},
    children: [
      {
        path: '/home',
        name: 'home',
        component: home,
        meta: {visitable:true,title:"用户管理",icon:"el-icon-user"},
      },
      {
        path: '/role',
        name: 'role',
        component: role,
        meta: {visitable:true,title:"角色管理",icon:"el-icon-s-custom"},
      },
      {
        path: '/menu',
        name: 'menu',
        component: menu,
        meta: {visitable:true,title:"菜单管理",icon:"el-icon-folder-add"},
      },
    ]
  },
  {
    path: '/studentManage',
    component: Layout,
    meta: {visitable:true,title:"学生页面",icon:"el-icon-user"},
    children:[{
      path: '/student',
      name: 'student',
      component: student,
      meta: {visitable:true,title:"学生主页",icon:"el-icon-user"},
    }]
  } */
]

/* export const asyncRoutes = [
  {
    path: '/main',
    component: main,
    children: [
      {
        path: '/home',
        name: 'home',
        component: home
      },
      {
        path: '/role',
        name: 'role',
        component: role
      },
      {
        path: '/menu',
        name: 'menu',
        component: menu
      },
      {
        path: '/student',
        name: 'student',
        component: student
      }
    ]
  }
] */

const router = new VueRouter({
  routes,
})

export default router