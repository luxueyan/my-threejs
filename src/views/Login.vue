<template>
  <div class="loginPage">
    <!-- 登录框 -->
    <div class="loginBox">
      <div class="login">
        <!-- 切换登录按钮 -->
        <div class="btnSwitch">
          <div @click="loginType = 'normal'" class="accountLogin switchBtn" :class="{active: loginType === 'normal'}">
            <p>账户密码登录</p>
          </div>
          <div @click="loginType = 'face'" class="faceLogin switchBtn" :class="{active: loginType === 'face'}">
            <p>刷脸登录</p>
          </div>
        </div>
        <!-- 账户登录框 -->
        <div class="accountMain mainMessage" v-if="loginType === 'normal'">
          <el-form class="loginForm" label-position="top" ref="form" :model="user" :rules="rules" :show-message="false">
            <el-form-item prop="username" label="用户名">
              <p class="loginInput" :class="{focusShow:focusTarget === 'username'}">
                <el-tooltip v-model="tooltip.username.visible" :manual="true" :offset="0" popper-class="errorTip" effect="light" content="" placement="right">
                  <span slot="content">{{tooltip.username.message}}</span>
                  <input @keyup.13="submitForm" type="text" placeholder="请输入用户名" v-model="user.username" @focus="focusTarget = 'username'" />
                </el-tooltip>
              </p>
            </el-form-item>

            <el-form-item prop="password" label="密码">
              <p class="loginInput" :class="{focusShow:focusTarget === 'password'}">
                <el-tooltip v-model="tooltip.password.visible" :manual="true" :offset="0" popper-class="errorTip" effect="light" content="" placement="right">
                  <span slot="content">{{tooltip.password.message}}</span>
                  <input @keyup.13="submitForm" type="password" placeholder="请输入密码" v-model="user.password" @focus="focusTarget = 'password'" />
                </el-tooltip>
              </p>
            </el-form-item>

            <el-form-item prop="code" label="验证码">
              <p class="captcha" :class="{focusShow:focusTarget === 'code'}">
                <el-tooltip v-model="tooltip.code.visible" :manual="true" :offset="0" popper-class="errorTip codeErrorTip" effect="light" content="" placement="right">
                  <span slot="content">{{tooltip.code.message}}</span>
                  <input @keyup.13="submitForm" type="text" v-model="user.code" class="captchaInput" placeholder="请输入验证码" @focus="focusTarget = 'code'" />
                </el-tooltip>
                <img width="97" height="33" @click="refreshCode()" :src="code" />
              </p>
            </el-form-item>

            <el-form-item prop="saveUsername">
              <p class="autoLogin">
                <el-checkbox class="mlr10" v-model="saveUsername">记住用户名</el-checkbox>
                <!--<a class="forgotPassword">忘记密码？</a>-->
              </p>
            </el-form-item>
          </el-form>
          <p>
            <el-button class="loginBtn" :loading="loginLoading" type="primary" @click="submitForm">登录</el-button>
          </p>
        </div>
        <!-- 人脸登录框 -->
        <div class="faceMain mainMessage" v-else-if="loginType === 'face'">
          <div class="faceBox" @mouseover="animationShow" @mouseout="animationHide">
            <em></em>
            <img src="@/assets/images/men.png" />
            <i></i>
            <transition name="bounce">
              <span class="scanLine" v-if="show"></span>
            </transition>
          </div>
          <p class="tip">请把脸移入框内保持不动</p>
        </div>
      </div>
    </div>
    <!-- slogan -->
    <div class="slogan">
      <h2>PeaceNet</h2>
      <h3>视频大数据平台</h3>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import store from '@/vuex/store.js'
import { randomCode } from '@/common/util.js'
import { forEach } from 'lodash'

const codeURL = `${process.env.VUE_APP_API_HOST}/uaa/code/`

