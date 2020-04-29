<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <div>
          <div
            :loading="topTableLoading"
            class="app-container"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="string"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :limit="1"
              :multiple="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleOnChange"
              :on-success="handleSuccess"
              :file-list="fileList"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取相关的文本文档</el-button>
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="margin-left: 10px;"
                size="small"
                type="success"
                :disabled="uploadButtonState"
                @click="submitFile">上传文件并立即开始采集</el-button>
              <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过500kb</div>
            </el-upload>
            <el-divider content-position="left">当前任务</el-divider>
            <el-table
              :data="recentTask"
              border
              style="width: 100%">
              <el-table-column
                prop="modifyTime"
                label="最后修改时间"
                width="140">
              </el-table-column>
              <el-table-column
                prop="fileUploadName"
                label="文档名称">
              </el-table-column>
              <el-table-column
                prop="runningStatus"
                label="任务状态"
                width="100">
              </el-table-column>
              <el-table-column
                prop="fileMallUrlCount"
                label="链接数"
                width="65">
              </el-table-column>
              <el-table-column
                prop="fileMallUrlValidCount"
                label="有效数"
                width="65">
              </el-table-column>
              <el-table-column
                prop="collectionCount"
                label="采集数"
                width="65">
              </el-table-column>
              <el-table-column
                label="操作"
                width="80">
                <template slot-scope="scope">
                  <!--            <i class="el-icon-time"></i>-->
                  <el-button type="success" size="mini" @click="showCopyTools">采集</el-button>
<!--                  <b style="margin-left: 10px">{{ scope.row.mallInfo.mallName }}</b>-->
                </template>
              </el-table-column>
            </el-table>
            <el-divider content-position="left">任务明细列表</el-divider>
            <el-table
              :data="taskDetailData"
              height="550"
              border
              style="width: 100%">
              <el-table-column
                prop="uploadStatus"
                label="上传状态"
                width="180">
              </el-table-column>
              <el-table-column
                prop="taobaoItemId"
                label="淘宝商品ID"
                width="180">
              </el-table-column>
              <el-table-column
                prop="itemSource"
                width="120"
                label="货源">
              </el-table-column>
              <el-table-column
                prop="uploadResponseErrorMessage"
                label="上传信息">
              </el-table-column>
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
              <el-select v-model="selectedMall" clearable placeholder="请选择">
                <el-option
                  v-for="item in mallList"
                  :key="item.id"
                  :label="item.mallName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商家承诺">
              <el-checkbox v-model="filter.jiayifashi" disabled>假一罚十</el-checkbox>
            </el-form-item>
            <el-form-item label="商家承诺">
              <el-checkbox v-model="filter.qitianwuliyou" disabled>七天无理由退换货</el-checkbox>
            </el-form-item>
            <el-form-item label="上传设置">
              <el-checkbox v-model="filter.removeRepeat">过滤重复上传商品</el-checkbox>
            </el-form-item>
            <el-form-item label="上传设置">
              <el-checkbox v-model="filter.forbiddenWordsFilter">过滤违禁词</el-checkbox>
            </el-form-item>
            <el-form-item label="最低价格">
              <el-input-number v-model="filter.minPrice" :min="0" :step=1 size="small"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple-light">
        <div class="app-container">
          <el-divider content-position="left">上传设置</el-divider>
          <el-form ref="form" :model="form" label-width="160px">
            <el-form-item label="单买价格（倍数）">
              <el-input-number v-model="form.singlePriceTimes" :max="form.maxSinglePrice" :step="0.01" size="small"></el-input-number>
            </el-form-item>
            <el-form-item label="团购价格（倍数-1元）">
              <el-input-number v-model="form.groupPriceTimes" :max="form.maxMutiPrice" :step="0.01" size="small"></el-input-number>
            </el-form-item>
            <el-form-item label="市场价格（倍数）">
              <el-input-number v-model="form.markPriceTimes" :max="form.maxMarketPrice" :step=0.01 size="small"></el-input-number>
            </el-form-item>
