<template>
  <section class="subLayout">
    <div class="breadcrumbsContainer" v-if="!crumbsHidden">
      <el-breadcrumb v-if="crumbsVisible" class="breadcrumbs" separator-class="iconfont icon-triangle-right">
        <el-breadcrumb-item v-for="crumb in crumbs" :to="{name: crumb.routeName}" :key="crumb.routeName">{{crumb.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <router-view ref="routerView"></router-view>
  </section>
</template>

<script>
import { globalBus } from '@/common/bus.js'

export default {
  props: {
    icon: String,
    name: String,
    crumbsHidden: Boolean,
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  },

  mounted() {
    globalBus.$on('window-resize', e => {
      const childView = this.$refs.routerView || {}
      childView._initViewSize && childView._initViewSize()
      childView._initCardResize && childView._initCardResize()
    })
  },

  beforeDestroy() {
    globalBus.$off('window-resize')
  },

  methods: {
    _updateCrumbs() {
      if (this.$route.matched.length < 3) {
        this.crumbsVisible = false
      } else {
        this.crumbsVisible = true
        this.crumbs = this.$route.matched.slice(1).map(v => {
          return {
            name: v.meta.title.split('-')[0],
            routeName: v.name
          }
        })
      }
    }
  },

  watch: {
    menus() {
      this.currentMenus = this.menus
    },
    $route: {
      immediate: true,
      handler: '_updateCrumbs'
    }
  },

  data() {
    return {
      crumbsVisible: true,
      crumbs: [],
      currentMenus: this.menus
    }
  }
}
</script>

<style lang="scss">
.breadcrumbsContainer {
  padding-bottom: 15px;
}
.breadcrumbs {
  padding: 0 10px;
  line-height: 34px;
  height: 34px;
  background-color: #161616;
  box-shadow: inset 0 1px 0 0 rgba(60, 60, 60, 0.5);
  // margin-bottom: 15px;
  .el-breadcrumb__inner {
    color: white;
    font-size: 12px;
  }
  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    color: white;
    cursor: pointer;
    &:hover {
      color: $primary-color;
    }
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    color: white;
    font-size: 20px;
  }
}
</style>
