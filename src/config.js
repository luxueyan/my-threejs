export default {
  install(Vue) {
    const strategies = Vue.config.optionMergeStrategies

    /**
     * [_bd_hooks _bd_watches custom merge strategy]
     * @param  {?Object} parentVal}
     * @param  {?Object} childVal }
     * @return {?Object}       [_bd_hooks _bd_watches Object]
     */
    strategies._bd_hooks = strategies._bd_watches = function(
      parentVal = {},
      childVal = {}
    ) {
      return { ...parentVal, ...childVal }
    }
  }
}
