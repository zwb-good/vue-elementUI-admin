<template>
  <div class="about">
    <el-table :data="tableData" border stripe row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%" height="480">
      <el-table-column prop="label" label="名称" align="center" width="180"></el-table-column>
      <el-table-column prop="name" label="路由" align="center" width="150"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="150">
        <template slot-scope="scope">
             <i :class="`${scope.row.icon}`"></i>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="地址" align="center" width="250"></el-table-column>
      <el-table-column prop="level" label="序号" align="center" width="250"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加，修改用户弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="menuDialog">
      <el-form :model="menuForm" :inline=true :rules="rules" ref="menuForm">
        <el-input v-model="menuForm.id" prop="id" type="hidden" ></el-input>
        <el-form-item label="上级菜单" label-width="120px" prop="roleId">
          <select-tree
            :props="menuSelectTree"
            :options="tableData"
            :value="valueId"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue($event)"
            height="200"
            style="width: 94%"
          ></select-tree>
        </el-form-item>
        <el-form-item label="菜单名" label-width="105px" prop="label">
          <el-input v-model="menuForm.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由" label-width="120px" prop="name">
          <el-input v-model="menuForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面地址" label-width="120px" prop="component">
          <el-input v-model="menuForm.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="顺序" label-width="120px" prop="level">
          <el-input v-model="menuForm.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="120px" prop="icon">
          <el-input v-model="menuForm.icon" autocomplete="off" :suffix-icon="`${menuForm.icon}`"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialog = false">取 消</el-button>
        <el-button type="primary" @click="menuTreeSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import SelectTree from "../components/CommonSelectTree";

export default {

  components: {
    SelectTree
  },

  data() {
    return {
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 1, // 初始ID（可选）
      menuSelectTree: {
        // 配置项（必选）
        value: "id",
        label: "label",
        children: "children"
        // disabled:true
      },
      menuForm: {  //菜单表单
        label: "",
        name: "",
        level: '',
        component: "",
        icon: "",
        id:''
      },
      rules: {  
      },
      menuDialog: false, //添加用户表单模态框
      tableData: [], //表格数据
      dialogTitle: "编辑菜单"
    };
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted: function() {
    var _this = this; //很重要！！
    _this.getmenu();
  },
  methods: {
    //重置用户表单数据
    handleEdit(index, row) {
      this.menuForm = Object.assign({}, row);
      let parentMenu = this.utils.treeFindPath(this.tableData, data=> data.label === row.label)
      this.valueId = parentMenu[parentMenu.length-2]
      this.menuDialog = true;
    },
    handleDelete(index, row) {
      let _this = this;
      this.$confirm('确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
        .post("/api/menu/delete", _this.$qs.stringify({"id":row.id}))
        .then(function(res) {
          _this.utils.message(_this,res.data.msg,3000);
          _this.getmenu(_this.searchForm)
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
    //打开模态框
    openmenuDialog(formName) {
      this.menuDialog = true;
      this.resetmenuForm();
      this.$nextTick(()=>{
        this.$refs[formName].clearValidate();
      })
    }, 
    //获取表格数据
    getmenu() {
      let _this = this;
      this.$axios
      .get("/api/menu/select")
      .then(function(res) {
        _this.tableData = res.data.rows;
      })
      .catch(function(error) {
        _this.utils.message(_this,error,3000);
      });
    },
    //添加、修改用户保存
    menuTreeSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this;
          var url = null;
          if(this.menuForm.id !== null && this.menuForm.id !== ""){
            url = '/api/menu/update';
          }else{
            url = '/api/menu/save';
          }
          this.$axios
            .post(url, _this.$qs.stringify(_this.menuForm))
            .then(function(res) {
              _this.utils.message(_this,res.data.msg,3000);
              _this.getmenu(_this.searchForm)
              _this.menuDialog = false;
            })
            .catch(function(error) {
              _this.utils.message(_this,error,3000);
            });
        } else {
          return false;
        }
      });
    },
    getValue(value) {
      this.valueId = value;
      console.log(this.valueId);
    }
  }
};
</script>