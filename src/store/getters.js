const getters = {
  roles: state => state.user.roles,
  name: state => state.user.name,
  token: state => state.user.token,
  addRoutes: state => state.permission.addRoutes,
  permission_routes: state => state.permission.routes,
  openMenu: state => state.permission.openMenu,
}
export default getters