<!--            <el-form-item>-->
<!--              <el-button @click="showCopyTools">测试单机</el-button>-->
<!--            </el-form-item>-->
            <!--            <el-form-item label="sku库存">-->
            <!--              <el-input-number v-model="form.name" size="small"></el-input-number>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="">-->
            <!--              <el-checkbox-group v-model="form.type">-->
            <!--                <el-checkbox label="假一罚十" name="type"/>-->
            <!--                <el-checkbox label="过滤72小时不发货" name="type"/>-->
            <!--                <el-checkbox label="二手商品" name="type"/>-->
            <!--                <el-checkbox label="过滤预售商品" name="type"/>-->
            <!--                <el-checkbox label="七天无理由退换货" name="type"/>-->
            <!--              </el-checkbox-group>-->
            <!--            </el-form-item>-->
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'TaobaoPinduoduoGoodsCopy',
  data() {
    return {
      recentTask: [],
      taskDetailData: [],
      form: {
        singlePriceTimes: 1.08,
        groupPriceTimes: 1.08,
        markPriceTimes: 1.5,
        maxSinglePrice: 1.08,
        maxMutiPrice: 1.08,
        maxMarketPrice: 1.5,
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      file: '',
      fileList: [],
      activeName: 'first',
      fullscreenLoading: false,
      input: '',
      fileInfo: {
        fileName: '',
        urlCount: 0
      },
      uploadButtonState: false,
      taskContent: '',
      goodsAddress: '',
      // tableData: [],
      taskResultList: [],
      start: 0,
      pageNumber: 12,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      tableLoading: false,
      topTableLoading: false,
      websock: null,
      mallList: [],
      selectedMall: '',
      filter: {
        qitianwuliyou: true,
        jiayifashi: true,
        removeRepeat: true,
        forbiddenWordsFilter: true,
        minPrice: 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.tableLoading = true
      this.$axios.all([this.getMallList(), this.getRecentTask()])
        .then(this.$axios.spread((mallList, recentTask) => {
          console.log(mallList)
          console.log(recentTask)
          this.mallList = mallList
          // 先设置一下默认的店铺
          this.selectedMall = this.mallList[0].id
          this.recentTask = recentTask
          console.log(mallList)
          console.log(this.recentTask)
          if (this.recentTask.length > 0) {
            this.getDetailList(this.recentTask[0])
          }
        }))
        .finally(() => {
          this.tableLoading = false
        })
    },
    getMallList() {
      return this.$request({
        url: '/pinduoduo-mall-info/mall-list',
        method: 'get'
      })
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleOnChange(file, fileList) {
      this.file = file
      console.log(this.file)
      // console.log(this.file)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess() {
    },
    beforeUpload(file) {
    },
    httpRequest(item) {
      if (item.file) {
        this.$request({
          url: '/pinduoduo-mall-info/mall-list',
          method: 'get'
        }).then((mallList) => {
          this.mallList = mallList
          const formData = new FormData()
          formData.append('task', JSON.stringify({
            'mallId': this.selectedMall,
            'singlePriceTimes': this.form.singlePriceTimes,
            'groupPriceTimes': this.form.groupPriceTimes,
            'markPriceTimes': this.form.markPriceTimes }))
          formData.append('file', item.file)
          formData.append('filter', JSON.stringify(this.filter))
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
            }
          }
          this.$request.post('/pinduoduo-task-copy-taobao-to-pinduoduo/new', formData, config)
            .then(res => {
              this.$message({
                type: 'info',
                message: '任务新建成功，清点击下方采集按钮启动淘宝采集工具'
              })
            }).finally(() => {
              this.init()
              this.fullscreenLoading = false
            })
        })
        // eslint-disable-next-line no-empty
      }
    },
    submitFile() {
      this.countDown()
      if (this.file) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          message: '请选择一个文档',
          type: 'warning'
        })
      }
    },
    startCollection(task) {
      this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo/start-collection',
        methods: 'get',
        params: {
          task: task
        }
      }).then((res) => {
        this.getRecentTask()
        this.$message({
          type: 'success',
          message: '采集任务已经开启，请耐心等待!'
        })
      })
    },
    countDown() {
      // eslint-disable-next-line no-unused-vars
      let totalTime = 3
      if (this.uploadButtonState) return // 改动的是这两行代码
      this.uploadButtonState = true
      // this.content = this.totalTime + 's后重新发送'
      const clock = window.setInterval(() => {
        totalTime--
        // this.content = this.totalTime + 's后重新发送'
        if (totalTime < 0) {
          window.clearInterval(clock)
          // this.content = '重新发送验证码'
          totalTime = 3
          this.uploadButtonState = false // 这里重新开启
        }
      }, 1000)
    },
    /**
     * 获取一个任务明细的列表
     * @param task
     */
    getDetailList(task) {
      this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo-detail/list',
        methods: 'get',
        params: {
          id: task.id
        }
      }).then((res) => {
        this.taskDetailData = res
      })
    },
    getRecentTask() {
      return this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo/list-recent',
        methods: 'get'
      })
    },
    showCopyTools() {
      // eslint-disable-next-line no-undef
      javaTest.test()
    }
  }
}
</script>

<style scoped>

</style>
