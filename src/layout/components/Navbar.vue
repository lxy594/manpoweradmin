<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="app-breadcrumb">
      小劉科技信息股份有限公司
      <span class="breadBtn">创业版</span>
    </div>

    <div class="right-menu">
      <ScreenFull class="right-menu-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imageerror="errorImg" :src="staffPhoto" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/xy599/vuex-rz.git">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- 退出功能 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="setLang('cn')">
            <span style="display: block">中文</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="setLang('en')">
            <span style="display: block">English</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Hamburger from '@/components/Hamburger'
import ScreenFull from '@/components/FullScreen'
export default {
  components: {
    Hamburger,
    ScreenFull
  },
  data() {
    return {
      errorImg: require('@/assets/common/login-bgs.jpg')
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'staffPhoto'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    setLang(langKey) {
      this.$i18n.locale = langKey
    }
  }
}
</script>

<style lang="scss" scoped>
.right-menu-item {
      display: inline;
        position: absolute;
        right: 120px;
        top: 5px;
        color: #fff;
            vertical-align: middle;
}
.navbar {
  // background-image: -webkit-linear-gradient(left,
  //     #F1F2B5,
  //     #f1f2b5,
  //     #135058,
  //     #135058);

  height: 50px;
  overflow: hidden;
  position: relative;
  background-image: -webkit-linear-gradient(
    left,
    #f1f2b5,
    #f1f2b5,
    #135058,
    #135058
  );
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;

    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
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
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;

          font-size: 12px;
        }
      }
    }
  }
}
</style>
