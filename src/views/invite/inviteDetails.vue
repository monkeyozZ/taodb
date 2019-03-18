<template>
<div class="wrapper">
    <div class="tab_box" ref="tab_box">
      <flexbox :gutter="0" class="tab_item_box">
        <flexbox-item :span="6">
          <div class="item">
            <p><spinner type="lines" v-if="creditCount.length !==0 ? false : true"></spinner>{{creditCount}}</p>
            <p>已认证</p>
          </div>
        </flexbox-item>
         <flexbox-item :span="6">
           <div class="item">
              <p><spinner type="lines" v-if="rechargeCount.length !==0 ? false : true"></spinner>{{rechargeCount}}</p>
              <p>已首充</p>
           </div>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="list_box">
      <div class="item_title_box" ref="title">
        <flexbox :gutter="0">
          <flexbox-item :span="4">
            <p>好友</p>
          </flexbox-item>
          <flexbox-item :span="4">
            <p>认证时间</p>
          </flexbox-item>
          <flexbox-item :span="4">
            <p>首充金额(元)</p>
          </flexbox-item>
        </flexbox>
      </div>

      <div class="item_body_box">
        <scroll ref="scroll"
                  :style="{height: height}"
                  :data="inviteData"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp">
                <ul v-if="inviteData.length !== 0">
                  <li v-for="(item, index) in inviteData" :key="index">
                    <flexbox :gutter="0" >
                      <flexbox-item :span="4">
                        <p>{{item.mobile}}</p>
                      </flexbox-item>
                      <flexbox-item :span="4">
                        <p>{{item.creditTime}}</p>
                      </flexbox-item>
                      <flexbox-item :span="4">
                        <p>{{item.rechargeMoney}}</p>
                      </flexbox-item>
                    </flexbox>
                  </li>
                </ul>
                <div class="empty_box" v-else>
                  <svg-icon icon-class="empty" class="empty"></svg-icon>
                  <p>暂无记录</p>
                </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Spinner } from 'vux'
import shareApi from '@/api/share'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Spinner
  },
  data () {
    return {
      creditCount: '',
      rechargeCount: '',
      inviteData: [],
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
      height: ''
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
    getInviteStatistics () {
      shareApi.inviteStatistics().then((res) => {
        if (res.data.code === 0) {
          this.creditCount = res.data.data.creditCount
          this.rechargeCount = res.data.data.rechargeCount
        }
      })
    },
    getList () {
      let obj = {
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      shareApi.inviteStatisticsDetails(obj).then((res) => {
        if (res.data.code === 0) {
          this.inviteData = res.data.data.elements
        } else {
          this.$refs.scroll.forceUpdate()
        }
      }).catch((err) => {
        if (err) {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingDown () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = {
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      shareApi.inviteStatisticsDetails(obj).then((res) => {
        if (res.data.code === 0) {
          this.inviteData = res.data.data.elements
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
      let obj = {
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      this.statistics('邀请明细-加载更多', {pageNumber: this.limitQuery.pageNumber})
      shareApi.inviteStatisticsDetails(obj).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data.elements.length !== 0) {
            res.data.data.elements.map((item) => {
              this.inviteData = this.inviteData.concat(item)
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
    this.getInviteStatistics()
    this.getList()
    this.height = `${document.body.clientHeight - this.$refs.tab_box.offsetHeight - this.$refs.title.offsetHeight}px`
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
  background: #F5F5F5;
  .tab_box{
    padding: 15px 8px;
    .vux-flexbox-item{
      &:first-child{
        .item{
          background: url('./img/had_invite.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
      &:last-child{
        .item{
          background: url('./img/had_recharge.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .item{
        height: 90px;
        margin: 0 8px;
        padding-top: 15px;
        box-sizing: border-box;
        p{
          text-align: center;
          color: #fff;
          &:first-child{
            font-size: 26px;
            font-family: number;
          }
          &:last-child{
            font-size: 14px;
          }
        }
      }
    }
  }
  .list_box{
    background: #fff;
    padding: 0 9px;
    box-sizing: border-box;
    .item_title_box{
      padding: 14px 0;
      border-bottom: 1px solid #EEEEEE;
      .vux-flexbox-item{
        p{
          text-align: center;
          color: #333333;
          font-size: 16px;
          font-weight:500;
        }
      }
    }
    .item_body_box{
      ul{
        li{
          .vux-flexbox-item{
            border-bottom: 1px solid #EEEEEE;
            p{
              padding: 14px 0;
              text-align: center;
              color: #5C5C5C;
              font-size: 14px;
              font-weight:500;
            }
          }
        }
      }
      .empty_box{
        padding-top: 40px;
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
  }
}
</style>
