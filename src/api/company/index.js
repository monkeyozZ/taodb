import request from '@/utils/request'

/**
 * 获取公司名称
 */
const searchCompany = async (obj) => {
  return request({
    url: '/userCredit/company',
    method: 'get',
    params: obj
  })
}

/**
 * 获取公司名称
 */
const validateCompany = async (obj) => {
  return request({
    url: '/userCredit/companyInfo',
    method: 'get',
    params: obj
  })
}

export default { searchCompany, validateCompany }
