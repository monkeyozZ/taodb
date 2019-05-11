import * as types from '../mutation-type'

const state = {
  orderCondition: {}
}

const getters = {
  orderCondition: () => state.orderCondition
}

const mutations = {
  [types.SETORDERCONDITION] (state, params) {
    state.orderCondition = params
  }
}

export default {
  state, mutations, getters
}
