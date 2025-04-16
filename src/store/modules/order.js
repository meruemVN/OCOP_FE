// store/modules/order.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  myOrders: [], // Danh sách đơn hàng của user hiện tại
  order: null,  // Đơn hàng chi tiết đang xem
  loading: false,
  error: null,
};

const getters = {
  myOrders: (state) => state.myOrders || [], // Luôn trả về mảng
  currentOrder: (state) => state.order,
  isLoading: (state) => state.loading,
  orderError: (state) => state.error,
};

const mutations = {
  ORDER_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  ORDER_CREATE_SUCCESS: (state, createdOrder) => {
    if (createdOrder && typeof createdOrder === 'object') {
      state.myOrders.unshift(createdOrder); // Thêm vào đầu danh sách 'myOrders'
      state.order = createdOrder;         // Set order hiện tại là đơn vừa tạo
    }
    state.loading = false;
    state.error = null;
  },
  MY_ORDERS_SUCCESS: (state, orders) => {
    if (Array.isArray(orders)) {
      state.myOrders = orders; // Gán dữ liệu mới vào state
    } else {
      state.myOrders = []; // Reset về mảng rỗng nếu dữ liệu không đúng
      console.error("MY_ORDERS_SUCCESS received non-array data:", orders);
    }
    state.loading = false;
    state.error = null;
  },
  ORDER_DETAIL_SUCCESS: (state, order) => {
    state.order = order; // Gán object đơn hàng hoặc null
    state.loading = false;
    state.error = null;
  },
  ORDER_UPDATE_SUCCESS: (state, updatedOrder) => {
    if (updatedOrder && typeof updatedOrder === 'object') {
      // Cập nhật trong danh sách myOrders
      const index = state.myOrders.findIndex(o => o._id === updatedOrder._id);
      if (index !== -1) {
        state.myOrders.splice(index, 1, updatedOrder);
      }
      // Cập nhật order chi tiết nếu đang xem đúng đơn đó
      if (state.order && state.order._id === updatedOrder._id) {
        state.order = updatedOrder;
      }
    }
    state.loading = false;
    state.error = null;
  },
  ORDER_ERROR: (state, error) => {
    state.loading = false;
    state.error = error?.response?.data?.message || error?.message || 'Lỗi xử lý đơn hàng';
  },
  CLEAR_CURRENT_ORDER: (state) => {
    state.order = null; // Xóa chi tiết đơn hàng hiện tại
  },
};

const actions = {
  // Tạo đơn hàng mới
  async createOrder({ commit, dispatch }, orderPayload) {
    commit('ORDER_REQUEST');
    try {
      const { shippingAddress, paymentMethod, note } = orderPayload;
      const response = await apiClient.post('/orders', { shippingAddress, paymentMethod, note });
      // Commit response.data (là object đơn hàng mới)
      commit('ORDER_CREATE_SUCCESS', response.data);
      dispatch('cart/resetCartState', null, { root: true }); // Gọi action reset giỏ hàng
      return response.data;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      commit('ORDER_ERROR', error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của user hiện tại
  async fetchMyOrders({ commit }) {
    commit('ORDER_REQUEST');
    try {
      const response = await apiClient.get('/orders/myorders');
      // Commit response.data (phải là mảng đơn hàng)
      commit('MY_ORDERS_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      commit('ORDER_ERROR', error);
      // Không throw lỗi để component không crash, chỉ hiển thị lỗi từ state
      return []; // Trả về mảng rỗng khi lỗi
    }
  },

  // Lấy chi tiết một đơn hàng theo ID
  async fetchOrderById({ commit }, orderId) {
    commit('ORDER_REQUEST');
    commit('CLEAR_CURRENT_ORDER');
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      // Commit response.data (là object đơn hàng chi tiết)
      commit('ORDER_DETAIL_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      commit('ORDER_ERROR', error);
      throw error;
    }
  },

  // Các actions admin/update khác nếu cần (cũng commit response.data)
  // async payOrder({ commit }, { orderId, paymentResult }) { ... commit('ORDER_UPDATE_SUCCESS', response.data); ... }
  // async deliverOrder({ commit }, orderId) { ... commit('ORDER_UPDATE_SUCCESS', response.data); ... }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};