<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="草稿状态">
          <el-select v-model="optionValue" placeholder="请选择草稿状态">
            <el-option
              v-for="item in checkStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分页页码">
          <el-input-number v-model="currentPageNumber" :max="100" :step="1" size="small" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="warning"  @click="searchDraft">查询草稿箱</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger"  @click="cleanDraft">清理商品</el-button>
        </el-form-item>
        <el-form-item>
          <span>默认页码为1，同时最多只能显示30条草稿箱数据</span>
        </el-form-item>
      </el-form>
      <el-row :gutter="24">
        <el-col :span="11"><div class="grid-content bg-purple">
          <el-divider content-position="left">
            请选择一个店铺，并设置上下架的请求数量
          </el-divider>
          <mall-list-part @childRequestMallInfo="selectMallChange"/>
        </div></el-col>
        <el-col :span="13"><div class="grid-content bg-purple">
          <el-divider content-position="left">
            草稿箱列表
          </el-divider>
          <el-table
            ref="multipleTable"
            :data="draftGoodsList"
            border
            style="width: 100%"
            cell-style="font-size: 12px"
            fit
            max-height="550"
            @selection-change="handleSelectionChangeGoodsList">
            <el-table-column
              type="selection"
              width="40"
            />
            <el-table-column
              label="商品编号"
              align="center"
              width="115">
              <template slot-scope="scope">
                <span>{{ scope.row.goodsId }}</span>
<!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
              </template>
            </el-table-column>
            <el-table-column
              label="商品名称"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.goodsName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="驳回原因">
              <template slot-scope="scope">
                <span>{{ scope.row.rejectComment }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import MallListPart from '../../../components/view/mall-list-part'
export default {
  name: 'FastOnOffSale',
  components: { MallListPart },
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
      radio: '',
      requestTask: {},
      requestMallList: [],
      requestSale: [],
      mallList: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        testValue: ''
      }],
      requestNumber: 0,
      nofify: {},
      // 0:编辑中,1:审核中,2:审核通过,3:审核驳回
      checkStatusOptions: [
        {
          label: '编辑中',
          value: 0
        },
        {
          label: '审核中',
          value: 1
        },
        {
          label: '审核通过',
          value: 2
        },
        {
          label: '审核驳回',
          value: 3
        }
      ],
      optionValue: 0,
      /*
      用来显示商品列表分页用的
       */
      currentPageNumber: 1,
      multipleSelection: [],
      draftGoodsList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
      this.tableLoading = true
      if (this.$global.showMallInfo !== undefined) {
        this.$global.showMallInfo.close()
      }
      // if (window.showNeedUpdateMallInfo === undefined) {
      //   window.showNeedUpdateMallInfo = this.showNeedUpdateMallInfo
      // }
      // if (window.fastOnOffSaleFromJava === undefined) {
      //   window.fastOnOffSaleFromJava = this.callBackOnOffSaleFromJava
      // }
      if (window.draftCleanFromJava === undefined) {
        window.draftCleanFromJava = this.draftCleanFromJavaNofity
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
    setupOnSaleTask() {
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
      this.loadingText = '一键上架中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.requestTask)
        }
      }).then(res => {
        window.fastOnOffSale.fastOnOffSale(JSON.stringify(res), 1, this.requestNumber)
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
      })
      // window.fastOnOffSale.runFromJs()
    },
    setupOffSaleTask() {
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
          mallInfo: JSON.stringify(this.requestTask)
        }
      }).then(res => {
        window.fastOnOffSale.fastOnOffSale(JSON.stringify(res), 0, this.requestNumber)
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
      })
      // window.fastOnOffSale.runFromJs()
    },
    callBackOnOffSaleFromJava(item) {
      var json = JSON.parse(item)
      var successRequestCount = json.successRequestCount
      var totalRequestCount = json.totalRequestCount
      json.process = parseInt(parseFloat(successRequestCount / totalRequestCount) * 100)
      this.$store.dispatch('task/setOnOffSaleTask', json)
      if (json.currentStatus >= 2) {
        this.notify = this.$notify({
          type: 'success',
          title: '系统提示',
          message: '店铺：' + this.$store.getters.currentOnOffSaleTask.mallName + '。' + this.$store.getters.currentOnOffSaleTask.operateType + '：' + this.$store.getters.currentOnOffSaleTask.successRequestCount + '，' + '请更新店铺信息，查看最新商品状态！',
          showClose: false,
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
    handleSelectionChangeGoodsList(val) {
      this.multipleSelection = val
    },
    searchDraft: function() {
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
      this.loadingText = '数据加载中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.requestTask)
        }
      }).then(res => {
        var val = window.draftClean.list30Draft(JSON.stringify(res), this.currentPageNumber, this.optionValue)
        this.draftGoodsList = JSON.parse(val).data
      }).finally(() => {
        this.tableLoading = false
      })
    },
    cleanDraft() {
      var list = JSON.stringify(this.multipleSelection)
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
      this.loadingText = '数据加载中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.requestTask)
        }
      }).then(res => {
        var val = window.draftClean.cleanDraft(JSON.stringify(res), list)
        this.draftGoodsList = JSON.parse(val).data
      }).finally(() => {
        this.tableLoading = false
      })
    },
    selectMallChange(mall) {
      this.requestTask = mall
    },
    draftCleanFromJavaNofity(msg) {
      this.$notify({
        type: 'warning',
        title: '系统提示',
        message: msg,
        position: 'bottom-right'
      })
    }
  }
}
</script>
<style scoped>

</style>
