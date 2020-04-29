<template>
  <el-row>
    <el-col :span="12">
      <div class="app-container">
        <el-form ref="form" label-width="80px">
          <el-form-item label="上传文档">
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
              <div slot="tip" class="el-upload__tip">只能上传xls文件，注意文件内格式</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="访客数量">
            <el-input-number v-model="requestTask.maxGoodsUv" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="浏览数量">
            <el-input-number v-model="requestTask.maxGoodsPv" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="支付数量">
            <el-input-number v-model="requestTask.maxGoodsOrdrcnt" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input v-model="requestTask.taskDesc" :autosize="{ minRows: 3, maxRows: 6}" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="启动按钮">
            <el-button type="danger" @click="setupNoFlowTool">点击启动无流量下架工具</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="app-container">
        <el-table
          :data="tableData"
          max-height="800"
          border
          style="width: 100%">
          <el-table-column
            prop="mallUsername"
            label="店铺登录名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="maxGoodsUv"
            label="最大访客数"
            width="180">
          </el-table-column>
          <el-table-column
            prop="maxGoodsPv"
            label="最大浏览量">
          </el-table-column>
          <el-table-column
            prop="maxGoodsOrdrcnt"
            label="支付件数">
          </el-table-column>
          <el-table-column
            prop="detailDesc"
            label="任务状态">
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'NoflowOffShelve',
  data() {
    return {
      requestTask: {
        taskDesc: '',
        daysAgo: 0,
        maxGoodsUv: 0,
        maxGoodsPv: 0,
        maxGoodsOrdrcnt: 0,
        taskMallCount: 0
      },
      file: '',
      fileList: '',
      fullscreenLoading: false,
      tableData: [{
        mallUsername: '',
        maxGoodsUv: '',
        maxGoodsPv: '',
        maxGoodsOrdrcnt: ''
      }],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mounted() {
    this.getDetailList()
  },
  methods: {
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
        const formData = new FormData()
        formData.append('task', JSON.stringify(this.requestTask))
        formData.append('file', item.file)
        this.$confirm('任务新建成功，立即开启将替换掉以往任务，是否替换并开始信息采集？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
            }
          }
          this.$request.post('/pinduoduo-task-no-flow-off-sale', formData, config)
            .then(res => {
              this.getDetailList()
              console.log(res)
            }).finally(() => {
            // this.init()
              this.fullscreenLoading = false
            })
          // this.startCollection(res)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '等待手动启动采集任务'
          })
        })
        // eslint-disable-next-line no-empty
      }
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
    getDetailList() {
      this.$request.get('/pinduoduo-task-no-flow-off-sale-detail/list-user')
        .then(res => {
          this.tableData = res
          console.log(res)
        })
    },
    setupNoFlowTool() {
      // eslint-disable-next-line no-undef
      javaNoFlowTool.start('hahaha')
    }
  }
}
</script>

<style scoped>

</style>
