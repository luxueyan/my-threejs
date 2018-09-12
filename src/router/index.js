import VueRouter from 'vue-router'
import routes from '@/router/routes.js'
import Vue from 'vue'
import store from '@/vuex/store'
import App from '@/App.vue'
import i18n from '@/i18n'
import { find, intersection, flattenDeep } from 'lodash'
import { MessageBox } from 'element-ui'
const nprogress = require('@/vendor/nprogress').NProgress
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== undefined) {
    document.body.setAttribute('class', to.name)
  }

  if (document.querySelector(nprogress.settings.parent)) nprogress.start()
  const user = store.state.user
  const token = store.state.token
  const authorities = user.authorities
  console.log(user, token, authorities)
  if (process.env.VUE_APP_CUSTOM_API_URL === 'true' && to.query.customBaseURL) {
    store.commit('updateCustomBaseURL', to.query.customBaseURL)
  }

  if (process.env.VUE_APP_STOP_PERMIT === 'true' || to.meta.skipAuth) {
    next()
  } else if (!to.meta.skipAuth && (!token || !user.name)) {
    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
  } else if (!to.meta.skipAuth && !authorities.length) {
    MessageBox({
      message: '您没有任何权限！',
      title: '提示',
      type: 'error'
    })

    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
    // store.dispatch('getPermissions').then((data) => {
    //   if (data.code === 200) {
    //     getPermitRoute(to).then(newRoute => newRoute ? next(newRoute) : next())
    //   }
    // })
  } else {
    getPermitRoute(to).then(newRoute => (newRoute ? next(newRoute) : next()))
  }
})

router.afterEach(to => {
  if (document.querySelector(nprogress.settings.parent)) nprogress.done()

  if (to.meta.title) {
    document.title = to.meta.title
  }
})

/**
 * 获取基于权限的路由地址
 * @param {Route} a route Object
 * @return {Promise} a Promise Object
 */
function getPermitRoute(to) {
  return new Promise(resolve => {
    const authorities = store.getters.authorities
    // const permitApis = map(filter(permissions, pp => pp.check && pp.apiName), p => p.apiName)
    if (to.name === 'login') resolve(null)

    const menuAuthorities = flattenDeep(
      to.matched.map(v => v.meta.authorities || [])
    )
    if (intersection(menuAuthorities, authorities).length) {
      resolve(null)
    } else {
      const mainRoutesParent = find(routes, r => r.name === 'root')
      const mainRoutes = mainRoutesParent.children
      // const flattenRoutes = flattenDeep(map(mainRoutes.children, child => child.children || child))
      const firstRoute = find(
        mainRoutes,
        r => intersection(r.meta.authorities, authorities).length
      )

      if (firstRoute) {
        resolve({
          name: firstRoute.name
        })
      } else {
        MessageBox({
          message: '您没有任何权限！',
          title: '提示',
          type: 'error'
        })

        resolve({
          name: 'login',
          query: {
            redirect: to.name !== 'login' ? to.fullPath : ''
          }
        })
      }
    }
  })
}

router.openInTab = function(routeObj) {
  const resolveRoute = router.resolve(routeObj)
  const href = `//${location.host}/${resolveRoute.href}`
  window.open(href, '_blank')
}

export default {
  run() {
    new Vue({
      render: h => h(App),
      store,
      i18n,
      router
    }).$mount('#app')
  }
}

export { router }
