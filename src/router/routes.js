import { flatten } from 'lodash'
let routeArr = []
const routes = require.context('../views', true, /routes\.js$/)

routeArr = [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'login' },
    props: {
      menus: [
        {
          name: '实时告警',
          routeName: 'personRealAlarm',
          icon: 'icon-shishigaojing'
        }
      ]
    },
    component: () => import('@/views/Layout.vue'),
    children: [
      ...flatten(
        routes.keys().map(key => routes(key).default)
        // routes.map(routes => routes.keys().map(key => routes(key).default))
      )
    ]
  }
]
routeArr = routeArr.concat([
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录-视频大数据平台', skipAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
])

export default routeArr
