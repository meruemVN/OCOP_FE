// store/modules/admin.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  // --- Dữ liệu trang list đầy đủ ---
  users: [],
  usersPagination: { page: 1, pages: 1, count: 0, limit: 10 },
  products: [],
  productsPagination: { page: 1, pages: 1, count: 0, limit: 10 },
  orders: { orders: [], page: 1, pages: 1, count: 0, limit: 10 },
  distributorRequests: { users: [], page: 1, pages: 1, count: 0, limit: 10 },

  // --- Dữ liệu Dashboard ---
  dashboardStats: { totalOrders: 0, totalUsers: 0, totalProducts: 0, totalRevenue: 0 },
  recentOrdersDashboard: [],
  recentProductsDashboard: [],
  recentUsersDashboard: [],
  pendingDistributorRequestsDashboard: [],

  // --- Loading state cho list pages ---
  loadingUsers: false,
  loadingProducts: false,
  loadingOrders: false,
  loadingDistributorRequests: false,

  // --- Loading state cho Dashboard ---
  loadingStatsDashboard: false,
  loadingRecentOrdersDashboard: false,
  loadingRecentProductsDashboard: false,
  loadingRecentUsersDashboard: false,
  loadingPendingDistributorRequestsDashboard: false,

  // --- Lỗi chung ---
  error: null,
};

const getters = {
  // List pages
  allUsers: (s) => s.users,
  usersPaginationInfo: (s) => s.usersPagination,
  allProducts: (s) => s.products,
  productsPaginationInfo: (s) => s.productsPagination,
  allOrdersList: (s) => s.orders.orders,
  allOrdersPagination: (s) => ({
    page: s.orders.page,
    pages: s.orders.pages,
    count: s.orders.count,
    limit: s.orders.limit
  }),
  allDistributorRequests: (s) => s.distributorRequests.users,
  distributorRequestsPaginationInfo: (s) => ({
    page: s.distributorRequests.page,
    pages: s.distributorRequests.pages,
    count: s.distributorRequests.count,
    limit: s.distributorRequests.limit
  }),

  // Dashboard data
  dashboardStats: (s) => s.dashboardStats,
  recentOrdersDashboard: (s) => s.recentOrdersDashboard,
  recentProductsDashboard: (s) => s.recentProductsDashboard,
  recentUsersDashboard: (s) => s.recentUsersDashboard,
  pendingDistributorRequestsDashboard: (s) => s.pendingDistributorRequestsDashboard,

  // Loading (list)
  isLoadingUsers: (s) => s.loadingUsers,
  isLoadingProducts: (s) => s.loadingProducts,
  isLoadingOrders: (s) => s.loadingOrders,
  isLoadingDistributorRequests: (s) => s.loadingDistributorRequests,

  // Loading (Dashboard)
  isLoadingStats: (s) => s.loadingStatsDashboard,
  isLoadingRecentOrdersDashboard: (s) => s.loadingRecentOrdersDashboard,
  isLoadingRecentProductsDashboard: (s) => s.loadingRecentProductsDashboard,
  isLoadingRecentUsersDashboard: (s) => s.loadingRecentUsersDashboard,
  isLoadingPendingDistributorRequestsDashboard: (s) => s.loadingPendingDistributorRequestsDashboard,

  adminError: (s) => s.error,
};

const mutations = {
  // generic
  REQUEST_INITIATED(state, loadingKey) {
    if (loadingKey in state) state[loadingKey] = true;
    state.error = null;
  },
  REQUEST_COMPLETED(state, loadingKey) {
    if (loadingKey in state) state[loadingKey] = false;
  },
  REQUEST_FAILURE(state, { loadingKey, error }) {
    if (loadingKey in state) state[loadingKey] = false;
    state.error = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
  },

  // List pages
  SET_ADMIN_USERS(state, payload) {
    state.users = payload.users || payload.data || [];
    state.usersPagination = {
      page: payload.page, pages: payload.pages, count: payload.count, limit: payload.limit
    };
  },
  SET_ADMIN_PRODUCTS(state, payload) {
    state.products = payload.products || payload.data || [];
    state.productsPagination = {
      page: payload.page, pages: payload.pages, count: payload.count, limit: payload.limit
    };
  },
  SET_ADMIN_ORDERS(state, payload) {
    state.orders = {
      orders: payload.orders || [],
      page: payload.page, pages: payload.pages, count: payload.count, limit: payload.limit
    };
  },
  SET_ADMIN_DISTRIBUTOR_REQUESTS(state, payload) {
    state.distributorRequests = {
      users: payload.users || payload.data || [],
      page: payload.page, pages: payload.pages, count: payload.count, limit: payload.limit
    };
  },

  // Dashboard
  SET_DASHBOARD_STATS(state, data) {
    state.dashboardStats = { ...state.dashboardStats, ...data };
  },
  SET_RECENT_ORDERS_DASHBOARD(state, list) {
    state.recentOrdersDashboard = list || [];
  },
  SET_RECENT_PRODUCTS_DASHBOARD(state, list) {
    state.recentProductsDashboard = list || [];
  },
  SET_RECENT_USERS_DASHBOARD(state, list) {
    state.recentUsersDashboard = list || [];
  },
  SET_PENDING_DISTR_REQ_DASHBOARD(state, list) {
    state.pendingDistributorRequestsDashboard = list || [];
  },

  // Cập nhật/xóa user trong tất cả các list
  UPDATE_ADMIN_USER_IN_LISTS(state, user) {
    const up = (arr, key='users') => {
      const idx = arr.findIndex(u => u._id === user._id);
      if (idx !== -1) arr.splice(idx, 1, user);
    };
    up(state.users);
    up(state.recentUsersDashboard);
    up(state.distributorRequests.users);
    up(state.pendingDistributorRequestsDashboard, 'users');
  },
  REMOVE_ADMIN_USER_FROM_LISTS(state, userId) {
    const rm = arr => arr.filter(u => u._id !== userId);
    state.users = rm(state.users);
    state.recentUsersDashboard = rm(state.recentUsersDashboard);
    state.distributorRequests.users = rm(state.distributorRequests.users);
    state.pendingDistributorRequestsDashboard = rm(state.pendingDistributorRequestsDashboard);
  },
};

