<template>
  <div class="app-container">
    <div
      class="app-container"
      v-loading="tableLoading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="设置循环次数">
          <el-input-number :min="1" v-model="requestCircleTask.circleCount"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="handlerOnSale">开始运行循环上下架</el-button>
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
<!--            :disabled="scope.row.mallInfo.accessTokenStatus !== '可操作'"-->
            <el-checkbox :label="scope.row.mallInfo.accessTokenStatus" @change="checkboxSelect(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          label="首图"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
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
          label="上架数量"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.mallInfo.onSaleCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="下架数量"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.mallInfo.offSaleCount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import TabToMallOperation from '../../../layout/components/tab-to-mall-operation'
export default {
  name: 'CircleOnOffSale',
  components: { TabToMallOperation },
  data() {
    return {
      // [{"id":900,"accessToken":null,"saleType":1,"requestCount":300,"userId":null,"createTime":null,"modifyTime":null}]
      loadingText: '数据列表加载中',
      tableLoading: false,
      buttonLoading: false,
      mallList: [],
      pageNumber: 10,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      formInline: {
        user: '',
        region: ''
      },
      requestSale: [],
      saleList: [],
      requestMallList: [],
      taskList: [
      ],
      requestTaskList: [],
      requestCircleTask: {
        circleCount: 1,
        onOffSaleTaskList: []
      }
    }
  },
  mounted() {
    console.log('触发了mounted')
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
      // this.tableLoading = true
      this.$axios.all([this.getMallList()])
        .then(this.$axios.spread((mallList) => {
          for (let i = 0; i < mallList.length; i++) {
            var task = { saleType: '', requestCount: mallList[i].totalCount, mallId: mallList[i].id, mallInfo: mallList[i] }
            this.taskList.push(task)
          }
        }))
    },
    getMallList() {
      return this.$request({
        url: 'pinduoduo-mall-info/mall-list',
        method: 'get'
      })
    },
    checkboxSelect(item) {
      // 先构建一个临时的mallList储存，用来提交时候构建
      if (event.target.checked) {
        this.requestTaskList.push(item)
      } else {
        var index = this.requestTaskList.indexOf(item)
        this.requestTaskList.splice(index, 1)
      }
    },
    // 提交一个循环上下架任务
    handlerOnSale(index, item) {
      this.requestCircleTask.onOffSaleTaskList = this.requestTaskList
      this.$request({
        url: 'pinduoduo-circle-on-off-sale-task/new',
        method: 'post',
        params: {
          task: this.requestCircleTask
        }
      }).then((res) => {
        this.$message({
          message: '成功开启循环上下架任务',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
