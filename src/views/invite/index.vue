<template>
<!-- <scroll ref="scroll" class="wrapper" :style="{height: height}" :bounce="{top: false, bottom: false}"> -->
  <div class="invite_box">
    <a href="javascript:;" class="rule" @click="showRule" ref="rule">活动规则</a>
    <div class="own_performance">
      <h1 class="title">我的业绩</h1>
      <flexbox :gutter="0" class="statistics_box">
        <flexbox-item :span="4">
          <p><spinner type="lines" v-if="integralCount.length !==0 ? false : true"></spinner>{{integralCount}}</p>
          <p>已获积分</p>
        </flexbox-item>
        <flexbox-item :span="4">
          <p><spinner type="lines" v-if="coinCount.length !==0 ? false : true"></spinner>{{coinCount}}</p>
          <p>已获淘单币</p>
        </flexbox-item>
        <flexbox-item :span="4">
          <p><spinner type="lines" v-if="inviteCount.length !==0 ? false : true"></spinner>{{inviteCount}}</p>
          <p>邀请人数</p>
        </flexbox-item>
      </flexbox>
    </div>
    <router-link to="/inviteDetails" class="inviteDetails" @click.native="statistics('邀请有礼-邀请明细', {})">邀请明细 <svg-icon icon-class="right"></svg-icon> </router-link>
    <div class="step_box">
      <div class="step_title">
        <img src="./img/title.png" alt="">
      </div>
      <div class="step_item">
        <flexbox :gutter="0" class="path_box">
          <flexbox-item :span="4">
            <div class="line_box">
              <p>1</p>
              <p>分享活动<br>给好友</p>
            </div>
          </flexbox-item>
          <flexbox-item :span="4">
            <div class="line_box">
              <p>2</p>
              <p>好友接受<br>邀请</p>
            </div>
          </flexbox-item>
          <flexbox-item :span="4">
            <div class="line_box">
              <p>3</p>
              <p>好友注册后<br>7日内完成认证</p>
            </div>
          </flexbox-item>
        </flexbox>
        <div class="des_box">
          <p>1.好友完成认证后可获得150积分</p>
          <p>2.好友完成认证后，3个月内完成首次充值，获得相应档位的奖励，多邀多得，无上限</p>
        </div>
      </div>
    </div>
    <div class="money_coin">
      <flexbox :gutter="0" class="title">
          <flexbox-item :span="6">
            <p>首次充值(元)</p>
          </flexbox-item>
          <flexbox-item :span="6">
            <p>奖励(淘单币)</p>
          </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" class="money_coin_tab" wrap="wrap">
          <flexbox-item :span="6" v-for="(item, index) in tab" :key="index" >
            <p>{{item}}</p>
          </flexbox-item>
      </flexbox>
    </div>
    <div class="banner">
      <img src="./img/banner.png">
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="certification" :dialog-style="{'max-width': '100%', width: '72%', 'background-color': 'transparent'}">
        <div class="rz_box">
          <div class="title">
            <img src="./img/rz_title.png">
          </div>
          <div class="rz_body">
            <img src="./img/close.png" class="close" @click="close">
            <p>您当前未认证，请认证后<br>再来邀请好友吧！</p>
            <button @click="goCertification">立即认证</button>
          </div>
        </div>
      </x-dialog>
      <x-dialog v-model="rule"  :dialog-style="{'max-width': '100%', width: '86.66%', 'background-color': 'transparent'}">
          <div class="rule_box">
            <scroll ref="scrollDialog" class="dialog_wrapper" scrollbar="true">
              <div class="rule_body">
                <h1>活动规则</h1>
                <ul>
                  <li data-num="1">活动开始时间：2018-12-12，结束时间另行通知</li>
                  <li data-num="2">所有淘单宝认证用户可参加；</li>
                  <li data-num="3">活动期间，分享邀请页面，邀请好友注册，好友在注册之日起的 7天内认证成功，您即可获得150积分;</li>
                  <li data-num="4">好友认证成功后，3个月内完成首次充值，您将获得相应档位的奖励，多邀多得，无上限！</li>
                  <li data-num="5">邀请奖励列表</li>
                </ul>
                <div class="money_coin">
                  <flexbox :gutter="0" class="title">
                      <flexbox-item :span="6">
                        <p>首次充值(元)</p>
                      </flexbox-item>
                      <flexbox-item :span="6">
                        <p>奖励(淘单币)</p>
                      </flexbox-item>
                  </flexbox>
                  <flexbox :gutter="0" class="money_coin_tab" wrap="wrap">
                      <flexbox-item :span="6" v-for="(item, index) in tab" :key="index" >
                        <p>{{item}}</p>
                      </flexbox-item>
                  </flexbox>
                </div>
              </div>
             </scroll>
          </div>
        <x-icon type="ios-close-outline" class="close_btn" @click.native="closeRuleDialog"></x-icon>
      </x-dialog>
      <button class="invite_friend" @click="invite">邀请好友</button>
      <div class="mask" v-if="mask" @click="closeMask">
        <img src="./img/lead.png" alt="">
      </div>
    </div>
  </div>
