<template>
<div style="background: #F8F9F9;">
  <svg-icon icon-class="orderDetailsTop" class="top_bg"></svg-icon>
  <scroll ref="scroll" class="customerDetailsWrapper" :style="{height: height}">
    <div class="term_box" v-if="!closeTerm">
      <p>话术：您好！您刚刚在借云网上平台进行了贷款申请，我是与您对接的业务经理，方便核对一下信息吗？</p>
      <svg-icon icon-class="termClose" @click.native="closeTerm = true"></svg-icon>
    </div>
    <div class="details_box">
      <div class="base_info_box">
        <ul>
          <li>
            <p>
              <span class="name_box">
                <span v-if="customerDataDetails.gender === '男'">{{customerDataDetails.surname | substring2}}先生</span>
                <span v-else>{{customerDataDetails.surname | substring2}}女士</span>
              </span>
              <span class="money"><em>{{customerDataDetails.loanMoneyStr}}</em>万元</span>
              <span class="tag_box" :class="customerDataDetails.type === 'ORDINARY' ? 'tao' : 'you'">{{customerDataDetails.type | transformTypeText}}</span>
              <span class="time">{{customerData.longCreateTime | transformDate}}</span>
            </p>
            <p class="detail_info">
              <span>
                <svg-icon icon-class="address"></svg-icon>
                {{customerDataDetails.city}}
              </span>
              <span>
                <svg-icon icon-class="age"></svg-icon>
                {{customerDataDetails.age}}岁
              </span>
            </p>
          </li>
          <li class="mobile_tip_box">
            <div class="mobile_box">
                <div class="icon_box">
                  <svg-icon icon-class="beizhuActive" @click.native="showDialog(customerData.id, customerData.remark)" v-if="!beizhuDisable"></svg-icon>
                  <svg-icon icon-class="beizhu" v-else></svg-icon>
                  <svg-icon icon-class="detailsMobileActive" @click.native="call(customerData.id)" v-if="!mobileDisable"></svg-icon>
                  <svg-icon icon-class="detailsMobile" v-else></svg-icon>
                </div>
                <div>
                  <div class="tip_box">
                    <p class="mark_text" id="mark_text" :class="{active: hide}" :style="{'max-height': markHeight}">
                    备注：<span>{{remarkTypeText}}{{customerData.remark ? `，${customerData.remark}` : ''}}</span>
                    </p>
                    <a href="javascript:;" style="color:#4192FF"  @touchstart="start()" @touchend.stop.prevent="showAndHide()" v-if="hasDetails">{{!this.hide ? '点击查看更多' : '点击收起'}}></a>
                  </div>
                </div>
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
            <p>性别<span>{{customerDataDetails.gender}}</span></p>
          </li>
          <!-- <li>
            <p>职业<span>{{customerDataDetails.occupation}}</span></p>
          </li> -->
          <li>
            <p>社保<span>{{customerDataDetails.socialSecurity}}</span></p>
          </li>
          <li>
            <p>公积金<span>{{customerDataDetails.providentFund}}</span></p>
          </li>
        </ul>
      </div>

      <div class="asset_info_list">
        <h2 class="title">
          资产信息
        </h2>
        <ul class="item_box">
          <li>
            <p>信用卡<span>{{customerDataDetails.creditCard}}</span></p>
          </li>
          <li>
            <p>微粒贷<span>{{customerDataDetails.weilidai}}</span></p>
          </li>
          <li>
            <p>名下房产<span>{{customerDataDetails.house}}</span></p>
          </li>
          <li>
            <p>名下车产<span>{{customerDataDetails.car}}</span></p>
          </li>
          <li>
            <p>个人保险<span>{{customerDataDetails.policy}}</span></p>
          </li>
        </ul>
      </div>
      <div v-transfer-dom>
          <x-dialog v-model="show" :dialog-style="{'max-width': '90.6666%', width: '100%', 'background-color': 'transparent'}">
              <div class="beizhu_box">
                <div class="beizhu_header">
                  <p>添加备注</p>
                </div>
                <div class="item_box">
                  <flexbox :gutter="0" wrap="wrap">
                    <flexbox-item :span="4" v-for="(item, index) in itemArr" :key="index">
                      <div>
                        <input :class="{active: item.active}" type="button" :value="item.label" @click="selected(item)">
                      </div>
                    </flexbox-item>
                  </flexbox>
                </div>
                <div class="beizhu_body">
                  <p style="font-size:12px;color:#666666;text-align:left;">备注内容</p>
                  <textarea v-model="tip" rows="3" maxlength="200" placeholder="请写额外要备注的信息" @keyup="filterEmoji" @blur="scrollTOBottom"></textarea>
                  <p :class="{set_color: set_color, font_num: true}">{{text_num}}/200个字</p>
                </div>
                <button class="confirm_btn" @click="settag">完成</button>
              </div>
              <x-icon type="ios-close-outline" class="close" @click.native="closeDialog"></x-icon>
          </x-dialog>
          <x-dialog v-model="showResult" :dialog-style="{'max-width': '100%', width: '90.6%', 'background-color': 'transparent'}">
              <div class="result_box">
                <div class="result_header">
                  <p>{{result_title}}</p>
                </div>
                <div class="result_body">
                  <p>{{result_text}}</p>
                </div>
                <button class="confirm_btn" @click="closeSuccessDialog">我知道了</button>
              </div>
          </x-dialog>
      </div>
    </div>
  </scroll>

  <div class="button_box" v-if="customerDataDetails.type === 'OPTIMIZATION'">
    <button class="button" :class="{success: issuccess, fail: isfail}" :disabled="isdisabled" @click="goChargebackDetails(customerData.id)">{{btn_text}}</button>
  </div>
  <div class="button_box" v-if="customerDataDetails.type !== 'OPTIMIZATION' && customerData.remarkType === 'COMPLETE'">
    <button class="button" :class="{success: issuccess, fail: isfail}" :disabled="isdisabled">{{btn_text}}</button>
  </div>
