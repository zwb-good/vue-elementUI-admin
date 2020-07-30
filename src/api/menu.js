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
* @description: 获取角色菜单
* @param {type} 
* @return: 
*/
export function selectMenu(data) {
  return service.request({
    url: '/menu/selectMenu',
    method: 'get',
    params: data
  })
}

/**
* @description: 通过角色获取角色菜单
* @param {type} 
* @return: 
*/
export function getMenuListByRoles(data) {
  return service.request({
    url: '/menu/selectMenuByRoles',
    method: 'get',
    params: data
  })
}

/**
* @description: 更新菜单
* @param {type} 
* @return: 
*/
export function updateMenu(data) {
  return service.request({
    url: '/menu/updateMenu',
    method: 'get',
    params: data
  })
}

/**
* @description: 保存菜单
* @param {type} 
* @return: 
*/
export function saveMenu(data) {
  return service.request({
    url: '/menu/saveMenu',
    method: 'get',
    params: data
  })
}

/**
* @description: 保存菜单
* @param {type} 
* @return: 
*/
export function deleteMenu(data) {
  return service.request({
    url: '/menu/deleteMenu',
    method: 'get',
    params: data
  })
}

/**
* @description: 获取页面按钮权限
* @param {type} 
* @return: 
*/
export function selectButton(data) {
  return service.request({
    url: '/menu/selectButton',
    method: 'get',
    params: data
  })
}
  