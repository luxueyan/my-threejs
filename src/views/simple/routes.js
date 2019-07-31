export default [
  {
    path: '/sphere',
    name: 'sphere',
    component: () => import('@/views/simple/Sphere.vue'),
    meta: { title: '网状球体-我的3D世界', skipAuth: true }
  }
]
