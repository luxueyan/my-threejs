export default {
  install(Vue) {
    function handleRippleBtn(binding, e) {
      let effectEl = e.target.closest(binding.value) // 作用到那个元素上
      effectEl = effectEl || e.target

      const offset = effectEl.getBoundingClientRect()
      const x = e.pageX
      const y = e.pageY
      const oldRipple = effectEl.querySelector('.ripple')

      if (oldRipple) {
        effectEl.removeChild(oldRipple)
      }

      effectEl.style.position = 'relative'
      effectEl.style.overflow = 'hidden'

      const r = Math.max(offset.width, offset.height)

      const ripple = document.createElement('span')
      ripple.classList.add('ripple')
      ripple.style.cssText = `width:${r}px;height:${r}px;left:${x -
        offset.left -
        r / 2}px;top:${y - offset.top - r / 2}px`

      effectEl.appendChild(ripple)
      setTimeout(() => {
        const oldRipple = effectEl.querySelector('.ripple')
        if (oldRipple) effectEl.removeChild(oldRipple)
      }, 500)
    }

    let handler = null

    // 作用点击的涟漪效果
    Vue.directive('ripple-btn', {
      bind(el, binding) {
        handler = handleRippleBtn.bind(el, binding)
        el.addEventListener('mousedown', handler)
      },

      unbind(el) {
        el.removeEventListener('mousedown', handler)
      }
    })
  }
}
