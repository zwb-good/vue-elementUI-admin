<template>
  <div>
    <!-- 搜索表单 -->
    <common-search
      formName="searchForm"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
    ></common-search>

    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="userDialog" :width="dialogWidth">
      <!-- 添加、修改用户表单 -->
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

      <!-- 修改用户角色表格 -->
      <template v-if="dialogContent == 'table'">
        <el-form label-width="80px">
          <el-form-item label="用户名" style="width: 30%">
            <el-input v-model="addData.username" readonly></el-input>
          </el-form-item>
          <el-form-item label="设置角色">
            <!-- 表格属性定义 -->
            <el-table
              :data="tableData_role"
              ref="roleTable"
              stripe
              border
              max-height="520"
              @selection-change="handleRoleSelectChange"
              @cell-click="cellClick"
            >
              <!-- 表格多选 -->
              <el-table-column type="selection" align="center" width="55"></el-table-column>
              <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
              <el-table-column prop="code" label="角色编码" align="center" width="180"></el-table-column>
              <el-table-column prop="name" label="角色名称" align="center" width="180"></el-table-column>
              <el-table-column prop="effectiveDate" label="生效日期" align="center" width="180">
                <template slot-scope="scope">
                  <el-date-picker
                    v-if="scope.row.seen_effective"
                    v-model="scope.row.effectiveDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    v-focus
                    @blur="inputBlur(scope.row,'effectiveDate')"
                    style="width:158px"
                  ></el-date-picker>
                  <span v-else>{{scope.row.effectiveDate}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="expirationDate" label="失效日期" align="center" width="180">
                <template slot-scope="scope">
                  <el-date-picker
                    v-if="scope.row.seen_expiration"
                    v-model="scope.row.expirationDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    v-focus
                    @blur="inputBlur(scope.row,'expirationDate')"
                    style="width:158px;"
                  ></el-date-picker>
                  <span v-else>{{scope.row.expirationDate}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialog = false">取 消</el-button>
        <el-button type="primary" @click="userFormSubmit('addForm')">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 页面用户表格信息 -->
    <common-table
      :tableData="tableData"
      :tableHeader="tableHeader_user"
      :operates="operates"
      :pageData="pageData"
      @handleSelectionChange="handleSelectChange"
    ></common-table>

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
  getUserList,
  updateUser,
  deleteUser,
  saveUser,
  selectRoleByUserId,
  updateUserRole,
} from "@/api/user.js";
import { selectRole } from "@/api/role.js";
import { validEmail, validPassword,validPhone } from "@/utils/validate";
import {
  tableHeader_user,
  searchForm,
  searchData,
  addForm,
  pageData,
  addData,
} from "./index.js";
export default {
  components: {
    CommonPage,
    CommonTable,
    CommonSearch,
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector("input").focus();
      },
    },
  },
  data() {
    /* 校验规则 */
    const validateEmail = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("邮箱不能为空"));
      } else if (!validEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入密码"));
      } else if (!validPassword(value)) {
        callback(new Error("密码必须包含字母和数字，且在6~18位之间"));
      } else {
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (value.trim() !== this.addData.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入手机号码"));
      } else if (!validPhone(value)) {
        callback(new Error("手机号码有误，请重填"));
      } else {
        callback();
      }
    };
    return {
      /* 分页组件初试化属性 */
      pageData: pageData,
      /* 查询表单组件 */
      searchForm: searchForm,
      /* 添加、修改表单组件 */
      addForm: JSON.parse(JSON.stringify(addForm)),
      /* 页面初始化表格的表格头 */
      tableHeader_user: tableHeader_user,
      /* 查询表单数据 */
      searchData: searchData,
      /* 添加、修改表单数据 */
      addData: JSON.parse(JSON.stringify(addData)),
      /* 查询表单按钮 */
      searchHandle: [],
      /* 页面初始化用户表格操作按钮 */
      operates: {
        show: true,
        width: "300",
        list: [],
      },
      /* 隐藏用户角色表格按钮 */
      operates_role: {
        show: false,
      },
      /* 表单校验规则 */
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2,max:6, message: "请输入2~6位用户名", trigger: "blur" },
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2,max:10, message: "请输入2~10位姓名", trigger: "blur" },
        ],
        password: [{ required: true, trigger: "blur", validator: validatePassword }],
        rePassword: [{ required: true, trigger: "blur", validator: validateRePassword }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        email: [{ required: true, trigger: "blur", validator: validateEmail }],
      },
      /* 用户表格选中行 */
      baseCheckRows: [],
      /* 用户角色表格选中行 */
      addCheckRows: [],
      /* 修改用户角色时，存放用户原有的角色信息 */
      oldRoleRows: [],
      /* 模态框打开、关闭 */
      userDialog: false, //添加用户表单模态框
      /* 模态框标题 */
      dialogTitle: "",
      /* 用户表格数据 */
      tableData: [], //表格数据
      /* 用户角色表格数据 */
      tableData_role: [],
      /* 排序字段 */
      orderBy: "email",
      /* 排序方式 */
      order: "ascending",
      /* 表单label距离 */
      formLabelWidth: "120px",
      /* 模态框打开显示组件：“form”添加、修改表单；“table”用户角色表格 */
      dialogContent: "",
      /* 模态框宽度 */
      dialogWidth: "50%",
      /* 控制用户角色表格单元格编辑状态 */
      isDate: false,
    };
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted: function () {
    this.handleButtonShow();
    this.getUser();
  },
  methods: {
    /**
     * @description 获取角色表格数据
     * @returns _this.tableData_role
     */
    getALLRole() {
      let _this = this;
      selectRole({ haveEffective: true }).then(function (res) {
        _this.tableData_role = res.data.rows;
      });
    },

    /**
     * @description:获取用户表格数据
     * @param(data):data为空，页面初始化加载；data不为空，条件查找获取数据，data为查询条件
     * @returns _this.tableData、_this.pageData.total
     */
    getUser(data) {
      if (data === undefined) {
        data = {};
      }
      data.page = this.pageData.currentPage;
      data.rows = this.pageData.pagesize;
      data.orderBy = this.orderBy;
      if (this.order == "ascending") {
        data.order = "asc";
      } else {
        data.order = "desc";
      }
      let _this = this;
      getUserList(data)
        .then(function (res) {
          _this.tableData = res.data.rows;
          _this.pageData.total = res.data.total;
        })
        .catch(function (error) {
          _this.utils.message(_this, error, 3000);
        });
    },

    /**
     * @description:切换用户有效，无效事件
     * @param: row行数据
     */
    handleState(index, row) {
      let title = "";
      if (1 === row.state) {
        title = `确定要禁止用户：${row.username}吗？`;
      } else {
        title = `确定要启用用户：${row.username}吗？`;
      }
      let _this = this;
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateUser({ id: row.id, state: row.state == 1 ? 0 : 1 }).then(
            (res) => {
              if (res.data.success) {
                _this.getUser(_this.searchData);
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消改变",
          });
        });
    },

    /**
     * @description:删除事件
     */
    handleDelete() {
      if (this.baseCheckRows.length === 0) {
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
          deleteUser({
            ids: _this.baseCheckRows
              .map((item) => {
                return item.id;
              })
              .join(","),
          }).then(function (res) {
            if (res.data.success) {
              _this.utils.message(_this, "删除成功", 3000);
              _this.getUser(_this.searchData);
            } else {
              _this.utils.message(_this, "删除失败", 3000);
            }
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
     * @description:查询事件
     */
    handleSearchFormSubmit() {
      this.pageData.currentPage = 1;
      let param = {};
      param.username = this.searchData.username.trim();
      param.name = this.searchData.name.trim();
      param.state = this.searchData.state;
      if (this.searchData.searchDate != null) {
        param.startDate = this.searchData.searchDate[0];
        param.endDate = this.searchData.searchDate[1];
      }
      this.getUser(param);
    },

    /**
     * @description:添加操作打开模态框
     */
    handleAdd() {
      this.addForm = JSON.parse(JSON.stringify(addForm));
      this.dialogTitle = "添加用户";
      this.dialogContent = "form";
      this.dialogWidth = "50%";
      this.userDialog = true;
      this.addData = JSON.parse(JSON.stringify(addData));
      this.$nextTick(() => {
        this.$refs.addForm.$refs.addForm.clearValidate();
      });
    },

    /**
     * @description:编辑操作打开模态框
     */
    handleEdit(index, row) {
      for (let i = 0; i < this.addForm.length; i++) {
        if (
          this.addForm[i].prop === "password" ||
          this.addForm[i].prop === "rePassword"
        ) {
          this.addForm.splice(i, 1);
          --i;
        }
      }
      this.addData = Object.assign({}, row);
      this.dialogTitle = "编辑用户";
      this.dialogContent = "form";
      this.dialogWidth = "50%";
      this.userDialog = true;
    },

    /**
     * @description:设置角色操作打开模态框
     */
    async handleSetRole(index, row) {
      this.tableData_role = [];
      let allRoles = [];
      await selectRole({ haveEffective: true }).then(function (res) {
        //_this.tableData_role = res.data.rows;
        allRoles = res.data.rows;
      });

      this.addData.username = row.username;
      this.addData.id = row.id;
      let _this = this;
      selectRoleByUserId({ userId: row.id }).then((res) => {
        _this.oldRoleRows = res.data.rows;
        let roleIds = res.data.rows.map((item) => {
          return item.roleId;
        });

        allRoles.forEach((item) => {
          item.seen_effective = false;
          item.seen_expiration = false;
          _this.tableData_role.push(item);
          if (roleIds.includes(item.id)) {
            res.data.rows.forEach((row) => {
              if (row.roleId === item.id) {
                item.effectiveDate = row.effectiveDate;
                item.expirationDate = row.expirationDate;
              }
            });
            this.$refs.roleTable.toggleRowSelection(item, true);
          } else {
            item.effectiveDate = undefined;
            item.expirationDate = undefined;
          }
        });
      });
      this.dialogTitle = "编辑用户角色";
      this.dialogContent = "table";
      this.dialogWidth = "63%";
      this.userDialog = true;
    },

    /**
     * @description:用户表单保存操作
     */
    userFormSubmit(formName) {
      this.dialogContent;
      if (this.dialogContent === "form") {
        this.$refs[formName].$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.addData.id !== null && this.addData.id !== "") {
              this.updateUserSave();
            } else {
              this.addUserSave();
            }
          } else {
            return false;
          }
        });
      }
      if (this.dialogContent === "table") {
        this.updateUserRoleSave();
      }
    },

    /**
     * @description:修改用户信息的保存操作
     */
    updateUserSave() {
      let _this = this;
      updateUser(_this.addData).then(function (res) {
        if(res.data.success){
          _this.utils.message(_this, res.data.msg, 3000);
          _this.getUser(_this.searchData);
          _this.userDialog = false;
        }else{
          _this.utils.message(_this, res.data.msg, 3000);
        }
      });
    },

    /**
     * @description:添加用户信息的保存操作
     */
    addUserSave() {
      let _this = this;
      saveUser(_this.addData).then(function (res) {
        if (res.data.success) {
          _this.utils.message(_this, res.data.msg, 3000);
          _this.getUser(_this.searchData);
          _this.userDialog = false;
        } else {
          _this.utils.message(_this, res.data.msg, 3000);
        }
      });
    },

    /**
     * @description:修改用户角色时的保存操作
     */
    updateUserRoleSave() {
      let userId = this.addData.id;
      let addCheckRows = this.$refs.roleTable.selection;
      let newRoleIds = addCheckRows.map((item) => {
        return item.id;
      });
      let oldRoleIds = this.oldRoleRows.map((item) => {
        return item.roleId;
      });
      let updateRoleRows = [];
      let addRoleRows = [];
      let addRoleIds = this.utils.addArry(oldRoleIds, newRoleIds);
      let deleteRoleIds = this.utils.deleteArry(oldRoleIds, newRoleIds);
      for (let i = 0; i < addCheckRows.length; i++) {
        if (addRoleIds.includes(addCheckRows[i].id)) {
          addRoleRows.push(addCheckRows[i]);
        }
        for (let j = 0; j < this.oldRoleRows.length; j++) {
          if (addCheckRows[i].id == this.oldRoleRows[j].roleId) {
            if (
              addCheckRows[i].effectiveDate !=
                this.oldRoleRows[j].effectiveDate ||
              addCheckRows[i].expirationDate !=
                this.oldRoleRows[j].expirationDate
            ) {
              updateRoleRows.push(addCheckRows[i]);
              break;
            }
          }
        }
      }
      if (
        updateRoleRows.length === 0 &&
        addRoleRows.length === 0 &&
        deleteRoleIds.length === 0
      ) {
        return;
      }
      let _this = this;
      updateUserRole(JSON.stringify({
        userId: userId,
        addRoleRows: addRoleRows,
        deleteRoleIds: deleteRoleIds.join(","),
        updateRoleRows: updateRoleRows,
      })).then((res) => {
        _this.utils.message(_this, res.data.msg, 3000);
        _this.getUser(_this.searchData);
        _this.userDialog = false;
      });
    },

    /**
     * @description:分页选择每页大小触发事件
     */
    handleSizeChange(val) {
      this.pageData.pagesize = val;
      this.getUser(this.searchData);
    },

    /**
     * @description:分页选择某页触发事件
     */
    handleCurrentChange(val) {
      this.pageData.currentPage = val;
      this.getUser(this.searchData);
    },

    /**
     * @description:排序触发事件
     */
    sort(val) {
      this.orderBy = val.prop;
      this.order = val.order;
      this.getUser(this.searchData);
    },

    /**
     * 用户表格选中行时的触发事件
     */
    handleSelectChange(val) {
      this.baseCheckRows = val;
    },
    /**
     * 用户角色表格选中行时的触发事件
     */
    handleRoleSelectChange(val) {
      this.addCheckRows = val;
    },
    /**
     * 用户角色表格点击单元格时的触发事件
     */
    cellClick(row, column) {
      if (column.property === "effectiveDate") {
        row.seen_effective = true;
      }
      if (column.property === "expirationDate") {
        row.seen_expiration = true;
      }
    },
    /**
     * 单元格失去焦点时的触发事件
     */
    inputBlur(row, column) {
      if (column === "effectiveDate") {
        row.seen_effective = false;
      }
      if (column === "expirationDate") {
        row.seen_expiration = false;
      }
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
          label: "切换状态",
          mark: "setState",
          type: "success",
          show: true,
          icon: "el-icon-edit",
          method: (index, row) => {
            this.handleState(index, row);
          },
        },
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
          label: "设置用户角色",
          mark: "setUserRole",
          type: "warning",
          icon: "el-icon-user",
          show: true,
          method: (index, row) => {
            this.handleSetRole(index, row);
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
.el-select .el-input__inner {
  width: 206px;
}
</style>