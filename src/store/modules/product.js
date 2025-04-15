import api from '@/services/api'

const state = {
  products: [],
  product: null,
  searchResults: {
    products: [],
    page: 1,
    pages: 1,
    count: 0
  }
}

const getters = {
  allProducts: state => state.products,
  productDetail: state => state.product,
  searchResults: state => state.searchResults
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_PRODUCT(state, product) {
    state.product = product
  },
  SET_SEARCH_RESULTS(state, results) {
    state.searchResults = results
  },
  ADD_PRODUCT(state, product) {
    state.products.push(product)
  },
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(product => product._id === updatedProduct._id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
    if (state.product && state.product._id === updatedProduct._id) {
      state.product = updatedProduct
    }
  },
  REMOVE_PRODUCT(state, productId) {
    state.products = state.products.filter(product => product._id !== productId)
    if (state.product && state.product._id === productId) {
      state.product = null
    }
  }
}

const actions = {
  async getProducts({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get('/products')
      commit('SET_PRODUCTS', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy danh sách sản phẩm', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async addToCart({ dispatch }, { productId, quantity }) {
    try {
      // Gọi action addToCart của module cart
      return await dispatch('cart/addToCart', { productId, quantity }, { root: true })
    } catch (error) {
      console.error('Error in product/addToCart:', error);
      throw error; // Re-throw để component xử lý
    }
  },

  async getProductById({ commit, dispatch }, productId) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.get(`/products/${productId}`)
      commit('SET_PRODUCT', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Không thể lấy thông tin sản phẩm', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async searchProducts({ commit, dispatch }, searchParams) {
    try {
      dispatch('setLoading', true, { root: true })
      // Build query string from search params
      const queryParams = new URLSearchParams()
      
      if (searchParams.keyword) queryParams.append('keyword', searchParams.keyword)
      if (searchParams.category) queryParams.append('category', searchParams.category)
      if (searchParams.minPrice) queryParams.append('minPrice', searchParams.minPrice)
      if (searchParams.maxPrice) queryParams.append('maxPrice', searchParams.maxPrice)
      if (searchParams.rating) queryParams.append('rating', searchParams.rating)
      if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy)
      if (searchParams.pageNumber) queryParams.append('pageNumber', searchParams.pageNumber)
      if (searchParams.pageSize) queryParams.append('pageSize', searchParams.pageSize)
      
      const data = await api.get(`/products/search?${queryParams.toString()}`)
      commit('SET_SEARCH_RESULTS', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Tìm kiếm sản phẩm thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // --- Seller/Admin actions ---
  
  async createProduct({ commit, dispatch }, productData) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.post('/products', productData)
      commit('ADD_PRODUCT', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Thêm sản phẩm thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async updateProduct({ commit, dispatch }, { productId, productData }) {
    try {
      dispatch('setLoading', true, { root: true })
      const data = await api.put(`/products/${productId}`, productData)
      commit('UPDATE_PRODUCT', data)
      return data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Cập nhật sản phẩm thất bại', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  async deleteProduct({ commit, dispatch }, productId) {
    try {
      dispatch('setLoading', true, { root: true })
      await api.delete(`/products/${productId}`)
      commit('REMOVE_PRODUCT', productId)
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Xóa sản phẩm thất bại', { root: true })
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