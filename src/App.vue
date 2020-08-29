<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getToken } from './utils/auth'
import FloatIcons from '@/components/s-icons'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    // 'float-icons': FloatIcons
  },
  data() {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      websock: null,
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时,
      currentWanchengdu: 0
    }
  },
  mounted() {
    this.$store.dispatch('task/setStatus', 0)
    // this.initWebSokect()
  },
  destroyed() {
    this.websock.close()
  },
  methods: {
    initWebSokect() {
      // const wsuri = 'ws://127.0.0.1:7008/websocket/' + getToken()
      // http://htpdd.pjzbz.cn/api/
      const wsuri = 'ws://htpdd.pjzbz.cn/api/ws/websocket/' + getToken()
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.getMessage
      this.websock.onopen = this.open
      this.websock.onerror = this.error
      this.websock.onclose = this.close
    },
    open: function() {
      this.start()
      console.log('socket连接成功')
    },
    error: function() {
      console.log('连接错误')
      // 重连
      this.reconnect()
    },
    getMessage: function(msg) {
      if (msg.data !== 'ping') {
        try {
          const msgData = JSON.parse(msg.data)
          let successStr = 'success'
          if (!msgData.success) {
            successStr = 'error'
          }
          this.$notify({
            title: msgData.title,
            message: msgData.message,
            type: successStr,
            position: 'bottom-right',
            duration: 15000
          })
        } catch (err) {
          this.$notify({
            title: '成功',
            message: msg.data,
            type: 'success',
            position: 'bottom-right',
            duration: 15000
          })
        }
      }
      // 收到服务器信息，心跳重置
      this.reset()
      // console.log(msg.data)
    },
    send() {
      console.log('进入了send方法')
      this.websock.send('发送一个到后台史诗')
    },
    close: function() {
      console.log('socket已经关闭')
    },
    reconnect() { // 重新连接
      const that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function() {
        // 新连接
        that.initWebSokect()
        that.lockReconnect = false
      }, 5000)
    },
    reset() { // 重置心跳
      var that = this
      // 清除时间
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      // 重启心跳
      that.start()
    },
    start() { // 开启心跳
      const self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState === 1) { // 如果连接正常
          self.websock.send('ping')
        } else { // 否则重连
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function() {
          // 超时关闭
          self.websock.close()
        }, self.timeout)
      }, self.timeout)
    }
  }
}
</script>
<style lang='scss' scoped>
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
