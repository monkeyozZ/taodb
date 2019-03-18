<template>
  <div class="register">
    <svg-icon icon-class="loginBack" class="close" @click.native="GoBack"></svg-icon>
    <h1 class="title">设置密码</h1>
    <h2 class="title2">设置一个好记的密码吧~</h2>
    <div class="form_box">
      <div class="passsword_box">
        <my-input :type="inputType"
        v-model="form.password"
        @validateFun="passValidate"
        @resetValidate="resetPassValidate"
        :errorMessages="passErrorMsg"
        :maxlength="16"
        placeholder="请输入6-16位数字与字母组合">
        </my-input>
        <div class="eye" @click="showPassword">
          <svg-icon :icon-class="iconType"></svg-icon>
        </div>
      </div>
      <h3 class="invite_title">选填</h3>
      <my-input type="text"
      v-model="form.inviteCode"
      @validateFun="inviteValidate"
      @resetValidate="resetInviteValidate"
      :errorMessages="inviteErrorMsg"
      :maxlength="6"
      placeholder="邀请人邀请码">
      </my-input>
    </div>
    <button class="submit" @click="submit" :disabled="isdisable">注册</button>
    <div class="xieyi">
      <check-icon :value.sync="ischeck">阅读并愿意遵守</check-icon>
      <router-link to="/xieyi">《淘单宝用户协议》</router-link>
      <p class="error" v-if="showCheckError">请勾选《淘单宝用户协议》</p>
    </div>
  </div>
</template>

<script>
import MyInput from '@/components/input'
import { XButton, CheckIcon } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import registerAndLoginApi from '@/api/registerAndLogin'
import bus from '@/utils/eventBus'
export default {
  components: {
    MyInput,
    XButton,
    CheckIcon
  },
  data () {
    return {
      form: {
        password: '',
        inviteCode: ''
      },
      passErrorMsg: '',
      inviteErrorMsg: '',
      inputType: 'password',
      iconType: 'closeEye',
      ischeck: true,
      showCheckError: false,
      isdisable: true,
      registerGift: false
    }
  },
  computed: {
    mobile () {
      return this.$route.query.mobile
    },
    verifyCode () {
      return this.$route.query.verifyCode
    },
    inviteBy () {
      return this.$route.query.inviteBy
    },
    ...mapGetters(['user_info'])
  },
  created () {
    this.form.inviteCode = this.$route.query.inviteBy ? this.$route.query.inviteBy : ''
  },
  methods: {
    ...mapActions({
      setJdbAuthToken: 'setJdbAuthToken',
      setLoginstatus: 'setLoginstatus'
    }),
    passValidate () {
      if (this.form.password.length !== 0) {
        let passRegex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        if (!passRegex.test(this.form.password)) {
          this.passErrorMsg = '请输入6-16位数字与字母组合'
          return false
        } else {
          this.passErrorMsg = ''
          this.statistics('设置密码', {from: '注册绑定'})
          return true
        }
      } else {
        this.passErrorMsg = '请设置密码'
        this.isdisable = true
        return false
      }
    },
    inviteValidate () {
      if (this.form.inviteCode.length !== 0) {
        let reg = /^[0-9a-zA-Z]{6}$/
        if (!reg.test(this.form.inviteCode)) {
          this.inviteErrorMsg = '邀请码格式错误'
          return false
        } else {
          this.statistics('输入邀请码', {from: '注册绑定'})
          return true
        }
      } else {
        this.inviteErrorMsg = ''
        return true
      }
    },
    resetPassValidate () {
      this.passErrorMsg = ''
    },
    resetInviteValidate () {
      this.inviteErrorMsg = ''
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
    submit () {
      console.log(this.inviteValidate(), this.passValidate())
      if (this.passValidate() && this.inviteValidate()) {
        if (!this.ischeck) {
          this.showCheckError = true
        } else {
          // 提交
          let obj = {
            mobile: this.mobile,
            password: this.form.password,
            inviteBy: this.form.inviteCode,
            verifyCode: this.verifyCode,
            openId: this.user_info.openId ? this.user_info.openId : ''
          }
          this.isdisable = true
          registerAndLoginApi.register(obj).then((res) => {
            if (res.data.code === 0) {
              this.setJdbAuthToken(res.data.data)
              this.setLoginstatus(true)
              this.$router.push({path: '/'})
              setTimeout(() => {
                bus.$emit('closeLead')
                bus.$emit('showGiftDialog')
              }, 50)
            } else {
              this.inviteErrorMsg = res.data.msg
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
    GoBack () {
      document.activeElement.blur() // 部分手机在键盘未关闭时返回导致页面高度变小
      setTimeout(() => {
        history.back(-1)
      }, 400)
    },
    scrollTOBottom () {
      window.scrollTo(0, 0)
    }
  },
  watch: {
    ischeck: {
      handler () {
        if (this.ischeck) {
          this.showCheckError = false
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
  },
  mounted () {
    this.scrollTOBottom()
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
      .invite_title{
        font-size: 16px;
        color: #565656;
        font-weight: 500;
      }
    }
    .xieyi{
      position: relative;
      margin-top: 20px;
      text-align: center;
      a{
        color: #1F7CF0;
        font-size: 14px;
        line-height: 18px;
      }
      .error{
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #FF5136;
        bottom: 0;
        left: 0;
        transform: translate(0,100%)
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
