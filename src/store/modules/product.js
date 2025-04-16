// store/modules/product.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn đúng

const state = {
  products: [], // Mảng chứa danh sách sản phẩm (ví dụ: cho trang danh sách)
  product: null, // Chi tiết sản phẩm đang xem
  // State cho kết quả tìm kiếm và phân trang
  searchResults: {
    products: [], // Mảng sản phẩm từ kết quả tìm kiếm/phân trang
    page: 1,
    pages: 1,
    count: 0
  },
  loading: false, // Trạng thái loading riêng cho product module
  error: null,   // Lỗi riêng cho product module
};

const getters = {
  allProducts: (state) => state.products,
  productDetail: (state) => state.product,
  // Getter cho kết quả tìm kiếm (bao gồm cả phân trang)
  searchResults: (state) => state.searchResults,
  // Getter cho trạng thái loading/error của module này
  isProductLoading: (state) => state.loading,
  productError: (state) => state.error,
};

const mutations = {
  PRODUCT_REQUEST: (state) => {
    state.loading = true;
    state.error = null;
  },
  // Mutation cho việc lấy danh sách sản phẩm chung (nếu API trả về mảng)
  SET_PRODUCTS: (state, products) => {
    state.products = Array.isArray(products) ? products : []; // Đảm bảo là mảng
    state.loading = false;
    state.error = null;
  },
  // Mutation cho việc lấy chi tiết sản phẩm
  SET_PRODUCT: (state, product) => {
    state.product = product; // product có thể là object hoặc null
    state.loading = false;
    state.error = null;
  },
  // Mutation cho kết quả tìm kiếm/phân trang
  SET_SEARCH_RESULTS: (state, results) => {
    // Đảm bảo results có cấu trúc đúng { products, page, pages, count }
    if (results && typeof results === 'object' && Array.isArray(results.products)) {
      state.searchResults = results;
    } else {
      // Reset về mặc định nếu dữ liệu không đúng
      state.searchResults = { products: [], page: 1, pages: 1, count: 0 };
      console.error("SET_SEARCH_RESULTS received invalid data:", results);
    }
    state.loading = false;
    state.error = null;
  },
  // Mutation thêm sản phẩm mới (sau khi admin tạo)
  ADD_PRODUCT: (state, product) => {
    if (product && typeof product === 'object') {
      state.products.push(product); // Thêm vào danh sách chung
      // Có thể cập nhật searchResults nếu cần, hoặc để user tự search lại
    }
    state.loading = false;
  },
  // Mutation cập nhật sản phẩm (sau khi admin sửa)
  UPDATE_PRODUCT: (state, updatedProduct) => {
    if (updatedProduct && typeof updatedProduct === 'object') {
      // Cập nhật trong danh sách products
      const index = state.products.findIndex(p => p._id === updatedProduct._id);
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct);
      }
      // Cập nhật trong danh sách searchResults.products
      const searchIndex = state.searchResults.products.findIndex(p => p._id === updatedProduct._id);
       if (searchIndex !== -1) {
         state.searchResults.products.splice(searchIndex, 1, updatedProduct);
       }
      // Cập nhật chi tiết sản phẩm nếu đang xem
      if (state.product && state.product._id === updatedProduct._id) {
        state.product = updatedProduct;
      }
    }
    state.loading = false;
  },
  // Mutation xóa sản phẩm (sau khi admin xóa)
  REMOVE_PRODUCT: (state, productId) => {
    state.products = state.products.filter(p => p._id !== productId);
    state.searchResults.products = state.searchResults.products.filter(p => p._id !== productId);
    if (state.product && state.product._id === productId) {
      state.product = null;
    }
    state.loading = false;
  },
  PRODUCT_ERROR: (state, error) => {
    state.loading = false;
    state.error = error?.response?.data?.message || error?.message || 'Lỗi xử lý sản phẩm';
  }
};

const actions = {
  // Lấy danh sách sản phẩm chung (ví dụ: cho trang chủ)
  async fetchProducts({ commit }) { // Đổi tên từ getProducts để tránh trùng
    commit('PRODUCT_REQUEST');
    try {
      // Giả sử API này trả về trực tiếp mảng sản phẩm
      const response = await apiClient.get('/products');
      // Commit response.data (phải là mảng)
      commit('SET_PRODUCTS', response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi fetchProducts:", error);
      commit('PRODUCT_ERROR', error);
      throw error; // Ném lỗi để component xử lý
    }
  },

  // Lấy chi tiết sản phẩm
  async fetchProductById({ commit }, productId) { // Đổi tên từ getProductById
    commit('PRODUCT_REQUEST');
    commit('SET_PRODUCT', null); // Xóa product cũ trước khi fetch
    try {
      const response = await apiClient.get(`/products/${productId}`);
      // Commit response.data (phải là object sản phẩm)
      commit('SET_PRODUCT', response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi fetchProductById:", error);
      commit('PRODUCT_ERROR', error);
      throw error;
    }
  },

  // Tìm kiếm/Phân trang sản phẩm
  async searchProducts({ commit }, searchParams = {}) {
    commit('PRODUCT_REQUEST');
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await apiClient.get(`/products/search?${queryParams}`); // Endpoint tìm kiếm

      console.log('[ACTION searchProducts] API Response:', response);

      // Commit response.data (phải là object { products, page, pages, count })
      if (response.data && typeof response.data === 'object' && response.data.products) {
        commit('SET_SEARCH_RESULTS', response.data);
        return response.data; // Trả về cả object
      } else {
         console.error('[ACTION searchProducts] Invalid response data structure:', response.data);
         throw new Error('Dữ liệu tìm kiếm không đúng định dạng');
      }
    } catch (error) {
      console.error("Lỗi searchProducts:", error);
      commit('PRODUCT_ERROR', error);
      // Commit state rỗng để tránh lỗi hiển thị
      commit('SET_SEARCH_RESULTS', { products: [], page: 1, pages: 1, count: 0 });
      throw error;
    }
  },

  // --- Seller/Admin actions ---
  async createProduct({ commit }, productData) {
    commit('PRODUCT_REQUEST');
    try {
      const response = await apiClient.post('/products', productData);
      // Commit response.data (là object product mới)
      commit('ADD_PRODUCT', response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi createProduct:", error);
      commit('PRODUCT_ERROR', error);
      throw error;
    }
  },

  async updateProduct({ commit }, { productId, productData }) {
    commit('PRODUCT_REQUEST');
    try {
      const response = await apiClient.put(`/products/${productId}`, productData);
      // Commit response.data (là object product đã update)
      commit('UPDATE_PRODUCT', response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi updateProduct:", error);
      commit('PRODUCT_ERROR', error);
      throw error;
    }
  },

  async deleteProduct({ commit }, productId) {
    commit('PRODUCT_REQUEST');
    try {
      await apiClient.delete(`/products/${productId}`);
      // Commit productId để xóa khỏi state
      commit('REMOVE_PRODUCT', productId);
    } catch (error) {
      console.error("Lỗi deleteProduct:", error);
      commit('PRODUCT_ERROR', error);
      throw error;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};