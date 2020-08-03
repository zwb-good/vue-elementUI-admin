import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/reset.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
import utils from '@/utils/utils.js'
import "./permission";
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs;
Vue.prototype.utils = utils;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/* router.beforeEach((to,from,next)=>{
  if(to.path == '/login' || to.path == '/index' || to.path == '/'){
    next({path:'/login'});
  }else{
    let token = qs.parse(window.sessionStorage.getItem("token"));
    if(token){
      store.commit("login",token.menuList);
      const addRouters = state.tab.routerList;
      console.log(addRouters)
      router.addRoutes(addRouters);
      console.log(888)
      next();
    }else{
      next({path:'/login'});
    }
  }
}) */

