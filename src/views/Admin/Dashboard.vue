<template>
  <div class="admin-dashboard container-fluid py-4">
    <h1 class="h3 mb-4 text-success fw-semibold">
      <i class="fas fa-tachometer-alt me-2"></i>Bảng điều khiển Quản trị
    </h1>

    <!-- Dashboard Overview Cards -->
    <div class="row g-4 mb-4">
      <div class="col-xl-3 col-md-6">
        <div class="card shadow-sm border-light h-100">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 me-3">
                <span class="bg-success-subtle text-success p-3 rounded-circle d-inline-flex align-items-center justify-content-center">
                  <i class="fas fa-receipt fa-lg"></i>
                </span>
              </div>
              <div class="flex-grow-1">
                <p class="text-muted mb-1 small">Tổng đơn hàng</p>
                <h4 v-if="!isLoadingStats" class="mb-0 fw-bold">{{ stats.totalOrders || 0 }}</h4>
                <div v-else class="placeholder-glow"><span class="placeholder col-4"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6">
        <div class="card shadow-sm border-light h-100">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 me-3">
                <span class="bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex align-items-center justify-content-center">
                  <i class="fas fa-users fa-lg"></i>
                </span>
              </div>
              <div class="flex-grow-1">
                <p class="text-muted mb-1 small">Người dùng</p>
                <h4 v-if="!isLoadingStats" class="mb-0 fw-bold">{{ stats.totalUsers || 0 }}</h4>
                <div v-else class="placeholder-glow"><span class="placeholder col-3"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6">
        <div class="card shadow-sm border-light h-100">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 me-3">
                 <span class="bg-info-subtle text-info p-3 rounded-circle d-inline-flex align-items-center justify-content-center">
                  <i class="fas fa-boxes fa-lg"></i>
                </span>
              </div>
              <div class="flex-grow-1">
                <p class="text-muted mb-1 small">Sản phẩm</p>
                <h4 v-if="!isLoadingStats" class="mb-0 fw-bold">{{ stats.totalProducts || 0 }}</h4>
                <div v-else class="placeholder-glow"><span class="placeholder col-4"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6">
        <div class="card shadow-sm border-light h-100">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0 me-3">
                 <span class="bg-warning-subtle text-warning p-3 rounded-circle d-inline-flex align-items-center justify-content-center">
                   <i class="fas fa-dollar-sign fa-lg"></i>
                </span>
              </div>
              <div class="flex-grow-1">
                <p class="text-muted mb-1 small">Tổng Doanh thu</p>
                <h4 v-if="!isLoadingStats" class="mb-0 fw-bold">{{ formatCurrency(stats.totalRevenue) }}</h4>
                 <div v-else class="placeholder-glow"><span class="placeholder col-6"></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <ul class="nav nav-tabs mb-4" id="adminTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="orders-tab-btn" data-bs-toggle="tab" data-bs-target="#orders-tab-pane" type="button" role="tab" aria-controls="orders-tab-pane" aria-selected="true">
           <i class="fas fa-list-alt me-1"></i> Đơn hàng
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="products-tab-btn" data-bs-toggle="tab" data-bs-target="#products-tab-pane" type="button" role="tab" aria-controls="products-tab-pane" aria-selected="false">
            <i class="fas fa-box me-1"></i> Sản phẩm
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="users-tab-btn" data-bs-toggle="tab" data-bs-target="#users-tab-pane" type="button" role="tab" aria-controls="users-tab-pane" aria-selected="false">
            <i class="fas fa-users-cog me-1"></i> Người dùng
        </button>
      </li>
       <li class="nav-item" role="presentation">
        <button class="nav-link" id="distributors-tab-btn" data-bs-toggle="tab" data-bs-target="#distributors-tab-pane" type="button" role="tab" aria-controls="distributors-tab-pane" aria-selected="false">
             <i class="fas fa-store me-1"></i> Yêu cầu NPP
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content" id="adminTabContent">
      <!-- Orders Tab Pane -->
      <div class="tab-pane fade show active" id="orders-tab-pane" role="tabpanel" aria-labelledby="orders-tab-btn" tabindex="0">
         <div class="card shadow-sm border-light">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
               <h5 class="mb-0 text-dark">Đơn hàng gần đây</h5>
               <router-link :to="{ name: 'AdminAllOrders' }" class="btn btn-sm btn-outline-success">Xem tất cả</router-link>
            </div>
            <div class="card-body p-0">
                <div v-if="isLoadingOrders" class="text-center p-5"> <!-- Sử dụng isLoadingOrders từ Vuex -->
                    <div class="spinner-border text-secondary" role="status"></div>
                </div>
                <div v-else-if="!recentOrders || recentOrders.length === 0" class="text-center p-5 text-muted">
                   Chưa có đơn hàng nào.
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                    <thead class="table-light small text-uppercase text-muted">
                      <tr>
                        <th scope="col" class="px-3">Mã đơn</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col" class="text-center">Ngày đặt</th>
                        <th scope="col" class="text-end">Tổng tiền</th>
                        <th scope="col" class="text-center">Trạng thái</th>
                        <th scope="col" class="text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order_item in recentOrders" :key="order_item._id"> <!-- Đổi tên biến để tránh trùng -->
                        <td class="px-3 fw-medium">#{{ order_item._id.substring(order_item._id.length - 6).toUpperCase() }}</td>
                        <td>{{ order_item.user?.name || 'N/A' }}</td>
                        <td class="text-center small text-muted">{{ formatDate(order_item.createdAt) }}</td>
                        <td class="text-end fw-semibold">{{ formatCurrency(order_item.totalPrice) }}</td>
                        <td class="text-center">
                          <span class="badge rounded-pill" :class="getStatusClass(order_item.status)">
                            {{ getStatusText(order_item.status) }}
                          </span>
                        </td>
                        <td class="text-center">
                           <router-link :to="{ name: 'AdminOrderDetail', params: { id: order_item._id } }" class="btn btn-sm btn-outline-primary py-0 px-1" title="Xem chi tiết">
                               <i class="fas fa-eye"></i>
                           </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
         </div>
      </div>

      <!-- Products Tab Pane -->
      <div class="tab-pane fade" id="products-tab-pane" role="tabpanel" aria-labelledby="products-tab-btn" tabindex="0">
         <div class="card shadow-sm border-light">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
               <h5 class="mb-0 text-dark">Quản lý Sản phẩm</h5>
                <router-link :to="{ name: 'AdminProductCreate' }" class="btn btn-sm btn-success"> <!-- ĐÚNG TÊN ROUTE -->
                   <i class="fas fa-plus me-1"></i> Thêm sản phẩm
                </router-link>
            </div>
             <div class="card-body p-0">
                <div v-if="isLoadingProducts" class="text-center p-5"> <!-- Sử dụng isLoadingProducts từ Vuex -->
                     <div class="spinner-border text-secondary" role="status"></div>
                 </div>
                 <div v-else-if="!recentProducts || recentProducts.length === 0" class="text-center p-5 text-muted">
                    Chưa có sản phẩm nào được hiển thị trên dashboard.
                 </div>
                 <div v-else class="table-responsive">
                     <table class="table table-hover align-middle mb-0">
                       <thead class="table-light small text-uppercase text-muted">
                         <tr>
                           <th scope="col" class="ps-3" style="width: 50%;">Sản phẩm</th>
                           <th scope="col">Danh mục</th>
                           <th scope="col" class="text-end">Giá</th>
                           <th scope="col" class="text-center">Kho</th>
                           <th scope="col" class="text-center">Hành động</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr v-for="product_item in recentProducts" :key="product_item._id"> <!-- Đổi tên biến -->
                           <td class="ps-3">
                              <div class="d-flex align-items-center">
                                <img class="rounded border me-2 flex-shrink-0" style="width: 40px; height: 40px; object-fit: cover;" :src="getProductImage(product_item)" :alt="product_item.name">
                                <span class="fw-medium text-dark text-truncate" :title="product_item.name">{{ product_item.name }}</span>
                              </div>
                           </td>
                           <td>{{ product_item.category?.name || product_item.category || 'N/A' }}</td>
                           <td class="text-end">{{ formatCurrency(product_item.price) }}</td>
                           <td class="text-center">{{ product_item.countInStock }}</td>
                           <td class="text-center">
                              <div class="btn-group btn-group-sm">
                                  <router-link :to="{ name: 'AdminProductEdit', params: { id: product_item._id } }" class="btn btn-outline-primary" title="Sửa"> <!-- ĐÚNG TÊN ROUTE -->
                                     <i class="fas fa-edit"></i>
                                  </router-link>
                                  <button @click="confirmDeleteProduct(product_item)" class="btn btn-outline-danger" title="Xóa">
                                      <i class="fas fa-trash"></i>
                                  </button>
                              </div>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                 </div>
             </div>
              <div class="card-footer bg-light text-center" v-if="recentProducts && recentProducts.length > 0">
                  <router-link :to="{ name: 'AdminAllProducts' }" class="btn btn-sm btn-outline-secondary">Xem tất cả sản phẩm</router-link> <!-- ĐÚNG TÊN ROUTE -->
              </div>
         </div>
      </div>

      <!-- Users Tab Pane -->
      <div class="tab-pane fade" id="users-tab-pane" role="tabpanel" aria-labelledby="users-tab-btn" tabindex="0">
         <div class="card shadow-sm border-light">
             <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 class="mb-0 text-dark">Quản lý Người dùng</h5>
                <!-- Giả sử bạn có route AdminUserCreate -->
                 <router-link :to="{ name: 'AdminUserCreate' }" class="btn btn-sm btn-success">
                    <i class="fas fa-user-plus me-1"></i> Thêm người dùng
                 </router-link>
             </div>
              <div class="card-body p-0">
                 <div v-if="isLoadingUsers" class="text-center p-5"> <!-- Sử dụng isLoadingUsers từ Vuex -->
                      <div class="spinner-border text-secondary" role="status"></div>
                  </div>
                  <div v-else-if="!recentUsers || recentUsers.length === 0" class="text-center p-5 text-muted">
                     Không có người dùng nào được hiển thị trên dashboard.
                  </div>
                  <div v-else class="table-responsive">
                      <table class="table table-hover align-middle mb-0">
                        <thead class="table-light small text-uppercase text-muted">
                          <tr>
                            <th scope="col" class="ps-3">Người dùng</th>
                            <th scope="col">Email</th>
                            <th scope="col" class="text-center">Vai trò</th>
                            <th scope="col" class="text-center">Ngày đăng ký</th>
                             <th scope="col" class="text-center">Trạng thái</th>
                            <th scope="col" class="text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="user_item in recentUsers" :key="user_item._id">
                            <td class="ps-3">
                               <div class="d-flex align-items-center">
                                  <div class="rounded-circle bg-secondary-subtle me-2 d-flex align-items-center justify-content-center" style="width:35px; height:35px;">
                                      <i class="fas fa-user text-secondary"></i>
                                  </div>
                                  <span class="fw-medium text-dark">{{ user_item.name }}</span>
                               </div>
                            </td>
                            <td>{{ user_item.email }}</td>
                            <td class="text-center">
                              <span class="badge rounded-pill" :class="getRoleClass(user_item.role)">
                                {{ getRoleText(user_item.role) }}
                              </span>
                            </td>
                            <td class="text-center small text-muted">{{ formatDate(user_item.createdAt) }}</td>
                             <td class="text-center">
                                 <span class="badge rounded-pill" :class="user_item.isActive ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'">
                                     {{ user_item.isActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                                 </span>
                             </td>
                            <td class="text-center">
                               <div class="btn-group btn-group-sm">
                                   <!-- Giả sử có route AdminUserEdit -->
                                   <router-link :to="{ name: 'AdminUserEdit', params: { id: user_item._id } }" class="btn btn-outline-primary" title="Sửa">
                                      <i class="fas fa-edit"></i>
                                   </router-link>
                                    <button @click="confirmDeleteUser(user_item)" class="btn btn-outline-danger" title="Xóa">
                                       <i class="fas fa-trash"></i>
                                   </button>
                               </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
              </div>
               <div class="card-footer bg-light text-center" v-if="recentUsers && recentUsers.length > 0">
                   <router-link :to="{ name: 'AdminUserList' }" class="btn btn-sm btn-outline-secondary">Xem tất cả người dùng</router-link> <!-- ĐÚNG TÊN ROUTE -->
               </div>
          </div>
      </div>

       <!-- Distributors Tab Pane -->
       <div class="tab-pane fade" id="distributors-tab-pane" role="tabpanel" aria-labelledby="distributors-tab-btn" tabindex="0">
          <div class="card shadow-sm border-light">
              <div class="card-header bg-light d-flex justify-content-between align-items-center">
                 <h5 class="mb-0 text-dark">Yêu cầu Nhà Phân Phối</h5>
                 <router-link :to="{ name: 'AdminDistributorRequests' }" class="btn btn-sm btn-outline-success">Xem tất cả yêu cầu</router-link> <!-- ĐÚNG TÊN ROUTE -->
              </div>
               <div class="card-body p-0">
                  <div v-if="isLoadingDistributorRequests" class="text-center p-5"> <!-- Sử dụng isLoadingDistributorRequests từ Vuex -->
                       <div class="spinner-border text-secondary" role="status"></div>
                   </div>
                   <div v-else-if="!pendingDistributorRequests || pendingDistributorRequests.length === 0" class="text-center p-5 text-muted">
                      Không có yêu cầu nào đang chờ duyệt.
                   </div>
                   <div v-else class="table-responsive">
                       <table class="table table-hover align-middle mb-0">
                         <thead class="table-light small text-uppercase text-muted">
                           <tr>
                             <th scope="col" class="ps-3">Người yêu cầu</th>
                             <th scope="col">Công ty/MST</th>
                             <th scope="col" class="text-center">Ngày yêu cầu</th>
                             <th scope="col" class="text-center">Trạng thái</th>
                             <th scope="col" class="text-center">Hành động</th>
                           </tr>
                         </thead>
                         <tbody>
                           <tr v-for="request_item in pendingDistributorRequests" :key="request_item._id"> <!-- Đổi tên biến -->
                             <td class="ps-3">
                                <span class="fw-medium text-dark">{{ request_item.name }}</span>
                                <small class="d-block text-muted">{{ request_item.email }}</small>
                             </td>
                             <td>
                                 <span class="d-block">{{ request_item.distributorInfo?.companyName || 'N/A' }}</span>
                                 <small class="text-muted">MST: {{ request_item.distributorInfo?.taxId || 'N/A' }}</small>
                             </td>
                             <td class="text-center small text-muted">{{ formatDate(request_item.distributorInfo?.requestDate) }}</td>
                             <td class="text-center">
                                <span class="badge rounded-pill" :class="getRequestStatusClass(request_item.distributorInfo?.status)">
                                  {{ getRequestStatusText(request_item.distributorInfo?.status) }}
                                </span>
                             </td>
                             <td class="text-center">
                                 <div class="btn-group btn-group-sm">
                                      <router-link :to="{ name: 'AdminDistributorRequestDetail', params: { id: request_item._id } }" class="btn btn-outline-info" title="Chi tiết"> <i class="fas fa-info-circle"></i> </router-link> <!-- ĐÚNG TÊN ROUTE -->
                                     <button v-if="request_item.distributorInfo?.status === 'pending'" @click="approveRequest(request_item._id)" class="btn btn-outline-success" title="Phê duyệt" :disabled="processingRequests[request_item._id]">
                                         <i class="fas fa-check"></i>
                                     </button>
                                     <button v-if="request_item.distributorInfo?.status === 'pending'" @click="rejectRequest(request_item._id)" class="btn btn-outline-danger" title="Từ chối" :disabled="processingRequests[request_item._id]">
                                          <i class="fas fa-times"></i>
                                     </button>
                                 </div>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                   </div>
               </div>
           </div>
       </div>
    </div> <!-- End Tab Content -->
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTachometerAlt, faReceipt, faUsers, faBoxes, faDollarSign, faListAlt, faBox,
  faUsersCog, faStore, faEye, faEdit, faTrash, faCheck, faTimes, faInfoCircle,
  faUserPlus, faUser, faPlus // Thêm faPlus nếu chưa có
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faTachometerAlt, faReceipt, faUsers, faBoxes, faDollarSign, faListAlt, faBox,
  faUsersCog, faStore, faEye, faEdit, faTrash, faCheck, faTimes, faInfoCircle,
  faUserPlus, faUser, faPlus
);

const store = useStore();
const toast = useToast();

// --- Computed Properties for Loading States (Lấy từ Vuex Store) ---
const isLoadingStats = computed(() => store.getters['admin/isLoadingStats']);
const isLoadingOrders = computed(() => store.getters['admin/isLoadingOrders']);
const isLoadingProducts = computed(() => store.getters['admin/isLoadingProducts']);
const isLoadingUsers = computed(() => store.getters['admin/isLoadingUsers']);
const isLoadingDistributorRequests = computed(() => store.getters['admin/isLoadingDistributorRequests']);

const processingRequests = reactive({}); // Để quản lý trạng thái loading của từng nút duyệt/từ chối

// --- Computed Properties for Data (Lấy từ Vuex Store) ---
// Dữ liệu này sẽ được các actions trong Vuex store fetch về
const stats = computed(() => store.getters['admin/dashboardStats'] || { totalOrders: 0, totalUsers: 0, totalProducts: 0, totalRevenue: 0 });
const recentOrders = computed(() => store.getters['admin/recentOrdersDashboard'] || []); // Getter mới cho dashboard
const recentProducts = computed(() => store.getters['admin/recentProductsDashboard'] || []); // Getter mới cho dashboard
const recentUsers = computed(() => store.getters['admin/recentUsersDashboard'] || []);       // Getter mới cho dashboard
const pendingDistributorRequests = computed(() => store.getters['admin/pendingDistributorRequestsDashboard'] || []); // Getter mới cho dashboard

// --- Helper Methods (Giữ nguyên từ code gốc của bạn) ---
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};
const getStatusClass = (status) => {
  const classMap = {
    'pending':    'bg-primary-subtle text-primary-emphasis',    // Chờ xử lý
    'processing': 'bg-info-subtle text-info-emphasis',          // Đang xử lý
    'shipped':    'bg-warning-subtle text-warning-emphasis',    // Đã vận chuyển (hoặc shipping)
    'delivered':  'bg-success-subtle text-success-emphasis',    // Đã giao
    'cancelled':  'bg-danger-subtle text-danger-emphasis',      // Đã hủy
    'failed':     'bg-dark-subtle text-dark-emphasis border', // Thất bại (có thể dùng màu xám đậm hơn hoặc màu đỏ nhạt)
    // Thêm các class khác nếu có trạng thái khác
  };
  return classMap[status] || 'bg-light text-dark border'; // Class mặc định nếu status không khớp
};

