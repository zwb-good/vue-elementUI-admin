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
    /* login(state){
       let array = [];
      data.forEach(item => {
        array.push(item.name);
      });
      const addRouters = asyncRoutes[0].children.filter(item => {
        if(array.includes(item.name)){
          return item
        }
      }) 
      window.sessionStorage.setItem("routers",this)
    }, */
    logout(){
      window.sessionStorage.removeItem('token');
    },
  },
  actions: {}
}