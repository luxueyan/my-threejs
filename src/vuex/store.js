import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/vuex/mutations'
import getters from '@/vuex/getters'
import actions from '@/vuex/actions'

Vue.use(Vuex)

const state = {
  user: JSON.parse(window.localStorage.user || '{}') || {},
  token: window.localStorage.token || '',
  lang: window.localStorage.lang || 'zh', // 语言设置
  permissions: [] // 权限列表
}

const modules = {}

const context = require.context('@/views', true, /store\.js$/)
context.keys().forEach(v => {
  const store = context[v].default
  modules[store.name] = store
})

const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations,
  actions,
  modules
})

export default store
