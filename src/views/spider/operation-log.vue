<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading">
      <el-table
        :data="tableData"
        style="width: 100%"
        :border="true">
        <el-table-column
          label="文档名称"
          width="420">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="链接数量"
          width="90">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.urlCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="90">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.taskState }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="完成时间"
          width="180">
          <template slot-scope="scope">
            <!--            <i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.completeTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--            <el-button-->
            <!--              size="mini"-->
            <!--              @click="handleTaskStart(scope.$index, scope.row)">启动</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="handleTaskDownload(scope.$index, scope.row)">下载</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleTaskDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="app-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageTotal"
          style="float:right;margin-bottom: 100px"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationLog',
  // components: { AccountManage, StaffMaintenance, AddStaff, ProfessionSettings, PostInfo, BasicData },
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
      start: 0,
      pageNumber: 10,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      tableLoading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getTaskList(1, this.pageNumber)
    },
    getTaskList(current) {
      // tusou/task/list
      // console.log(index, row)
      this.tableLoading = true
      this.$request({
        url: 'spider/tusou/task/list/page',
        method: 'get',
        params: {
          current: current,
          pages: this.pageNumber

        }
      }).then(res => {
        this.tableData = res.records
        this.pageTotal = res.total
        this.pageSize = res.size
        // this.redirect ||
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleTaskDownload(index, row) {
      const xlsName = row.fileName.replace('.txt', '')
      if (row.taskState !== '已完成') {
        this.$message({
          message: '文档还没有完成，请等待后台完成后下载',
          type: 'warning'
        })
        return
      }
      this.fullscreenLoading = true
      this.$request({
        responseType: 'blob',
        method: 'post',
        url: 'spider/tusou/task/download',
        // url: 'https://api.loongwine.cn/cantfind/spider/api/spider/tusou/task/download',
        params: {
          task: row
        }
      }).then(res => {
        // eslint-disable-next-line no-undef
        // const url = window.URL.createObjectURL(new Blob([res]))
        const blob = new Blob([res])// 处理文档流
        const fileName = xlsName + '.xls'
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
    handleTaskDelete(index, row) {
      if (row.taskState === '已完成') {
        this.$request({
          url: 'spider/tusou/task',
          method: 'delete',
          params: {
            task: row
          }
        }).then(res => {
          // eslint-disable-next-line no-undef
          const index = this.tableData.indexOf(row)
          this.tableData.splice(index, 1)
          // this.redirect ||
        }).finally(() => {
          this.fullscreenLoading = false
        })
      } else {
        this.$message({
          message: '采集工作还没完成，暂时不能删除任务',
          type: 'warning'
        })
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTaskList(val)
    }
  }
}
</script>
<style scoped>

</style>
