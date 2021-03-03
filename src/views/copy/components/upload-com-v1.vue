<template>
  <div
    v-loading="tableLoading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row>
          <el-col :span="24">
            <div>
              <el-form
                ref="ruleForm"
                :inline="true"
                label-position="left"
                status-icon
                style="padding-bottom: 0"
              >
                <el-divider
                  content-position="left"
                >请输入淘宝/天猫商品地址</el-divider>
                <!--            label-width="110px"-->
                <el-form-item label="商品链接" prop="pass">
                  <el-input
                    v-model="taobaoItemId"
                    type="text"
                    style="width: 58vh"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="oneGoodsUploadButtonLoading"
                    :element-loading-text="oneGoodsUploadButtonLoadingloadingText"
                    @click="taobaoCopyUpload"
                  >开始搬家</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="12">
            <div>
              <div>
                <el-divider
                  content-position="left"
                >基本信息</el-divider>
                <el-form
                  ref="form"
                  :model="form"
                  label-width="110px"
                >
                  <el-form-item label="绑定店铺信息:" prop="pass">
                    <span>{{ selectedMallName }}</span>
<!--                    <el-select v-model="selectedMall" placeholder="选择店铺" disabled>-->
<!--                      <el-option-->
<!--                        v-for="item in mallList"-->
<!--                        :key="item.id"-->
<!--                        :label="item.mall_name"-->
<!--                        :value="item.id"-->
<!--                      />-->
<!--                    </el-select>-->
                  </el-form-item>
                  <el-form-item label="商家承诺">
                    <el-checkbox
                      v-model="filter.jiayifashi"
                      disabled
                    >假一罚十</el-checkbox>
                  </el-form-item>
                  <el-form-item label="商家承诺">
                    <el-checkbox
                      v-model="filter.qitianwuliyou"
                      disabled
                    >七天无理由退换货</el-checkbox>
                  </el-form-item>
                </el-form>
                <!--            <el-divider-->
                <!--              content-position="left"-->
                <!--            >基本设置</el-divider>-->
                <!--            <el-form ref="form" label-width="110px" size="small">-->
                <!--              <el-form-item label="物流模板">-->
                <!--                <el-input-->
                <!--                  v-model="goodsFilter.filterWord"-->
                <!--                  placeholder="请输入过滤词"-->
                <!--                  clearable-->
                <!--                />-->
                <!--              </el-form-item>-->
                <!--              <el-form-item label="商品种类">-->
                <!--                <el-input-number-->
                <!--                  v-model="goodsFilter.minPrice"-->
                <!--                />-->
                <!--              </el-form-item>-->
                <!--            </el-form>-->
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <div>
                <el-divider
                  content-position="left"
                >商品设置(加价不高于8%)</el-divider>
                <el-form ref="form" label-width="160px" size="small">
                  <el-form-item label="市场价格（倍数）">
                    <el-input-number
                      v-model="goodsConfig.markPriceTimes"
                      :max="1.5"
                      :step="0.01"
                    />
                  </el-form-item>
                  <el-form-item label="市场价格（加减）">
                    <el-input-number
                      v-model="goodsConfig.markPriceNumber"
                      :max="maxSetConfig.marketPrice"
                      :step="0.01"
                    />
                  </el-form-item>
                  <el-form-item label="单买/团购价格（倍数）">
                    <el-input-number
                      v-model="goodsConfig.singleGroupPriceTimes"
                      :max="maxSetConfig.mutiPrice"
                      :step="0.01"
                    />
                  </el-form-item>
                  <el-form-item label="单买/团购价格（加减）">
                    <el-input-number
                      v-model="goodsConfig.singleGroupPriceNumber"
                      :step="1"
                    />
                  </el-form-item>
                  <el-form-item label="单买高于团购（元）">
                    <el-input-number
                      v-model="goodsConfig.singleGtGroupPrice"
                      :min="1"
                      :step="1"
                    />
                  </el-form-item>
                  <el-form-item label="承诺发货时间">
                    <el-radio-group v-model="goodsConfig.shipmentLimit">
                      <el-radio label="0">48小时</el-radio>
                      <el-radio label="1">24小时</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getToken } from '../../../utils/auth'
