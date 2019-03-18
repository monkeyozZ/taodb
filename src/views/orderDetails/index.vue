<template>
<div style="background: #F8F9F9;">
  <svg-icon icon-class="orderDetailsTop" class="top_bg"></svg-icon>
  <scroll ref="scroll" class="detailsWrapper" :style="{height: height}">
    <div class="details_box" v-waves>
      <div class="base_info_box">
        <ul>
          <li>
            <p>
              <span class="name_box">
                <span v-if="orderData.gender === '男'">{{orderData.surname | substring2}}先生</span>
                <span v-else>{{orderData.surname | substring2}}女士</span>
              </span>
              <span class="money"><em>{{orderData.loanMoneyStr}}</em>万元</span>
              <span class="tag_box" :class="orderData.type === 'ORDINARY' ? 'tao' : 'you'">{{orderData.type | transformTypeText}}</span>
              <span class="time">{{orderData.longApplyTime | transformDate}}</span>
            </p>
            <p class="detail_info">
              <span>
                <svg-icon icon-class="address"></svg-icon>
                {{orderData.city}}
              </span>
              <span>
                <svg-icon icon-class="age"></svg-icon>
                {{orderData.age}}岁
              </span>
            </p>
          </li>
          <li class="mobile_tip_box">
            <div class="mobile_box">
              <flexbox :gutter="0" wrap="wrap">
                <flexbox-item :span="8">
                    <p class="tip">备注：抢单后可沟通</p>
                </flexbox-item>
                <flexbox-item :span="4">
                  <svg-icon icon-class="beizhu"></svg-icon>
                  <svg-icon icon-class="detailsMobile"></svg-icon>
                </flexbox-item>
              </flexbox>
            </div>
          </li>
        </ul>
      </div>

      <div class="base_info_list">
        <h2 class="title">
          基本信息
        </h2>
        <ul class="item_box">
          <li>
            <p>性别<span>{{orderData.gender}}</span></p>
          </li>
          <!-- <li>
            <p>职业<span>{{orderData.occupation}}</span></p>
          </li> -->
          <li>
            <p>社保<span>{{orderData.socialSecurity}}</span></p>
          </li>
          <li>
            <p>公积金<span>{{orderData.providentFund}}</span></p>
          </li>
        </ul>
      </div>

      <div class="asset_info_list">
        <h2 class="title">
          资产信息
        </h2>
        <ul class="item_box">
          <li>
            <p>信用卡<span>{{orderData.creditCard}}</span></p>
          </li>
          <li>
            <p>微粒贷<span>{{orderData.weilidai}}</span></p>
          </li>
          <li>
            <p>名下房产<span>{{orderData.house}}</span></p>
          </li>
          <li>
            <p>名下车产<span>{{orderData.car}}</span></p>
          </li>
          <li>
            <p>个人保险<span>{{orderData.policy}}</span></p>
          </li>
        </ul>
      </div>
    </div>
    <div v-transfer-dom>
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
  <div class="button_box" ref="button_box">
    <button class="button" :disabled="orderData.status === 'SOLD'" @click="order(orderData.type, orderData.discountPrice, orderData.id)">{{orderData.status === 'SOLD'?'已被抢' : '立即抢单'}}</button>
  </div>
