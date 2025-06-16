// src/store/modules/product.js
import apiClient from '@/services/api'; // Đảm bảo đường dẫn này đúng đến file apiClient của bạn

const state = {
  // Dữ liệu cho danh sách sản phẩm chính trên HomeView (có lọc, sắp xếp, phân trang)
  mainProductResults: {
    products: [],
    page: 1,
    pages: 0, // Tổng số trang, khởi tạo là 0
    count: 0  // Tổng số sản phẩm, khởi tạo là 0
  },
  productDetail: null, // Chi tiết sản phẩm khi xem một sản phẩm cụ thể
  loading: false,      // Trạng thái loading chung cho các action của module này
  error: null,         // Lỗi chung cho các action của module này

  // Các state khác nếu bạn có chức năng admin/seller quản lý sản phẩm trực tiếp từ frontend
  // ví dụ: allProductsForAdmin: [],
};

const getters = {
  // Getters cho HomeView
  mainProducts: (state) => state.mainProductResults.products,
  mainPagination: (state) => ({
    page: state.mainProductResults.page,
    pages: state.mainProductResults.pages,
    count: state.mainProductResults.count
  }),

  // Getter cho trang chi tiết sản phẩm
  productDetail: (state) => state.productDetail,

  // Getters cho trạng thái
  isProductLoading: (state) => state.loading,
  productError: (state) => state.error,

  // Getter cho danh sách sản phẩm của nhà phân phối (nếu cần)
  // distributorProducts: (state) => state.mainProductResults, // Tạm dùng chung cấu trúc
};

const mutations = {
  PRODUCT_REQUEST_START: (state) => {
    state.loading = true;
    state.error = null;
  },
  PRODUCT_REQUEST_SUCCESS: (state) => { // Dùng khi request thành công nhưng không set data cụ thể
    state.loading = false;
    state.error = null;
  },
  SET_MAIN_PRODUCTS_RESULTS: (state, results) => {
    if (results && typeof results === 'object' && Array.isArray(results.products)) {
      state.mainProductResults = {
          products: results.products || [],
          page: results.page || 1,
          pages: results.pages || 0,
          count: results.count || 0
      };
    } else {
      state.mainProductResults = { products: [], page: 1, pages: 0, count: 0 };
      // console.error("PRODUCT_STORE: SET_MAIN_PRODUCTS_RESULTS received invalid data:", results);
    }
    state.loading = false; // Đã có data (hoặc data rỗng hợp lệ), dừng loading
    state.error = null; // Xóa lỗi cũ nếu thành công
  },
  SET_PRODUCT_DETAIL: (state, product) => {
    state.productDetail = product; // product có thể là object hoặc null
    state.loading = false;
    state.error = null;
  },
  PRODUCT_REQUEST_FAIL: (state, errorPayload) => {
    state.loading = false;
    state.error = errorPayload?.error || errorPayload?.message || 'Đã xảy ra lỗi khi xử lý sản phẩm.';
  },
  RESET_PRODUCT_MODULE_STATE: (state) => {
    state.mainProductResults = { products: [], page: 1, pages: 0, count: 0 };
    state.productDetail = null;
    state.loading = false;
    state.error = null;
  },

  // Mutations cho chức năng quản lý sản phẩm (Admin/Distributor)
  ADD_PRODUCT_SUCCESS: (state, newProduct) => {
    // Tạm thời không thêm vào mainProductResults để tránh làm sai lệch hiển thị hiện tại
    // Component quản lý sản phẩm có thể fetch lại danh sách của họ
    state.loading = false;
    state.error = null;
    // Nếu bạn muốn cập nhật danh sách nào đó, ví dụ danh sách admin:
    // state.allProductsForAdmin.unshift(newProduct);
  },
  UPDATE_PRODUCT_SUCCESS: (state, updatedProduct) => {
    // Cập nhật trong mainProductResults nếu sản phẩm đó đang hiển thị
    const indexInMain = state.mainProductResults.products.findIndex(p => p._id === updatedProduct._id);
    if (indexInMain !== -1) {
      state.mainProductResults.products.splice(indexInMain, 1, updatedProduct);
    }
    // Cập nhật trong productDetail nếu đang xem sản phẩm đó
    if (state.productDetail && state.productDetail._id === updatedProduct._id) {
      state.productDetail = updatedProduct;
    }
    state.loading = false;
    state.error = null;
  },
  DELETE_PRODUCT_SUCCESS: (state, productId) => {
    state.mainProductResults.products = state.mainProductResults.products.filter(p => p._id !== productId);
    if (state.productDetail && state.productDetail._id === productId) {
      state.productDetail = null;
    }
    state.loading = false;
    state.error = null;
  }
};

