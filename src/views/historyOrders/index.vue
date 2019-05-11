<template>
  <scroll ref="scroll" class="wrapper"
        :data="orderData"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        @pullingDown="onPullingDown2"
        @pullingUp="onPullingUp2">
        <div class="empty_box" v-if="empty">
          <img src="./img/empty.png">
          <p>这里好冷清，毛都没有</p>
        </div>
        <div>
          <list-card :orderData="orderData" @show="show" @call="call" @stop="stop"></list-card>
          <div v-transfer-dom>
            <x-dialog v-model="confirmDialog" :hide-on-blur="true"  :dialog-style="{'max-width': '100%', width: '90%', 'background-color': 'transparent'}">
                <div class="confirm_box">
                  <a href="javascript:;" class="close_box" @click="close">
                    <img src="./img/close.png">
                  </a>
                  <h2>已退订单和已抢订单超过1个月会<br>移动到这里哦~</h2>
                  <div class="confirm_btn_box">
                    <div class="confirm_item">
                      <button class="btn" @click="confirm">我知道了</button>
                    </div>
                  </div>
                </div>
            </x-dialog>

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
  </scroll>
</template>

<script>
import ListCard from '@/components/listCard'
import customerApi from '@/api/customer'
import leadApi from '@/api/lead'
import { Flexbox, FlexboxItem, XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    ListCard,
    XDialog,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      showDialog: false,
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
      orderId: null,
      empty: false,
      confirmDialog: false,
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
        /* {
          label: '空号',
          val: 'SPACENUMBER',
          active: false
        }, */
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
      tip: '',
      set_color: false,
      text_num: 0
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
    },
    headerHeight () {
      return localStorage.getItem('headerHeight') ? localStorage.getItem('headerHeight') : ''
    }
  },
  methods: {
    close () {
      this.updataStatus()
    },
    confirm () {
      this.updataStatus()
    },
    show (id, remark, remarkType) {
      console.log(id, remark, remarkType)
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
    getStatus () {
      let obj = {
        type: 'ORDER_HISTORY'
      }
      leadApi.leadStatus(obj).then((res) => {
        if (res.data.code === 0) {
          this.confirmDialog = !res.data.data
        }
      })
    },
    updataStatus () {
      let obj = {
        type: 'ORDER_HISTORY'
      }
      leadApi.updateLeadStatus(obj).then((res) => {
        if (res.data.code === 0) {
          this.confirmDialog = false
        }
      })
    },
    getList () {
      this.limitQuery.pageNumber = 1
      let obj = {
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      this.$vux.loading.show({
        text: '加载中...'
      })
      customerApi.getHistoryList(obj).then((res) => {
        if (res.data.code === 0) {
          this.orderData = res.data.data.elements
          this.$vux.loading.hide()
          if (this.orderData.length === 0) {
            this.empty = true
          } else {
            this.empty = false
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onPullingDown2 () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = {
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      customerApi.getHistoryList(obj).then((res) => {
        // console.log(res)
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
    onPullingUp2 () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = {
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      customerApi.getHistoryList(obj).then((res) => {
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
    }
  },
  mounted () {
    this.getList()
    this.getStatus()
    // this.height = `${document.body.clientHeight - this.headerHeight}px`
  }
}
</script>

<style lang="less" scoped>
  .wrapper{
    height: calc(100vh - 46px);
  }
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
  .confirm_box{
    position: relative;
    background-color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    text-align: left;
    border-radius: 3px;
    overflow: hidden;
    .close_box{
      position: absolute;
      top:0;
      right: 0;
      width: 45px;
      height: 45px;
      text-align: center;
      img{
        margin-top: 15px;
        display: inline-block;
        width: 11px;
        height: 15px;
      }
    }
    h2{
      margin-bottom: 15px;
      margin-top: 70px;
      font-size: 16px;
      color: #333333;
      text-align: center;
      font-weight: 600;
    }
    .confirm_btn_box{
      margin-top: 47px;
      overflow: hidden;
      padding-bottom: 30px;
      .confirm_item{
        width: 100%;
        float: left;
        button{
          width: 100%;
          margin: 0 auto;
          display: block;
          border: none;
          outline: none;
          line-height: 40px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          background:linear-gradient(90deg,#52AFF9 0%,rgba(31,124,240,1) 100%);
          border-radius: 4px;
        }
      }
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
