<template>
  <div class="app-container">
    <el-steps v-if="showSuccess" :space="200" :active="step" finish-status="success">
      <el-step title="用户请求授权" />
      <el-step title="确认授权" />
      <el-step title="拼多多颁发秘钥" />
      <el-step title="后台更新秘钥" />
      <el-step title="关闭回调页面" />
    </el-steps>
    <el-steps v-show="showError" :space="200" :active="step" finish-status="success">
      <el-step title="用户请求授权" />
      <el-step title="授权过程异常" />
      <el-step title="关闭回调页面" />
    </el-steps>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getToken, setToken } from '../utils/auth'
export default {
  name: 'Callback',
  data() {
    return {
      step: 1,
      showSuccess: false,
      showError: true
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },
  mounted() {
    // const code = this.$utils.getUrlKey('code')
    // const state = this.$utils.getUrlKey('state')
    console.log('回调页面')
    // const hasToken = getToken()
    // var that = this
    // if (code) {
    //   console.log('显示当前的token')
    //   console.log(hasToken)
    //   if (state > 0) {
    //     this.getAuthReload(that, code, state)
    //   } else {
    //     this.getAuth(that, code, state)
    //   }
    //   // if (hasToken) {
    //   //   this.getAuthReload(that, code, state)
    //   // } else {
    //   //   this.getAuth(that, code, state)
    //   // }
    // }
  },
  methods: {
    getAuth(that, code, state) {
      console.log('进入获取授权的方法')
      that.$request({
        method: 'get',
        url: 'user-access-token/code-state-generate',
        params: {
          code: code,
          state: state
        }
      }).then((userInfoForLogin) => {
        that.showSuccess = true
        that.showError = false
        const time = window.setInterval(function() {
          that.step = that.step + 1
          if (that.step >= 6) {
            that.$store.dispatch('user/login', userInfoForLogin)
              .then(() => {
                window.localStorage.setItem('username', userInfoForLogin.username)
                window.localStorage.setItem('password', userInfoForLogin.password)
                that.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              })
            window.clearInterval(time)
          }
        }, 300)
      }).catch(() => {
        that.showStep = false
        that.step = 2
        const time = window.setInterval(function() {
          that.step = that.step + 1
          if (that.step >= 4) {
            that.$router.push({ path: '/login' })
            window.clearInterval(time)
          }
        }, 300)
      })
    },
    getAuthReload(that, code, state) {
      console.log('reload方法里面')
      that.$request({
        method: 'get',
        url: 'user-access-token/code-state-add',
        params: {
          code: code,
          state: state
        }
      }).then((userInfoForLogin) => {
        that.showSuccess = true
        that.showError = false
        window.localStorage.setItem('username', userInfoForLogin.username)
        window.localStorage.setItem('password', userInfoForLogin.password)
        const time = window.setInterval(function() {
          that.step = that.step + 1
          if (that.step >= 6) {
            that.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            window.clearInterval(time)
          }
        }, 300)
      }).catch(() => {
        that.showStep = false
        that.step = 2
        const time = window.setInterval(function() {
          that.step = that.step + 1
          if (that.step >= 4) {
            this.$router.push({ path: '/' })
            window.clearInterval(time)
          }
        }, 300)
      })
    }
  }
}
</script>

<style scoped>

</style>
