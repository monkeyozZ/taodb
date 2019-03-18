<template>
  <div class="containaer" :style="{height: height}">
    <div class="tab_nav sticky" v-show="sticky" style="border-top: 1px solid #EFEFF4">
      <div class="tab_nav_box">
        <tab :line-width="5" active-color='#2D78FF' :custom-bar-width="getBarWidth" v-model="index">
            <tab-item class="vux-center" :selected="selected === item" v-for="(item, index) in list" @click="selected = item" :key="index">{{item}}</tab-item>
        </tab>
        <div class="filter" @click="routeTo">
          <p>筛选</p>
        </div>
      </div>
    </div>
    <div class="signIn" @click="qiandao">
      <p>{{sign_text}}</p>
      <img src="./img/signIcon.png" v-if="!notLastDay">
      <img src="./img/signIcon_last.png" v-else>
    </div>
    <scroll ref="scroll" class="wrapper"
                  :style="{height: height}"
                  :data="orderData"
                  :probe-type="probeType"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :listenScroll="true"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp"
                  @calcHeight="calcHeight">
    <!-- <div class="tools">
      <flexbox :gutter="0" justify="space-between">
      <flexbox-item :span="4">
        <div class="left" @click="setCurrentCity">
          <svg-icon icon-class="address"></svg-icon>
          <span v-if="city">{{city | substring4}}</span>
          <span v-else>定位中<spinner type="dots" :size="'16px'"></spinner></span>
        </div>
      </flexbox-item>
      <flexbox-item :span="2.8">
        <div class="right" @click="qiandao">
          <svg-icon icon-class="qiandao"></svg-icon>
          <span>签到</span>
        </div>
      </flexbox-item>
    </flexbox>
    </div> -->
    <div class="banner">
      <my-swiper></my-swiper>
    </div>

    <div class="tab_nav" ref="nav">
      <div class="tab_nav_box">
        <tab :line-width="5" active-color='#2D78FF' :custom-bar-width="getBarWidth" v-model="index">
            <tab-item class="vux-center" :selected="selected === item" v-for="(item, index) in list" @click="selected = item" :key="index">{{item}}</tab-item>
        </tab>
        <div class="filter" @click="routeTo">
          <p>筛选</p>
        </div>
      </div>
    </div>

   <!-- <slide ref="slide" :autoPlay="false" :loop="false" :showDot="false" :threshold="6" :speed="400" @sliderTo="sliderTo">
      <div class="tab-swiper vux-center">
        <list-card :orderData="orderData" @order="order" @stop="stop"></list-card>
        <div class="empty_box" v-if="orderData.length === 0">
          <svg-icon icon-class="empty" class="empty"></svg-icon>
          <p>暂无订单</p>
        </div>
      </div>
      <div class="tab-swiper vux-center">
        <list-card :orderData="orderData" @order="order" @stop="stop"></list-card>
        <div class="empty_box" v-if="orderData.length === 0">
          <svg-icon icon-class="empty" class="empty"></svg-icon>
          <p>暂无订单</p>
        </div>
      </div>
      <div class="tab-swiper vux-center">
        <list-card :orderData="orderData" @order="order" @stop="stop"></list-card>
        <div class="empty_box" v-if="orderData.length === 0">
          <svg-icon icon-class="empty" class="empty"></svg-icon>
          <p>暂无订单</p>
        </div>
      </div>
   </slide> -->
      <div class="tab-swiper">
        <list-card :orderData="orderData" @order="order" @stop="stop"></list-card>
        <div class="empty_box" v-if="orderData.length === 0">
          <svg-icon icon-class="empty" class="empty"></svg-icon>
          <p v-if="Object.keys(orderCondition).length === 0">您当前所在城市暂无订单</p>
          <p v-else>暂无订单</p>
        </div>
      </div>
      <!-- <swiper v-model="index" :show-dots="false" :threshold="150" height="100%">
        <swiper-item>
          <div class="tab-swiper vux-center">
            <list-card :orderData="orderData" @order="order"></list-card>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="tab-swiper vux-center">
            <list-card :orderData="orderData" @order="order"></list-card>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="tab-swiper vux-center">
            <list-card :orderData="orderData" @order="order"></list-card>
          </div>
        </swiper-item>
      </swiper> -->
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

  <confirm v-model="showConfirm"
    confirm-text="确认"
    cancel-text="取消"
    @on-cancel="onCancel"
    @on-confirm="onConfirm"
    class="indexConfirm">
      <p class="confirmText">{{confirmText}}</p>
  </confirm>

  <confirm v-model="showConfirm2"
    confirm-text="继续抢单"
    cancel-text="立即查看"
    @on-cancel="onCancel2"
    @on-confirm="onConfirm2"
    class="indexConfirm">
      <p class="confirmText">恭喜您，抢单成功！</p>
  </confirm>

  <confirm v-model="showConfirm3"
    confirm-text="去充值"
    cancel-text="取消"
    @on-cancel="onCancel3"
    @on-confirm="onConfirm3"
    class="indexConfirm">
      <p class="confirmText">{{confirmText3}}</p>
  </confirm>

  <confirm v-model="showConfirm4"
    confirm-text="去认证"
    cancel-text="取消"
    @on-cancel="onCancel4"
    @on-confirm="onConfirm4"
    class="indexConfirm">
      <p class="confirmText">通过身份认证才能抢单哦！</p>
  </confirm>

  <confirm v-model="showConfirm5"
    confirm-text="确定"
    cancel-text="取消"
    @on-cancel="onCancel5"
    @on-confirm="onConfirm5"
    class="indexConfirm">
      <p class="confirmText">该订单已被抢</p>
  </confirm>
