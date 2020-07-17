<template>
  <div>
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small" ref="searchForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="searchForm.roleIds" placeholder="请选择身份" :multiple=true>
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="searchForm.searchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchFormSubmit()">查询</el-button>
        <el-button type="success" @click="openUserDialog('userForm')">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加，修改用户弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="userDialog">
      <el-form :model="userForm" :inline="true" :rules="rules" ref="userForm">
        <el-input v-model="userForm.id" prop="id" type="hidden" ></el-input>
        <el-form-item label="工号" :label-width="formLabelWidth" prop="uno">
          <el-input v-model="userForm.uno" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="userForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth" prop="createDate">
          <el-date-picker v-model="userForm.createDate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
          <el-radio v-model="userForm.state" :label=0>无效</el-radio>
          <el-radio v-model="userForm.state" :label=1>有效</el-radio>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="roleId">
          <el-select v-model="userForm.roleIds" placeholder="请选择身份" :multiple=true @change="$forceUpdate()">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-radio v-model="userForm.sex" label="男">男</el-radio>
          <el-radio v-model="userForm.sex" label="女">女</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialog = false">取 消</el-button>
        <el-button type="primary" @click="userFormSubmit('userForm')">保 存</el-button>
      </div>
    </el-dialog>

    <el-table :data="tableData" border stripe style="width: 100%" height="480" @sort-change="sort">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="uno" label="工号" sortable="custom" align="center" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="150"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="120"></el-table-column>
      <el-table-column prop="createDate" label="创建日期" align="center" width="200"></el-table-column>
      <el-table-column prop="role" label="身份" align="center" width="250" :formatter="formatterRole"></el-table-column>
      <el-table-column prop="state" label="状态" align="center" width="120" :formatter="formatterState"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :hide-on-single-page="value"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" style="margin-top: 20px">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {  //查询表单
        name: "",
        searchDate: "",
        checkRoleList: [], //被选中角色
      },
      roleList: [], //所有角色
      userForm: {  //添加用户表单
        uno: "",
        name: "",
        state: 1,
        sex: "",
        createDate: "",
        id:''
      },
      oldRoleIds: [],
      rules: {  //添加用户表单校验规则
        uno: [{ required: true, message: "请输入学号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "change" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
      },
      userDialog: false, //添加用户表单模态框
      dialogTitle: "添加用户",
      tableData: [], //表格数据
      options: [],  //存放班级
      total: 0,  //分页总数
      pagesize: 10,  //每页数量
      currentPage:1, //
      value: false,  //是否隐藏分页
      orderBy: 'uno',
      order: 'ascending',
      formLabelWidth: "120px"
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted: function() {
    var _this = this;
    _this.getUser();
    _this.getALLRole();
  },
  methods: {
    //获取所有角色
    getALLRole() {
      let _this = this;
      this.$axios
      .get("/api/role/select")
      .then(function(res) {
        _this.roleList = res.data.rows;
      })
      .catch(function(error) {
        _this.utils.message(_this,error,3000);
      });
    },
    //重置用户表单数据
    /** 
     * @description
     * @param
     * @returns 
    */
    resetUserForm() {
      let resetData = {
        uno: "",
        name: "",
        state: 1,
        createDate: "",
        id:''
      }
      this.userForm = resetData;
    },

    /** 
     * 编辑
    */
    handleEdit(index, row) {
      let list = [];
      row.roleList.forEach((role) => {
        list.push(role.id);
      });
      this.userForm = Object.assign({}, row);
      this.userForm.roleIds = list;
      this.$delete(this.userForm,"roleList");
      this.oldRoleIds = list;
      this.dialogTitle = "编辑用户"
      this.userDialog = true;
    },
    /** 
     * 删除
    */
    handleDelete(index, row) {
      let _this = this;
      this.$confirm('确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
        .get("/api/user/update", {params:{"id":row.id,"isDel":1}})
        .then(function(res) {
          if(res.data.success){
            _this.utils.message(_this,"删除成功",3000);
            _this.getUser(_this.searchForm)
          }else{
            _this.utils.message(_this,"删除失败",3000);
          }
        })
        .catch(function(error) {
          _this.utils.message(_this,error,3000);
        });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //查询事件
    searchFormSubmit() {
      this.currentPage = 1;
      let param = {}
      param.name = this.searchForm.name;
      if(this.searchForm.searchDate != null){
        param.startDate = this.searchForm.searchDate[0];
        param.endDate = this.searchForm.searchDate[1];
      }
      if(this.searchForm.roleIds != null && this.searchForm.roleIds != ""){
        param.roleIds = this.searchForm.roleIds.join(',');
      }
      this.getUser(param)
    },
    //打开模态框
    openUserDialog(formName) {
      this.dialogTitle = "添加用户"
      this.userDialog = true;
      this.resetUserForm();
      this.$nextTick(()=>{
        this.$refs[formName].clearValidate();
      })
    },
    //获取表格数据
    getUser(data) {
      if (data === undefined) {
        data = {};
      }
      data.page = this.currentPage;
      data.rows = this.pagesize;
      data.orderBy = this.orderBy;
      data.isDel = 0;
      if(this.order == "ascending"){
        data.order = "asc";
      }else{
        data.order = "desc";
      }
      let _this = this;
      this.$axios
        .get("/api/user/select",{params:data})
        .then(function(res) {
          _this.tableData = res.data.rows;
          _this.total = res.data.total;
        })
        .catch(function(error) {
          _this.utils.message(_this,error,3000);
        });
    },
    //添加、修改用户保存
    userFormSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          var url = null;
          if(this.userForm.id !== null && this.userForm.id !== ""){
            url = '/api/user/update';
            let addRole = _this.utils.addArry(_this.oldRoleIds,_this.userForm.roleIds);
            let deleteRole = _this.utils.deleteArry(_this.oldRoleIds,_this.userForm.roleIds);
            _this.userForm.addRoles = addRole.join(',');
            _this.userForm.deleteRoles = deleteRole.join(',');
            _this.userForm.roleIds = _this.userForm.roleIds.join(",");
          }else{
            url = '/api/user/save';
            _this.userForm.roleIds = _this.userForm.roleIds.join(",");
          }
          this.$axios
            .post(url, _this.$qs.stringify(_this.userForm))
            .then(function(res) {
              _this.utils.message(_this,res.data.msg,3000);
              _this.getUser(_this.searchForm)
              _this.userDialog = false;
            })
            .catch(function(error) {
              _this.utils.message(_this,error,3000);
            });
        } else {
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUser(this.searchForm)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUser(this.searchForm)
    },
    //排序条件
    sort(val) {
      this.orderBy = val.prop;
      this.order = val.order;
      this.getUser(this.searchForm)
    },
    //格式化表格状态列
    formatterState(row) {
      return row.state === 1 ? '有效' :  '无效'
    },
    formatterRole(row) {
      let str = "";
      for(let i in row.roleList){
        str += row.roleList[i].roleName+"|";
      }
      return str.substring(0,str.length-1);
    },
  }
};
</script>
<style scoped>
</style>