<template>
  <div>
    <scroll ref="scroll" class="wrapper"
        :data="Data"
        :style="{height: height}"
        :pullDownRefresh="pullDownRefreshObj"
        @pullingDown="onPullingDown">

        <div class="banner_box">
          <a href="javascript:;" class="explain" @click="showRule">
            <span>领券说明</span>
          </a>
          <img src="./img/banner.png" alt="9点抢券啦" class="banner">
          <router-link to="/ownCoupon" class="own_coupon" @click.native="statistics('领券中心-点击我的优惠券', {})">我的优惠券</router-link>
        </div>

        <div class="coupon_list">
          <ul>
            <li :class="noCouponStatus (item.total, item.receiveTotal, item.status, item.longEndTime) ? 'no_coupon' :''" v-for="(item, index) in Data" :key="index">
              <div class="left">
                <h1>{{item.cashBack}}<span>元</span></h1>
                <p>{{item.title}}</p>
              </div>
              <div class="right">
                <h2>{{item.remark}}</h2>
                <p>{{item.effectiveEndTime | transformDate}}到期</p>
              </div>
              <div class="grab_btn">
                <a href="javascript:;" class="get" @click="grabCoupon(item.id, item.longStartTime, item.longEndTime)" v-if="grabBtnStatus(item.status, item.total, item.receiveTotal, item.longStartTime, item.longEndTime)">立即领取</a>
                <a href="javascript:;" class="get" v-if="(new Date()).getTime() < item.longStartTime">未开始</a>
                <a href="javascript:;" class="get hadGet" v-if="item.status === 'USED'">已使用</a>
                <router-link :to="{path: '/recharge', query: { couponId: item.myCouponId }}" class="use"  @click.native="statistics('领券中心-优惠券列表-点击去使用', {id: item.myCouponId})" v-if="item.status === 'RECEIVED'">去使用</router-link>
              </div>
            </li>
          </ul>
        </div>
    </scroll>
    <div v-transfer-dom>
      <x-dialog v-model="ruleDialog"  :dialog-style="{'max-width': '100%', width: '90%', 'background-color': 'transparent'}">
          <div class="rule_box">
            <scroll ref="scrollDialog" class="dialog_wrapper" scrollbar="true">
              <h1 class="rule_title">领券说明</h1>
              <div class="rule_body">
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    1<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">、活动开始时间：2019年3月20日每天</span>9<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">点-10点；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">2、活动截止时间：待定；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    3<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">、参与条件：所有淘单宝已认证用户；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">4</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">、优惠券说明</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">（1</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">）类型：充值满减券，</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    &nbsp; &nbsp;<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;"> （2）</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">满减券</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">面值：200元，150元，80元，</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30元，20元；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    &nbsp; &nbsp;<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;"> （3）</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;">有效期：5天；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    &nbsp;&nbsp;&nbsp;&nbsp;（4）<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">已获得的满减券仅可在淘单宝平台</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;充值使用，</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">不可转赠，转售；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    &nbsp;&nbsp;&nbsp;&nbsp;（5）<span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">具体使用条件详见优惠券</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;"><br/></span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">5、每个用户每个id不同面值的满减券仅可抢一次；</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">6、抢券时间为1小时，优惠券数量有限，未抢到券的用户</span><span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">请不要气馁，每天9点准时来抢！</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">7、已抢到的优惠券有效期为5天，过期之后不可申请补发，请注意尽快使用。</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">8、在活动过程中，如存在违规行为（包括且不限于非真实手机设备，利用系统漏洞，黑客工具，软件作弊等）恶意刷券行为出现，一经发现将取消用券资格，违规行为的具体认定以淘单宝判定为准。</span>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px; text-rendering: optimizelegibility; font-feature-settings: &quot;kern&quot;; font-kerning: normal; color: rgb(51, 51, 51); font-family: ArialMT, Arial; font-size: 13px; white-space: normal; line-height: 1.75em;">
                    <span style="font-family: PingFangSC-Regular, &quot;PingFang SC&quot;;">9、活动最终解释权归淘单宝所有。</span>
                </p>
              </div>
             </scroll>
          </div>
        <x-icon type="ios-close-outline" class="close_btn" @click.native="closeRuleDialog"></x-icon>
      </x-dialog>
      <x-dialog v-model="status" :dialog-style="{'max-width': '100%', width: '90.6%', 'background-color': 'transparent'}">
          <div class="status_box">
            <img src="./img/status.png" class="status_img">
            <div class="status_body">
              <p>活动太火爆了，小淘忙不过来啦~ 请稍后重试！</p>
            </div>
            <button class="confirm_btn" @click="closeDialog">我知道了</button>
          </div>
      </x-dialog>
      <x-dialog v-model="hadGrabCoupon" :hide-on-blur="true" :dialog-style="{'max-width': '100%', width: '80%', 'background-color': 'transparent'}">
          <div class="grab_success_box">
            <div class="grab_success_body">
              <p>恭喜您！</p>
              <p>抢到<span style="color: red">{{ownCouponObj.cashBack}}</span>元优惠券</p>
            </div>
            <button class="confirm_btn" @click="goRecharge">去使用</button>
          </div>
      </x-dialog>
      <confirm v-model="showConfirm"
        confirm-text="去认证"
        cancel-text="取消"
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
        class="indexConfirm">
          <p class="confirmText">通过身份认证才能领取哦！</p>
      </confirm>
      <confirm v-model="showConfirm2"
        confirm-text="确定"
        :show-cancel-button="false"
        @on-confirm="onConfirm2"
        class="indexConfirm">
          <p>{{confirmText2}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XDialog, Confirm, TransferDomDirective as TransferDom } from 'vux'
