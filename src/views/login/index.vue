<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div style="text-align: center">
        <img style="width: 140px;height: 140px;text-align: center;margin-bottom: 10px" src="../../assets/111.jpeg">
        <!--        <h3 class="title">鲸品上货助手</h3>-->
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
    </el-form>
    <el-form style="margin-left:10px; text-align: center" :inline="true">
      <el-form-item>
        <el-button :loading="loading" type="danger" style="width:215px" @click.native.prevent="shopAuth">授权登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:215px" @click.native.prevent="handleLogin">账号登录</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="输入帐号" prop="username">
          <el-input v-model="ruleForm.username" class="logon-input" />
        </el-form-item>
        <el-form-item label="输入密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="confirmPassword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogon(ruleForm)">创建用户</el-button>
          <!--                <el-button @click="resetForm('ruleForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭窗口</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
// eslint-disable-next-line no-unused-vars
import { getToken, setToken, setUsername } from '../../utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的姓名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      otherQuery: {},
      dialogVisible: false,
      ruleForm: {
        username: '',
        password: '',
        roleId: 1
      },
      rules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入一个密码', trigger: 'blur' }
        ]
        // projectId: [
        //   { required: true, message: '选择一个工程', trigger: 'change' }
        // ]
      },
      confirmPassword: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    const username = window.localStorage.getItem('username')
    const password = window.localStorage.getItem('password')
    if (username) {
      this.loginForm.username = username
    }
    if (password) {
      this.loginForm.password = password
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showLogonDialog() {
      this.dialogVisible = true
    },
    handleLogin() {
      console.log(this.loginForm.username + this.loginForm.password)
      this.loading = true
      this.$request({
        url: '/local/shop/login',
        method: 'post',
        params: {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
      }).then((res) => {
        console.log('登录返回的结果')
        if (res.code === 1) {
          setToken(res.token)
          setUsername(this.loginForm.username)
          this.$router.push('/')
        }
        // this.$parent.init()
      })
        .finally(() => {
          this.loading = false
        })
    },
    // 注册用户的方法，最好是弹出来一个框
    handleLogon() {
      this.$request({
        method: 'post',
        url: '/user-info',
        params: {
          info: this.ruleForm
        }
      }).then(res => {
        this.$message({
          message: '恭喜你，成功添加了一个用户信息',
          type: 'success'
        })
      })
    },
    shopAuth() {
      console.log('准备请求授权页面')
      this.$request({
        url: '/home/authurl',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res)
          window.location.href = res.authUrl
        })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .el-dialog {
    /*  background: $bg;*/
   }
   .login-container {
     .el-input {
       display: inline-block;
       height: 47px;
       width: 85%;
       /*dialog {*/
      /*  background: transparent*/
      /*}*/
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          /*box-shadow: 0 0 0px 1000px $bg inset !important;*/
          -webkit-text-fill-color: $cursor !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      }

      .logon-input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 2000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-image: url('../../assets/1.jpg');
    background-repeat:no-repeat;
    background-position: center center;
    background-size: cover;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
