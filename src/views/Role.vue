<!-- 角色管理页面 -->
<template>
  <div>
    <el-button type="success" size="small" @click="openRoleDialog()" style="margin-bottom: 10px;">添加</el-button>
    <el-table ref="roleTable" :data="tableData" border stripe row-key="id" style="width: 100%" height="480">
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="roleName" label="名称" align="center" width="250"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加，修改用户弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="roleDialog">
      <el-form :model="roleForm" :rules="rules" ref="roleForm">
        <el-input v-model="roleForm.id" prop="id" type="hidden" ></el-input>
        <el-form-item label="角色名" label-width="120px" prop="roleName" style="width: 50%;">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" label-width="120px">
          <el-tree
            ref="menuTree"
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="expandData"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="menuTreeSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleDialog: false, //修改角色权限弹出框
      dialogTitle: "修改角色权限", //弹出框标题
      tableData: [], //页面表格数据
      data: [], //菜单树形数据
      checkData: [], //被选中菜单id数组
      expandData: [], //展开的菜单数组
      defaultProps: { //树形菜单属性
        children: "children",
        label: "label",
        id: "id"
      },
      roleForm: {  //添加用户表单
        roleName: "",
        id:'',
      },
      rules: {  //添加用户表单校验规则
        roleName: [{ required: true, message: "请输入角色名称", trigger: "change" }],
      },
    };
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getTableData(); //获取表格数据
    this.getAllMenu(); //获取树形菜单
  },
  methods: {
    /* ----------------------------- 页面初始化函数 ----------------------------------------- */
    /**
     * 获取表格加载数据
     * api: /api/role/select
     */
    getTableData() {
      let _this = this;
      this.$axios
      .get("/api/role/select")
      .then(function(res) {
        if (res.data.success) {
          _this.tableData = res.data.rows;
        } else {
          _this.utils.message(_this, "查询失败", 3000);
        }
      })
      .catch(function(error) {
        _this.utils.message(_this, error, 3000);
      });
    },

    /**
     * 获取树形菜单数据
     * api: /api/menu/selectAndChildren
     * param: {condition: 拼接参数条件}
     */
    getAllMenu() {
      let _this = this;
      this.$axios
      .get(
        "/api/menu/select",
        {params:{ condition: "menuP.parentId = -1" }}
      )
      .then(function(res) {
        if (res.data.success) {
          let expandArry = [];
          for (let i in res.data.rows) {
            expandArry.push(res.data.rows[i].id);
          }
          _this.expandData = expandArry; // 树形菜单要展开的层级
          _this.data = res.data.rows; // 树形菜单数据
        } else {
          _this.utils.message(_this, "查询失败", 3000);
        }
      })
      .catch(function(error) {
        _this.utils.message(_this, error, 3000);
      });
    },

    /* ----------------------------- 添加、修改、删除函数 ----------------------------------------- */
    /**
     * 添加
     * 修改模态框标题，清空roleFrom
     */
    openRoleDialog() {
      this.roleDialog = true;
      this.dialogTitle = "添加角色"
      this.resetRoleForm(); //调用清空函数
    },

    /**
     * 清空roleFrom
     */
    resetRoleForm() {
      let resetData = {
        roleName: "",
        id:''
      }
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate();
        this.$refs.menuTree.setCheckedKeys([])
      })
      this.roleForm = resetData;
    },
    
    /**
     * 编辑
     * 点击编辑按钮打开角色权限修改弹出框，获取选中角色所拥有的权限
     * api: /api/rolemenu/select
     * param: {roleId: 选中角色id}
     */
    handleEdit(index, row) {
      this.resetRoleForm();
      this.roleForm.id = row.id;
      this.roleForm.roleName = row.roleName;
      this.roleForm.nameReadOnly = true;
      let _this = this;
      this.$axios
        .get("/api/rolemenu/select", {params:{ roleId: row.id }})
        .then(function(res) {
          if (res.data.success) {
            let checkArry = [];
            res.data.rows.forEach(item => {
              checkArry.push(item.menuId);
              let node =_this.$refs.menuTree.getNode(item.menuId);
              if(node.isLeaf){
                _this.$refs.menuTree.setChecked(node,true);
              } 
            });
            _this.checkData = checkArry;
          } else {
            _this.utils.message(_this, "查询失败", 3000);
          }
        })
        .catch(function(error) {
          _this.utils.message(_this, error, 3000);
        });
      this.roleDialog = true;
    },
    /**
     * 保存
     * 修改用户权限弹出框保存按钮
     * api: /api/rolemenu/addOrUpdate(编辑), /api/role/save(添加)
     * param: {roleId: 选中角色id}、{addArry: 该角色新添加的菜单id数组}、{deletaArry: 该角色删除的的菜单id数组}
     *        {roleName: 角色名称}
     */
    menuTreeSave() {
      let roleId = this.roleForm.id;
      let addArry = [];
      let deletaArry = [];
      let url = "";
      if(roleId == null || roleId == ""){
        addArry = this.$refs.menuTree.getCheckedKeys(true);
        url = "/api/role/save"
      }else{
        let newCheckData = this.$refs.menuTree.getHalfCheckedKeys().concat(this.$refs.menuTree.getCheckedKeys());
        addArry = this.utils.addArry(this.checkData,newCheckData);
        deletaArry = this.utils.deleteArry(this.checkData,newCheckData);
        url = "/api/rolemenu/roleMenuAddOrUpdate"
      }
      let roleName = this.roleForm.roleName;
      let _this = this;
      this.$axios
      .get(url, { params:{"id": roleId,"roleName": roleName, "addArry": addArry.join(','), "deletaArry": deletaArry.join(',')}})
      .then(function(res) {
        _this.getTableData();
        _this.utils.message(_this, res.data.msg, 3000);
        _this.roleDialog = false;
      })
      .catch(function(error) {
        _this.utils.message(_this, error, 3000);
      });
    },

    /**
     * 删除
     * 修改用户权限弹出框保存按钮
     * api: /api/rolemenu/addOrUpdate(编辑), /api/role/save(添加)
     * param: {roleId: 选中角色id}、{addArry: 该角色新添加的菜单id数组}、{deletaArry: 该角色删除的的菜单id数组}
     *        {roleName: 角色名称}
     */
    handleDelete(index, row) {
      let _this = this;
      this.$confirm(
        '确认要删除吗?', '提示', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$axios
        .get("/api/role/delete", {params:{"id":row.id}})
        .then(function(res) {
          if(res.data.success){
            _this.utils.message(_this,"删除成功",3000);
            _this.getTableData();
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

  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>