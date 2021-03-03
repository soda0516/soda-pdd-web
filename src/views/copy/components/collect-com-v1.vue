<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div style="float: right">
          <el-form
            :inline="true"
            label-position="left"
            status-icon
            style="padding-bottom: 0"
          >
            <!--            label-width="90px"-->
            <el-form-item label="绑定店铺信息">
              <el-select v-model="selectedMall" placeholder="选择店铺" disabled>
                <el-option
                  v-for="item in mallList"
                  :key="item.id"
                  :label="item.mall_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="任务状态">
              <el-select v-model="selectedStatus" placeholder="任务状态">
                <el-option
                  v-for="item in statusList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button :loading="tableLoading" type="primary" @click="showRecord">显示记录列表</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div>
        <el-table
          v-loading="tableLoading"
          :data="collectList"
          border
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <!--          https://item.taobao.com/item.htm?id=625682214487-->
          <el-table-column
            prop="out_goods_id"
            label="外部商品ID"
            width="200"
          />
          <el-table-column
            prop="out_detail_url"
            label="外部商品链接"
            width="400"
          />
          <el-table-column
            prop="goods_id"
            label="拼多多商品ID"
            width="200"
          />
          <el-table-column
            prop="createtime"
            label="创建时间"
            :formatter="formatDate"
            width="240"
          />
          <el-table-column
            prop="finishtime"
            :formatter="formatDate"
            label="结束时间"
            width="240"
          />
          <el-table-column
            prop="result"
            label="任务状态"
            width="100"
            :formatter="formatterStatus"
          />
          <el-table-column
            prop="reason"
            label="备注"
          />
        </el-table>
        <el-pagination
          background
          :page-size="pageSize"
          :current-page="currentPage"
          layout="prev, pager, next"
          :total="pageTotal"
          style="margin-top: 15px;text-align: right"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-row>
  </div>
</template>

<script>
import { getToken } from '../../../utils/auth'
export default {
  name: 'CollectComV1',
  data() {
    return {
      tableLoading: false,
      pageTotal: 1,
      pageSize: 16,
      currentPage: 1,
      collectList: [],
      selectedMall: '',
      mallList: [],
      statusList: [
        {
          value: 100,
          label: '全部任务'
        },
        {
          value: 0,
          label: '进行中'
        },
        {
          value: 1,
          label: '抓取成功'
        },
        {
          value: 2,
          label: '上传失败'
        }
      ],
      selectedStatus: 100
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
        }
        this.showRecord()
        // alert(this.$global.showMallInfo)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    mallSelectChange() { },
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property]
      if (data == null) {
        return null
      }
      var dt = new Date(data)
      return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分' + dt.getSeconds() + '秒'
      // + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageRecord()
    },
    showRecord() {
      this.currentPage = 1
      this.pageRecord()
    },
    pageRecord() {
      console.log(this.selectedMall)
      this.tableLoading = true
      this.$request({
        url: '/move/list?token=' + getToken(),
        method: 'GET',
        params: {
          id: this.selectedMall,
          status: this.selectedStatus,
          page: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        this.collectList = res.d
        this.pageTotal = res.count
      }).finally(() => {
        this.tableLoading = false
      })
    },
    formatterStatus(row, col) {
      if (row.result === 100) {
        return '全部任务'
      } else if (row.result === 0) {
        return '进行中'
      } else if (row.result === 1) {
        return '抓取成功'
      } else if (row.result === 2) {
        return '上传失败'
      } else if (row.result === 3) {
        return '上传成功'
      } else {
        return '未知状态'
      }
    }
  }
}
</script>

<style scoped>
</style>