</div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton, Confirm, TransferDomDirective as TransferDom } from 'vux'
import detailsApi from '@/api/details'
import orderPayApi from '@/api/orderPay'
import bus from '@/utils/eventBus'
import ownApi from '@/api/own'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    Confirm
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      showConfirm: false,
      showConfirm2: false,
      showConfirm3: false,
      showConfirm4: false,
      showConfirm5: false,
      confirmText: '',
      confirmText3: '',
      orderData: {},
      customerId: '',
      customerCate: '',
      height: ''
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    }
  },
  methods: {
    getdata () {
      let obj = {
        id: this.id
      }
      detailsApi.getOrderDetails(obj).then((res) => {
        if (res.data.code === 0) {
          this.orderData = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    order (type, price, id) {
      this.customerId = id
      this.checkOrder(type, price)
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
          this.statistics('客户详情-点击抢单', {type: this.customerCate === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: this.customerId})
          this.showConfirm2 = true
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
      this.buildOrder()
    },
    onConfirm2 () {
      this.statistics('客单详情抢单成功-立即查看', {type: this.customerCate === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: this.customerId})
      this.showConfirm2 = false
      this.$router.push('/')
      bus.$emit('getList')
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
      this.statistics('客单详情抢单-未认证-去认证', {})
      this.$router.push('/certification')
    },
    onConfirm5 () {
      this.statistics('客单详情抢单-订单已被抢', {})
      this.showConfirm5 = false
    },
    onCancel () {
      this.showConfirm = false
    },
    onCancel2 () {
      this.statistics('客单详情抢单成功-取消', {})
      this.$router.push({path: '/customer', query: { type: this.customerCate, time: new Date().getTime() }})
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
      this.statistics('客单详情抢单-未认证-取消', {})
      this.showConfirm4 = false
    },
    onCancel5 () {
      this.statistics('客单详情抢单-订单已被抢', {})
      this.showConfirm5 = false
    }
  },
  mounted () {
    this.getdata()
    this.height = `${document.body.clientHeight - this.headerHeight - this.$refs.button_box.offsetHeight}px`
    bus.$emit('changeHideOverLeftStatus', false)
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
.svg-icon.top_bg{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 157px;
}
.detailsWrapper{
  width: 92%;
  margin: 0 auto;
}
  .details_box{
    background: #F8F9F9;
    border-radius: 7px 7px;
    .base_info_box{
      padding: 15px 15px 0 15px;
      overflow: hidden;
      background: #fff;
      border-radius: 7px;
      margin-bottom: 10px;
      ul{
        li{
          list-style: none;
          &:not(:last-child){
            margin-bottom: 10px;
          }
          p{
            font-size: 16px;
            line-height: 23px;
            .name_box{
              color: #333;
              font-weight: 600;
              line-height: 25px;
              .svg-icon{
                  font-size: 16px;
                }
            }
            .money{
              color: #F7912F;
              margin-left: 10px;
              font-family: money;
              font-size: 12px;
              em{
                font-style: normal;
                font-size: 24px;
              }
            }
            .tag_box{
              display: inline-block;
              width: 35px;
              height: 19px;
              line-height: 19px;
              margin-left: 10px;
              text-align: center;
              font-size: 12px;
              color: #fff;
              border-radius: 4px;
              &.tao{
                background:linear-gradient(90deg,#9FE048 0%,#55B72B 100%);
                box-shadow:1px 1px 4px 0px #9FE048;/* no */
              }
              &.you{
                background:linear-gradient(90deg,#F9C755 0%,#F77925 100%);
                box-shadow:1px 1px 4px 0px #F9C755;/* no */
              }
            }
          }
          .time{
            margin-left: 10px;
            font-size: 12px;
            color: #9b9b9b;
            line-height: 18px;
          }
          .detail_info{
            margin-top: 20px;
            font-size: 12px;
            line-height: 18px;
            color: #999999;
            span{
              background:rgba(239,243,253,1);
              border-radius:4px;
              color: #1859E1;
              font-size: 12px;
              padding:2px 3px;
              &:not(:first-child){
                margin-left: 10px
              }
            }
          }
          &.mobile_tip_box{
            background: #fff;
            .mobile_box{
              .vux-flexbox-item{
                &:first-child{
                  text-align: left
                }
                &:last-child{
                  text-align: right;
                }
              }
              .tip{
                font-size: 13px;
                line-height: 18px;
                color: #9B9B9B;
                line-height: 50px;
              }
              .svg-icon{
                width: 50px;
                height: 50px;
              }
            }
            .tip_box{
              margin-top: 30px;
              p{
                font-size: 12px;
                color: #666666;
                line-height: 18px;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
    .base_info_list,.asset_info_list{
      overflow: hidden;
      background: #fff;
      padding: 15px 15px 0 15px;
      margin-bottom: 8px;
      border-radius: 7px;
      .title{
        padding-bottom: 15px;
        font-size: 16px;
        line-height: 20px;
        color: #333;
        font-weight: 600;
        border-bottom:1px solid #EEEEEE;
      }
      .item_box{
        li{
          padding: 17px 0;
          list-style: none;
          font-size: 14px;
          color: #666666;
          font-weight: 500;
          &:not(:last-child){
            border-bottom:1px solid #EEEEEE;
          }
          p{
            text-align: left;
            span{
              float: right;
              margin-right: 4px;
            }
          }
        }
      }
    }
    .asset_info_list{
      margin-bottom: 0;
    }
  }
  .confirmText{
    text-align: center;
    font-size: 18px;
  }
  .button_box{
      position: fixed;
      width: 100%;
      left: 0;
      bottom: 0px;
      background: #fff;
      overflow: hidden;
      z-index: 999;
      padding: 8px 0;
      .button{
        margin: 0 auto;
        display: block;
        width: 91.5%;
        height: 45px;
        border: none;
        outline: none;
        color: #fff;
        font-size: 18px;
        line-height: 45px;
        background:linear-gradient(151deg,rgba(66,179,249,1) 0%,rgba(31,124,240,1) 100%);
        border-radius:4px; /* no */
      }
      button[disabled="disabled"]{
         background: #d8d8d8
      }
    }
</style>
