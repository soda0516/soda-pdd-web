<template>
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
    </div>
    <div class="app-container">
      <!--      style="width: 100%"-->
      <el-table
        :data="tableData"
        :border="true"
        empty-text="没有采集任务">
        <el-table-column
          label="文档名称"
          width="500">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="链接数量"
          width="120">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.urlCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="120">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.taskState }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="260">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <!--        width="180"-->
        <el-table-column
          label="完成时间">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.completeTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    采集后的数据列表-->
    <div
      v-loading="tableLoading"
         class="app-container"
         element-loading-text="数据加载中"
         element-loading-spinner="el-icon-loading">
      <!--      style="width: 100%"-->
      <el-table
        :data="taskResultList"
        :border="true"
        empty-text="没有可显示的采集数据，请上传文档或稍后访问">
        <el-table-column
          label="原淘宝链接地址"
          width="400">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <el-link :href="scope.row.oriGoodsUrl" type="primary" target="_blank">{{ scope.row.oriGoodsUrl }}</el-link>
<!--            <span style="margin-left: 10px">{{ scope.row.oriGoodsUrl }}</span>-->
          </template>
        </el-table-column>
        <el-table-column
          label="是否有同款"
          width="80">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span v-if="scope.row.sameStyle === true" style="margin-left: 10px">是</span>
            <span v-if="scope.row.sameStyle === false" style="margin-left: 10px">否</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否代发、实拍、退款"
          width="80">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <!--            <i class="el-icon-time"></i>-->
            <span v-if="scope.row.threeTag === true" style="margin-left: 10px">是</span>
            <span v-if="scope.row.threeTag === false" style="margin-left: 10px">否</span>
            <!--            <span style="margin-left: 10px">{{ scope.row.threeTag }}</span>-->
          </template>
        </el-table-column>
        <el-table-column
          label="淘宝价格"
          width="100">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.oriGoodsPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="搜款网价格"
          width="120">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.priceRange }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="差价"
          width="120">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.priceDifferencesRange }}</span>
          </template>
        </el-table-column>
        <!--        width="180"-->
        <el-table-column
          label="商品详情页地址">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <el-link :href="scope.row.samePageUrl" type="primary" target="_blank">{{ scope.row.samePageUrl }}</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="app-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageTotal"
          style="float:right;margin-bottom: 100px"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page="currentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DataCollection',
  data() {
    return {
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
      tableData: [],
      taskResultList: [],
      start: 0,
      pageNumber: 12,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      tableLoading: false,
      topTableLoading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.topTableLoading = true
      this.$request({
        url: 'spider/tusou/task/recent',
        method: 'get'
      }).then(res => {
        // 如果返回的信息，和当前的信息一样，就不更新队列，也不进行储存
        if (res && res !== this.taskContent) {
          this.taskContent = res
          // 初始化，先清空
          this.tableData = []
          this.tableData.push(this.taskContent)
          this.getTaskResult(this.taskContent, 1)
        }
        // 获得数据之后，还得再发起个请求，获得采集之后的数据列表
        // this.redirect ||
      }).finally(() => {
        this.topTableLoading = false
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
        formData.append('file', item.file)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
          }
        }
        this.$request.post('/spider/tusou/task/active', formData, config)
          .then(res => {
            // console.log(res.data)
            this.taskResultList = []
            // eslint-disable-next-line no-undef
            this.tableData.splice(0, this.tableData.length)
            this.tableData.push(res)
            this.getTaskResult(res)
            this.init()
          })
          .finally(() => {
            this.fullscreenLoading = false
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
    handleTaskStart(row) {
      // console.log(index, row)
      this.fullscreenLoading = true
      this.$request({
        url: 'spider/tusou/task/load',
        method: 'post',
        params: {
          task: row
        }
      }).then(res => {
        this.taskResultList = []
        // eslint-disable-next-line no-undef
        this.tableData.splice(0, this.tableData.length)
        this.tableData.push(res)
        this.getTaskResult(res)
        // this.redirect ||
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    handleTaskDownload(row) {
      // console.log(row)
      if (row.taskState !== '已完成') {
        this.$message({
          message: '文档还没有完成，请等待后台完成后下载',
          type: 'warning'
        })
        return
      }
      this.fullscreenLoading = true
      this.$axios({
        responseType: 'blob',
        method: 'post',
        url: 'http://127.0.0.1:7007/spider/tusou/task/download',
        // url: 'https://api.loongwine.cn/cantfind/spider/api/spider/tusou/task/download',
        params: {
          task: row
        }
      }).then(res => {
        // eslint-disable-next-line no-undef
        // const url = window.URL.createObjectURL(new Blob([res]))
        const blob = new Blob([res])// 处理文档流
        const fileName = 'excel.xls'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        // this.redirect ||
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    getTaskResult(item, currentPage) {
      // this.taskResultList = []
      this.tableLoading = true
      this.$request({
        url: 'spider/tusou/task/result',
        method: 'get',
        params: {
          task: item,
          current: currentPage,
          pages: this.pageNumber
        }
      }).then(res => {
        if (res.records) {
          // eslint-disable-next-line no-undef
          this.taskResultList = res.records
          this.pageTotal = res.total
          this.pageSize = res.size
        }
        // this.redirect ||
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTaskResult(this.taskContent, val)
    }
  }
}
</script>

<style scoped>

</style>
