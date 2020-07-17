export default {
  message: function (_this, title, time) {
    _this.$notify({
      title: '操作信息',
      message: title,
      duration: time,
      position: 'bottom-right'
    });
  },
  addArry(oldArry, newArry) {
    return newArry.filter(i => {
      return oldArry.indexOf(i) === -1
    })
  },
  deleteArry(oldArry, newArry) {
    return oldArry.filter(i => {
      return newArry.indexOf(i) === -1
    })
  },
  buildMenuTree(menuList, pid) {
    let treeList = []
    menuList.forEach(menu => {
      if (pid == menu.parentId) {
        menu.children = this.buildMenuTree(menuList, menu.id);
        treeList.push(menu);
      }
    });
    return treeList;
  },
  treeFindPath (tree, func, path = []) {
    if (!tree) return []
    for (const data of tree) {
      path.push(data.id)
      if (func(data)) return path
      if (data.children) {
        const findChildren = this.treeFindPath(data.children, func, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  }
}