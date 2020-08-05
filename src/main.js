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

