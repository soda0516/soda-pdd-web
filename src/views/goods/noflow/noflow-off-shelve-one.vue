<template>
  <div
    v-loading="tableLoading"
    class="app-container"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
  >
    <el-divider content-position="left">
      设置采集参数，小于等于设置值的商品信息会被显示到列表中（如果选择自动采集时，发生模拟网页运行异常，请设置自动模拟速率并重试，或者选择手动采集）
      <!--        请选择时间区间！（如果选择自动采集时，发生模拟网页运行异常，请设置自动模拟速率并重试，或者选择手动采集）-->
    </el-divider>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="访客数">
        <el-input-number v-model="requestTask.maxGoodsUv" size="mini" />
      </el-form-item>
      <el-form-item label="浏览数">
        <el-input-number v-model="requestTask.maxGoodsPv" size="mini" />
      </el-form-item>
      <el-form-item label="支付数">
        <el-input-number v-model="requestTask.maxGoodsOrdrcnt" size="mini" />
      </el-form-item>
      <el-form-item>
        <span />
      </el-form-item>
      <el-form-item>
        <span />
      </el-form-item>
      <el-form-item label="自动模拟速率">
        <el-input-number v-model="rate" :min="700" size="mini" :step="100" />
      </el-form-item>
      <el-form-item>
        <el-button type="warning" size="medium" @click="setupNoFlowTool(0)">自动采集</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="medium" @click="setupNoFlowTool(1)">手动采集</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="24">
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-divider content-position="left">
          请选择一个店铺，并设置时间区间（默认获取近30天）商品数据
        </el-divider>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="时间段" label-widtc="80px">
            <el-select v-model="timeInterval" size="small" placeholder="请选择" style="width:100px">
              <el-option
                v-for="item in options"
                :key="item.value"
                data-width="100px"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <span />
          </el-form-item>
          <el-form-item>
            <span />
          </el-form-item>
          <el-form-item>
            <!--              <el-button type="primary" size="mini" round>下架选中</el-button>-->
            <span />
          </el-form-item>
          <el-form-item>
            <span />
          </el-form-item>
          <el-form-item>
            <el-button type="warning" size="small" round @click="oneKeyOffSale">一键下架</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="small" round @click="oneKeyClean">一键清除</el-button>
          </el-form-item>
        </el-form>
