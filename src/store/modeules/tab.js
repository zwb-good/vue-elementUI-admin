//import {asyncRoutes} from "@/router"
export default {
  state: {
    isCollapse: false,
    menu: [],
    routerList: [],
    currentMenu: {},
  },
  mutations: {
    // 定义方法
    selectMenu(state, val) {
      if (val.name !== 'home') {
          state.currentMenu = val
      } else {
          state.currentMenu = null
      }
    },
    // tag方法
    closeTab(state, val) {
      let result = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(result, 1)
    },
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    },
    logout(){
      window.sessionStorage.removeItem('token');
    },
  },
  actions: {}
}