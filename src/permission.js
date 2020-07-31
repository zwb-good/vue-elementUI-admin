import router from './router'
import store from "./store";
import { getToken } from '@/utils/user' // get token from sessionStrage


const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        await store.dispatch('permission/checkOpenMenu', to.path)
        next()
      } else {
        const roles = await store.dispatch('user/getInfo')
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        router.addRoutes(accessRoutes)
        await store.dispatch('permission/checkOpenMenu', to.path)
        next({ ...to, replace: true })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({path:"/login"})
    }
  }
  
})
