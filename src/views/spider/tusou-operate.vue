<template>
  <div>
    <div class="app-container">
      <div class="demo-image__placeholder">
        <div class="block">
          <span class="demonstration">默认</span>
          <el-image :src="src"></el-image>
        </div>
        <div class="block">
          <span class="demonstration">自定义</span>
          <el-image :src="src">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </div>
      <el-button
        type="danger"
        @click="updateDb">更新档口信息</el-button>
      <el-button
        type="danger"
        @click="updateShopItemInfo" >更新各档口中商品信息</el-button>
    </div>
    <div class="app-container">
      <div
        v-loading="tableLoading"
        class="app-container"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading">
        <el-table
          :data="tableData"
          style="width: 100%"
          :border="true"><el-table-column
          label="店铺名称"
          width="180">
            <template slot-scope="scope">
              <!--            <i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.shopName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商铺链接"
            width="420">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.shopUrl }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="店铺地址"
            width="240">
            <template slot-scope="scope">
              <!--            <i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.shopAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上传量"
            width="90">
            <template slot-scope="scope">
              <!--            <i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.uploadVolume }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="销售量"
            width="90">
            <template slot-scope="scope">
              <!--            <i class="el-icon-time"></i>-->
              <span style="margin-left: 10px">{{ scope.row.salesVolume }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleTaskDownload(scope.$index, scope.row)">下载</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleTaskDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="app-container">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageTotal"
            style="float:right;margin-bottom: 100px"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TusouOperate',
  data() {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      tableData: [],
      start: 0,
      pageNumber: 10,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      tableLoading: false,
      fullscreenLoading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getList(1, this.pageNumber)
    },
    getList(current) {
      // tusou/task/list
      // console.log(index, row)
      this.tableLoading = true
      this.$request({
        url: 'tusou-stall-shop-info/list',
        method: 'get',
        params: {
          current: current,
          pages: this.pageNumber

        }
      }).then(res => {
        console.log(res)
        this.tableData = res.records
        this.pageTotal = res.total
        this.pageSize = res.size
        // this.redirect ||
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleTaskDelete() {
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList(val)
    },
    handleTaskDownload(index, row) {
      this.fullscreenLoading = true
      const xlsName = row.shopName
      console.log('row')
      console.log(JSON.stringify(row))
      this.$request({
        responseType: 'blob',
        method: 'post',
        url: '/tusou-stall-shop-item-info/excel/download',
        // url: 'https://api.loongwine.cn/cantfind/spider/api/spider/tusou/task/download',
        params: {
          task: JSON.stringify(row)
        }
      }).then(res => {
        const blob = new Blob([res])// 处理文档流
        const fileName = xlsName + '.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        // this.redirect ||
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    updateDb() {
      this.$request({
        method: 'post',
        url: '/tusou-stall-shop-info/db'
      }).then((res) => {
        if (res) {
          this.$message({
            message: '后台有档口信息正在采集，请稍后，可能需要等待较长时间',
            type: 'warning'
          })
        }
        this.getList(1)
        // alert('更新完毕！')
      })
    },
    updateShopItemInfo() {
      this.$request({
        method: 'get',
        url: '/tusou-stall-shop-item-info/excel/download/no'
      }).then((res) => {
        if (res) {
          this.$message({
            message: '后台有档口信息正在采集，请稍后，可能需要等待较长时间',
            type: 'warning'
          })
        }
        this.getList(1)
        // alert('更新完毕！')
      })
    }
  }
}

</script>

<style scoped>

</style>
