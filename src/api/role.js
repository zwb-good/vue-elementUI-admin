import service from '@/utils/request.js'

/**
* @description: 获取角色菜单
* @param {type} 
* @return: 
*/
export async function selectRole(data) {
  return await service.request({
    url: '/role/selectRole',
    method: 'get',
    params: data
  })
}

/**
* @description: 修改角色
* @param {type} 
* @return: 
*/
export function updateRole(data) {
  return service.request({
    url: '/role/updateRole',
    method: 'get',
    params: data
  })
}
/**
* @description: 删除角色
* @param {type} 
* @return: 
*/
export function deleteRole(data) {
  return service.request({
    url: '/role/deleteRole',
    method: 'get',
    params: data
  })
}

/**
* @description: 保存角色
* @param {type} 
* @return: 
*/
export function saveRole(data) {
    return service.request({
      url: '/role/saveRole',
      method: 'get',
      params: data
    })
  }

/**
* @description: 获取角色和菜单的联系
* @param {type} 
* @return: 
*/
export function selectRoleMenu(data) {
    return service.request({
      url: '/rolemenu/selectRoleMenu',
      method: 'get',
      params: data
    })
  }

/**
* @description: 获取角色和菜单的联系
* @param {type} 
* @return: 
*/
export function updateRoleMenu(data) {
    return service.request({
      url: '/role/updateRoleMenu',
      method: 'get',
      params: data
    })
  }