<!-- </scroll> -->
</template>

<script>
import { Flexbox, FlexboxItem, XDialog, Spinner, TransferDomDirective as TransferDom } from 'vux'
import ownApi from '@/api/own'
import wechatApi from '@/api/wechatPay'
import shareApi from '@/api/share'
const wx = require('weixin-js-sdk')
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XDialog,
    Spinner
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      tab: ['500', '20', '1000', '50', '1500', '80', '2000', '100', '3000', '130', '5000', '200'],
      height: '',
      certification: false,
      rule: false,
      hadInit: false,
      mask: false,
      ownData: {},
      integralCount: '',
      coinCount: '',
      inviteCount: ''
    }
  },
  methods: {
    close () {
      this.certification = false
    },
    goCertification () {
      this.$router.push('/certification')
      this.close()
    },
    closeRuleDialog () {
      this.rule = false
      this.statistics('邀请有礼-关闭活动规则', {})
    },
    showRule () {
      this.rule = true
      this.statistics('邀请有礼-查看活动规则', {})
      if (!this.hadInit) {
        this.$refs.scrollDialog.initScroll()
        this.hadInit = true
      }
    },
    closeMask () {
      this.mask = false
      this.statistics('邀请有礼-关闭邀请引导', {})
    },
    invite () {
      ownApi.getUserInfo().then((res) => { // 是否认证
        if (res.data.code === 0) {
          this.ownData = res.data.data
          if (res.data.data.creditStatus !== 'SUCCESS') {
            this.certification = true
          } else {
            this.mask = true
            this.initShare()
            this.statistics('邀请有礼-邀请好友', {})
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    transformMobile (str) {
      if (str) {
        return str.replace(/\*/g, 'x')
      } else {
        return str
      }
    },
    initShare () {
      let obj = {
        url: encodeURIComponent(window.location.href.split('#')[0])
      }
      wechatApi.getShareConfig(obj).then((res) => {
        if (res.data.code === 0) {
          /* let Router = this.$router
          let myAlert = this.$vux */
          let apiConfig = res.data.data
          let _this = this
          let mobile = this.transformMobile(this.ownData.mobile)
          let inviteCode = this.ownData.inviteCode
          // console.log(apiConfig)
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: apiConfig.appId, // 必填，公众号的唯一标识
            timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
            signature: apiConfig.signature, // 必填，签名
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表
          })
          wx.ready(function () {
            // 新api分享给朋友的时候失败，所以用的老的api
            /* wx.updateAppMessageShareData({ // 需在用户可能点击分享按钮前就先调用
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: 'http://tdb.baojeah.com/taodb/share', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://tdb.baojeah.com/taodb/static/img/thumb.jpg', // 分享图标
              success: function (res) {
                // 设置成功
                console.log('res1:ok')
                console.log(res)
              },
              error: function (err) {
                console.log('err1:ok')
                console.log(err)
              }
            })
            wx.updateTimelineShareData({
              title: '快来免费抢5单啦！', // 分享标题
              link: 'http://tdb.baojeah.com/taodb/share', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://tdb.baojeah.com/taodb/static/img/thumb.jpg', // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              success: function (res) {
                // 设置成功
                console.log('res2:ok')
                console.log(res)
              },
              error: function (err) {
                console.log('err2:ok')
                console.log(err)
              }
            }) */
            wx.onMenuShareAppMessage({ // 分享给朋友
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}&inviteCode=${inviteCode}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                if (res.errMsg === 'sendAppMessage:ok') {
                  // console.log('分享朋友成功')
                  _this.mask = false
                }
              }
            })

            wx.onMenuShareTimeline({
              title: '快来免费抢5单啦！', // 分享标题
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}&inviteCode=${inviteCode}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
              }
            })

            wx.onMenuShareQQ({
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}&inviteCode=${inviteCode}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                _this.mask = false
              }
            })

            wx.onMenuShareWeibo({
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}&inviteCode=${inviteCode}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                _this.mask = false
              }
            })

            wx.onMenuShareQZone({
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}&inviteCode=${inviteCode}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                _this.mask = false
              }
            })
          })
          wx.error(function (res) {
            console.log('error:' + res)
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getInviteStatistics () {
      shareApi.inviteStatistics().then((res) => {
        if (res.data.code === 0) {
          this.integralCount = res.data.data.integralCount
          this.coinCount = res.data.data.coinCount
          this.inviteCount = res.data.data.inviteCount
        }
      })
    },
    setPadding () {
      let ua = navigator.userAgent.toLowerCase()
      let isAndroid = ua.indexOf('android') !== -1
      if (isAndroid) {
        this.$refs.rule.style.paddingTop = '4px'
        this.$refs.rule.style.paddingBottom = '1px'
      }
    }
  },
  mounted () {
    this.setPadding()
    this.getInviteStatistics()
    this.height = `${document.body.clientHeight}px`
  }
}
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'number';   /*字体名称*/
          src: url('../../assets/font/DIN-Medium.eot') format('embedded-opentype'), /* IE6-IE8 */
              url('../../assets/font/DIN-Medium.woff') format('woff'),
              url('../../assets/font/DIN-Medium.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
              url('../../assets/font/DIN-Medium.svg') format('svg'); /* iOS 4.1- */
  font-weight: normal;
  font-style: normal;
}
.wrapper{
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch
}
.invite_box{
  width: 100%;
  background: url('./img/invite_bg.png') no-repeat center center;
  background-size: 100% 100%;
  overflow: hidden;
  .rule{
    display: block;
    float: right;
    width: 70px;
    margin-top: 22px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background: #FEF7F1;
    border: none;
    outline: none;
    color: #F89113;
    font-size: 14px;
    padding: 3px 0;
    text-align: center;
  }
  .own_performance{
    width: 84%;
    margin: 0 auto;
    margin-top: 300px;
    height: 155px;
    overflow: hidden;
    .title{
      margin-top: 14px;
      font-size:21px;
      font-weight:600;
      color:rgba(109,104,96,1);
      line-height:30px;
      background:linear-gradient(360deg, rgba(176,138,78,1) 0%, rgba(67,34,6,1) 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      text-align: center;
    }
    .statistics_box{
      margin-top: 19px;
      padding: 0 17px;
      box-sizing: border-box;
      .vux-flexbox-item{
        p{
          text-align: center;
          &:first-child{
            color: #484848;
            font-size: 24px;
            font-weight:bold;
            line-height: 28px;
            font-family: number;
          }
          &:last-child{
            margin-top: 5px;
            font-size: 12px;
            color: #5E3C18;
            font-weight:500;
            line-height: 17px;
          }
        }
        &:last-child{
          p{
            &:first-child{
              color: #FD592F;
            }
          }
        }
      }
    }
  }
  .inviteDetails{
    display: block;
    margin: 16px auto 0;
    width: 36.26%;
    line-height: 28px;
    border: 1px solid #FDF0C3;
    border-radius: 20px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    .svg-icon{
      color: #fff;
      width: 14px;
      height: 14px;
      font-weight: 600;
    }
  }
  .step_box{
    margin: 27px auto 0;
    .step_title{
      width: 54.13%;
      margin: 0 auto;
      img{
        display: inline-block;
        max-width: 100%;
        width: 100%;
        height: auto;
      }
    }
    .step_item{
      margin-top: 22px;
      padding: 0 18px;
      border-radius: 8px;
      .path_box{
        background: #fff;
        border-radius: 8px 8px 0 0;
        padding: 32px 0 17px;
        .vux-flexbox-item{
          position: relative;
          &:not(:last-child){
            .line_box{
            width: 100%;
            &::after{
                position: absolute;
                content: '';
                width: 100%;
                height: 1px;
                background: #886641;
                top: 10px;
                left: 50%;
                z-index: 9;
              }
            }
          }
          .line_box{
            p{
              &:first-child{
                position: relative;
                width: 21px;
                height: 21px;
                background: #886641;
                border-radius: 50%;
                color: #fff;
                text-align: center;
                line-height: 21px;
                margin: 0 auto;
                z-index: 10;
              }
              &:last-child{
                margin-top: 8px;
                text-align: center;
                color: #745534;
                font-size: 14px;
                line-height: 19px;
              }
            }
          }
        }
      }
      .des_box{
        padding: 12px 13px;
        box-sizing: border-box;
        background: #FEF5D6;
        border-radius: 0 0 8px 8px;
        p{
          font-size: 13px;
          color: #957B5B;
          line-height: 19px;
        }
      }
    }
  }
  .money_coin{
    margin-top: 10px;
    padding: 0 18px;
    .title{
      background: #FFF6D7;
      border-radius: 8px 8px 0 0;
      .vux-flexbox-item{
        p{
          line-height: 60px;
          font-size: 16px;
          color: #765737;
          text-align: center;
          font-weight: 600;
        }
      }
    }
    .money_coin_tab{
      padding: 0 7px;
      background: #fff;
      border-radius: 0 0 8px 8px;
      box-sizing: border-box;
      .vux-flexbox-item{
        p{
          text-align: center;
          font-size: 16px;
          line-height: 40px;
          border-bottom: 1px solid #E9DED2;
          font-family: number;
        }
        &:nth-child(2n-1){
          p{
            color: #765737;
          }
        }
        &:nth-child(2n){
          p{
            color: #FD6B46;
          }
        }
      }
    }
  }
  .banner{
    width: 100%;
    padding: 0 8px 131px;
    box-sizing: border-box;
    img{
      display: inline-block;
      max-width: 100%;
      width: 100%;
      height: auto;
    }
  }
}
.rz_box{
  .title{
    position: relative;
    width: 68px;
    height: 68px;
    bottom: -34px;
    background: #EEEEEE;
    border-radius: 50%;
    margin: 0 auto;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      max-width: 100%;
      width: 40px;
      transform: translate(-50%, -50%);
      height: auto;
    }
  }
  .rz_body{
    background: #fff;
    overflow: hidden;
    border-radius: 4px;
    .close{
      float: right;
      width: 10px;
      height: 10px;
      margin: 15px 15px 0 0;
    }
    p{
      margin: 47px 0 38px 0;
      font-size: 14px;
      color: #333333;
      text-align: center;
    }
    button{
      display: block;
      margin: 0 auto 17px;
      width: 79.81%;
      line-height: 44px;
      text-align: center;
      border: none;
      outline: none;
      font-size: 18px;
      color: #fff;
      border-radius: 20px;
      background:linear-gradient(90deg,#5AA4FF 0%,#327DFF 100%);
    }
  }
}
.dialog_wrapper{
  height: 443px;
  background: url('./img/rule_bg.png') no-repeat center center;
  background-size: 100% 100%;
  overflow: hidden;
  }
.rule_box{
  background: #fff;
  .rule_body{
    overflow: hidden;
    padding-bottom: 50px;
    h1{
      padding: 23px 0;
      font-size: 21px;
      color: #333333;
      text-align: center;
      letter-spacing:2px;
      font-weight:500;
    }
    ul{
      padding: 0 43px;
      box-sizing: border-box;
      li{
        position: relative;
        list-style: none;
        text-align: left;
        line-height: 21px;
        &::before{
          position: absolute;
          left: -20px;
          content: attr(data-num);
          width: 17px;
          height: 17px;
          background: #F88A16;
          border-radius: 50%;
          line-height: 17px;
          text-align: center;
          color: #fff;
          box-shadow:1px 1px 1px 0px #FDDEBE;/* no */
        }
      }
    }
    .money_coin{
    margin-top: 10px;
    padding: 0 18px;
    .title{
      background: #FFF6D7;
      border-radius: 8px 8px 0 0;
      .vux-flexbox-item{
        p{
          line-height: 60px;
          font-size: 16px;
          color: #765737;
          text-align: center;
          font-weight: 600;
        }
      }
    }
    .money_coin_tab{
      padding: 0 7px;
      background: #fff;
      border-radius: 0 0 8px 8px;
      box-sizing: border-box;
      .vux-flexbox-item{
        p{
          text-align: center;
          font-size: 16px;
          line-height: 40px;
          border-bottom: 1px solid #E9DED2;
          font-family: number;
        }
        &:nth-child(2n-1){
          p{
            color: #765737;
          }
        }
        &:nth-child(2n){
          p{
            color: #FD6B46;
          }
        }
      }
    }
  }
  }
}
.invite_friend{
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  display: block;
  margin: 50px auto 0;
  width: 92.26%;
  height: 45px;
  border: none;
  outline: none;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  text-shadow:0px 2px 4px rgba(126,51,30,1);
  border-radius: 4px;
  background:linear-gradient(90deg,#F99C42 0%,#F36137 100%);
  box-shadow:0px 6px 0px 0px #DF4F37;/* no */
  z-index: 999;

}
.close_btn{
  margin-top: 20px;
  fill:#fff;
  width: 40px;
  height: 40px;
  font-size: 40px;
}
.mask{
  position: fixed;
  background: rgba(0,0,0,.7);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  text-align: right;
  img{
    margin-right: 20px;
    margin-top: 30px;
  }
}
</style>
