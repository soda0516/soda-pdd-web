<template>
  <div class="app-container">
    <el-table
      :data="mallList"
      style="width: 100%"
      :border="true"
    >
      <el-table-column
        label="首图"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <img width="60px" height="60px" :src="scope.row.logo">
        </template>
      </el-table-column>
      <el-table-column
        label="店铺名称"
        width="240"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mallName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品总数"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="店铺描述"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px" align="left">{{ scope.row.mallDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商户类型"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.merchantType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上架"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.onSaleCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="下架"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.offSaleCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteMall(scope.row)">删除店铺</el-button>
<!--          <span style="margin-left: 10px">{{ scope.row.offSaleCount }}</span>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MallDelete',
  data() {
    return {
      loadingText: '数据列表加载中',
      tableLoading: false,
      buttonLoading: false,
      mallList: [],
      pageNumber: 10,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
      this.tableLoading = true
      this.$request({
        url: 'pinduoduo-mall-info/mall-list',
        method: 'get'
      }).then(res => {
        this.mallList = res
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /**
     * 删除一个店铺信息和accessToken
     * @param item
     */
    deleteMall(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request({
          url: '/pinduoduo-mall-info',
          method: 'delete',
          params: {
            mall: item
          }
        }).then(() => {
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
