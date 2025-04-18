// store/modules/admin.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  // State cho các dữ liệu admin cần quản lý
  users: [],
  products: [],
  orders: [],
  distributorRequests: [], // <<< State cho yêu cầu NPP
  dashboardStats: {
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      totalRevenue: 0,
  },
  // State loading riêng biệt
  loadingUsers: false,
  loadingProducts: false,
  loadingOrders: false,
  loadingStats: false,
  loadingDistributorRequests: false, // <<< Loading cho yêu cầu NPP
  error: null, // Lỗi chung cho module admin
};

const getters = {
  // Getters cho dữ liệu admin
  allUsers: (state) => state.users,
  allProducts: (state) => state.products,
  allOrders: (state) => state.orders,
  distributorRequests: (state) => state.distributorRequests || [], // <<< Getter cho yêu cầu NPP
  dashboardStats: (state) => state.dashboardStats,
  // Getters cho trạng thái loading
  isLoadingUsers: (state) => state.loadingUsers,
  isLoadingProducts: (state) => state.loadingProducts,
  isLoadingOrders: (state) => state.loadingOrders,
  isLoadingStats: (state) => state.loadingStats,
  isLoadingDistributorRequests: (state) => state.loadingDistributorRequests, // <<< Getter loading yêu cầu NPP
  adminError: (state) => state.error,
};

const mutations = {
  // Mutations cho Users
  ADMIN_USERS_REQUEST: (state) => { state.loadingUsers = true; state.error = null; },
  SET_ADMIN_USERS: (state, users) => { state.users = Array.isArray(users) ? users : []; state.loadingUsers = false; },
  UPDATE_ADMIN_USER: (state, updatedUser) => {
      if (updatedUser && typeof updatedUser === 'object') {
          const index = state.users.findIndex(u => u._id === updatedUser._id);
          if (index !== -1) {
              state.users.splice(index, 1, updatedUser);
          } else {
              // Optionally add if not found, though update implies it exists
              // state.users.push(updatedUser);
          }
      }
       // Không reset loading ở đây vì có thể được gọi từ action khác
  },
  REMOVE_ADMIN_USER: (state, userId) => {
      state.users = state.users.filter(u => u._id !== userId);
      // Không reset loading ở đây
   },

  // Mutations cho Products
  ADMIN_PRODUCTS_REQUEST: (state) => { state.loadingProducts = true; state.error = null; },
  SET_ADMIN_PRODUCTS: (state, products) => { state.products = Array.isArray(products) ? products : []; state.loadingProducts = false; },
  // ... mutations update/remove product ...

   // Mutations cho Orders
   ADMIN_ORDERS_REQUEST: (state) => { state.loadingOrders = true; state.error = null; },
   SET_ADMIN_ORDERS: (state, orders) => { state.orders = Array.isArray(orders) ? orders : []; state.loadingOrders = false; },
   // ... mutations update order status ...

   // Mutations cho Stats
   ADMIN_STATS_REQUEST: (state) => { state.loadingStats = true; state.error = null; },
   SET_ADMIN_STATS: (state, statsData) => { if (statsData) state.dashboardStats = { ...state.dashboardStats, ...statsData }; state.loadingStats = false; },

   // >>> Mutations cho Distributor Requests <<<
   ADMIN_DISTR_REQ_REQUEST: (state) => { state.loadingDistributorRequests = true; state.error = null; },
   SET_ADMIN_DISTRIBUTOR_REQUESTS: (state, requests) => { // <<== TÊN ĐÚNG
        console.log('[MUTATION admin/SET_ADMIN_DISTRIBUTOR_REQUESTS] Received requests:', requests);
        state.distributorRequests = Array.isArray(requests) ? requests : [];
        state.loadingDistributorRequests = false;
        state.error = null;
        console.log('[MUTATION admin/SET_ADMIN_DISTRIBUTOR_REQUESTS] State updated:', state.distributorRequests);
    },
    UPDATE_ADMIN_DISTRIBUTOR_REQUEST: (state, updatedUser) => { // <<== TÊN ĐÚNG
        console.log('[MUTATION admin/UPDATE_ADMIN_DISTRIBUTOR_REQUEST] Received user:', updatedUser);
        if (updatedUser && typeof updatedUser === 'object') {
            const index = state.distributorRequests.findIndex(req => req._id === updatedUser._id);
            if (index !== -1) {
                state.distributorRequests.splice(index, 1, updatedUser);
                console.log('[MUTATION admin/UPDATE_ADMIN_DISTRIBUTOR_REQUEST] Request updated in list.');
            } else {
                console.log('[MUTATION admin/UPDATE_ADMIN_DISTRIBUTOR_REQUEST] User not found in requests list.');
            }
        }
         // Không reset loading ở đây vì action cha sẽ làm
    },
    // Optional: Mutation để xóa request sau khi xử lý
    REMOVE_ADMIN_DISTRIBUTOR_REQUEST: (state, userId) => {
        state.distributorRequests = state.distributorRequests.filter(req => req._id !== userId);
         console.log(`[MUTATION admin/REMOVE_ADMIN_DISTRIBUTOR_REQUEST] Removed request for user ${userId}`);
    },

  // Mutation lỗi chung
  ADMIN_ERROR: (state, error) => {
    state.error = error?.response?.data?.message || error?.message || 'Lỗi Admin';
    state.loadingUsers = false;
    state.loadingProducts = false;
    state.loadingOrders = false;
    state.loadingStats = false;
    state.loadingDistributorRequests = false; // Reset tất cả loading khi có lỗi
  }
};

