import { router } from '@/router'
import Api from '@/common/api.js'

let logoutLock = false // 锁定退出逻辑，避免多次登出造成redirect不正确

export default {
  // 获取用户信息
  async getUser({ commit }) {
    const user = await Api.userInfo.get().then(res => res.data)
    commit('updateUser', user)
    return user
  },

  // 登录
  async login({ commit, dispatch }, params = {}) {
    const data = await Api.login
      .post(params.user, params.config)
      .then(res => res.data)

    if (data.access_token) commit('updateToken', data.access_token || '')
    if (data.refresh_token) {
      commit('updateRefreshToken', data.refresh_token || '')
    }
    commit('updateTokenTime')
    commit('updateTokenExpires', data.expires_in)
    await dispatch('getUser')
    return data
  },

  // 登出
  async logout({ commit }, silent) {
    if (logoutLock) return
    // await logouting.get({ token: state.token }, { skipAuth: true })
    window.localStorage.user = '{}'
    window.localStorage.token = ''
    commit('updateUser', {})
    commit('updateToken')
    if (silent) return

    router.push({
      name: 'login',
      query: {
        redirect:
          router.history.current.name !== 'login'
            ? encodeURIComponent(router.history.current.fullPath)
            : ''
      }
    })

    logoutLock = true
    setTimeout(() => {
      logoutLock = false
    }, 5000)
  }
}
