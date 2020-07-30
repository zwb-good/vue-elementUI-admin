import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import tab from '@/store/modeules/tab'
import permission from '@/store/modeules/permission'
import user from '@/store/modeules/user'

Vue.use(Vuex)


export default new Vuex.Store({
  getters,
  modules:{
    tab,
    permission,
    user
  }
})
