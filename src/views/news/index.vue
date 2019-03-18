<template>
  <div class="news_box" :style="{height: height}">
    <div ref="tab_nav">
      <tab :line-width=2 active-color='#1F7CF0' v-model="index" :scroll-threshold="5">
        <tab-item class="vux-center" :selected="selected === item" v-for="(item, index) in list" @click="selected = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>

    <swiper v-model="index" :show-dots="false" :threshold="150" height="100%">
        <swiper-item>
          <div class="tab-swiper vux-center">
            <scroll ref="scroll1" class="wrapper"
                  :style="{height: height2}"
                  :data="newsData"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingDown="onPullingDown1"
                  @pullingUp="onPullingUp1">
                <ul class="news_list" v-if="newsData.length !== 0">
                  <li :class="{hasready: item.view}" v-for="(item, index) in newsData" :key="index" @click="goDetails(item.id)">
                    <h2 class="title">{{item.title}}</h2>
                    <p class="time"><span>{{item.time | transformDate2}}</span></p>
                    <p class="des">{{item.content | substring}}</p>
                    <a href="javascript:;">查看详情</a>
                  </li>
                </ul>
                <div class="empty_box" v-else>
                  <svg-icon icon-class="empty" class="empty"></svg-icon>
                  <p>暂无消息</p>
                </div>
            </scroll>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="tab-swiper vux-center">
            <scroll ref="scroll2" class="wrapper"
                  :style="{height: height2}"
                  :data="newsData"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingDown="onPullingDown2"
                  @pullingUp="onPullingUp2">
                <ul class="news_list" v-if="newsData.length !== 0">
                  <li :class="{hasready: item.view}" v-for="(item, index) in newsData" :key="index" @click="goDetails(item.id)">
                    <h2 class="title">{{item.title}}</h2>
                    <p class="time"><span>{{item.time | transformDate2}}</span></p>
                    <p class="des" v-html="$options.filters.substring(item.content)"></p>
                    <a href="javascript:;">查看详情</a>
                  </li>
                </ul>
                <div class="empty_box" v-else>
                  <svg-icon icon-class="empty" class="empty"></svg-icon>
                  <p>暂无消息</p>
                </div>
            </scroll>
          </div>
        </swiper-item>
      </swiper>
  </div>
</template>

<script>
import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import newsApi from '@/api/news'
export default {
  name: 'news',
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem
  },
  data () {
    return {
      index: 0,
      selected: '用户消息',
      list: ['用户消息', '系统消息'],
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
      type: 'PERSONAL',
      newsData: [],
      height: '',
      height2: ''
    }
  },
  computed: {
    ...mapGetters(['personalAllReadyStatus', 'systemAllReadyStatus']),
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
    ...mapActions({
      setNewsType: 'setNewsType',
      setAllReadyStatus: 'setAllReadyStatus'
    }),
    goDetails (id) {
      if (this.index === 0) {
        this.statistics('查看消息详情', {消息ID: id, type: '用户消息'})
      } else {
        this.statistics('查看消息详情', {消息ID: id, type: '系统消息'})
      }
      this.$router.push({path: `/newsDetails/${id}`})
    },
    getList () {
      let obj = {}
      obj.type = this.type
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      this.$vux.loading.show({
        text: '加载中...'
      })
      newsApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          this.newsData = res.data.data.elements
          this.$vux.loading.hide()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onPullingDown1 () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = {}
      obj.type = this.type
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      newsApi.getlist(obj).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.newsData = res.data.data.elements
        } else {
          this.$refs.scroll1.forceUpdate()
        }
      })
    },
    onPullingDown2 () { // 下拉刷新
      this.limitQuery.pageNumber = 1
      let obj = {}
      obj.type = this.type
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      newsApi.getlist(obj).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.newsData = res.data.data.elements
        } else {
          this.$refs.scroll2.forceUpdate()
        }
      })
    },
    onPullingUp1 () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = {}
      obj.type = this.type
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      newsApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          res.data.data.elements.map((item) => {
            this.newsData = this.newsData.concat(item)
          })
        }
        if (res.data.data.elements.length === 0) {
          this.limitQuery.pageNumber -= 1
          this.$refs.scroll1.forceUpdate()
        }
      })
    },
    onPullingUp2 () { // 上拉加载
      // 更新数据
      this.limitQuery.pageNumber += 1
      let obj = {}
      obj.type = this.type
      obj.pageSize = this.limitQuery.pageSize
      obj.pageNumber = this.limitQuery.pageNumber
      newsApi.getlist(obj).then((res) => {
        if (res.data.code === 0) {
          res.data.data.elements.map((item) => {
            this.newsData = this.newsData.concat(item)
          })
        }
        if (res.data.data.elements.length === 0) {
          this.limitQuery.pageNumber -= 1
          this.$refs.scroll2.forceUpdate()
        }
      })
    }
  },
  watch: {
    index: {
      handler () {
        this.limitQuery.pageNumber = 1
        if (this.index === 0) {
          this.statistics('查看用户消息', {})
          this.type = 'PERSONAL'
          this.setNewsType(this.type)
          let newsObj = {
            status: this.type,
            val: false
          }
          this.setAllReadyStatus(newsObj)
          this.getList()
        } else if (this.index === 1) {
          this.statistics('查看系统消息', {})
          this.type = 'SYSTEM'
          this.setNewsType(this.type)
          let newsObj = {
            status: this.type,
            val: false
          }
          this.setAllReadyStatus(newsObj)
          this.getList()
        }
      }
    },
    personalAllReadyStatus: {
      handler () {
        if (this.personalAllReadyStatus) {
          this.getList()
        }
      }
    },
    systemAllReadyStatus: {
      handler () {
        if (this.systemAllReadyStatus) {
          this.getList()
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.getList()
    })
  },
  mounted () {
    this.getList()
    setTimeout(() => {
      this.height = `${document.body.clientHeight - this.headerHeight}px`
      this.height2 = `${document.body.clientHeight - this.headerHeight - this.$refs.tab_nav.offsetHeight}px`
    }, 40)
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  /* height: calc(100vh - 90px); */
}
.news_box{
  /* height: calc(100vh - 47px); */
  overflow-y: hidden;
  .news_list{
    overflow: hidden;
    li{
      padding: 15px;
      box-sizing: border-box;
      color: #333;
      list-style: none;
      border-bottom: 1px solid #EFEDED;
      .title{
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:600;
        line-height:22px;
      }
      .time{
        margin-top: 3px;
        font-size: 12px;
        color: #666;
        line-height:14px;
        span{
          transform: scale(0.85);
        }
      }
      .des{
        word-break: break-all;
        word-wrap: break-word;
        margin: 15px 0 10px;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
      }
      a{
        font-size: 12px;
        color: #1F7CF0;
      }
    }
    .hasready{
      color: #999;
      .time{
        color: #999;
      }
      a{
        color: #999;
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
</style>
