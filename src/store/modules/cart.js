import api from '@/services/api'

const state = {
  cart: {
    items: [],
    totalPrice: 0
  }
}

const getters = {
  cartItems: state => state.cart.items,
  cartTotalPrice: state => state.cart.totalPrice,
  cartItemsCount: state => state.cart.items.length
}

const mutations = {
  SET_CART(state, cart) {
    state.cart = cart
  },
  CLEAR_CART(state) {
    state.cart = {
      items: [],
      totalPrice: 0
    }
  }
}

const actions = {
  async getCart({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get('/cart')
      commit('SET_CART', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy giỏ hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async addToCart({ commit, dispatch }, { productId, quantity }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.post('/cart', { productId, quantity })
      commit('SET_CART', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async updateCartItem({ commit, dispatch }, { productId, quantity }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.put('/cart', { productId, quantity })
      commit('SET_CART', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể cập nhật giỏ hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async removeFromCart({ commit, dispatch }, productId) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.delete(`/cart/${productId}`)
      commit('SET_CART', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async clearCart({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      await api.delete('/cart')
      commit('CLEAR_CART')
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể xóa giỏ hàng', { root: true })
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