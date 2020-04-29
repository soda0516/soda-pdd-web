<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-divider content-position="left">
        <el-button type="danger" @click="submitAuth">店铺登陆</el-button>
        <el-button type="warning" @click="updateMallInfo">更新当前用户的店铺信息</el-button>
<!--        <el-button type="danger" @click="testToHello">店铺登陆</el-button>-->
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：如店铺信息显示不全，请点击左侧 -> 更新当前用户店铺信息按钮</span>
      </el-divider>
      <el-table
        :data="mallList"
        style="width: 100%"
        :border="true"
      >
        <el-table-column
          label="首图"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <img width="60px" height="60px" :src="scope.row.logo">
          </template>
        </el-table-column>
        <el-table-column
          label="店铺名称"
          width="240"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.mallName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品总数"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.totalCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺描述"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px" align="left">{{ scope.row.mallDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="当前状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.accessTokenStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商户类型"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.merchantType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上架"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.onSaleCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="下架"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.offSaleCount }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          label="操作"-->
<!--          width="120"-->
<!--          align="center"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <el-button size="small" round type="danger"  @click="payMall(scope.row)">点击支付</el-button>-->
<!--&lt;!&ndash;            <span style="margin-left: 10px">{{ scope.row.offSaleCount }}</span>&ndash;&gt;-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>
    <el-dialog
      title="扫描二维码支付，完成后请更新店铺"
      align="center"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose">
      <vue-qr :text = "qrUrl"></vue-qr>
      <span slot="footer" class="dialog-footer">
<!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
  </span>
    </el-dialog>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
export default {
  name: 'MallOperate',
  components: {
    vueQr
  },
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
      qrUrl: ''
    }
  },
  mounted() {
    console.log('触发了mounted')
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
      this.tableLoading = true
      this.$request({
        url: 'pinduoduo-mall-info/mall-list',
        method: 'get'
      }).then(res => {
        this.mallList = res
      }).finally(() => {
        this.tableLoading = false
      })
    },
    submitAuth() {
      // window.open('http://127.0.0.1:7008/user-access-token/index')
      window.open('http://htpdd.pjzbz.cn/api/user-access-token/index')
      // window.location.href = ('http://127.0.0.1:7008/user-access-token/index')
    },
    updateMallInfo() {
      this.loadingText = '更新店铺信息中...'
      this.tableLoading = true
      this.$request({
        url: 'pinduoduo-mall-info/mall-info',
        method: 'put'
      }).then(res => {
        this.$message({
          message: '更新店铺信息成功！',
          type: 'success'
        })
        this.init()
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /**
     * 点击支付，生成一个图片二维码
     * @param item
     */
    payMall(item) {
      this.tableLoading = true
      this.$request({
        url: '/order-pay/new',
        method: 'post',
        params: {
          mall: item
        }
      }).then((res) => {
        this.qrUrl = res
        this.dialogVisible = true
      }).finally(() => {
        this.tableLoading = false
      })
      // this.dialogVisible = true
    },
    /**
     * 关闭对话框
     * @param done
     */
    handleClose(done) {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
