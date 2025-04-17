<template>
    <div class="admin-product-list container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h4 text-success fw-semibold mb-0">
          <i class="fas fa-boxes me-2"></i>Quản lý Sản phẩm
        </h1>
        <router-link :to="{ name: 'AdminProductCreate' }" class="btn btn-success"> {/* Giả sử có route tên AdminProductCreate */}
          <i class="fas fa-plus me-1"></i> Thêm sản phẩm mới
        </router-link>
      </div>
      <p class="text-muted mb-4">Xem, tìm kiếm, thêm, sửa, xóa sản phẩm trong hệ thống.</p>
  
      <!-- Filters and Search (Optional) -->
      <div class="card shadow-sm border-light mb-4">
          <div class="card-body">
              {/* TODO: Thêm các bộ lọc (danh mục, trạng thái) và ô tìm kiếm */}
              <div class="row g-2">
                  <div class="col-md-4">
                      <input type="text" class="form-control form-control-sm" placeholder="Tìm theo tên sản phẩm...">
                  </div>
                   <div class="col-md-3">
                      <select class="form-select form-select-sm">
                          <option value="">Tất cả danh mục</option>
                          {/* Load categories dynamically */}
                      </select>
                  </div>
                   <div class="col-md-2">
                       <button class="btn btn-sm btn-primary w-100">Tìm kiếm</button>
                   </div>
              </div>
          </div>
      </div>
  
  
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-2 text-muted">Đang tải sản phẩm...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i> Lỗi tải danh sách sản phẩm: {{ error }}
      </div>
  
      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-5 card border-light shadow-sm">
         <div class="card-body">
             <i class="fas fa-box-open fa-3x text-light mb-3"></i>
             <p class="text-muted">Không tìm thấy sản phẩm nào.</p>
             <router-link :to="{ name: 'AdminProductCreate' }" class="btn btn-success mt-2">
                 <i class="fas fa-plus me-1"></i> Thêm sản phẩm
             </router-link>
         </div>
      </div>
  
      <!-- Products Table -->
      <div v-else class="card shadow-sm border-light">
          <div class="table-responsive">
              <table class="table table-hover table-bordered align-middle mb-0">
                  <thead class="table-light">
                  <tr>
                      <th scope="col" class="ps-3" style="width: 40%;">Sản phẩm</th>
                      <th scope="col">Danh mục</th>
                      <th scope="col" class="text-end">Giá</th>
                      <th scope="col" class="text-center">Kho</th>
                       <th scope="col" class="text-center">Đã bán</th>
                      <th scope="col" class="text-center">Trạng thái</th>
                      <th scope="col" class="text-center" style="width: 120px;">Thao tác</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="product in products" :key="product._id">
                      <td class="ps-3">
                          <div class="d-flex align-items-center">
                             <img :src="getProductImage(product)"
                                  :alt="product.name"
                                  class="rounded border me-2 flex-shrink-0"
                                  style="width: 45px; height: 45px; object-fit: cover; background-color: #f8f9fa;"
                                  @error="onImageError">
                              <div>
                                  <router-link :to="{ name: 'AdminProductEdit', params: { id: product._id } }" class="fw-medium text-dark text-decoration-none product-name-link" :title="product.name">
                                      {{ product.name }}
                                  </router-link>
                                  <small class="d-block text-muted">ID: {{ product._id }}</small>
                              </div>
                          </div>
                      </td>
                      <td>{{ product.category || 'N/A' }}</td>
                      <td class="text-end">{{ formatCurrency(product.price) }}</td>
                      <td class="text-center">{{ product.countInStock }}</td>
                      <td class="text-center">{{ product.sold || 0 }}</td>
                      <td class="text-center">
                        <span class="badge rounded-pill" :class="product.countInStock > 0 ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'">
                          {{ product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng' }}
                        </span>
                        {/* Thêm trạng thái khác nếu cần (Ẩn/Hiện) */}
                      </td>
                      <td class="text-center">
                      <div class="btn-group btn-group-sm">
                          {/* Link đến trang sửa sản phẩm */}
                          <router-link :to="{ name: 'AdminProductEdit', params: { id: product._id } }" class="btn btn-outline-primary" title="Sửa">
                             <i class="fas fa-edit"></i>
                          </router-link>
                          <button class="btn btn-outline-danger" @click="confirmDeleteProduct(product)" title="Xóa">
                             <i class="fas fa-trash"></i>
                          </button>
                      </div>
                      </td>
                  </tr>
                  </tbody>
              </table>
        </div>
         {/* Pagination (Example using Bootstrap Pagination) */}
         <div class="card-footer bg-light" v-if="pagination.pages > 1">
             <nav aria-label="Product pagination">
               <ul class="pagination pagination-sm justify-content-center mb-0">
                 <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                   <a class="page-link" href="#" @click.prevent="changePage(pagination.page - 1)">Trước</a>
                 </li>
                 <li class="page-item" v-for="p in pagination.pages" :key="p" :class="{ active: pagination.page === p }">
                   <a class="page-link" href="#" @click.prevent="changePage(p)">{{ p }}</a>
                 </li>
                 <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
                   <a class="page-link" href="#" @click.prevent="changePage(pagination.page + 1)">Sau</a>
                 </li>
               </ul>
             </nav>
         </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { useToast } from 'vue-toastification';
  // Import icons
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faBoxes, faPlus, faEdit, faTrash, faBoxOpen, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
  
  library.add(faBoxes, faPlus, faEdit, faTrash, faBoxOpen, faExclamationTriangle);
  
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  const toast = useToast();
  
  const placeholderImage = '/images/placeholder.png';
  
  // --- Computed Properties from Store ---
  const products = computed(() => store.getters['admin/allProducts'] || []); // Lấy từ admin module
  const pagination = computed(() => store.getters['admin/productPagination'] || { page: 1, pages: 1 }); // Giả sử có getter này
  const isLoading = computed(() => store.getters['admin/isLoadingProducts']);
  const error = computed(() => store.getters['admin/adminError']);
  
  // --- Methods ---
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  const getProductImage = (product) => product.images?.[0] || placeholderImage;
  
  const onImageError = (event) => {
     event.target.src = placeholderImage;
  };
  
  const loadProducts = async (page = 1) => {
      try {
          // Gọi action fetchProducts từ admin module
          await store.dispatch('admin/fetchProducts', { page });
      } catch (err) {
          // Lỗi đã được xử lý trong action và state.error
          console.error("Component failed to load products.");
          // Toast có thể không cần thiết nếu component hiển thị lỗi từ state.error
      }
  };
  
  const confirmDeleteProduct = async (product) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        await store.dispatch('admin/deleteProduct', product._id);
        toast.success(`Đã xóa sản phẩm "${product.name}".`);
        // Không cần gọi lại loadProducts vì mutation đã xóa khỏi state
      } catch (err) {
        toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm.');
      }
    }
  };
  
  // Hàm xử lý chuyển trang
  const changePage = (newPage) => {
      if (newPage >= 1 && newPage <= pagination.value.pages && newPage !== pagination.value.page) {
          loadProducts(newPage);
           // Có thể cập nhật URL nếu muốn: router.push({ query: { page: newPage } })
      }
  };
  
  // --- Lifecycle Hook ---
  onMounted(() => {
     const pageFromQuery = parseInt(route.query.page) || 1; // Lấy trang từ URL nếu có
    loadProducts(pageFromQuery);
  });
  
  </script>
  
  <style scoped>
  .table th, .table td {
      vertical-align: middle;
  }
  .product-name-link {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* min-height: 2.8em; */ /* Có thể bỏ nếu không quá cần thiết */
    color: #212529;
    font-size: 0.95rem;
  }
  .product-name-link:hover {
      color: var(--bs-success);
  }
  .badge {
      font-size: 0.75em;
      font-weight: 600;
  }
  </style>