<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="u_no">
      <el-input type="text" v-model="loginForm.u_no" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-form-item prop="code">
      <el-input type="text" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" style="width: 56%;margin-right: 10px;"></el-input>
      <el-image style="width: 40%;vertical-align: middle;" :src="url" fit="cover" @click="changeverifyCode"></el-image>
    </el-form-item>

    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <span v-if="msg" style="display: block;margin-bottom: 22px;color: #F56C6C;text-align: left;">{{login_message}}</span>

    <el-form-item style="width:100%;">
      <el-button type="success" style="width:100%;" @click="submitForm('loginForm')" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      loginForm: { //登陆表单数据用户名，密码，验证码
        u_no: "",
        password: "",
        code: ""
      },
      login_message: "",
      url: "api/user/captcha", //获取后台验证码图片
      logining: false, //登陆时的图标转动等待
      msg: false, //控制错误消息提示框是否隐藏
      rules: {  //校验规则
        u_no: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: '请输入四位数验证码', trigger: 'blur' }
        ]
      },
    };
  },
  mounted() {},
  methods: {
    /** 
     * 表单提交方法
    */
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let _this = this;
          this.logining = true;
          this.$axios
            .post("api/user/login", _this.$qs.stringify(_this.loginForm))
            .then(response => {
              let data = response.data;
              if (data.success) {
                _this.msg = false;
                //渲染拥有的权限菜单，并存放用户信息
                window.sessionStorage.setItem("token",_this.$qs.stringify(data.rows[0]));
                /* console.log(_this.$router.options);
                _this.$router.addRoutes(_this.$router.options.asyncRoutes);
                console.log(_this.$router.options); */
                /* console.log(222)
                console.log(_this.$router.options.asyncRoutes)
                console.log(333) */
                //_this.$router.addRoutes(_this.$store.commit("login", data.rows[0]));
                _this.logining = false;
                //登陆成功跳转到拥有权限的第一个页面
                _this.$router.push({name: data.rows[0].menuList[0].children[0].name});
              } else {
                _this.msg = true;
                _this.login_message = data.msg;
                _this.changeverifyCode();
                _this.logining = false;
              }
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
      this.url = "api/user/captcha?date=" + new Date().valueOf();
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate();
      })
    }
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
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>