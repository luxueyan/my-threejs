import 'animate.css'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import DtConfig from '@/config.js'
import '@/common/pollyfill.js'
import i18n from '@/i18n' // router 依赖 i18n 所以main里面也要注意顺序
import router from '@/router/index.js'
import ElementUI from 'element-ui'
import DtFilter from '@/common/filter.js'
import DtDirective from '@/common/directive.js'
import DtGlobalMixin from '@/common/globalMixin.js'
import BaseComponents from '@/components/index.js'
import '@/common/global.js' // 一些全局事件方法

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(DtConfig)
Vue.use(DtFilter)
Vue.use(DtDirective)
Vue.use(DtGlobalMixin)
Vue.use(BaseComponents)

Vue.config.productionTip = ~process.env.NODE_ENV.indexOf('development')

router.run()
