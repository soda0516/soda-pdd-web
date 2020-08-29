<template>
  <div class="app-container">
    <div
      class="app-container"
      v-loading="tableLoading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="设置循环商品数量">
          <el-input-number v-model="requestNumber" size="small"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="warning"  @click="circleOnSaleTask">一键开启循环上下架</el-button>
        </el-form-item>
        <el-form-item>
          <tab-to-mall-operation/>
        </el-form-item>
      </el-form>
      <el-row :gutter="24">
        <el-col :span="13"><div class="grid-content bg-purple">
          <el-divider content-position="left">
            请选择一个店铺，并设置加入循环上下架任务的商品数量
          </el-divider>
          <mall-list-part @childRequestMallInfo="selectMallChange"/>
<!--          <mall-list-part @childRequestMallInfo="selectMallChange"/>-->
<!--          <el-table-->
<!--            :data="mallList"-->
<!--            style="width: 100%"-->
<!--            :border="true"-->
<!--          >-->
<!--            <el-table-column-->
<!--              label="选择"-->
<!--              width="50"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                &lt;!&ndash;            <i class="el-icon-time"></i>&ndash;&gt;-->
<!--                &lt;!&ndash;            :disabled="scope.row.accessTokenStatus !== '可操作'"&ndash;&gt;-->
<!--                <el-radio v-model="radio" @change="getTemplateMallRow(scope.$index,scope.row)"></el-radio>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="首图"-->
<!--              width="75"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <img width="50px" height="50px" :src="scope.row.logo">-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="店铺名称"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 10px">{{ scope.row.mallName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="状态"-->
<!--              align="center"-->
<!--              width="75"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 10px">{{ scope.row.accessTokenStatus }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="商品总数"-->
<!--              width="80"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 10px">{{ scope.row.totalCount }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="在售中"-->
<!--              width="75"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.onSaleCount }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="已下架"-->
<!--              width="75"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.offSaleCount }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
        </div></el-col>
        <el-col :span="11"><div class="grid-content bg-purple">
          <el-divider content-position="left">
            <el-tag v-show="0 === this.$store.getters.currentCircleOnOffSaleTask.currentStatus" type="info">未开启任务</el-tag>
            <el-tag v-show="1 === this.$store.getters.currentCircleOnOffSaleTask.currentStatus">任务运行中</el-tag>
            <el-tag v-show="2 === this.$store.getters.currentCircleOnOffSaleTask.currentStatus" type="success">任务运行完毕</el-tag>
            <el-tag v-show="3 === this.$store.getters.currentCircleOnOffSaleTask.currentStatus" type="danger">任务开启失败</el-tag>
          </el-divider>
          <el-progress :text-inside="true" :stroke-width="20" :percentage="this.$store.getters.currentCircleOnOffSaleTask.process">
          </el-progress>
          <!--          <span>{{ this.$store.getters.name }}</span>-->
          <el-divider content-position="left">
            异常日志
          </el-divider>
          <el-table
            :data="this.$store.getters.currentCircleOnOffSaleTask.logModelList"
            border
            style="width: 100%"
            height="500">
            <el-table-column
              label="商品编号"
              align="center"
              width="115">
              <template slot-scope="scope">
                <span>{{scope.row.goodsId}}</span>
                <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
              </template>
            </el-table-column>
            <el-table-column
              label="操作类型"
              align="center"
              width="100">
              <template slot-scope="scope">
                <span>{{scope.row.operateType}}</span>
                <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
              </template>
            </el-table-column>
            <el-table-column
              label="异常原因">
              <template slot-scope="scope">
                <span>{{scope.row.errorText}}</span>
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
  name: 'CircleOnOffSale',
  components: { MallListPart, TabToMallOperation },
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
      radio: '',
      requestSale: [],
      saleList: [],
      requestMallList: [],
      taskList: [
      ],
      requestTaskList: [],
      requestCircleTask: {
        circleCount: 1,
        onOffSaleTaskList: []
      },
      requestTask: {},
      requestNumber: 0
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
      if (this.$global.showMallInfo !== undefined) {
        this.$global.showMallInfo.close()
      }
      if (window.showNeedUpdateMallInfo === undefined) {
        window.showNeedUpdateMallInfo = this.showNeedUpdateMallInfo
      }
      if (window.circleOnOffSaleFromJava === undefined) {
        window.circleOnOffSaleFromJava = this.callBackCircleOnOffSaleFromJava
      }
      this.$request({
        url: '/user-access-token/list-by-user',
        method: 'get'
      }).then(res => {
        // alert(this.$global.showMallInfo)
        console.log(res)
        var list = window.mallInfo.getMallInfoList(JSON.stringify(res))
        this.mallList = JSON.parse(list)
      }).finally(() => {
        this.tableLoading = false
      })
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
    circleOnSaleTask() {
      /*
      如果是空的，提示用户选择一个店铺
       */
      if (JSON.stringify(this.requestTask) === '{}') {
        this.$message({
          message: '没有选择店铺哦，请选择一个店铺，并设置请求数量',
          type: 'warning'
        })
        return
      }
      this.loadingText = '一键下架中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          // JSON.stringify(this.requestTask)
          mallInfo: JSON.stringify(this.requestTask)
        }
      }).then(res => {
        window.fastOnOffSale.circleOnOffSale(JSON.stringify(res), this.requestNumber)
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
      })
      // window.fastOnOffSale.runFromJs()
    },
    callBackCircleOnOffSaleFromJava(item) {
      var json = JSON.parse(item)
      var successRequestCount = json.successRequestCount
      var totalRequestCount = json.totalRequestCount
      json.process = parseInt(parseFloat(successRequestCount / totalRequestCount) * 100)
      this.$store.dispatch('task/setCircleOnOffSaleTask', json)
      if (json.currentStatus >= 2) {
        this.notify = this.$notify({
          type: 'success',
          title: '系统提示',
          message: '店铺：' + this.$store.getters.currentCircleOnOffSaleTask.mallName + '。' + this.$store.getters.currentCircleOnOffSaleTask.operateType + '：' + this.$store.getters.currentCircleOnOffSaleTask.successRequestCount + '，' + '请更新店铺信息，查看最新商品状态！',
          duration: 0,
          position: 'bottom-right'
        })
      }
    },
    /*
radio选中一个店铺的信息
 */
    getTemplateMallRow(index, item) {
      this.requestTask = item
      this.requestNumber = item.totalCount
    },
    /*
    后台判断是否跟服务端的店铺信息一致
     */
    showNeedUpdateMallInfo(msg) {
      this.$global.showMallInfo = this.$notify({
        type: 'warning',
        title: '系统提示',
        message: msg,
        showClose: false,
        duration: 0,
        position: 'bottom-right'
      })
    },
    selectMallChange(item) {
      this.requestTask = item
      this.requestNumber = item.totalCount
    }
  }
}
</script>

<style scoped>

</style>
