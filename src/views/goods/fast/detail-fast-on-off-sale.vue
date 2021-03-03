<template>
  <div
    v-loading="tableLoading"
    class="app-container"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="商品状态">
            <el-select v-model="radioOnOffSale" placeholder="选择状态" style="width: 100px">
              <el-option
                v-for="item in OnOffSaleStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!--            <el-radio-group v-model="radioOnOffSale">-->
            <!--              <el-radio-button label="-1">全部</el-radio-button>-->
            <!--              <el-radio-button label="0">下架</el-radio-button>-->
            <!--              <el-radio-button label="1">上架</el-radio-button>-->
            <!--            </el-radio-group>-->
          </el-form-item>
          <el-form-item label="名称关键字">
            <el-input v-model="goodsItemWords" placeholder="请输入关键字" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="showGoodsItem">显示商品列表</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="绑定店铺:">
            <span>{{ selectedMallName }}</span>
<!--            <el-select v-model="selectedMall" placeholder="选择店铺" disabled>-->
<!--              <el-option-->
<!--                v-for="item in mallList"-->
<!--                :key="item.id"-->
<!--                :label="item.mall_name"-->
<!--                :value="item.id"-->
<!--              />-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item>
            <div/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setupOnSaleTask">选中上架</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="setupOffSaleTask">选中下架</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deleteTask">选中删除</el-button>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-button type="danger" @click="setupOffSaleTask">商品同步</el-button>-->
          <!--          </el-form-item>-->
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24"><div class="grid-content bg-purple">
        <el-table
          :data="goodsItemList"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column
            label="商品图片"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <img width="55px" height="55px" :src="scope.row.thumb_url">
              <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goods_name }}</span>
              <!--                <el-progress type="circle" width="60" :percentage="wanchengdu"></el-progress>-->
            </template>
          </el-table-column>
          <el-table-column
            label="商品ID"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goods_id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="库存"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goods_quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="在售状态"
            width="120"
            align="center"
            prop="is_onsale"
            :formatter="formatterStatus"
          />
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          :total="paginationData.pageTotal"
          :pager-count="9"
          style="margin-top: 15px;text-align: right"
          @current-change="pageChange"
        />
      </div></el-col>
    </el-row>
  </div>
</template>
<script>
import { getToken } from '../../../utils/auth'
export default {
  name: 'DetailFastOnOffSale',
  components: { },
  data() {
    return {
      loadingText: '数据列表加载中',
      tableLoading: false,
      buttonLoading: false,
      pageNumber: 10,
      formInline: {
        user: '',
        region: ''
      },
      mallList: [],
      selectedMall: '',
      selectedMallName: '',
      goodsItemList: [],
      radioOnOffSale: -1,
      goodsItemWords: '',
      paginationData: {
        pageSize: 9,
        currentPage: 1,
        pageTotal: 1
      },
      multipleSelection: [],
      OnOffSaleStatusList: [{
        value: -1,
        label: '全部'
      },
      {
        value: 0,
        label: '下架'
      },
      {
        value: 1,
        label: '上架'
      }
      ]
    }
  },
  mounted() {
    this.init()
    this.initMallInfo()
  },
  methods: {
    init() {
      this.loadingText = '数据列表加载中...'
    },
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
    async addSale(goodsId, isOnsale) {
      console.log('上下架')
      this.tableLoading = true
      var data = { id: this.selectedMall, goods_id: goodsId, is_onsale: isOnsale }
      await this.$request({
        url: '/goods/salestatus?token=' + getToken(),
        method: 'get',
        params: data
        // data: data
      }).then(res => {
        console.log(res)
      }).finally(() => {
        console.log('上下架完成')
        this.tableLoading = false
      })
    },
    async setupOnSaleTask() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        await this.addSale(this.multipleSelection[i].goods_id, 1)
      }
      await this.showGoodsItem()
    },
    async setupOffSaleTask() {
      this.tableLoading = true
      for (let i = 0; i < this.multipleSelection.length; i++) {
        await this.addSale(this.multipleSelection[i].goods_id, 0)
      }
      await this.showGoodsItem()
    },
    async deleteGoodsItem(goodsId) {
      var data = { id: this.selectedMall, goods_ids: goodsId }
      this.tableLoading = true
      await this.$request({
        url: '/goods/delete?token=' + getToken(),
        method: 'get',
        params: data
        // data: data
      }).then(res => {
        console.log(res)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    async deleteTask() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        await this.deleteGoodsItem(this.multipleSelection[i].goods_id)
      }
      await this.showGoodsItem()
    },
    /*
    radio选中一个店铺的信息
     */
    getTemplateMallRow(index, item) {
      this.requestTask = item
      this.requestNumber = item.totalCount
    },
    async showGoodsItem() {
      console.log('刷新商品列表')
      this.tableLoading = true
      var data = { id: this.selectedMall, goods_name: this.goodsItemWords, page: this.paginationData.currentPage, page_size: this.paginationData.pageSize }
      if (this.radioOnOffSale >= 0) {
        data.is_onsale = this.radioOnOffSale
      }
      await this.$request({
        url: '/goods/list?token=' + getToken(),
        method: 'get',
        params: data
        // data: data
      }).then(res => {
        this.paginationData.pageTotal = res.d.goods_list_get_response.total_count
        this.goodsItemList = res.d.goods_list_get_response.goods_list
      }).finally(() => {
        console.log('刷新商品列表完成')
        this.tableLoading = false
      })
    },
    pageChange(val) {
      this.paginationData.currentPage = val
      this.showGoodsItem()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    formatterStatus(row, col) {
      if (row.is_onsale > 0) {
        return '上架'
      } else {
        return '下架'
      }
    }
  }
}
</script>
<style scoped>

</style>
