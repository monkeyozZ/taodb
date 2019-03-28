import request from '@/utils/request'

/**
 * 获取用户是否需要引导的状态
 */
const leadStatus = async (obj) => {
  return request({
    url: '/guide/status',
    method: 'get',
    params: obj
  })
}

/**
 * 修改用户是否需要引导的状态
 */
const updateLeadStatus = async (obj) => {
  return request({
    url: '/guide/status/update',
    method: 'get',
    params: obj
  })
}

export default { leadStatus, updateLeadStatus }
