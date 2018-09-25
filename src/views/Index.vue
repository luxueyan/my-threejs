<template>
  <div class="index">
    {{textComputed}}13131
  </div>
</template>

<script>
import { State } from 'vuex-class'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Index extends Vue {
  text = '这是首页'
  @State
  foo

  get textComputed() {
    return this.text + ' computed'
  }

  mounted() {
    console.log(this)
    console.log(this)
    Logger.info(this.text, '首页成功加载')
  }
}
</script>