export default {
  methods: {
    ...mapActions(['login']),
    refreshCode() {
      const randomStr = (this.user.randomStr = randomCode())
      if (this.customBaseURL) { this.code = `${this.customBaseURL}/uaa/code/${randomStr}` } else this.code = `${codeURL}${randomStr}`
    },

    remberUsername() {
      window.localStorage.username = this.saveUsername
        ? this.user.username
        : ''
    },

    showTooltip() {
      forEach(this.tooltip, (value, key) => {
        this.tooltip[key].visible = !!this.invalidFields[key]
        if (this.tooltip[key].visible) { this.tooltip[key].message = this.invalidFields[key][0].message }
      })
    },

    submitForm() {
      this.$refs.form.validate(async (valid, invalidFields) => {
        this.invalidFields = invalidFields
        this.showTooltip()
        if (valid) {
          const redirect = this.$route.query.redirect
          this.loginLoading = true
          this.login({
            user: this.user,
            config: {
              params: {
                code: this.user.code,
                randomStr: this.user.randomStr
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                  'Basic ' +
                  window.btoa(
                    this.user.client_id + ':' + this.user.client_secret
                  )
              }
            }
          })
            .then(res => {
              this.loginLoading = false
              this.$router.push(
                !redirect
                  ? {
                    name: 'index'
                  }
                  : {
                    path: decodeURIComponent(redirect)
                  }
              )

              this.remberUsername()
            })
            .catch(() => {
              this.refreshCode()
              this.loginLoading = false
            })
        }
      })
    },

    animationShow() {
      this.show = true
    },

    animationHide() {
      this.show = false
    }
  },

  computed: {
    ...mapState(['customBaseURL'])
  },

  watch: {
    loginType() {
      forEach(this.tooltip, (v, k) => {
        this.tooltip[k].visible = false
        this.tooltip[k].message = ''
      })
    }
  },

  data() {
    const randomStr = randomCode()
    let codeBaseURL = store.state.customBaseURL
      ? `${store.state.customBaseURL}/uaa/code/`
      : codeURL
    return {
      invalidFields: {},
      focusTarget: '',
      loginType: 'normal',
      loginLoading: false,
      saveUsername: false,
      code: `${codeBaseURL}${randomStr}`,
      show: false,
      now: new Date(),
      user: {
        client_id: 'webapp',
        client_secret: 'webapp',
        grant_type: 'password',
        username: window.localStorage.username || '',
        password: '',
        code: '',
        randomStr: randomStr
      },
      tooltip: {
        username: {
          visible: false,
          message: ''
        },
        password: {
          visible: false,
          message: ''
        },
        code: {
          visible: false,
          message: ''
        }
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^\w{4}$/,
            message: '请正确填写验证码',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.loginPage {
  .el-form-item {
    margin-bottom: 13px;
  }
  .el-form-item.is-required .el-form-item__label:before {
    content: "";
  }
  .el-checkbox__label {
    color: white;
    font-size: 12px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: white;
  }
  .el-form-item {
    &.is-error {
      .loginInput,
      .captchaInput {
        border-color: red !important;
      }
    }
  }
  .el-form-item__label {
    line-height: 14px;
    height: 14px;
    margin-bottom: 2px;
    color: white;
    font-size: 12px;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
}

body.login {
  background-image: url(~assets/images/login-banner.png),
    url(~assets/images/login-bg.png);
  background-repeat: no-repeat, no-repeat;
  background-size: 1920px auto, cover;
  background-position: center, 0 0;
  height: 100vh;
  .errorTip {
    transform: translateX(100px);
    color: black;
    min-width: 120px;
  }
  .codeErrorTip {
    transform: translateX(131px);
  }
}
</style>

<style lang="scss" scoped>
.loginBox {
  width: 275px;
  height: 670px;
  position: absolute;
  right: 30%;
  top: 50%;
  transform: translateY(-50%);
  height: 461px;
  -webkit-backdrop-filter: blur(7.9px);
  backdrop-filter: blur(7.9px);
  box-shadow: inset 0 1.5px 0 0 #7e7e7e;
  background-color: rgba(41, 41, 41, 0.62);
  border: solid 1px #000000;
}

.slogan {
  font-family: "BigruixianGBV1.0";
  position: absolute;
  right: calc(30% + 285px);
  top: calc(50% - 20px);
  transform: translateY(-50%); // height: 461px;
  h2 {
    font-size: 40px; // font-weight: 900;
    color: #0076ff;
  }
  h3 {
    margin-top: 10px;
    font-size: 48px; // font-weight: 900;
    letter-spacing: 1.3px;
    color: white;
  }
}

.login .btnSwitch {
  height: 34px;
  line-height: 34px;
  display: flex;
  text-align: center;
  color: white;
  font-size: 12px;
}

.switchBtn {
  box-shadow: inset 0 1.5px 0 0 #545454;
  background-color: #191919;
  border: solid 1px #000000;
  flex: 1;
  &.active {
    box-shadow: none;
    background-color: transparent;
    border: 0;
  }
}

.accountMain {
  padding: 15px;
  .loginForm {
    color: white;
    padding: 20px; // width: 239px;
    height: 273px;
    opacity: 1;
    box-shadow: inset 0 1.5px 0 0 #7e7e7e;
    background-color: #4a4a4a;
    border: solid 1px $border-color;
    margin: 15px auto;
  }
}

.accountMain .loginInput {
  box-sizing: content-box;
  width: 100%;
  height: 34px;
  line-height: 34px;
  border: 0;
  box-shadow: inset 0 1px 0 0 #000000;
  border: 1px solid #4a4a4a;
  background-color: white;
  color: black;
  font-size: 12px;
  text-indent: 0.5em;
  &.focusShow {
    border-color: $primary-color;
  }
  .iconfont {
    color: #7aa0c6;
    font-size: 1.3em;
  }
}

.captcha {
  .captchaInput {
    box-sizing: content-box;
    height: 34px;
    line-height: 34px;
    width: 100px;
    background: white;
    box-shadow: inset 0 1px 0 0 #000000;
    font-size: 12px;
    text-indent: 0.5em;
    border: 1px solid #4a4a4a;
  }
  &.focusShow .captchaInput {
    border-color: $primary-color;
  }
}

.captcha .focusShow {
  border-color: $primary-color;
}

.captcha img {
  vertical-align: middle;
  box-shadow: inset 0 1px 0 0 #000000;
}

.captcha a {
  color: $primary-color;
  font-size: 14px;
  text-decoration: underline;
}

.faceMain {
  margin-top: 30px;
  padding: 0 10px;
  .tip {
    color: white;
    font-size: 12px;
  }

  .faceBox {
    position: relative;
    width: 100%;
    height: 273px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
    em:before,
    i:before {
      position: absolute;
      content: "";
      width: 20px;
      height: 20px;
      left: 11px;
      top: 7px;
      border-top: solid 1px #00a7ff;
      border-left: solid 1px #00a7ff;
    }
    em:after,
    i:after {
      position: absolute;
      content: "";
      width: 20px;
      height: 20px;
      right: 9px;
      top: 7px;
      border-top: solid 1px #00a7ff;
      border-right: solid 1px #00a7ff;
    }
    i:before {
      top: inherit;
      bottom: 10px;
      border: none;
      border-bottom: solid 1px #00a7ff;
      border-left: solid 1px #00a7ff;
    }
    i:after {
      top: inherit;
      bottom: 10px;
      border: none;
      border-bottom: solid 1px #00a7ff;
      border-right: solid 1px #00a7ff;
    }
    .scanLine {
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 2%;
      height: 2px;
      background: url(~assets/images/scanning.png) no-repeat;
      background-size: contain;
      animation: bounce-in 5s infinite;
    }
  }
  p {
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #93aae0;
    font-size: 18px;
  }
}

.autoLogin {
  height: 34px;
  line-height: 34px;
  text-align: left;
  color: #cbe3ff;
  font-size: 12px;
  padding-left: 10px;
}

.autoLogin input[type="checkbox"] {
  margin-right: 12px;
}

.autoLogin .forgotPassword {
  float: right;
}

.loginBtn {
  width: 100%;
  height: 34px;
  line-height: 34px;
  padding: 0;
  font-size: 14px;
  letter-spacing: 6px;
}
</style>
