<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    // 'float-icons': FloatIcons
  },
  data() {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时,
      currentWanchengdu: 0
    }
  },
  mounted() {
    // this.$store.dispatch('task/setStatus', 0)
    // window.showToolTip = true

    // this.initWebSokect()
  },
  methods: {
  }
}
</script>
<style lang='scss'>
  .el-table th.gutter {
    display: table-cell !important;
  }
  .icons-warp {
    border-radius: 5px;
    .float-icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 80px;
      height: 80px;
      img {
        width: 50px;
        height: 50px;
        margin-bottom: 3px;
      }
      span {
        font-size: 9px;
        color: #666666;
      }
    }
  }
</style>
