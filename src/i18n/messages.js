import { each, merge } from 'lodash'
import zh from '@/i18n/global/zh.js'
import en from '@/i18n/global/en.js'
import enElement from 'element-ui/lib/locale/lang/en'
import zhElement from 'element-ui/lib/locale/lang/zh-CN'

const messages = { zh: merge(zh, zhElement), en: merge(en, enElement) }

// views
const msgViewContext = require.context('../views', true, /i18n\/.+\.js$/)
each(msgViewContext.keys(), key => {
  const message = msgViewContext(key).default
  if (~key.indexOf('zh.js')) {
    merge(messages.zh, message)
  } else if (~key.indexOf('en.js')) {
    merge(messages.en, message)
  }
})

// components
const msgCmpntsContext = require.context(
  '../components',
  true,
  /i18n\/.+\.js$/
)
each(msgCmpntsContext.keys(), key => {
  const message = msgCmpntsContext(key).default
  if (~key.indexOf('zh.js')) {
    merge(messages.zh, message)
  } else if (~key.indexOf('en.js')) {
    merge(messages.en, message)
  }
})

export default messages
