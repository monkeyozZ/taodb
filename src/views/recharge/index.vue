<template>
<scroll ref="scroll" class="wrapper">
  <div class="recharge_box">
    <div class="recharge_title">
      <h1>请选择充值金额</h1>
      <p>
        <router-link to="/financialdetails" @click.native="statistics('查看资金明细', {})">
          <svg-icon icon-class="financial"></svg-icon>
          资金明细
        </router-link>
      </p>
    </div>
     <div class="money_box">
       <flexbox :gutter="0" wrap="wrap">
         <flexbox-item :span="1/3" v-for="(item, index) in list_arr_top" :key="index" @click.native="selecte(item)">
           <div class="money_item" :class="{active: item.active == true}">
             <p>{{item.money}}元</p>
             <p>赠送{{item.integral}}积分</p>
           </div>
         </flexbox-item>
       </flexbox>
     </div>
     <div class="pay_box">
       <p>本次支付：<span>{{money_num}}</span>元</p>
     </div>
     <h1 class="pay_title">选择支付方式</h1>
     <div class="pay_way">
       <label class="check_box" for="wechat">
         <svg-icon icon-class="wechat" class="wechat"></svg-icon>
         <span class="check_title">微信支付</span>
         <input type="radio" id="wechat" value="wxpay" v-model="payWay">
         <i class="weui-icon weui_icon_circle weui-icon-circle"></i>
       </label>
       <label class="check_box" for="alipay" v-if="false">
         <svg-icon icon-class="alipay" class="alipay"></svg-icon>
         <span class="check_title">支付宝支付</span>
          <input type="radio" id="alipay" value="alipay" v-model="payWay">
         <i class="weui-icon weui_icon_circle weui-icon-circle"></i>
       </label>
     </div>
     <div class="tip">
        <h2>温馨提示：</h2>
        <p>1、1元=1淘单币，充值成功将会赠送相应积分</p>
        <p>2、支付成功不可提现、退款</p>
     </div>
     <button class="btn" @click="pay">确认支付</button>
  </div>
  <div v-transfer-dom>
    <confirm v-model="showConfirm"
      confirm-text="去认证"
      cancel-text="取消"
      @on-cancel="onCancel"
      @on-confirm="onConfirm"
      class="indexConfirm">
        <p class="confirmText">您当前未认证，请认证后<br>再来充值吧！</p>
    </confirm>
  </div>
</scroll>
</template>

