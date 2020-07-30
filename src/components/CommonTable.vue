<!-- 表格组件 -->
<template>
  <div>
    <!-- 表格属性定义 -->
    <el-table
      :data="tableData"
      :ref="tableName"
      stripe
      border
      max-height="520"
      @selection-change="handleSelectionChange"
    >
      <!-- 表格多选 -->
      <el-table-column type="selection" align="center" width="55"></el-table-column>

      <!-- 表格序号 -->
      <el-table-column type="index" label="序号" align="center" width="55">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageData.currentPage - 1) * pageData.pagesize + 1}}</span>
        </template>
      </el-table-column>

      <!--表格数据列-->
      <template v-for="column in tableHeader">
        <el-table-column
          :prop="column.prop"
          :key="column.label"
          :label="column.label"
          align="center"
          :width="column.width"
        >
          <template slot-scope="scope">
            <ex-slot
              v-if="column.render"
              :render="column.render"
              :row="scope.row"
              :index="scope.$index"
              :column="column"
            ></ex-slot>
            <span v-else>{{scope.row[column.prop]}}</span>
          </template>
        </el-table-column>
      </template>
      <!--endregion-->
      <!-- <el-table-column prop="state" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            @change="changeSwitch(scope.row,scope.$index)">
          </el-switch>
        </template>
      </el-table-column>-->


      <!--表格按钮操作组-->
      <el-table-column label="操作" align="center" v-if="operates.show" :width="operates.width">
        <template slot-scope="scope">
          <template v-for="(btn, key) in operates.list">
          <template v-if="btn.show">
              <el-button
              v-if="btn.mark === 'setState'"
                :key="key"
                :type="scope.row.state == 1 ? 'danger' : 'success'"
                size="mini"
                @click.native.prevent="btn.method(key,scope.row)"
              >{{ scope.row.state == 1 ? '无效' : '有效'}}</el-button>

              <el-button
              v-else
                :key="key"
                :type="btn.type"
                size="mini"
                @click.native.prevent="btn.method(key,scope.row)"
              >{{ btn.label}}</el-button>
          </template>
          </template>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
  </div>
</template>

<script>
var exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    };
    if (data.props.column) params.column = data.props.column;
    return data.props.render(h, params);
  }
};
export default {
  components: {
    "ex-slot": exSlot
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }, // 数据列表
    tableHeader: {
      type: Array,
      default: () => {
        return [];
      }
    }, // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    operates: {}, // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，method：回调方法
    tableName: {
      type: String,
      default: () => {
        return "";
      }
    },
    pageData: {
      type: Object,
      default: () => {
        return {
          currentPage: 1,
          pagesize: 10
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>