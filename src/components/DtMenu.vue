<template>
  <footer>
    <div class="bottomBox">
      <ul class="bottomNav">
        <li v-for="menu in currentMenus" :key="menu.value" v-if="menu.visible">
          <template v-if="menu.routeName">
            <router-link v-ripple-btn="'a'" :to="{name: menu.routeName}">
              <i class="iconfont" :class="menu.icon"></i>
              <p>{{menu.name}}</p>
            </router-link>
          </template>
          <template v-else>
            <a v-ripple-btn="'a'" @click="invokeAction(menu.action)">
              <i class="iconfont" :class="menu.icon"></i>
              <p>{{menu.name}}</p>
            </a>
          </template>
          <!-- 二级菜单 -->
          <el-row v-if="menu.children" :gutter="50">
            <el-col :span="24">
              <div :class="{active: $route.name === item.routeName}" v-for="(item,index) in menu.children" :key='index' v-ripple-btn="'.subMenu'" @click="subMenuClick(item)" class="grid-content bg-purple subMenu">{{item.name}}</div>
            </el-col>
          </el-row>
        </li>
        <!-- <li v-show="$_bd_permit('alarm') && !isDemo">
          <a v-ripple-btn="'a'" @click="showUntreatedAlarms">
            <i class="iconfont icon-gaojing"></i>
            <p>告警</p>
          </a>
          <i class="icon-tishi animated" v-if="alarmTips"></i>
        </li> -->
        <li>
          <a v-ripple-btn="'a'">
            <i class="iconfont icon-shezhi"></i>
            <p>{{user && user.name ? user.principal.username : '未登录'}}</p>
          </a>
          <el-row :gutter="50" v-if="user && user.name">
            <el-col :span="24">
              <div v-ripple-btn="'.subMenu'" @click="changePwd" class="grid-content bg-purple subMenu">修改密码</div>
              <div v-ripple-btn="'.subMenu'" @click="logout" class="grid-content bg-purple subMenu">退出登录</div>
            </el-col>
          </el-row>
          <el-row :gutter="50" v-else>
            <el-col :span="24">
              <div v-ripple-btn="'.subMenu'" @click="$router.push({name: 'login'})" class="grid-content bg-purple subMenu">立即登录</div>
            </el-col>
          </el-row>
        </li>
        <li>
          <a v-ripple-btn="'a'" @click="$router.push({name: 'index'})">
            <i class="iconfont icon-home"></i>
            <p>返回</p>
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import routes from '@/router/routes.js'
import { mapState } from 'vuex'

export default {
  name: 'DtMenu',
  hideMenuHandle: null,
  props: {
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  },

  methods: {
    changePwd() {
      this.changePwdDialogVisible = true
      this.$nextTick(() => {
        this.$refs.changePwdForm.resetForm()
      })
    },

    // 退出登录
    logout() {
      this.$store.dispatch('logout')
    },

    // 修改密码成功
    changePwdSuccess(model) {
      this.$message({
        message: '修改密码成功',
        type: 'success'
      })
      this.changePwdDialogVisible = false
    },

    // 点击子菜单的响应
    subMenuClick(item) {
      if (item.routeName) {
        this.$router.push({ name: item.routeName })
      } else if (item.action) {
        this.invokeAction(item.action)
      }
    },

    // 调用方法
    invokeAction(action) {
      if (this[action]) this[action]()
    },

    // 生成菜单
    _genMenus() {
      this.currentMenus = []
      const rootRoute = routes.find(v => v.name === 'root')
      console.log(rootRoute)

      return this.menus.map(v => {
        const secondChildren = rootRoute.children.find(
          c => c.name === v.routeName
        )
        return {
          visible:
            !secondChildren ||
            (this.$_bd_permit(secondChildren.meta.authorities) &&
              secondChildren.meta.type === this.$store.state.systemType),
          ...v,
          activeIncludes:
            secondChildren && secondChildren.children
              ? secondChildren.children.map(vc => vc.name)
              : [v.routeName]
        }
      })
      // .sort((v1, v2) => v1.index - v2.index)
    }

    // _checkUntreatAlarms() {
    //   if (this.$route.name !== 'alarmList' && (!this.preRoute || (this.preRoute.name !== this.$route.name))) {
    //     this.preRoute = this.$route
    //     Api.searchPersonAlarmList.post({
    //       confidence: '70',
    //       isSuspect: this.YES_OR_NO.NO,
    //       sortBy: 'date',
    //       sort: 'DESC',
    //       pageNumber: 1,
    //       startTime: this.floorDate(new Date()),
    //       endTime: this.ceilDate(new Date()),
    //       pageSize: 10
    //     }, {
    //       loadingMaskTarget: '.onlineWrapper'
    //     }).then(res => {
    //       this.alarmTips = !!(res.data.result.records || []).length
    //     })
    //   }
    // }
  },

  computed: {
    ...mapState(['tokenTime', 'tokenExpiresIn'])
  },
  mounted() {
    console.log(this.currentMenus)
  },
  data() {
    return {
      preRoute: null,
      alarmTips: false,
      user: this.$store.state.user,
      systemType: this.$store.state.systemType,
      changePwdDialogVisible: false,
      currentMenus: this._genMenus()
    }
  }
}
</script>

