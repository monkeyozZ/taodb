<template>
<div>
<scroll ref="scroll" class="wrapper">
  <div class="ownIntegral">
    <div class="integral_box">
      <div class="card_boy">
        <div class="integral_detail">
          <router-link to="/integraldetails" @click.native="statistics('点击积分明细', {})">
            <svg-icon icon-class="jifen"></svg-icon>
            <p>积分明细 </p>
          </router-link>
        </div>
        <div class="integral_num">
          <p>积分</p>
          <p>{{ownIntegral}}<span>30积分可抢一个淘单</span></p>
        </div>
      </div>
      <div class="card_bottom"><img src="./img/bottom.png"></div>
    </div>
    <div class="item_box">
      <svg-icon icon-class="free" class="title"></svg-icon>
      <ul>
        <li v-for="(item, index) in task" :key="index">
          <div class="text_box">
            <p class="text_title" v-if="item.type !== '签到' && item.type !== '分享'">{{item.name}}<span><svg-icon icon-class="add"></svg-icon><em>30积分</em></span></p>
            <p class="text_title"  v-if="item.type === '分享'">{{item.name}}</p>
            <p class="text_title"  v-if="item.type === '签到'">{{item.name}}<span><svg-icon icon-class="add"></svg-icon><em>50积分</em></span></p>
            <p class="des" v-if="item.type === '分享'">{{item.describe.substr(0,5)}}<span style="color: #B09079;">{{item.describe.substring(item.describe.length-4)}}</span></p>
            <p class="des" v-else>{{item.describe}}</p>
          </div>
          <a href="javascript:;" class="btn" @click="reward(item.type)" v-if="item.type === '分享'">分享</a>
          <a :class="{btn: true, hasGet: item.receive}" v-if="item.type === '认证'" @click="reward(item.type, item.finish, item.receive, item.id)">{{item.status}}</a>
          <a :class="{btn: true, hasGet: item.receive}" v-if="item.type === '充值'" @click="reward(item.type, item.finish, item.receive, item.id)">{{item.status}}</a>
          <a :class="{btn: true, hasGet: true}" v-if="item.type === '签到' && !item.finish" @click="reward(item.type, item.finish, item.id)">{{item.status}}</a>
          <a :class="{btn: true, hasGet: item.receive}" v-if="item.type === '签到' && item.finish" @click="reward(item.type, item.finish, item.receive, item.id)">{{item.status}}</a>
        </li>
      </ul>
    </div>
  </div>
  <div v-transfer-dom>
      <x-dialog v-model="showShare" :dialog-style="{'max-width': '100%', width: '91.2%', 'background-color': 'transparent'}">
        <div class="share_box">
          <div class="share_body">
            <div class="share_header">
              <img src="./img/success_header.png">
              <div class=" close_qd">
              <x-icon type="ios-close-outline" class="close" @click.native="closeshowShare"></x-icon>
            </div>
            </div>
            <div class="jifen_num_body">
              <img src="./img/coin.png" class="coin_1">
              <img src="./img/coin.png" class="coin_2">
              <p v-if="!noAward">恭喜获得<br><span><em>+{{num}}</em>&nbsp;积分</span></p>
              <p v-else>很遗憾, 没有抽中~</p>
              <button class="share_btn" @click="shareAgain" v-if="!noAward">分享再领一次</button>
              <button class="share_btn" @click="shareAgain" v-else>换个姿势，再来一次</button>
            </div>
          </div>
        </div>
      </x-dialog>
  </div>
</scroll>
  <div class="mask" v-if="mask" @click="closeMask">
    <img src="./img/lead.png" alt="">
  </div>
