<template>
  <div class="containaer" :style="{height: height}">
    <div class="tab_nav" ref="tab_nav">
      <div class="tab_nav_box">
        <div class="filter_time" @click="filterTime">
          <p>抢单时间<svg-icon :icon-class="status"></svg-icon></p>
        </div>
        <tab :line-width=5 active-color='#1F7CF0' :custom-bar-width="'32px'" v-model="index" :scroll-threshold="5">
            <tab-item class="vux-center" :selected="selected === item" v-for="(item, index) in list" @click="selected = item" :key="index">{{item}}</tab-item>
        </tab>
        <div class="filter" @click="routeTo">
          <p>筛选<svg-icon icon-class="filter"></svg-icon></p>
        </div>
      </div>
    </div>

      <swiper v-model="index" :show-dots="false" :threshold="150" height="100%">
        <swiper-item>
          <div class="tab-swiper vux-center">
            <scroll ref="scroll1" class="wrapper"
                  :style="{height: height2}"
                  :data="orderData"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingDown="onPullingDown1"
                  @pullingUp="onPullingUp1">
                  <div class="empty_box" v-if="orderData.length === 0">
                    <svg-icon icon-class="empty" class="empty"></svg-icon>
                    <p>暂无客户！</p>
                    <button class="order_btn" @click="goOrder" v-if="Object.keys(customerCondition).length === 0">去抢单</button>
                  </div>
                <list-card :orderData="orderData" @show="show" @call="call" @stop="stop"></list-card>
            </scroll>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="tab-swiper vux-center">
            <scroll ref="scroll2" class="wrapper"
                  :style="{height: height2}"
                  :data="orderData"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingDown="onPullingDown2"
                  @pullingUp="onPullingUp2">
                  <div class="empty_box" v-if="orderData.length === 0">
                    <svg-icon icon-class="empty" class="empty"></svg-icon>
                    <p>暂无客户！</p>
                    <button class="order_btn" @click="goOrder" v-if="Object.keys(customerCondition).length === 0">去抢单</button>
                  </div>
                <list-card :orderData="orderData" @show="show" @call="call" @stop="stop"></list-card>
            </scroll>
          </div>
        </swiper-item>
      </swiper>
  <div v-transfer-dom>
    <x-dialog v-model="showDialog" :dialog-style="{'max-width': '90.6666%', width: '100%', 'background-color': 'transparent'}">
        <div class="beizhu_box">
          <div class="beizhu_header">
            <p>添加备注</p>
          </div>
          <div class="item_box">
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item :span="4" v-for="(item, index) in itemArr" :key="index">
                <div>
                  <input :class="{active: item.active}" type="button" :value="item.label" @click="selectedtag(item)">
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
  </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'
