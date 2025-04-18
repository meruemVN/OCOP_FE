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
                <h4 v-if="!loadingStats" class="mb-0 fw-bold">{{ stats.totalOrders || 0 }}</h4>
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
                <h4 v-if="!loadingStats" class="mb-0 fw-bold">{{ stats.totalUsers || 0 }}</h4>
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
                <h4 v-if="!loadingStats" class="mb-0 fw-bold">{{ stats.totalProducts || 0 }}</h4>
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
                <h4 v-if="!loadingStats" class="mb-0 fw-bold">{{ formatCurrency(stats.totalRevenue) }}</h4>
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
        <button class="nav-link active" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders-tab-pane" type="button" role="tab" aria-controls="orders-tab-pane" aria-selected="true">
           <i class="fas fa-list-alt me-1"></i> Đơn hàng
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#products-tab-pane" type="button" role="tab" aria-controls="products-tab-pane" aria-selected="false">
            <i class="fas fa-box me-1"></i> Sản phẩm
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users-tab-pane" type="button" role="tab" aria-controls="users-tab-pane" aria-selected="false">
            <i class="fas fa-users-cog me-1"></i> Người dùng
        </button>
      </li>
       <li class="nav-item" role="presentation">
        <button class="nav-link" id="distributors-tab" data-bs-toggle="tab" data-bs-target="#distributors-tab-pane" type="button" role="tab" aria-controls="distributors-tab-pane" aria-selected="false">
             <i class="fas fa-store me-1"></i> Yêu cầu NPP
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content" id="adminTabContent">
      <!-- Orders Tab Pane -->
      <div class="tab-pane fade show active" id="orders-tab-pane" role="tabpanel" aria-labelledby="orders-tab" tabindex="0">
         <div class="card shadow-sm border-light">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
               <h5 class="mb-0 text-dark">Đơn hàng gần đây</h5>
               <router-link to="/admin/orders" class="btn btn-sm btn-outline-success">Xem tất cả</router-link>
            </div>
            <div class="card-body p-0">
                <div v-if="loadingOrders" class="text-center p-5">
                    <div class="spinner-border text-secondary" role="status"></div>
                </div>
                <div v-else-if="recentOrders.length === 0" class="text-center p-5 text-muted">
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
                      <tr v-for="order in recentOrders" :key="order._id">
                        <td class="px-3 fw-medium">#{{ order._id.substring(order._id.length - 6).toUpperCase() }}</td>
                        <td>{{ order.user?.name || 'N/A' }}</td>
                        <td class="text-center small text-muted">{{ formatDate(order.createdAt) }}</td>
                        <td class="text-end fw-semibold">{{ formatCurrency(order.totalPrice) }}</td>
                        <td class="text-center">
                          <span class="badge rounded-pill" :class="getStatusClass(order.status)">
                            {{ getStatusText(order.status) }}
                          </span>
                        </td>
                        <td class="text-center">
                           <router-link :to="`/admin/order/${order._id}`" class="btn btn-sm btn-outline-primary py-0 px-1" title="Xem chi tiết">
                               <i class="fas fa-eye"></i>
                           </router-link>
                           {/* Thêm nút khác nếu cần */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
         </div>
      </div>

      <!-- Products Tab Pane -->
      <div class="tab-pane fade" id="products-tab-pane" role="tabpanel" aria-labelledby="products-tab" tabindex="0">
         <div class="card shadow-sm border-light">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
               <h5 class="mb-0 text-dark">Quản lý Sản phẩm</h5>
                <router-link to="/admin/products/new" class="btn btn-sm btn-success">
                   <i class="fas fa-plus me-1"></i> Thêm sản phẩm
                </router-link>
            </div>
             <div class="card-body p-0">
                <div v-if="loadingProducts" class="text-center p-5">
                     <div class="spinner-border text-secondary" role="status"></div>
                 </div>
                 <div v-else-if="products.length === 0" class="text-center p-5 text-muted">
                    Chưa có sản phẩm nào.
                 </div>
                 <div v-else class="table-responsive">
                     <table class="table table-hover align-middle mb-0">
                       <thead class="table-light small text-uppercase text-muted">
                         <tr>
                           <th scope="col" class="ps-3" style="width: 50%;">Sản phẩm</th>
                           <th scope="col">Danh mục</th>
                           <th scope="col" class="text-end">Giá</th>
                           <th scope="col" class="text-center">Kho</th>
                           <th scope="col" class="text-center">Trạng thái</th>
                           <th scope="col" class="text-center">Hành động</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr v-for="product in products" :key="product._id">
                           <td class="ps-3">
                              <div class="d-flex align-items-center">
                                <img class="rounded border me-2 flex-shrink-0" style="width: 40px; height: 40px; object-fit: cover;" :src="getProductImage(product)" :alt="product.name">
                                <span class="fw-medium text-dark text-truncate" :title="product.name">{{ product.name }}</span>
                              </div>
                           </td>
                           <td>{{ product.category || 'N/A' }}</td>
                           <td class="text-end">{{ formatCurrency(product.price) }}</td>
                           <td class="text-center">{{ product.countInStock }}</td>
                           <td class="text-center">
                             <span class="badge rounded-pill" :class="product.countInStock > 0 ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'">
                               {{ product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng' }}
                             </span>
                           </td>
                           <td class="text-center">
                              <div class="btn-group btn-group-sm">
                                  <router-link :to="`/admin/product/${product._id}/edit`" class="btn btn-outline-primary" title="Sửa">
                                     <i class="fas fa-edit"></i>
                                  </router-link>
                                  <button @click="confirmDeleteProduct(product)" class="btn btn-outline-danger" title="Xóa">
                                      <i class="fas fa-trash"></i>
                                  </button>
                              </div>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                 </div>
             </div>
              <div class="card-footer bg-light text-center" v-if="products.length > 0">
                  <router-link to="/admin/products" class="btn btn-sm btn-outline-secondary">Xem tất cả sản phẩm</router-link>
              </div>
         </div>
      </div>

      <!-- Users Tab Pane -->
      <div class="tab-pane fade" id="users-tab-pane" role="tabpanel" aria-labelledby="users-tab" tabindex="0">
         <div class="card shadow-sm border-light">
             <div class="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 class="mb-0 text-dark">Quản lý Người dùng</h5>
                 <router-link to="/admin/users/new" class="btn btn-sm btn-success">
                    <i class="fas fa-user-plus me-1"></i> Thêm người dùng
                 </router-link>
             </div>
              <div class="card-body p-0">
                 <div v-if="loadingUsers" class="text-center p-5">
                      <div class="spinner-border text-secondary" role="status"></div>
                  </div>
                  <div v-else-if="users.length === 0" class="text-center p-5 text-muted">
                     Không có người dùng nào.
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
                          <tr v-for="user in users" :key="user._id">
                            <td class="ps-3">
                               <div class="d-flex align-items-center">
                                  <div class="rounded-circle bg-secondary-subtle me-2 d-flex align-items-center justify-content-center" style="width:35px; height:35px;">
                                      <i class="fas fa-user text-secondary"></i>
                                  </div>
                                  <span class="fw-medium text-dark">{{ user.name }}</span>
                               </div>
                            </td>
                            <td>{{ user.email }}</td>
                            <td class="text-center">
                              <span class="badge rounded-pill" :class="getRoleClass(user.role)">
                                {{ getRoleText(user.role) }}
                              </span>
                            </td>
                            <td class="text-center small text-muted">{{ formatDate(user.createdAt) }}</td>
                             <td class="text-center">
                                 <span class="badge rounded-pill" :class="user.isActive ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'">
                                     {{ user.isActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                                 </span>
                             </td>
                            <td class="text-center">
                               <div class="btn-group btn-group-sm">
                                   <router-link :to="`/admin/user/${user._id}/edit`" class="btn btn-outline-primary" title="Sửa">
                                      <i class="fas fa-edit"></i>
                                   </router-link>
                                    <button @click="confirmDeleteUser(user)" class="btn btn-outline-danger" title="Xóa">
                                       <i class="fas fa-trash"></i>
                                   </button>
                               </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
              </div>
               <div class="card-footer bg-light text-center" v-if="users.length > 0">
                   <router-link to="/admin/users" class="btn btn-sm btn-outline-secondary">Xem tất cả người dùng</router-link>
               </div>
          </div>
      </div>

       <!-- Distributors Tab Pane -->
       <div class="tab-pane fade" id="distributors-tab-pane" role="tabpanel" aria-labelledby="distributors-tab" tabindex="0">
          <div class="card shadow-sm border-light">
              <div class="card-header bg-light d-flex justify-content-between align-items-center">
                 <h5 class="mb-0 text-dark">Yêu cầu Nhà Phân Phối</h5>
              </div>
               <div class="card-body p-0">
                  <div v-if="loadingDistributorRequests" class="text-center p-5">
                       <div class="spinner-border text-secondary" role="status"></div>
                   </div>
                   <div v-else-if="distributorRequests.length === 0" class="text-center p-5 text-muted">
                      Không có yêu cầu nào.
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
                           <tr v-for="request in distributorRequests" :key="request._id">
                             <td class="ps-3">
                                <span class="fw-medium text-dark">{{ request.name }}</span>
                                <small class="d-block text-muted">{{ request.email }}</small>
                             </td>
                             <td>
                                 <span class="d-block">{{ request.distributorInfo?.companyName || 'N/A' }}</span>
                                 <small class="text-muted">MST: {{ request.distributorInfo?.taxId || 'N/A' }}</small>
                             </td>
                             <td class="text-center small text-muted">{{ formatDate(request.distributorInfo?.requestDate) }}</td>
                             <td class="text-center">
                                <span class="badge rounded-pill" :class="getRequestStatusClass(request.distributorInfo?.status)">
                                  {{ getRequestStatusText(request.distributorInfo?.status) }}
                                </span>
                             </td>
                             <td class="text-center">
                                 <div class="btn-group btn-group-sm">
                                      <button class="btn btn-outline-info" title="Chi tiết"> <i class="fas fa-info-circle"></i> </button> 
                                     <button v-if="request.distributorInfo?.status === 'pending'" @click="approveRequest(request._id)" class="btn btn-outline-success" title="Phê duyệt">
                                         <i class="fas fa-check"></i>
                                     </button>
                                     <button v-if="request.distributorInfo?.status === 'pending'" @click="rejectRequest(request._id)" class="btn btn-outline-danger" title="Từ chối">
                                          <i class="fas fa-times"></i>
                                     </button>
                                 </div>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                   </div>
               </div>
                <div class="card-footer bg-light text-center" v-if="distributorRequests.length > 0">
                </div>
           </div>
       </div>

    </div> <!-- End Tab Content -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import nếu cần điều hướng
import { useToast } from 'vue-toastification';
// Import icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTachometerAlt, faReceipt, faUsers, faBoxes, faDollarSign, faListAlt, faBox, faUsersCog, faStore, faEye, faEdit, faTrash, faCheck, faTimes, faInfoCircle, faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faTachometerAlt, faReceipt, faUsers, faBoxes, faDollarSign, faListAlt, faBox, faUsersCog, faStore, faEye, faEdit, faTrash, faCheck, faTimes, faInfoCircle, faUserPlus, faUser);

const store = useStore();
const router = useRouter(); // Khởi tạo nếu cần
const toast = useToast();

// --- State ---
const loadingStats = ref(true);
const loadingOrders = ref(true);
const loadingProducts = ref(true);
const loadingUsers = ref(true);
const loadingDistributorRequests = ref(true);
const processingRequests = reactive({});

// --- Computed Properties from Store ---
// Giả định bạn sẽ tạo các getters và actions này trong store
const stats = computed(() => store.getters['admin/dashboardStats'] || { totalOrders: 0, totalUsers: 0, totalProducts: 0, totalRevenue: 0 });
const recentOrders = computed(() => store.getters['admin/recentOrders'] || []); // Lấy 5-10 đơn hàng mới nhất
const products = computed(() => store.getters['admin/allProducts'] || []); // Lấy 1 trang sản phẩm
const users = computed(() => store.getters['admin/allUsers'] || []); // Lấy 1 trang người dùng
const distributorRequests = computed(() => {
    const requests = store.getters['admin/distributorRequests'] || [];
    console.log('[FINAL CHECK] Computed distributorRequests value:', JSON.stringify(requests)); // Log giá trị cuối cùng
    return requests;
});

// --- Methods ---
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
    'pending': 'bg-primary-subtle text-primary-emphasis',
    'processing': 'bg-warning-subtle text-warning-emphasis',
    'shipped': 'bg-info-subtle text-info-emphasis',
    'delivered': 'bg-success-subtle text-success-emphasis',
    'cancelled': 'bg-danger-subtle text-danger-emphasis'
  };
  return classMap[status] || 'bg-secondary-subtle text-secondary-emphasis';
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || 'Không rõ';
};

const getRoleClass = (role) => {
   const classMap = {
      'admin': 'bg-danger-subtle text-danger-emphasis',
      'distributor': 'bg-primary-subtle text-primary-emphasis',
      'user': 'bg-success-subtle text-success-emphasis',
   };
   return classMap[role] || 'bg-secondary-subtle text-secondary-emphasis';
};

const getRoleText = (role) => {
   const roleMap = {
      'admin': 'Quản trị viên',
      'distributor': 'Nhà phân phối',
      'user': 'Người dùng',
   };
   return roleMap[role] || 'Không xác định';
};

const getRequestStatusClass = (status) => {
    const classMap = {
        'pending': 'bg-warning-subtle text-warning-emphasis',
        'approved': 'bg-success-subtle text-success-emphasis',
        'rejected': 'bg-danger-subtle text-danger-emphasis'
    };
    return classMap[status] || 'bg-secondary-subtle text-secondary-emphasis';
}

const getRequestStatusText = (status) => {
     const statusMap = {
        'pending': 'Chờ duyệt',
        'approved': 'Đã duyệt',
        'rejected': 'Đã từ chối'
    };
    return statusMap[status] || 'N/A';
}

const getProductImage = (product) => product.images?.[0] || '/images/placeholder.png';

// --- Action Dispatchers (Ví dụ) ---
const loadDashboardData = async () => {
    loadingStats.value = true;
    loadingOrders.value = true;
    loadingProducts.value = true;
    loadingUsers.value = true;
    loadingDistributorRequests.value = true;

    try {
        // Gọi đồng thời nhiều actions để tải dữ liệu
        await Promise.all([
            store.dispatch('admin/fetchDashboardStats'),
            store.dispatch('admin/fetchOrders', { limit: 5, page: 1 }), // << SỬA LẠI TÊN VÀ THAM SỐ
            store.dispatch('admin/fetchProducts', { page: 1, limit: 10 }),
            store.dispatch('admin/fetchUsers', { page: 1, limit: 10 }),
            store.dispatch('admin/fetchDistributorRequests', 'pending')
        ]);
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Hiển thị toast lỗi chung
        // toast.error("Không thể tải dữ liệu dashboard");
    } finally {
        // Cập nhật trạng thái loading tương ứng sau khi mỗi action hoàn thành
        // (Getter trong store sẽ quản lý state loading/error chi tiết hơn)
        // Tạm thời set tất cả về false
        loadingStats.value = false;
        loadingOrders.value = false;
        loadingProducts.value = false;
        loadingUsers.value = false;
        loadingDistributorRequests.value = false;
    }
};

const confirmDeleteProduct = (product) => {
    if (confirm(`Xóa sản phẩm "${product.name}"?`)) {
       // await store.dispatch('admin/deleteProduct', product._id);
       alert('Chức năng xóa đang được phát triển');
    }
};
const confirmDeleteUser = (user) => {
     if (confirm(`Xóa người dùng "${user.name}"?`)) {
       // await store.dispatch('admin/deleteUser', user._id);
       alert('Chức năng xóa đang được phát triển');
    }
};
const approveRequest = async (userId) => {
  if (processingRequests[userId]) return; // Ngăn click nhiều lần
  if (confirm('Phê duyệt yêu cầu làm nhà phân phối cho người dùng này?')) {
    processingRequests[userId] = true; // Bắt đầu loading cho user này
    try {
      const result = await store.dispatch('admin/manageDistributorRequest', { userId, status: 'approved' });
      toast.success(result.message || 'Đã phê duyệt yêu cầu.');
      // State Vuex sẽ tự cập nhật danh sách, component sẽ render lại
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi phê duyệt yêu cầu.');
    } finally {
      processingRequests[userId] = false; // Kết thúc loading
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
      // State Vuex tự cập nhật
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi từ chối yêu cầu.');
    } finally {
       processingRequests[userId] = false;
    }
  }
};


// --- Lifecycle Hook ---
onMounted(() => {
    // Load dữ liệu khi component được mount
    loadDashboardData();
});

</script>

<style scoped>
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