<template>
  <fragment>
    <template v-for="navMenu in navMenus">
      <el-submenu v-if="navMenu.children && navMenu.children.length" :index="navMenu.path" :key="navMenu.id">
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span>{{navMenu.title}}</span>
        </template>
        <nav-menu :navMenus="navMenu.children"></nav-menu>
      </el-submenu>
      <el-menu-item v-else :index="navMenu.path" :key="navMenu.id">
        <i :class="navMenu.icon"></i>
        <span>{{navMenu.title}}</span>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
import NavMenu from "./NavMenu"

export default {
  name: "NavMenu",
  components: {
    NavMenu,
  },
  props: {
    navMenus: {
      type: Array,
    },
  },
  methods: {},
};
</script>
<style scoped>
</style>
