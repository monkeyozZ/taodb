import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Auth from '../utils/auth'
import authApi from '@/api/registerAndLogin'
import layout from '@/views/layout/index'
import initShare from '../utils/initShare'
import bus from '@/utils/eventBus'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/taodb/',
  routes: [
    {
      path: '/login',
      component: () => import('@/views/registerAndLogin')
    },
    {
      path: '/correlationMobile',
      component: () => import('@/views/correlationMobile')
    },
    {
      path: '/setpassword',
      component: () => import('@/views/setPassword')
    },
    {
      path: '/passlogin',
      component: () => import('@/views/passLogin')
    },
    {
      path: '/findpassword',
      component: () => import('@/views/findPassword')
    },
    {
      path: '/resetpassword',
      component: () => import('@/views/resetPassword')
    },
    {
      path: '/xieyi',
      component: () => import('@/views/xieyi'),
      meta: { title: '用户协议' }
    },
    {
      path: '/',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/index/index'),
          meta: { title: '抢单' }
        }
      ]
    },
    {
      path: '/orderdetails/:id',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/orderDetails/index'),
          meta: { title: '订单详情' }
        }
      ]
    },
    {
      path: '/customerdetails/:id',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/customerDetails/index'),
          meta: { title: '客户详情' }
        }
      ]
    },
    {
      path: '/chargebackDetails/:id',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/chargebackDetails/index'),
          meta: { title: '退单详情' }
        }
      ]
    },
    {
      path: '/customer',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/customer/index'),
          meta: { title: '客户' }
        }
      ]
    },
    {
      path: '/own',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/own/index'),
          meta: { title: '我的' }
        }
      ]
    },
    {
      path: '/filter',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/filter/index'),
          meta: { title: '自定义筛选' }
        }
      ]
    },
    {
      path: '/city',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/city/index'),
          meta: { title: '选择城市' }
        }
      ]
    },
    {
      path: '/setcurrentcity',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/city/selectCity')
        }
      ]
    },
    {
      path: '/certification',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/certification/index'),
          meta: { title: '实名认证' }
        }
      ]
    },
    {
      path: '/company',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/company/index'),
          meta: { title: '公司名称' }
        }
      ]
    },
    {
      path: '/uploadidcard',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/uploadIdcard/index'),
          meta: { title: '上传身份证' }
        }
      ]
    },
    {
      path: '/uploadaptitudes',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/uploadAptitudes/index'),
          meta: { title: '上传资质证明' }
        }
      ]
    },
    {
      path: '/ownintegral',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/ownIntegral/index'),
          meta: { title: '我的积分' }
        }
      ]
    },
    {
      path: '/recharge',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/recharge/index'),
          meta: { title: '充值中心' }
        }
      ]
    },
    {
      path: '/paysuccess',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/paySuccess/index'),
          meta: { title: '支付成功' }
        }
      ]
    },
    {
      path: '/payfail',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/payFail/index'),
          meta: { title: '支付失败' }
        }
      ]
    },
    {
      path: '/set',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/set/index'),
          meta: { title: '设置' }
        }
      ]
    },
    {
      path: '/updatepassword',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/updatePassword/index'),
          meta: { title: '修改密码' }
        }
      ]
    },
    {
      path: '/news',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/news/index'),
          meta: { title: '消息' }
        }
      ]
    },
    {
      path: '/newsdetails/:id',
      component: layout,
      children: [
        {
          path: '',
          name: 'newsDetails',
          component: () => import('@/views/news/details'),
          meta: { title: '消息' }
        }
      ]
    },
    {
      path: '/coupon',
      component: () => import('@/views/coupon/index'),
      meta: { title: '领券中心' }
    },
    {
      path: '/ownCoupon',
      component: () => import('@/views/ownCoupon/index'),
      meta: { title: '我的优惠券' }
    },
    {
      path: '/invite',
      component: () => import('@/views/invite/index'),
      meta: { title: '邀请有礼' }
    },
    {
      path: '/inviteDetails',
      component: () => import('@/views/invite/inviteDetails'),
      meta: { title: '邀请明细' }
    },
    {
      path: '/financialdetails',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/financialDetails'),
          meta: { title: '资金明细' }
        }
      ]
    },
    {
      path: '/integraldetails',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/integralDetails'),
          meta: { title: '积分明细' }
        }
      ]
    },
    {
      path: '/faq',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/faq'),
          meta: { title: '常见问题' }
        }
      ]
    },
    {
      path: '/issue/:cate',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/issue')
        }
      ]
    },
    {
      path: '/feedback',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/feedback'),
          meta: { title: '意见反馈' }
        }
      ]
    },
    {
      path: '/error',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/error'),
          meta: { title: '错误' }
        }
      ]
    },
    {
      path: '/kefu',
      component: layout,
      children: [
        {
          path: '',
          component: () => import('@/views/kefu'),
          meta: { title: '咨询客服' }
        }
      ]
    },
    {
      path: '/about',
      component: () => import('@/views/about'),
      meta: { title: '关于我们' }
    },
    {
      path: '/share',
      component: () => import('@/views/share')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Auth.setRouterUrl(to.fullPath) // 记录router，当身份过期时授权成功重定向
  bus.$emit('resetIphonexPosition', to.path) // iphoneX安全视区 hack
  // 通过userAgent判断IOS环境，hank ios中微信分享初始化配置
  let isIOS = function () {
    var isIphone = navigator.userAgent.includes('iPhone')
    var isIpad = navigator.userAgent.includes('iPad')
    if (isIphone || isIpad) {
      return true
    } else {
      return false
    }
  }
  // let url = `https://tdb.baojeah.com/taodb${to.path}`

  // 初始化登录状态，token
  let isLogin = Auth.isLogin() ? Auth.isLogin() : 'false'
  store.dispatch('setLoginstatus', JSON.parse(isLogin))

  // 初始化token
  let token = Auth.getToken() ? Auth.getToken() : null
  store.dispatch('setJdbAuthToken', token)

  // 微信浏览器时要做的事
  let ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') > -1 && to.path !== '/share') {
    let url = `${process.env.BASE_SHAREURL}${to.path}`
    if (isIOS()) {
      if (to.path === '/') {
        initShare(url)
        next()
      } else {
        next()
      }
    } else {
      initShare(url)
      next()
    }

    let userInfo = Auth.getUserInfo() ? Auth.getUserInfo() : null
    let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'
    if (userInfo) {
      store.dispatch('setuserinfo', userInfo) // 初始化用户信息 ps: 第二次进来注册需要的openId
    } else {
      if (!JSON.parse(status)) {
        Auth.setAuthLoginStatus(false) // 无userInfo时，授权状态重置
      }
    }

    // let status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'
    if (to.query.code && JSON.parse(status) === false) {
      Auth.setAuthLoginStatus(true)
      authApi.getUserInfo(to.query.code).then((res) => {
        if (res.data.code === 0) {
          store.dispatch('setLoginstatus', true)
          store.dispatch('setJdbAuthToken', res.data.data)
          next('/')
        }
        if (res.data.code === -1) {
          store.dispatch('setLoginstatus', false)
          store.dispatch('setuserinfo', res.data.data)
          next('/')
        }
      }).catch((err) => {
        console.log(err)
      })
      next()
    }

    status = Auth.isAuthLogin() ? Auth.isAuthLogin() : 'false'

    if (JSON.parse(status) === true) {
      Auth.setAuthLoginStatus(true)
      next()
    }

    if (JSON.parse(status) === false) {
      let fullurl = to.fullPath
      // let gourl = encodeURI('https://tdb.baojeah.com/taodb' + fullurl)
      let gourl = encodeURI(process.env.BASE_SHAREURL + fullurl)
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3317c63e1deebd7a&redirect_uri=' + gourl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      return false
    }

    if (to.path === '/correlationMobile') { // 微信中重定向
      next()
    }
  } else {
    if (to.path === '/correlationMobile') { // 非微信中不允许进关联手机号页面
      next('/login')
    }
  }

  if (to.path === '/login') {
    if (store.getters.login_status) {
      next('/')
    } else {
      next()
      return
    }
  }

  if (Auth.isAuthLogin()) {
    if (store.getters.login_status) {
      next()
    } else {
      if (to.path !== '/') {
        if (to.path !== '/setpassword') {
          if (to.path !== '/correlationMobile') {
            if (to.path !== '/share') {
              if (to.path !== '/xieyi') {
                if (to.path !== '/filter') {
                  if (to.path !== '/city') {
                    if (to.path !== '/setcurrentcity') {
                      if (to.path !== '/faq') {
                        if (!new RegExp('issue').test(to.path)) {
                          next('/correlationMobile')
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } else {
    if (store.getters.login_status) {
      next()
    } else {
      if (to.path !== '/') {
        if (to.path !== '/passlogin') {
          if (to.path !== '/setpassword') {
            if (to.path !== '/findpassword') {
              if (to.path !== '/resetPassword') {
                if (to.path !== '/share') {
                  if (to.path !== '/xieyi') {
                    if (to.path !== '/filter') {
                      if (to.path !== '/city') {
                        if (to.path !== '/setcurrentcity') {
                          if (to.path !== '/faq') {
                            if (!new RegExp('issue').test(to.path)) {
                              next('/login')
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  if (to.meta.title) {
    store.dispatch('setHeaderText', to.meta.title)
    next()
  }
  if (to.path === '/issue/auth') {
    store.dispatch('setHeaderText', '认证审核')
    next()
  } else if (to.path === '/issue/order') {
    store.dispatch('setHeaderText', '抢单')
    next()
  } else if (to.path === '/issue/recharge') {
    store.dispatch('setHeaderText', '充值和退款')
    next()
  } else if (to.path === '/issue/invite') {
    store.dispatch('setHeaderText', '邀请奖励')
    next()
  } else if (to.path === '/issue/integral') {
    store.dispatch('setHeaderText', '积分')
    next()
  } else if (to.path === '/issue/other') {
    store.dispatch('setHeaderText', '其他')
    next()
  }
  if (to.path === '/city') {
    store.dispatch('setRightText', { text: '完成', color: '#1F7CF0' })
    next()
  } else if (to.path === '/news') {
    store.dispatch('setRightText', { text: '全部已读', color: '#333' })
    next()
  } else {
    store.dispatch('setRightText', { text: '', color: '#333' })
    next()
  }
  next()
})

router.beforeEach((to, from, next) => {
  /* eslint-disable */
  var _hmt = _hmt || [];
  (function () {
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?56ddfd7bb9fc37fc0115a264470fb31b'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()

  _hmt.push(['_trackPageview', '/#' + to.fullPath])
  next()
})
export default router
