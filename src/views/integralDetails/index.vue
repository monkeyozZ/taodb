<template>
  <div class="integral">
    <div class="title" ref="title">
      <flexbox :gutter="0">
        <flexbox-item :span="4">时间</flexbox-item>
        <flexbox-item :span="4">积分数</flexbox-item>
        <flexbox-item :span="4">来源</flexbox-item>
      </flexbox>
    </div>
    <scroll ref="scroll" class="wrapper"
                  :style="{height: height}"
                  :data="datailsData"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp">
      <div class="content_list">
        <ul v-if="datailsData.length !== 0">
          <li v-for="(item, index) in datailsData" :key="index">
            <flexbox :gutter="0">
              <flexbox-item :span="4">
                <p>{{item.time | transformDateYear}}</p>
                <p>{{item.time | transformDateDay}}</p>
              </flexbox-item>
              <flexbox-item :span="4">{{item.flow === 'PAY' ? '' : '+' }}{{item.score}}</flexbox-item>
              <flexbox-item :span="4">
                <p>{{item.sourceType}}</p>
              </flexbox-item>
            </flexbox>
          </li>
        </ul>
      </div>
    </scroll>
    <div class="empty_box" v-if="datailsData.length === 0">
      <svg-icon icon-class="empty" class="empty"></svg-icon>
      <p>暂无记录</p>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import ownApi from '@/api/own'
export default {
  components: {
    Flexbox,
    FlexboxItem
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
  data () {
    return {
      datailsData: [],
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
      height: ''
    }
  },
  methods: {
    getDetails () {
      let obj = {
        type: 'INTEGRAL',
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      this.$vux.loading.show({// 开启loading
        text: '加载中...'
      })
      ownApi.financialDetails(obj).then((res) => {
        if (res.data.code === 0) {
          this.datailsData = res.data.data.elements
          this.$vux.loading.hide()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onPullingDown () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = {
        type: 'INTEGRAL',
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      ownApi.financialDetails(obj).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.datailsData = res.data.data.elements
        } else {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingUp () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = {
        type: 'INTEGRAL',
        pageSize: this.limitQuery.pageSize,
        pageNumber: this.limitQuery.pageNumber
      }
      this.statistics('积分明细-加载更多', {pageNumber: this.limitQuery.pageNumber})
      ownApi.financialDetails(obj).then((res) => {
        if (res.data.code === 0) {
          res.data.data.elements.map((item) => {
            this.datailsData = this.datailsData.concat(item)
          })
        }
        if (res.data.data.elements.length === 0) {
          this.limitQuery.pageNumber -= 1
          this.$refs.scroll.forceUpdate()
        }
      })
    }
  },
  mounted () {
    this.getDetails()
    setTimeout(() => {
      this.height = `${document.body.clientHeight - this.headerHeight - this.$refs.title.offsetHeight}px`
    }, 40)
  }
}
</script>

<style lang="less" scoped>
.integral{
  .title{
    padding-top: 11px;
    line-height: 25px;
    .vux-flexbox-item{
      font-size: 16px;
      color: #333;
      text-align: center;
      font-weight: 600;
    }
  }
  .wrapper{
    /* height: calc(100vh - 83px); */
  }
  .content_list{
    position: relative;
    ul{
      li{
        padding: 12px 0 4px;
        font-size: 12px;
        border-bottom: 1px solid #EFEDED;
        box-sizing: border-box;
        .vux-flexbox-item{
          color: #333;
          text-align: center;
        }
      }
    }
  }
  .empty_box{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -70%);
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
</style>
