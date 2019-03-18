<template>
  <div class="list_box">
    <div class="list_item" v-for="(item, index) in orderData" :key="index" @click="Godetails(item.id, item.type)">
      <div class="list_header">
        <flexbox :gutter="0" v-if="$route.path !== '/customer' && !item.meta">
          <flexbox-item>
            <span v-if="item.gender === '男'" class="name_box">{{item.surname | substring2}}先生</span>
            <span class="name_box" v-else>{{item.surname | substring2}}女士</span>
            <span class="money_box">{{item.loanMoneyStr}}<em>万元</em></span>
            <span class="tag_box" :class="item.type === 'ORDINARY' ? 'tao' : 'you'">{{item.type | transformTypeText}}</span>
          </flexbox-item>
          <flexbox-item :span="3" class="time_box">
            <span>{{item.applyTimeStr ? item.applyTimeStr : item.createTimeStr}}</span>
          </flexbox-item>
        </flexbox>
        <flexbox :gutter="0" v-else-if="$route.path === '/customer' && item.meta">
          <flexbox-item>
            <span v-if="item.meta.gender === '男'" class="name_box">{{item.meta.surname | substring2}}先生</span>
            <span class="name_box" v-else>{{item.meta.surname | substring2}}女士</span>
            <span class="money_box">{{item.meta.loanMoneyStr}}<em>万元</em></span>
            <span class="tag_box" :class="item.type === 'ORDINARY' ? 'tao' : 'you'">{{item.type | transformTypeText}}</span>
          </flexbox-item>
          <flexbox-item :span="3" class="time_box">
            <span>{{item.applyTimeStr ? item.applyTimeStr : item.createTimeStr}}</span>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="list_body">
        <div class="city_order">
          <flexbox :gutter="0" wrap="wrap" align="flex-start">
            <flexbox-item :span="6" v-if="$route.path !== '/customer'">
              <div class="city">
                <svg-icon icon-class="address"></svg-icon>
                <span v-if="$route.path !== '/customer'">{{item.city}}</span>
                <span v-else-if="item.meta">{{item.meta.city}}</span>
              </div>
            </flexbox-item>
            <flexbox-item  v-else>
              <div class="city customer">
                <svg-icon icon-class="address"></svg-icon>
                <span v-if="$route.path !== '/customer'">{{item.city}}</span>
                <span v-else-if="item.meta">{{item.meta.city}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="6" v-if="$route.path !== '/customer' && item.type === 'OPTIMIZATION'">
              <div v-if="$route.path === '/'" class="btn_price">
                <div class="price_box" :class="{noRebate: item.rebate === 10, you: item.type === 'OPTIMIZATION' && item.rebate !== 10}">
                 <span v-if="item.rebate !== 10"> {{item.rebate}}折优惠</span>
                 <span v-else> {{item.price}}{{item.type | transformUnit}}</span>
                </div>
                <button class="button" :class="{noRebate: item.rebate === 10}" @click="order(item.type, item.discountPrice, item.id)" v-if="item.status !== 'SOLD' && item.rebate !== 10">{{item.discountPrice}}{{item.type | transformUnit}}(<em>原价{{item.price}}</em>)</button>
                <button class="button" :class="{noRebate: item.rebate === 10}" @click="order(item.type, item.discountPrice, item.id)" v-if="item.status !== 'SOLD' && item.rebate === 10">立即抢购</button>
                <button class="button2" v-if="item.status === 'SOLD'" @click="stop">已被抢</button>
              </div>
            </flexbox-item>
            <flexbox-item :span="6" v-if="$route.path !== '/customer' && item.type === 'ORDINARY'">
              <div v-if="$route.path === '/'" class="btn_price">
                <div class="price_box tao">
                 <span v-if="item.rebate !== 10"> {{item.rebate}}折优惠</span>
                 <span v-else> {{item.price}}{{item.type | transformUnit}}</span>
                </div>
                <button class="button" @click="order(item.type, item.price, item.id)" v-if="item.status !== 'SOLD'">立即抢购</button>
                <button class="button2" v-if="item.status === 'SOLD'" @click="stop">已被抢</button>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="aptitude_item">
          <flexbox :gutter="0" wrap="wrap" v-if="$route.path !== '/customer'">
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/home.png" alt="房产">
                <span>{{item.house}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/car.png" alt="车产">
                <span>{{item.car}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/baodan.png" alt="保单">
                <span>{{item.policy === "无" ? "无保单" : "有保单"}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                 <img src="./img/card.png" alt="信用卡">
                <span>{{item.creditCard}}信用卡</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/wei.png" alt="微粒贷">
                <span>{{item.weilidai}}微粒贷</span>
              </div>
            </flexbox-item>
          </flexbox>
          <flexbox :gutter="0" wrap="wrap" v-else-if="item.meta">
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/home.png" alt="房产">
                <span>{{item.meta.house}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/car.png" alt="车产">
                <span>{{item.meta.car}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/baodan.png" alt="保单">
                <span>{{item.meta.policy === "无" ? "无保单" : "有保单"}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                 <img src="./img/card.png" alt="信用卡">
                <span>{{item.meta.creditCard}}信用卡</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="12/5">
              <div>
                <img src="./img/wei.png" alt="微粒贷">
                <span>{{item.meta.weilidai}}微粒贷</span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="customer_tools" v-if="$route.path === '/customer'">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item>
              <p v-if="item.remarkType">备注：<span>{{item.remarkType|transformRemark}}{{item.remark | substring20}}</span></p>
            </flexbox-item>
            <flexbox-item :span="4">
              <svg-icon icon-class="beizhuActive" class="remarks" @click.native="showDialog(item.id, item.remark, item.remarkType)" v-if="item.status === 'NORMAL' && item.remarkType !== 'COMPLETE'"></svg-icon>
              <svg-icon icon-class="beizhu" class="remarks" @click.native="stop" v-else></svg-icon>
              <svg-icon icon-class="detailsMobileActive" class="comm" @click.native="call(item.id)" v-if="item.status !== 'UNDERWAY'"></svg-icon>
              <svg-icon icon-class="detailsMobile" class="remarks" @click.native="stop" v-else></svg-icon>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="chargeback_box"  v-if="$route.path === '/customer' && item.status === 'REFUND_SUCCESS'">
          <svg-icon icon-class="had_chargeback"></svg-icon>
        </div>
        <div class="chargeback_box"  v-if="$route.path === '/customer' && item.status === 'REFUND_FAIL'">
          <svg-icon icon-class="chargeback_fail"></svg-icon>
        </div>
        <div class="chargeback_box"  v-if="$route.path === '/customer' && item.remarkType === 'COMPLETE'">
          <svg-icon icon-class="finished"></svg-icon>
        </div>
      </div>
  </div>
</div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'
import Auth from '@/utils/auth'
export default {
  props: {
    orderData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['login_status'])
  },
  methods: {
    Godetails (id, customerType) {
      let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'
      if (JSON.parse(status)) {
        if (this.login_status) {
          let isOrder = this.$route.path
          if (isOrder !== '/customer') {
            this.statistics('抢单-查看客单详情', {type: customerType === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: id})
            this.$router.push({path: `/orderDetails/${id}`})
          } else {
            this.statistics('客户列表-查看客单详情', {type: customerType === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: id})
            this.$router.push({path: `/customerDetails/${id}`})
          }
        } else {
          this.statistics('抢单-微信端查看客单详情-未关联手机号', {})
          this.$router.push({path: '/correlationMobile'})
        }
      } else {
        if (this.login_status) {
          let isOrder = this.$route.path
          if (isOrder !== '/customer') {
            this.statistics('抢单-查看客单详情', {type: customerType === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: id})
            this.$router.push({path: `/orderDetails/${id}`})
          } else {
            this.statistics('客户列表-查看客单详情', {type: customerType === 'OPTIMIZATION' ? '优选' : '淘单', 客单ID: id})
            this.$router.push({path: `/customerDetails/${id}`})
          }
        } else {
          this.statistics('抢单-web端查看客单详情-未登录', {})
          this.$router.push({path: '/login'})
        }
      }
    },
    showDialog (id, remark, remarkType) {
      this.$emit('show', id, remark, remarkType)
      this.statistics('客户列表打开备注', {订单ID: id})
    },
    order (type, price, id) {
      this.$emit('order', type, price, id)
    },
    call (id) {
      this.statistics('客户列表拨打电话', {订单ID: id})
      this.$emit('call', id)
    },
    stop () {
      this.$emit('stop')
    }
  }
}
</script>

<style lang="less" scoped>
.list_box{
  .list_item{
    &:first-child{
       margin-top: 0;
    }
  }
}
.list_item{
  margin-top: 10px;
}

@font-face {
  font-family: 'money';   /*字体名称*/
          src: url('../../assets/font/DIN-Medium.eot') format('embedded-opentype'), /* IE6-IE8 */
              url('../../assets/font/DIN-Medium.woff') format('woff'),
              url('../../assets/font/DIN-Medium.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
              url('../../assets/font/DIN-Medium.svg') format('svg'); /* iOS 4.1- */
  font-weight: normal;
  font-style: normal;
}
.list_header{
  padding: 15px;
  background-color: #fff;
  .name_box{
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }
  .money_box{
    display: inline-block;
    margin-left: 10px;
    color: #F7912F;
    font-size: 24px;
    font-family: money;
    em{
      font-style: normal;
      font-size: 12px;
    }
  }
  .tag_box{
    display: inline-block;
    width: 35px;
    height: 19px;
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
  .time_box{
    font-size: 14px;
    color: #9B9B9B;
    text-align: center;
  }
}
.list_body{
  position: relative;
  padding: 5px 15px 10px;
  background-color: #fff;
  .city_order{
    width: 100%;
    .vux-flexbox-item{
      box-sizing: border-box;
      overflow: hidden;
      &:last-child{
        .btn_price{
          position: relative;
          text-align: right;
          padding:0 5px 8px 0;
          .price_box{
            position: absolute;
            width: 57px;
            top: 0;
            right: 2px;
            line-height: 20px;
            text-align: center;
            color: #fff;
            font-size: 12px;
            border-radius: 10px;
            border-bottom-left-radius: 0;
            &.tao{
              background:linear-gradient(90deg,#9FE048 0%,#55B72B 100%);
              box-shadow:1px 1px 4px 0px #9FE048;/* no */
            }
            &.you{
              background:linear-gradient(90deg,#F9C755 0%,#F77925 100%);
              box-shadow:1px 1px 4px 0px #F9C755;/* no */
            }
            &.noRebate{
              background:linear-gradient(312deg,rgba(222,182,118,1) 0%,rgba(227,206,156,1) 100%);
            }
          }
          .button{
            display: inline-block;
            margin: 0;
            margin-top: 14px;
            width: 80%;
            height: 30px;
            border: none;
            outline: none;
            color: #fff;
            font-size: 14px;
            line-height: 30px;
            background:linear-gradient(90deg,#59A3FF 0%,#347FFF 100%);
            box-shadow:1px 2px 10px 0px #95C3FF;/* no */
            border-radius:20px; /* no */
            &.noRebate{
              background:linear-gradient(322deg,rgba(107,127,175,1) 0%,rgba(163,184,234,1) 100%);
              box-shadow:1px 2px 10px 0px rgba(163,184,234,1);/* no */
            }
            em{
              text-decoration:line-through;
              font-style: normal;
              line-height: 30px;
            }
          }
          .button2{
            display: inline-block;
            margin: 0;
            margin-top: 14px;
            width: 80%;
            height: 30px;
            border: none;
            outline: none;
            color: #fff;
            font-size: 14px;
            line-height: 30px;
            background:rgba(216,216,216,1);
            box-shadow:0px 3px 4px 0px rgba(206,206,206,0.5); /* no */
            border-radius:20px; /* no */
            em{
              text-decoration:line-through;
              font-style: normal;
              line-height: 30px;
            }
          }
        }
      }
      .city{
        display: inline-block;
        background: #eff3fd;
        padding: 0 5px;
        line-height: 22px;
        border-radius: 5px;
        color: #1859E1;
        font-size: 12px;
        &.customer{
          margin-bottom: 16px;
        }
        .svg-icon{
          width: 16px;
          height: 16px;
          color: #D3DAE4;
          vertical-align: middle;
          margin-top: -3px;
        }
      }
    }
  }
  .aptitude_item{
    padding: 0 3px;
    box-sizing: border-box;
    .vux-flexbox-item{
      text-align: center;
      font-size: 13px;
      img{
        display: block;
        margin: 0 auto;
      }
      span{
        display: block;
        margin-top: 5px;
      }
      &:first-child{
        img{
          width: 20px;
          height: 18px;
        }
      }
      &:nth-child(2){
        img{
          width: 21px;
          height: 17px;
        }
      }
      &:nth-child(3){
        img{
          width: 17px;
          height: 19px;
        }
      }
      &:nth-child(4){
        img{
          width: 19px;
          height: 16px;
        }
      }
      &:last-child{
        img{
          width: 21px;
          height: 16px;
        }
      }
    }
  }
  .customer_tools{
    margin-top: 10px;
    .svg-icon.remarks{
      display: inline-block;
      width: 50px;
      height: 50px;
    }
    .svg-icon.comm{
      display: inline-block;
      width: 50px;
      height: 50px;
    }
    p{
      padding-left: 5px;
      color: #9B9B9B;
    }
  }
  .chargeback_box{
    position: absolute;
    top: -30px;
    right: 15px;
    .svg-icon{
      width: 79px;
      height: 70px;
    }
  }
}
</style>
