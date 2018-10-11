import { globalBus } from '@/common/bus.js'
import Logger from 'loglevel'
import * as THREE from 'three'

Logger.setDefaultLevel(process.env.NODE_ENV === 'production' ? 'warn' : 'trace')
window.Logger = Logger
window.THREE = THREE

require('three/examples/js/loaders/GLTFLoader.js')
require('three/examples/js/controls/OrbitControls.js')

window.onresize = function(event) {
  globalBus.$emit('window-resize', event)
}

document.addEventListener('visibilitychange', function(event) {
  globalBus.$emit('visibilitychange', event)
})
