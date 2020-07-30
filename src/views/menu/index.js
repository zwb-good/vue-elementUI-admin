/* 表格头定义 */
export const tableHeader_menu = [
  { prop: "title", label: "菜单名称", width: "120" },
  { prop: "parentTitle", label: "上级菜单", width: "120" },
  { prop: "type", label: "菜单类型", width: "100", render: (h, params) => {
    let typeName = params.row.type;
    switch(params.row.type){
      case 1: typeName = "目录"; break
      case 2: typeName = "菜单"; break
      case 3: typeName = "功能"; break
      default: typeName = params.row.type
    }
    return h('span',{},typeName)
    } },
  { prop: "mark", label: "菜单标识", width: "80" },
  { prop: "name", label: "路由地址", width: "100" },
  { prop: "path", label: "跳转地址", width: "100" },
  { prop: "component", label: "菜单地址", width: "150" },
  { prop: "icon", label: "图标", width: "70", render: (h, params) => {
    return h('i',{
      class: params.row.icon
    })
    }},
  { prop: "index", label: "排序号", width: "70" },
  { prop: "state", label: "状态", width: "80", render: (h, params) => {
    let stateName = params.row.state;
    switch(params.row.state){
      case 0: stateName = "无效"; break
      case 1: stateName = "有效"; break
      default: stateName = params.row.state
    }
    return h('span',{},stateName)
    } },
]

// 查询表单控件
let select_state = [{ value: undefined, label: "全部" }, { value: 1, label: "有效" }, { value: 0, label: "无效" }]
let select_type = [{ value: undefined, label: "全部" }, { value: 1, label: "目录" }, { value: 2, label: "菜单" }, { value: 3, label: "功能" }]
let radio_type = [{ value: 1, label: "目录" }, { value: 2, label: "菜单" }, { value: 3, label: "功能" }]
let radio_state = [{ value: 1, label: "有效" }, { value: 0, label: "无效" }]

/* 查询表单组件定义 */
export const searchForm = [
  { type: 'input', label: '菜单名称', prop: 'title', placeholder: '请输入菜单名...' },
  { type: 'select', label: '状态', prop: 'state', options: select_state, placeholder: '全部', style: "width:100px;" },
  { type: 'select', label: '菜单类型', prop: 'type', options: select_type, placeholder: '全部', style: "width:100px;" },
]

/* 查询表单属性定义 */
export const searchData = {  //查询表单
  title: "",
  state: undefined,
  type: undefined,
}

/* 添加/修改表单属性定义 */
export const addData = {  //查询表单
  id: undefined,
  type: undefined,
  parentId: undefined,
  title: undefined,
  mark: undefined,
  name: undefined,
  path: undefined,
  component: undefined,
  icon: undefined,
  index: undefined,
  state: 1,
}

/* 添加/修改表单组件定义 */
export const addForm = [
  { type: 'radio', label: '菜单类型', prop: 'type', options: radio_type },
  { type: 'selectTree', label: '上级菜单', prop: 'parentId',},
  { type: 'input', label: '菜单名称', prop: 'title', placeholder: '请输入菜单名称...', icon: "el-icon-user" },
  { type: 'input', label: '菜单标识', prop: 'mark', icon: "el-icon-date" },
  { type: 'input', label: '路由地址', prop: 'name', icon: "el-icon-date" },
  { type: 'input', label: '跳转地址', prop: 'path', icon: "el-icon-date" },
  { type: 'input', label: '菜单地址', prop: 'component',icon: "el-icon-date" },
  { type: 'input', label: '图标', prop: 'icon',  placeholder: '全部' },
  { type: 'input', label: '排序号', prop: 'index'},
  { type: 'radio', label: '状态', prop: 'state', options: radio_state },
]

/* 表单规则 */
export const rules_1 = {
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
}
/* 表单规则 */
export const rules_2 = {
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请输入跳转地址", trigger: "blur" }],
  name: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
  component: [{ required: true, message: "请输入菜单地址", trigger: "blur" }],
}
/* 表单规则 */
export const rules_3 = {
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  parentId: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
  mark: [{ required: true, message: "请输入菜单标识", trigger: "blur" }],
}

/* 分页组件定义 */
export const pageData = {
  currentPage: 1,
  sizes: [10, 20, 50, 100],
  pagesize: 10,
  total: 0,
  hide: false
}