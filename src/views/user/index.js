export const tableHeader_user = [
  { prop: "username", label: "用户名", width: "120" },
  { prop: "name", label: "姓名", width: "120" },
  { prop: "sex", label: "性别", width: "50" },
  { prop: "phone", label: "手机", width: "120" },
  { prop: "email", label: "邮箱", width: "190" },
  { prop: "createDate", label: "创建时间", width: "120" },
  { prop: "updateDate", label: "修改时间", width: "120" },
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

export const tableHeader_role = [
  { prop: "code", label: "角色编码", width: "180" },
  { prop: "name", label: "角色名称", width: "180" },
  { prop: "effectiveDate", label: "生效日期", width: "180" },
  { prop: "expirationDate", label: "失效日期", width: "180" , render: (h, params) => {
    return h('el-date-picker',{
      props:{
        value: params.row.expirationDate,
        type: "date"
      }
    })
    } },
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

// 列操作按钮
export const operates = {
  show: true,
  list: [
    {
      label: '编辑',
      type: 'info',
      show: true,
      icon: 'el-icon-edit',
      method: (index, row) => {
        this.handleEdit(index, row)
      }
    },
    {
      label: '删除',
      type: 'danger',
      icon: 'el-icon-delete',
      show: true,
      method: (index, row) => {
        this.handleDelete(index, row)
      }
    },
    {
      label: '设置角色',
      type: 'warning',
      icon: 'el-icon-user',
      show: true,
      method: (index, row) => {
        this.handleSetRole(index, row)
      }
    }
  ]
}

// 查询表单控件
let state = [{value:"",label:"全部"},{value:1,label:"有效"},{value:0,label:"无效"}]
let state1 = [{value:1,label:"有效"},{value:0,label:"无效"}]
export const searchForm = [
  {type:'input',label:'用户名',prop:'username',placeholder:'请输入用户名...'},
  {type:'input',label:'姓名',prop:'name',placeholder:'请输入姓名...'},
  {type:'select',label:'状态',prop:'state',options:state,placeholder:'全部',style:"width:100px;"},
  {type:'dateTime',label:'创建时间',prop:"searchDate"}
]

let sex = [{value:"男",label:"男"},{value:"女",label:"女"}]
export const searchHandle = [
  {label:'查询',show:true,type:'primary',method: () => {
        this.handleSearchFormSubmit()
      }},
  {label:'添加',show:true,type:'primary',method: () => {
        this.handleAdd()
      }}
]

export const searchData = {  //查询表单
  username: "",
  name: "",
  state: "",
  searchDate: "",
}

export const addData = {  //查询表单
  id: "",
  username: "",
  name: "",
  password: "",
  rePassword: "",
  sex: "",
  phone: "",
  email: "",
  state: 1,
}

export const addForm = [
  {type:'input',label:'用户名',prop:'username',placeholder:'请输入用户名...',icon:"el-icon-user"},
  {type:'input',label:'姓名',prop:'name',placeholder:'请输入姓名...',icon:"el-icon-user"},
  {type:'input',label:'密码',prop:'password',placeholder:'请输入密码...',icon:"el-icon-date",isPassWord:true},
  {type:'input',label:'确认密码',prop:'rePassword',icon:"el-icon-date",isPassWord:true},
  {type:'select',label:'性别',prop:'sex',options:sex,placeholder:'请选择性别'},
  {type:'input',label:'联系电话',prop:'phone',placeholder:'请输入电话号码',icon:"el-icon-date"},
  {type:'input',label:'邮箱',prop:'email',placeholder:'请输入邮箱',icon:"el-icon-date"},
  {type:'radio',label:'状态',prop:'state',options:state1,placeholder:'全部'},
]

export const pageData = {
  currentPage: 1,
  sizes: [10, 20, 50, 100],
  pagesize: 10,
  total: 0,
  hide: false
}