<template>
  <div
    class="app-container"
  >
    <el-divider content-position="left">
      店铺信息列表
    </el-divider>
    <div
      v-loading="tableLoading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <el-table
        :data="mallList"
        style="width: 100%"
        :border="true"
      >
<!--        <el-table-column label="操作" width="100px" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              @click="removeMall"-->
<!--            >删除</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          label="首图"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <img width="55px" height="55px" :src="scope.row.mall_logo">
          </template>
        </el-table-column>
        <el-table-column
          label="店铺名称"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.mall_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺描述"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.mall_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="merchant_type"
          label="类型"
          width="200"
          align="center"
          :formatter="formatterType"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getToken } from '../../utils/auth'
export default {
  name: 'MallOperate',
  data() {
    return {
      dialogVisible: false,
      loadingText: '数据列表加载中',
      tableLoading: false,
      buttonLoading: false,
      mallList: [],
      pageNumber: 10,
      currentPage: 1,
      pageSize: 1,
      pageTotal: 1,
      qrUrl: '',
      stockCount: 0,
      updateNotifyInstance: {},
      visible: true,
      syncButtonLoading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.refrashMallInfo()
    },
    removeMall() {

    },
    updateMallInfo() {
      this.loadingText = '更新店铺信息中...'
      this.tableLoading = true
      var that = this
      // mallInfo
      this.syncButtonLoading = true
      this.$axios.all([this.getKey(), this.getList()])
        .then(this.$axios.spread(function(keyStr, mallListSTr) {
          var list = window.mallInfo.getMallInfoAndSave(JSON.stringify(keyStr), JSON.stringify(mallListSTr))
          that.mallList = JSON.parse(list)
        })).finally(() => {
          that.tableLoading = false
          that.syncButtonLoading = false
        })
    },
    updateAllMallInfoListGoodsItem() {
      this.loadingText = '更新店铺并拉取商品中...'
      this.tableLoading = true
      // mallInfo
      this.syncButtonLoading = true
      this.$request({
        url: '/pinduoduo-mall-info/v1/mall-info',
        method: 'put'
      }).then(res => {
        var list = window.mallInfo.getMallInfoAndSaveV1(JSON.stringify(res))
        this.mallList = JSON.parse(list)
        // window.fastOnOffSale.circleOnOffSale(JSON.stringify(res), this.requestNumber)
        // alert(JSON.stringify(res))
      }).finally(() => {
        this.tableLoading = false
        this.syncButtonLoading = false
        this.$global.showTootip = false
        this.visible = this.$global.showTootip
      })
    },
    getList() {
      return this.$request({
        url: '/local/shop/list?token=' + getToken(),
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getKey() {
      return this.$request({
        url: '/user-access-token/key',
        method: 'post'
      })
    },
    refrashMallInfo() {
      this.loadingText = '获取店铺信息中...'
      this.tableLoading = true
      var that = this
      // mallInfo
      this.$axios.all([this.getList()])
        .then(this.$axios.spread(function(mallListSTr) {
          console.log(mallListSTr.d)
          that.mallList = mallListSTr.d
          console.log(mallListSTr)
        })).finally(() => {
          that.tableLoading = false
        })
    },
    /**
     * 关闭对话框
     * @param done
     */
    shopAuth() {
      console.log('准备请求授权页面')
      this.$request({
        url: '/home/authurl',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res)
          window.location.href = res.authUrl
        })
    },
    formatterType(row, col) {
      // 1:个人 2:企业 3:旗舰店 4:专卖店 5:专营店 6:普通店
      if (row.merchant_type === 1) {
        return '个人'
      }
      if (row.merchant_type === 2) {
        return '企业'
      }
      if (row.merchant_type === 3) {
        return '旗舰店'
      }
      if (row.merchant_type === 4) {
        return '专卖店'
      }
      if (row.merchant_type === 5) {
        return '专营店'
      }
      if (row.merchant_type === 6) {
        return '普通店'
      }
    }
  }
}
</script>

<style scoped>

</style>
