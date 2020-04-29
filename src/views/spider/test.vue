<template>
  <div>
    <el-button type="info" @click="submitCheckedGoodsId">提交选中的商品id</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <!--商品id-->
      <el-table-column
        prop="goodsIds"
        label="商品编号"
        width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.goods_id }}</span>
        </template>
      </el-table-column>
      <!--商品图-->
      <el-table-column
        prop="goodsImage"
        label="商品图"
        width="180"
      >
        <template slot-scope="scope">
          <img width="60px" height="60px" :src="scope.row.thumb_url">
        </template>
      </el-table-column>
      <!--商品名称-->
      <el-table-column
        prop="goodsName"
        label="商品名称"
        width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.goods_name }}</span>
        </template>
      </el-table-column>
      <!--more_sku-->
      <el-table-column
        prop="goodsSku"
        label="moreSku"
        width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.is_more_sku }}</span>
        </template>
      </el-table-column>
      <!--商品数量-->
      <el-table-column
        prop="goodsQuantity"
        label="商品数量"
        width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.goods_quantity }}</span>
        </template>
      </el-table-column>
      <!--在卖否-->
      <el-table-column
        prop="goodsOnSale"
        label="在卖否"
        width="180"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.is_onsale }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      tableData: '',
      multipleSelection: [],
      multipleSelectionId: [],
      str: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      this.$request({
        url: 'del/commodity-list',
        method: 'get',
        params: {
          page: 1,
          count: 10
        }
      }).then(res => {
        this.tableData = JSON.parse(res)
        console.log(this.tableData)
        // this.mallList = res
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      let i = 0
      for (i = 0; i < this.multipleSelection.length; i++) {
        this.str = this.str + this.multipleSelection[i].goods_id + ','
      }
    },
    submitCheckedGoodsId() {
      this.loadingText = '删除中...'
      this.tableLoading = true
      this.$request({
        url: 'del/delid',
        method: 'get',
        params: {
          // goodsId: this.multipleSelectionId
          goodsId: this.str
        }
      }).then(res => {
        if (res) {
          this.$message({
            message: '商品已经删除，请勿重复操作！',
            type: 'warning'
          })
        } else {
          this.init()
        }
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
