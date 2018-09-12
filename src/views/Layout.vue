<template>
  <section class="layout">
    <dt-header></dt-header>
    <router-view class="body"></router-view>
    <dt-menu :menus="menus"></dt-menu>
  </section>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
body {
  background: $primary-bg-color;
  font-size: $font-size-s;
  color: $primary-font-color;
}

.body {
  margin-top: $header-height;
  padding: 15px !important;
  .innerBody {
    // height: 100vh;
    overflow: hidden;
  }
}
</style>
