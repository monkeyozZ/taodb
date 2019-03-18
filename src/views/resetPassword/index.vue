<template>
  <div class="register">
    <svg-icon icon-class="loginBack" class="close" @click.native="GoBack"></svg-icon>
    <h1 class="title">重置密码</h1>
    <h2 class="title2">设置一个好记的密码吧~</h2>
    <div class="form_box">
      <div class="passsword_box">
        <my-input :type="inputType"
        v-model="form.password"
        @validateFun="passValidate"
        @resetValidate="resetPassValidate"
        :errorMessages="passErrorMsg"
        :maxlength="16"
        placeholder="请设置密码">
        </my-input>
        <div class="eye" @click="showPassword">
          <svg-icon :icon-class="iconType"></svg-icon>
        </div>
      </div>

      <div class="passsword_box">
        <my-input :type="inputType2"
        v-model="form.password2"
        @validateFun="passValidate2"
        @resetValidate="resetPassValidate2"
        :errorMessages="passErrorMsg2"
        :maxlength="16"
        placeholder="请确认密码">
        </my-input>
        <div class="eye" @click="showPassword2">
          <svg-icon :icon-class="iconType2"></svg-icon>
        </div>
      </div>
    </div>
    <button class="submit" @click="submit" :disabled="isdisable">重置密码</button>
  </div>
</template>

<script>
import MyInput from '@/components/input'
import { XButton, Confirm, TransferDomDirective as TransferDom, Spinner } from 'vux'
import ownApi from '@/api/own'
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
        password: '',
        password2: ''
      },
      passErrorMsg: '',
      passErrorMsg2: '',
      inputType: 'password',
      iconType: 'closeEye',
      inputType2: 'password',
      iconType2: 'closeEye',
      isdisable: true
    }
  },
  computed: {
    mobile () {
      return this.$route.query.mobile
    }
  },
  methods: {
    passValidate () {
      if (this.form.password.length !== 0) {
        let passRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        if (!passRegex.test(this.form.password)) {
          this.passErrorMsg = '请输入6-16位数字与字母组合'
          return false
        } else {
          this.passErrorMsg = ''
          this.statistics('输入密码1-重置密码', {})
          return true
        }
      } else {
        this.passErrorMsg = '请输入密码'
        return false
      }
    },
    passValidate2 () {
      if (this.form.password2.length !== 0) {
        let passRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        if (!passRegex.test(this.form.password2)) {
          this.passErrorMsg2 = '请输入6-16位数字与字母组合'
          return false
        } else {
          if (this.form.password !== this.form.password2) {
            this.passErrorMsg2 = '前后密码输入不一致'
            return false
          } else {
            this.passErrorMsg2 = ''
            this.statistics('输入密码2-重置密码', {})
            return true
          }
        }
      } else {
        this.passErrorMsg2 = '请再次输入密码'
        return false
      }
    },
    resetPassValidate () {
      this.passErrorMsg = ''
    },
    resetPassValidate2 () {
      this.passErrorMsg2 = ''
    },
    showPassword () {
      this.passErrorMsg = ''
      if (this.iconType === 'closeEye') {
        this.iconType = 'eye'
        this.inputType = 'text'
      } else {
        this.iconType = 'closeEye'
        this.inputType = 'password'
      }
    },
    showPassword2 () {
      this.passErrorMsg = ''
      if (this.iconType2 === 'closeEye') {
        this.iconType2 = 'eye'
        this.inputType2 = 'text'
      } else {
        this.iconType2 = 'closeEye'
        this.inputType2 = 'password'
      }
    },
    GoBack () {
      document.activeElement.blur() // 部分手机在键盘未关闭时返回导致页面高度变小
      setTimeout(() => {
        history.back(-1)
      }, 400)
    },
    submit () {
      if (this.passValidate() && this.passValidate2()) {
        // 提交
        let obj = {
          mobile: this.mobile,
          password: this.form.password
        }
        this.isdisable = true
        this.statistics('提交表单-重置密码', {})
        ownApi.resetPassword(obj).then((res) => {
          if (res.data.code === 0) {
            this.$vux.toast.text(res.data.data, 'top')
            this.$router.push('/passlogin')
          } else {
            // Todo
            this.isdisable = false
          }
        }).catch((err) => {
          if (err) {
            this.isdisable = false
          }
        })
      }
    }
  },
  watch: {
    'form.password2': {
      handler () {
        if (this.form.password2.length >= 6) {
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
    padding: 0 20px;
    .close{
      margin-top: 30px;
      width: 25px;
      height: 25px;
      color: #444444;
    }
    .title{
      margin: 21px 0 8px 0;
      font-size: 27px;
      color: #2F2926;
      line-height: 38px;
      font-family:PingFangTC-Medium;
      font-weight: 500;
    }
    .title2{
      font-size: 17px;
      color: #999999;
      line-height: 24px;
      font-family:PingFangTC-Medium;
      font-weight: 500;
    }
    .form_box{
      margin-top: 10px;
      .passsword_box{
        position: relative;
        margin: 25px 0 30px 0;
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
</style>
