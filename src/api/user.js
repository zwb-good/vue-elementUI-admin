/*
 * @Author: your name
 * @Date: 2020-07-19 08:53:04
 * @LastEditTime: 2020-07-19 09:00:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\api\user.js
 */
import service from '@/utils/request.js'

/**
* @description: 登录
* @param {type} 
* @return: 
*/
export function login(data) {
  return service.request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
* @description: 根据用户id获取用户角色
* @param {type} 
* @return: 
*/
export function getInfo(data) {
  return service.request({
    url: '/user/getInfo',
    method: 'get',
    params: data
  })
}

/**
* @description: 获取用户列表
* @param {type} 
* @return: 
*/
export function getUserList(data) {
  return service.request({
    url: '/user/selectUser',
    method: 'get',
    params: data
  })
}

/**
 * @description: 获取所有角色列表
 * @param {type} 
 * @return: 
 */
export function getRoleList(data) {
  return service.request({
    url: '/role/selectRole',
    method: 'get',
    data
  })
}

/**
 * @description: 更新用户
 * @param {type} 
 * @return: 
 */
export function updateUser(data) {
  return service.request({
    url: '/user/updateUser',
    method: 'get',
    params: data
  })
}

/**
* @description: 删除用户
* @param {type} 
* @return: 
*/
export function deleteUser(data) {
  return service.request({
    url: '/user/deleteUser',
    method: 'get',
    params: data
  })
}

/**
* @description: 保存用户
* @param {type} 
* @return: 
*/
export function saveUser(data) {
  return service.request({
    url: '/user/saveUser',
    method: 'get',
    params: data
  })
}

/**
* @description: 根据用户id获取用户角色
* @param {type} 
* @return: 
*/
export function selectRoleByUserId(data) {
  return service.request({
    url: '/user/selectRoleByUserId',
    method: 'get',
    params: data
  })
}

/**
* @description: 根据用户id获取用户角色
* @param {type} 
* @return: 
*/
export function updateUserRole(data) {
  return service.request({
    url: '/user/updateUserRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: data
  })
}

export function logout(data) {
  return service.request({
    url: '/user/logout',
    method: 'get',
    params:data
  })
}
