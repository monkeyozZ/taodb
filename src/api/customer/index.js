import request from '@/utils/request'

/**
 * 获取列表数据
 */
const getlist = async (obj) => {
  return request({
    url: '/order/my',
    method: 'post',
    data: obj
  })
}
/**
 * 获取历史客户列表数据
 */
const getHistoryList = async (obj) => {
  return request({
    url: '/order/history',
    method: 'post',
    data: obj
  })
}

/**
 * 获取客户电话号码
 */
const getTel = async (obj) => {
  return request({
    url: '/order/tel',
    method: 'get',
    params: obj
  })
}

/**
 * 添加客户备注
 */
const setTag = async (obj) => {
  return request({
    url: '/order/tag',
    method: 'post',
    data: obj
  })
}

/**
 * 退单
 */
const chargeback = async (obj) => {
  return request({
    url: '/order/refund',
    method: 'post',
    data: obj
  })
}
export default { getlist, getHistoryList, getTel, setTag, chargeback }
