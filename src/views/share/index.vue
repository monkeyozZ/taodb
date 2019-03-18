<template>
<div class="container">
  <div class="wrapper" :style="{height: height}">
    <div class="top_box">
      <div class="banner">
        <img src="./img/share_banner.png" alt="新手注册，免费抢5单">
        <h2>每日新增10000+优质客户 优先独享</h2>
      </div>
      <div class="tip_box">
        <p>您的好友{{mobile === 'undefined' ? '' : mobile}}在淘单宝又成一单，赶快加入一起抢，业绩直线飙升！</p>
      </div>
      <div class="register">
        <flexbox :gutter="0">
          <flexbox-item :span="1.9">
            <svg-icon icon-class="Smobile"></svg-icon>
          </flexbox-item>
          <flexbox-item>
            <input type="tel" placeholder="请输入手机号" v-model="form.mobile" maxlength="11" @blur="statistics('输入手机号-分享/邀请', {})">
          </flexbox-item>
        </flexbox>
        <flexbox :gutter="0">
          <flexbox-item :span="1.9">
            <svg-icon icon-class="code"></svg-icon>
          </flexbox-item>
          <flexbox-item>
            <input type="tel" placeholder="请输入验证码" v-model="form.code" maxlength="6" @blur="statistics('输入短信验证码-分享/邀请', {})">
          </flexbox-item>
          <flexbox-item :span="4.16" class="button">
            <button type="button" :disabled="isdisable" :class="{resetbg: resetbg}" @click="showConfirm">{{code_text}}</button>
          </flexbox-item>
        </flexbox>
        <button class="btn" @click="submit" type="button">立即领取</button>
        <p class="xieyi">点击立即领取即代表您已同意<router-link to="xieyi">《注册协议》</router-link></p>
      </div>
    </div>
    <div class="bottom_box">
      <img src="./img/bottom1.png">
      <img src="./img/bottom2.jpg">
    </div>
  </div>
  <div v-transfer-dom class="codeConfirm">
      <confirm
      v-model="show"
      :close-on-confirm="false"
      title="请输入图形验证码"
      @on-confirm="onConfirm">
        <div class="pic_verify_box">
          <input type="tel" maxlength="4" v-model="pic_code" ref="pic_verify" autofocus="autofocus" @focus="clearVerifyErrorMsg" @click="getFocus" @blur="scrollTOBottom">
          <spinner v-if="loading" type="ripple" class="loading"></spinner>
          <img :src="codeUrl" alt="验证码" @click="changeVerifyCode">
        </div>
        <div class="error_msg">
          <p v-if="verifyErrorMsg">{{verifyErrorMsg}}</p>
        </div>
      </confirm>

      <x-dialog v-model="issuccess" :hide-on-blur="true" :dialog-style="{'max-width': '100%', width: '69.6%', 'background-color': 'transparent'}">
        <div class="success_box"></div>
        <x-icon type="ios-close-outline" class="close" @click.native="closesuccess"></x-icon>
      </x-dialog>
    </div>
</div>
</template>

