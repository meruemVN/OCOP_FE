import api from '@/services/api'

const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  isAdmin: state => state.user?.role === 'admin',
  isDistributor: state => state.user?.role === 'distributor',
  isLoggedIn: state => !!state.user
}

const mutations = {
  SET_USER(state, userData) {
    state.user = userData
    localStorage.setItem('user', JSON.stringify(userData))
  },
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.post('/users/login', credentials)
      
      commit('SET_USER', {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      })
      commit('SET_TOKEN', data.token)
      
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Đăng nhập thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async register({ commit, dispatch }, userData) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.post('/users/register', userData)
      
      commit('SET_USER', {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      })
      commit('SET_TOKEN', data.token)
      
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Đăng ký thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  logout({ commit }) {
    commit('LOGOUT')
  },
  
  initAuth({ commit, state }) {
    // No need to set auth header here as it's handled by api.js interceptor
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}