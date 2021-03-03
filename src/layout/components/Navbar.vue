<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <p style="vertical-align: center" class="user-avatar">用户：{{ this.username }} （退出）</p>
          <i class="el-icon-caret-bottom user-avatar"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
<!--          <router-link to="/">-->
<!--            <el-dropdown-item>-->
<!--              切到首页-->
<!--            </el-dropdown-item>-->
<!--          </router-link>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">返回登录/授权页面</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// eslint-disable-next-line no-unused-vars
import { getUsername } from '../../utils/auth'
// eslint-disable-next-line no-unused-vars
import { removeToken, setToken } from '../../utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      username: '未知'
    }
  },
  mounted() {
    console.log(getUsername())
    this.username = getUsername()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // async
    async logout() {
      console.log('logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      await this.$store.dispatch('user/clearInfo')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    /*line-height: 50px;*/

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 60px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          /*width: 100px;*/
          /*height: 80px;*/
          vertical-align: middle;
          /*border-radius: 10px;*/
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 50px;
          vertical-align: middle;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
