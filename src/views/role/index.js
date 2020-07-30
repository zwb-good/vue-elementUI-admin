export const tableHeader_role = [
  { prop: "code", label: "角色编码", width: "180" },
  { prop: "name", label: "角色名称", width: "180" },
  { prop: "effectiveDate", label: "生效日期", width: "180" },
  { prop: "expirationDate", label: "失效日期", width: "180" },
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
let state = [{ value: "", label: "全部" }, { value: 1, label: "有效" }, { value: 0, label: "无效" }]
let state1 = [{ value: 1, label: "有效" }, { value: 0, label: "无效" }]
export const searchForm = [
  { type: 'input', label: '角色名称', prop: 'name', placeholder: '请输入角色名...' },
  { type: 'select', label: '状态', prop: 'state', options: state, placeholder: '全部', style: "width:100px;" },
]


export const searchData = {  //查询表单
  name: "",
  state: "",
}

export const addData = {  //查询表单
  id: "",
  code: "",
  name: "",
  effectiveDate: "",
  expirationDate: "",
  state: 1,
}

export const addForm = [
  { type: 'input', label: '角色编码', prop: 'code', placeholder: '请输入用户名...', icon: "el-icon-user" },
  { type: 'input', label: '角色名称', prop: 'name', placeholder: '请输入姓名...', icon: "el-icon-user" },
  { type: 'dateTimeOne', label: '生效时间', prop: 'effectiveDate', placeholder: '生效时间...', icon: "el-icon-date" },
  { type: 'dateTimeOne', label: '失效时间', prop: 'expirationDate', placeholder: '失效时间...',icon: "el-icon-date" },
  { type: 'radio', label: '状态', prop: 'state', options: state1, placeholder: '全部' },
]

export const pageData = {
  currentPage: 1,
  sizes: [10, 20, 50, 100],
  pagesize: 10,
  total: 0,
  hide: false
}