<!--        <mall-list-part @childRequestMallInfo="selectMallChange"/>-->
<!--        <mall-list-part @childRequestMallInfo="selectMallChange" />-->
        <el-table
          :data="mallList"
          style="width: 100%"
          :border="true"
        >
          <el-table-column
            label="选择"
            width="50"
            align="center"
          >
            <template slot-scope="scope">
              <!--            <i class="el-icon-time"></i>-->
              <!--            :disabled="scope.row.accessTokenStatus !== '可操作'"-->
              <el-radio v-model="radio" :label="scope.row.id" @change="getTemplateMallRow(scope.$index,scope.row)" >{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="首图"
            width="75"
            align="center"
          >
            <template slot-scope="scope">
              <img width="50px" height="50px" :src="scope.row.logo">
            </template>
          </el-table-column>
          <el-table-column
            label="店铺名称"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.mallName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="75"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.accessTokenStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品总数"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.totalCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="输入密码"
            align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.setupPassword" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-divider content-position="left">
          被采集的商品列表，请选择相应操作
        </el-divider>
        <el-table
          ref="multipleTable"
          :data="this.$store.getters.noflowGoodsList"
          border
          style="width: 100%"
          cell-style="font-size: 12px"
          fit
          max-height="550"
          @selection-change="handleSelectionChangeGoodsList"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            label="商品编号"
            align="center"
            width="110"
            fixed
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsId }}</span>
              <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            align="left"
            width="450"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsName }}</span>
              <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
            </template>
          </el-table-column>
          <el-table-column
            label="访"
            width="35"
            fixed="right"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsUv }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="浏"
            width="35"
            fixed="right"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsPv }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="付"
            width="35"
            fixed="right"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.payOrdrcnt }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'NoflowOffShelve',
  data() {
    return {
      loadingText: '数据列表加载中',
      tableLoading: false,
      radio: '',
      timeInterval: 0,
      options: [{
        value: 0,
        label: '近30天'
      }, {
        value: 1,
        label: '近7天'
      }],
      rate: 700,
      setupPassword: '',
      requestTask: {
        taskDesc: '',
        daysAgo: 0,
        maxGoodsUv: 0,
        maxGoodsPv: 0,
        maxGoodsOrdrcnt: 0,
        taskMallCount: 0,
        operateType: 0,
        timeInterval: 0
      },
      fullscreenLoading: false,
      tableData: [{
        mallUsername: '',
        maxGoodsUv: '',
        maxGoodsPv: '',
        maxGoodsOrdrcnt: ''
      }],
      mallList: [],
      noflowUserInfo: {},
      requestMallInfo: {
        setupPassword: ''
      },
      pageTotal: 0,
      multipleSelection: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
      this.tableLoading = true
      if (window.noflowGoodsListFromJava === undefined) {
        window.noflowGoodsListFromJava = this.callBackNoflowFromJava
      }
      this.$request({
        url: '/user-access-token/list-by-user',
        method: 'get'
      }).then(res => {
        // alert(this.$global.showMallInfo)
        var list = window.mallInfo.getMallInfoList(JSON.stringify(res))
        this.mallList = JSON.parse(list)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    oneKeyOffSale() {
      var goodsListStr = JSON.stringify(this.multipleSelection)
      this.loadingText = '一键下架中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.requestMallInfo)
        }
      }).then(res => {
        window.noFlowClean.oneKeyOffSale(JSON.stringify(res), goodsListStr)
        // window.fastOnOffSale.fastOnOffSale(JSON.stringify(res), 0, this.requestNumber)
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
      })
    },
    oneKeyClean() {
      var goodsListStr = JSON.stringify(this.multipleSelection)
      this.loadingText = '一键下架中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.requestMallInfo)
        }
      }).then(res => {
        window.noFlowClean.oneKeyClean(JSON.stringify(res), goodsListStr)
        // window.fastOnOffSale.fastOnOffSale(JSON.stringify(res), 0, this.requestNumber)
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
      })
    },
    tabToContactUs() {
      this.$router.push({ name: 'ContactUs' })
    },
    submitFile() {
      // this.countDown()
      if (this.file) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          message: '请选择一个文档',
          type: 'warning'
        })
      }
    },
    setupNoFlowTool(operateType) {
      if (JSON.stringify(this.requestMallInfo) === '{}') {
        this.$message.error('请选择一个店铺，并确保输入正确的店铺登录密码')
        return
      }
      this.$request({
        url: '/user-access-token/ownername',
        method: 'post',
        params: {
          mallInfo: this.requestMallInfo
        }
      }).then(res => {
        this.noflowUserInfo.ownerName = res
        this.noflowUserInfo.ownerPassword = this.requestMallInfo.setupPassword
        this.requestTask.operateType = operateType
        this.requestTask.timeInterval = this.timeInterval
        if (this.noflowUserInfo.ownerName && this.noflowUserInfo.ownerPassword) {
          // eslint-disable-next-line no-undef
          window.noFlowClean.autoPinduoduoNoflowWindow(JSON.stringify(this.noflowUserInfo),
            this.requestTask.maxGoodsUv,
            this.requestTask.maxGoodsPv,
            this.requestTask.maxGoodsOrdrcnt,
            this.rate,
            this.requestTask.operateType,
            this.requestTask.timeInterval)
        } else {
          this.$message.error('请选择一个店铺，并确保输入正确的店铺登录密码')
        }
      })
    },

    handleSelectionChange(row) {
      this.noflowUserInfo = row.userAccessToken
    },
    /*
    radio选中一个店铺的信息
    */
    getTemplateMallRow(index, item) {
      this.requestMallInfo = item
    },
    callBackNoflowFromJava(item) {
      var list = JSON.parse(item)
      this.$store.dispatch('task/setNoflowGoodsListAll', list)
    },
    handleSelectionChangeGoodsList(val) {
      this.multipleSelection = val
    },
    selectMallChange(mall) {
      this.requestMallInfo = mall
    }
  }
}
</script>

<style scoped>

</style>
