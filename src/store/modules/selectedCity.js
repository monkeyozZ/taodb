import * as types from '../mutation-type'

const state = {
  city: [],
  currentCity: '',
  sendOrdersCity: '' // 派单城市
}

const getters = {
  city: () => state.city,
  currentCity: () => state.currentCity,
  sendOrdersCity: () => state.sendOrdersCity
}

const mutations = {
  [types.SETCITY] (state, params) {
    state.city = params
  },
  [types.CURRENTCITY] (state, params) {
    state.currentCity = params
  },
  [types.SENDORDERSCITY] (state, params) {
    state.sendOrdersCity = params
  }
}

export default {
  state, mutations, getters
}