const actions = {
  // --- User Management Actions ---
  async fetchUsers({ commit }, params = {}) {
    commit('ADMIN_USERS_REQUEST');
    try {
      const response = await apiClient.get('/users', { params });
      commit('SET_ADMIN_USERS', response.data);
      return response.data;
    } catch (error) {
      console.error("Admin: Lỗi fetchUsers:", error);
      commit('ADMIN_ERROR', error);
      // commit('SET_ADMIN_USERS', []); // Mutation lỗi đã reset loading
      throw error;
    }
  },
  async fetchUserById({ commit }, userId) {
    commit('ADMIN_USERS_REQUEST');
    try {
      const response = await apiClient.get(`/users/${userId}`);
      commit('ADMIN_USERS_REQUEST'); // Reset loading/error thành công
      return response.data;
    } catch (error) {
      console.error("Admin: Lỗi fetchUserById:", error);
      commit('ADMIN_ERROR', error);
      throw error;
    }
  },
  async updateUser({ commit }, { userId, userData }) {
    commit('ADMIN_USERS_REQUEST');
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      commit('UPDATE_ADMIN_USER', response.data);
      return response.data;
    } catch (error) {
      console.error("Admin: Lỗi updateUser:", error);
      commit('ADMIN_ERROR', error);
      throw error;
    }
  },
  async deleteUser({ commit }, userId) {
    commit('ADMIN_USERS_REQUEST');
    try {
      await apiClient.delete(`/users/${userId}`);
      commit('REMOVE_ADMIN_USER', userId);
    } catch (error) {
      console.error("Admin: Lỗi deleteUser:", error);
      commit('ADMIN_ERROR', error);
      throw error;
    }
  },

   // --- Dashboard Stats Action ---
   async fetchDashboardStats({ commit }) {
     commit('ADMIN_STATS_REQUEST');
     try {
       const response = await apiClient.get('/admin/stats'); // Đảm bảo endpoint này tồn tại
       commit('SET_ADMIN_STATS', response.data);
       return response.data;
     } catch (error) {
       console.error("Admin: Lỗi fetchDashboardStats:", error);
       commit('ADMIN_ERROR', error);
       // Không throw để dashboard vẫn hiển thị phần khác
     }
   },

   // --- Actions quản lý Orders ---
   async fetchOrders({ commit }, params = {}) {
       commit('ADMIN_ORDERS_REQUEST');
       try {
           const response = await apiClient.get('/admin/orders', { params }); // Đảm bảo endpoint này tồn tại
           commit('SET_ADMIN_ORDERS', response.data); // Giả sử trả về { orders, page, pages, count }
           return response.data;
       } catch (error) {
            console.error("Admin: Lỗi fetchOrders:", error);
            commit('ADMIN_ERROR', error);
            // commit('SET_ADMIN_ORDERS', []); // Mutation lỗi đã reset
            throw error;
       }
   },
   // ... action update order status ...

   // --- Actions quản lý Products ---
   async fetchProducts({ commit }, params = {}) {
      commit('ADMIN_PRODUCTS_REQUEST');
       try {
           const response = await apiClient.get('/products', { params }); // Dùng chung API hoặc /admin/products
           commit('SET_ADMIN_PRODUCTS', response.data.products || response.data); // Xử lý cả phân trang và không
           return response.data;
       } catch (error) {
           console.error("Admin: Lỗi fetchProducts:", error);
           commit('ADMIN_ERROR', error);
           // commit('SET_ADMIN_PRODUCTS', []); // Mutation lỗi đã reset
           throw error;
       }
   },
   // ... actions create/update/delete product ...

   // --- Actions quản lý Distributor Requests ---
   async fetchDistributorRequests({ commit }, status = 'pending') { // Mặc định lấy pending
     commit('ADMIN_DISTR_REQ_REQUEST'); // <<== Dùng mutation riêng
     try {
      let endpoint = '/users/distributors/requests';
      // Kiểm tra status là chuỗi hợp lệ trước khi thêm vào query
      if (typeof status === 'string' && ['pending', 'approved', 'rejected'].includes(status)) {
          endpoint += `?status=${status}`;
      }
       const response = await apiClient.get(endpoint);
       console.log('[ACTION admin/fetchDistributorRequests] API Response Data:', response.data);
       console.log('[ACTION admin/fetchDistributorRequests] Preparing to commit:', response.data);

       // >> SỬA TÊN MUTATION Ở ĐÂY <<
       commit('SET_ADMIN_DISTRIBUTOR_REQUESTS', response.data);
       console.log('[ACTION admin/fetchDistributorRequests] Commit successful');

       return response.data;
     } catch (error) {
       console.error("Admin: Lỗi fetchDistributorRequests:", error);
       commit('ADMIN_ERROR', error);
       // commit('SET_ADMIN_DISTRIBUTOR_REQUESTS', []); // Mutation lỗi đã reset
       throw error;
     }
   },
   async manageDistributorRequest({ commit }, { userId, status }) { // Nhận userId và status
    // Có thể dùng loading riêng hoặc chung
    commit('ADMIN_DISTR_REQ_REQUEST'); // Bắt đầu loading cho request này
    // Hoặc commit('ADMIN_USERS_REQUEST'); nếu dùng loading chung cho user
    try {
      // Endpoint: PUT /users/:id/manage-distributor (Đảm bảo đúng)
      const response = await apiClient.put(`/users/${userId}/manage-distributor`, { status });
      const updatedUser = response.data.user || response.data; // Lấy user đã cập nhật
  
      console.log('[ACTION admin/manageDistributorRequest] User updated:', updatedUser);
  
      // Commit để cập nhật user trong danh sách requests hiện tại
      commit('UPDATE_ADMIN_DISTRIBUTOR_REQUEST', updatedUser);
  
      // Commit để cập nhật user trong danh sách user chung
      commit('UPDATE_ADMIN_USER', updatedUser);
  
      // Reset loading
      commit('ADMIN_DISTR_REQ_REQUEST'); // Gọi lại để set loading = false (cần sửa mutation này hoặc tạo mutation riêng)
      // Hoặc commit('ADMIN_USERS_REQUEST');
  
      return response.data; // Trả về kết quả
    } catch (error) {
      console.error("Admin: Lỗi manageDistributorRequest:", error);
      commit('ADMIN_ERROR', error); // Commit lỗi chung, sẽ reset tất cả loading
      throw error; // Ném lỗi để component xử lý
    }
  },
};

export default {
  namespaced: true, // Quan trọng cho admin module
  state,
  getters,
  mutations,
  actions
};