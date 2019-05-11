import * as types from './mutation-type'
import auth from '@/utils/auth'

export const setLoginstatus = ({commit}, params) => {
  commit(types.SETLOGINSTATUS, params)
  auth.setLoginStatus(params)
}
export const setuserinfo = ({ commit }, params) => {
  commit(types.SETUSERINFO, params)
  auth.setUserInfo(params)
}

export const inituserinfo = ({ commit }, obj) => {
  commit(types.SETUSERINFO, obj)
}

export const setHeaderText = ({ commit }, str) => {
  commit(types.SETHEADERTEXT, str)
}
export const setRightText = ({ commit }, obj) => {
  commit(types.SETHEADERRIGHTTEXT, obj)
}
export const setIdCardImg = ({ commit }, obj) => {
  commit(types.SETIDCARDIMG, obj)
}
export const setAptitudesImg = ({ commit }, obj) => {
  commit(types.SETAPTITUDESIMG, obj)
}
export const setCity = ({ commit }, obj) => {
  commit(types.SETCITY, obj)
}
export const setCurrentCity = ({ commit }, obj) => {
  commit(types.CURRENTCITY, obj)
}
export const setSendOrdersCity = ({ commit }, obj) => {
  commit(types.SENDORDERSCITY, obj)
}
export const setOrderCondition = ({ commit }, obj) => {
  commit(types.SETORDERCONDITION, obj)
}
export const setAllReadyStatus = ({ commit }, obj) => {
  commit(types.SETALLREADY, obj)
}
export const setNewsType = ({ commit }, obj) => {
  commit(types.SETNEWSTYPE, obj)
}
export const setJdbAuthToken = ({ commit }, obj) => {
  commit(types.SETJDBTOKEN, obj)
  auth.setToken(obj)
}
export const setPositionY = ({ commit }, obj) => {
  commit(types.SETPOSITIONY, obj)
}
