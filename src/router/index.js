import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/Login.vue'
import main from '@/views/Main.vue'
import home from '@/views/Home.vue'
import role from '@/views/Role.vue'
import menu from '@/views/Menu.vue'
import student from '@/views/Student.vue'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
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
]

const asyncRoutes = [
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
]

const router = new VueRouter({
  routes,
  asyncRoutes
})

export default router