// store/modules/admin.js
import apiClient from '@/services/api';

const state = {
  // State cho các dữ liệu admin cần quản lý
  users: [], // Danh sách user (di chuyển từ user.js)
  products: [], // Danh sách sản phẩm (nếu admin quản lý chung)
  orders: [], // Danh sách tất cả đơn hàng (nếu admin quản lý)
  dashboardStats: { // Thống kê cho dashboard
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      totalRevenue: 0,
  },
  // State cho các danh sách khác (categories, coupons, etc.)
  // ...
  loadingUsers: false, // Loading state riêng cho từng phần
  loadingProducts: false,
  loadingOrders: false,
  loadingStats: false,
  error: null, // Lỗi chung cho module admin
};

const getters = {
  // Getters cho dữ liệu admin
  allUsers: (state) => state.users,
  allProducts: (state) => state.products,
  allOrders: (state) => state.orders,
  dashboardStats: (state) => state.dashboardStats,
  // Getters cho trạng thái loading
  isLoadingUsers: (state) => state.loadingUsers,
  isLoadingProducts: (state) => state.loadingProducts,
  isLoadingOrders: (state) => state.loadingOrders,
  isLoadingStats: (state) => state.loadingStats,
  adminError: (state) => state.error,
};

const mutations = {
  // Mutations cho Users
  ADMIN_USERS_REQUEST: (state) => { state.loadingUsers = true; state.error = null; },
  SET_ADMIN_USERS: (state, users) => { state.users = Array.isArray(users) ? users : []; state.loadingUsers = false; },
  UPDATE_ADMIN_USER: (state, updatedUser) => { /* ... logic update user trong state.users ... */ state.loadingUsers = false; },
  REMOVE_ADMIN_USER: (state, userId) => { /* ... logic remove user khỏi state.users ... */ state.loadingUsers = false; },

  // Mutations cho Products (ví dụ)
  ADMIN_PRODUCTS_REQUEST: (state) => { state.loadingProducts = true; state.error = null; },
  SET_ADMIN_PRODUCTS: (state, products) => { state.products = Array.isArray(products) ? products : []; state.loadingProducts = false; },
  // ... mutations update/remove product ...

   // Mutations cho Orders (ví dụ)
   ADMIN_ORDERS_REQUEST: (state) => { state.loadingOrders = true; state.error = null; },
   SET_ADMIN_ORDERS: (state, orders) => { state.orders = Array.isArray(orders) ? orders : []; state.loadingOrders = false; },
   // ... mutations update order status ...

   // Mutations cho Stats
   ADMIN_STATS_REQUEST: (state) => { state.loadingStats = true; state.error = null; },
   SET_ADMIN_STATS: (state, statsData) => { if (statsData) state.dashboardStats = { ...state.dashboardStats, ...statsData }; state.loadingStats = false; },

  ADMIN_ERROR: (state, error) => {
    state.error = error?.response?.data?.message || error?.message || 'Lỗi Admin';
    // Reset loading states khi có lỗi
    state.loadingUsers = false;
    state.loadingProducts = false;
    state.loadingOrders = false;
    state.loadingStats = false;
  }
};

