import request from '@/utils/request'

/**
 * 获取图片验证码
 */
const getVerifyCode = async (obj) => {
  return request({
    url: '/user/reg/verifyCode',
    method: 'get',
    params: obj
  })
}

/**
 * 获取短信验证码并验证图片验证码
 */
const getMessageCode = async (obj) => {
  return request({
    url: '/user/sms/send',
    method: 'post',
    data: obj
  })
}

/**
 * 验证短信验证码
 */
const checkMessageCode = async (obj) => {
  return request({
    url: '/user/sms/check',
    method: 'post',
    data: obj
  })
}

/**
 * 注册
 */
const register = async (obj) => {
  return request({
    url: '/user/reg',
    method: 'post',
    data: obj
  })
}

/**
 * 账号密码登录
 */
const loginByPass = async (obj) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: obj
  })
}

/**
 * 微信授权登录
 */
const getUserInfo = async (code) => {
  return request({
    url: '/user/wxlogin',
    method: 'post',
    data: { 'code': code }
  })
}

/**
 * 微信中获取授权后是否为注册的状态
 */
const getRegisterStatus = async (obj) => {
  return request({
    url: '/user/checkOpenId',
    method: 'get',
    params: obj
  })
}
/**
 * 验证token是否失效
 */
const checkToken = () => {
  return request({
    url: '/sys/checkToken',
    method: 'get'
  })
}

export default { getVerifyCode, getMessageCode, checkMessageCode, register, loginByPass, getUserInfo, getRegisterStatus, checkToken }
