<!--用来删除商品的页面-->
<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="请求数量">
          <el-input-number v-model="requestNumber" :min="0" :max="requestMaxNumber" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="cleanGoods">清除商品</el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button type="danger" @click="setupOffSaleTask">一键下架</el-button>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <tab-to-mall-operation />
        </el-form-item>
      </el-form>
      <el-row :gutter="24">
        <el-col :span="13"><div class="grid-content bg-purple">
          <el-divider content-position="left">
            请选择一个店铺，并设置上下架的请求数量
          </el-divider>
          <mall-list-part @childRequestMallInfo="selectMallChange" />
        </div></el-col>
        <el-col :span="11"><div class="grid-content bg-purple">
<!--          <el-divider content-position="left">-->
<!--            <el-tag v-show="0 === this.$store.getters.currentOnOffSaleTask.currentStatus" type="info">未开启任务</el-tag>-->
<!--            <el-tag v-show="1 === this.$store.getters.currentOnOffSaleTask.currentStatus">任务运行中</el-tag>-->
<!--            <el-tag v-show="2 === this.$store.getters.currentOnOffSaleTask.currentStatus" type="success">任务运行完毕</el-tag>-->
<!--            <el-tag v-show="3 === this.$store.getters.currentOnOffSaleTask.currentStatus" type="danger">任务开启失败</el-tag>-->
<!--          </el-divider>-->
<!--          <el-progress :text-inside="true" :stroke-width="20" :percentage="this.$store.getters.currentOnOffSaleTask.process" />-->
          <!--          <span>{{ this.$store.getters.name }}</span>-->
          <el-divider content-position="left">
            异常日志
          </el-divider>
          <el-table
            :data="this.$store.getters.currentDeleteGoodsTask.logModelList"
            border
            style="width: 100%"
            height="500"
          >
            <el-table-column
              label="商品编号"
              align="center"
              width="115"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.goodsId }}</span>
                <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
              </template>
            </el-table-column>
            <el-table-column
              label="操作类型"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.operateType }}</span>
                <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
              </template>
            </el-table-column>
            <el-table-column
              label="异常原因"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.errorText }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import TabToMallOperation from '../../../layout/components/tab-to-mall-operation'
import MallListPart from '../../../components/view/mall-list-part'
export default {
  name: 'DeleteGoods',
  components: { MallListPart, TabToMallOperation },
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
      mallList: [],
      requestNumber: 1,
      requestMaxNumber: 1,
      requestTask: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (window.deleteGoodsNotifyFromJava === undefined) {
        window.deleteGoodsNotifyFromJava = this.deleteGoodsNotifyFromJava
      }
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
    // handlerDeleteTask() {
    //   // 防止累加，先归零
    //   this.requestDeleteTask.delGoodsCount = 0
    //   this.requestDeleteTask.taskDetailList = this.requestDeleteDetail
    //   for (let i = 0; i < this.requestDeleteDetail.length; i++) {
    //     this.requestDeleteTask.delGoodsCount = this.requestDeleteTask.delGoodsCount + this.requestDeleteDetail[i].requestCount
    //   }
    //   this.$request({
    //     url: 'pinduoduo-task-delete-goods/new',
    //     method: 'post',
    //     params: {
    //       task: this.requestDeleteTask
    //     }
    //   }).then((res) => {
    //     this.$message({
    //       message: '删除商品任务已开启',
    //       type: 'success'
    //     })
    //   })
    // },
    cleanGoods() {
      if (JSON.stringify(this.requestTask) === '{}') {
        this.$message({
          message: '没有选择店铺哦，请选择一个店铺，并设置请求数量',
          type: 'warning'
        })
        return
      }
      // deleleGoods
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /*
        如果是空的，提示用户选择一个店铺
        */
        this.loadingText = '任务启动中...'
        this.tableLoading = true
        this.$request({
          url: '/user-access-token/mallInfo',
          method: 'post',
          params: {
            mallInfo: JSON.stringify(this.requestTask)
          }
        }).then(res => {
          window.fastOnOffSale.deleleGoods(JSON.stringify(res), this.requestNumber)
          // alert(JSON.stringify(res))
        }).finally(() => {
          this.tableLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    selectMallChange(mall) {
      this.requestMaxNumber = mall.offSaleCount
      this.requestTask = mall
    },
    deleteGoodsNotifyFromJava(msg) {
      var value = JSON.parse(msg)
      this.$store.dispatch('task/setDeleteGoods', value)
      if (value.currentStatus === 1) {
        this.$notify({
          type: 'success',
          title: '系统提示',
          message: '商品删除操作完成，成功删除商品数量为：' + value.successRequestCount,
          position: 'bottom-right'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
