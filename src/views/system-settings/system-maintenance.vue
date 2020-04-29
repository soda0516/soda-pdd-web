<template>
  <div>
    <div class="app-container">
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
    <div class="app-container">
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
            <span style="margin-left: 10px">{{ scope.row.oriGoodsUrl }}</span>
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
          label="淘宝店价格"
          width="60">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.oriGoodsPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="价格区间"
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
          label="同款链接地址">
<!--          slot-scope="scope"-->
          <template >
            <!--            <i class="el-icon-time"></i>-->
            <el-link href="https://element.eleme.io" type="primary" target="_blank">测试</el-link>
<!--            <a :herf="'http://www.baidu.com'" target="_blank" style="margin-left: 10px">{{ scope.row.samePageUrl }}</a>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemMaintenance',
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
      goodsAddress: '',
      tableData: [],
      taskResultList: [],
      start: 0,
      pageNumber: 1
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // // tusou/task/list
      // /tusou/task/recent
      // // console.log(index, row)
      this.fullscreenLoading = true
      this.$request({
        url: 'spider/tusou/task/recent',
        method: 'get'
      }).then(res => {
        // eslint-disable-next-line no-undef
        // console.log('先打印res' + res)
        if (res.data) {
          this.tableData.push(res.data)
          this.getTaskResult(res.data)
        }
        // 获得数据之后，还得再发起个请求，获得采集之后的数据列表

        // this.redirect ||
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    // },
    handleOnChange(file, fileList) {
      this.file = file
      console.log(this.file)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess() {
    },
    beforeUpload(file) {
      // console.log('beforeUpload运行了一次')
      // const formData = new FormData()
      // formData.append('file', file)
      // const config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
      //   }
      // }
      // this.$request.post('spider/file', formData, config)
      //   .then(res => {
      //     console.log(res)
      //   })
    },
    httpRequest(item) {
      const formData = new FormData()
      formData.append('file', item.file)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
        }
      }
      this.$request.post('/spider/tusou/upload', formData, config)
        .then(res => {
          // console.log(res.data)
          this.handleTaskStart(res.data)
          this.init()
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },
    submitFile() {
      this.fullscreenLoading = true
      this.$refs.upload.submit()
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
        // eslint-disable-next-line no-undef
        this.tableData.splice(0, this.tableData.length)
        this.tableData.push(res.data)
        this.getTaskResult(res.data)
        // this.redirect ||
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    handleTaskDownload(row) {
      console.log(row)
      if (row.taskState !== '已完成') {
        alert('文档还没有完成，请等待后台完成后下载')
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
        console.log(res)
        const blob = new Blob([res.data])// 处理文档流
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
    getTaskResult(item) {
      this.taskResultList = []
      this.$request({
        url: 'spider/tusou/task/result',
        method: 'get',
        params: {
          task: item
        }
      }).then(res => {
        // eslint-disable-next-line no-undef
        console.log(res.data)
        this.taskResultList = res.data
        // this.redirect ||
      }).finally(() => {
        this.fullscreenLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
