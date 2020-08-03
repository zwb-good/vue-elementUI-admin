<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录表单区域 -->
      <el-form size="middle" :model="loginForm" :rules="rules" ref="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="用户名" v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input placeholder="密码" show-password v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-input class="code" placeholder="验证码" v-model="loginForm.code"></el-input>
          <a @click="changeverifyCode">
            <img :src="url" />
          </a>
        </el-form-item>
        <!-- 记住我 -->
        <el-form-item>
          <el-checkbox label="记住我" class="rememberMe"></el-checkbox>
          <span v-if="msg" style="float: right;color: #F56C6C;">{{login_message}}</span>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="lizi"
      style="height:100%"
    >
    </vue-particles>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        //登陆表单数据用户名，密码，验证码
        username: "",
        password: "",
        code: "",
      },
      login_message: "",
      url: "/devApi/user/captcha", //获取后台验证码图片
      logining: false, //登陆时的图标转动等待
      msg: false, //控制错误消息提示框是否隐藏
      rules: {
        //校验规则
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "请输入四位数验证码", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    /**
     * @description: 登录,表单提交
     * @param {type}
     * @return:
     */

    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        let _this = this;
        if (valid) {
          this.logining = true;
          this.$store
            .dispatch("user/login", this.$qs.stringify(this.loginForm))
            .then((response) => {
              if (response.success) {
                _this.msg = false;
                _this.logining = false;
                _this.$router.push({ path: "/dashboard" });
              } else {
                _this.msg = true;
                _this.login_message = response.msg;
                _this.changeverifyCode();
                _this.logining = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 验证码图片换一换
     */
    changeverifyCode() {
      this.url = "devApi/user/captcha?date=" + new Date().valueOf();
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate();
      });
    },
    /* filterAsyncRouter(data) {
      //遍历后台传来的路由字符串，转换为组件对象
      let addRoute = [{
        path: '/main',
        component: () => import('@/views/Main.vue'),
        children: []
      }]
      for(let i in data){
        for(let j in data[i].children){
          let route = data[i].children[j];
          route.component = resolve =>
            require(["@/view" + data[i].children[j].component + ".vue"], resolve);
            addRoute[0].children.push(route);
        }
      }
      return addRoute;
    } */
  },
};
</script>

<style scoped>
.login_container {
  background-image: linear-gradient(-180deg, #1a1454 0%, #0e81a5 100%);
  /*background-image: url("../images/bg_login.png");*/
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}
.login_box {
  width: 315px;
  height: 385px;
  /* background-color: #fff; */
  background-color: #2e527bb3;
  border-radius: 5px;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.el-form {
  padding: 32px;
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
}
.el-button {
  width: 100%;
}
.code {
  width: 45%;
}
img {
  /* style="width: 100px; height: 30px; margin-left:5px;vertical-align: middle;" */
  display: line-inline;
  width: 45%;
  height: 35px;
  margin-left: 10px;
  vertical-align: middle;
  border-radius: 3px;
}
.rememberMe {
  color: #fff;
}
</style>