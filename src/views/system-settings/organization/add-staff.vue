<template>
    <div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="输入帐号" prop="username">
          <el-input v-model="ruleForm.username" :disabled="parentType"/>
        </el-form-item>
        <el-form-item label="输入密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="confirmPassword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogon(ruleForm,'ruleForm')">创建用户</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭窗口</el-button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'AddStaff',
  data() {
    return {
      ruleForm: {
        id: '',
        username: '',
        password: '',
        roleId: '',
        projectId: ''
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
      }
    }
  }
}
</script>

<style scoped>

</style>
