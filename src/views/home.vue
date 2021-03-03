<template xmlns:https="http://www.w3.org/1999/xhtml">
  <div class="bg">
    <div class="app-container">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark" style="margin-top: 40px">
          <h1 style="color: white;text-align: center">大橙助手，您的店铺管理好帮手</h1>
          <h2 style="color: white;text-align: center">我们致力于让商家更便利、更高效地管理自己的店铺，使您在竞争中快人一步！</h2>
          <h4 style="color: white;text-align: center">客服联系方式：434898928（QQ）</h4>
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark" style="text-align: center;margin-top: 100px">
<!--          <el-button type="warning" @click="test" plain >测试发送链接</el-button>-->
          <el-button type="warning" @click="download" plain >点击下载windows客户端1.3</el-button>
          <el-button type="danger" @click="showVideo" plain >点击观看客户端教学视频</el-button>
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="9"><div class="grid-content bg-purple">
          <p></p>
        </div></el-col>
        <el-col :span="9"><div class="grid-content bg-purple-light" style="background-color: white">
          <p></p>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">
          <div class="app-container" style="background-color: white" box-shadow >
            <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
              <el-form-item label="当前用户">
                <label v-text="sizeForm.name"/>
                <!--                <el-input v-model="sizeForm.name"></el-input>-->
              </el-form-item>
              <el-form-item label="用户密码">
                <label v-text="sizeForm.password"/>
<!--                <el-input placeholder="请输入密码" :disabled="true" v-model="sizeForm.password" ></el-input>-->
<!--                <label v-text="sizeForm.name"/>-->
<!--                <el-button type="primary" @click="onSubmit" style="margin-left: 10px">复制密码到剪切板</el-button>-->
              </el-form-item>
              <el-form-item label="">
<!--                <el-button type="primary" @click="copyPassword">复制账号密码到剪切板</el-button>-->
<!--                <el-button type="primary" @click="downloadUserInfoTxt">下载账号密码txt</el-button>-->
              </el-form-item>
            </el-form>
          </div>
        </div></el-col>
      </el-row>
<!--      <el-row>-->
<!--        <el-col :span="24"><div class="grid-content bg-purple-dark" style="text-align: center;margin-top: 50px">-->
<!--          <div class="block">-->
<!--            <span class="title">商家</span>-->
<!--            <el-avatar icon="el-icon-refresh" shape="square" :size="120" :fit="fit"></el-avatar>-->
<!--          </div>-->
<!--        </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <div>
      </div>
    </div>
    <!--      </el-image>-->
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      sizeForm: {
        name: '',
        password: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
      // url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  mounted() {
    if (window.client !== undefined && window.client === 1) {
      this.$router.push('/')
    } else {
      this.sizeForm.name = window.localStorage.getItem('username')
      this.sizeForm.password = window.localStorage.getItem('password')
    }
    // alert('这进入这个页面')
  },
  methods: {
    download() {
      window.open('https://dckeji-tech.oss-cn-beijing.aliyuncs.com/dchelper1.3.zip')
    },
    showVideo() {
      window.open('https://www.bilibili.com/video/BV11T4y1L7ke/')
    },
    // https://www.bilibili.com/video/BV1e5411W7jQ
    copyPassword() {

    }
  }
}
</script>

<style scoped>
  .bg {
    z-index: -1;
    height: 400px;
    width: 100%;
    background-repeat: no-repeat;
    background-image: url('../assets/商标注册公司网站首页.png');
    background-size: cover;
  }
</style>
