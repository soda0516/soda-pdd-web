<template>
  <div
    v-loading="tableLoading"
    class="app-container"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="绑定店铺信息:">
        <span>{{ selectedMallName }}</span>
<!--        <el-select v-model="selectedMall" placeholder="绑定店铺信息" disabled>-->
<!--          <el-option-->
<!--            v-for="item in mallList"-->
<!--            :key="item.id"-->
<!--            :label="item.mall_name"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
      </el-form-item>
      <el-form-item>
        <div/>
      </el-form-item>
      <el-form-item label="草稿状态">
        <el-select v-model="optionValue" placeholder="请选择草稿状态" @change="draftChange">
          <el-option
            v-for="item in checkStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="warning"
          @click="searchDraft"
        >显示商品草稿</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          :disabled="removeDisabled"
          @click="removeDraft"
        >清理选中商品</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24">
      <el-table
        ref="multipleTable"
        :data="draftGoodsList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChangeGoodsList"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column
          label="商品ID"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.goods_id }}</span>
            <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goods_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="check_status"
          label="草稿状态"
          width="120"
          :formatter="formatterStatus"
          align="center"
        />
        <el-table-column
          prop="check_status"
          label="是否新增"
          width="80"
          :formatter="formatterShop"
          align="center"
        />
        <el-table-column prop="submit_time" label="提交时间" width="220" :formatter="formatDateSubmitTime" align="center" />
        <el-table-column prop="checked_time" label="审核时间" width="220" :formatter="formatDateCheckTime" align="center" />
        <el-table-column label="驳回原因" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.reject_comment }}</span>
          </template>
        </el-table-column>
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
    </el-row>
  </div>
</template>
<script>
import { getToken } from '../../../utils/auth'
export default {
  name: 'FastOnOffSale',
  data() {
    return {
      loadingText: '数据列表加载中',
      tableLoading: false,
      buttonLoading: false,
      pageNumber: 10,
      currentPage: 1,
      pageSize: 16,
      pageTotal: 1,
      formInline: {
        user: '',
        region: ''
      },
      radio: '',
      requestTask: {},
      requestMallList: [],
      requestSale: [],
      mallList: [],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          testValue: ''
        }
      ],
      requestNumber: 0,
      nofify: {},
      // 0:编辑中,1:审核中,2:审核通过,3:审核驳回
      checkStatusOptions: [
        {
          label: '编辑中',
          value: 0
        },
        {
          label: '审核中',
          value: 1
        },
        {
          label: '审核通过',
          value: 2
        },
        {
          label: '审核驳回',
          value: 3
        }
      ],
      optionValue: 0,
      /*
      用来显示商品列表分页用的
       */
      currentPageNumber: 1,
      multipleSelection: [],
      draftGoodsList: [],
      selectedMall: '',
      removeDisabled: false,
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
    /*
    radio选中一个店铺的信息
     */
    getTemplateMallRow(index, item) {
      this.requestTask = item
      this.requestNumber = item.totalCount
    },
    handleSelectionChangeGoodsList(val) {
      this.multipleSelection = val
    },
    searchDraft() {
      this.currentPage = 1
      this.pageDraft()
    },
    pageDraft: function() {
      console.log(this.selectedMall)
      this.tableLoading = true
      this.$request({
        url: '/goods/draft?token=' + getToken(),
        method: 'GET',
        params: {
          id: this.selectedMall,
          check_status: this.optionValue,
          page: this.currentPage,
          page_size: this.pageSize
        }
      }).then(res => {
        console.log(res)
        this.draftGoodsList = res.d.goods_commit_list_get_response.list
        this.pageTotal = res.d.goods_commit_list_get_response.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    async removeDraft() {
      console.log(this.multipleSelection)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        await this.removeOneDraft(this.multipleSelection[i].goods_id)
      }
      await this.pageDraft()
      // await this.removeOneDraft()
    },
    async removeOneDraft(goods_commit_id) {
      this.tableLoading = true
      await this.$request({
        url: '/goods/deletedraft?token=' + getToken(),
        method: 'GET',
        params: {
          id: this.selectedMall,
          goods_commit_id: goods_commit_id
        }
      }).then(res => {
        console.log(res)
        this.draftGoodsList = res.d.goods_commit_list_get_response.list
        this.pageTotal = res.d.goods_commit_list_get_response.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    draftChange(value) {
      if (value === 2) {
        this.removeDisabled = true
      } else {
        this.removeDisabled = false
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageDraft()
    },
    formatterStatus(row, col) {
      for (let i = 0; i < this.checkStatusOptions.length; i++) {
        if (this.checkStatusOptions[i].value === row.check_status) {
          return this.checkStatusOptions[i].label
        }
      }
    },
    formatterShop(row, col) {
      if (row.is_shop > 0) {
        return '修改'
      } else {
        return '新增'
      }
    },
    formatDateSubmitTime(row, column) {
      // 获取单元格数据
      const data = row.submit_time
      if (data == null) {
        return null
      }
      var dt = new Date(data * 1000)
      return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分' + dt.getSeconds() + '秒'
      // + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    formatDateCheckTime(row, column) {
      // 获取单元格数据
      const data = row.checked_time
      if (data == null) {
        return null
      }
      var dt = new Date(data * 1000)
      console.log(dt)
      return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日' + dt.getHours() + '时' + dt.getMinutes() + '分' + dt.getSeconds() + '秒'
    }
  }
}
</script>
<style scoped>
</style>
