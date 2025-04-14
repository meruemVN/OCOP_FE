import { createStore } from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
import product from './modules/product'
import cart from './modules/cart'
import order from './modules/order'
import shop from './modules/shop'

export default createStore({
  state: {
    error: null,
    loading: false,
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },
  actions: {
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    },
    setLoading({ commit }, status) {
      commit('SET_LOADING', status)
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  },
  modules: {
    auth,
    user,
    product,
    cart,
    order,
    shop
  }
})