<template>
  <div class="register">
    <div class="bg_box"></div>
    <div class="register_body">
      <svg-icon icon-class="loginBack" class="close" @click.native="GoBack"></svg-icon>
      <h1 class="title">密码登录</h1>
      <div class="form_box">
        <my-input type="tel"
        v-model="form.mobile"
        @validateFun="mobileValidate"
        @resetValidate="resetMobileValidate"
        class="mobile"
        :errorMessages="mobileErrorMsg"
        @clear="clearMobile"
        :maxlength="11"
        placeholder="请输入手机号"
        :showClose="showClose"
        >
        </my-input>
        <div class="passsword_box">
          <my-input :type="inputType"
          v-model="form.password"
          @validateFun="passValidate"
          @resetValidate="resetPassValidate"
          :errorMessages="passErrorMsg"
          :maxlength="16"
          placeholder="请输入密码"
          >
          </my-input>
          <div class="eye" @click="showPassword">
            <svg-icon :icon-class="iconType"></svg-icon>
          </div>
        </div>
        <button class="submit" @click="submit" :disabled="isdisable">登录</button>
        <div class="panel">
          <router-link to="/findpassword" class="redirect">忘记密码</router-link>
          <router-link to="/login" class="redirect">验证码注册/登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyInput from '@/components/input'
import { XButton, CheckIcon } from 'vux'
import registerAndLoginApi from '@/api/registerAndLogin'
import { mapActions } from 'vuex'
export default {
  components: {
    MyInput,
    XButton,
    CheckIcon
  },
  data () {
    return {
      form: {
        mobile: '',
        password: ''
      },
      mobileErrorMsg: '',
      passErrorMsg: '',
      inputType: 'password',
      iconType: 'closeEye',
      isdisable: true,
      showClose: false
    }
  },
  methods: {
    ...mapActions({
      setJdbAuthToken: 'setJdbAuthToken',
      setLoginStatus: 'setLoginstatus'
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
          this.statistics('输入手机号码-密码登录', {})
          return true
        }
      } else {
        this.mobileErrorMsg = '请输入手机号'
        return false
      }
    },
    passValidate () {
      if (this.form.password.length !== 0) {
        let passRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        if (!passRegex.test(this.form.password)) {
          this.passErrorMsg = '密码格式错误'
          return false
        } else {
          this.passErrorMsg = ''
          this.statistics('输入密码-密码登录', {})
          return true
        }
      } else {
        this.passErrorMsg = '请输入密码'
        return false
      }
    },
    resetPassValidate () {
      this.passErrorMsg = ''
    },
    resetMobileValidate () {
      this.mobileErrorMsg = ''
    },
    showPassword () {
      if (this.iconType === 'closeEye') {
        this.iconType = 'eye'
        this.inputType = 'text'
      } else {
        this.iconType = 'closeEye'
        this.inputType = 'password'
      }
    },
    submit () {
      if (this.mobileValidate() && this.passValidate()) {
        // 提交
        let obj = {
          mobile: this.form.mobile,
          password: this.form.password
        }
        this.isdisable = true
        this.statistics('提交表单-密码登录', {})
        registerAndLoginApi.loginByPass(obj).then((res) => {
          if (res.data.code === 0) {
            this.setJdbAuthToken(res.data.data)
            this.setLoginStatus(true)
            this.isdisable = false
            this.$router.push({path: '/'})
          } else {
            this.isdisable = false
            this.$vux.toast.text(res.data.msg, 'top')
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    GoBack () {
      this.$router.push('/')
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
      }
    },
    'form.password': {
      handler () {
        if (this.form.password.length >= 6) {
          this.isdisable = false
        } else {
          this.isdisable = true
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
        .passsword_box{
          position: relative;
          .eye{
            position: absolute;
            top: 50%;
            right: 0px;
            width: 42px;
            height: 35px;
            line-height: 42px;
            text-align: center;
            transform: translate(0,-50%);
            color:#979797;
          }
        }
        .panel{
          margin-top: 20px;
          overflow: hidden;
          a{
            font-size: 14px;
            line-height: 18px;
            color: #1F7CF0;
            &:first-child{
              float: left;
            }
            &:last-child{
              float: right;
            }
          }
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
          &::after{
            content: none;
            border: none;
          }
          &:disabled{
            background: #A4C6FE;
          }
        }
      }
    }
  }
</style>
