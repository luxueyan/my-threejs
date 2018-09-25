import { flatten } from 'lodash'
const routes = require.context('../views', true, /routes\.js$/)

export default [
  {
    path: '/',
    name: 'root',
    redirect: { name: 'index' },
    component: () => import('@/views/Layout.vue'),
    children: flatten(routes.keys().map(key => routes(key).default))
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    meta: { title: '首页-数据标注平台', skipAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
]
