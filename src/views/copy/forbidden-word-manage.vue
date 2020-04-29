<template>
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
          :disabled="uploadButtonState"
          @click="submitFile">上传文件并立即开始采集</el-button>
        <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过500kb</div>
      </el-upload>
      <el-divider content-position="left">违禁词列表</el-divider>
      <el-form>
        <el-form-item label="系统违禁词：">
          <el-tag
            v-for="tag in systemTags"
            :key="tag.id">
            {{tag.forbiddenWord}}
          </el-tag>
        </el-form-item>
        <el-form-item label="用户违禁词：">
          <el-tag
            v-for="tag in userTags"
            :key="tag.id"
            closable
            @close="handleClose(tag)">
            {{tag.forbiddenWord}}
          </el-tag>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'ForbiddenWordManage',
  data() {
    return {
      uploadButtonState: false,
      fullscreenLoading: false,
      fileList: [],
      forbiddenWordList: [],
      systemTags: [],
      userTags: [],
      file: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo-forbidden-word/list',
        method: 'get'
      }).then((list) => {
        this.systemTags = []
        this.userTags = []
        this.forbiddenWordList = list
        for (let i = 0; i < this.forbiddenWordList.length; i++) {
          if (this.forbiddenWordList.systemDefault) {
            this.systemTags.push(this.forbiddenWordList[i])
          } else {
            this.userTags.push(this.forbiddenWordList[i])
          }
        }
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
    httpRequest(item) {
      if (item.file) {
        this.fullscreenLoading = true
        const formData = new FormData()
        formData.append('file', item.file)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
          }
        }
        this.$request.post('/pinduoduo-task-copy-taobao-to-pinduoduo-forbidden-word/new', formData, config)
          .then(res => {
            this.forbiddenWordList = res
            this.init()
          }).finally(() => {
            this.fullscreenLoading = false
          })
        // eslint-disable-next-line no-empty
      }
    },
    /*
    删除一个自定义标签
     */
    handleClose(tag) {
      this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo-forbidden-word',
        method: 'delete',
        data: tag
      }).then((res) => {
        var index = this.userTags.indexOf(tag)
        this.userTags.splice(index, 1)
        this.$message({
          message: '移除自定义违禁词成功',
          type: 'success'
        })
      })
    },
    /*
    暂时让按钮点击不可用的方法
     */
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
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