export default {
  name: 'UploadComV1',
  props: {
    parentItemTitle: String,
    sourceMallType: String,
    getItemInfoUrl: String
  },
  data() {
    return {
      loadingText: '',
      maxSetConfig: {
        singlePrice: 1.08,
        mutiPrice: 1.08,
        marketPrice: 1.5
      },
      selectedMall: '',
      fullscreenLoading: false,
      uploadButtonState: false,
      tableLoading: false,
      topTableLoading: false,
      mallList: [
        {
          id: '',
          logo: '',
          mallName: '',
          mallDesc: '',
          merchantType: 'INDIVIDUAL',
          userAccessTokenId: 0,
          totalCount: 0,
          onSaleCount: 0,
          offSaleCount: 0,
          remark: ''
        }
      ],
      selectedValue: '',
      selectedMallInfoValue: '',
      filter: {
        qitianwuliyou: true,
        jiayifashi: true,
        removeRepeat: true,
        forbiddenWordsFilter: true,
        minPrice: 0,
        titleWordsDelete: ''
      },
      requestTask: '',
      taobaoItemId: '',
      synMallList: [],
      synList: [],
      goodsConfig: {
        markPriceTimes: 1.5,
        markPriceNumber: 0.0,
        singleGroupPriceTimes: 1.08,
        singleGroupPriceNumber: 0.0,
        singleGtGroupPrice: 1,
        titleWordsDelete: '',
        shipmentLimit: '0'
      },
      timer: '',
      drawer: false,
      direction: 'rtl',
      formInline: {
        user: '',
        region: ''
      },
      goodsFilter: {
        filterWord: '',
        minPrice: 0,
        maxPrice: 1000,
        minSales: 0,
        status: [],
        titleWordsDelete: ''
      },
      collectMallInfoList: [],
      collectGoodsItemList: [],
      multipleSelection: [],
      urlTitle: this.parentItemTitle,
      mallType: this.sourceMallType,
      itemInfoUrl: this.getItemInfoUrl,
      logisticsList: [],
      selectedLogisticsValue: {},
      oneGoodsUploadButtonLoading: false,
      tableData: [],
      requestItemJson: '',
      oneGoodsUploadButtonLoadingloadingText: '商品上传中，时间可能稍长，请耐心等待...',
      douDingTaobaoJson: '',
      selectedMallName: ''
    }
  },
  mounted() {
    this.initMallInfo()
  },
  methods: {
    initMallInfo() {
      this.tableLoading = true
      this.$request({
        url: '/local/shop/list?token=' + getToken(),
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.mallList = res.d
        if (this.mallList.length > 0) {
          this.selectedMall = this.mallList[0].id
          this.selectedMallName = this.mallList[0].mall_name
        }
        console.log(res)
        // alert(this.$global.showMallInfo)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    synRefreshMallInfo() {
      this.synList = []
      var list = []
      if (this.selectedValue) {
        for (let i = 0; i < this.mallList.length; i++) {
          var item = this.mallList[i]
          if (this.selectedValue.id !== item.id) {
            list.push(item)
          }
        }
        this.synMallList = list
      }
    },
    mallSelectChange(event, value) {
      this.synRefreshMallInfo()
      this.listLogisticsTemplate()
      // this.requestTask = this.selectedValue
    },
    getMallList() {
      return this.$request({
        url: '/pinduoduo-mall-info/mall-list',
        method: 'get'
      })
    },
    uploadToPinduoduo() {
      /*
          如果是空的，提示用户选择一个店铺
           */
      for (let i = 0; i < this.mallList.length; i++) {
        if (this.mallList[i].id === this.selectedValue) {
          this.requestTask = this.mallList[i]
        }
      }
      if (
        this.requestTask.length <= 0 ||
          JSON.stringify(this.requestTask) === '{}'
      ) {
        this.$message({
          message: '没有选择店铺哦，请选择一个店铺，并设置相关参数',
          type: 'warning'
        })
        return
      }
      if (this.taobaoItemId.length <= 0) {
        this.$message({
          message: '请输入一个淘宝商品ID',
          type: 'warning'
        })
        return
      }
      this.loadingText = '任务启动中...'
      this.tableLoading = true
      var that = this
      this.$axios
        .all([this.getMallInfo(), this.getItemInfo()])
        .then(
          this.$axios.spread(function(mallInfo, itemJson) {
            if (mallInfo && itemJson) {
              window.taobaoCopy.uploadToPinduoduo(
                JSON.stringify(mallInfo),
                itemJson,
                JSON.stringify(that.formConfig)
              )
            } else {
              that.$message({
                message: '获取上传信息不足',
                type: 'warning'
              })
            }
          })
        )
        .finally(() => {
          that.tableLoading = false
        })
    },
    /*
      获取店铺信息的请求
      */
    getMallInfo() {
      return this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.selectedValue)
        }
      })
    },
    /*
        获取淘宝的json
         */
    getItemInfo() {
      return this.$request({
        // 99api
        // /taobao/json
        url: this.itemInfoUrl,
        method: 'get',
        params: {
          accessTokenId: this.selectedValue.userAccessTokenId,
          itemId: this.taobaoItemId
        }
      })
    },
    getUserAccessTokenListBySync() {
      return this.$request({
        url: '/user-access-token/ids',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        params: {
          ids: this.synList
        }
      })
    },
    async getDouDingTaobaoJson() {
      this.oneGoodsUploadButtonLoading = true
      this.douDingTaobaoJson = ''
      await this.$request({
        url: '/move/add?token=' + getToken(),
        method: 'GET',
        params: {
          id: this.selectedMall,
          url: this.taobaoItemId
        }
      }).then(res => {
        console.log('从豆丁获取')
        console.log(res)
        this.douDingTaobaoJson = res
      }).finally(() => {
        this.oneGoodsUploadButtonLoading = false
      })
    },
    async taobaoCopyUpload() {
      await this.getDouDingTaobaoJson()
      this.requestItemJson = ''
      if (this.douDingTaobaoJson) {
        await this.collectGoodsJson()
      }
      if (this.requestItemJson) {
        await this.uploadOneGoods()
      }
    },
    async collectGoodsJson() {
      this.oneGoodsUploadButtonLoading = true
      await this.$requestDc({
        url: '/move/taobao/douding',
        method: 'post',
        data: this.douDingTaobaoJson
      })
        .then(res => {
          this.requestItemJson = res.data
          console.log(this.requestItemJson)
        })
        .finally(() => {
          this.oneGoodsUploadButtonLoading = false
        })
    },
    async uploadOneGoods() {
      this.oneGoodsUploadButtonLoading = true
      var data = {
        accessToken: this.requestItemJson.access_token,
        reurl: this.requestItemJson.reurl,
        json: JSON.stringify(this.requestItemJson.taobaoCopyRequestBo),
        config: JSON.stringify(this.goodsConfig)
      }
      await this.$requestDc({
        url: '/move/upload/data',
        method: 'post',
        data: data
      })
        .then(res => {
          this.$alert('商品发布成功，可切换到搬家记录查看', '上传结果', {
            confirmButtonText: '确定',
            callback: action => {
              this.taobaoItemId = ''
            }
          })
        })
        .catch(res => {
          this.$message({
            message: '商品上传失败，可切换到搬家记录查看',
            type: 'warning'
          })
        })
        .finally(() => {
          this.oneGoodsUploadButtonLoading = false
        })
    },
    uploadBatch() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: '请选择一件需要铺货的商品',
          type: 'warning'
        })
        return
      }
      var msg =
          '一共选择了' +
          this.multipleSelection.length +
          '件商品，是否立即开始铺货?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var that = this
          that.$axios
            .all([
              that.getMallInfo(),
              that.getUserAccessTokenListBySync()
            ])
            .then(
              this.$axios.spread(function(mallInfo, ids) {
                if (mallInfo && ids) {
                  window.moveGoods.batchUpload(
                    JSON.stringify(mallInfo),
                    JSON.stringify(that.goodsConfig),
                    JSON.stringify(ids),
                    JSON.stringify(that.multipleSelection)
                  )
                } else {
                  that.$message({
                    message: '获取上传信息不足',
                    type: 'warning'
                  })
                }
              })
            )
            .finally(() => {
              that.tableLoading = false
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消铺货'
          })
        })
    },
    taobaoCopyUploadWindowsNotify(item) {
      this.$notify.success({
        title: '淘宝搬家上货',
        message: item,
        duration: 5000,
        position: 'bottom-right',
        showClose: false
      })
    },
    taobaoCopyUploadDocumentNotify(item) {
      this.$store.dispatch('task/setUploadLog', item)
      this.$nextTick(() => {
        setTimeout(() => {
          const textarea = document.getElementById('textarea_id')
          textarea.scrollTop = textarea.scrollHeight
        }, 13)
      })
    },
    clearLogs() {
      this.$store.dispatch('task/cleanUploadLog', '')
    },
    async taobaoCopyUploadTest() {
      for (let i = 0; i < this.testList.length; i++) {
        this.taobaoItemId = this.testList[i]
        this.timer = setTimeout(await this.uploadOneGoods(), 1000)
      }
    },
    showDrawer() {
      this.drawer = !this.drawer
    },
    listCollectMallInfo() {
      var list = window.moveGoods.listCollectMallInfo()
      this.collectMallInfoList = JSON.parse(list)
    },
    searchCollectResult() {
      var list = window.moveGoods.listCollectGoodsItemList(
        JSON.stringify(this.selectedValue),
        JSON.stringify(this.selectedMallInfoValue),
        JSON.stringify(this.goodsFilter)
      )
      this.collectGoodsItemList = JSON.parse(list)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClose() {
      this.drawer = !this.drawer
      var inputText = []
      for (
        let index = 0;
        index < this.multipleSelection.length;
        index++
      ) {
        const element = this.multipleSelection[index]
        inputText.push(element.goodsId)
      }
    },
    taobaoCopyUploadBatch() {
      alert(JSON.stringify(this.multipleSelection))
    },
    filterTag(value, row) {
      return row.status === value
    },
    breakUpload() {
      window.moveGoods.breakUpload()
    },
    listLogisticsTemplate() {
      this.selectedLogisticsValue = {}
      this.$request({
        url: '/pinduoduo-commons/logistics-template/list',
        method: 'get',
        params: {
          userAccessToken: JSON.stringify(this.selectedValue)
        }
      })
        .then((res) => {
          this.logisticsList = res
          // alert(JSON.stringify(res))
        })
        .finally(() => {
        })
    }
  }
}
</script>
<style scoped>
</style>
