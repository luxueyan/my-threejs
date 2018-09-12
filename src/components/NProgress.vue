<script>
import '@/vendor/nprogress.css'
const nprogress = require('@/vendor/nprogress.js').NProgress

export default {
  name: 'NProgress',
  props: {
    parent: String
  },
  created() {
    if (this.parent) {
      nprogress.configure({
        parent: this.parent
      })
    }
  }
}
</script>

<style lang="scss">
.nprogress-custom-parent #nprogress .spinner,
#nprogress .spinner {
  left: 15px;
  top: 5px;
  position: fixed !important;
  z-index: 999999;
}

.nprogress-custom-parent #nprogress .bar {
  position: fixed !important;
  z-index: 999999;
}
</style>
