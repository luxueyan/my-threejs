const context = require.context('@/components', true, /.*\.vue$/)

export default {
  install(Vue) {
    context.keys().forEach(v => {
      const component = context(v).default
      Vue.component(component.name, component)
    })
  }
}
