<template>
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollage"
    :default-active="openMenu"
    @select="select"
  >
    <nav-menu :nav-menus="addRoutes"></nav-menu>
  </el-menu>
</template>

<script>
import NavMenu from "./NavMenu";
import { mapGetters } from "vuex";

export default {
  components: {
    NavMenu,
  },
  data() {
    return {};
  },
  computed: {
    isCollage() {
      return this.$store.state.tab.isCollapse;
    },
    ...mapGetters(["addRoutes", "openMenu"]),
  },
  methods: {
    select(path) {
      this.$router.push({ path: path });
    },
  },
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