const getStatusText = (status) => {
  const statusMap = {
    'pending':    'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped':    'Đã vận chuyển', // Hoặc 'Đang giao hàng' nếu 'shipping'
    'delivered':  'Đã giao',
    'cancelled':  'Đã hủy',
    'failed':     'Thất bại',
    // Thêm các text khác nếu có trạng thái khác
  };
  return statusMap[status] || 'Không rõ'; // Text mặc định nếu status không khớp
};
const getRoleClass = (role) => {
   const classMap = {
     'user': 'bg-light text-dark border', // Người dùng thường, có thể chỉ là text hoặc badge nhẹ nhàng
     'distributor': 'bg-success-subtle text-success-emphasis', // Nhà phân phối
     'admin': 'bg-danger-subtle text-danger-emphasis',        // Quản trị viên
     // Thêm các class khác nếu cần
   };
   return classMap[role] || 'bg-secondary-subtle text-secondary-emphasis'; // Class mặc định
};
const getRoleText = (role) => {
   const roleMap = {
     'user': 'Người dùng',
     'distributor': 'Nhà phân phối',
     'admin': 'Quản trị viên',
     // Thêm các text khác nếu cần
   };
   return roleMap[role] || 'Không xác định'; // Text mặc định
};
const getRequestStatusClass = (status) => {
    const classMap = {
      'pending': 'bg-warning-subtle text-warning-emphasis', // Chờ duyệt
      'approved': 'bg-success-subtle text-success-emphasis',// Đã duyệt
      'rejected': 'bg-danger-subtle text-danger-emphasis',  // Từ chối
      'none': 'bg-light text-muted border',                 // Chưa yêu cầu / Không có
      // Thêm các class khác nếu cần
    };
    return classMap[status] || 'bg-secondary-subtle text-secondary-emphasis'; // Class mặc định
};
const getRequestStatusText = (status) => {
     const statusMap = {
       'pending': 'Chờ duyệt',
       'approved': 'Đã duyệt',
       'rejected': 'Từ chối',
       'none': 'Chưa yêu cầu',
       // Thêm các text khác nếu cần
     };
    return statusMap[status] || 'N/A'; // Text mặc định (Not Applicable/Available)
};
const getProductImage = (product) => product.images?.[0] || '/images/placeholder.png';


