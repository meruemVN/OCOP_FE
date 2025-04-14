import axios from 'axios'

// API URLs
const API_URL = '/api/shops'

const state = {
  shop: null
}

const getters = {
  shopDetail: state => state.shop
}

const mutations = {
  SET_SHOP(state, shop) {
    state.shop = shop
  }
}

const actions = {
  async createShop({ commit, dispatch }, shopData) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.post(API_URL, shopData)
      commit('SET_SHOP', data.shop)
      
      // Update user role to seller
      commit('auth/SET_USER', {
        ...this.getters['auth/currentUser'],
        role: 'seller'
      }, { root: true })
      
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Tạo cửa hàng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}