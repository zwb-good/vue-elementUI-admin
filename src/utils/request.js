/*
 * @Author: your name
 * @Date: 2020-07-18 09:35:54
 * @LastEditTime: 2020-07-18 18:58:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\utils\request.js
 */ 
import axios from 'axios'
import { MessageBox,Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/user'

// create an axios instance
const service = axios.create({
  baseURL: "/devApi",
  timeout: 5000 // request timeout
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 2000) {
      if (res.code === 5001 ) {
        MessageBox.confirm('账户登录过期，请重新登录', '确认退出', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }else{
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      console.log(999)
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
);


export default service
