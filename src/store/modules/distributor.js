// store/modules/distributor.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  myDistributorInfo: null,
  distributorRequests: [],
  // >> THÊM STATE THỐNG KÊ <<
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0, // Hoặc deliveredOrders tùy trạng thái cuối
    totalRevenue: 0,
    // Thêm các chỉ số khác nếu cần: revenueThisMonth, topSellingProducts, etc.
  },
  loading: false, // Loading chung cho module
  statsLoading: false, // Loading riêng cho thống kê
  error: null,
};

const getters = {
  myDistributorInfo: (state) => state.myDistributorInfo,
  distributorRequests: (state) => state.distributorRequests,
  distributorStats: (state) => state.stats, // << GETTER CHO THỐNG KÊ
  isLoading: (state) => state.loading,
  isStatsLoading: (state) => state.statsLoading, // << GETTER LOADING THỐNG KÊ
  distributorError: (state) => state.error,
};

const mutations = {
  DISTRIBUTOR_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  STATS_REQUEST: (state) => { 
    state.statsLoading = true; 
    state.error = null; 
  },
  SET_MY_DISTRIBUTOR_INFO: (state, info) => {
    state.myDistributorInfo = info;
    state.loading = false;
    state.error = null;
  },
  CLEAR_MY_DISTRIBUTOR_INFO: (state) => { // Thêm mutation này nếu cần (ví dụ khi logout hoặc hủy yêu cầu)
    state.myDistributorInfo = null;
    state.loading = false; // Có thể không cần reset loading/error ở đây
    state.error = null;
  },
  SET_DISTRIBUTOR_REQUESTS: (state, requests) => {
    state.distributorRequests = Array.isArray(requests) ? requests : [];
    state.loading = false;
    state.error = null;
  },
  UPDATE_DISTRIBUTOR_REQUEST: (state, updatedUserWithRequestInfo) => {
     // Kiểm tra đầu vào
     if (!updatedUserWithRequestInfo || typeof updatedUserWithRequestInfo !== 'object') return;

     const index = state.distributorRequests.findIndex(req => req._id === updatedUserWithRequestInfo._id);
     if (index !== -1) {
         state.distributorRequests.splice(index, 1, updatedUserWithRequestInfo);
     } else {
         // Có thể thêm user vào nếu chưa có (trường hợp danh sách chưa đầy đủ)
         // state.distributorRequests.push(updatedUserWithRequestInfo);
     }
     state.loading = false; // Nên reset loading ở cuối mutation liên quan đến request
  },
  SET_DISTRIBUTOR_STATS: (state, statsData) => {
    if (statsData && typeof statsData === 'object') {
       state.stats = { ...state.stats, ...statsData }; // Merge dữ liệu mới vào state.stats
    } else {
        console.error("SET_DISTRIBUTOR_STATS received invalid data:", statsData);
        // Reset về mặc định nếu dữ liệu sai
        state.stats = { totalOrders: 0, pendingOrders: 0, processingOrders: 0, shippedOrders: 0, totalRevenue: 0 };
    }
    state.statsLoading = false; // Kết thúc loading stats
    state.error = null;
  },
  REMOVE_DISTRIBUTOR_REQUEST: (state, userId) => { // Thêm mutation để xóa request khỏi list (khi admin duyệt xong hoặc user hủy)
     state.distributorRequests = state.distributorRequests.filter(req => req._id !== userId);
     // Không cần reset loading/error ở đây
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
      // Endpoint: POST /users/distributor (Đã đúng)
      const response = await apiClient.post('/users/distributor', distributorData);
      // Không commit vào state distributor, chỉ trả về kết quả
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng ký nhà phân phối:", error);
      commit('DISTRIBUTOR_ERROR', error);
      throw error;
    }
  },

   // Action cho user tự hủy yêu cầu đăng ký
   async deleteMyDistributorRequest({ commit }) { // Đổi tên action cho rõ ràng
     commit('DISTRIBUTOR_REQUEST');
     try {
       // Endpoint: DELETE /users/distributor (Đã đúng)
       const response = await apiClient.delete('/users/distributor');
       // Xóa thông tin distributor khỏi state user hiện tại
       commit('CLEAR_MY_DISTRIBUTOR_INFO');
       // Có thể xóa user khỏi danh sách distributorRequests nếu cần (nhưng thường admin mới quan tâm list này)
       // commit('REMOVE_DISTRIBUTOR_REQUEST', userId); // Cần userId nếu muốn xóa khỏi list admin
       return response.data; // Trả về message
     } catch (error) {
       console.error("Lỗi hủy yêu cầu nhà phân phối:", error);
       commit('DISTRIBUTOR_ERROR', error);
       throw error;
     }
   },


  // Action cho user lấy thông tin distributor của mình (nếu có)
  async fetchMyDistributorInfo({ commit, rootGetters }) {
    const currentUser = rootGetters['auth/currentUser'];
    // Ưu tiên lấy từ thông tin user đã có trong state auth
    if (currentUser?.distributorInfo) {
      // Chỉ commit nếu thông tin trong state distributor khác
      if (JSON.stringify(state.myDistributorInfo) !== JSON.stringify(currentUser.distributorInfo)) {
        commit('SET_MY_DISTRIBUTOR_INFO', currentUser.distributorInfo);
      }
      return currentUser.distributorInfo;
    } else {
      // Nếu không có trong state auth, gọi API profile để chắc chắn
      commit('DISTRIBUTOR_REQUEST');
      try {
        const response = await apiClient.get('/users/profile');
        const info = response.data?.distributorInfo || null;
        commit('SET_MY_DISTRIBUTOR_INFO', info);
        return info;
      } catch (error) {
           console.error("Lỗi fetch thông tin nhà phân phối từ profile:", error);
           commit('DISTRIBUTOR_ERROR', error);
           commit('CLEAR_MY_DISTRIBUTOR_INFO'); // Xóa nếu lỗi
           return null; // Không throw lỗi để tránh crash nếu chỉ là lấy thông tin
      }
    }
  },

  async fetchDistributorStats({ commit }) {
    commit('STATS_REQUEST'); // Bắt đầu loading stats
    try {
      // Gọi API backend để lấy thống kê (ví dụ: /api/distributors/stats/me)
      // API này cần được bảo vệ bằng middleware protect và chỉ trả về stats của user đó
      const response = await apiClient.get('/distributors/stats/me'); // << THAY ĐỔI ENDPOINT NẾU CẦN
      commit('SET_DISTRIBUTOR_STATS', response.data); // Commit response.data
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy thống kê nhà phân phối:", error);
      commit('DISTRIBUTOR_ERROR', error); // Commit lỗi chung
      // Không throw lỗi để component không crash
      return null;
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