<script>
import {Flexbox, FlexboxItem, Checklist, Confirm, TransferDomDirective as TransferDom} from 'vux'
import wechatPayApi from '@/api/wechatPay'
import ownApi from '@/api/own'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Checklist,
    Confirm
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      list_arr_top: [
        {money: 500, integral: 100, active: false},
        {money: 1000, integral: 300, active: true},
        {money: 1500, integral: 600, active: false},
        {money: 2000, integral: 1000, active: false},
        {money: 3000, integral: 2000, active: false},
        {money: 5000, integral: 4000, active: false}
      ],
      money_num: 1000,
      payWay: 'wxpay',
      showConfirm: false
    }
  },
  methods: {
    selecte (item) {
      this.list_arr_top.forEach(function (item) {
        item.active = false
      })
      item.active = true
      this.money_num = item.money
    },
    onCancel () {
      this.showConfirm4 = false
      return false
    },
    onConfirm () {
      this.$router.push('/certification')
    },
    pay () {
      ownApi.getUserInfo().then((res) => { // 是否认证
        if (res.data.code === 0) {
          if (res.data.data.creditStatus !== 'SUCCESS') {
            this.showConfirm = true
          } else {
            let obj = {
              url: encodeURIComponent(window.location.href.split('#')[0])
            }
            wechatPayApi.getConfig(obj).then((res) => {
              if (res.data.code === 0) {
                let wx = this.$wechat
                let _this = this
                let Router = this.$router
                let myAlert = this.$vux
                let apiConfig = res.data.data
                // console.log(apiConfig)
                this.$wechat.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: apiConfig.appId, // 必填，公众号的唯一标识
                  timeStamp: apiConfig.timestamp, // 必填，生成签名的时间戳
                  nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
                  signature: apiConfig.signature, // 必填，签名
                  jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
                })
                this.$wechat.ready(function () {
                  let obj = {
                    total_fee: _this.money_num
                  }
                  _this.statistics('确认支付', {payType: '微信', money: _this.money_num})
                  wechatPayApi.builtRecharge(obj).then((res) => {
                    // console.log(wx)
                    let prams = JSON.parse(res.data.data.json)
                    let rechargeId = res.data.data.rechargeId
                    wx.chooseWXPay({
                      timestamp: prams.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                      nonceStr: prams.nonceStr, // 支付签名随机串，不长于 32 位
                      package: prams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                      signType: prams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                      paySign: prams.paySign, // 支付签名
                      success: (res1) => {
                      // 支付成功后的回调函数
                        if (res1.errMsg === 'chooseWXPay:ok') {
                          let obj = {
                            rechargeId: rechargeId
                          }
                          wechatPayApi.rechargeSuccess(obj).then((res2) => {
                            if (res2.data.code === 0) {
                              _this.statistics('充值成功', {payType: '微信', money: _this.money_num})
                              Router.push('/paysuccess')
                            }
                          })
                          // Router.push('/paysuccess')
                        } else {
                          _this.statistics('充值失败', {payType: '微信', money: _this.money_num})
                          Router.push('/payfail')
                        }
                      },
                      cancel: (res3) => {
                        // 支付取消
                        myAlert.toast.text('支付已取消', 'top')
                      }
                    })
                  })
                })
                this.$wechat.error(function (res) {
                  console.log('error:' + res)
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  height: calc(100vh - 46px);
}
.recharge_box{
  background: #fff;
  padding-bottom: 60px;
  min-height: e('calc(100vh - 46px)');
  .recharge_title{
      padding: 16px 15px 0;
      background: #fff;
      overflow: hidden;
      h1{
        float: left;
        color:#333;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      }
      p{
        float: right;
        margin-left: 10px;
        a{
           font-size: 12px;
           color: #333333;
          .svg-icon{
            width: 17px;
            height: 15px;
            color: #FAB741;
          }
        }
      }
    }
    .pay_title{
      padding: 19px 0 15px 15px;
      color:#333333;
      font-size: 14px;
      font-weight: 500;
      background: #F7F7F7;
    }
    .money_box{
      padding: 13px 10px;
      box-sizing: border-box;
      background: #fff;
      text-align: center;
      .vux-flexbox-item{
        margin-bottom: 18px;
        .money_item{
          margin:0 9px;
          border:1px solid rgba(31,124,240,1);
          border-radius: 4px;
          p{
            text-align: center;
            &:first-child{
              font-size: 16px;
              color:#333;
            }
            &:last-child{
              font-size: 12px;
              color:#666;
            }
          }
        }
        .active{
          border:1px solid rgba(31,124,240,0);
          background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
          box-shadow:0px 2px 5px 0px rgba(144,195,255,1);
          p{
            text-align: center;
            &:first-child{
              font-size: 16px;
              color:#fff;
            }
            &:last-child{
              font-size: 12px;
              color:#fff;
            }
          }
        }
      }
    }
    .pay_box{
      background: #fff;
      text-align: left;
      padding: 10px 19px 14px;
      p{
        color: #333;
        font-size: 14px;
        span{
          color: #1F7CF0;
          margin-right: 2px;
        }
      }
    }
    .pay_way{
      .check_box{
        display: block;
        position: relative;
        background: #fff;
        padding: 10px 15px;
        .weui-icon{
        position: absolute;
        right: 10px;
        font-size: 22px;
        top:50%;
        transform: translate(0,-50%);
        }
        .svg-icon.wechat{
          margin-top: -4px;
          vertical-align: middle;
          margin-right: 4px;
          width: 24px;
          height: 24px;
          font-size: 20px;
          color: #26ca29;
        }
        .svg-icon.alipay{
          margin-top: -4px;
          vertical-align: middle;
          margin-right: 4px;
          width: 23px;
          height: 23px;
          font-size: 20px;
          color: #027be3;
        }
        input[type ='radio']{
          display: none
        }
        .weui-icon-circle{
          &::before{
            font-size: 22px;
            color:#E1E1E1;
          }
        }
        input[type ='radio']:checked + .weui-icon-circle{
         &::before{
           content: '\EA06';
           color:#1F7CF0;
          font-size: 22px;
         }
        }
        .check_title{
          display: inline-block;
          color: #333;
        }
      }
    }
    .tip{
      padding: 5px 0px 10px 15px;
      background: #F7F7F7;
      h2{
        color:#999999;
        font-size: 12px;
        font-weight: normal;
      }
      p{
        font-size: 12px;
        color:#999999;
      }
    }
    .btn{
      display: block;
      margin: 36px auto;
      width: 91.5%;
      padding: 8px 0;
      line-height: 24px;
      color: #fff;
      font-size: 16px;
      background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
      box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
      border-radius:4px;
      border: none;
      outline: none;
    }
}
.confirmText{
  text-align: center;
  font-size: 18px;
}

@media (max-width:320px) {
  .recharge_box{
    .money_box{
     padding: 13px 5px;
   }
  }
}
</style>
