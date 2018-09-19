import SockJS from 'sockjs-client'
import store from '@/vuex/store.js'
import Stomp from 'stompjs'
import { values } from 'lodash'
// import { scoketBus } from '@/common/bus.js'

const socketUrl = {
  vehicle: process.env.VUE_APP_VIDEO_WEBSOCKET_HOST,
  person: process.env.VUE_APP_WEBSOCKET_HOST,
  vehicleCustom: ':9015/notify',
  personCustom: ':9032/notify'
}

export default class Socket {
  socket = null
  publishers = {}
  outgoing = 20000
  incoming = 20000
  reTryTime = 0 // 重连次数
  reTryMaxTime = 20
  client = null
  clientHandle = null
  defaultOpts = { scoketType: store.state.systemType }
  constructor(opts = {}) {
    this.defaultOpts = { ...this.defaultOpts, ...opts }
    if (!this.defaultOpts.scoketType) throw new Error('未知scoketType')

    this._initSocket()
    this._injectPublisher()
    // this.connect()
  }

  _injectPublisher() {
    const context = require.context('../views', true, /socket\.js$/)
    const publisherPaths = values(this.publishers)
    context.keys().forEach(v => {
      const publisher = context(v).default
      publisher.forEach(vs => {
        if (this.publishers[vs.name]) throw new Error(`${publisher.name}的socket名称重复`)
        else if (publisherPaths.indexOf(vs.url) > -1) throw new Error(`${vs.url}socket路径重复`)
        else this.publishers[vs.name] = vs.url
      })
    })
  }

  _initSocket() {
    let baseUrl = socketUrl[this.defaultOpts.scoketType]
    if (process.env.VUE_APP_CUSTOM_API_URL === 'true' && store.state.customBaseURL) {
      baseUrl = store.state.customBaseURL.replace(/:\d{4}/, socketUrl[this.scoketType + 'Custom'])
    }

    this.socket = new SockJS(`${baseUrl}?access_token=${store.state.token}`, null, {
      transports: ['websocket']
    })

    this.socket.onclose = err => {
      console.log('sockjs closed', err)
      this.reconnect()
    }

    this.socket.onerror = function(msg) {
      console.log('sockjs error', msg)
    }

    this.client = Stomp.over(this.socket)
    this.client.heartbeat.outgoing = this.outgoing // 客户端每20000ms发送一次心跳检测
    this.client.heartbeat.incoming = this.incoming // 0 代表client不接收server端的心跳检测
  }

  subscribe(publisher, successCallback, errorCallback) {
    if (!publisher) throw new Error(`这个发布者不存在：${publisher}`)
    if (!this.client) throw new Error('socket 没有连接成功！')
    return this.client.subscribe(
      this.publishers[publisher],
      frame => {
        console.log(`[${publisher}] subscribe success: ${frame}`)
        successCallback && successCallback(frame)
      },
      frame => {
        console.log(`[${publisher}] subscribe failed: ${frame}`)
        errorCallback && errorCallback(frame)
      }
    )
  }

  async disconnect() {
    await new Promise((resolve, reject) => {
      if (!this.client) resolve(null)
      this.client.disconnect(() => {
        this.socket && this.socket.close()
        this.client = null
        this.socket = null
        console.log('socket client disconnect success')
        resolve(null)
      })
    })
  }

  async reconnect() {
    await this.disconnect()
    this._initSocket()
    await this.connect()
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.client.connect(
        {},
        frame => {
          console.log(' socket client reconnect success: ', frame)
          this.reTryTime = 0
          resolve(this.client)
        },
        frame => {
          console.log('stomp init connect failed: ', frame)
          clearTimeout(this.clientHandle)
          if (this.reTryTime > this.reTryMaxTime) {
            reject(new Error(`${this.reTryMaxTime}次重连尝试失败`))
            return
          }
          this.reTryTime += 1
          this.clientHandle = setTimeout(() => {
            this.reconnect()
          }, 2000)
        }
      )
    })
    return this
  }
}
