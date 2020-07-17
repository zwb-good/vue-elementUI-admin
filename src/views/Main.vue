<template>
  <el-container style="height: 100%">
    <el-aside width="auto"><common-left></common-left></el-aside>
    <el-container>
      <el-header><common-header></common-header></el-header>
      <!-- <common-tab></common-tab> -->
      <el-main >
        <div id="tabMain">
        <router-view v-if="isRouterAlive"/>
        </div>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonHeader from "../components/CommonHeader"
import CommonLeft from "../components/CommonLeft"
/* import CommonTab from "../components/CommonTab"*/
export default { 
  name: 'tabMain',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {
    CommonHeader,
    CommonLeft/* ,
    CommonTab */
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-header {
  background: rgb(84, 92, 100);
}
</style>