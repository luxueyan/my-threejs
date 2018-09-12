<template>
  <header class="headerBox">
    <div class="photobox">
      <img src="@/assets/images/header.png" />
    </div>
    <!-- <span class="headText1">平安长乐智能人脸监控平台</span> -->
    <span class="headText1">PeaceNet</span>
    <!-- <span class="headText2">PeaceNet</span> -->
  </header>
</template>

<script>
export default {
  name: 'DtHeader'
}
</script>

<style lang="scss" scoped>
.headText1,
.headText2 {
  height: 17px;
  // font-weight: 900;
  font-size: $font-size-l;
  display: block;
}

.headText1 {
  width: 192px;
  color: $primary-font-color;
  margin-left: 75.8px;
  margin-top: 22px;
}

// .headText2 {
//   width: 99px;
//   letter-spacing: 0.4px;
//   color: #00a1ff;
//   margin-left: 310.8px;
//   margin-top: -33px;
// }

.headerBox {
  font-family: "BigruixianGBV1.0";
  position: relative;
  width: 100%;
  height: $header-height;
  text-align: left; // color: #b7e6ff;
  z-index: 1990;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: $border-color;
}

.headerBox .photobox {
  position: absolute;
  width: 434.2px;
  height: 65.3px;
  left: 0;
  top: 0;
  z-index: -1;
}

.headerBox .photobox img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
