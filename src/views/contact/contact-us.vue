<template>
  <div class="app-container">
    <el-col :span="6">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="QQ号">
          <el-link type="primary">{{form.name}}</el-link>
<!--          <el-input v-model="form.name"></el-input>-->
        </el-form-item>
        <el-form-item label="说明">
          <label>(如果软件使用过程中出现问题，或者对软件本身有何改进意见，请添加技术人员QQ号咨询)</label>
<!--          <el-select v-model="form.region" placeholder="请选择活动区域">-->
<!--            <el-image-->
<!--              style="width: 191px; height: 228px"-->
<!--              :src="url"-->
<!--              :fit="fit"></el-image>-->
<!--          </el-select>-->
        </el-form-item>
      </el-form>
    </el-col>
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
