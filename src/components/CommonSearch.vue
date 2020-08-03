<!-- 表单 -->
<template>
  <div>
    <el-form
      :inline="true"
      class="demo-form-inline"
      :size="size"
      :ref="formName"
      :label-width="labelWidth"
      :rules="rules"
      :model="searchData"
    >
      <el-form-item
        v-for="item in searchForm"
        :label="item.label"
        :key="item.prop"
        :prop="item.prop"
      >
        <!-- 输入框 -->
        <el-input
          v-if="item.type==='input'"
          :type="`${item.isPassWord?'password':'text'}`"
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          :suffix-icon="item.prop==='icon'?searchData[item.prop]:item.icon"
        ></el-input>

        <!-- 下拉框 -->
        <el-select
          v-if="item.type==='select'"
          v-model="searchData[item.prop]"
          :placeholder="item.placeholder"
          :style="item.style"
        >
          <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value"></el-option>
        </el-select>

        <!-- 单选 -->
        <el-radio-group v-if="item.type==='radio'" v-model="searchData[item.prop]">
          <el-radio v-for="ra in item.options" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
        </el-radio-group>

        <!-- 日期时间 -->
        <el-date-picker
          v-if="item.type==='dateTime'"
          type="daterange"
          v-model="searchData[item.prop]"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <el-date-picker
          v-if="item.type==='dateTimeOne'"
          v-model="searchData[item.prop]"
          type="date"
          :placeholder="item.placeholder"
        ></el-date-picker>

        <!-- 下拉菜单树 -->
        <select-tree
          v-if="item.type==='selectTree'"
          :props="menuSelectTree"
          :options="item.options"
          :value="searchData[item.prop]"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
          height="200"
          style="width: 94%"
        ></select-tree>

      </el-form-item>
      <el-form-item v-for="item in searchHandle" :key="item.label">
        <div v-if="item.show">
          <el-button :type="item.type" @click.native.prevent="item.method()">{{item.label}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SelectTree from "@/views/menu/CommonSelectTree";
export default {
  components: {
    SelectTree,
  },
  props: {
    searchForm: {
      type: Array,
      default: () => [],
    },
    searchHandle: {
      type: Array,
      default: () => [],
    },
    searchData: {
      type: Object,
      default: () => {},
    },
    labelWidth: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "mini",
    },
    formName: {
      type: String,
      required: true,
    },
    rules: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 1, // 初始ID（可选）
      menuSelectTree: {
        // 配置项（必选）
        value: "id",
        label: "title",
        children: "children"
        // disabled:true
      },
    };
  },
  methods: {
    submit: () => {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          return true;
        } else {
          return false;
        }
      });
    },
    getValue(value) {
      this.searchData.parentId = value
    }
  }
};
</script>
<style>
</style>