import axios from 'axios'
import { Loading } from 'element-ui'
import msgBoxErr from '@/common/msgBoxErr.js'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'
import qs from 'qs'
import i18n from '@/i18n'

const loadingInstances = {}

export const http = axios.create({
  baseURL: process.env.VUE_APP_API_HOST,
  timeout: 20000,
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
  transformRequest: [
    (data, headers) => {
      if (data && headers['Content-Type'] && ~headers['Content-Type'].indexOf('x-www-form-urlencoded')) {
        return qs.stringify(data)
      } else if (data && headers['Content-Type'] && ~headers['Content-Type'].indexOf('application/json')) {
        return JSON.stringify(data)
      }
      return data
    }
  ]
})

function closeLoading(url) {
  const loadingInstance = loadingInstances[url]
  if (loadingInstance) {
    loadingInstance.close()
    delete loadingInstances[url]
  }
}

// 后端处理不了登录时候密码错误的提示英文信息
function diposeInvalidGrant(error = '') {
  return ~error.indexOf('invalid_grant') ? '用户名或密码错误' : ~error.indexOf('invalid_token') ? '权限验证失败' : error
}

// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
http.defaults.headers['Access-Control-Allow-Origin'] = '*'
http.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
http.interceptors.request.use(config => {
  if (store.state.token && !config.headers.common['Authorization']) {
    config.headers.common['Authorization'] = 'Bearer ' + store.state.token
  }
  config.url = urlMatcher(config.url, config.pathParams)

  if (config.loadingMaskTarget) {
    const loadingUrl = config.baseURL + config.url
    closeLoading(loadingUrl)

    loadingInstances[loadingUrl] = Loading.service({
      target: config.loadingMaskTarget
    })
  }
  return config
})

http.interceptors.response.use(
  res => {
    closeLoading(res.config.url)
    const data = res.data

    if (!data.code || data.code === 0) {
      return res
    } else if (res.config.noAlert) {
      return Promise.reject(res)
    } else {
      msgBoxErr(data.msg || '请求失败！', data.code)
    }

    return Promise.reject(res)
  },
  err => {
    Logger.error(err, JSON.parse(JSON.stringify(err)))

    err.config && closeLoading(err.config.url)
    if (err.response) {
      const status = err.response.status
      if (err.response.config.noAlert) return Promise.reject(err)
      if (status === 401 || status === 419) {
        if (err.response.config.skipAuth) {
          store.dispatch('logout', true)
          return Promise.reject(err)
        } else {
          store.dispatch('logout')
          msgBoxErr(diposeInvalidGrant(err.response.data.error) || i18n.t('global.400'), 400)
          return Promise.reject(err)
        }
      } else if (status === 400) {
        msgBoxErr(diposeInvalidGrant(err.response.data.error) || i18n.t('global.400'), 400)
        return Promise.reject(err)
      } else if (status === 478) {
        msgBoxErr(diposeInvalidGrant(err.response.data.descript) || i18n.t('global.400'), 400)
        return Promise.reject(err)
      }
      msgBoxErr(i18n.t('global.500'), status)
      return Promise.reject(err)
    }

    msgBoxErr(err.message.indexOf('timeout') > -1 ? i18n.t('global.timeout') : i18n.t('global.500'), 'SERVER')
    return Promise.reject(err)
  }
)

const apiMap = {}
const apiPaths = []
let apis = require.context('../views', true, /api\.js$/)
apis.keys().forEach(api => {
  apis(api).default.forEach(v => {
    if (apiMap[v.name]) throw new Error(`${v.name}的API名称重复`)
    if (apiPaths.find(ap => ap === v.url)) {
      throw new Error(`${v.url}接口路径重复`)
    }
    apiMap[v.name] = {}
    apiPaths.push(v.url)
    if (!Array.isArray(v.methods)) {
      throw new Error(`${v.name}的methods不是数组`)
    }
    v.methods.forEach(m => {
      apiMap[v.name][m] = (data, config) =>
        m === 'get' || m === 'delete' ? http[m](v.url, { params: data, ...config }) : http[m](v.url, data, config)
    })
  })
})
export default apiMap
