// import { keyBy } from 'lodash'

export default {
  updateUser(state, user = {}) {
    window.localStorage.user = JSON.stringify(user)
    state.user = user
  },

  updateToken(state, token = '') {
    window.localStorage.token = token
    state.token = token
  }
}
