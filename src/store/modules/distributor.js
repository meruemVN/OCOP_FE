import api from '@/services/api'

const state = {
  distributor: null
}

const getters = {
  distributorDetail: state => state.distributor
}

const mutations = {
  SET_DISTRIBUTOR(state, distributor) {
    state.distributor = distributor
  },
  CLEAR_DISTRIBUTOR(state) {
    state.distributor = null
  }
}

const actions = {
  // Đăng ký distributor
  async registerDistributor({ commit, dispatch }, distributorData) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.post('/users/distributor', distributorData)
      commit('SET_DISTRIBUTOR', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Đăng ký nhà phân phối thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  // Lấy chi tiết distributor của user hiện tại
  async fetchMyDistributor({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get('/users/profile')
      if (data.distributorInfo) {
        commit('SET_DISTRIBUTOR', data.distributorInfo)
      } else {
        commit('CLEAR_DISTRIBUTOR')
      }
      return data.distributorInfo
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy thông tin nhà phân phối', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  // Xóa yêu cầu distributor (nếu cho phép người dùng hủy yêu cầu)
  async deleteDistributorRequest({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      // Giả định có API xóa distributorInfo cho user hiện tại
      await api.delete('/users/distributor')
      commit('CLEAR_DISTRIBUTOR')
      return true
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Xóa yêu cầu nhà phân phối thất bại', { root: true })
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