<script>
import { Flexbox, FlexboxItem, Confirm, XDialog, TransferDomDirective as TransferDom, Spinner } from 'vux'
import shareApi from '@/api/share'
export default {
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    Confirm,
    Spinner,
    XDialog
  },
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      },
      codeUrl: null,
      pic_code: '',
      code_text: '获取验证码',
      resetbg: false,
      isdisable: false,
      show: false,
      loading: false,
      verifyErrorMsg: '',
      isSubmit: '',
      issuccess: false,
      height: '',
      scrollTop: ''
    }
  },
  computed: {
    mobile () {
      return this.$route.query.mobile
    },
    inviteCode () {
      return this.$route.query.inviteCode
    }
  },
  methods: {
    getFocus () {
      this.$refs.pic_verify.focus()
    },
    mobileValidate () {
      if (this.form.mobile.length !== 0) {
        let reg = /^(13[0-9]|14[1|4|5|6|7|8|9]|15[0-9]|16[5|6]|17[0-9]|18[0-9]|19[1|8|9])\d{8}$/
        if (!reg.test(this.form.mobile)) {
          this.$vux.toast.text('手机格式不正确', 'middle')
          this.isSubmit = false
        } else {
          this.isSubmit = true
        }
      } else {
        this.$vux.toast.text('请输入手机号', 'middle')
        this.isSubmit = false
      }
    },
    showConfirm () {
      this.mobileValidate()
      if (this.isSubmit) {
        this.height = `${document.body.clientHeight}px` // 弹窗不滚动
        let obj = {
          mobile: this.form.mobile
        }
        shareApi.getVerifyCode(obj).then((res) => {
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
        this.statistics('图片验证码弹框点击确定-分享/邀请', {})
        shareApi.getMessageCode(obj).then((res) => {
          if (res.data.code === 0) {
            this.loading = false
            this.show = false
            this.$vux.toast.text(res.data.data, 'top')
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
            this.verifyErrorMsg = res.data.msg
            this.statistics('图片验证码错误-分享/邀请', {})
            return false
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    submit () {
      this.height = 'unset'
      this.mobileValidate()
      if (this.isSubmit) {
        // api验证验证码是否正确
        let obj = {
          mobile: this.form.mobile,
          verifyCode: this.form.code,
          inviteCode: this.inviteCode
        }
        this.statistics('提交表单-分享/邀请', {})
        shareApi.checkMessageCode(obj).then((res) => {
          if (res.data.code === 0) {
            this.issuccess = true
          } else {
            this.$vux.toast.text(res.data.msg, 'top')
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    clearVerifyErrorMsg () {
      this.verifyErrorMsg = ''
      this.loading = false
    },
    changeVerifyCode () {
      let obj = {
        mobile: this.form.mobile
      }
      shareApi.getVerifyCode(obj).then((res) => {
        if (res.data.code === 0) {
          this.codeUrl = 'data:image/jpeg;base64,' + res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    closesuccess () {
      this.issuccess = false
      this.form.mobile = ''
      this.form.code = ''
      this.code_text = '获取验证码'
    },
    scrollTOBottom () {
      this.statistics('输入图片验证码-分享/邀请', {})
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch
}
.container{
  max-width: 375px;
  margin: 0 auto;
  width: 100%;
  .top_box{
    background: url('./img/bg.png') center center no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .banner{
      text-align: center;
      img{
        margin-top: -30px;
        display: inline-block;
        max-width: 100%;
        width: 97%;
        height: auto
      }
      h2{
        color: #ffeb0b;
        font-size: 20px;
        text-shadow: 0.1em 0.15em 0.05em #363635
      }
    }
    .tip_box{
      width: 92.4%;
      padding: 5px 0;
      margin: 50px auto 0;
      background: rgba(0, 0, 0, .2);
      border-radius: 5px;
      p{
        width: 77.73%;
        margin: 0 auto;
        font-size: 14px;
        color: #fff;
        line-height: 28px;
        font-weight: 600;
      }
    }
    .register{
      padding: 0 14px;
      .vux-flexbox{
        margin-top: 15px;
        background: #FDFDFE;
        border-radius: 5px;
        height: 46px;
        &:first-child{
          margin-top: 11px;
          .vux-flexbox-item{
            &:first-child{
            text-align: center;
            .svg-icon{
              width: 27px;
              height: 27px;
            }
          }
          }
        }
        .vux-flexbox-item{
          input{
            width: 100%;
            border: none;
            font-size: 16px;
            /* line-height: 46px; */
            outline: none;
          }
          &:first-child{
            text-align: center;
            .svg-icon{
              width: 30px;
              height: 30px;
            }
          }
        }
        .button{
          height: 46px;
          button{
            display: block;
            width: 100%;
            height: 100%;
            line-height: 46px;
            background: #FFE538;
            color: #333333;
            border: none;
            outline: none;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          button.resetbg{
            background: #EEEEEE;
            color: #828282;
            box-shadow:none;
          }
        }
      }
      .btn{
        display: block;
        margin: 15px auto 0;
        width: 100%;
        background: #FFE538;
        color: #333333;
        border: none;
        outline: none;
        font-size: 18px;
        border-radius: 5px;
        line-height: 45px;
        box-shadow:1px 1px 5px #220001;
      }
      .xieyi{
        margin: 15px 0 42px 10px;
        font-size: 12px;
        color: #fdfdfd;
        a{
          color: #FFE538;
        }
      }
    }
  }
  .bottom_box{
    font-size: 0;
    img{
      display: inline-block;
      max-width: 100%;
      width: 100%;
      height: auto;
    }
  }
}
.codeConfirm{
    .pic_verify_box{
      position: relative;
      height: 40px;
      /* line-height: 40px; */
      border:1px solid rgba(239,237,237,1);
      input{
        display: inline-block;
        float: left;
        font-size: 16px;
        padding-left: 8px;
        box-sizing: border-box;
        width: calc(70% - 28px);
        /* line-height: 40px; */
        margin-top: 11px;
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
  .success_box{
    height: 312px;
    background: url('./img/success.png') center center no-repeat;
    background-size: 100% 100%;
  }
  .close{
    margin-top: 30px;
    fill:#fff;
    width: 40px;
    height: 40px;
    font-size: 40px;
    cursor: pointer;
  }

@media (max-width: 320px) {
  .container .top_box .register .xieyi{
     margin: 15px 0 40px 10px;
  }
}
</style>
