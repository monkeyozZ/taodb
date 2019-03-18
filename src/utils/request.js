import axios from 'axios'
import store from '../store'
import router from '../router'
import Vue from 'vue'
import Auth from '../utils/auth'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 20000, // request timeout
  headers: { 'Content-Type': 'application/json' }
  // withCredentials: true
})

service.interceptors.request.use(config => {
  // 在发送请求之前做一些事情
  if (`${config.baseURL}${config.url}` !== `${config.baseURL}/customer/query`) {
    if (`${config.baseURL}${config.url}` !== `${config.baseURL}/order/my`) {
      if (`${config.baseURL}${config.url}` !== `${config.baseURL}/msg/my`) {
        if (`${config.baseURL}${config.url}` !== `${config.baseURL}/capital/detail`) {
          new Vue().$vux.loading.show({// 开启loading
            text: '加载中...'
          })
        }
      }
    }
  }
  // alert(store.getters.token)
  if (store.getters.token) {
    // 让每个请求携带token
    // config.headers['JDB-Authorization'] = store.getters.token
    config.headers['JDB-Authorization'] = Auth.getToken() ? Auth.getToken() : null
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use((response) => {
  // 对响应数据做点什么
  new Vue().$vux.loading.hide() // 关闭loading

  if (response.data.code === -2) {
    new Vue().$vux.loading.hide()
    if (store.getters.login_status) { /* 未注册时，不重置，因为当删除了用户时，进首页时会重置，当有敏感操作，路由没拦截到
                                        是因为首页将授权状态重置，会直接进需要token的页面，但用户没注册肯定不存在token，所以这里在未注册
                                        时不再处理授权状态，下面重定向到关联手机号，我也搞不懂测试工程师为什么要人为搞出这种操作，正常情况
                                        下不会出现这种场景，懵逼吗？懵逼就对了，啊哈哈哈
                                         */
      Auth.setAuthLoginStatus(false)
      Auth.removeUserInfo()
    }
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > 0) {
      /**
       * 此地方想优化成当用户token过期的时候，用户点击进其他页面发现过期后再次授权登录后跳转到对应的页面，而不是固定的首页，但由于
       * 页面上的请求放在mounted,当再次授权登陆后得到的新token时，此时页面的请求已发送出去，又会用过期的token去请求一次，所以又会
       * 去授权登录一次（开始以为是授权登录获取token这一步是异步的原因造成，后来用async await改成同步后，发现依然没法保证拿到新token
       * 之前页面请求已发送，还是用的过期token），这个地方用户体验不好，所以...兄弟你研究下？
       */
      // let to = Auth.getRouterUrl() // token过期授权登录目标链接
      // let toUrl = `${to.substring(1, to.length)}` // 不加引号很诡异不起作用，加了引号起作用，但是会在路由to.path前加'/',有点诡异
      // router.push(`'${to}'`)
      if (!store.getters.login_status) {
        router.push('/correlationMobile')
      } else {
        router.push('/')
      }
    } else {
      store.dispatch('setLoginstatus', false)
      new Vue().$vux.toast.text('身份已过期，请重新登录', 'middle')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }
  if (response.data.code === -3) {
    new Vue().$vux.confirm.show({
      title: '通知',
      content: '<p style="padding-bottom:10px;">系统维护中，暂时无法登陆<br>请联系在线客服！<p>',
      showCancelButton: false,
      showConfirmButton: false,
      closeOnConfirm: false,
      onConfirm () {
        return false
      }
    })
    throw new Error('账户被禁用')
  }
  return response
}, error => {
  new Vue().$vux.loading.hide() // 关闭loading
  new Vue().$vux.toast.text('网络请求超时，请稍后再试', 'middle')
  console.log('err' + error)// for debug
  return Promise.reject(error)
})
export default service
