<template>
  <span>注：成功开启任务后，请等待云端运行，更新店铺信息后，获取任务结果！<el-link type="primary" @click="tabToMallOperation">点击查看</el-link></span>
</template>

<script>
export default {
  name: 'TabToMallOperation',
  methods: {
    tabToMallOperation() {
      this.$router.push({ name: 'MallOperation' })
    }
  }
}
</script>

<style scoped>

</style>
