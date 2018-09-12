import { isString, keys, intersection, merge } from 'lodash'
import * as utils from '@/common/util.js'
import { updateCrumb } from '@/common/bus.js'
import * as CONSTS from '@/constants.js'
import store from '@/vuex/store.js'

export default {
  install(Vue) {
    // 全组件通用
    merge(Vue.prototype, { $_DT_CONSTS: CONSTS }, { $_dt_utils: utils })
    Vue.prototype.$_dt_updateCrumb = updateCrumb
    Vue.prototype.$_dt_parseInt = window.parseInt

    // String<apiName> or Array[]<apiName>
    Vue.prototype.$_dt_permit = function(authorities) {
      if (process.env.VUE_APP_STOP_PERMIT === 'true') return true

      const havedAuthorities = store.getters.authorities
      if (isString(authorities)) {
        authorities = [authorities]
      }
      return intersection(authorities, havedAuthorities).length
    }

    // 全组件实例自有
    Vue.mixin({
      beforeCreate() {
        if (this.$options._dt_hooks) {
          keys(this.$options._dt_hooks).forEach(k => {
            if (!this.$options[k]) this.$options[k] = []
            if (this.$options._dt_hooks[k] === 'beforeCreate') {
              this.$options._dt_hooks[k].call(this)
            }
            this.$options[k] = this.$options[k].concat(
              this.$options._dt_hooks[k]
            )
          })
        }
        if (this.$options._dt_watches) {
          if (!this.$options.watch) this.$options.watch = {}
          keys(this.$options._dt_watches).forEach(k => {
            if (!this.$options.watch[k]) {
              this.$options.watch[k] = []
            } else if (!Array.isArray(this.$options.watch[k])) {
              this.$options.watch[k] = [this.$options.watch[k]]
            }
            this.$options.watch[k] = this.$options.watch[k].concat(
              this.$options._dt_watches[k]
            )
          })
        }
      }
    })
  }
}
