<template>
  <div>
    <div class="app-container">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="输入帐号" prop="username">
          <el-input :disabled="parentType" v-model="ruleForm.username" :required="true"/>
        </el-form-item>
        <el-form-item label="输入密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="confirmPassword" />
        </el-form-item>
        <el-form-item label="分配角色" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="选择分配的角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleNote"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleForm,'ruleForm')">上传信息</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-form-item label="权限列表">
          <el-checkbox-group v-model="checkAuth">
            <el-checkbox-button disabled v-for="item in authList" :key="item.id" :label="item.authName">{{item.authName}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountManage',
  props: ['staffForm', 'type'],
  data() {
    return {
      check: true,
      parentType: false,
      ruleForm: {
        id: '',
        username: '',
        password: '',
        roleId: ''
      },
      dialogVisible: false,
      checkAuth: [],
      authList: [],
      confirmPassword: '',
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入一个密码', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '选择分配一个角色', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    roleId() {
      return this.ruleForm.roleId
    }
  },
  watch: {
    staffForm(newValue, oldValue) {
      this.ruleForm = newValue
    },
    type(newValue, oldValue) {
      this.parentType = newValue
    },
    roleId(newValue, oldValue) {
      console.log(newValue)
      this.$request.get('/user-auth/role', {
        params: {
          id: newValue
        }
      }).then(res => {
        this.authList = res
      })
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getAuthList()
      if (this.staffForm) {
        this.ruleForm = this.staffForm
        this.parentType = this.type
      }
    },
    getAuthList() {
      this.$request.get('/user-role')
        .then(res => {
          this.roleList = res
        })
    },
    submitForm(form, ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.ruleForm.password !== this.confirmPassword) {
            this.$message.error('两次的密码输入不一致，请重新确认密码')
          } else {
            if (this.parentType) {
              this.$request({
                method: 'put',
                url: '/user-info',
                params: {
                  data: JSON.stringify(form)
                }
              }).then(res => {
                this.$emit('init')
                // this.$parent.init()
                this.$message({
                  message: '恭喜你，成功修改用户信息',
                  type: 'success'
                })
              })
            } else {
              this.$request({
                method: 'post',
                url: '/user-info',
                params: {
                  info: JSON.stringify(form)
                }
              }).then(res => {
                this.$emit('init')
                this.$message({
                  message: '恭喜你，成功添加了一个用户信息',
                  type: 'success'
                })
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
