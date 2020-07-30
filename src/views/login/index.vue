<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-form-item prop="code" class="verifyCode">
      <el-input type="text" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码"></el-input>
      <el-image :src="url" fit="cover" @click="changeverifyCode"></el-image>
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
        username: "",
        password: "",
        code: ""
      },
      login_message: "",
      url: "/devApi/user/captcha", //获取后台验证码图片
      logining: false, //登陆时的图标转动等待
      msg: false, //控制错误消息提示框是否隐藏
      rules: {  //校验规则
        username: [
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
     * @description: 登录,表单提交
     * @param {type} 
     * @return: 
     */    
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        let _this = this;
        if (valid) {
          this.logining = true;
          this.$store.dispatch('user/login', this.$qs.stringify(this.loginForm))
        .then(response => {
          if (response.success) {
            _this.msg = false;
            _this.logining = false;
            _this.$router.push({path: "/user"});
          } else {
            _this.msg = true;
            _this.login_message = response.msg;
            _this.changeverifyCode();
            _this.logining = false;
          }
        })
        .catch(() => {
              this.loading = false
            })
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
@import "@/styles/login.scss"
</style>