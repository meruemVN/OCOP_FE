// store/modules/auth.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng
import router from '@/router'; // Import router để điều hướng khi logout

// Helper function để lấy user từ localStorage an toàn
const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  // Kiểm tra xem storedUser có phải là một chuỗi JSON hợp lệ không rỗng không
  if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
    try {
      return JSON.parse(storedUser); // Chỉ parse nếu hợp lệ
    } catch (e) {
      console.error("Auth Module: Error parsing stored user data from localStorage:", e);
      localStorage.removeItem('user'); // Xóa dữ liệu không hợp lệ
      return null;
    }
  }
  return null; // Trả về null nếu không có hoặc không hợp lệ
};

const state = {
  // Lấy token an toàn
  token: localStorage.getItem('token') || null,
  // Sử dụng helper function để lấy user
  user: getStoredUser(), // <<== ĐÃ SỬA Ở ĐÂY
  status: localStorage.getItem('token') ? 'success' : '', // Trạng thái login ban đầu
  loading: false, // Thêm loading state riêng cho auth
};

const getters = {
  isLoggedIn: (state) => !!state.token && !!state.user,
  currentUser: (state) => state.user,
  token: (state) => state.token,
  authStatus: (state) => state.status,
  isLoading: (state) => state.loading,
  isAdmin: (state) => state.user?.role === 'admin',
  isDistributor: (state) => state.user?.role === 'distributor',
};

const mutations = {
  AUTH_REQUEST: (state) => {
    state.status = 'loading';
    state.loading = true;
  },
  AUTH_SUCCESS: (state, payload) => {
    console.log('[MUTATION] AUTH_SUCCESS: Received payload:', payload);
    if (payload && payload.token && payload._id) {
      state.status = 'success';
      state.token = payload.token;
      state.user = {
         _id: payload._id,
         name: payload.name,
         email: payload.email,
         role: payload.role
      };
      state.loading = false;
      try {
          localStorage.setItem('token', payload.token);
          localStorage.setItem('user', JSON.stringify(state.user)); // Lưu JSON hợp lệ
          console.log('[MUTATION] AUTH_SUCCESS: Token and user saved to localStorage.');
      } catch (e) {
          console.error('[MUTATION] AUTH_SUCCESS: Error saving to localStorage:', e);
      }
    } else {
       console.error('[MUTATION] AUTH_SUCCESS: Invalid payload received:', payload);
       state.status = 'error';
       state.loading = false;
       state.token = null;
       state.user = null;
       localStorage.removeItem('token');
       localStorage.removeItem('user');
    }
  },
  AUTH_ERROR: (state) => {
    state.status = 'error';
    state.loading = false;
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  LOGOUT: (state) => {
    state.status = '';
    state.token = null;
    state.user = null;
    state.loading = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  SET_AUTH_USER: (state, userData) => {
     if (userData && typeof userData === 'object') { // Kiểm tra trước khi gán
       if (state.user && state.user._id === userData._id) {
           state.user = { ...state.user, ...userData };
       } else {
           state.user = userData;
       }
       try {
           localStorage.setItem('user', JSON.stringify(state.user)); // Lưu JSON hợp lệ
       } catch(e) {
           console.error("Error saving updated user to localStorage:", e);
       }
     }
  }
};

const actions = {
  async login({ commit, dispatch }, credentials) {
    commit('AUTH_REQUEST');
    try {
      const response = await apiClient.post('/users/login', credentials);
      console.log('[ACTION login] API Response Data:', response.data);
      if (response.data && response.data.token && response.data._id) {
          console.log('[ACTION login] Committing AUTH_SUCCESS with:', response.data);
          commit('AUTH_SUCCESS', response.data);
          dispatch('cart/getCart', null, { root: true }); // Lấy giỏ hàng sau khi login
          return response.data;
      } else {
          console.error('[ACTION login] Invalid data structure in API response:', response.data);
          throw new Error('Dữ liệu đăng nhập trả về không hợp lệ.');
      }
    } catch (error) {
      console.error('[ACTION login] Error:', error);
      commit('AUTH_ERROR');
      throw error;
    }
  },

  async register({ commit, dispatch }, userData) {
    commit('AUTH_REQUEST');
    try {
      const response = await apiClient.post('/users/register', userData); // Giả sử endpoint là /users/register
      // Kiểm tra response data trước khi commit
       if (response.data && response.data.token && response.data._id) {
           commit('AUTH_SUCCESS', response.data);
           dispatch('cart/getCart', null, { root: true }); // Lấy giỏ hàng sau khi register
           return response.data;
       } else {
           console.error('[ACTION register] Invalid data structure in API response:', response.data);
           throw new Error('Dữ liệu đăng ký trả về không hợp lệ.');
       }
    } catch (error) {
      console.error('[ACTION register] Error:', error);
      commit('AUTH_ERROR');
      throw error;
    }
  },

  logout({ commit, dispatch }) {
    commit('LOGOUT');
    // Gọi các mutation reset/clear của module khác
    commit('cart/RESET_CART', null, { root: true });
    commit('order/CLEAR_MY_ORDERS', null, { root: true }); // Cần thêm mutation này vào order.js
    commit('user/CLEAR_USER_PROFILE', null, { root: true }); // Cần thêm mutation này vào user.js
    commit('distributor/CLEAR_MY_DISTRIBUTOR_INFO', null, { root: true }); // Cần thêm mutation này vào distributor.js
    router.push('/login'); // Điều hướng về login
  },

  async fetchAndUpdateUser({ commit, state }) {
     if (!state.token) return;
     commit('AUTH_REQUEST');
     try {
        const response = await apiClient.get('/users/profile');
        commit('SET_AUTH_USER', response.data);
        return response.data;
     } catch (error) {
         console.error("Error fetching profile for auth state:", error);
         commit('AUTH_ERROR'); // Commit lỗi để reset loading
         // Không cần throw ở đây, interceptor 401 sẽ xử lý logout nếu cần
     }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};