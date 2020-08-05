<template>
  <div class="header">
    <div class="l-content">
      <el-button type="primary" icon="el-icon-menu" size="mini" @click="collapseMenu"></el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{current.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <em style="font-size: 16px;color: #409eff;margin-right:15px;vertical-align: middle;">{{name}}</em>
      <el-dropdown style="vertical-align: middle;">
        <span class="el-dropdown-link">
          <el-avatar size="medium" :src="userImg"></el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  props: [""],
  data() {
    return {
      userImg: require("@/assets/images/userHeader.jpg"),
      username: "",
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.tab.currentMenu,
      name: (state) => state.user.name,
    }),
  },
  components: {},
  mounted: function () {
  },
  methods: {
    // 点击后收缩
    collapseMenu() {
      this.$store.commit("collapseMenu");
    },
    // 点击后退出
    logout() {
      this.$confirm("确认要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("user/logout").then(() => {
            this.$store.commit("permission/SET_ADDROUTES",[])
            this.$router.push({ path: "/login" });
            location.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
</style>
<style lang="scss">
.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #ffffff;
    font-weight: normal;
  }
  &:last-child {
    .el-breadcrumb__inner {
      color: #ffffff;
    }
  }
}
.is-link {
  color: #ffffff !important;
}
</style>