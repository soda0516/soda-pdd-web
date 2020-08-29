<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="时间范围">
            <el-date-picker
              style="width:66%"
              v-model="value2"
              type="daterange"
              align="right"
              format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" @click="saveGoodsListFromHistoryOrder">分析订单中商品并保存</el-button>
          </el-form-item>
        </el-form>
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
        <p>啊</p>
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-divider content-position="left">
            <el-tag  type="info">历史查询记录</el-tag>
          </el-divider>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="查询日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="包含商品数量">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'NoOrderClean',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: '',
      tableData: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      mallList: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
      this.tableLoading = true
      if (window.noOrderClean === undefined) {
        window.noOrderClean = this.noOrderClean
      }
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
    saveGoodsListFromHistoryOrder() {
      this.$request({
        url: '/user-access-token/mallInfo',
        method: 'post',
        params: {
          mallInfo: JSON.stringify(this.mallList[0])
        }
      }).then(res => {
        window.noOrderClean.saveOrderGoodsListByDate(JSON.stringify(res), JSON.stringify(this.value2))
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
      })
      console.log(this.value2)
      // console.log(this.value2)
    }
  }
}
</script>

<style scoped>

</style>