const actions = {
  // --- Users list ---
  async fetchUsers({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingUsers');
    try {
      const { data } = await apiClient.get('/admin/users', { params });
      commit('SET_ADMIN_USERS', data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingUsers', error: err });
      throw err;
    } finally {
      commit('REQUEST_COMPLETED', 'loadingUsers');
    }
  },
  async deleteUser({ commit }, userId) {
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      commit('REMOVE_ADMIN_USER_FROM_LISTS', userId);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: null, error: err });
      throw err;
    }
  },

  // --- Products list ---
  async fetchProducts({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingProducts');
    try {
      const { data } = await apiClient.get('/admin/products', { params });
      commit('SET_ADMIN_PRODUCTS', data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingProducts', error: err });
      throw err;
    } finally {
      commit('REQUEST_COMPLETED', 'loadingProducts');
    }
  },
  async deleteProduct({ commit, dispatch }, id) {
    try {
      await apiClient.delete(`/admin/products/${id}`);
      // sau khi xóa, refres hlist
      dispatch('fetchProducts', { page: state.productsPagination.page });
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: null, error: err });
      throw err;
    }
  },

  // --- Orders list ---
  async fetchOrders({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingOrders');
    try {
      const { data } = await apiClient.get('/admin/orders', { params });
      commit('SET_ADMIN_ORDERS', data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingOrders', error: err });
      throw err;
    } finally {
      commit('REQUEST_COMPLETED', 'loadingOrders');
    }
  },
  async updateOrderStatus({ commit, dispatch, state }, { orderId, statusData }) {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, statusData);
      // reload current page
      const { page, limit } = state.orders;
      dispatch('fetchOrders', { page, limit });
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: null, error: err });
      throw err;
    }
  },

  // --- Distributor Requests list ---
  async fetchDistributorRequests({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingDistributorRequests');
    try {
      const query = {
        role: 'distributor',
        'distributorInfo.status': params.status || 'pending',
        page: params.page, limit: params.limit
      };
      const { data } = await apiClient.get('/admin/users', { params: query });
      commit('SET_ADMIN_DISTRIBUTOR_REQUESTS', data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingDistributorRequests', error: err });
      throw err;
    } finally {
      commit('REQUEST_COMPLETED', 'loadingDistributorRequests');
    }
  },
  async manageDistributorRequest({ commit, dispatch, state }, { userId, status }) {
    try {
      const { data } = await apiClient.put(`/admin/users/${userId}/distributor-status`, { status });
      commit('UPDATE_ADMIN_USER_IN_LISTS', data.user || data);
      // reload pending
      dispatch('fetchDistributorRequests', {
        status: 'pending',
        page: state.distributorRequests.page,
        limit: state.distributorRequests.limit
      });
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: null, error: err });
      throw err;
    }
  },

  // --- Dashboard ---
  async fetchDashboardStats({ commit }) {
    commit('REQUEST_INITIATED', 'loadingStatsDashboard');
    try {
      const { data } = await apiClient.get('/admin/stats');
      commit('SET_DASHBOARD_STATS', data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingStatsDashboard', error: err });
    } finally {
      commit('REQUEST_COMPLETED', 'loadingStatsDashboard');
    }
  },
  async fetchOrdersForDashboard({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingRecentOrdersDashboard');
    try {
      const { data } = await apiClient.get('/admin/orders', { params });
      commit('SET_RECENT_ORDERS_DASHBOARD', data.orders);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingRecentOrdersDashboard', error: err });
    } finally {
      commit('REQUEST_COMPLETED', 'loadingRecentOrdersDashboard');
    }
  },
  async fetchProductsForDashboard({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingRecentProductsDashboard');
    try {
      const { data } = await apiClient.get('/admin/products', { params });
      commit('SET_RECENT_PRODUCTS_DASHBOARD', data.products || data.data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingRecentProductsDashboard', error: err });
    } finally {
      commit('REQUEST_COMPLETED', 'loadingRecentProductsDashboard');
    }
  },
  async fetchUsersForDashboard({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingRecentUsersDashboard');
    try {
      const { data } = await apiClient.get('/admin/users', { params });
      commit('SET_RECENT_USERS_DASHBOARD', data.users || data.data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingRecentUsersDashboard', error: err });
    } finally {
      commit('REQUEST_COMPLETED', 'loadingRecentUsersDashboard');
    }
  },
  async fetchPendingDistributorRequestsForDashboard({ commit }, params = {}) {
    commit('REQUEST_INITIATED', 'loadingPendingDistributorRequestsDashboard');
    try {
      const query = {
        role: 'distributor',
        'distributorInfo.status': 'pending',
        page: 1, limit: params.limit
      };
      const { data } = await apiClient.get('/admin/users', { params: query });
      commit('SET_PENDING_DISTR_REQ_DASHBOARD', data.users || data.data);
    } catch (err) {
      commit('REQUEST_FAILURE', { loadingKey: 'loadingPendingDistributorRequestsDashboard', error: err });
    } finally {
      commit('REQUEST_COMPLETED', 'loadingPendingDistributorRequestsDashboard');
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