// --- Action Dispatchers (Gọi actions từ Vuex Store) ---
const loadDashboardData = async () => {
    // Các actions này cần được định nghĩa trong store/modules/admin.js
    // và chúng sẽ sử dụng apiClient thật sự để gọi API
    // Ví dụ: store.dispatch('admin/fetchDashboardStats')
    //         store.dispatch('admin/fetchOrdersForDashboard', { limit: 5 })
    //         store.dispatch('admin/fetchProductsForDashboard', { limit: 5 })
    //         store.dispatch('admin/fetchUsersForDashboard', { limit: 5 })
    //         store.dispatch('admin/fetchPendingDistributorRequestsForDashboard', { limit: 5 })
    try {
        // Promise.allSettled để tất cả các API call được thực hiện, ngay cả khi một số thất bại
        const results = await Promise.allSettled([
            store.dispatch('admin/fetchDashboardStats'),
            store.dispatch('admin/fetchOrdersForDashboard', { limit: 5, page: 1, sort: '-createdAt' }),
            store.dispatch('admin/fetchProductsForDashboard', { limit: 5, page: 1, sort: '-createdAt' }),
            store.dispatch('admin/fetchUsersForDashboard', { limit: 5, page: 1, sort: '-createdAt' }),
            store.dispatch('admin/fetchPendingDistributorRequestsForDashboard', { limit: 5 })
        ]);

        results.forEach(result => {
            if (result.status === 'rejected') {
                console.error("Dashboard: Lỗi khi tải một phần dữ liệu:", result.reason);
            }
        });

    } catch (error) { // Mặc dù allSettled không throw, nhưng để đây phòng trường hợp khác
        console.error("Dashboard: Lỗi không mong muốn khi tải dữ liệu:", error);
        toast.error("Không thể tải toàn bộ dữ liệu dashboard.");
    }
};

