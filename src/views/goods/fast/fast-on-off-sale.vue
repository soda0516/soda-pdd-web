<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="任务描述">
          <el-input v-model="requestFaskTask.fastDesc" placeholder="请输入任务描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="handlerOnSale">急速上架</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handlerOffSale">急速下架</el-button>
        </el-form-item>
        <el-form-item>
          <tab-to-mall-operation/>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">
        当前用户店铺信息</el-divider>
      <el-table
        :data="mallList"
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          label="操作店铺"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
<!--            :disabled="scope.row.accessTokenStatus !== '可操作'"-->
            <el-checkbox :label="scope.row.accessTokenStatus" @change="addSale(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
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
          label="请求上架数"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input-number
              type="number"
              size="mini"
              :min="0"
              v-model="scope.row.offSaleCount"
              :max="scope.row.onSaleMax">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="请求下架数"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.onSaleCount"
              size="mini"
              :min="0"
              :max="scope.row.offSaleMax"
>
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import TabToMallOperation from '../../../layout/components/tab-to-mall-operation'
export default {
  name: 'FastOnOffSale',
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
      formInline: {
        user: '',
        region: ''
      },
      requestFaskTask: {
        fastDesc: '',
        fastMallCount: 0,
        taskList: []
      },
      requestMallList: [],
      requestSale: [],
      mallList: []
    }
  },
  mounted() {
    console.log('触发了mounted')
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
        for (let i = 0; i < res.length; i++) {
          res[i].onSaleMax = res[i].offSaleCount
          res[i].offSaleMax = res[i].onSaleCount
        }
        this.mallList = res
      }).finally(() => {
        this.tableLoading = false
      })
    },
    addSale(item) {
      // 先构建一个临时的mallList储存，用来提交时候构建
      if (event.target.checked) {
        this.requestMallList.push(item)
      } else {
        var index = this.requestMallList.indexOf(item)
        this.requestMallList.splice(index, 1)
      }
    },
    handlerOnSale(index, item) {
      // {"id":900,"accessToken":null,"saleType":1,"requestCount":300,"userId":null,"createTime":null,"modifyTime":null}
      // 运行之前先清空
      if (this.requestMallList.length <= 0) {
        this.$message({
          message: '请至少选中一个店铺',
          type: 'warning'
        })
      } else {
        this.requestSale.length = 0
        for (let i = 0; i < this.requestMallList.length; i++) {
          var sale = { mallId: this.requestMallList[i].id, saleType: 1, requestCount: this.requestMallList[i].offSaleCount, userId: this.requestMallList[i].userId }
          this.requestSale.push(sale)
        }
        this.requestFaskTask.fastMallCount = this.requestMallList.length
        this.requestFaskTask.taskList = this.requestSale
      }
      this.loadingText = '一键上架中...'
      this.tableLoading = true
      this.$request({
        url: 'pinduoduo-fast-on-off-sale-task/new',
        method: 'post',
        params: {
          task: this.requestFaskTask
        }
      }).then(res => {
        this.$message({
          message: '成功开启急速上架任务',
          type: 'success'
        })
        // eslint-disable-next-line no-empty
        if (res) {
        } else {
          this.init()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handlerOffSale(index, item) {
      if (this.requestMallList.length <= 0) {
        this.$message({
          message: '请至少选中一个店铺',
          type: 'warning'
        })
      } else {
        // 运行之前先清空
        this.requestSale.length = 0
        for (let i = 0; i < this.requestMallList.length; i++) {
          var sale = { mallId: this.requestMallList[i].id, saleType: 0, requestCount: this.requestMallList[i].onSaleCount, userId: this.requestMallList[i].userId }
          this.requestSale.push(sale)
        }
        this.requestFaskTask.fastMallCount = this.requestMallList.length
        this.requestFaskTask.taskList = this.requestSale
      }
      this.loadingText = '一键下架中...'
      this.tableLoading = true
      this.$request({
        url: 'pinduoduo-fast-on-off-sale-task/new',
        method: 'post',
        params: {
          task: this.requestFaskTask
        }
      }).then(res => {
        this.$message({
          message: '成功开启急速下架任务',
          type: 'success'
        })
        // eslint-disable-next-line no-empty
        if (res) {
        } else {
          this.init()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>
<style scoped>

</style>
