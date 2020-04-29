<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="输入帐号" prop="username">
        <el-input v-model="username" disabled :required="true"/>
      </el-form-item>
      <el-form-item label="输入密码" prop="password" :required="true">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="confirmPassword" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword()">上传信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AccountModify',
  data() {
    return {
      username: '',
      ruleForm: {
        password: ''
      },
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
        ],
        roleId: [
          { required: true, message: '选择分配一个角色', trigger: 'change' }
        ]
        // projectId: [
        //   { required: true, message: '选择一个工程', trigger: 'change' }
        // ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.username = this.$store.getters.name
    },
    changePassword() {
      this.$request({
        url: '/user-info/password',
        method: 'put',
        params: {
          data: this.ruleForm
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
