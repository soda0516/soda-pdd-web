<template>
  <div
    v-loading="tableLoading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading">
    <el-table
      :data="mallList"
      style="width: 100%"
      :border="true"
      size="small"
    >
      <el-table-column
        label="选择"
        width="50"
        style="text-align: center"
      >
        <template slot-scope="scope">
          <!--            <i class="el-icon-time"></i>-->
          <!--            :disabled="scope.row.accessTokenStatus !== '可操作'"-->
          <el-radio v-model="radio" :label="scope.row.id" @change="getTemplateMallRow(scope.$index,scope.row)">{{ '' }}</el-radio>
        </template>
      </el-table-column>
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
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mallName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="75"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.accessTokenStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品总数"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.totalCount }}</span>
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
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'MallListPart',
  data() {
    return {
      mallList: [],
      tableLoading: false,
      loadingText: '',
      radio: '',
      requestMallInfo: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadingText = '店铺加载中...'
      this.tableLoading = true
      this.$request({
        url: '/user-access-token/list-by-user',
        method: 'get'
      }).then(res => {
        // alert(this.$global.showMallInfo)
        console.log(res)
        var list = window.mallInfo.getMallInfoList(JSON.stringify(res))
        this.mallList = JSON.parse(list)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    /*
    radio选中一个店铺的信息
    */
    getTemplateMallRow(index, value) {
      this.requestMallInfo = value
      this.$emit('childRequestMallInfo', this.requestMallInfo)
    }
  }
}
</script>

<style scoped>

</style>
