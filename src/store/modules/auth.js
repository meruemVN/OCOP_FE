import authService from '@/services/auth.service';

const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null
};

const getters = {
  isLoggedIn: state => !!state.token,
  currentUser: state => state.user,
  isAdmin: state => state.user && state.user.role === 'admin',
  isSeller: state => state.user && state.user.role === 'seller',
  isDistributor: state => state.user && state.user.role === 'distributor',
  authLoading: state => state.loading,
  authError: state => state.error
};

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('setLoading', true);
      const response = await authService.login(credentials);
      
      commit('setToken', response.token);
      commit('setUser', response);
      commit('setError', null);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async register({ commit }, userData) {
    try {
      commit('setLoading', true);
      const response = await authService.register(userData);
      
      commit('setToken', response.token);
      commit('setUser', response);
      commit('setError', null);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  logout({ commit }) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    commit('setToken', null);
    commit('setUser', null);
  },
  
  async updateProfile({ commit, state }, userData) {
    try {
      commit('setLoading', true);
      const response = await authService.updateProfile(userData);
      
      const updatedUser = { ...state.user, ...response };
      commit('setUser', updatedUser);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response;
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Cập nhật thất bại');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUser(state, user) {
    state.user = user;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};