import request from '@/utils/request'

/**
 * 获取筛选条件列表
 */
const getFilterList = async (obj) => {
  return request({
    url: '/sys/item/options',
    method: 'get'
  })
}
/**
 * 存储筛选条件
 */
const setFilterList = async (obj) => {
  return request({
    url: '/user/queryTerm/save',
    method: 'post',
    data: obj
  })
}
/**
 * 获取存储的筛选条件
 */
const getSomeFilterList = async () => {
  return request({
    url: '/user/queryTerm',
    method: 'get'
  })
}

export default { getFilterList, setFilterList, getSomeFilterList }