const actions = {
  /**
   * Lấy danh sách sản phẩm chính cho HomeView hoặc các trang danh sách khác
   * với các bộ lọc, phân trang, sắp xếp.
   * Backend API: GET /api/products
   */
  async fetchMainProducts({ commit, state }, paramsFromComponent = {}) { // paramsFromComponent là object đã được chuẩn bị từ HomePage.vue
    commit('PRODUCT_REQUEST_START');
    // GHI ĐÈ CONTROLLER NẾU CÓ ĐỂ ABORT REQUEST CŨ
    // (Bỏ qua phần này nếu bạn không dùng AbortController trong state)
    // if (state.productController) {
    //   state.productController.abort();
    // }
    // const controller = new AbortController();
    // commit('SET_PRODUCT_CONTROLLER', controller); // Cần mutation SET_PRODUCT_CONTROLLER

    try {
      // SỬ DỤNG TRỰC TIẾP paramsFromComponent ĐÃ ĐƯỢC CHUẨN BỊ KỸ LƯỠNG TỪ COMPONENT
      // Component HomePage.vue đã xử lý việc thêm/bỏ page, per_page, keyword
      // và đã đặt tên các key đúng như backend mong đợi (ví dụ: origin, sort_by, per_page).

      // Chỉ cần đảm bảo các giá trị mặc định nếu paramsFromComponent rỗng hoặc thiếu
      const finalApiParams = {
        page: 1,       // Mặc định page 1
        per_page: 12,  // Mặc định 12 items (hoặc PAGE_SIZE từ component nếu bạn muốn truyền nó vào đây)
        ...paramsFromComponent // Ghi đè giá trị mặc định bằng các giá trị từ component
      };

      // Xóa các key null/undefined/rỗng từ finalApiParams
      Object.keys(finalApiParams).forEach(key => (finalApiParams[key] == null || finalApiParams[key] === '') && delete finalApiParams[key]);

      console.log("Vuex Action - Sending to API with finalApiParams:", JSON.stringify(finalApiParams));

      const response = await apiClient.get('/products', {
        params: finalApiParams,
        // signal: controller.signal, // Nếu dùng AbortController
      });

      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.products)) {
        commit('SET_MAIN_PRODUCTS_RESULTS', response.data);
        return response.data;
      } else {
        const errorData = { error: 'Dữ liệu sản phẩm nhận được không đúng định dạng.' };
        commit('PRODUCT_REQUEST_FAIL', errorData);
        throw errorData;
      }
    } catch (error) {
      commit('PRODUCT_REQUEST_FAIL', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  async fetchProductById({ commit }, productId) {
    commit('PRODUCT_REQUEST_START');
    commit('SET_PRODUCT_DETAIL', null); // Xóa chi tiết sản phẩm cũ
    try {
      const response = await apiClient.get(`/products/${productId}`);
      commit('SET_PRODUCT_DETAIL', response.data); // response.data là object sản phẩm
      return response.data;
    } catch (error) {
      commit('PRODUCT_REQUEST_FAIL', error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  
  clearProductState({ commit }){
      commit('RESET_PRODUCT_MODULE_STATE');
  },

  // --- Actions cho Nhà Phân Phối / Admin ---
  async createProduct({ commit }, productData) {
    commit('PRODUCT_REQUEST_START');
    try {
      const response = await apiClient.post('/products', productData); // Endpoint tạo sản phẩm
      commit('ADD_PRODUCT_SUCCESS', response.data); // response.data là sản phẩm vừa tạo
      return response.data;
    } catch (error) {
      commit('PRODUCT_REQUEST_FAIL', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  async updateProduct({ commit }, { productId, productData }) {
    commit('PRODUCT_REQUEST_START');
    try {
      const response = await apiClient.put(`/products/${productId}`, productData);
      commit('UPDATE_PRODUCT_SUCCESS', response.data); // response.data là sản phẩm đã cập nhật
      return response.data;
    } catch (error) {
      commit('PRODUCT_REQUEST_FAIL', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  async deleteProduct({ commit }, productId) {
    commit('PRODUCT_REQUEST_START');
    try {
      await apiClient.delete(`/products/${productId}`); // API không trả về body khi xóa thành công
      commit('DELETE_PRODUCT_SUCCESS', productId);
      commit('PRODUCT_REQUEST_SUCCESS'); // Chỉ để set loading=false, error=null
    } catch (error) {
      commit('PRODUCT_REQUEST_FAIL', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách sản phẩm của nhà phân phối đang đăng nhập.
   * Backend API: GET /api/products/my-products
   */
  async fetchMyProducts({ commit }, paramsFromComponent = {}) {
    commit('PRODUCT_REQUEST_START');
    try {
      const apiParams = {
        page: paramsFromComponent.pageNumber || 1,
        pageSize: paramsFromComponent.pageSize || 10, // Backend nhận pageSize ở route này
      };
      // console.log('[Product Store ACTION] fetchMyProducts - Calling API /products/my-products with params:', apiParams);
      const response = await apiClient.get('/products/my-products', { params: apiParams });

      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.products)) {
        // Có thể bạn muốn lưu vào một state khác, ví dụ `myProductsResults`
        // Hoặc dùng chung `mainProductResults` nếu trang "Sản phẩm của tôi" cũng dùng chung layout hiển thị
        // Hiện tại, tôi sẽ commit vào mainProductResults để HomeView có thể dùng tạm nếu cần
        // nhưng lý tưởng là nên có state riêng.
        commit('SET_MAIN_PRODUCTS_RESULTS', response.data);
        return response.data;
      } else {
         const errorData = { error: 'Dữ liệu sản phẩm của bạn không đúng định dạng.' };
         commit('PRODUCT_REQUEST_FAIL', errorData);
         throw errorData;
      }
    } catch (error) {
      commit('PRODUCT_REQUEST_FAIL', error.response?.data || error);
      throw error.response?.data || error;
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