<template>
  <div class="app-container">
    <div
      v-loading="tableLoading"
      class="app-container"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-divider content-position="left">
<!--        <el-button type="danger" @click="tabToHome">切换到隐藏也看看</el-button>-->
        <el-button type="danger" @click="submitAuth">重新授权更新秘钥</el-button>
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
          width="75"
          align="center"
        >
          <template slot-scope="scope">
            <img width="50px" height="50px" :src="scope.row.logo">
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
          label="在售中"
          width="75"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.onSaleCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="已下架"
          width="75"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.offSaleCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          width="75"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
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
      qrUrl: '',
      updateNotifyInstance: {}
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
      if (this.$global.showMallInfo !== undefined) {
        this.$global.showMallInfo.close()
      }
      if (window.showNeedUpdateMallInfo === undefined) {
        window.showNeedUpdateMallInfo = this.showNeedUpdateMallInfo
      }
      if (window.showNeedErrorMallInfo === undefined) {
        window.showNeedErrorMallInfo = this.showNeedErrorMallInfo
      }
      this.updateMallInfo()
      // this.$request({
      //   url: '/user-access-token/list-by-user',
      //   method: 'get'
      // }).then(res => {
      //   console.log(res)
      //   var list = window.mallInfo.getMallInfoList(JSON.stringify(res))
      //   this.mallList = JSON.parse(list)
      // }).finally(() => {
      //   this.tableLoading = false
      // })
    },
    submitAuth: function() {
      if (this.$store.getters.userInfo) {
        var info = JSON.parse(this.$store.getters.userInfo)
      }
      window.mallInfo.openAuthUrl(info.id)
      // window.location.href = 'http://127.0.0.1:7008/user-access-token/index'
      // window.open('http://htpdd.pjzbz.cn/api/user-access-token/index')
      // window.location.href = ('http://127.0.0.1:7008/user-access-token/index')
    },
    updateMallInfo() {
      this.loadingText = '更新店铺信息中...'
      this.tableLoading = true
      var that = this
      // mallInfo
      this.$axios.all([this.getKey(), this.getList()])
        .then(this.$axios.spread(function(keyStr, mallListSTr) {
          var list = window.mallInfo.getMallInfoAndSave(JSON.stringify(keyStr), JSON.stringify(mallListSTr))
          that.mallList = JSON.parse(list)
          that.$notify.closeAll()
          that.$global.completeOnOffSaleShowNotify.close()
        })).finally(() => {
          that.tableLoading = false
        })
    },
    getList() {
      return this.$request({
        url: '/user-access-token/list-by-user',
        method: 'get'
      })
    },
    getKey() {
      return this.$request({
        url: '/user-access-token/key',
        method: 'post'
      })
    },
    /**
     * 关闭对话框
     * @param done
     */
    handleClose(done) {
      this.dialogVisible = false
    },
    showNeedErrorMallInfo(msg) {
      this.$notify({
        type: 'error',
        title: '系统提示',
        message: msg,
        showClose: true,
        duration: 0,
        position: 'bottom-right'
      })
    },
    showNeedUpdateMallInfo(msg) {
      this.$global.showMallInfo = this.$notify({
        type: 'warning',
        title: '系统警告',
        message: msg,
        showClose: false,
        duration: 0,
        position: 'bottom-right'
      })
    },
    // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
    tabToHome() {
      this.$router.push({ path: '/welcome' })
    }
  }
}
</script>

<style scoped>

</style>
