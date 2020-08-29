<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane label="更新日志">
          <el-timeline>
            <el-timeline-item timestamp="2020/07/23" placement="top">
              <el-card>
                <h3>大橙助手1.0上线正式，目前已有的功能如下：</h3>
                <p>一键快速上、下架</p>
                <p>一键循环上下架（上架之后立刻下架，运行完成后，商品上下架状态不变）</p>
                <p>草稿箱清理</p>
                <p>商品删除</p>
                <p>淘宝商品一键发布到拼多多</p>
                <p>常用的系统设置</p>
                <h4>大橙网络科技 提交于 2020/07/23 8:31</h4>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <!--          <el-tab-pane label="配置管理">配置管理</el-tab-pane>-->
        <!--          <el-tab-pane label="角色管理">角色管理</el-tab-pane>-->
        <!--          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>-->
      </el-tabs>
    </div>
    <!--    <div class="dashboard-text">首页</div>-->
    <!--    <el-button type="danger" @click="submitAuth">添加授权按钮</el-button>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      qrUrl: 'weixin://wxpay/bizpayurl?pr=JKnX67d'
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // console.log('触发mounted')
    // console.log(window.asClient)
    if (window.asClient === true) {
      this.$message.success('是客户端启动的程序')
    }
  },
  methods: {
    submitAuth() {
      window.location.href = 'https://www.dckeji.tech/api/user-access-token/index'
    },
    postJson() {
      var json = { 'id': 0, 'taskCopyId': 0, 'qitianwuliyou': true, 'jiayifashi': true, 'removeRepeat': true, 'forbiddenWordsFilter': true, 'minPrice': '' }
      var mutiJson = {
        'demo1': json,
        'demo2': json
      }
      const data = new FormData()
      data.append('code', json)
      data.append('name', 'yyyy')
      this.$request({
        url: '/pinduoduo-task-copy-taobao-to-pinduoduo-filter/map',
        method: 'post',
        contentType: 'multipart/form-data',
        // contentType: 'application/json',
        data: mutiJson
      }).then((res) => {
        console.log('成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