</div>
</scroll>
  <div class="mask" v-if="mask" @click="closeMask">
    <img src="./img/lead.png" alt="">
  </div>
</div>
</template>

<script>
import mySwiper from '@/components/swiper/index'
import { Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, XDialog, Spinner, Confirm, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import ListCard from '@/components/listCard'
import slide from '@/components/slider'
import axios from 'axios'
import indexApi from '@/api/index'
import signApi from '@/api/sign'
import orderPayApi from '@/api/orderPay'
import Auth from '@/utils/auth'
import bus from '@/utils/eventBus'
import wechatApi from '@/api/wechatPay'
import shareApi from '@/api/share'
import ownApi from '@/api/own'
import registerApi from '@/api/registerAndLogin'
const wx = require('weixin-js-sdk')
export default {
  name: 'index',
  components: {
    Flexbox,
    FlexboxItem,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    ListCard,
    XDialog,
    Confirm,
    slide,
    Spinner,
    mySwiper
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      swiperOption: {
        height: 115,
        // autoplay: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        // loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      sticky: false,
      showConfirm: false,
      showConfirm2: false,
      showConfirm3: false,
      showConfirm4: false,
      showConfirm5: false,
      status_1: false,
      status_2: false,
      status_3: false,
      status_4: false,
      status_5: false,
      status_6: false,
      status_7: false,
      sign_count: 0,
      confirmText: '',
      confirmText3: '',
      customerId: '',
      showQd: false,
      showShare: false,
      noAward: false,
      notLastDay: false,
      sign_text: '签到',
      list: ['全部可抢', '优选', '淘单'],
      selected: '全部可抢',
      customerType: null,
      index: 0,
      city: '',
      getBarWidth: function (index) {
        let w = document.body.clientWidth
        if (index === 0) {
          if (w < 375) {
            return 56 + 'px'
          }
          return 64 + 'px'
        } else {
          return 30 + 'px'
        }
        // return (index + 1) * 22 + 'px'
      },
      orderData: [],
      pullDownRefresh: true,
      pullDownRefreshTxt: '刷新成功',
      pullDownRefreshThreshold: 65,
      pullDownRefreshStop: 40,
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      pullUpLoadMoreTxt: '数据加载中',
      pullUpLoadNoMoreTxt: '我是有底线的',
      limitQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      mask: false,
      num: 0,
      ownData: {},
      customerCate: '',
      height: ''
    }
  },
  created () {
    this.probeType = 3
  },
  computed: {
    pullDownRefreshObj: function () {
      return this.pullDownRefresh ? {
        threshold: parseInt(this.pullDownRefreshThreshold),
        stop: parseInt(this.pullDownRefreshStop),
        txt: this.pullDownRefreshTxt
      } : false
    },
    pullUpLoadObj: function () {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold),
        txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
      } : false
    },
    ...mapGetters(['orderCondition', 'login_status', 'currentCity', 'user_info', 'positionY']),
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : '44'
    },
    tabbarHeight () {
      return localStorage.getItem('tabbarHeight') ? localStorage.getItem('tabbarHeight') : '53'
    },
    isWxBrowser () {
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') > 0) {
        return true
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentCity: 'setCurrentCity',
      setPositionY: 'setPositionY'
    }),
    closeMask () {
      this.mask = false
    },
    calcHeight (pos, direction) {
      console.log(pos.y)
      this.setPositionY(pos.y)
      console.log('vuex:' + this.positionY, this.$refs.nav.offsetTop, direction)
      if (direction === 1) {
        if (pos.y <= '-' + this.$refs.nav.offsetTop) {
          this.sticky = true
        }
        if (pos.y > '-' + this.$refs.nav.offsetTop) {
          this.sticky = false
        }
      } else if (direction === -1) {
        if (pos.y > '-' + this.$refs.nav.offsetTop) {
          this.sticky = false
        }
      } else if (direction === 0) { // scrollTo滑动时
        if (pos.y <= '-' + this.$refs.nav.offsetTop) {
          this.sticky = true
        }
        if (pos.y > '-' + this.$refs.nav.offsetTop) {
          this.sticky = false
        }
      }
    },
    routeTo () {
      this.$router.push('/filter')
    },
    /* sliderTo (n) {
      this.index = n
    }, */
    getCity () {
      this.$vux.loading.show({
        text: '加载中...'
      })
      axios({
        url: 'https://elm.cangdu.org/v1/cities?type=guess',
        method: 'get',
        timeout: 2000 // request timeout
      }).then((res) => {
        this.$vux.loading.hide()
        if (res.status === 200) {
          this.city = res.data.name
          this.setCurrentCity(this.city)
        } else {
          this.city = '上海'
          this.setCurrentCity(this.city)
        }
      }).catch((err) => {
        this.$vux.loading.hide()
        this.city = '上海'
        this.setCurrentCity(this.city)
        console.log(err)
      })
    },
    copy (obj) {
      let newobj = {}
      for (let attr in obj) {
        newobj[attr] = obj[attr]
      }
      return newobj
    },
    getList () {
      this.limitQuery.pageNumber = 1
      let obj = this.copy(this.orderCondition)
      if (!obj.citys) {
        obj.citys = this.currentCity
      }
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      this.$vux.loading.show({
        text: '加载中...'
      })
      indexApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          this.orderData = res.data.data.elements
          this.$vux.loading.hide()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onPullingDown () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = this.copy(this.orderCondition)
      if (!obj.citys) {
        obj.citys = this.city
      }
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      indexApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          this.orderData = res.data.data.elements
        } else {
          this.$refs.scroll.forceUpdate()
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingUp () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = this.copy(this.orderCondition)
      if (!obj.citys) {
        obj.citys = this.city
      }
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      indexApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data.elements.length !== 0) {
            res.data.data.elements.map((item) => {
              this.orderData = this.orderData.concat(item)
            })
          } else {
            this.limitQuery.pageNumber -= 1
            this.$refs.scroll.forceUpdate()
          }
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    order (type, price, id) {
      let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'
      if (JSON.parse(status)) {
        if (!this.login_status) {
          this.confirmText = '请关联手机号后再操作'
          this.showConfirm = true
        } else {
          this.customerId = id
          this.checkOrder(type, price)
        }
      } else {
        console.log(this.login_status)
        if (!this.login_status) {
          this.confirmText = '请登录后再操作'
          this.showConfirm = true
        } else {
          this.customerId = id
          this.checkOrder(type, price)
        }
      }
      window.event.stopPropagation()
    },
    stop () {
      window.event.stopPropagation()
    },
    checkOrder (type, price) {
      ownApi.getUserInfo().then((res) => { // 是否认证
        if (res.data.code === 0) {
          if (res.data.data.creditStatus !== 'SUCCESS') {
            this.showConfirm4 = true
          } else {
            let obj = {
              customerId: this.customerId
            }
            orderPayApi.checkOrder(obj).then((res) => {
              if (res.data.code === 0) {
                if (type === 'ORDINARY') {
                  this.confirmText = `确认花费${price}积分抢单？`
                  this.customerCate = 'ORDINARY'
                } else {
                  this.confirmText = `确认花费${price}淘单币抢单？`
                  this.customerCate = 'OPTIMIZATION'
                }
                this.showConfirm = true
              }
              if (res.data.code === -1) {
                if (type === 'ORDINARY') {
                  this.confirmText3 = '您的积分不足，是否立即充值？'
                  this.showConfirm3 = true
                } else {
                  this.confirmText3 = '您的淘单币不足，是否立即充值？'
                  this.showConfirm3 = true
                }
              }
            })
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    buildOrder () {
      this.showConfirm = false
      let obj = {
        customerId: this.customerId
      }
      orderPayApi.builtOrder(obj).then((res) => {
        if (res.data.code === 0) {
          this.statistics('抢单列表-点击抢单', {type: this.customerCate === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: this.customerId})
          this.showConfirm2 = true // 抢单成功
        }
        if (res.data.code === -1) {
          if (res.data.msg === '1') {
            this.confirmText3 = '您的淘单币不足，是否立即充值？'
            this.showConfirm3 = true
          }
          if (res.data.msg === '2') {
            this.confirmText3 = '您的积分不足，是否立即充值？'
            this.showConfirm3 = true
          }
          if (res.data.msg === '3') {
            this.showConfirm4 = true
          }
          if (res.data.msg === '4') {
            this.showConfirm5 = true
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onConfirm () {
      let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'
      if (JSON.parse(status)) {
        if (this.login_status) {
          this.buildOrder()
        } else {
          this.statistics('未关联手机号抢单-确定', {})
          this.$router.push({path: '/correlationMobile'})
        }
      } else {
        if (this.login_status) {
          this.buildOrder()
        } else {
          this.$router.push({path: '/login'})
        }
      }
    },
    onConfirm2 () {
      this.statistics('抢单成功-继续抢单', {type: this.customerCate === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: this.customerId})
      this.showConfirm2 = false
      this.getList()
    },
    onConfirm3 () {
      if (this.confirmText3 === '您的淘单币不足，是否立即充值？') {
        this.statistics('抢单淘单币不足-立即充值', {})
      } else {
        this.statistics('抢单积分不足-立即充值', {})
      }
      this.$router.push('/recharge')
    },
    onConfirm4 () {
      this.statistics('未认证抢单-去认证', {})
      this.$router.push('/certification')
    },
    onConfirm5 () {
      this.statistics('抢单列表-订单已被抢', {})
      this.showConfirm5 = false
    },
    onCancel () {
      this.showConfirm = false
    },
    onCancel2 () {
      this.statistics('抢单成功-立即查看', {type: this.customerCate === 'OPTIMIZATION' ? '优选' : '淘单'})
      this.$router.push({path: '/customer', query: { type: this.customerCate, time: new Date().getTime() }})
      this.getList()
    },
    onCancel3 () {
      if (this.confirmText3 === '您的淘单币不足，是否立即充值？') {
        this.statistics('抢单淘单币不足-取消', {})
      } else {
        this.statistics('抢单积分不足-取消', {})
      }
      this.showConfirm3 = false
    },
    onCancel4 () {
      this.statistics('未认证抢单-取消', {})
      this.showConfirm4 = false
      return false
    },
    onCancel5 () {
      this.statistics('抢单列表-订单已被抢', {})
      this.showConfirm5 = false
    },
    buildSign () {
      bus.$emit('updateLeadStatus')
      signApi.sign().then((res) => {
        if (res.data.code === 0) {
          this.statistics('抢单列表-签到', {})
          this.getSignInStatus() // 同步签到text（签到，已签到）
          this.sign_count = res.data.data.list.length
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
              this.status_1 = true
              break
          }
        }
        this.showQd = true
      }).catch((err) => {
        console.log(err)
      })
    },
    qiandao () {
      let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'
      if (JSON.parse(status)) {
        if (!this.login_status) {
          this.$router.push({path: '/correlationMobile'})
        } else {
          this.buildSign()
        }
      } else {
        if (!this.login_status) {
          this.$router.push({path: '/login'})
        } else {
          this.buildSign()
        }
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
            if (t >= 6 && res.data.data.isSign === false) {
              this.notLastDay = true
            }
            if (res.data.data.isSign) {
              this.sign_text = '已签到'
            }
          }
        })
      }
    },
    getRegisterStatus () {
      if (!this.login_status) {
        let obj = {
          openId: this.user_info.openId ? this.user_info.openId : ''
        }
        registerApi.getRegisterStatus(obj).then((res) => {
          if (res.data.code === 0) {
            if (!res.data.data) {
              Auth.setAuthLoginStatus(false)
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    closeDialog () {
      this.statistics('抢单列表-签到-关闭', {})
      this.showQd = false
    },
    shareAgain () {
      this.statistics('抢单列表-签到-再次分享', {})
      this.showShare = false
      this.mask = true
    },
    closeshowShare () {
      this.statistics('抢单列表-签到-分享-关闭', {})
      this.showShare = false
      this.mask = false
    },
    share () {
      this.statistics('抢单列表-签到-分享', {})
      this.showQd = false
      this.getUserInfo()
      this.initShare()
      this.mask = true
    },
    getUserInfo () {
      ownApi.getUserInfo().then((res) => {
        if (res.data.code === 0) {
          this.ownData = res.data.data
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
  watch: {
    index: {
      handler () {
        this.$refs.scroll.scrollTo(0, 0, 0)
        this.sticky = false
        this.limitQuery.pageNumber = 1
        if (this.index === 0) {
          this.statistics('查看抢单列表', {type: '全部可抢'})
          this.customerType = null
          this.getList()
        } else if (this.index === 1) {
          this.statistics('查看抢单列表', {type: '优选'})
          this.customerType = 'OPTIMIZATION'
          this.getList()
        } else {
          this.statistics('查看抢单列表', {type: '淘单'})
          this.customerType = 'ORDINARY'
          this.getList()
        }
      }
    },
    orderCondition: {
      handler () {
        this.getList()
        this.statistics('抢单筛选', {'type': this.customerType === 'OPTIMIZATION' ? '优选' : '淘单', 'options': this.orderCondition})
      }
    },
    currentCity: {
      handler () {
        this.city = this.currentCity
        this.getList()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.showConfirm = false
    this.showQd = false
    this.showShare = false
    next()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (from.path !== '/filter' && from.path !== '/setcurrentcity' && from.path !== '/' && !new RegExp('orderDetails').test(from.path)) {
        vm.getList()
      }
      if (from.path === '/own' || from.path === '/customer' || from.path === '/certification') {
        bus.$emit('getLeadStatus') // 初次注册时肯定弹出赠送积分时如果关闭弹框会主动显示引导用户
      }
      vm.getSignInStatus() // 获取是否签到
      vm.sticky = false
      vm.mask = false
      /* let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') < 0) {
        vm.height = `${document.body.clientHeight - vm.headerHeight - vm.tabbarHeight}px`
      } */
      setTimeout(() => {
        vm.height = `${document.body.clientHeight - vm.headerHeight - vm.tabbarHeight}px`
      }, 40)
      if (!new RegExp('orderDetails').test(from.path)) { // 保持列表位置
        vm.$refs.scroll.initScroll() // iphoneX微信中初次进来高度大于当底部有导航时，重新初始化scroll组件
      } else {
        setTimeout(() => {
          vm.$refs.scroll.scrollTo(0, vm.positionY, 1)
        }, 40)
      }
      console.log(vm.height)
    })
  },
  activated () {
    this.height = `${document.body.clientHeight - this.headerHeight - this.tabbarHeight}px`
  },
  mounted () {
    bus.$on('getList', () => {
      this.getList()
    })
    if (!Auth.getCurrentCity()) {
      indexApi.getCity().then((res) => {
        if (res.data.code === 0) {
          if (res.data.data !== null) {
            this.city = res.data.data
            this.setCurrentCity(this.city)
            Auth.setCurrentCity(this.city)
          } else {
            this.getCity()
          }
        }
        if (res.data.code === -1) {
          this.getCity()
        }
      })
    } else {
      this.city = Auth.getCurrentCity()
      this.setCurrentCity(this.city)
    }
    this.getRegisterStatus() // 当授权后没注册，删除用户后，重置授权状态
  }
}
</script>

<style lang="less" scoped>
.containaer{
  height: calc(100vh - 100px);
  background-color: #f7f7f7;
  overflow-y: hidden;
  .signIn{
    position: fixed;
    width: 24px;
    padding: 7px 0;
    top: 27%;
    right: 0;
    z-index: 999;
    font-size: 13px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background:linear-gradient(0deg,#59A3FF 0%,#347FFF 100%);
    box-shadow:-1px 0px 10px 0px #347FFF;/* no */
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    img{
      display: inline-block;
      width: 15px;
      margin-top: 5px;
    }
  }
  .banner{
    background: #fff;
    font-size: 0;
  }
  .sticky{
    position: fixed!important;
    width: 100%;
    z-index: 999;
  }
  .tab_nav{
    background: #fff;
    .vux-tab .vux-tab-item{
      font-size: 15px;
    }
    .vux-tab-selected{
      color: #333!important;
      font-weight: 600;
      font-size: 16px!important;
      transition: 500ms
    }
    .tab_nav_box{
      position: relative;
      width: 76%;
      padding-left: 16px;
      box-sizing: border-box;
      .vux-tab-wrap{
        width: 75%;
        .vux-tab-item{
          background: #fff;
          height: 44px;
        }
      }
      .filter{
        position: absolute;
        top: 0;
        right: 0;
        width: 25%;
        height: 44px;
        background: #fff;
        line-height: 44px;
        p{
          text-align: center;
          color: #666;
          font-size: 15px;
          .svg-icon{
            width: 14px;
            height: 14px;
          }
        }
      }
    }
  }
  .tab-swiper{
    .empty_box{
      margin-top: 40px;
      text-align: center;
      .empty{
        width: 110px;
        height: 110px;
      }
      p{
        font-size: 16px;
        text-align: center;
        color: #D8D8D8;
      }
    }
  }
  .wrapper{
    height: calc(100vh - 100px);
  }
}
@-webkit-keyframes rotate {
    0% {
        -webkit-transform:rotate(0deg);
        transform:rotate(0deg);
    }
    100% {
        -webkit-transform:rotate(360deg);
        transform:rotate(360deg);
    }
}
@-webkit-keyframes scale {
    0% {
        -webkit-transform:scale(0);
        transform:scale(0);
    }
    100% {
        -webkit-transform:scale(1);
        transform:scale(1);
    }

}
.flash_box{
  position: absolute;
  left: 50%;
  top: -18%;
  transform: translate(-50%, 0);
  .scale{
    animation: scale 1s ease-in;
    -webkit-animation: scale 1s ease-in;
    .flash{
      background: url('./img/flash.png') no-repeat center center;
      background-size: 100% 100%;
      width: 600px;
      height: 600px;
      z-index: 998;
      border-radius: 50%;
      animation: rotate 10s  infinite  linear;
      -webkit-animation: rotate 10s  infinite  linear;
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
.confirmText{
  text-align: center;
  font-size: 18px;
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

  @media (max-width: 414px) {
    .qd_box{
      .dialog_header{
        .close_qd{
            &::after{
              transform: translate(-50%, 78%);
            }
          }
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
    .qd_box{
      .dialog_header{
        .close_qd{
            &::after{
              transform: translate(-50%, 72%);
            }
          }
      }
    }
    .containaer .signIn{
      img{
        margin-top: 0;
      }
    }
  }
</style>
