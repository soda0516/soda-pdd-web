<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane label="更新日志">
          <el-timeline>
            <el-timeline-item timestamp="2019/11/29" placement="top">
              <el-card>
                <h4>新增商品上传功能</h4>
                <h4>优化现有模块，修复部分BUG</h4>
                <p>辽宁虹天 提交于 2019/11/29 20:45</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2019/11/17" placement="top">
              <el-card>
                <h4>优化现有模块，修复部分BUG</h4>
                <h4>新增多线程、消息队列操作</h4>
                <p>辽宁虹天 提交于 2019/11/17 22:45</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2019/11/15" placement="top">
              <el-card>
                <h4>新增定时上、下架功能（当前每个用户只能设置两个定时任务）</h4>
                <h4>新增循环上、下架功能（新模式、刷流量）</h4>
                <h4>新增商品删除功能</h4>
                <p>辽宁虹天 提交于 2019/11/15 8:45</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2019/11/7" placement="top">
              <el-card>
                <h4>新增商品急速上、下架功能（7W/小时）数据</h4>
                <h4>优化刷新店铺信息功能</h4>
                <p>辽宁虹天 提交于 2019/11/7 16:36</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2019/11/3" placement="top">
              <el-card>
                <h4>更新上下架系统模板，登陆注册模块</h4>
                <h4>增添拼多多店铺授权、获取用户店铺信息功能</h4>
                <p>辽宁虹天 提交于 2019/11/3 20:46</p>
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
    console.log('触发mounted')
  },
  methods: {
    submitAuth() {
      window.location.href = 'https://api.loongwine.cn/cantfind/pinduoduo/api/user-access-token/index'
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
