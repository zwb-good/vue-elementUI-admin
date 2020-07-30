<!-- dialog组件 -->
<template>
  <div>
    <el-dialog :title="dialogData.title" :visible.sync="dialogData.show">
      <div v-html="dialogData.html">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="`${dialogData.show} = false`">取 消</el-button>
        <el-button type="primary" @click="dialogSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{
      dialogData:{
        type:Object,
        required:true,
        default: () => {}
      }
    },
    data() {
      return {

      }
    },
    methods:{
      dialogSave() {
        this.$emit("dialogSave");
      }
    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */

</style>