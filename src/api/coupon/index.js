import request from '@/utils/request'

/**
 * 抢优惠券列表
 */
const couponList = async (obj) => {
  return request({
    url: '/coupon/todayList',
    method: 'get',
    params: obj
  })
}

/**
 * 抢优惠
 */
const grabCoupon = async (obj) => {
  return request({
    url: '/coupon/grap',
    method: 'get',
    params: obj
  })
}

/**
 * 我的优惠券列表
 */
const myCoupon = async (obj) => {
  return request({
    url: '/coupon/my',
    method: 'post',
    data: obj
  })
}

/**
 * 我的未使用优惠券列表
 */
const unUsedCoupon = async (obj) => {
  return request({
    url: '/coupon/unUsed',
    method: 'get',
    params: obj
  })
}

export default { couponList, grabCoupon, myCoupon, unUsedCoupon }
