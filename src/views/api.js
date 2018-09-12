export default [
  {
    name: 'login', // 登录
    url: '/uaa/oauth/token',
    methods: ['post', 'get']
  },
  {
    name: 'logouting', // 登出
    url: '/uaa/logouting',
    methods: ['get']
  },
  {
    name: 'checkValidateCode', // 校验验证码
    url: '/uaa/checkImageCode',
    methods: ['get']
  },
  {
    name: 'userInfo', // 用户信息
    url: '/uaa/userinfo',
    methods: ['get']
  }
]