import couponApi from '@/api/coupon'
import ownApi from '@/api/own'
export default {
  components: {
    XDialog,
    Confirm
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      ruleDialog: false,
      status: false,
      hadGrabCoupon: false,
      hadInit: false,
      pullDownRefresh: true,
      pullDownRefreshTxt: '刷新成功',
      pullDownRefreshThreshold: 65,
      pullDownRefreshStop: 40,
      height: '',
      Data: [],
      showConfirm: false,
      showConfirm2: false,
      ownCouponObj: {},
      confirmText2: ''
    }
  },
  computed: {
    pullDownRefreshObj: function () {
      return this.pullDownRefresh ? {
        threshold: parseInt(this.pullDownRefreshThreshold),
        stop: parseInt(this.pullDownRefreshStop),
        txt: this.pullDownRefreshTxt
      } : false
    }
  },
  methods: {
    showRule () {
      this.ruleDialog = true
      if (!this.hadInit) {
        this.$refs.scrollDialog.initScroll()
        this.hadInit = true
      }
    },
    closeRuleDialog () {
      this.ruleDialog = false
    },
    closeDialog () {
      this.status = false
    },
    goRecharge () {
      this.statistics('领券中心-抢券成功弹窗-点击去使用', {id: this.ownCouponObj.myCouponId})
      this.$router.push({path: '/recharge', query: { couponId: this.ownCouponObj.myCouponId }})
    },
    getList () {
      couponApi.couponList().then((res) => {
        if (res.data.code === 0) {
          this.Data = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getCoupon (couponId) {
      this.statistics('领券中心-立即领取', {id: couponId})
      let obj = {
        id: couponId
      }
      couponApi.grabCoupon(obj).then((res) => {
        if (res.data.code === 0) {
          this.ownCouponObj = res.data.data
          this.hadGrabCoupon = true
        }
        if (res.data.code !== 0 && res.data.code !== 3000) {
          this.$vux.toast.text(res.data.msg, 'top')
        }
        if (res.data.code === 3000) {
          this.status = true
        }
        this.getList() // 刷新列表
      })
    },
    grabCoupon (couponId, startTime, endTime) {
      ownApi.getUserInfo().then((res) => { // 是否认证
        if (res.data.code === 0) {
          if (res.data.data.creditStatus !== 'SUCCESS') {
            if (res.data.data.creditStatus === 'REFUSE') {
              this.confirmText2 = res.data.data.refuseReason
              this.showConfirm2 = true
            } else {
              this.showConfirm = true
            }
          } else {
            let currentTime = (new Date()).getTime()
            if (currentTime < startTime) {
              this.$vux.toast.text('未在活动期间内!', 'top')
            } else if (endTime >= currentTime && currentTime >= startTime) {
              this.getCoupon(couponId)
            } else if (currentTime > endTime) {
              this.$vux.toast.text('未在活动期间内!', 'top')
            }
          }
        }
      })
    },
    noCouponStatus (total, receiveTotal, status, endTime) {
      let currentTime = (new Date()).getTime()
      if (status === 'RECEIVED' || status === 'USED') {
        return false
      } else if (total - receiveTotal === 0 || currentTime > endTime) {
        return true
      }
    },
    grabBtnStatus (status, total, receiveTotal, startTime, endTime) {
      let currentTime = (new Date()).getTime()
      if (status !== 'UNRECEIVED' || currentTime < startTime || currentTime > endTime || total - receiveTotal === 0) {
        return false
      } else {
        return true
      }
    },
    onCancel () {
      this.showConfirm = false
      return false
    },
    onConfirm () {
      this.$router.push('/certification')
    },
    onConfirm2 () {
      this.showConfirm2 = false
    },
    onPullingDown () { // 下拉刷新
      couponApi.couponList().then((res) => {
        if (res.data.code === 0) {
          this.Data = res.data.data
        } else {
          this.$refs.scroll.forceUpdate()
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.getList()
    // document.title = this.$route.meta.title
    setTimeout(() => {
      this.height = `${document.body.clientHeight}px`
    }, 40)
  },
  beforeRouteLeave (to, from, next) {
    this.showConfirm = false
    this.hadGrabCoupon = false
    this.status = false
    next()
  }
}
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'money';   /*字体名称*/
          src: url('../../assets/font/DIN-Medium.eot') format('embedded-opentype'), /* IE6-IE8 */
              url('../../assets/font/DIN-Medium.woff') format('woff'),
              url('../../assets/font/DIN-Medium.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
              url('../../assets/font/DIN-Medium.svg') format('svg'); /* iOS 4.1- */
  font-weight: normal;
  font-style: normal;
}
  .wrapper{
    background: #EFEFF4;
  }
  .banner_box{
    width: 100%;
    position: relative;
    font-size: 0;
    .banner{
      display: inline-block;
      max-width: 100%;
      width: 100%;
      min-height: 188px;
      height: 100%;
    }
    .explain{
      position: absolute;
      top: 0;
      left: 18px;
      display: block;
      width:56px;
      background: url(./img/explain_bg.png) no-repeat center center;
      background-size: cover;
      line-height: 48px;
      text-align: center;
      span{
        display: inline-block;
        width: 100%;
        color: #fff;
        font-size: 12px;
      }
    }
    .own_coupon{
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%,0);
      display: block;
      width: 114px;
      background: linear-gradient(154deg, #DC9C49 0%, #C14C37 100%);
      border-radius: 20px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      line-height: 28px;
    }
  }
  .coupon_list{
    box-sizing: border-box;
    padding:0 4px;
    ul{
      overflow: hidden;
      padding-top: 6px;
      padding-bottom: 30px;
      li{
        list-style: none;
        margin-top: 10px;
        padding: 0 6px;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 108px;
        background: url(./img/coupon_bg.png) no-repeat center center;
        background-size: cover;
        &.no_coupon{
          background: url(./img/no_coupon_bg.png) no-repeat center center;
          background-size: cover;
        }
        .left{
          float: left;
          width: 28.84%;
          height: 108px;
          h1{
            font-family: money;
            font-size: 30px;
            color: #fff;
            text-align: center;
            line-height: 30px;
            margin-top: 20px;
            font-weight: 500;
            span{
              margin-left: 2px;
              font-size: 12px;
            }
          }
          p{
            font-size: 12px;
            color: #fff;
            text-align: center;
            line-height: 17px;
          }
        }
        .right{
          float: left;
          overflow: hidden;
          padding-left: 18px;
          h2{
            margin-top: 26px;
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          p{
            font-size: 12px;
            color: #999;
            line-height: 17px;
            margin-top: 8px;
          }
        }
        .grab_btn{
          a{
            position: absolute;
            display: block;
            width: 64px;/* no */
            height: 22px;/* no */
            text-align: center;
            line-height: 22px;/* no */
            border-radius: 20px;
            top: 50%;
            right: 15px;
            transform: translate(0, -50%);
            &.get{
              font-size: 12px;
              color: #fff;
              background: linear-gradient(154deg, #54A4F7 0%, #2D78FF 100%);
            }
            &.get.hadGet{
              font-size: 12px;
              color: #fff;
              background: #d8d8d8;
            }
            &.use{
              font-size: 12px;
              color: #2D78FF;
              background: #fff;
              border: 1px solid #2D78FF;
            }
          }
        }
      }
    }
  }
  .dialog_wrapper{
    height: 443px;
    background-color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    text-align: left;
    border-radius: 3px;
    .rule_title{
      font-size: 16px;
      line-height: 45px;
      color: #666666;
      text-align: center;
      border-bottom: 1px solid #E4E4E4;
    }
    .rule_body{
      padding: 10px 0;
    }
  }

  .status_box{
      overflow: hidden;
      background: #fff;
      border-radius: 13px;
      padding: 41px 47px 30px;
      .status_img{
        display: inline-block;
        width: 41.62%;
        margin: 0 auto;
      }
      .status_body{
        margin-top: 22px;
        p{
          word-break: break-all;
          word-wrap: break-word;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          line-height: 26px;
        }
      }
      .confirm_btn{
        display: block;
        width: 100%;
        margin: 47px auto 0;
        border: none;
        outline: none;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
        border-radius:4px;
      }
    }
  .grab_success_box{
      overflow: hidden;
      background: #fff;
      border-radius: 13px;
      padding: 30px 47px;
      .grab_success_body{
        margin-top: 22px;
        p{
          word-break: break-all;
          word-wrap: break-word;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          line-height: 26px;
        }
      }
      .confirm_btn{
        display: block;
        width: 100%;
        margin: 30px auto 0;
        border: none;
        outline: none;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
        box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
        border-radius:4px;
      }
    }
  .close_btn{
    margin-top: 20px;
    fill:#fff;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }

  @media (max-width: 320px) {
    .banner_box{
      .explain{
        span{
          display: inline-block;
          width: 63px;
          transform: scale(.9);
          margin-left: -5px
        }
      }
    }
    .coupon_list ul li .grab_btn .get{
      right: 8px;
    }
    .coupon_list ul li .right{
      padding-left: 10px;
    }
    .coupon_list ul li .right p{
      transform: scale(0.8);
      margin-left: -14px;
    }
  }
</style>
