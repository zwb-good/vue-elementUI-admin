<!-- 角色管理页面 -->
<template>
  <div>

    <!-- 搜索表单 -->
    <common-search
      formName="searchForm"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    ></common-search>

    <!-- 页面角色表格信息 -->
    <common-table
      :tableData="tableData"
      :tableHeader="tableHeader"
      :operates="operates"
      :pageData="pageData"
      @handleSelectionChange="handleSelectChange"
    ></common-table>

    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow">

      <!-- 添加、修改角色表单 -->
      <template v-if="dialogContent == 'form'">
        <common-search
          :searchData="addData"
          :searchForm="addForm"
          labelWidth="120px"
          size="medium "
          formName="addForm"
          :rules="rules"
          ref="addForm"
        ></common-search>
      </template>

      <!-- 修改角色菜单表单 -->
      <template v-if="dialogContent == 'table'">
        <el-form label-width="80px">
          <el-form-item label="角色名" style="width: 30%">
            <el-input v-model="addData.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" label-width="120px">
            <el-tree
              ref="menuTree"
              :data="menuTreeData"
              show-checkbox
              node-key="id"
              :default-expanded-keys="expandData"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addFormSubmit('addForm')">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 分页组件 -->
    <common-page
      :pageData="pageData"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></common-page>
  </div>
</template>

