// store/modules/distributor.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  // Lưu thông tin nhà phân phối liên kết với user hiện tại
  // Có thể lấy từ user profile hoặc API riêng
  myDistributorInfo: null,
  // Danh sách yêu cầu đăng ký (cho admin)
  distributorRequests: [],
  loading: false,
  error: null,
};

const getters = {
  myDistributorInfo: (state) => state.myDistributorInfo,
  distributorRequests: (state) => state.distributorRequests,
  isLoading: (state) => state.loading,
  distributorError: (state) => state.error,
};

const mutations = {
  DISTRIBUTOR_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  SET_MY_DISTRIBUTOR_INFO: (state, info) => {
    state.myDistributorInfo = info; // info có thể là object hoặc null
    state.loading = false;
    state.error = null;
  },
  CLEAR_MY_DISTRIBUTOR_INFO: (state) => {
    state.myDistributorInfo = null;
    state.loading = false;
    state.error = null;
  },
  SET_DISTRIBUTOR_REQUESTS: (state, requests) => {
    state.distributorRequests = Array.isArray(requests) ? requests : [];
    state.loading = false;
    state.error = null;
  },
  // Mutation để cập nhật một yêu cầu trong danh sách (sau khi admin duyệt)
  UPDATE_DISTRIBUTOR_REQUEST: (state, updatedUserWithRequestInfo) => {
     const index = state.distributorRequests.findIndex(req => req._id === updatedUserWithRequestInfo._id);
     if (index !== -1) {
         // Cập nhật thông tin user trong danh sách request
         state.distributorRequests.splice(index, 1, updatedUserWithRequestInfo);
     }
     state.loading = false;
  },
  DISTRIBUTOR_ERROR: (state, error) => {
    state.loading = false;
    state.error = error?.response?.data?.message || error?.message || 'Lỗi xử lý nhà phân phối';
  }
};

const actions = {
  // Action cho user đăng ký làm nhà phân phối
  async registerDistributor({ commit }, distributorData) {
    commit('DISTRIBUTOR_REQUEST');
    try {
      // API này có thể chỉ trả về message thành công hoặc thông tin user đã cập nhật
      const response = await apiClient.post('/users/distributor', distributorData); // Endpoint này cần xem lại backend
      // Không commit gì vào state distributor ở đây vì cần admin duyệt
      // Có thể commit thành công vào root state nếu có
      // dispatch('setSuccess', 'Đăng ký thành công, chờ phê duyệt', { root: true });
      return response.data; // Trả về response data (có thể là user hoặc message)
    } catch (error) {
      console.error("Lỗi đăng ký nhà phân phối:", error);
      commit('DISTRIBUTOR_ERROR', error);
      throw error;
    }
  },

  // Action cho user lấy thông tin distributor của mình (nếu có)
  async fetchMyDistributorInfo({ commit, rootGetters }) {
    // Có thể lấy từ profile user đã có trong state auth
    const currentUser = rootGetters['auth/currentUser'];
    if (currentUser && currentUser.distributorInfo) {
        commit('SET_MY_DISTRIBUTOR_INFO', currentUser.distributorInfo);
        return currentUser.distributorInfo;
    } else {
        // Hoặc gọi API riêng nếu cần thông tin chi tiết hơn
        commit('DISTRIBUTOR_REQUEST');
        try {
            // Giả sử API profile trả về đủ thông tin
            const response = await apiClient.get('/users/profile');
            const info = response.data?.distributorInfo || null; // Lấy từ response.data
            commit('SET_MY_DISTRIBUTOR_INFO', info);
            return info;
        } catch (error) {
             console.error("Lỗi fetch thông tin nhà phân phối:", error);
             commit('DISTRIBUTOR_ERROR', error);
             commit('CLEAR_MY_DISTRIBUTOR_INFO'); // Xóa nếu lỗi
             return null;
        }
    }
  },

  // --- Admin actions ---

  // Lấy danh sách yêu cầu chờ duyệt
  async fetchDistributorRequests({ commit }) {
    commit('DISTRIBUTOR_REQUEST');
    try {
      // Endpoint này cần xem lại backend, ví dụ /admin/distributors/pending
      const response = await apiClient.get('/users/getDistributor'); // API này trả về danh sách user có request
      commit('SET_DISTRIBUTOR_REQUESTS', response.data); // Commit response.data (mảng user)
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu cầu:", error);
      commit('DISTRIBUTOR_ERROR', error);
      commit('SET_DISTRIBUTOR_REQUESTS', []); // Set rỗng khi lỗi
      throw error;
    }
  },

  // Admin duyệt hoặc từ chối yêu cầu
  async manageDistributorRequest({ commit, dispatch }, { userId, status }) {
    commit('DISTRIBUTOR_REQUEST');
    try {
      // Endpoint này cần xem lại backend
      const response = await apiClient.put(`/users/${userId}/approve-distributor`, { status });
      // API trả về user đã được cập nhật (với role mới hoặc trạng thái request)
      // Cập nhật lại user trong danh sách requests
      commit('UPDATE_DISTRIBUTOR_REQUEST', response.data.user || response.data); // Commit response.data

      // Cũng có thể cập nhật user trong module user nếu cần
      // dispatch('user/updateUserInList', response.data.user || response.data, { root: true }); // Cần action tương ứng

      // dispatch('setSuccess', 'Cập nhật trạng thái thành công', { root: true });
      return response.data;
    } catch (error) {
      console.error("Lỗi xử lý yêu cầu:", error);
      commit('DISTRIBUTOR_ERROR', error);
      throw error;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};