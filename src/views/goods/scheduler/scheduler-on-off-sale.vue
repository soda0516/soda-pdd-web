<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="设置定时">
        <div
          v-loading="tableLoading"
          class="app-container"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
        >
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="设置时间">
              <el-select style="width: 120px" v-model="selectScheduler" placeholder="运行时间">
                <el-option
                  v-for="item in timeList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="说明">
              <el-input v-model="requestSchedulerTask.cronDesc" placeholder="" />
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="handlerOnSale">设置上架</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="handlerOffSale">设置下架</el-button>
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
<!--                :disabled="scope.row.mallInfo.accessTokenStatus !== '可操作'"-->
                <el-checkbox :label="scope.row.mallInfo.accessTokenStatus" @change="checkboxSelect(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column
              label="请求数量"
              width="240"
              align="center"
            >
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.requestCount" size="mini" />
                <!--            <i class="el-icon-time"></i>-->
                <!--                <span style="margin-left: 10px">{{ scope.row.mallInfo.mallName }}</span>-->
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
      </el-tab-pane>
      <el-tab-pane label="任务列表">
        <div
          v-loading="tableLoading"
          class="app-container"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
        >
          <el-divider content-position="left">
            当前用户定时任务列表（每个用户只能开启两个定时任务）</el-divider>
          <el-table
            :data="schedulerList"
            style="width: 70%; horiz-align: center"
            :border="true"
          >
            <el-table-column
              label="任务描述"
              align="center"
            >
              <template slot-scope="scope">
                <!--            <i class="el-icon-time"></i>-->
                <span style="margin-left: 10px">{{ scope.row.cronDesc }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              width="300"
              align="center"
            >
              <template slot-scope="scope">
                <!--            <i class="el-icon-time"></i>-->
                <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="240"
              align="center"
            >
              <template slot-scope="scope">
                <!--                <el-button type="primary" size="small" disabled @click="showTaskDetail(scope.row)">查看明细</el-button>-->
                <el-button type="danger" size="small" @click="delTask(scope.row)">删除任务</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
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
      schedulerList: [],
      selectScheduler: '',
      timeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      taskList: [
      ],
      requestTaskList: [],
      requestSchedulerTask: {
        cronText: '',
        cronDesc: '',
        taskList: []
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
      this.tableLoading = true
      this.$axios.all([this.getSchedulerList(), this.getMallList()])
        .then(this.$axios.spread((res, mallList) => {
          for (let i = 0; i < mallList.length; i++) {
            var task = { saleType: '', requestCount: mallList[i].totalCount, mallId: mallList[i].id, mallInfo: mallList[i] }
            this.taskList.push(task)
          }
          this.schedulerList = res
          this.mallList = mallList
          // console.log(res)
        }))
        .finally(() => {
          this.tableLoading = false
        })
    },
    getSchedulerList() {
      return this.$request.get('/pinduoduo-scheduler-on-off-sale-task/list-user')
    },
    getMallList() {
      return this.$request({
        url: 'pinduoduo-mall-info/mall-list',
        method: 'get'
      })
    },
    schedulerSelectChange(item) {
      this.getOnOffSaleListBySchedulerId(item)
    },
    getOnOffSaleListBySchedulerId(id) {
      this.$request({
        url: 'pinduoduo-scheduler-task/list-detail',
        method: 'get',
        params: {
          id: id
        }
      }).then((res) => {
        // console.log(res)
      })
    },
    // checkbox选择按钮
    checkboxSelect(item) {
      // requestTaskList
      // 先构建一个临时的mallList储存，用来提交时候构建
      if (event.target.checked) {
        this.requestTaskList.push(item)
      } else {
        var index = this.requestTaskList.indexOf(item)
        this.requestTaskList.splice(index, 1)
      }
    },
    // 提交一个定时上架任务
    handlerOnSale(index, item) {
      // // 运行之前先清空一下队列
      // this.requestSchedulerTask.taskList.length = 0
      // taskList
      if (this.requestTaskList.length <= 0) {
        this.$message({
          message: '请至少选择一个店铺',
          type: 'warning'
        })
        return
      }
      if (this.selectScheduler || this.selectScheduler === 0) {
        var cron = '0 0 ' + this.selectScheduler + ' * * ?'
        this.requestSchedulerTask.cronText = cron
        if (!this.requestSchedulerTask.cronDesc) {
          this.requestSchedulerTask.cronDesc = '每日' + ' ' + this.selectScheduler + ' ' + '点' + ' ' + '执行上架操作'
        }
        for (let i = 0; i < this.requestTaskList.length; i++) {
          this.requestTaskList[i].saleType = 1
        }
        this.requestSchedulerTask.taskList = this.requestTaskList
        this.$request({
          url: 'pinduoduo-scheduler-on-off-sale-task/release',
          method: 'post',
          params: {
            task: this.requestSchedulerTask
          }
        }).then((res) => {
          this.$message({
            message: '设置定时任务成功',
            type: 'success'
          })
        })
        // eslint-disable-next-line no-empty
      } else {
        this.$message({
          message: '请设定一个上加架时间',
          type: 'warning'
        })
      }
    },
    handlerOffSale(index, item) {
      // taskList
      if (this.requestTaskList.length <= 0) {
        this.$message({
          message: '请至少选择一个店铺',
          type: 'warning'
        })
        return
      }
      // taskList
      if (this.selectScheduler || this.selectScheduler === 0) {
        var cron = '0 0 ' + this.selectScheduler + ' * * ?'
        this.requestSchedulerTask.cronText = cron
        for (let i = 0; i < this.requestTaskList.length; i++) {
          this.requestTaskList[i].saleType = 0
        }
        this.requestSchedulerTask.taskList = this.requestTaskList
        if (!this.requestSchedulerTask.cronDesc) {
          this.requestSchedulerTask.cronDesc = '每日' + ' ' + this.selectScheduler + ' ' + '点' + ' ' + '执行下架操作'
        }
        this.$request({
          url: 'pinduoduo-scheduler-on-off-sale-task/release',
          method: 'post',
          params: {
            task: this.requestSchedulerTask
          }
        }).then((res) => {
          this.$message({
            message: '设置定时任务成功',
            type: 'success'
          })
        })
        // eslint-disable-next-line no-empty
      } else {
        this.$message({
          message: '请设定一个下加架时间',
          type: 'warning'
        })
      }
    },
    delTask(item) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        this.$request({
          url: 'pinduoduo-scheduler-on-off-sale-task',
          method: 'delete',
          params: {
            task: item
          }
        }).then((res) => {
          this.$request.get('/pinduoduo-scheduler-on-off-sale-task/list-user')
            .then((res) => {
              this.schedulerList = res
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).finally(() => {
          this.tableLoading = false
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
