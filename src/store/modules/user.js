// store/modules/user.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  userProfile: null, // Profile của user đang đăng nhập (có thể lấy từ auth state)
  users: [], // Danh sách user (cho admin)
  loading: false,
  error: null,
};

const getters = {
  userProfile: (state) => state.userProfile,
  allUsers: (state) => state.users, // Đổi tên getter cho rõ ràng
  isLoading: (state) => state.loading,
  userError: (state) => state.error,
  // Không cần getter isAdmin, isDistributor ở đây, dùng của module auth
};

const mutations = {
  USER_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  SET_USER_PROFILE: (state, profile) => {
    state.userProfile = profile; // profile là object hoặc null
    state.loading = false;
    state.error = null;
  },
  SET_USERS: (state, users) => {
    state.users = Array.isArray(users) ? users : [];
    state.loading = false;
    state.error = null;
  },
  // Thêm user mới vào danh sách (khi admin tạo)
  // ADD_USER(state, user) { ... }, // Tạm bỏ qua nếu chưa cần
  // Cập nhật user trong danh sách (khi admin sửa)
  UPDATE_USER_IN_LIST: (state, updatedUser) => { // Đổi tên mutation
    if (updatedUser && typeof updatedUser === 'object') {
      const index = state.users.findIndex(u => u._id === updatedUser._id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    }
    state.loading = false; // Có thể không cần set loading ở đây
  },
   // Xóa user khỏi danh sách (khi admin xóa)
  REMOVE_USER_FROM_LIST: (state, userId) => { // Đổi tên mutation
    state.users = state.users.filter(u => u._id !== userId);
    state.loading = false; // Có thể không cần set loading ở đây
  },
  USER_ERROR: (state, error) => {
    state.loading = false;
    state.error = error?.response?.data?.message || error?.message || 'Lỗi xử lý người dùng';
  },
   CLEAR_USER_PROFILE: (state) => { // Mutation để xóa profile khi logout
     state.userProfile = null;
   }
};

const actions = {
  // Lấy profile của user hiện tại
  async fetchUserProfile({ commit }) { // Đổi tên action
    commit('USER_REQUEST');
    try {
      const response = await apiClient.get('/users/profile');
      // Commit response.data (là object profile)
      commit('SET_USER_PROFILE', response.data);
      // Cũng cập nhật user trong auth state để đồng bộ
      commit('auth/SET_AUTH_USER', response.data, { root: true });
      return response.data;
    } catch (error) {
      console.error("Lỗi fetchUserProfile:", error);
      commit('USER_ERROR', error);
      commit('SET_USER_PROFILE', null); // Set null khi lỗi
      throw error;
    }
  },

  // User tự cập nhật profile
  async updateUserProfile({ commit, dispatch }, userData) {
    commit('USER_REQUEST');
    try {
      const response = await apiClient.put('/users/profile', userData);
      // Commit response.data (là object profile đã cập nhật)
      commit('SET_USER_PROFILE', response.data);
      // Cập nhật lại user trong auth state
      commit('auth/SET_AUTH_USER', response.data, { root: true });
      // dispatch('setSuccess', 'Cập nhật thành công', { root: true }); // Nếu có root action
      return response.data;
    } catch (error) {
      console.error("Lỗi updateUserProfile:", error);
      commit('USER_ERROR', error);
      // dispatch('setError', error.response?.data?.message || '...', { root: true });
      throw error;
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