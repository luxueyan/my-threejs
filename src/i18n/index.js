import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/i18n/messages.js'
import store from '@/vuex/store'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: store.state.lang, // set locale
  messages // set locale messages
})

export default i18n
