<template>
  <div class="footer" :style="{bottom: bottom}">
    <tabbar>
      <tabbar-item :selected="$route.path === '/'" link="/" v-waves @on-item-click="myStatisticsOrder">
        <img slot="icon" src="./img/order.png" v-if="$route.path !== '/'">
        <img slot="icon" src="./img/selectedOrder.png" v-if="$route.path === '/'">
          <span slot="label">抢单</span>
      </tabbar-item>
      <tabbar-item :selected="$route.path === '/customer'" link="/customer" v-waves @on-item-click="myStatisticsCustomer">
        <img slot="icon" src="./img/customer.png" v-if="$route.path !== '/customer'">
        <img slot="icon" src="./img/selectedCustomer.png" v-if="$route.path === '/customer'">
        <span slot="label">客户</span>
      </tabbar-item>
      <tabbar-item :selected="$route.path === '/own'" link="/own" v-waves @on-item-click="myStatisticsOwn">
        <img slot="icon" src="./img/own.png" v-if="$route.path !== '/own'">
        <img slot="icon" src="./img/selectedOwn.png" v-if="$route.path === '/own'">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import bus from '@/utils/eventBus'
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      bottom: 0
    }
  },
  methods: {
    resetIphonexPosition (path) {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      if (h === 724) {
        if (path === undefined) {
          this.bottom = '34px'
        } else {
          this.bottom = 0 // 路由变化执行时h仍为724 ps:iphoneX
        }
      } else {
        this.bottom = 0
      }
    },
    myStatisticsOrder () {
      this.statistics('查看抢单列表')
    },
    myStatisticsCustomer () {
      this.statistics('查看我的客户')
    },
    myStatisticsOwn () {
      this.statistics('查看我的')
    }
  },
  mounted () {
    this.resetIphonexPosition()
    bus.$on('resetIphonexPosition', (path) => {
      this.resetIphonexPosition(path)
    })
    setTimeout(() => {
      localStorage.setItem('tabbarHeight', JSON.stringify(document.getElementsByClassName('weui-tabbar')[0].offsetHeight))
      // bus.$emit('tabbarHeight', document.getElementsByClassName('weui-tabbar')[0].offsetHeight)
    }, 20)
  }
}
</script>

<style lang="less" scoped>
.footer{
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 997;
  .weui-tabbar{
    background-color: #fff;
    &::before{
      border-top: none;
    }
    a{
      &:last-child{
        img{
          width: 18px;
        }
      }
      img{
        position: absolute;
        display: inline-block;
        width: 16px;
        height: auto;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
