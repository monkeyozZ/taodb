<template>
<div>
<scroll ref="scroll" class="wrapper" :style="{height: height}" :bounce="{ bottom: false }">
  <div class="own_box">
    <div class="info_box">
      <svg-icon icon-class="own_bg" class="own_bg"></svg-icon>
      <div class="avt_name">
        <div class="avt">
          <!-- <input type="file" style="display:block;width:100%;height:100%;opacity:0"> -->
          <img :src="ownData.headImgSrc ? ownData.headImgSrc : defaultAvt" alt="头像">
        </div>
        <div class="name_box">
          <p class="name" v-if="!ownData.gender">{{ownData.name}}</p>
          <p class="name" v-else>{{ownData.name}}{{ownData.gender | transformName}}</p>
          <p class="mobile">{{ownData.mobile}}</p>
        </div>
        <div class="jifen" @click="goIntegral">
          <img src="./img/jf.png" class="jf_img">
          <span>{{ownData.integral}}</span>
        </div>
      </div>
      <div class="count">
        <p class="count_num">{{ownData.coin}}</p>
        <p class="count_text">淘单币</p>
      </div>
      <div class="recharge">
        <button @click="goRecharge"><img src="./img/recharge.png">充值</button>
      </div>
    </div>
    <div class="sign_box" v-if="ownData.creditStatus === 'SUCCESS'">
      <flexbox :gutter="0" wrap="wrap">
        <flexbox-item :span="12/7" v-for="(item, index) in dayList" :key="index">
          <div class="day_item">
            <p>第{{index + 1}}天</p>
            <div class="circle" @click="qiandao(item.showText)" :class="{active: item.showText}">
              <p>{{item.label}}</p>
              <p class="dot"> <span v-if="item.showText">点击签到</span> <svg-icon icon-class="hassign" v-if="item.isSign"></svg-icon></p>
            </div>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="upload_box" v-if="ownData.creditStatus !== 'SUCCESS'">
      <div class="rote_line" @click="goRz">
        <div class="content">
          <div class="middle">
            <img src="./img/re_2.png">
            <p class="title">快速实名认证</p>
            <p class="result">{{certificationStatus}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="own_list_box">
     <group class="box_item">
        <cell title="实名认证" :value="certificationStatus" is-link class="auth" link="/certification" v-if="ownData.creditStatus === 'SUCCESS'"  @click.native="statistics('点击实名认证', {type: '菜单', 认证状态: '已认证'})">
          <img slot="icon" src="./img/rz.png" class="icon">
        </cell>
        <cell title="邀请有礼" :value="`邀请码${ownData.inviteCode?ownData.inviteCode:''}`" is-link class="auth" link="/invite" @click.native="statistics('点击邀请有礼', {})">
          <img slot="icon" src="./img/gift.png" class="icon">
        </cell>
        <!-- <cell title="消息" :value="unReadCount" is-link class="auth" link="/news">
          <div class="news_box" slot="icon">
            <img slot="icon" src="./img/news.png" class="icon">
            <span class="red_dot" :class="{active: ownData.unReadCount ? (ownData.unReadCount !== 0 ? true : false) : false}"></span>
          </div>
        </cell> -->
        <cell title="联系客服" is-link link="/kefu" @click.native="statistics('点击联系客服', {})">
           <img slot="icon" src="./img/kf.png" class="icon">
        </cell>
        <cell title="常见问题"  is-link link="/faq" @click.native="statistics('点击常见问题', {})">
          <img slot="icon" src="./img/wt.png" class="icon">
        </cell>
     </group>
    </div>
    <div class="logo_box">
      <img src="./img/logo.png">
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showQd" :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent'}">
        <div class="flash_box">
          <div class="scale">
            <div class="flash"></div>
          </div>
        </div>
        <div class="scale_body">
          <div class="qd_box">
          <div class="dialog_header">
            <img src="./img/header.png">
            <div class="success_title">
              <img src="./img/successtext.png" alt="">
            </div>
            <p class="qd_count">已积累签到{{sign_count}}天</p>
            <div class=" close_qd">
              <x-icon type="ios-close-outline" class="close" @click.native="closeDialog"></x-icon>
            </div>
          </div>
          <div class="qd_body">
            <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="3">
                  <p class="qd_day">第一天</p>
                  <div class="jifen_box" :class="{had: status_1}">
                    <img src="./img/jifen.png">
                    <p class="qd_num">5积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                </flexbox-item>
                <flexbox-item :span="3">
                  <p class="qd_day">第二天</p>
                  <div class="jifen_box" :class="{had: status_2}">
                    <img src="./img/jifen.png">
                    <p class="qd_num">5积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                </flexbox-item>
                <flexbox-item :span="3">
                  <p class="qd_day">第三天</p>
                  <div class="jifen_box" :class="{had: status_3}">
                    <img src="./img/jifen.png">
                    <p class="qd_num">5积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                </flexbox-item>
                <flexbox-item :span="3">
                  <p class="qd_day">第四天</p>
                  <div class="jifen_box" :class="{had: status_4}">
                    <img src="./img/jifen.png">
                    <p class="qd_num">5积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                </flexbox-item>
                <flexbox-item :span="3">
                  <p class="qd_day">第五天</p>
                  <div class="jifen_box" :class="{had: status_5}">
                    <img src="./img/jifen.png">
                    <p class="qd_num">5积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                </flexbox-item>
                <flexbox-item :span="3">
                  <p class="qd_day">第六天</p>
                  <div class="jifen_box" :class="{had: status_6}">
                    <img src="./img/jifen.png">
                    <p class="qd_num">5积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                </flexbox-item>
                <flexbox-item :span="3">
                  <p class="qd_day">第七天</p>
                  <div class="jifen_box" :class="{had: status_7}">
                    <img src="./img/lastDay.png">
                    <p class="qd_num">30积分</p>
                    <div class="qd_mask">
                      <div class="had_box">
                        <p>已签到</p>
                      </div>
                    </div>
                  </div>
                  <div class="bubble">
                    连续签到
                  </div>
                </flexbox-item>
            </flexbox>
            <button class="share_btn" @click="share" :disabled="!isWxBrowser">分享给好友</button>
            <p class="tip">分享好友最高获得50积分</p>
          </div>
          </div>
        </div>
      </x-dialog>

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
  </div>
</scroll>
<div class="mask" v-if="mask" @click="closeMask">
  <img src="./img/lead.png" alt="">
</div>
<div class="lead_mask" v-if="lead">
    <div class="jifen" @click="goIntegral2">
      <img src="./img/jf.png" class="jf_img">
      <span>{{ownData.integral}}</span>
    </div>
    <div class="lead_box">
      <img src="../../assets/img/lead.png">
      <p>点击这里查看积分活动哦~</p>
      <button type="button" class="close_lead_btn" @click="updateLeadStatus">关闭</button>
    </div>
  </div>
</div>
</template>

<script>
import { Badge, Group, Cell, Flexbox, FlexboxItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'
import ownApi from '@/api/own'
import signApi from '@/api/sign'
import wechatApi from '@/api/wechatPay'
import shareApi from '@/api/share'
import bus from '@/utils/eventBus'
import leadApi from '@/api/lead'
const wx = require('weixin-js-sdk')
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      defaultAvt: require('@/assets/img/avt.png'),
      ownData: {},
      certificationStatus: '',
      showQd: false,
      showShare: false,
      noAward: false,
      sign_count: 0,
      unReadCount: '',
      status_1: false,
      status_2: false,
      status_3: false,
      status_4: false,
      status_5: false,
      status_6: false,
      status_7: false,
      dayList: [
        {
          label: '连',
          showText: false,
          isSign: false
        },
        {
          label: '续',
          showText: false,
          isSign: false
        },
        {
          label: '签',
          showText: false,
          isSign: false
        },
        {
          label: '到',
          showText: false,
          isSign: false
        },
        {
          label: '送',
          showText: false,
          isSign: false
        },
        {
          label: '壕',
          showText: false,
          isSign: false
        },
        {
          label: '礼',
          showText: false,
          isSign: false
        }],
      num: 0,
      mask: false,
      height: '',
      lead: false
    }
  },
  components: {
    Badge,
    Group,
    Cell,
    XDialog,
    Flexbox,
    FlexboxItem
  },
  computed: {
    ...mapGetters(['token', 'user_info', 'login_status']),
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    },
    tabbarHeight () {
      return localStorage.getItem('tabbarHeight') ? localStorage.getItem('tabbarHeight') : ''
    },
    isWxBrowser () {
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') > 0) {
        return true
      }
    }
  },
  methods: {
    closeLead () {
      this.lead = false
    },
    closeMask () {
      this.mask = false
    },
    closeDialog () {
      this.showQd = false
    },
    qiandao (status) {
      if (status) {
        signApi.sign().then((res) => {
          if (res.data.code === 0) {
            this.sign_count = res.data.data.list.length
            this.getUserInfo() // 同步积分数量
            this.getSignInStatus() // 同步签到状态
            this.statistics('个人页面签到', {连签天: res.data.data.list.length})
            switch (res.data.data.list.length) {
              case 1:
                this.status_1 = true
                break
              case 2:
                this.status_1 = true
                this.status_2 = true
                break
              case 3:
                this.status_1 = true
                this.status_2 = true
                this.status_3 = true
                break
              case 4:
                this.status_1 = true
                this.status_2 = true
                this.status_3 = true
                this.status_4 = true
                break
              case 5:
                this.status_1 = true
                this.status_2 = true
                this.status_3 = true
                this.status_4 = true
                this.status_5 = true
                break
              case 6:
                this.status_1 = true
                this.status_2 = true
                this.status_3 = true
                this.status_4 = true
                this.status_5 = true
                this.status_6 = true
                break
              case 7:
                this.status_1 = true
                this.status_2 = true
                this.status_3 = true
                this.status_4 = true
                this.status_5 = true
                this.status_6 = true
                this.status_7 = true
                break
              default:
                this.status_8 = true
                break
            }
          }
          if (res.data.code === -1) {
            // todo
            if (res.data.msg === '-1') {
              // console.log('今日已签到')
            }
          }
          this.showQd = true
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    getSignInStatus () {
      if (this.login_status) {
        let obj = {
          action: true
        }
        signApi.sign(obj).then((res) => {
          if (res.data.code === 0) {
            let t = res.data.data.list.length
            switch (t) {
              case 0:
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                }
                break
              case 1:
                this.dayList[0].isSign = true
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                } else {
                  this.dayList[t - 1].showText = false
                }
                break
              case 2:
                this.dayList[0].isSign = true
                this.dayList[1].isSign = true
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                } else {
                  this.dayList[t - 1].showText = false
                }
                break
              case 3:
                this.dayList[0].isSign = true
                this.dayList[1].isSign = true
                this.dayList[2].isSign = true
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                } else {
                  this.dayList[t - 1].showText = false
                }
                break
              case 4:
                this.dayList[0].isSign = true
                this.dayList[1].isSign = true
                this.dayList[2].isSign = true
                this.dayList[3].isSign = true
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                } else {
                  this.dayList[t - 1].showText = false
                }
                break
              case 5:
                this.dayList[0].isSign = true
                this.dayList[1].isSign = true
                this.dayList[2].isSign = true
                this.dayList[3].isSign = true
                this.dayList[4].isSign = true
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                } else {
                  this.dayList[t - 1].showText = false
                }
                break
              case 6:
                this.dayList[0].isSign = true
                this.dayList[1].isSign = true
                this.dayList[2].isSign = true
                this.dayList[3].isSign = true
                this.dayList[4].isSign = true
                this.dayList[5].isSign = true
                if (!res.data.data.isSign) {
                  this.dayList[t].showText = true
                } else {
                  this.dayList[t - 1].showText = false
                }
                break
              case 7:
                this.dayList[0].isSign = true
                this.dayList[1].isSign = true
                this.dayList[2].isSign = true
                this.dayList[3].isSign = true
                this.dayList[4].isSign = true
                this.dayList[5].isSign = true
                this.dayList[6].isSign = true
                break
              default:
                this.status_8 = true
                break
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    share () {
      this.showQd = false
      this.initShare()
      this.mask = true
    },
    shareAgain () {
      this.showShare = false
      this.mask = true
    },
    closeshowShare () {
      this.showShare = false
      this.mask = false
      this.getUserInfo()
    },
    goIntegral () {
      this.statistics('点击查看积分', {})
      this.$router.push('/ownintegral')
    },
    goIntegral2 () {
      this.statistics('点击查看积分', {})
      this.updateLeadStatus()
      this.$router.push('/ownintegral')
    },
    goRecharge () {
      this.statistics('点击充值', {})
      this.$router.push('/recharge')
    },
    goRz () {
      this.statistics('点击实名认证', {type: '签到区域', 认证状态: this.certificationStatus})
      this.$router.push('/certification')
    },
    getUserInfo () {
      ownApi.getUserInfo().then((res) => {
        if (res.data.code === 0) {
          this.unReadCount = res.data.data.unReadCount > 0 ? `您有${res.data.data.unReadCount}条未读消息` : ''
          this.ownData = res.data.data
          bus.$emit('setOwnData', res.data.data)
          if (res.data.data.creditStatus === 'UNCERTIFIED') {
            this.certificationStatus = '未认证'
          }
          if (res.data.data.creditStatus === 'UNDERWAY') {
            this.certificationStatus = '审核中'
          }
          if (res.data.data.creditStatus === 'SUCCESS') {
            this.certificationStatus = '已认证'
          }
          if (res.data.data.creditStatus === 'FAIL') {
            this.certificationStatus = '认证失败'
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
    },
    getLeadStatus () {
      let obj = {
        type: 'myInfoGuide'
      }
      leadApi.leadStatus(obj).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.lead = true
          }
        }
      })
    },
    updateLeadStatus () {
      let obj = {
        type: 'myInfoGuide'
      }
      this.statistics('关闭积分引导', {})
      leadApi.updateLeadStatus(obj).then((res) => {
        if (res.data.code === 0) {
          this.lead = false
        }
      })
    }
  },
  mounted () {
    this.getSignInStatus()
    this.getUserInfo()
    this.getLeadStatus()
    setTimeout(() => {
      this.height = `${document.body.clientHeight - this.headerHeight - this.tabbarHeight}px`
    }, 40)
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
@keyframes shine {
    0% { background-position: -1px -1px;}
    100% { background-position: -12px -12px;}
}
.wrapper{
  background-color: #f7f7f7;
    /* height: calc(100vh - 100px); */
  }
.own_box{
  position: relative;
   /* height: calc(100vh - 100px); */
  .info_box{
    position: relative;
    width: 100%;
    height: 155px;
    .own_bg{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .avt_name{
      position: relative;
      overflow: hidden;
      padding-top: 15px;
      .avt{
        float: left;
        width: 60px;
        height: 60px;
        overflow: hidden;
        margin-left: 15px;
        border-radius: 50%;
        border: 1px solid #fff;
        img{
          display: inline-block;
          max-width: 100%;
          width: 100%;
          height: auto;
        }
      }
    }
    .name_box{
      float: left;
      margin-left: 10px;
      margin-top: 10px;
      p{
        color: #fff;
        font-weight: 600;
      }
      .name{
        font-size: 16px;
        line-height: 24px;
      }
      .mobile{
        font-size: 12px;
        line-height: 18px;
      }
    }
    .jifen{
      position: absolute;
      top: 25px;
      right: 0;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      background:rgba(255,255,255,0.18);
      border:1px solid rgba(240,240,240,1);
      border-right: none;
      padding-right: 5px;
      overflow: hidden;
      .jf_img{
        display: inline-block;
        width: 22px;
        height: auto;
        margin-left:10px;
        vertical-align: middle;
        margin-top: -7px;
      }
      span{
        font-size: 20px;
        line-height: 28px;
        color: #FFF7EA;
      }
    }
    .count{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -10%);
        text-align: center;
        .count_num{
          color: #fff;
          font-size: 30px;
          line-height: 26px;
          font-family: money;
          font-weight: bold;
          line-height:37px;
          letter-spacing:3px;
        }
        .count_text{
          font-size: 13px;
          color: #fff;
        }
      }
      .recharge{
        width: 50%;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
        button{
          width: 100%;
          font-size: 15px;
          border: none;
          outline: none;
          padding: 0 26px;
          background-color:#fff;
          background-size: cover;
          color: #333;
          border-radius:20px;
          line-height: 44px;
          text-align: center;
          box-shadow:0px 4px 2px 0px #7C9FD9;/* no */
          img{
            display: inline-block;
            width: 23px;
            vertical-align: middle;
            margin-right: 8px;
          }
        }
      }
  }
  .sign_box{
    margin-top: 36px;
    padding: 20px 24px;
    box-sizing: border-box;
    background: #fff;
    background-size: cover;
    background-color: #fff;
    .day_item{
      >p{
        font-size: 12px;
        color: #565656;
        text-align: center;
      }
      .circle{
        position: relative;
        width: 38px;
        height: 38px;
        margin: 0 auto;
        margin-top: 7px;
        border-radius: 50%;
        background:linear-gradient(135deg,#5AA4FF 0%,#317CFF 100%);
        &.active{
          background: #006AFF;
          p{
            &:first-child{
              color: rgba(255, 255, 255, .4)
            }
          }
        }
        p{
          font-size: 16px;
          color: #fff;
          text-align: center;
          line-height: 38px;
        }
        .dot{
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          font-size: 14px;
          text-align: center;
          span{
            display: block;
            width: 60px;
            margin-left: -11px;
            transform: scale(0.6)
          }
          .svg-icon{
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 10px;
            height: 10px;
            color: #00C922;
          }
        }
      }
    }
  }
  .upload_box{
    margin-top: 36px;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
    .rote_line{
      width: 94.67%;
      margin: 10px auto;
      background: repeating-linear-gradient(135deg, transparent, transparent 3px, #C8C8C8 3px, #C8C8C8 8px);
      animation: shine 1s infinite linear;
      overflow: hidden;
      .content{
        position: relative;
        width: calc(100% - 2px);
        margin: 1px auto;
        height: 80px;
        background: #fff;
        box-sizing: border-box;
        .middle{
          position: absolute;
          width: 47%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          img{
            float: left;
            margin-right: 15px;
            display: inline-block;
            width: 60px;
            height: auto;
          }
          .title{
            font-size: 14px;
            color: #333;
            overflow: hidden;
          }
          .result{
            font-size: 13px;
            color: #9F9F9F;
            overflow: hidden;
          }
        }
      }
    }
  }
  .own_list_box{
    margin-top: 15px;
    .box_item{
      margin-bottom: 5px;
      .weui-cells{
        margin-top: 0;
        .weui-cell{
          .icon{
            display: inline-block;
            width: 34px;
            vertical-align: middle;
          }
          .vux-cell-bd{
            padding-left: 8px;
          }
        }
      }
    }
    .weui-cell{
      height: 52px;
      box-sizing: border-box;
      .svg-icon{
        width: 21px;
        height: 15px;
        margin-right: 3px;
      }
    }
  }
  .logo_box{
    width: 100%;
    padding: 15px 0;
    overflow: hidden;
    img{
      display: block;
      width: 49px;
      height: auto;
      margin: 0 auto
    }
  }
}

@-webkit-keyframes rotate {
    0% {
        -webkit-transform:rotate(0deg);
    }
    100% {
        -webkit-transform:rotate(360deg);
    }
}
@-webkit-keyframes scale {
    0% {
        -webkit-transform:scale(0);
    }
    100% {
        -webkit-transform:scale(1);
    }

}
.flash_box{
  position: absolute;
  left: 50%;
  top: -18%;
  transform: translate(-50%, 0);
  .scale{
    animation: scale .5s reverse;
    .flash{
      background: url('./img/flash.png') no-repeat center center;
      background-size: 100% 100%;
      width: 600px;
      height: 600px;
      z-index: 998;
      border-radius: 50%;
      animation: rotate 10s  infinite  linear;
    }
  }
}
.scale_body{
  transform: scale(0.9);
}
.qd_box{
    position: absolute;
    width: 90.6%;
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 18px 0 20px 0;
    border-radius: 3px;
    z-index: 9999;
    .dialog_header{
      position: relative;
      img{
        position: relative;
        display: inline-block;
        max-width: 100%;
        width: 100%;
        height: auto;
        z-index: 10;
      }
      .success_title{
        position: absolute;
        top:78px;
        left: 50%;
        width: 42.6%;
        transform: translate(-50%, 0);
        z-index: 999;
      }
      .qd_count{
        position: absolute;
        left: 50%;
        top: 120px;
        font-size: 16px;
        transform: translate(-50%, 0);
        width: 42.6%;
        line-height: 28px;
        background: #F46956;
        color: #fff;
        border-radius: 20px;
        z-index: 999;
      }
      .close_qd{
        position: absolute;
        top: 0;;
        right: 10px;
        z-index: 9;
        transform: translate(0, -60%);
        &::after{
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 74%);
          content: '';
          width: 1px;
          height: 40px;
          background: #fff;
        }
      }
    }
    .qd_body{
        margin-top: -25px;
        padding: 25px 15px 15px;
        background: #fff;
        box-sizing: border-box;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        .vux-flexbox-item{
          position: relative;
          margin-top: 16px;
          &:first-child{
            margin-top: 16px!important;
          }
          &:last-child{
            .jifen_box{
              position: relative;
              img{
                position: absolute;
                display: block;
                width: 100%;
                top: -9px;
              }
              .qd_num{
                position: absolute;
                bottom: 0;
                width: 100%;
                font-size: 12px;
                color: #454545;
                text-align: center;
              }
            }
            .bubble{
              position: absolute;
              top: 0px;
              right: -58px;
              width: 68px;
              height: 25px;
              line-height: 21px;
              background: url('./img/bubble.png') no-repeat center center;
              background-size: 100% 100%;
              font-size: 12px;
              text-align: center;
              color: #F46956;
            }
          }
          .qd_day{
            text-align: center;
            font-size: 12px;
            color: #A5A5A5;
            margin-bottom: 4px;
          }
          .jifen_box{
            position: relative;
            width: 54px;
            height: 58px;
            margin: 0 auto;
            background: #F1EFF2;
            overflow: hidden;
            img{
              display: block;
              width: 32px;
              margin: 8px auto 6px auto;
            }
            .qd_num{
              font-size: 12px;
              color: #454545;
              text-align: center;
            }
            .qd_mask{
              display: none;
              .had_box{
                width: 100%;
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%, -50%);
                p{
                color: #fff;
                text-align: center;
                transform: rotate(-45deg)
              }
              }
            }
          }
          .had{
            background: #ffefc4;
            .qd_mask{
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
              top:0;
              left:0;
              background: rgba(0, 0, 0, 0.4)
            }
          }
        }
      }
        .share_btn{
          display: block;
          width: 87.7%;
          margin: 20px auto 14px;
          line-height: 40px;
          background:#FFA500;
          box-shadow:2px 2px 8px 0px #FFA500;
          border-radius:21px;
          outline: none;
          border: none;
          color: #fff;
          font-size: 16px;
          text-align: center;
          &:disabled{
            background: #C1C1C1;
            box-shadow:2px 2px 8px 0px #C1C1C1;
          }
        }
        .tip{
          color: #454545;
          font-size: 14px;
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
  z-index: 9999;
  text-align: right;
  img{
    margin-right: 20px;
    margin-top: 30px;
  }
}
.lead_mask{
  position: fixed;
  background: rgba(0,0,0,.7);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 998;
  .jifen{
    position: absolute;
    top: 69px;
    right: 0;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    background:rgba(255,255,255,0.18);
    border:1px solid rgba(240,240,240,1);
    border-right: none;
    padding-right: 5px;
    overflow: hidden;
    z-index: 999;
    .jf_img{
      display: inline-block;
      width: 22px;
      height: auto;
      margin-left:10px;
      vertical-align: middle;
      margin-top: -7px;
    }
    span{
      font-size: 20px;
      line-height: 28px;
      color: #FFF7EA;
    }
  }
  .lead_box{
    width: 64.53%;
    position: absolute;
    top: 65px;
    right: 0;
    text-align: right;
    img{
      margin: 30px 82px 0 0;
      display: inline-block;
      width: 72px;
    }
    p{
      font-size: 16px;
      color:#fff;
      letter-spacing:2px;
      text-align: left;
      font-weight:500;
    }
    .close_lead_btn{
      display: block;
      margin: 15px auto 0;
      width: 75px;
      line-height: 24px;
      text-emphasis: center;
      font-size: 16px;
      letter-spacing: 2px;
      border: 2px solid #FFFFFF;
      box-shadow: 1px 1px 1px 0 #BEBEBE;
      border-radius: 20px;
      outline: none;
      background: #1D93D2;
      color: #fff;
    }
  }
}
  @media (max-width: 320px) {
    .qd_box .integral_box .vux-flexbox-item .item > div span{
      transform: scale(0.62);
      left: 0;
    }
    .qd_box .share .last_day span{
      left: 0px;
      transform: scale(0.68);
    }
    .own_box{
      .upload_box{
        .rote_line{
          .content{
            width: calc(100% - 4px)
          }
        }
      }
    }
  }
</style>
