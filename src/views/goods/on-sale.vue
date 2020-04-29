<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="输入令牌">
        <el-input v-model="token"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">一键上架</el-button>
        <el-button @click="xiajia">一键下架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'OnSale',
  data() {
    return {
      token: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      pageNumber: 12,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1
    }
  },
  methods: {
    onSubmit() {
      this.$request({
        url: '/on-sale',
        method: 'post',
        params: {
          token: this.token,
          code: 1
        }
      }).then(res => {
        console.log(res)
        // this.redirect ||
      })
    },
    xiajia() {
      this.$request({
        url: '/on-sale',
        method: 'post',
        params: {
          token: this.token,
          code: 0
        }
      }).then(res => {
        console.log(res)
        // this.redirect ||
      })
    },
    // 获取工程分页列表
    getTaskResult(item, currentPage) {
      // this.taskResultList = []
      this.tableLoading = true
      this.$request({
        url: 'inspect-project/list/all',
        method: 'get',
        params: {
          currentPage: currentPage,
          pageCount: this.pageNumber
        }
      }).then(res => {
        if (res.records) {
          // eslint-disable-next-line no-undef
          this.taskResultList = res.records
          this.pageTotal = res.total
          this.pageSize = res.size
        }
        // this.redirect ||
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
