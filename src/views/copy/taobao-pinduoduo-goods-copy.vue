<template>
  <div
    v-loading="tableLoading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div>
            <div
              class="app-container"
            >
              <el-divider content-position="left">在输入框输入需要一键上架的淘宝商品ID</el-divider>
              <el-form ref="ruleForm" :model="ruleForm" label-position="left" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="淘宝商品ID" prop="pass">
                  <el-input v-model="taobaoItemId" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item>
<!--                  <el-button type="primary" @click="uploadCookie" plain>打开淘宝网获取Cookie</el-button>-->
                  <el-button type="warning" plain @click="uploadToPinduoduo">一键发布到拼多多</el-button>
                </el-form-item>
              </el-form>
              <el-divider content-position="left">商品搬家记录</el-divider>
              <el-table
                :data="taskDetailData"
                height="550"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="taobaoItemId"
                  label="淘宝商品编号"
                  width="160"
                />
                <el-table-column
                  prop="title"
                  label="正在进行"
                  width="160"
                />
                <el-table-column
                  prop="status"
                  width="80"
                  label="运行状态"
                />
                <el-table-column
                  prop="message"
                  label="上传信息"
                />
                <el-table-column
                  prop="loadingCount"
                  width="80"
                  label="进度"
                />
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <div class="app-container">
            <el-divider content-position="left">商品条件过滤</el-divider>
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="选择店铺">
                <el-select v-model="selectedValue" placeholder="请选择"  @change="mallSelectChange">
                  <el-option
                    v-for="item in mallList"
                    :key="item.id"
                    :label="item.mallName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="商家承诺">
                <el-checkbox v-model="filter.jiayifashi" disabled>假一罚十</el-checkbox>
              </el-form-item>
              <el-form-item label="商家承诺">
                <el-checkbox v-model="filter.qitianwuliyou" disabled>七天无理由退换货</el-checkbox>
              </el-form-item>
<!--              <el-form-item label="上传设置">-->
<!--                <el-checkbox v-model="filter.removeRepeat">过滤重复上传商品</el-checkbox>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="上传设置">-->
<!--                <el-checkbox v-model="filter.forbiddenWordsFilter">过滤违禁词</el-checkbox>-->
<!--              </el-form-item>-->
              <el-form-item label="最低价格">
                <el-input-number v-model="filter.minPrice" :min="0" :step="1" size="small" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <div class="app-container">
<!--            <el-divider content-position="left">上传设置</el-divider>-->
<!--            <el-form ref="form" :model="form" label-width="160px">-->
<!--              <el-form-item label="单买价格（倍数）">-->
<!--                <el-input-number v-model="uploadConfig.singlePriceTimes" :max="form.maxSinglePrice" :step="0.01" size="small" />-->
<!--              </el-form-item>-->
<!--              <el-form-item label="团购价格（倍数-1元）">-->
<!--                <el-input-number v-model="uploadConfig.groupPriceTimes" :max="form.maxMutiPrice" :step="0.01" size="small" />-->
<!--              </el-form-item>-->
<!--              <el-form-item label="市场价格（倍数）">-->
<!--                <el-input-number v-model="uploadConfig.markPriceTimes" :max="form.maxMarketPrice" :step="0.01" size="small" />-->
<!--              </el-form-item>-->
<!--            </el-form>-->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'TaobaoPinduoduoGoodsCopy',
  data() {
    return {
      taskDetailData: [],
      loadingText: '',
      form: {
        maxSinglePrice: 1.08,
        maxMutiPrice: 1.08,
        maxMarketPrice: 1.5
      },
      fullscreenLoading: false,
      uploadButtonState: false,
      tableLoading: false,
      topTableLoading: false,
      mallList: [],
      selectedValue: '',
      filter: {
        qitianwuliyou: true,
        jiayifashi: true,
        removeRepeat: true,
        forbiddenWordsFilter: true,
        minPrice: 0
      },
      requestTask: '',
      taobaoItemId: '',
      uploadConfig: {
        singlePriceTimes: 1.08,
        groupPriceTimes: 1.08,
        markPriceTimes: 1.5
      }
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
      if (window.taobaoCopyNotifyFromJava === undefined) {
        window.taobaoCopyNotifyFromJava = this.taobaoCopyNotifyFromJava
      }
      // taobaoCopyNotifyListFromJava
      if (window.taobaoCopyNotifyListFromJava === undefined) {
        window.taobaoCopyNotifyListFromJava = this.taobaoCopyNotifyListFromJava
      }
      if (window.taobaoCopyLogFromJava === undefined) {
        window.taobaoCopyLogFromJava = this.taobaoCopyLogFromJava
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
    mallSelectChange(event, value) {
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
      if (this.requestTask.length <= 0 || JSON.stringify(this.requestTask) === '{}') {
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
      console.log(JSON.stringify(this.requestTask))
      var that = this
      this.$axios.all([this.getMallInfo(), this.getTaobaoItemInfo()])
        .then(this.$axios.spread(function(mallInfo, itemJson) {
          console.log(itemJson)
          window.taobaoCopy.uploadToPinduoduo(JSON.stringify(mallInfo), itemJson)
        })).finally(() => {
          that.tableLoading = false
        })
      // this.$request({
      //   url: '/user-access-token/mallInfo',
      //   method: 'post',
      //   params: {
      //     mallInfo: JSON.stringify(this.requestTask)
      //   }
      // }).then(res => {
      //   window.taobaoCopy.uploadToPinduoduo(this.taobaoItemId, JSON.stringify(res), JSON.stringify(this.uploadConfig), JSON.stringify(this.filter))
      //   // alert(JSON.stringify(res))
      // }).finally(() => {
      //   this.tableLoading = false
      // })
    },
    /*
    获取店铺信息的请求
     */
    getMallInfo() {
      return this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.requestTask)
        }
      })
    },
    /*
    获取淘宝的json
     */
    getTaobaoItemInfo() {
      return this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo/99api',
        method: 'get',
        params: {
          itemId: this.taobaoItemId
        }
      })
    },
    taobaoCopyNotifyFromJava(item) {
      this.$notify.info({
        title: '淘宝上货',
        message: item,
        duration: 15000,
        position: 'bottom-right'
      })
    },
    taobaoCopyNotifyListFromJava(item) {
      this.taskDetailData = JSON.parse(item)
      console.log(item)
    },
    uploadCookie() {
      window.taobaoCopy.uploadCookie()
    },
    taobaoCopyLogFromJava(item) {
      this.taskDetailData.push(JSON.parse(item))
    }
  }
}
</script>

<style scoped>

</style>
