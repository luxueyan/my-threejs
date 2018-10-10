<template>
  <div>
    <div class="index">
      {{textComputed}}13131
    </div>
    <button @click="bindTest">点击</button>
  </div>
</template>

<script>
import { State } from 'vuex-class'
import { Vue, Component } from 'vue-property-decorator'

const textBind = {
  name: 'bind'
}

function haha() {
  Logger.info('haha', this.name)
}

@Component
export default class Index extends Vue {
  text = '这是首页'
  number = 1_000_000
  empty = null
  empty2 = 0
  @State
  foo

  get textComputed() {
    let text = do {
      this?.text + ' do ' // eslint-disable-line
    }
    // eslint-disable-next-line
    return (text |> this.processData) + this?.text2 + ' computed' + this?.number + this.empty2 ?? 'empty2'
  }

  get textComputed2() {
    // prettier-ignore
    this.empty = this.empty || 'haha' // 用 ||= 会导致prettier 不工作
    return this.empty
  }

  bindTest() {
    ;textBind::haha()
  }

  processData(v) {
    return v + ' prorcessed '
  }

  mounted() {
    Logger.info(this.text, '首页成功加载')
  }
}
</script>
