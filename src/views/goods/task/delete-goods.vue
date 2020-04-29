<!--用来删除商品的页面-->
<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="danger" @click="handlerDeleteTask">删除选择的店铺商品</el-button>
        </el-form-item>
        <el-form-item>
          <tab-to-mall-operation/>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">
        当前用户店铺信息</el-divider>
      <el-table
        :data="taskList"
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          label="操作店铺"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
<!--            :disabled="scope.row.mallInfo.accessTokenStatus !== '未付费'"-->
            <el-checkbox :label="scope.row.mallInfo.accessTokenStatus" @change="checkboxSelect(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="设置删除商品数" width="160" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.requestCount" size="mini" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="首图"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <img width="60px" height="60px" :src="scope.row.mallInfo.logo">
          </template>
        </el-table-column>
        <el-table-column
          label="店铺名称"
          width="240"
          align="center"
        >
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.mallInfo.mallName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品总数"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.mallInfo.totalCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺描述"
          align="center"
        >
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px" align="left">{{ scope.row.mallInfo.mallDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商户类型"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.mallInfo.merchantType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上架商品数"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.mallInfo.onSaleCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="下架商品数"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.mallInfo.offSaleCount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import TabToMallOperation from '../../../layout/components/tab-to-mall-operation'
export default {
  name: 'DeleteGoods',
  components: { TabToMallOperation },
  data() {
    return {
      loadingText: '数据列表加载中',
      tableLoading: false,
      buttonLoading: false,
      pageNumber: 10,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      requestDeleteTask: {
        delGoodsCount: 0
      },
      taskList: [],
      requestDeleteDetail: [],
      mallList: []
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
      }).then(mallList => {
        for (let i = 0; i < mallList.length; i++) {
          var task = { requestCount: 1000, mallId: mallList[i].id, mallInfo: mallList[i] }
          this.taskList.push(task)
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    checkboxSelect(item) {
      // requestTaskList
      // 先构建一个临时的mallList储存，用来提交时候构建
      if (event.target.checked) {
        this.requestDeleteDetail.push(item)
      } else {
        var index = this.requestDeleteDetail.indexOf(item)
        this.requestDeleteDetail.splice(index, 1)
      }
    },
    handlerDeleteTask() {
      // 防止累加，先归零
      this.requestDeleteTask.delGoodsCount = 0
      this.requestDeleteTask.taskDetailList = this.requestDeleteDetail
      for (let i = 0; i < this.requestDeleteDetail.length; i++) {
        this.requestDeleteTask.delGoodsCount = this.requestDeleteTask.delGoodsCount + this.requestDeleteDetail[i].requestCount
      }
      this.$request({
        url: 'pinduoduo-task-delete-goods/new',
        method: 'post',
        params: {
          task: this.requestDeleteTask
        }
      }).then((res) => {
        this.$message({
          message: '删除商品任务已开启',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
