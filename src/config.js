export default {
  install(Vue) {
    const strategies = Vue.config.optionMergeStrategies

    /**
     * [_dt_hooks _dt_watches custom merge strategy]
     * @param  {?Object} parentVal}
     * @param  {?Object} childVal }
     * @return {?Object}       [_dt_hooks _dt_watches Object]
     */
    strategies._dt_hooks = strategies._dt_watches = function(
      parentVal = {},
      childVal = {}
    ) {
      return { ...parentVal, ...childVal }
    }
  }
}
