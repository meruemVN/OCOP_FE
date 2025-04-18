// store/modules/cart.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

// --- Helper Function ---
// Lấy và parse giỏ hàng từ localStorage một cách an toàn
const getStoredCart = () => {
  const storedCart = localStorage.getItem('cart'); // Key để lưu cart trong localStorage
  if (storedCart && storedCart !== 'undefined' && storedCart !== 'null') {
    try {
      const parsedCart = JSON.parse(storedCart);
      // Kiểm tra cấu trúc cơ bản tối thiểu
      if (parsedCart && Array.isArray(parsedCart.items) && typeof parsedCart.totalPrice === 'number') {
         // Kiểm tra sâu hơn cấu trúc của items nếu cần
         // Ví dụ: đảm bảo mỗi item có product, quantity, price
         const validItems = parsedCart.items.every(item =>
             item && typeof item === 'object' && item.product && typeof item.quantity === 'number' && typeof item.price === 'number'
         );
         if (validItems) {
            return parsedCart; // Trả về dữ liệu hợp lệ
         } else {
             console.warn("Stored cart items have invalid structure. Resetting.");
             localStorage.removeItem('cart');
             return { items: [], totalPrice: 0 };
         }
      } else {
          console.warn("Stored cart data has invalid structure. Resetting.");
          localStorage.removeItem('cart');
          return { items: [], totalPrice: 0 };
      }
    } catch (e) {
      console.error("Error parsing stored cart data:", e);
      localStorage.removeItem('cart'); // Xóa dữ liệu không hợp lệ
      return { items: [], totalPrice: 0 };
    }
  }
  // Nếu không có gì trong localStorage hoặc không hợp lệ, trả về giỏ hàng rỗng
  return { items: [], totalPrice: 0 };
};

// --- State ---
const state = {
  // Khởi tạo state.cart từ localStorage bằng helper function
  cart: getStoredCart(),
  loading: false,
  error: null,
};

// --- Getters ---
const getters = {
  // Getters giờ sẽ đọc từ state đã được khởi tạo từ localStorage
  // Thêm kiểm tra ?. và || [] để phòng trường hợp state.cart có thể là null/undefined tạm thời
  cartItems: (state) => state.cart?.items || [],
  cartTotalPrice: (state) => state.cart?.totalPrice || 0,
  cartItemCount: (state) => state.cart?.items?.reduce((count, item) => count + (item.quantity || 0), 0) || 0, // Thêm kiểm tra item.quantity
  isLoading: (state) => state.loading,
  cartError: (state) => state.error,
  theCart: (state) => state.cart,
};

// --- Mutations ---
const mutations = {
  CART_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  CART_SUCCESS: (state, cartData) => {
    // Đảm bảo cartData là object hợp lệ trước khi gán và lưu
    const validCart = (cartData && typeof cartData === 'object' && Array.isArray(cartData.items) && typeof cartData.totalPrice === 'number')
                       ? cartData
                       : { items: [], totalPrice: 0 }; // Fallback về rỗng nếu data không hợp lệ
    state.cart = validCart;
    state.loading = false;
    state.error = null;
    // >> LƯU VÀO LOCALSTORAGE KHI CẬP NHẬT THÀNH CÔNG <<
    try {
        localStorage.setItem('cart', JSON.stringify(validCart));
        console.log("Cart saved to localStorage:", validCart);
    } catch (e) {
        console.error("Error saving cart to localStorage in CART_SUCCESS:", e);
    }
  },
  CART_ERROR: (state, error) => {
    state.loading = false;
    state.error = error?.response?.data?.message || error?.message || 'Lỗi thao tác giỏ hàng';
    // Không thay đổi state.cart khi lỗi, giữ nguyên trạng thái trước đó
    console.error("Cart Error Mutation:", state.error);
  },
  RESET_CART: (state) => {
    const emptyCart = { items: [], totalPrice: 0 };
    state.cart = emptyCart;
    state.loading = false;
    state.error = null;
    // >> CẬP NHẬT LOCALSTORAGE KHI RESET <<
    try {
        localStorage.setItem('cart', JSON.stringify(emptyCart));
        // Hoặc dùng: localStorage.removeItem('cart'); (tùy chọn nào bạn thích)
        console.log("Cart reset in state and localStorage.");
    } catch (e) {
        console.error("Error resetting cart in localStorage:", e);
    }
  }
};

// --- Actions ---
const actions = {
  // Khởi tạo giỏ hàng: Ưu tiên lấy từ API nếu đã login, nếu không dùng từ localStorage
  async initializeCart({ commit, dispatch, rootGetters }) {
    if (rootGetters['auth/isLoggedIn']) {
      // Nếu đã đăng nhập, gọi API để lấy giỏ hàng mới nhất từ server
      // Điều này sẽ ghi đè lên localStorage nếu có khác biệt
      await dispatch('getCart');
    } else {
      // Nếu chưa đăng nhập, state đã được khởi tạo từ localStorage rồi
      // Không cần làm gì thêm ở đây, hoặc có thể commit state từ localStorage lần nữa cho chắc
       commit('CART_SUCCESS', getStoredCart()); // Đảm bảo state khớp localStorage ban đầu
    }
  },

  // Lấy giỏ hàng từ API (chỉ khi đã đăng nhập)
  async getCart({ commit }) {
    // Action này giờ chỉ nên được gọi khi đã chắc chắn đăng nhập
    commit('CART_REQUEST');
    try {
      const response = await apiClient.get('/cart');
      commit('CART_SUCCESS', response.data); // Mutation này sẽ lưu vào localStorage
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng từ API:', error);
      commit('CART_ERROR', error);
      // Khi lỗi API, không nên xóa localStorage, user vẫn có thể dùng cart tạm
    }
  },

  // Thêm/Cập nhật/Xóa đều gọi API và mutation CART_SUCCESS sẽ lưu localStorage
  async addToCart({ commit }, { productId, quantity }) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.post('/cart', { productId, quantity });
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      commit('CART_ERROR', error);
      throw error;
    }
  },
  async updateCartItem({ commit }, { productId, quantity }) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.put('/cart', { productId, quantity });
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      commit('CART_ERROR', error);
      throw error;
    }
  },
  async removeFromCart({ commit }, productId) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.delete(`/cart/${productId}`);
      commit('CART_SUCCESS', response.data);
      return response.data;
    } catch (error) {
      commit('CART_ERROR', error);
      throw error;
    }
  },
  async clearCart({ commit }) {
    commit('CART_REQUEST');
    try {
      const response = await apiClient.delete('/cart');
      // API trả về cart rỗng hoặc message, commit giỏ hàng rỗng
      commit('CART_SUCCESS', response.data?.items ? response.data : { items: [], totalPrice: 0 });
    } catch (error) {
      commit('CART_ERROR', error);
    }
  },

  // Reset state và localStorage (dùng khi logout hoặc checkout thành công)
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