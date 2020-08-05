<!-- 角色管理页面 -->
<template>
  <div>
    <common-search
      formName="searchForm"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    ></common-search>

    <common-table
      :tableData="tableData"
      :tableHeader="tableHeader_menu"
      :operates="operates"
      :pageData="pageData"
      @handleSelectionChange="handleSelectChange"
    ></common-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogShow">
      <common-search
        :searchData="addData"
        :searchForm="addForm"
        labelWidth="120px"
        size="medium "
        formName="addForm"
        :rules="rules"
        ref="addForm"
      ></common-search>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addFormSubmit('addForm')">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 添加，修改用户弹出框
    <el-dialog :title="dialogTitle" :visible.sync="roleDialog">
      <el-form :model="roleForm" :rules="rules" ref="roleForm">
        <el-input v-model="roleForm.id" prop="id" type="hidden"></el-input>
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
    </el-dialog>-->

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
  tableHeader_menu,
  searchForm,
  searchData,
  pageData,
  addData,
  addForm,
  rules_1,
  rules_2,
  rules_3,
} from "./index.js";
import { selectMenu, updateMenu, saveMenu, deleteMenu } from "@/api/menu.js";
export default {
  components: {
    CommonPage,
    CommonTable,
    CommonSearch,
  },
  watch: {
    "addData.type": {
      handler(newVal) {
        switch (newVal) {
          case undefined:
            this.rules = rules_1;
            break;
          case 1:
            this.rules = rules_1;
            break;
          case 2:
            this.rules = rules_2;
            break;
          case 3:
            this.rules = rules_3;
            break;
        }
        this.$nextTick(() => {
          this.$refs.addForm.$refs.addForm.clearValidate();
        });
      },
      deep: true,
      //immediate: true
    },
  },
  data() {
    return {
      /* 分页组件初试化属性 */
      pageData: pageData,
      /* 页面初始化菜单表格的表格头 */
      tableHeader_menu: tableHeader_menu,
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
        list: [],
      },
      /* 表单校验规则 */
      rules: rules_1,
      /* 菜单表格选中行 */
      checkRows: [],
      /* 模态框打开、关闭 */
      dialogShow: false,
      /* 模态框标题 */
      dialogTitle: "",
      /* 菜单表格数据 */
      tableData: [],
      parentMenuData: [], //菜单树形数据
      checkData: [], //被选中菜单id数组
      expandData: [], //展开的菜单数组
      defaultProps: {
        //树形菜单属性
        children: "children",
        label: "label",
        id: "id",
      },
    };
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    /* 获取页面按钮权限 */
    this.handleButtonShow();
    /* 获取页面数据 */
    this.getTableData();
    this.getParentMenu(); //获取树形菜单
  },
  methods: {
    /* ----------------------------- 页面初始化函数 ----------------------------------------- */
    /**
     * 获取表格加载数据
     * api: /api/role/select
     */
    getTableData(data) {
      if (data === undefined) {
        data = {};
      }
      data.page = this.pageData.currentPage;
      data.rows = this.pageData.pagesize;
      let _this = this;
      selectMenu(data).then(function (res) {
        _this.tableData = res.data;
        _this.pageData.total = res.total;
      });
    },

    /**
     * 获取表单父级菜单数据
     */
    getParentMenu() {
      let data = {
        noFunctionMenu: true,
        isTree: true
      };
      let _this = this;
      selectMenu(data).then(function (res) {
        _this.addForm.forEach(item => {
          if(item.type === "selectTree"){
            item.options = res.data;
          }
        })
      });
    },

    /* ----------------------------- 添加、修改、删除函数 ----------------------------------------- */
    /**
     * 添加
     * 修改模态框标题，清空roleFrom
     */
    handleAdd() {
      this.dialogTitle = "添加菜单";
      this.dialogShow = true;
      this.addData = JSON.parse(JSON.stringify(addData)),
      this.$nextTick(() => {
        this.$refs.addForm.$refs.addForm.clearValidate();
      });
    },

    /**
     * 编辑
     */
    handleEdit(index, row) {
      this.addData = Object.assign({}, row);
      this.dialogTitle = "编辑菜单";
      this.dialogShow = true;
    },

    /** 
     * form表单保存
    */
    addFormSubmit(formName) {
      this.$refs[formName].$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addData.id !== undefined && this.addData.id !== "") {
            this.updateMenuSave();
          } else {
            this.addMenuSave();
          }
        } else {
          return false;
        }
      });
    },

    /**
     * @description:修改菜单信息的保存操作
     */
    updateMenuSave() {
      let _this = this;
      updateMenu(_this.addData).then(function (res) {
        _this.utils.message(_this, res.msg, 3000);
        _this.getTableData(_this.searchData);
        _this.dialogShow = false;
      });
    },

    /**
     * @description:添加菜单信息的保存操作
     */
    addMenuSave() {
      let _this = this;
      saveMenu(_this.addData).then(function (res) {
        _this.utils.message(_this, res.msg, 3000);
        _this.getTableData(_this.searchData);
        _this.dialogShow = false;
      });
    },

    /**
     * 删除
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
        type: "warning",
      })
        .then(() => {
          deleteMenu({
            ids: _this.checkRows
              .map((item) => {
                return item.id;
              })
              .join(","),
          }).then(function (res) {
            _this.utils.message(_this, res.msg, 3000);
            _this.getTableData(_this.searchData);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    /**
     * @description:查询
     */
    handleSearchFormSubmit() {
      this.currentPage = 1;
      let param = {};
      param.title = this.searchData.title.trim();
      param.state = this.searchData.state;
      param.type = this.searchData.type;
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