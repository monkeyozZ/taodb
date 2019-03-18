// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index' // vuex
import 'lib-flexible' // 屏幕适配
import './icons' // icon
import 'swiper/dist/css/swiper.css'
import scroll from '@/components/scroll/index' // scroll
import filters from '@/filters' // 过滤器
import waves from '@/directive/waves' // 水波纹指令
/* import '@/utils/vConsole.js' */
import zhuge from '@/utils/zhuge.js'
import { ToastPlugin, ConfigPlugin, LoadingPlugin, WechatPlugin, ConfirmPlugin } from 'vux'
const FastClick = require('fastclick') // 移除移动端页面点击延迟
FastClick.attach(document.body)
Vue.use(ToastPlugin, { position: 'top' })
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX'
})
Vue.use(WechatPlugin)
Vue.use(zhuge) // 诸葛io
Vue.component('scroll', scroll)
Vue.config.productionTip = false
Vue.directive('waves', waves)
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
