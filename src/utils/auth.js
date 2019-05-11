import Cookies from 'js-cookie'

const auth = {
  // 当Token超时后采取何种策略
  // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到授权页面
  // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
  tokenTimeoutMethod: 'getNewToken',

  // 在Cookie中记录登录状态的key
  loginKey: 'loginStatus',

  // 在Cookie中记录登录状态的key
  authLoginKey: 'authLoginStatus',

  // 在Cookie中记录token的key
  tokenKey: 'JDB-Authorization',

  // Token是否超时
  hasToken: function () {
    return Cookies.get('token')
  },

  // 设置授权登录状态
  setAuthLoginStatus: function (params) {
    // 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    console.log(params)
    localStorage.setItem(this.authLoginKey, JSON.stringify(params))
    // Cookies.set(this.authLoginKey, params)
  },

  // 移除授权登录状态
  removeAuthLoginStatus: function () {
    localStorage.removeItem(this.authLoginKey)
    // Cookies.remove(this.authLoginKey)
  },

  // 当前是否是授权登录状态
  isAuthLogin: function () {
    return JSON.parse(localStorage.getItem(this.authLoginKey))
    // return Cookies.get(this.authLoginKey)
  },

  // 设置登录状态
  setLoginStatus: function (params) {
    // 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    localStorage.setItem(this.loginKey, JSON.stringify(params))
    // Cookies.set(this.loginKey, params)
  },

  // 移除登录状态
  removeLoginStatus: function () {
    localStorage.removeItem((this.loginKey))
    // Cookies.remove(this.loginKey)
  },

  // 当前是否是登录状态
  isLogin: function () {
    return JSON.parse(localStorage.getItem(this.loginKey))
    // return Cookies.get(this.loginKey)
  },

  // 设置token
  setToken: function (params) {
    localStorage.setItem(this.tokenKey, JSON.stringify(params))
    // Cookies.set(this.tokenKey, params)
  },

  // 获取本地token
  getToken: function () {
    return JSON.parse(localStorage.getItem(this.tokenKey))
    // return Cookies.get(this.tokenKey)
  },

  // 设置userInfo
  setUserInfo: function (openId) {
    localStorage.setItem('user_info', JSON.stringify(openId))
  },
  // 移除userInfo
  removeUserInfo: function () {
    localStorage.removeItem(('user_info'))
    // Cookies.remove(this.loginKey)
  },
  // 获取userInfo
  getUserInfo: function () {
    return JSON.parse(localStorage.getItem('user_info'))
  },

  // 记录上一步导航
  setRouterUrl: function (url) {
    // 设置token，并填写有效期
    localStorage.setItem('router_url', JSON.stringify(url))
  },

  // 获取上一步导航
  getRouterUrl: function () {
    return JSON.parse(localStorage.getItem('router_url'))
  },

  // 设置是否重定向状态
  setRedirect: function (url) {
    // 设置token，并填写有效期
    localStorage.setItem('hasRedirect', JSON.stringify(url))
  },

  // 获取是否重定向状态
  getRedirect: function () {
    return JSON.parse(localStorage.getItem('hasRedirect'))
  },

  // 设置当前城市
  setCurrentCity: function (city) {
    // 设置token，并填写有效期
    localStorage.setItem('currentCity', JSON.stringify(city))
  },

  // 获取当前城市
  getCurrentCity: function () {
    return JSON.parse(localStorage.getItem('currentCity'))
  },
  // 设置personalID
  setpersonalId: function (token) {
    // 设置token，并填写有效期
    var maxAge = new Date(new Date().getTime() + 30 * 1000)
    Cookies.set('personalid', token, {
      expires: maxAge
    })
  },

  // 储存筛选条件
  setFilterItem: function (obj) {
    localStorage.setItem('FilterItem', JSON.stringify(obj))
  },
  // 获取筛选条件
  getFilterItem: function () {
    return JSON.parse(localStorage.getItem('FilterItem'))
  },

  // 储存派单筛选条件
  setSendOrdersFilterItem: function (obj) {
    localStorage.setItem('sendOrdersFilterItem', JSON.stringify(obj))
  },
  // 获取派单筛选条件
  getSendOrdersFilterItem: function () {
    return JSON.parse(localStorage.getItem('sendOrdersFilterItem'))
  },

  // 移除Token
  removeToken: function () {
    Cookies.remove('token')
  }
}

export default auth
