<template>
  <div class="header" ref="header" :class="{resetBg: isDetails}">
    <x-header :left-options="{showBack: false,backText: ''}">
      <span class="title">{{headerText?headerText:'淘单宝'}}</span>
      <div slot="overwrite-left" class="back" @click="GoBack" v-if="$route.path !== '/' && $route.path !== '/customer' && $route.path !== '/own' && $route.path !== '/error' && this.hideOverLeft !== true">
        <svg-icon icon-class="back"></svg-icon>
      </div>
      <div slot="overwrite-left" class="city" v-if="$route.path === '/'">
          <router-link :to="{ path: '/setcurrentcity', query: { 'currentCity': currentCity } }">
            <span v-if="currentCity">{{currentCity | substring4}}</span>
            <span v-else>定位中<spinner type="dots" :size="'16px'"></spinner></span>
          </router-link>
        <svg-icon icon-class="xia"></svg-icon>
      </div>
      <div class="news_box" slot="overwrite-left" v-if="$route.path === '/own'">
        <router-link to="/news" @click.native="statistics('点击查看消息', {})">
          <img src="./img/news.png" class="icon">
          <span class="red_dot" :class="{active: ownData.unReadCount ? (ownData.unReadCount !== 0 ? true : false) : false}"></span>
        </router-link>
      </div>
      <a slot="right" href="javascript:;" :style="{color: rightText.color}" @click="handClick" v-if="$route.path !== '/own'">{{rightText.text}}</a>
      <router-link to="/set" slot="right" @click.native="statistics('点击设置', {})" v-else><img src="./img/set.png"></router-link>
    </x-header>
  </div>
</template>

<script>
import { XHeader, Spinner } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import newsApi from '@/api/news'
import bus from '@/utils/eventBus'
export default {
  components: {
    XHeader,
    Spinner
  },
  data () {
    return {
      options: {
        showBack: false,
        backText: ''
      },
      title: this.$route.meta.title ? this.$route.meta.title : '',
      hideOverLeft: false,
      ownData: {},
      isDetails: false
    }
  },
  computed: {
    ...mapGetters(['headerText', 'rightText', 'newsType', 'currentCity'])
  },
  methods: {
    ...mapActions({
      setCity: 'setCity',
      setAllReadyStatus: 'setAllReadyStatus'
    }),
    resetTopBg () {
      if (new RegExp('orderDetails').test(this.$route.path) || new RegExp('customerDetails').test(this.$route.path) || new RegExp('chargebackDetails').test(this.$route.path)) {
        this.isDetails = true
      } else {
        this.isDetails = false
      }
    },
    GoBack () {
      if (this.$route.path === '/city') {
        this.setCity([])
        history.back(-1)
        return false
      }
      if (this.$route.path === '/filter') {
        bus.$emit('back')
        return false
      }
      if (this.$route.path === '/certification') {
        document.activeElement.blur() // 部分安卓手机在键盘未关闭时返回导致页面高度变小
        setTimeout(() => {
          this.$router.push('/own')
        }, 200)
        return false
      }
      if (this.$route.path === '/set') {
        this.$router.push('/own')
        return false
      }
      if (this.$route.path === '/recharge') {
        this.$router.push('/own')
        return false
      }
      if (new RegExp('chargebackDetails').test(this.$route.path)) {
        document.activeElement.blur() // 部分安卓手机在键盘未关闭时返回导致页面高度变小
        history.back(-1)
      }
      history.back(-1)
    },
    handClick () {
      if (this.$route.path === '/city') {
        bus.$emit('setFilterCity')
        this.$router.push('/filter')
      }
      if (this.$route.path === '/news') {
        let obj = {
          type: this.newsType
        }
        this.statistics('消息-全部已读', {})
        newsApi.allReady(obj).then((res) => {
          if (res.data.code === 0) {
            let newsObj = {
              status: this.newsType,
              val: true
            }
            this.setAllReadyStatus(newsObj)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    changeHideOverLeftStatus (status) {
      this.hideOverLeft = status
    },
    setOwnData (obj) {
      this.ownData = obj
    }
  },
  watch: {
    '$route': {
      handler () {
        this.resetTopBg()
      }
    }
  },
  mounted () {
    this.resetTopBg()
    bus.$on('changeHideOverLeftStatus', (status) => {
      this.changeHideOverLeftStatus(status)
    })
    bus.$on('setOwnData', (obj) => {
      this.setOwnData(obj)
    })
    setTimeout(() => {
      localStorage.setItem('headerHeight', JSON.stringify(this.$refs.header.offsetHeight))
    }, 20)
  }
}
</script>

<style lang="less" scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 998;
  &.resetBg{
    .vux-header{
      background-color: #1859e1;
      .title{
        color: #FFFFFF;
        font-size: 18px;
      }
      .back{
        .svg-icon{
          color: #ffffff;
        }
      }
    }
  }
  .vux-header{
    background-color: #fff;
    height: 44px;
    .title{
      color: #333333;
      font-size: 18px;
    }
    .back{
      width: 30px;
      height: 30px;
      .svg-icon{
        color: #444444;
      }
    }
    .city{
      a{
        font-size: 16px;
        color: #333333;
        margin-right: 4px;
      }
      .svg-icon{
        width: 9px;
        height: 6px;
        color: #333333;
        vertical-align: baseline;
      }
    }
    .news_box{
      position: relative;
      .red_dot{
        position: absolute;
        top: 0px;
        right: 5px;
        display: block;
        width: 6px;/* no */
        height: 6px;/* no */
        border-radius: 50%;
        &.active{
          background: #FF0700;
          box-shadow:0px 0px 8px 1px #FF0700;/* no */
          animation: breath 2s ease-in-out 0s infinite;
        }
      }
    }
    .vux-header-right,.vux-header-left{
      img{
        width: 21px;
      }
    }
  }
}
@keyframes breath {
    from { opacity: 0.3; }                          /* 动画开始时的不透明度 */
    50%  { opacity:   1; }                          /* 动画50% 时的不透明度 */
    to   { opacity: 0.3; }                          /* 动画结束时的不透明度 */
}
@media (max-width: 320px) {
  .vux-header{
    .news_box{
      .red_dot{
        width: 5px;
        height: 5px;
        &.active{
          background: #FF0700;
          box-shadow:0px 0px 5px 1px #FF0700;/* no */
        }
      }
    }
  }
}
</style>
