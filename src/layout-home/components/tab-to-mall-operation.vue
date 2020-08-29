<template>
  <span>注：任务完成后，请及时更新店铺信息！<el-link type="primary" @click="tabToMallOperation">点击快速切换到商品管理页面</el-link></span>
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
