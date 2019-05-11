import request from '@/utils/request'

/**
 * 开启派单
 */
const startSendOrders = async (obj) => {
  return request({
    url: '/orderPush/create',
    method: 'post',
    data: obj
  })
}
/**
 * 获取派单筛选条件
 */
const getSendOrdersFilter = async () => {
  return request({
    url: '/orderPush/pre',
    method: 'get'
  })
}
/**
 * 关闭派单
 */
const closeSendOrders = async () => {
  return request({
    url: '/orderPush/close',
    method: 'get'
  })
}

export default { startSendOrders, getSendOrdersFilter, closeSendOrders }
