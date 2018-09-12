import { globalBus } from '@/common/bus.js'

window.onresize = function(event) {
  globalBus.$emit('window-resize', event)
}

document.addEventListener('visibilitychange', function(event) {
  globalBus.$emit('visibilitychange', event)
})