import ListCard from '@/components/listCard'
import customerApi from '@/api/customer'
// import bus from '@/utils/eventBus'
export default {
  name: 'customer',
  components: {
    Flexbox,
    FlexboxItem,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    ListCard,
    XDialog
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      showDialog: false,
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
      list: ['优选', '淘单'],
      selected: '优选',
      status: 'down',
      index: 0,
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
        pageSize: 10,
        pageNumber: 1
      },
      customerType: 'OPTIMIZATION',
      orderId: null,
      timeSort: -1,
      height: '',
      height2: '',
      changeTime: '',
      remarkType: '',
      remarkTypeText: ''
    }
  },
  computed: {
    type () {
      return this.$route.query.type
    },
    time () {
      return this.$route.query.time
    },
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
    ...mapGetters(['customerCondition']),
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    },
    tabbarHeight () {
      return localStorage.getItem('tabbarHeight') ? localStorage.getItem('tabbarHeight') : ''
    }
  },
  methods: {
    selectedTab () {
      if (this.type === 'ORDINARY') {
        this.$nextTick(() => {
          this.index = 1
          this.changeTime = this.time
        })
      } else {
        this.$nextTick(() => {
          this.index = 0
          this.changeTime = this.time
        })
      }
    },
    goOrder () {
      this.$router.push('/')
    },
    routeTo () {
      this.$router.push('/filter')
    },
    filterTime () {
      if (this.status === 'down') { // 倒序转正序
        this.statistics('我的客户-抢单排序', {排序方向: '升序', type: this.customerType === 'OPTIMIZATION' ? '优选' : '淘单'})
        this.timeSort = 1
        this.getList()
        this.status = 'up'
      } else {
        this.statistics('我的客户-抢单排序', {排序方向: '降序', type: this.customerType === 'OPTIMIZATION' ? '优选' : '淘单'})
        this.timeSort = -1
        this.getList()
        this.status = 'down'
      }
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
      let obj = this.copy(this.customerCondition)
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      obj.timeSort = this.timeSort
      this.$vux.loading.show({
        text: '加载中...'
      })
      customerApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          this.orderData = res.data.data.elements
          this.$vux.loading.hide()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onPullingDown1 () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = this.copy(this.customerCondition)
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      obj.timeSort = this.timeSort
      customerApi.getlist(obj).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.orderData = res.data.data.elements
        } else {
          this.$refs.scroll1.forceUpdate()
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll1.forceUpdate()
        }
      })
    },
    onPullingDown2 () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = this.copy(this.customerCondition)
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      obj.timeSort = this.timeSort
      customerApi.getlist(obj).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.orderData = res.data.data.elements
        } else {
          this.$refs.scroll2.forceUpdate()
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll2.forceUpdate()
        }
      })
    },
    onPullingUp1 () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = this.copy(this.customerCondition)
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      obj.timeSort = this.timeSort
      customerApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data.elements.length !== 0) {
            res.data.data.elements.map((item) => {
              this.orderData = this.orderData.concat(item)
            })
          } else {
            this.limitQuery.pageNumber -= 1
            this.$refs.scroll1.forceUpdate()
          }
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll1.forceUpdate()
        }
      })
    },
    onPullingUp2 () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = this.copy(this.customerCondition)
      obj.customerType = this.customerType
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      obj.timeSort = this.timeSort
      customerApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data.elements.length !== 0) {
            res.data.data.elements.map((item) => {
              this.orderData = this.orderData.concat(item)
            })
          } else {
            this.limitQuery.pageNumber -= 1
            this.$refs.scroll2.forceUpdate()
          }
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll2.forceUpdate()
        }
      })
    },
    show (id, remark, remarkType) {
      this.orderId = id
      if (remarkType) {
        this.tip = remark
        this.itemArr.forEach((item) => {
          if (remarkType === item.val) {
            item.active = true
            this.remarkType = item.val
          } else {
            item.active = false
          }
        })
      } else {
        this.itemArr.forEach((item) => {
          item.active = false
        })
      }
      this.showDialog = true
      window.event.stopPropagation()
    },
    closeDialog () {
      this.statistics('客户列表取消备注', {订单ID: this.orderId})
      this.showDialog = false
      this.tip = ''
    },
    selectedtag (item) {
      this.itemArr.forEach(function (item) {
        item.active = false
      })
      item.active = true
      this.remarkType = item.val
      this.remarkTypeText = item.label
    },
    filterEmoji () {
      this.tip.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')
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
      this.statistics('客户列表添加备注', {订单ID: this.orderId, 备注内容: {类型: this.remarkTypeText, 内容: this.tip}})
      customerApi.setTag(obj).then((res) => {
        if (res.data.code === 0) {
          this.getList()
          this.showDialog = false
          this.tip = ''
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    call (id) {
      let obj = {
        orderId: id
      }
      customerApi.getTel(obj).then((res) => {
        if (res.data.code === 0) {
          window.location.href = `tel:\\${res.data.data}`
          // console.log(window.open(`tel://${res.data.data}`))
        }
      }).catch((err) => {
        console.log(err)
      })
      window.event.stopPropagation()
    },
    stop () {
      window.event.stopPropagation()
    },
    scrollTOBottom () {
      window.scrollTo(0, 0)
    }
  },
  watch: {
    changeTime: {
      handler () {
        if (this.index === 0) {
          this.customerType = 'OPTIMIZATION'
          this.getList()
        } else if (this.index === 1) {
          this.customerType = 'ORDINARY'
          this.getList()
        }
      }
    },
    index: {
      handler () {
        if (this.index === 0) {
          this.statistics('查看客户列表', {type: '优选'})
          this.customerType = 'OPTIMIZATION'
          this.getList()
        } else if (this.index === 1) {
          this.statistics('查看客户列表', {type: '淘单'})
          this.customerType = 'ORDINARY'
          this.getList()
        }
      }
    },
    customerCondition: {
      handler () {
        this.getList()
        this.statistics('我的客户筛选', {'type': this.customerType === 'OPTIMIZATION' ? '优选' : '淘单', 'options': this.customerCondition})
      }
    },
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
  beforeRouteLeave (to, from, next) {
    this.showDialog = false
    next()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (from.path === '/' || new RegExp('orderDetails').test(from.path)) {
        vm.selectedTab()
      }
      if (new RegExp('customerDetails').test(from.path)) {
        vm.getList()
      }
    })
  },
  mounted () {
    if (!this.type) {
      this.getList()
    }
    /* bus.$on('headerHeight', (h) => {
      this.headerHeight = h
    })
    bus.$on('tabbarHeight', (h) => {
      this.tabbarHeight = h
    }) */
    setTimeout(() => {
      this.height = `${document.body.clientHeight - this.headerHeight - this.tabbarHeight}px`
      this.height2 = `${document.body.clientHeight - this.headerHeight - this.tabbarHeight - this.$refs.tab_nav.offsetHeight - parseInt(window.getComputedStyle(this.$refs.tab_nav, null)['marginBottom'])}px`
    }, 20)
  }
}
</script>

<style lang="less" scoped>
.containaer{
  /* height: calc(100vh - 100px); */
  background-color: #f7f7f7;
  overflow-y: hidden;
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
      width: 86%;
      padding-left: 16px;
      box-sizing: border-box;
      .vux-tab-wrap{
        width: 45%;
        margin: 0 auto;
        .vux-tab-item{
          background: #fff;
          height: 44px;
        }
      }
      .filter,.filter_time{
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
            margin-left: 2px;
            width: 14px;
            height: 14px;
          }
        }
      }
      .filter_time{
        left: 16px;
      }
    }
  }
  .tab-swiper{
    .empty_box{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -75%);
      .empty{
        width: 110px;
        height: 110px;
      }
      p{
        font-size: 16px;
        text-align: center;
        color: #D8D8D8;
      }
      .order_btn{
        display: block;
        margin-top: 10px;
        width: 100%;
        border: none;
        outline: none;
        line-height: 30px;
        color: #fff;
        text-align: center;
        font-size: 16px;
        background:linear-gradient(151deg,rgba(66,179,249,1) 0%,rgba(31,124,240,1) 100%);
        border-radius:4px;
      }
    }
  }
  .wrapper{
    position: relative;
    /* height: calc(100vh - 148px); */
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
.close{
  margin-top: 20px;
  fill:#fff;
  width: 40px;
  height: 40px;
  font-size: 40px;
}
</style>
