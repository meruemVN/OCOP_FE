import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth';
import user from './modules/user';
import product from './modules/product';
import cart from './modules/cart';
import order from './modules/order';
import admin from './modules/admin';
import distributor from './modules/distributor';
import recommendation from './modules/recommendation'; // Module quan trọng

export default createStore({
  state: {
    error: null,
    loading: false,
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  getters: {
    authError: state => state.error,
    authLoading: state => state.loading,
  },
  actions: {
    setError({ commit }, error) {
      commit('SET_ERROR', error);
    },
    setLoading({ commit }, status) {
      commit('SET_LOADING', status);
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR');
    }
  },
  modules: {
    auth,
    admin,
    user,
    product,
    cart,
    order,
    distributor,
    recommendation 
  },
  plugins: [
    createPersistedState({
      // Chỉ định các state bạn muốn persist.
      paths: [
        'recommendation.lastViewedProductId', // Rất quan trọng: Persist lastViewedProductId
        'auth.user', // Ví dụ: persist thông tin người dùng
        'auth.token', // Ví dụ: persist token
        'cart.items' // Ví dụ: persist giỏ hàng
      ],
      // (Tùy chọn) storage: window.localStorage, // Mặc định là localStorage
      // (Tùy chọn) key: 'myAppVuexState', // Mặc định là 'vuex'
    })
  ]
});