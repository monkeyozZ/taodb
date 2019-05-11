<template>
  <div>
    <div class="tab_nav" ref="tab_nav">
      <div class="tab_nav_box">
        <tab :line-width="5" active-color='#2D78FF' :custom-bar-width="getBarWidth" v-model="index">
            <tab-item class="vux-center"  v-for="(item, index) in list" @click="selected = item" :key="index">{{item}}</tab-item>
        </tab>
      </div>
    </div>
    <scroll ref="scroll" class="wrapper"
          :data="Data"
          :style="{height: height}"
          :pullDownRefresh="pullDownRefreshObj"
          :pullUpLoad="pullUpLoadObj"
          @pullingDown="onPullingDown"
          @pullingUp="onPullingUp">

          <div class="coupon_list">
            <div class="empty_box" v-if="empty">
                <img src="./img/empty.png">
                <p>这里好冷清，毛都没有</p>
              </div>
            <ul v-if="hidden">
              <li :class="index === 0 ? '' : (index ===1 ? 'had_used' : 'past_due')" v-for="(item, i) in Data" :key="i">
                <div class="left">
                  <h1>{{item.cashBack}}<span>元</span></h1>
                  <p>{{item.title}}</p>
                </div>
                <div class="right">
                  <h2>{{item.remark}}</h2>
                  <p :class="isUrgency(item.longEndTime) ? 'urgency' : ''">{{item.longEndTime | transformDate}}到期</p>
                </div>
                <div class="grab_btn" v-if="index === 0">
                  <router-link :to="{path: '/recharge', query: { couponId: item.id }}" class="use" @click.native="statistics('我的优惠券-未使用列表-点击去使用', {id: item.id})">去使用</router-link>
                </div>
              </li>
            </ul>
            <p v-if="index === 0&&hidden&&Data.length !== 0" class="tip">注意：快捷支付未完成时，优惠券会锁定5分钟，在此时间内优惠券不会显示，5分钟后将重新显示，您可以正常使用。</p>
          </div>
    </scroll>
  </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import couponApi from '@/api/coupon'
export default {
  components: {
    Tab,
    TabItem
  },
  data () {
    return {
      list: ['未使用', '已使用', '已过期'],
      index: 0,
      getBarWidth: function (index) {
        let w = document.body.clientWidth
        if (w < 375) {
          return 58 + 'px'
        } else {
          return 80 + 'px'
        }
      },
      couponCategory: 'UNUSED',
      pullDownRefresh: true,
      pullDownRefreshTxt: '刷新成功',
      pullDownRefreshThreshold: 65,
      pullDownRefreshStop: 40,
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      pullUpLoadMoreTxt: '数据加载中',
      pullUpLoadNoMoreTxt: '我是有底线的',
      limitQuery: {
        pageSize: 10,
        pageNumber: 1
      },
      height: '',
      Data: [],
      empty: false,
      hidden: false
    }
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
    }
  },
  methods: {
    getList () {
      this.limitQuery.pageNumber = 1 // 重置页码
      let obj = {
        status: this.couponCategory,
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      couponApi.myCoupon(obj).then((res) => {
        if (res.data.code === 0) {
          this.hidden = true
          this.Data = res.data.data.elements
          if (res.data.data.elements.length === 0) {
            this.empty = true
          } else {
            this.empty = false
          }
        }
      })
    },
    onPullingDown () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = {
        status: this.couponCategory,
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      couponApi.myCoupon(obj).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.Data = res.data.data.elements
        } else {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingUp () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = {
        status: this.couponCategory,
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      couponApi.myCoupon(obj).then((res) => {
        if (res.data.code === 0) {
          res.data.data.elements.map((item) => {
            this.Data = this.Data.concat(item)
          })
        }
        if (res.data.data.elements.length === 0) {
          this.limitQuery.pageNumber -= 1
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    isUrgency (endTime) {
      if (this.index === 0) {
        let timeNum = (endTime - (new Date()).getTime()) / 1000
        return timeNum <= (86400 * 2)
      }
    }
  },
  watch: {
    index: {
      handler () {
        this.hidden = false
        this.$refs.scroll.scrollTo(0, 0, 0)
        switch (this.index) {
          case 0: this.couponCategory = 'UNUSED'; this.statistics('我的优惠券-点击未使用', {})
            break
          case 1: this.couponCategory = 'USED'; this.statistics('我的优惠券-点击已使用', {})
            break
          case 2: this.couponCategory = 'OVERDUE'; this.statistics('我的优惠券-点击已过期', {})
            break
          default:this.couponCategory = 'UNUSED'
            break
        }
        this.getList()
      }
    },
    Data: {
      handler () {
        if (this.couponCategory === 'UNUSED') {
          this.list[0] = `未使用(${this.Data.length})`
        } else {
          this.list[0] = '未使用'
        }
        if (this.couponCategory === 'USED') {
          this.list[1] = `已使用(${this.Data.length})`
        } else {
          this.list[1] = '已使用'
        }
        if (this.couponCategory === 'OVERDUE') {
          this.list[2] = `已过期(${this.Data.length})`
        } else {
          this.list[2] = '已过期'
        }
      }
    }
  },
  mounted () {
    this.getList()
    document.title = this.$route.meta.title
    setTimeout(() => {
      this.height = `${document.body.clientHeight - this.$refs.tab_nav.offsetHeight}px`
    }, 20)
  }
}
</script>

<style lang="less" scoped>
    .wrapper{
      background: #EFEFF4;
    }
    .tab_nav{
    background: #F7F7F7;
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
      box-sizing: border-box;
      .vux-tab-wrap{
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

  .coupon_list{
    box-sizing: border-box;
    padding:0 4px;
    .empty_box{
      width: 228px;
      overflow: hidden;
      text-align: center;
      margin:0 auto;
      padding-top: 120px;
      img{
        display: inline-block;
        max-width: 100%;
        width: 100%;
        height: auto;
      }
      p{
        color: '#C8C8C8';
        font-size: 12px;
      }
    }
    .tip{
      padding :15px;
      color: #999;
    }
    ul{
      overflow: hidden;
      padding-top: 6px;
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
        &.had_used{
          background: url(./img/had_used_coupon_bg.png) no-repeat center center;
          background-size: cover;
        }
        &.past_due{
          background: url(./img/past_due.png) no-repeat center center;
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
            &.urgency{
              color: #FC3358;
            }
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

  @media (max-width: 320px) {
    .coupon_list ul li .right{
      padding-left: 10px;
    }
    .coupon_list ul li .right p{
      transform: scale(0.8);
      margin-left: -14px;
    }
  }
</style>
