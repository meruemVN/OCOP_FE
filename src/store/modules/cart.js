// store/modules/cart.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  cart: null, // Khởi tạo là null, sẽ chứa { items: [], totalPrice: number } khi được fetch
  loading: false,
  error: null,
};

const getters = {
  // Kiểm tra null trước khi truy cập properties
  cartItems: (state) => (state.cart ? state.cart.items : []),
  cartTotalPrice: (state) => (state.cart ? state.cart.totalPrice : 0),
  cartItemCount: (state) => (state.cart ? state.cart.items.reduce((count, item) => count + item.quantity, 0) : 0),
  isLoading: (state) => state.loading,
  cartError: (state) => state.error,
  theCart: (state) => state.cart, // Getter để lấy cả object cart nếu cần
};

const mutations = {
  CART_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  CART_SUCCESS: (state, cartData) => {
    // Đảm bảo cartData luôn có cấu trúc hợp lệ
    state.cart = cartData && typeof cartData === 'object' ? cartData : { items: [], totalPrice: 0 };
    state.loading = false;
    state.error = null;
  },
  CART_ERROR: (state, error) => {
    state.loading = false;
    // Trích xuất message lỗi nếu có
    state.error = error?.response?.data?.message || error?.message || 'Lỗi không xác định khi thao tác giỏ hàng';
    // Không reset cart về null khi lỗi, giữ lại trạng thái cũ
  },
  RESET_CART: (state) => { // Dùng khi logout hoặc đặt hàng thành công
    state.cart = { items: [], totalPrice: 0 }; // Reset về trạng thái rỗng hợp lệ
    state.loading = false;
    state.error = null;
  }
};

const actions = {
  // Lấy giỏ hàng từ API
  async getCart({ commit, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
       commit('RESET_CART');
       return;
    }
    commit('CART_REQUEST');
    try {
      const response = await apiClient.get('/cart');
      // Commit response.data (là object giỏ hàng)
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      commit('CART_ERROR', error);
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  async addToCart({ commit }, { productId, quantity }) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.post('/cart', { productId, quantity });
      // Commit response.data (là object giỏ hàng mới)
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
      commit('CART_ERROR', error);
      throw error;
    }
  },

  // Cập nhật số lượng item trong giỏ hàng
  async updateCartItem({ commit }, { productId, quantity }) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.put('/cart', { productId, quantity });
      // Commit response.data (là object giỏ hàng mới)
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi cập nhật giỏ hàng:', error);
      commit('CART_ERROR', error);
      throw error;
    }
  },

  // Xóa một item khỏi giỏ hàng
  async removeFromCart({ commit }, productId) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.delete(`/cart/${productId}`);
      // Commit response.data (là object giỏ hàng mới)
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi xóa sản phẩm khỏi giỏ hàng:', error);
      commit('CART_ERROR', error);
      throw error;
    }
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart({ commit }) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.delete('/cart');
      // API trả về cart rỗng hoặc message
      // Commit response.data (phải là object giỏ hàng rỗng)
      commit('CART_SUCCESS', response.data.message ? { items: [], totalPrice: 0 } : response.data);
    } catch (error) {
      console.error('Lỗi xóa giỏ hàng:', error);
      commit('CART_ERROR', error);
    }
  },

  // Action được gọi từ bên ngoài (vd: order module) để reset state
  resetCartState({ commit }) {
    commit('RESET_CART');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};