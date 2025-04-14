import api from '@/services/api'

const state = {
  userProfile: null,
  users: [],
  distributorRequests: []
}

const getters = {
  userProfile: state => state.userProfile,
  users: state => state.users,
  distributorRequests: state => state.users.filter(user => user.distributorRequest && !user.distributorRequest.approved),
  isAdmin: state => state.userProfile && state.userProfile.role === 'admin',
  isDistributor: state => state.userProfile && state.userProfile.role === 'distributor'
}

const mutations = {
  SET_USER_PROFILE(state, profile) {
    state.userProfile = profile
  },
  SET_USERS(state, users) {
    state.users = users
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user._id === updatedUser._id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user._id !== userId)
  }
}

const actions = {
  // Lấy thông tin hiện tại
  async getCurrentUser({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get('/users/me')
      commit('SET_USER_PROFILE', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy thông tin người dùng hiện tại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Lấy profile người dùng
  async getUserProfile({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get('/users/profile')
      commit('SET_USER_PROFILE', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy thông tin người dùng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Cập nhật profile người dùng
  async updateUserProfile({ commit, dispatch }, userData) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.put('/users/profile', userData)
      commit('SET_USER_PROFILE', data)
      // Update auth user data if profile is updated
      commit('auth/SET_USER', {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }, { root: true })
      dispatch('setSuccess', 'Cập nhật thông tin thành công', { root: true })
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Cập nhật thông tin thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Đăng ký làm nhà phân phối
  async registerDistributor({ dispatch }, distributorData) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.post('/users/distributor', distributorData)
      dispatch('setSuccess', 'Đăng ký làm nhà phân phối thành công! Vui lòng chờ phê duyệt', { root: true })
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Đăng ký làm nhà phân phối thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // --- Admin actions ---
  
  // Lấy danh sách người dùng
  async getUsers({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get('/users')
      commit('SET_USERS', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy danh sách người dùng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Lấy thông tin người dùng theo ID
  async getUserById({ dispatch }, userId) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get(`/users/${userId}`)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy thông tin người dùng', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Cập nhật thông tin người dùng (Admin)
  async updateUser({ commit, dispatch }, { userId, userData }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.put(`/users/${userId}`, userData)
      commit('UPDATE_USER', data)
      dispatch('setSuccess', 'Cập nhật người dùng thành công', { root: true })
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Cập nhật người dùng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Xóa người dùng
  async deleteUser({ commit, dispatch }, userId) {
    try {
      dispatch('setLoading', true, { root: true })
      await api.delete(`/users/${userId}`)
      commit('REMOVE_USER', userId)
      dispatch('setSuccess', 'Xóa người dùng thành công', { root: true })
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Xóa người dùng thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Phê duyệt nhà phân phối
  async approveDistributor({ commit, dispatch }, userId) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.put(`/users/${userId}/approve-distributor`)
      // Update user in list
      commit('UPDATE_USER', data)
      dispatch('setSuccess', 'Phê duyệt nhà phân phối thành công', { root: true })
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Phê duyệt nhà phân phối thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}