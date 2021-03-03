<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>默认密码为:000000，请及时修改密码</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="text item">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" size="small">
          <el-form-item label="输入帐号" prop="username">
            <el-input v-model="username" readonly :required="true" />
          </el-form-item>
          <el-form-item label="输入旧密码" prop="password" :required="true">
            <el-input v-model="password" />
          </el-form-item>
          <el-form-item label="输入新密码" prop="confirmPassword">
            <el-input v-model="confirmPassword" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword()">修改密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUsername, getToken } from '../../utils/auth'
export default {
  name: 'AccountModify',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      checkAuth: [],
      authList: [],
      rules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入一个密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.username = getUsername()
    },
    changePassword() {
      // username: "账号", oldpassword: "密码", newpassword: "密码"
      this.$request({
        url: '/local/shop/changepass?token=' + getToken(),
        method: 'post',
        params: {
          username: this.username,
          oldpassword: this.password,
          newpassword: this.confirmPassword
        }
      }).then(() => {
        // this.$parent.init()
        this.$message({
          message: '恭喜你，成功修改用户信息',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
