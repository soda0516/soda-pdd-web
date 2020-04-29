<template>
    <div class="app-container">
<!--      :on-exceed="handleExceed"-->
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
<!--            <el-tab-pane label="公司设置" name="first"><basic-data></basic-data></el-tab-pane>-->
<!--            <el-tab-pane label="职务设置" name="second"><post-info></post-info></el-tab-pane>-->
<!--            <el-tab-pane label="工种设置" name="third"><profession-settings></profession-settings></el-tab-pane>-->
<!--            <el-tab-pane label="增加员工" name="fourth"><add-staff></add-staff></el-tab-pane>-->
            <el-tab-pane label="账户管理" name="first"><account-manage v-if="isChildUpdate1"></account-manage></el-tab-pane>
            <el-tab-pane label="员工维护" name="second"><staff-maintenance v-if="isChildUpdate2"></staff-maintenance></el-tab-pane>
<!--            <el-tab-pane label="权限分配" name="third"><AuthManage/></el-tab-pane>-->
          </el-tabs>
    </div>
</template>

<script>
// import BasicData from './organization/basic-data'
// import PostInfo from './organization/post-info'
// import ProfessionSettings from './organization/profession-settings'
// import AuthManage from './organization/auth-manage'
import StaffMaintenance from './organization/staff-maintenance'
import AccountManage from './organization/account-manage'
export default {
  name: 'OrganizationSettings',
  components: { AccountManage, StaffMaintenance },
  data() {
    return {
      file: '',
      fileList: [],
      activeName: 'first',
      fullscreenLoading: false,
      input: '',
      fileInfo: {
        fileName: '',
        urlCount: 0
      },
      goodsAddress: '',
      tableData: [],
      start: 0,
      pageNumber: 1,
      isChildUpdate1: true,
      isChildUpdate2: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleClick(tab) {
      if (tab.name === 'first') {
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
        // eslint-disable-next-line eqeqeq
      } else if (tab.name === 'second') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
      }
    }
  }
}
</script>

<style scoped>

</style>