const confirmDeleteProduct = (product_item) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product_item.name}"?`)) {
       store.dispatch('admin/deleteProduct', product_item._id) // Giả sử có action này
        .then(() => toast.success("Sản phẩm đã được xóa."))
        .catch(err => toast.error(err.response?.data?.message || "Lỗi xóa sản phẩm."));
    }
};
const confirmDeleteUser = (user_item) => {
     if (confirm(`Bạn có chắc chắn muốn xóa người dùng "${user_item.name}"?`)) {
       store.dispatch('admin/deleteUser', user_item._id) // Giả sử có action này
        .then(() => toast.success("Người dùng đã được xóa."))
        .catch(err => toast.error(err.response?.data?.message || "Lỗi xóa người dùng."));
    }
};
const approveRequest = async (userId) => {
  if (processingRequests[userId]) return;
  if (confirm('Phê duyệt yêu cầu làm nhà phân phối cho người dùng này?')) {
    processingRequests[userId] = true;
    try {
      const result = await store.dispatch('admin/manageDistributorRequest', { userId, status: 'approved' });
      toast.success(result.message || 'Đã phê duyệt yêu cầu.');
      // Dữ liệu sẽ tự cập nhật qua Vuex getters
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi phê duyệt yêu cầu.');
    } finally {
      processingRequests[userId] = false;
    }
  }
};
const rejectRequest = async (userId) => {
  if (processingRequests[userId]) return;
  if (confirm('Từ chối yêu cầu làm nhà phân phối cho người dùng này?')) {
     processingRequests[userId] = true;
    try {
      const result = await store.dispatch('admin/manageDistributorRequest', { userId, status: 'rejected' });
      toast.success(result.message || 'Đã từ chối yêu cầu.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi từ chối yêu cầu.');
    } finally {
       processingRequests[userId] = false;
    }
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
    loadDashboardData();
});

</script>

<style scoped>
/* Giữ nguyên style từ code gốc của bạn */
.nav-tabs .nav-link {
    color: var(--bs-secondary-color);
    border-bottom-width: 2px;
    border-color: transparent transparent var(--bs-border-color) transparent;
}
.nav-tabs .nav-link.active {
    color: var(--bs-success);
    border-color: var(--bs-success) var(--bs-success) var(--bs-white) var(--bs-success);
    font-weight: 600;
}
.table th {
    font-weight: 600;
    color: var(--bs-secondary-color);
    white-space: nowrap;
}
.table td {
    vertical-align: middle;
}
.badge {
    font-size: 0.75em; /* Badge nhỏ hơn */
    padding: 0.3em 0.6em;
}
/* Placeholder animation */
.placeholder {
    min-height: 1.2em;
}
</style>