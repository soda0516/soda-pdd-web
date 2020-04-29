<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="username"
        label="帐号名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="userRole.roleNote"
        label="角色名称"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
<!--          <el-button type="primary" @click="handleClick(scope.row)" size="small">查看</el-button>-->
          <el-button type="warning" @click="showDialog(scope.row)" size="small">编辑</el-button>
          <el-button type="danger" @click="deleteUser(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <AccountManage @init="init" :staff-form="parentToChildForm" :type="parentToChildType"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭窗口</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AccountManage from './account-manage'
export default {
  name: 'StaffMaintenance',
  components: { AccountManage },
  data() {
    return {
      parentToChildForm: '',
      parentToChildType: true,
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    console.log('activated')
  },
  methods: {
    init() {
      this.$request({
        method: 'get',
        url: '/user-info/list/detail'
      }).then(res => {
        this.tableData = res
        // this.$message({
        //   message: '恭喜你，成功添加了一个用户信息',
        //   type: 'success'
        // })
      })
    },
    // dialogFormVisible = true
    showDialog(form) {
      this.parentToChildForm = form
      this.dialogFormVisible = true
    },
    deleteUser(row) {
      this.$confirm('此操作将永久删除该帐号信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/user-info', {
          params: {
            id: row.id
          }
        }).then(res => {
          this.init()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
