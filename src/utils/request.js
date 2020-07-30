/*
 * @Author: your name
 * @Date: 2020-07-18 09:35:54
 * @LastEditTime: 2020-07-18 18:58:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\utils\request.js
 */ 
import axios from 'axios'
//import { MessageBox, Message } from 'element-ui'
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

/* // 添加响应拦截器
axios.interceptors.response.use(
  response => {
    const res = checkStatus(response).data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
);

const checkStatus = (response) => {
  let {status: httpStatus, data: {msg, success, total,rows}} = response
  let httpStatusList = [200, 304, 400]
  let httpMsg
  switch (httpStatus) {
      case 400:
          httpMsg = '错误请求'
          break;
      case 401:
          httpMsg = '未授权，请重新登录'
          break;
      case 403:
          httpMsg = '拒绝访问'
          break;
      case 404:
          httpMsg = '请求错误,未找到该资源'
          break;
      case 405:
          httpMsg = '请求方法未允许'
          break;
      case 408:
          httpMsg = '请求超时'
          break;
      case 500:
          httpMsg = msg || '服务器端出错'
          break;
      case 501:
          httpMsg = '网络未实现'
          break;
      case 502:
          httpMsg = '网络错误'
          break;
      case 503:
          httpMsg = '服务不可用'
          break;
      case 504:
          httpMsg = '网络超时'
          break;
      case 505:
          httpMsg = 'http版本不支持该请求'
          break;
      default:
          httpMsg = `连接错误${httpStatus}`
  }
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && httpStatusList.includes(httpStatus)) {
      return {httpStatus, data:{msg, success,total,rows}}
  }
  // 异常状态下，把错误信息返回去
  return {
      httpStatus,
      data:{msg:httpMsg, success,total,rows}
  }
} */

export default service
