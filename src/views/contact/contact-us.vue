<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>欢迎使用鲸品上货助手，使用过程中如有任何问题，请与我们联系:</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="100px" size="small">
          <el-form-item label="邮箱地址：">
            <span>66640005@qq.com</span>
          </el-form-item>
          <el-form-item label="手机号码：">
            <span>15928152295</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ContactUs',
  data() {
    return {
      form: {
        name: '434898928'
      }
      // eslint-disable-next-line no-undef
      // url: require('/assets/名片.jpg')
      // url: 'https://pjzbz.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200405192405.jpg'
    }
  }
}
</script>

<style scoped>

</style>
