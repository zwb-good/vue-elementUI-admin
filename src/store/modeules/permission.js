import { getMenuListByRoles,selectButton } from "@/api/menu";
import AppMain from "@/views/CommonMain";
import { routes } from '@/router'
import store from "..";

/**
 * 过滤路由
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRouter(menuList) {
  // 遍历后台传来的路由字符串，转换为组件对象
  let accessedRouters = menuList.filter(router => {
    if (router.component === "main") {
      // Main组件特殊处理
      router.component = AppMain;
    }
    else {
      //处理组件---重点
      router.component = loadView(router.component);
    }
    //存在子集
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children);
    }
    return true;
  });
  return accessedRouters;
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

const state = {
  addRoutes:[],
  routes: [],
  openMenu:"",
  buttonList:[]
}

const mutations = {
  SET_ROUTES: (state, addRoutes) => {
    routes.forEach(item => {
      if(item.path === "/dashboard"){
        item.children = item.children.concat(addRoutes);
        state.addRoutes = item.children
      }
    });
    state.routes = routes;
  },
  SET_OPENMENU: (state, openMenu) => {
    state.openMenu = openMenu
  },
  SET_BUTTONLIST: (state, buttonList) => {
    state.buttonList = buttonList
  },
  SET_ADDROUTES: (state,addRoutes) => {
    state.addRoutes = addRoutes
  }
}

const actions = {
  generateRoutes({ commit}, roles) {
    return new Promise((resolve) => {
      let roleIds = roles.map(item => {
        return item.id;
      });
      getMenuListByRoles({roleIds: roleIds.join(",")}).then(response => {
        const accessedRoutes = filterAsyncRouter(response.data)
        commit("SET_ROUTES",accessedRoutes);
        resolve(accessedRoutes)
      })
    })
  },

  checkOpenMenu({ commit}, path) {
    return new Promise((resolve) => {
      let roleIds = store.getters.roles.map(item => {
        return item.id;
      });
      selectButton({roleIds: roleIds.join(","),path:path}).then(response => {
        let buttonList = response.data.map(item => {
          return item.mark;
        });
        commit("SET_OPENMENU",path);
        commit("SET_BUTTONLIST",buttonList);
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