<script>
import CommonPage from "@/components/CommonPage";
import CommonTable from "@/components/CommonTable";
import CommonSearch from "@/components/CommonSearch";
import {
  tableHeader_role,
  searchForm,
  searchData,
  pageData,
  addData,
  addForm
} from "./index.js";
import {
  selectRole,
  updateRole,
  deleteRole,
  saveRole,
  selectRoleMenu,
  updateRoleMenu
} from "@/api/role.js";
import { selectMenu } from "@/api/menu.js";
export default {
  components: {
    CommonPage,
    CommonTable,
    CommonSearch
  },
  data() {
    const validateExpirationDate = (rule, value, callback) => {
      if (Date.parse(value) < Date.parse(this.addData.effectiveDate)) {
        callback(new Error("时间范围不正确，请重新选择"));
      } else {
        callback();
      }
    };
    return {
      /* 分页组件初试化属性 */
      pageData: pageData,
      /* 页面初始化角色表格的表格头 */
      tableHeader: tableHeader_role,
      /* 查询表单组件 */
      searchForm: searchForm,
      /* 查询表单数据 */
      searchData: searchData,
      /* 添加、修改表单组件 */
      addForm: addForm,
      /* 添加、修改表单数据 */
      addData: JSON.parse(JSON.stringify(addData)),
      /* 查询表单按钮 */
      searchHandle: [],
      /* 页面初始化角色表格操作按钮 */
      operates: {
        show: true,
        list: []
      }, 
      /* 表单校验规则 */
      rules: {
        code: [{ required: true, message: "角色编码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
        effectiveDate: [{ required:	true, message: '请选择生效时间', trigger: 'blur'} ],
        expirationDate: [{ required: true, trigger: "blur", validator: validateExpirationDate} ],
      },
      /* 角色表格选中行 */
      checkRows: [],
      /* 模态框打开、关闭 */
      dialogShow: false, 
      /* 模态框标题 */
      dialogTitle: "",
      /* 角色表格数据 */
      tableData: [], 
      /* 修改角色权限的树形菜单数据 */
      menuTreeData: [], 
      /* 被选中菜单数据 */
      checkData: [], 
      /* 要展开的菜单数据 */
      expandData: [], //展开的菜单数组
      /* 模态框打开显示组件：“form”添加、修改表单；“table”角色权限组件 */
      dialogContent: "",
      defaultProps: {
        //树形菜单属性
        children: "children",
        label: "title",
        id: "id"
      }
    };
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.handleButtonShow();
    this.getTableData(); //获取表格数据
  },
  methods: {
    /* ----------------------------- 页面初始化函数 ----------------------------------------- */
    /**
     * @description:获取表格加载数据
     * @param(data):data为空，页面初始化加载；data不为空，条件查找获取数据，data为查询条件
     * @returns _this.tableData、_this.pageData.total
     */
    getTableData(data) {
      if (data === undefined) {
        data = {};
      }
      data.page = this.pageData.currentPage;
      data.rows = this.pageData.pagesize;
      let _this = this;
      selectRole(data)
      .then(function(res) {
        _this.tableData = res.data.rows;
        _this.pageData.total = res.data.total;
      })
    },

    /**
     * 获取树形菜单数据
     * @returns:_this.expandData、_this.menuTreeData
     */
    getMenuTree() {
      let _this = this;
      selectMenu({ isTree: true }).then(function(res) {
        _this.expandData = res.data.rows.map(item => {
          return item.id;
        });
        _this.menuTreeData = res.data.rows; // 树形菜单数据
      });
    },

    /* ----------------------------- 添加、修改、删除函数 ----------------------------------------- */
    /**
     * 添加
     * 修改模态框标题，清空roleFrom
     */
    handleAdd() {
      this.addData = JSON.parse(JSON.stringify(addData));
      this.dialogTitle = "添加角色";
      this.dialogContent = "form";
      this.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.addForm.$refs.addForm.clearValidate();
      });
    },

    /**
     * @description:编辑操作打开模态框
     */
    handleEdit(index, row) {
      this.addData = Object.assign({}, row);
      this.dialogTitle = "编辑菜单";
      this.dialogContent = "form";
      this.dialogShow = true;
    },

    /**
     * @description:设置角色权限操作打开模态框
     */
    handleSetRoleMenu(index, row) {
      this.getMenuTree();
      this.addData.name = row.name;
      this.addData.id = row.id;
      let _this = this;
      selectRoleMenu({ roleId: row.id }).then(res => {
        _this.checkData = res.data.rows.map(item => {
          let node = _this.$refs.menuTree.getNode(item.menuId);
          if (node.isLeaf) {
            _this.$refs.menuTree.setChecked(node, true);
          }
          return item.menuId;
        });
      });
      this.dialogTitle = "编辑角色权限";
      this.dialogContent = "table";
      this.dialogShow = true;
    },

    /**
     * @description:模态框保存操作
     */
    addFormSubmit(formName) {
      if (this.dialogContent === "form") {
        this.$refs[formName].$refs.addForm.validate(valid => {
          if (valid) {
            if (this.addData.id !== null && this.addData.id !== "") {
              this.updateRoleSave();
            } else {
              this.addRoleSave();
            }
          } else {
            return false;
          }
        });
      }
      if (this.dialogContent === "table") {
        this.updateRoleMenuSave();
      }
    },

    /**
     * @description:修改角色信息的保存操作
     */
    updateRoleSave() {
      let _this = this;
      updateRole(_this.addData).then(function(res) {
        _this.utils.message(_this, res.data.msg, 3000);
        _this.getTableData(_this.searchData);
        _this.dialogShow = false;
      });
    },

    /**
     * @description:添加角色信息的保存操作
     */
    addRoleSave() {
      let _this = this;
      saveRole(_this.addData).then(function(res) {
        _this.utils.message(_this, res.data.msg, 3000);
        _this.getTableData(_this.searchData);
        _this.dialogShow = false;
      });
    },

    /**
     * @description:修改角色权限时的保存操作
     */
    updateRoleMenuSave() {
      let roleId = this.addData.id;
      let newMenuIds = this.$refs.menuTree.getHalfCheckedKeys().concat(this.$refs.menuTree.getCheckedKeys());
      let addMenuIds = this.utils.addArry(this.checkData,newMenuIds).join(",");
      let deleteMenuIds = this.utils.deleteArry(this.checkData,newMenuIds).join(",");
      if (addMenuIds === "" && deleteMenuIds === "") {
        return;
      }
      let _this = this;
      updateRoleMenu({
        roleId: roleId,
        addMenuIds: addMenuIds,
        deleteMenuIds: deleteMenuIds
      }).then(res => {
        _this.utils.message(_this, res.data.msg, 3000);
        _this.getTableData(_this.searchData);
        _this.dialogShow = false;
      });
    },

    /**
     * 删除
     * 修改用户权限弹出框保存按钮
     * api: /api/rolemenu/addOrUpdate(编辑), /api/role/save(添加)
     * param: {roleId: 选中角色id}、{addArry: 该角色新添加的菜单id数组}、{deletaArry: 该角色删除的的菜单id数组}
     *        {roleName: 角色名称}
     */
    handleDelete() {
      if (this.checkRows.length === 0) {
        this.utils.message(this, "请选择要删除的数据", 3000);
        return;
      }
      let _this = this;
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole({
            ids: _this.checkRows
              .map(item => {
                return item.id;
              })
              .join(",")
          }).then(function(res) {
            if (res.data.success) {
              _this.utils.message(_this, "删除成功", 3000);
              _this.getTableData(_this.searchData);
            } else {
              _this.utils.message(_this, "删除失败", 3000);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * @description:查询
     */
    handleSearchFormSubmit() {
      this.currentPage = 1;
      let param = {};
      param.name = this.searchData.name.trim();
      param.state = this.searchData.state;
      this.getTableData(param);
    },

    /**
     * @description:分页选择每页大小触发事件
     */
    handleSizeChange(val) {
      this.pageData.pagesize = val;
      this.getTableData(this.searchData);
    },

    /**
     * @description:分页选择某页触发事件
     */
    handleCurrentChange(val) {
      this.pageData.currentPage = val;
      this.getTableData(this.searchData);
    },

    /**
     * 选中行时的触发事件
     */
    handleSelectChange(val) {
      this.checkRows = val;
    },
    /**
     * 页面按钮权限筛选
     */
    handleButtonShow() {
      const buttonList = this.$store.state.permission.buttonList;
      const searchButoon = [
        {
          label: "查询",
          mark: "search",
          show: true,
          type: "primary",
          method: () => {
            this.handleSearchFormSubmit();
          },
        },
        {
          label: "添加",
          mark: "insert",
          show: true,
          type: "primary",
          method: () => {
            this.handleAdd();
          },
        },
        {
          label: "删除",
          mark: "delete",
          show: true,
          type: "danger",
          method: () => {
            this.handleDelete();
          },
        },
      ];
      const tableButton = [
        {
          label: "编辑",
          mark: "update",
          type: "info",
          show: true,
          icon: "el-icon-edit",
          method: (index, row) => {
            this.handleEdit(index, row);
          },
        },
        {
          label: "设置角色权限",
          mark: "setRoleMenu",
          type: "warning",
          icon: "el-icon-user",
          show: true,
          method: (index, row) => {
            this.handleSetRoleMenu(index, row);
          },
        },
      ];
      searchButoon.forEach((item) => {
        if (!buttonList.includes(item.mark)) {
          item.show = false;
        }
      });
      tableButton.forEach((item) => {
        if (!buttonList.includes(item.mark)) {
          item.show = false;
        }
      });
      this.searchHandle = searchButoon;
      this.operates.list = tableButton;
    },
  },


};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>