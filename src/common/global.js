import { globalBus } from '@/common/bus.js'
import Logger from 'loglevel'

Logger.setDefaultLevel(process.env.NODE_ENV === 'production' ? 'warn' : 'trace')
window.Logger = Logger

window.onresize = function(event) {
  globalBus.$emit('window-resize', event)
}

document.addEventListener('visibilitychange', function(event) {
  globalBus.$emit('visibilitychange', event)
})