</div>
</template>

<script>
import { Flexbox, FlexboxItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
import detailsApi from '@/api/details'
import customerApi from '@/api/customer'
import bus from '@/utils/eventBus'
export default {
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    XDialog
  },
  data () {
    return {
      show: false,
      tip: '',
      text_num: 0,
      set_color: false,
      itemArr: [
        {
          label: '秒挂',
          val: 'HANGUP',
          active: false
        },
        {
          label: '已成交',
          val: 'COMPLETE',
          active: false
        },
        {
          label: '空号',
          val: 'SPACENUMBER',
          active: false
        },
        {
          label: '待跟进',
          val: 'FOLLOWUP',
          active: false
        },
        {
          label: '无意愿',
          val: 'NOINTENTION',
          active: false
        },
        {
          label: '未接通',
          val: 'UNCONNECTED',
          active: false
        }],
      customerData: {},
      customerDataDetails: {},
      orderId: null,
      height: '',
      remarkType: '',
      remarkTypeText: '',
      btn_text: '退单',
      beizhuDisable: false,
      mobileDisable: false,
      closeTerm: false,
      isdisabled: false,
      issuccess: false,
      isfail: false,
      showResult: false,
      result_title: '',
      result_text: '',
      hide: false,
      markHeight: '100%',
      hasDetails: true,
      buttonBoxHeight: 60
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
        orderId: this.id
      }
      detailsApi.getCustomerDetails(obj).then((res) => {
        if (res.data.code === 0) {
          this.resizeHeight() // 显示备注内容时调整高度
          this.customerData = res.data.data
          this.customerDataDetails = res.data.data.meta
          if (res.data.data.meta.type !== 'OPTIMIZATION') {
            this.isdisabled = true
            if (res.data.data.remarkType === 'COMPLETE') {
              this.height = `${document.body.clientHeight - this.headerHeight - this.buttonBoxHeight}px`
            } else {
              this.height = `${document.body.clientHeight - this.headerHeight}px`
            }
          } else {
            this.height = `${document.body.clientHeight - this.headerHeight - this.buttonBoxHeight}px`
          }
          if (res.data.data.status === 'UNDERWAY') {
            this.isdisabled = true
            this.btn_text = '退单审核中'
            this.beizhuDisable = true
            this.mobileDisable = true
          } else if (res.data.data.status === 'REFUND_SUCCESS') {
            this.isdisabled = true
            this.btn_text = '已退单'
            this.beizhuDisable = true
            this.mobileDisable = false
          } else if (res.data.data.status === 'REFUND_FAIL') {
            this.isdisabled = true
            this.isfail = true
            this.btn_text = '退单失败'
            this.beizhuDisable = true
            this.mobileDisable = false
            this.result_title = '退单失败'
            this.result_text = res.data.data.failReason
            this.showResult = true
          } else if (res.data.data.status === 'NORMAL') {
            if (res.data.data.remarkType === 'COMPLETE') {
              this.isdisabled = true
              this.issuccess = true
              this.beizhuDisable = true
              this.mobileDisable = false
              this.btn_text = '已成交'
            }
          }
          setTimeout(() => {
            this.$refs.scroll.initScroll()
          }, 20)
          this.itemArr.forEach((item) => {
            if (res.data.data.remarkType === item.val) {
              item.active = true
              this.remarkType = item.val
              this.remarkTypeText = item.label
            }
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    showDialog (id, remark) {
      this.orderId = id
      if (remark) {
        this.tip = remark
      }
      this.show = true
    },
    closeDialog () {
      this.show = false
      this.tip = ''
    },
    selected (item) {
      this.itemArr.forEach(function (item) {
        item.active = false
      })
      item.active = true
      this.remarkType = item.val
    },
    call (id) {
      let obj = {
        orderId: id
      }
      customerApi.getTel(obj).then((res) => {
        if (res.data.code === 0) {
          window.location.href = `tel://${res.data.data}`
        }
      }).catch((err) => {
        console.log(err)
      })
      window.event.stopPropagation()
    },
    settag () {
      if (!this.remarkType) {
        this.$vux.toast.text('请选择备注类型', 'middle')
        return false
      }
      let obj = {
        orderId: this.orderId,
        remarkType: this.remarkType,
        remark: this.tip
      }
      customerApi.setTag(obj).then((res) => {
        if (res.data.code === 0) {
          this.getdata()
          this.show = false
          this.tip = ''
          this.scrollTOBottom()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    filterEmoji () {
      this.tip.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
    },
    scrollTOBottom () {
      window.scrollTo(0, 0)
    },
    goChargebackDetails (id) {
      if (this.customerDataDetails.type === 'OPTIMIZATION') { // 由于页面上退单按钮在淘单详情没有移除，只设置了disabled属性，防止懂技术的钻空子
        this.statistics('订单详情-点击退单', {订单ID: id})
        this.$router.push(`/chargebackDetails/${id}`)
      }
    },
    closeSuccessDialog () {
      this.showResult = false
    },
    start () {
    },
    showAndHide () {
      if (!this.hide) {
        this.hide = true
        this.markHeight = '100%'
      } else {
        this.hide = false
        this.markHeight = '40px'
      }
    },
    resizeHeight () {
      setTimeout(() => {
        let h = document.getElementById('mark_text').firstElementChild.offsetHeight
        console.log(h)
        if (h > 40) {
          this.markHeight = '40px'
          this.hasDetails = true
        } else {
          this.hasDetails = false
        }
      }, 100)
    }
  },
  watch: {
    tip: {
      handler () {
        this.text_num = this.tip.length
        if (this.tip.length === 200) {
          this.set_color = true
        } else {
          this.set_color = false
        }
      }
    }
  },
  mounted () {
    this.getdata()
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
  .term_box{
    position: absolute;
    width: 100%;
    top: 8px;
    background: #BACDF6;
    padding: 3px 15px;
    p{
      float: left;
      width: 84.6%;
    }
    .svg-icon{
      margin-top: 3px;
      margin-left: 12px;
    }
  }
  .details_box{
    width: 92%;
    margin: 0 auto;
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
              .icon_box{
                float: right;
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
              padding-top: 17px;
              padding-bottom: 15px;
              p.mark_text{
                font-size: 12px;
                color: #666666;
                line-height: 20px;/* no */
                font-weight: 500;
                word-break: break-all;
                word-wrap: break-word;
                max-height: 40px;/* no */
                height: 100%;
                overflow: hidden;
                &.active{
                  max-height: 100%;
                  height: 100%;
                  overflow: visible;
                }
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
  .beizhu_box{
    width: 100%;
    overflow: hidden;
    background: #fff;
    border-radius: 13px;
    .beizhu_header{
      p{
        font-size: 18px;
        margin: 26px auto;
        text-align: center;
        color: #333;
        font-weight: 600;
      }
    }
    .beizhu_body{
      padding: 0 15px;
      font-size: 0;
      .label_text{
        font-size: 14px;
        color: #333;
        text-align: left;
      }
      textarea{
        width: 100%;
        height: 142px;
        margin-top: 8px;
        resize:none;
        border: 1px solid #eee;
        border-bottom: none;
        background: #F8F8F8;
        outline: none;
        padding:4px 8px;
        box-sizing: border-box;
        font-size: 14px;
        -webkit-appearance: none;
      }
      .font_num{
        text-align: right;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
        background: #F8F8F8;
        border: 1px solid #eee;
        border-top: none;
        padding: 0 13px 6px 0;
      }
      .set_color{
        color: #f44336;
      }
    }
    .item_box{
      padding: 8px 0px 0;
      margin: 0 15px;
      box-sizing: border-box;
      border-top: 1px solid #DDDDDD;
      border-bottom: 1px solid #DDDDDD;
      .vux-flexbox-item{
        text-align: center;
        margin-bottom: 8px;
        >div{
          width: 85%
        }
        &:nth-child(1),&:nth-child(4){
          text-align: left;
          >div{
            margin-left: 0;
          }
        }
        &:nth-child(2),&:nth-child(5){
          >div{
            margin: 0 auto;
          }
        }
        &:nth-child(3),&:nth-child(6){
          text-align: right;
          >div{
            display: inline-block;
            margin-right: 0;
          }
        }
        input[type="button"]{
          width: 100%;
          height: 34px;
          line-height: 34px;
          text-align: center;
          color: #9B9B9B;
          font-size: 14px;
          background:#fff;
          border-radius:5px;
          border:1px solid rgba(236,236,236,1);
          outline: none;
          -webkit-appearance: none;
          &.active{
            border: 1px solid #fff;
            color: #FF7B00;
            background: url('./img/active.png') no-repeat center center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .confirm_btn{
      display: block;
      width: 72.6%;
      margin: 50px auto 32px auto;
      border: none;
      outline: none;
      line-height: 40px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      background:linear-gradient(154deg,rgba(98,192,251,1) 0%,rgba(51,140,245,1) 100%);
      box-shadow:0px 2px 4px 0px rgba(206,234,255,1);
      border-radius:4px; /* no */
    }
  }
  .result_box{
    overflow: hidden;
    background: #fff;
    border-radius: 13px;
    padding: 17px 18px 47px;
    .result_header{
      p{
        padding-bottom: 24px;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 42px;
        text-align: center;
        color: #666666;
        border-bottom: 1px solid #dddddd;
      }
    }
    .result_body{
      max-height: 120px;
      overflow-y: auto;
      p{
        word-break: break-all;
        word-wrap: break-word;
        font-size: 14px;
        color: #333;
        font-weight: 400;
        line-height: 20px;
      }
    }
    .confirm_btn{
      display: block;
      width: 73%;
      margin: 33px auto 10px auto;
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
  .close{
    margin-top: 20px;
    fill:#fff;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }
  .button_box{
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0px;
    background: #fff;
    overflow: hidden;
    z-index: 999;
    padding: 8px 0;/* no */
    .button{
      margin: 0 auto;
      display: block;
      width: 91.5%;
      height: 44px;/* no */
      border: none;
      outline: none;
      color: #fff;
      font-size: 18px;
      line-height: 44px;/* no */
      background:linear-gradient(151deg,rgba(66,179,249,1) 0%,rgba(31,124,240,1) 100%);
      border-radius:4px; /* no */
      &:disabled{
        background: #C8C8C8;
      }
      &.success{
        background: #108EE9;
      }
      &.fail{
        background: #E84747;
      }
    }
  }
    @media (max-width: 320px) {
      .term_box{
        top: 5px;
        padding: 3px;
        p{
          width: 90%;
          font-size: 12px;
        }
      }
    }
</style>