const actions = {
  // --- User Management Actions (Di chuyển từ user.js) ---
  async fetchUsers({ commit }, params = {}) { // Thêm params cho phân trang/filter
    commit('ADMIN_USERS_REQUEST');
    try {
      // Endpoint: GET /api/users (Đã đúng) - Có thể thêm params
      const response = await apiClient.get('/users', { params });
      commit('SET_ADMIN_USERS', response.data);
      return response.data;
    } catch (error) {
      console.error("Admin: Lỗi fetchUsers:", error);
      commit('ADMIN_ERROR', error);
      commit('SET_ADMIN_USERS', []);
      throw error;
    }
  },
  async fetchUserById({ commit }, userId) { // Chỉ trả về data, không cần commit state
    commit('ADMIN_USERS_REQUEST'); // Vẫn set loading/error
    try {
      const response = await apiClient.get(`/users/${userId}`);
      commit('ADMIN_USERS_REQUEST'); // Reset loading/error
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
      // Endpoint: PUT /api/users/:id (Đã đúng)
      const response = await apiClient.put(`/users/${userId}`, userData);
      commit('UPDATE_ADMIN_USER', response.data); // Commit để cập nhật list
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
       // Endpoint: DELETE /api/users/:id (Đã đúng)
      await apiClient.delete(`/users/${userId}`);
      commit('REMOVE_ADMIN_USER', userId); // Commit để xóa khỏi list
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
       // Tạo API endpoint mới ở backend: GET /api/admin/stats
       const response = await apiClient.get('/admin/stats');
       commit('SET_ADMIN_STATS', response.data);
       return response.data;
     } catch (error) {
       console.error("Admin: Lỗi fetchDashboardStats:", error);
       commit('ADMIN_ERROR', error);
       // Không throw để dashboard vẫn hiển thị phần khác
     }
   },

   // --- Actions quản lý Orders (Ví dụ) ---
   async fetchOrders({ commit }, params = {}) {
       commit('ADMIN_ORDERS_REQUEST');
       try {
           // Tạo API endpoint mới: GET /api/admin/orders
           const response = await apiClient.get('/admin/orders', { params });
           commit('SET_ADMIN_ORDERS', response.data); // Giả sử API trả về { orders, page, pages, count }
           return response.data;
       } catch (error) {
            console.error("Admin: Lỗi fetchOrders:", error);
            commit('ADMIN_ERROR', error);
            commit('SET_ADMIN_ORDERS', []);
            throw error;
       }
   },
   // ... action update order status ...

   // --- Actions quản lý Products (Ví dụ) ---
   async fetchProducts({ commit }, params = {}) {
      commit('ADMIN_PRODUCTS_REQUEST');
       try {
           // API GET /api/products có thể dùng chung nhưng cần phân quyền ở backend
           // Hoặc tạo API riêng: GET /api/admin/products
           const response = await apiClient.get('/products', { params });
           commit('SET_ADMIN_PRODUCTS', response.data.products || response.data); // Xử lý cả trường hợp có/không có phân trang
           return response.data;
       } catch (error) {
           console.error("Admin: Lỗi fetchProducts:", error);
           commit('ADMIN_ERROR', error);
           commit('SET_ADMIN_PRODUCTS', []);
           throw error;
       }
   },
   // ... actions create/update/delete product (di chuyển từ product.js nếu admin quản lý)

   // --- Actions quản lý Distributor Requests (Di chuyển từ distributor.js) ---
   async fetchDistributorRequests({ commit }, status = '') {
     commit('DISTRIBUTOR_REQUEST'); // Có thể dùng mutation riêng ADMIN_DISTR_REQ_REQUEST
     try {
       let endpoint = '/users/distributors/requests'; // Endpoint admin
       if (status) endpoint += `?status=${status}`;
       const response = await apiClient.get(endpoint);
       commit('SET_DISTRIBUTOR_REQUESTS', response.data); // Cần mutation này trong admin.js
       return response.data;
     } catch (error) {
       console.error("Admin: Lỗi fetchDistributorRequests:", error);
       commit('ADMIN_ERROR', error); // Commit lỗi chung
       commit('SET_DISTRIBUTOR_REQUESTS', []); // Cần mutation này
       throw error;
     }
   },
   async manageDistributorRequest({ commit, dispatch }, { userId, status }) {
     commit('DISTRIBUTOR_REQUEST'); // Hoặc mutation riêng
     try {
       const response = await apiClient.put(`/users/${userId}/manage-distributor`, { status }); // Endpoint admin

       // Commit để cập nhật user trong danh sách users của admin module
       commit('UPDATE_ADMIN_USER', response.data.user || response.data);

       // Có thể xóa request khỏi danh sách pending requests (nếu cần)
       if (state.distributorRequests) { // Cần mutation SET_DISTRIBUTOR_REQUESTS trước
            commit('REMOVE_DISTRIBUTOR_REQUEST', userId); // Cần mutation này
       }

       return response.data;
     } catch (error) {
       console.error("Admin: Lỗi manageDistributorRequest:", error);
       commit('ADMIN_ERROR', error);
       throw error;
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