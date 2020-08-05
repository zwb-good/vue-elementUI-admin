import { login,getInfo,logout} from '@/api/user'
import {setToken,getToken,removeToken} from '@/utils/user'
import { resetRouter } from '@/router'


const state = {
  name:"",
  roles:[],
  token:getToken(),
  remeberMe:false
}

const mutations = {
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_REMEBERME: (state, remeberMe) => {
    state.remeberMe = remeberMe
  }
}

const actions = {
  login({ commit, state }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if(response.success){
          commit('SET_TOKEN', response.data)
          setToken(response.data,state.remeberMe)
        }
          resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({token:state.token}).then(response => {
        if (!response.success) {
          reject('Verification failed, please Login again.')
        }
        if (!response.data.roleList || response.data.roleList.length <= 0) {
          reject('用户没有角色权限或角色权限已过期！')
        }
        commit('SET_ROLES', response.data.roleList)
        commit('SET_NAME', response.data.name)
        resolve(response.data.roleList)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit}) {
    return new Promise((resolve, reject) => {
      logout({token:getToken()}).then((res) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
