<template>
  <div class="register">
    <div class="bg_box"></div>
    <div class="register_body">
      <svg-icon icon-class="loginBack" class="close" @click.native="GoBack"></svg-icon>
      <h1 class="title">关联手机号</h1>
      <div class="form_box">
        <my-input type="tel" class="mobile" v-model="form.mobile" placeholder="请输入手机号"
        @validateFun="mobileValidate"
        @resetValidate="resetMobileValidate"
        @clear="clearMobile"
        :errorMessages="mobileErrorMsg"
        :maxlength="11"
        :showClose="showClose">
        </my-input>

        <div class="code_box">
          <my-input type="tel" class="code" v-model="form.code" placeholder="请输入验证码"
          @validateFun="codeValidate"
          @resetValidate="resetCodeValidate"
          :errorMessages="codeErrorMsg"
          :maxlength="6">
          </my-input>
          <x-button class="button" :disabled="isdisable" @click.native="showConfirm">{{code_text}}</x-button>
        </div>
      </div>
    </div>
    <div v-transfer-dom class="codeConfirm">
      <confirm
      v-model="show"
      :close-on-confirm="false"
      title="请输入图形验证码"
      @on-confirm="onConfirm">
        <div class="pic_verify_box">
          <input type="tel" maxlength="4" v-model="pic_code" ref="pic_verify" autofocus="autofocus" @focus="clearVerifyErrorMsg" @blur="statistics('输入图片验证码', {from: '注册绑定'})" @click="getFocus">
          <spinner v-if="loading" type="ripple" class="loading"></spinner>
          <img :src="codeUrl" alt="验证码" @click="changeVerifyCode">
        </div>
        <div class="error_msg">
          <p v-if="verifyErrorMsg">{{verifyErrorMsg}}</p>
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
import MyInput from '@/components/input'
import { XButton, Confirm, TransferDomDirective as TransferDom, Spinner } from 'vux'
import registerAndLoginApi from '@/api/registerAndLogin'
import { mapGetters, mapActions } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    MyInput,
    XButton,
    Confirm,
    Spinner
  },
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      },
      codeUrl: null,
      pic_code: '',
      mobileErrorMsg: '',
      codeErrorMsg: '',
      verifyErrorMsg: '',
      code_text: '获取验证码',
      resetbg: false,
      show: false,
      loading: false,
      isdisable: false,
      showClose: false
    }
  },
  computed: {
    ...mapGetters(['user_info'])
  },
  methods: {
    ...mapActions({
      setLoginStatus: 'setLoginstatus',
      setJdbAuthToken: 'setJdbAuthToken'
    }),
    clearMobile () {
      this.form.mobile = ''
      this.mobileErrorMsg = '请输入手机号'
    },
    mobileValidate () {
      if (this.form.mobile.length !== 0) {
        this.mobileErrorMsg = ''
        let reg = /^(13[0-9]|14[1|4|5|6|7|8|9]|15[0-9]|16[5|6]|17[0-9]|18[0-9]|19[1|8|9])\d{8}$/
        if (!reg.test(this.form.mobile)) {
          this.mobileErrorMsg = '手机格式不正确'
          return false
        } else {
          this.mobileErrorMsg = ''
          this.statistics('输入手机号', {from: '注册绑定'})
          return true
        }
      } else {
        this.mobileErrorMsg = '请输入手机号'
        return false
      }
    },
    codeValidate () {
      if (this.form.code.length !== 0) {
        if (this.form.code.length !== 6) {
          this.codeErrorMsg = '请输入六位验证码'
          return false
        } else {
          this.codeErrorMsg = ''
          this.statistics('输入短信验证码', {from: '注册绑定'})
          return true
        }
      } else {
        this.codeErrorMsg = '请输入验证码'
        return false
      }
    },
    resetMobileValidate () {
      this.mobileErrorMsg = ''
    },
    resetCodeValidate () {
      this.codeErrorMsg = ''
    },
    clearVerifyErrorMsg () {
      this.verifyErrorMsg = ''
      this.loading = false
    },
    changeVerifyCode () {
      let obj = {
        mobile: this.form.mobile
      }
      registerAndLoginApi.getVerifyCode(obj).then((res) => {
        if (res.data.code === 0) {
          this.codeUrl = 'data:image/jpeg;base64,' + res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    showConfirm () {
      this.mobileValidate()
      if (this.mobileErrorMsg.length === 0) {
        let obj = {
          mobile: this.form.mobile
        }
        this.statistics('打开图片验证码弹窗', {from: '注册绑定'})
        registerAndLoginApi.getVerifyCode(obj).then((res) => {
          if (res.data.code === 0) {
            this.codeUrl = 'data:image/jpeg;base64,' + res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
        this.clearVerifyErrorMsg()
        this.show = true
        this.pic_code = ''
      }
    },
    onConfirm () {
      if (this.pic_code.length === 0) {
        this.verifyErrorMsg = '请输入图片验证码'
      } else {
        this.verifyErrorMsg = ''
        let obj = {
          mobile: this.form.mobile,
          vCode: this.pic_code
        }
        this.loading = true
        this.statistics('提交图片验证码', {from: '注册绑定'})
        registerAndLoginApi.getMessageCode(obj).then((res) => {
          if (res.data.code === 0) {
            this.loading = false
            this.show = false
            this.$vux.toast.text(res.data.data, 'top')
            this.scrollTOBottom() // iphone键盘弹起导致页面页面高度变小
            let n = 60
            const time = setInterval(() => {
              this.isdisable = true
              this.resetbg = true
              n -= 1
              this.code_text = `${n}s`
              if (n === 0) {
                this.isdisable = false
                this.resetbg = false
                this.code_text = '重新获取'
                clearInterval(time)
              }
            }, 1000)
          } else {
            this.statistics('图片验证码错误', {from: '注册绑定'})
            this.verifyErrorMsg = res.data.msg
            return false
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    GoBack () {
      document.activeElement.blur() // 部分手机在键盘未关闭时返回导致页面高度变小
      setTimeout(() => {
        this.$router.push('/')
      }, 400)
    },
    getFocus () {
      this.$refs.pic_verify.focus()
    },
    scrollTOBottom () {
      window.scrollTo(0, 0)
    }
  },
  watch: {
    'form.mobile': {
      handler () {
        if (this.form.mobile.length > 0) {
          this.showClose = true
        } else {
          this.showClose = false
        }
        if (this.form.mobile.length === 11) {
          this.isdisable = false
        } else {
          this.isdisable = true
        }
      }
    },
    'form.code': {
      handler () {
        if (this.form.code.length === 6) {
          // api验证验证码是否正确
          if (this.mobileValidate() && this.codeValidate()) {
            let obj = {
              mobile: this.form.mobile,
              verifyCode: this.form.code,
              openId: this.user_info.openId ? this.user_info.openId : ''
            }
            registerAndLoginApi.checkMessageCode(obj).then((res) => {
              if (res.data.code === 0) {
                if (res.data.data.type === 'register') {
                  this.$router.push({path: '/setpassword', query: { mobile: this.form.mobile, verifyCode: this.form.code, inviteBy: res.data.data.inviteBy }})
                } else {
                  this.setJdbAuthToken(res.data.data.token)
                  this.setLoginStatus(true)
                  this.$router.push({path: '/'})
                }
              } else {
                this.statistics('短信验证码错误', {from: '注册绑定'})
                this.codeErrorMsg = res.data.msg
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      }
    },
    deep: true
  }
}
</script>

<style lang="less" scoped>
  .register{
    position: relative;
    .bg_box{
      width: 100%;
      height: 180px;
      background: url('../../assets/img/login_bg.png') no-repeat center center;
      background-size: 100% 100%;
    }
    .register_body{
      position: absolute;
      width: 100%;
      top: 20px;
      left: 0;
      padding: 0 20px;
      box-sizing: border-box;
      .close{
        width: 25px;
        height: 25px;
        margin-bottom: 10px;
        color: #fff;
      }
      .title{
        font-size: 27px;
        line-height: 38px;
        font-family:PingFangSC-Medium;
        font-weight: 500;
        color: #fff;
        text-shadow:0px 1px 2px rgba(42,79,106,0.5);
      }
      .form_box{
        margin-top: 27px;
        background: #fff;
        border-radius: 8px;
        padding: 0 33px 40px;
        box-sizing: border-box;
        overflow: hidden;
        box-shadow: 0px 0px 20px 1px #D4E4F6;
        .mobile{
          margin: 40px 0;
        }
        .code_box{
          position: relative;
          .code{
            input{
              padding-right: 30%;
            }
          }
          .button{
            position: absolute;
            width: 45%;
            padding: 0;
            height: 32px;
            font-size: 16px;
            line-height: 23px;
            border: none;
            box-sizing: border-box;
            right: 0;
            top: 50%;
            color: #3C87FF;
            background: #fff;
            transform: translate(0, -50%);
            &::after{
              height: 50%!important;
              border: none;
              border-radius: 0;
              border-left: 1px solid #cccccc;
              border-radius: 0;
              top: 50%;
              transform: translate(0, -50%);
            }
            &:disabled{
              background: #fff;
              color: #cccccc;
              box-shadow:none;
            }
          }
        }
        .redirect{
          float: right;
          margin-right: 5px;
          font-size: 14px;
          color: #1F7CF0;
          font-weight: 400px;
          line-height: 18px;
        }
        .submit{
          display: block;
          margin: 25px auto;
          width: 100%;
          line-height: 47px;
          border: none;
          outline: none;
          border-radius: 25px;
          font-size: 18px;
          color: #fff;
          background: #347FFF;
          &:disabled{
            background: #A4C6FE;
          }
        }
      }
    }
  }
  .codeConfirm{
    .pic_verify_box{
      position: relative;
      height: 40px;
      line-height: 40px;
      border:1px solid rgba(239,237,237,1);
      input{
        display: inline-block;
        float: left;
        font-size: 16px;
        padding-left: 8px;
        box-sizing: border-box;
        width: calc(70% - 28px);
        line-height: 40px;
        border: none;
        outline: none;
      }
      .loading{
        float: left;
        margin-top: 6px;
      }
      img{
        display: inline-block;
        float: right;
        width: 28%;
        height: 32px;
        margin-top: 4px;
      }
    }
    .error_msg{
      text-align: left;
      height: 18px;
      padding-left: 5px;
      font-size: 12px;
      color: #FF5136;
      line-height: 18px;
    }
  }

  @media (max-width:320px) {
    .register{
      .form_box{
          .code_box{
            .button{
              width: 33%;
            }
          }
        }
    }
  }
</style>