</div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import taskApi from '@/api/task'
import ownApi from '@/api/own'
import wechatApi from '@/api/wechatPay'
import shareApi from '@/api/share'
const wx = require('weixin-js-sdk')
export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog
  },
  data () {
    return {
      ownIntegral: 0,
      isGetAuth: false,
      isGetPay: false,
      isGetqd: false,
      showShare: false,
      noAward: false,
      task: [],
      num: 0,
      mask: false,
      mobile: ''
    }
  },
  methods: {
    closeMask () {
      this.statistics('积分页面-每日分享-关闭', {})
      this.mask = false
    },
    getList () {
      taskApi.getTaskList().then((res) => {
        if (res.data.code === 0) {
          this.task = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    reward (type, finishStatus, getStatus, id) {
      if (type === '分享') {
        // todo
        this.mask = true
        this.initShare()
        this.statistics('积分页面-每日分享-分享', {})
      }
      if (type === '认证') {
        if (finishStatus) {
          if (!getStatus) {
            this.lingqu(id)
            this.statistics('积分页面-新客认证-领取', {})
          }
        } else {
          this.statistics('积分页面-新客认证-认证', {})
          this.$router.push('/certification')
        }
      }
      if (type === '充值') {
        if (finishStatus) {
          if (!getStatus) {
            this.lingqu(id)
            this.statistics('积分页面-首次充值-领取', {})
          }
        } else {
          this.statistics('积分页面-首次充值-去充值', {})
          this.$router.push('/recharge')
        }
      }
      if (type === '签到') {
        if (finishStatus) {
          if (!getStatus) {
            this.lingqu(id)
            this.statistics('积分页面-签到21天-领取', {})
          }
        }
      }
    },
    lingqu (id) {
      let obj = {
        taskId: id
      }
      taskApi.reward(obj).then((res) => {
        if (res.data.code === 0) {
          this.getList()
          this.getOwnIntegral()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    shareAgain () {
      this.showShare = false
      this.mask = true
    },
    closeshowShare () {
      this.showShare = false
      this.mask = false
      this.getOwnIntegral()
    },
    getOwnIntegral () {
      ownApi.getUserInfo().then((res) => {
        if (res.data.code === 0) {
          this.ownIntegral = res.data.data.integral
          this.mobile = res.data.data.mobile
        }
      }).catch((err) => {
        console.log(err)
      })
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
          let mobile = this.mobile
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
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                if (res.errMsg === 'sendAppMessage:ok') {
                  // console.log('分享朋友成功')
                  let obj = {
                    link: `${process.env.BASE_SHAREURL}/share`,
                    shareType: 'WECHAT',
                    taskId: ''
                  }
                  shareApi.share(obj).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                      _this.mask = false
                      if (res.data.data === 0) {
                        _this.showShare = true
                        _this.noAward = true
                      } else {
                        _this.num = res.data.data
                        _this.showShare = true
                        _this.noAward = false
                      }
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              }
            })

            wx.onMenuShareTimeline({
              title: '快来免费抢5单啦！', // 分享标题
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                if (res.errMsg === 'shareTimeline:ok') {
                  let obj = {
                    link: `${process.env.BASE_SHAREURL}/share`,
                    shareType: 'WECHAT',
                    taskId: ''
                  }
                  shareApi.share(obj).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                      _this.mask = false
                      if (res.data.data === 0) {
                        _this.showShare = true
                        _this.noAward = true
                      } else {
                        _this.num = res.data.data
                        _this.showShare = true
                        _this.noAward = false
                      }
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              }
            })

            wx.onMenuShareQQ({
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                if (res.errMsg === 'shareQQ:ok') {
                  // console.log('分享朋友成功')
                  let obj = {
                    link: `${process.env.BASE_SHAREURL}/share`,
                    shareType: 'WECHAT',
                    taskId: ''
                  }
                  shareApi.share(obj).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                      _this.mask = false
                      if (res.data.data === 0) {
                        _this.showShare = true
                        _this.noAward = true
                      } else {
                        _this.num = res.data.data
                        _this.showShare = true
                        _this.noAward = false
                      }
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              }
            })

            wx.onMenuShareWeibo({
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                if (res.errMsg === 'shareWeibo:ok') {
                  // console.log('分享朋友成功')
                  let obj = {
                    link: `${process.env.BASE_SHAREURL}/share`,
                    shareType: 'WECHAT',
                    taskId: ''
                  }
                  shareApi.share(obj).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                      _this.mask = false
                      if (res.data.data === 0) {
                        _this.showShare = true
                        _this.noAward = true
                      } else {
                        _this.num = res.data.data
                        _this.showShare = true
                        _this.noAward = false
                      }
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              }
            })

            wx.onMenuShareQZone({
              title: '快来免费抢5单啦！', // 分享标题
              desc: '我在淘单宝又成一单，每天10000+优质用户实时推送', // 分享描述
              link: `${process.env.BASE_SHAREURL}/share?mobile=${mobile}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${process.env.BASE_SHAREURL}/static/img/thumb.jpg`, // 分享图标
              success: function (res) {
                // 用户点击了分享后执行的回调函数
                if (res.errMsg === 'shareQZone:ok') {
                  // console.log('分享朋友成功')
                  let obj = {
                    link: `${process.env.BASE_SHAREURL}/share`,
                    shareType: 'WECHAT',
                    taskId: ''
                  }
                  shareApi.share(obj).then((res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                      _this.mask = false
                      if (res.data.data === 0) {
                        _this.showShare = true
                        _this.noAward = true
                      } else {
                        _this.num = res.data.data
                        _this.showShare = true
                        _this.noAward = false
                      }
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }
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
    }
  },
  mounted () {
    this.getOwnIntegral()
    this.getList()
    this.initShare()
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
    height: calc(100vh - 46px);
  }
.ownIntegral{
  height: 100%;
  overflow: hidden;
  padding-bottom: 100px;
  .integral_box{
    position: relative;
    width: 100%;
    .card_boy{
      position: relative;
      width: 92%;
      margin: 15px auto 0;
      height: 140px;
      overflow: hidden;
      background:linear-gradient(301deg,rgba(107,127,175,1) 0%,rgba(143,163,209,1) 100%);
      box-shadow: -1px -1px 22px 0px rgba(143,163,209,1);/* no */
      border-radius: 7px;
      .integral_detail{
        float: right;
        margin-top: 10px;
        margin-right: 15px;
        a{
          .svg-icon{
          width: 17px;
          height: 17px;
          }
          p{
            display: inline;
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            line-height: 18px;
          }
        }
      }
      .integral_num{
        margin-top: 37px;
        padding-left: 16px;
        p{
          font-size:40px;
          color:rgba(255,255,255,1);
          line-height:38px;
          letter-spacing:1px;
          &:first-child{
            font-size: 16px;
          }
          &:last-child{
            font-family: money;
            padding-right: 15px;
            span{
              float: right;
              font-size: 13px;
            }
          }
        }
      }
    }
    .card_bottom{
      position: absolute;
      left: 0;
      bottom: -18px;
      overflow: hidden;
      width: 100%;
      height: 35px;
      img{
        display: inline-block;
        max-width: 100%;
        width: 100%;
        height: auto
      }
    }
  }
  .item_box{
    .title{
      width: 100%;
      height: 115px;
      margin-top: 10px;
    }
    ul{
      li{
        position: relative;
        padding: 10px 15px;
        overflow: hidden;
        .text_box{
          float: left;
          margin-left: 8px;
          .text_title{
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
            span{
              display: inline-block;
              position: relative;
              margin-left: 12px;
              width: 64px;
              .svg-icon{
                margin-right: 5px;
                width: 20px;
                height: 20px;
              }
              em{
                position: absolute;
                top: 50%;
                right: 0;
                transform: translate(0, -50%);
                display: inline-block;
                font-size: 12px;
                font-weight: normal;
                font-style: normal;
                color: #B09079;
              }
            }
          }
          .des{
            margin-top: 7px;
            font-size: 12px;
            font-weight: 500;
            color: #999999;
            line-height: 20px;
          }
        }
        .btn{
          position: absolute;
          right: 15px;
          top: 50%;
          width: 21.86%;
          height: 32px;
          text-align: center;
          line-height: 32px;
          transform: translate(0, -50%);
          vertical-align: middle;
          font-size: 14px;
          color: #FFFFFF;
          background:linear-gradient(314deg,rgba(45,120,255,1) 0%,rgba(93,167,255,1) 100%);
          box-shadow:0px 2px 4px 0px rgba(93,167,255,1);
          border-radius:16px;
        }
        .hasGet{
          background:rgba(216,216,216,1);
          box-shadow:0px 2px 4px 0px rgba(221,221,221,1);
        }
      }
    }
  }
}
.share_box{
  overflow: hidden;
  margin-bottom: 20px;
  padding: 60px 16px 0;
  .share_body{
    .share_header{
      position: relative;
      z-index: 11;
      font-size: 0;
      img{
        position: relative;
        display: inline-block;
        max-width: 100%;
        width: 100%;
        height: auto;
        z-index: 11;
      }
      .close_qd{
        position: absolute;
        top: -33px;
        right: 10px;
        z-index: 9;
        transform: translate(0, -60%);
        &::after{
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 87%);
          content: '';
          width: 1px;
          height: 40px;
          background: #fff;
        }
      }
    }
    .jifen_num_body{
      position: relative;
      background: #fff;
      padding-top: 45px;
      padding-bottom: 37px;
      margin-top: -20px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      z-index: 10;
      .coin_1,.coin_2{
        position: absolute;
      }
      .coin_1{
        width: 39px;
        height: 32px;
        left: -16px;
        bottom: 77px;
      }
      .coin_2{
        width: 41px;
        height: 33px;
        right: -16px;
        top: 30px;
      }
      p{
        font-size: 20px;
        color: #454545;
        text-align: center;
        font-weight: 600;
        span{
          font-size: 14px;
          font-weight: normal;
          em{
            font-style: normal;
            color: #F46956;
          }
        }
      }
      .share_btn{
        display: block;
        width: 87.7%;
        margin: 32px auto 0px;
        line-height: 40px;
        background:#FFA500;
        box-shadow:2px 2px 8px 0px #FFA500;
        border-radius:21px;
        outline: none;
        border: none;
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
  .close{
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
    z-index: 999;
    text-align: right;
    img{
      margin-right: 20px;
      margin-top: 30px;
    }
  }

  @media (max-width: 320px) {
    .ownIntegral .item_box ul li .text_box .text_title span{
      width: 70px;
    }
  }
</style>
