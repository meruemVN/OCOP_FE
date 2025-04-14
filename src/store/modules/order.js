import axios from 'axios'

// API URLs
const API_URL = '/api/orders'

const state = {
  orders: [],
  order: null,
  myOrders: []
}

const getters = {
  allOrders: state => state.orders,
  orderDetail: state => state.order,
  myOrders: state => state.myOrders
}

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_ORDER(state, order) {
    state.order = order
  },
  SET_MY_ORDERS(state, orders) {
    state.myOrders = orders
  },
  ADD_ORDER(state, order) {
    state.orders.push(order)
    state.myOrders.push(order)
  },
  UPDATE_ORDER(state, updatedOrder) {
    // Update in orders list
    const ordersIndex = state.orders.findIndex(order => order._id === updatedOrder._id)
    if (ordersIndex !== -1) {
      state.orders.splice(ordersIndex, 1, updatedOrder)
    }
    
    // Update in my orders list
    const myOrdersIndex = state.myOrders.findIndex(order => order._id === updatedOrder._id)
    if (myOrdersIndex !== -1) {
      state.myOrders.splice(myOrdersIndex, 1, updatedOrder)
    }
    
    // Update current order detail
    if (state.order && state.order._id === updatedOrder._id) {
      state.order = updatedOrder
    }
  }
}

const actions = {
  async createOrder({ commit, dispatch }, orderData) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.post(API_URL, orderData)
      commit('ADD_ORDER', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Tạo đơn hàng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async getOrderById({ commit, dispatch }, orderId) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.get(`${API_URL}/${orderId}`)
      commit('SET_ORDER', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy thông tin đơn hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async getMyOrders({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.get(`${API_URL}/myorders`)
      commit('SET_MY_ORDERS', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy danh sách đơn hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async payOrder({ commit, dispatch }, { orderId, paymentResult }) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.put(`${API_URL}/${orderId}/pay`, paymentResult)
      commit('UPDATE_ORDER', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Thanh toán đơn hàng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // --- Admin/Distributor actions ---
  
  async getOrders({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.get(API_URL)
      commit('SET_ORDERS', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy danh sách đơn hàng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async deliverOrder({ commit, dispatch }, orderId) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.put(`${API_URL}/${orderId}/deliver`, {})
      commit('UPDATE_ORDER', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Cập nhật trạng thái giao hàng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async updateOrderStatus({ commit, dispatch }, { orderId, status }) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.put(`${API_URL}/${orderId}/status`, { status })
      commit('UPDATE_ORDER', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Cập nhật trạng thái đơn hàng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // --- Admin actions ---
  
  async assignOrderToDistributor({ commit, dispatch }, { orderId, distributorId }) {
    try {
      dispatch('setLoading', true, { root: true })
      const { data } = await axios.put(`${API_URL}/${orderId}/assign`, { distributorId })
      commit('UPDATE_ORDER', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Gán đơn hàng cho nhà phân phối thất bại', { root: true })
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