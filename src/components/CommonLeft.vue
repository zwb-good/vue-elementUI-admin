<!--  -->
<template>
  
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollage"
    :default-active="navselected"
    @open="handleOpen" 
    @close="handleClose"
  >
    <!-- <el-menu-item v-for="item in noChildren" :key="item.id" index="item.index" @click="clickMenu(item)">
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item> -->

    <el-submenu :index="item.level" v-for="item in asideMenu" :key="item.id">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="subItem.level"
          v-for="(subItem, subIndex) in item.children"
          :key="subIndex"
           @click="clickMenu(subItem)"
          ><i :class="subItem.icon"></i>{{ subItem.label }}</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  computed: {
    isCollage(){
      return this.$store.state.tab.isCollapse
    }
  },
  data() {
    return {
      openeds: ['1'],
      navselected: "2-1",
      asideMenu: []
    };
  },
  methods: {
    clickMenu(item) {
      // 完成路由跳转
      this.$router.push({name:item.name})
      this.$store.commit("selectMenu", item);
    },
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    if (window.sessionStorage.getItem("token")) {
      let data = this.$qs.parse(window.sessionStorage.getItem("token"));
      //let menuList = this.utils.buildMenuTree(data.menuList,-1);
      /* this.asideMenu = menuList
      this.navselected = menuList[0].children[0].level; */
      this.asideMenu = data.menuList
      this.navselected = data.menuList[0].children[0].level;
    } else {
      this.$router.push({ name: "login" });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-menu {
  height: 100%;
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>