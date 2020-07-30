<!-- 分页组件 -->
<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :hide-on-single-page="pageData.hide"
      :current-page="pageData.currentPage"
      :page-sizes="pageData.sizes"
      :page-size="pageData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total" style="margin-top: 20px">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    props:{
      pageData:{
        type:Object,
        required:true
      }
    },
    data() {
      return {

      }
    },
  methods: {
    /** 
     * @description:分页选择每页大小触发事件
    */
    handleSizeChange(val) {
      this.$emit("handleSizeChange",val);
    },

    /** 
     * @description:分页选择某页触发事件
    */
    handleCurrentChange(val) {
      console.log("11"+val)
      this.$emit("handleCurrentChange",val);
    },
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */

</style>