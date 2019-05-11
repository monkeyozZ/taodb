import request from '@/utils/request'

/**
 * 请求lianlian支付配置
 */
const getConfig = async (obj) => {
  return request({
    url: '/recharge/union_pay',
    method: 'post',
    data: obj
  })
}
export default { getConfig }
