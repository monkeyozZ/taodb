import request from '@/utils/request'

/**
 * 充值額度及奖励配置
 */
const getRechargeConfig = async () => {
  return request({
    url: '/sys/recharge/rewards',
    method: 'get'
  })
}

export default { getRechargeConfig }
