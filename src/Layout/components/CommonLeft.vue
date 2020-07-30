<!--  -->
<template>
  
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollage"
    :default-active="openMenu"
  >
    <!-- <el-menu-item v-for="item in noChildren" :key="item.id" index="item.index" @click="clickMenu(item)">
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item> -->

    <el-submenu :index="item.path" v-for="item in addRoutes" :key="item.id">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="subItem.path"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            @click="clickMenu(subItem)">
            <i :class="subItem.icon"></i>{{ subItem.title }}
          </el-menu-item>
        </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    isCollage(){
      return this.$store.state.tab.isCollapse
    },
    ...mapGetters([
      'addRoutes',
      'openMenu'
    ]),
  },
  data() {
    return {
      openeds: ['1'],
      navselected: "/main",
      asideMenu: []
    };
  },
  methods: {
    clickMenu(item) {
      // 完成路由跳转
      this.$router.push({name:item.name})
      this.$store.commit("selectMenu", item);
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
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