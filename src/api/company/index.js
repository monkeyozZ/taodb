import request from '@/utils/request'

/**
 * 获取用户是否需要引导的状态
 */
const searchCompany = async (obj) => {
  return request({
    url: '/userCredit/company',
    method: 'get',
    params: obj
  })
}

export default { searchCompany }