<style lang="scss" scoped>
.bottomBox {
  position: fixed;
  top: 0px; // overflow: hidden;
  text-align: center;
  right: 30px;
  z-index: 1999;
  pointer-events: none;
}

// .navButton {
//   height: 62px;
//   width: 156px;
//   position: fixed;
//   bottom: 0;
//   left: 50%;
//   margin-left: -78px;
//   z-index: 1998;
//   text-align: center;
//   p {
//     height: 28px;
//     line-height: 28px;
//     color: $primary-font-color;
//     font-size: $font-size-s;
//   }
// }

.bottomNav {
  display: inline-block;
  height: $header-height;
  margin: 0 auto;
  pointer-events: fill;
  color: $primary-font-color;
  .el-row {
    display: none;
    margin-top: 3px;
    width: 117.8px; // width: 117.8px;
    // height: 139px;
    background-color: $sub-bg-color;
    border: solid 1px $sub-border-color;
    position: absolute;
    z-index: 2000; // background-color: $primary-font-color;
    color: $sub-font-color;
    font-size: $font-size-xxs;
    .el-col {
      padding: 0 !important;
    }
    .el-col div {
      width: 100%;
      height: 34px;
      text-align: center;
      line-height: 34px;
      &:hover,
      &.active {
        color: $sub-fontactive-color;
        background-color: $sub-liactive-color;
      }
    }
  }
  // .icon-tishi {
  //   position: absolute;
  //   right: 10px;
  //   top: 5px;
  //   width: 10px;
  //   height: 10px;
  //   border-radius: 50%;
  //   background: red;
  //   animation-name: twinkle;
  //   animation-duration: 2s;
  // }
  .iconfont {
    font-size: $font-size-xxxl;
    font-weight: normal;
  }
  li {
    float: left;
    margin: 4px 30px 0;
    width: $header-height;
    height: 68px;
    text-align: center;
    cursor: pointer;
    position: relative;
    .router-link-active {
      color: $primary-font-color;
      margin-top: 0px;
      background-color: $menu-bgactive-color;
    }
    @media screen and (max-width: 1500px) {
      margin: 4px 15px 0;
    }
    &:hover {
      .el-row {
        display: block;
      }
      & > a {
        color: $sub-fontactive-color;
        margin-top: 0px;
        // background-color: #4a90e2;
      }
    }

    & > a {
      display: block;
      width: 60px;
      height: 60px;
      padding-top: 5px;
      padding-bottom: 0;
    }
  }
  p {
    margin-top: 3px;
    height: 25px;
    line-height: 25px; // color: #9fd3ee;
    font-size: $font-size-s;
    color: $primary-font-color;
  }
}
</style>
