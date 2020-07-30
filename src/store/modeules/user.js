import { login,getInfo} from '@/api/user'
import {setToken,getToken} from '@/utils/user'


const state = {
  name:"",
  roles:"",
  token:getToken(),
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
  }
}

const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        if(data.success){
          commit('SET_TOKEN', data.rows[0].token)
          setToken(data.rows[0].token)
        }
          resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({token:state.token}).then(response => {
        const { data } = response
        if (!data.success) {
          reject('Verification failed, please Login again.')
        }
        if (!data.rows[0].roleList || data.rows[0].roleList.length <= 0) {
          reject('用户没有角色权限或角色权限已过期！')
        }
        commit('SET_ROLES', data.rows[0].roleList)
        commit('SET_NAME', data.rows[0].name)
        resolve(data.rows[0].roleList)
      }).catch(error => {
        reject(error)
      })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
