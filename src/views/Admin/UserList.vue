<template>
    <div class="admin-user-list container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h4 text-success fw-semibold mb-0">
          <i class="fas fa-users-cog me-2"></i>Quản lý Người dùng
        </h1>
        {/* Nút thêm người dùng mới nếu cần */}
        {/* <router-link :to="{ name: 'AdminUserCreate' }" class="btn btn-success">
          <i class="fas fa-user-plus me-1"></i> Thêm người dùng
        </router-link> */}
      </div>
      <p class="text-muted mb-4">Xem, tìm kiếm, chỉnh sửa và quản lý trạng thái người dùng.</p>
  
      <!-- Filters and Search (Optional) -->
      <div class="card shadow-sm border-light mb-4">
         <div class="card-body">
              <div class="row g-2">
                  <div class="col-md-4">
                      <input type="text" class="form-control form-control-sm" placeholder="Tìm theo tên hoặc email...">
                  </div>
                   <div class="col-md-3">
                      <select class="form-select form-select-sm">
                          <option value="">Tất cả vai trò</option>
                          <option value="user">Người dùng</option>
                          <option value="distributor">Nhà phân phối</option>
                           <option value="admin">Quản trị viên</option>
                      </select>
                  </div>
                   <div class="col-md-3">
                      <select class="form-select form-select-sm">
                          <option value="">Tất cả trạng thái</option>
                          <option value="true">Hoạt động</option>
                          <option value="false">Vô hiệu hóa</option>
                      </select>
                  </div>
                   <div class="col-md-2">
                       <button class="btn btn-sm btn-primary w-100">Lọc</button>
                   </div>
              </div>
         </div>
      </div>
  
  
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
         <p class="mt-2 text-muted">Đang tải danh sách người dùng...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
           <i class="fas fa-exclamation-triangle me-2"></i> Lỗi tải danh sách người dùng: {{ error }}
      </div>
  
      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="text-center py-5 card border-light shadow-sm">
          <div class="card-body">
              <i class="fas fa-users-slash fa-3x text-light mb-3"></i>
              <p class="text-muted">Không tìm thấy người dùng nào.</p>
               {/* Nút thêm user nếu cần */}
              {/* <router-link :to="{ name: 'AdminUserCreate' }" class="btn btn-success mt-2">
                  <i class="fas fa-user-plus me-1"></i> Thêm người dùng
              </router-link> */}
          </div>
      </div>
  
      <!-- Users Table -->
      <div v-else class="card shadow-sm border-light">
          <div class="table-responsive">
              <table class="table table-hover table-bordered align-middle mb-0">
                  <thead class="table-light">
                  <tr>
                      <th scope="col" class="ps-3">Người dùng</th>
                      <th scope="col">Email / SĐT</th>
                      <th scope="col" class="text-center">Vai trò</th>
                      <th scope="col" class="text-center">Ngày ĐK</th>
                      <th scope="col" class="text-center">Trạng thái</th>
                      <th scope="col" class="text-center" style="width: 120px;">Thao tác</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="user in users" :key="user._id">
                      <td class="ps-3">
                         <div class="d-flex align-items-center">
                            {/* Avatar placeholder */}
                            <div class="rounded-circle bg-secondary-subtle me-2 d-flex align-items-center justify-content-center" style="width:35px; height:35px;">
                                <i class="fas fa-user text-secondary"></i>
                            </div>
                             <div>
                                <span class="fw-medium text-dark">{{ user.name }}</span>
                                 <small class="d-block text-muted">ID: {{ user._id }}</small>
                             </div>
                         </div>
                      </td>
                       <td>
                          <span class="d-block">{{ user.email }}</span>
                          <small class="text-muted">{{ user.phone || 'Chưa có SĐT' }}</small>
                      </td>
                      <td class="text-center">
                        <span class="badge rounded-pill" :class="getRoleClass(user.role)">
                          {{ getRoleText(user.role) }}
                        </span>
                        {/* Hiển thị thêm nếu là distributor đang chờ */}
                         <span v-if="user.distributorInfo?.status === 'pending'" class="badge rounded-pill bg-warning-subtle text-warning-emphasis ms-1">Chờ duyệt</span>
                      </td>
                      <td class="text-center small text-muted">{{ formatDate(user.createdAt) }}</td>
                      <td class="text-center">
                          <span class="badge rounded-pill" :class="user.isActive ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'">
                              {{ user.isActive ? 'Hoạt động' : 'Vô hiệu hóa' }}
                          </span>
                      </td>
                      <td class="text-center">
                      <div class="btn-group btn-group-sm">
                           {/* Link đến trang sửa user */}
                           <router-link :to="{ name: 'AdminUserEdit', params: { id: user._id } }" class="btn btn-outline-primary" title="Sửa">
                             <i class="fas fa-edit"></i>
                          </router-link>
                          <button class="btn btn-outline-danger" @click="confirmDeleteUser(user)" title="Xóa">
                             <i class="fas fa-trash"></i>
                          </button>
                           {/* Nút duyệt nhanh nếu là request distributor */}
                            <button v-if="user.distributorInfo?.status === 'pending'" @click="approveRequest(user._id)" class="btn btn-outline-success" title="Duyệt NPP">
                                <i class="fas fa-check"></i>
                            </button>
                      </div>
                      </td>
                  </tr>
                  </tbody>
              </table>
        </div>
          {/* Pagination */}
          <div class="card-footer bg-light" v-if="userPagination.pages > 1">
              <nav aria-label="User pagination">
                <ul class="pagination pagination-sm justify-content-center mb-0">
                  <li class="page-item" :class="{ disabled: userPagination.page === 1 }">
                    <a class="page-link" href="#" @click.prevent="changeUserPage(userPagination.page - 1)">Trước</a>
                  </li>
                  <li class="page-item" v-for="p in userPagination.pages" :key="p" :class="{ active: userPagination.page === p }">
                    <a class="page-link" href="#" @click.prevent="changeUserPage(p)">{{ p }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: userPagination.page === userPagination.pages }">
                    <a class="page-link" href="#" @click.prevent="changeUserPage(userPagination.page + 1)">Sau</a>
                  </li>
                </ul>
              </nav>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
// Giả sử bạn có một apiClient đã cấu hình (ví dụ: sử dụng axios)
// import apiClient from '@/services/apiClient'; // Bỏ comment và thay thế bằng apiClient thực tế của bạn

// --- Reactive State ---
const stats = ref({
  totalOrders: 0,
  totalUsers: 0,
  totalProducts: 0,
  totalRevenue: 0,
});
const recentOrders = ref([]);
const loadingRecentOrders = ref(true);

// ... (các state khác cho products, users, distributor requests nếu có)

// --- Helper Functions (giữ nguyên như trước) ---
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý', // Thêm 'processing' nếu có
    shipped: 'Đã gửi hàng',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    failed: 'Thất bại'
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1); // Fallback
};

const getStatusBadgeClass = (status) => {
  const classMap = {
    pending: 'bg-secondary',
    processing: 'bg-warning text-dark',
    shipped: 'bg-info text-dark',
    delivered: 'bg-success',
    cancelled: 'bg-danger',
    failed: 'bg-danger'
  };
  return classMap[status] || 'bg-light text-dark';
};

// ... (các helper functions khác giữ nguyên)

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Fetch dashboard statistics
  try {
    // THAY THẾ BẰNG API CALL THỰC TẾ
    // const statsResponse = await apiClient.get('/api/admin/stats');
    // stats.value = statsResponse.data;

    // Dữ liệu giả để test UI (XÓA KHI CÓ API THẬT)
    stats.value = { totalOrders: 8, totalUsers: 957, totalProducts: 1679, totalRevenue: 12345000 };
    // ---
  } catch (error) {
    console.error("Lỗi tải thống kê dashboard:", error);
    // Xử lý lỗi (ví dụ: hiển thị thông báo)
  }

  // Fetch recent orders (sử dụng /api/admin/orders từ adminController.js)
  try {
    loadingRecentOrders.value = true;
    // THAY THẾ BẰNG API CALL THỰC TẾ
    // const response = await apiClient.get('/api/admin/orders?page=1&limit=5'); // Lấy 5 đơn hàng gần nhất
    // recentOrders.value = response.data.orders;

    // Dữ liệu giả để test UI (XÓA KHI CÓ API THẬT)
    // Giả sử có 8 đơn hàng như stats.totalOrders
    if (stats.value.totalOrders > 0) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng
        recentOrders.value = [
            { _id: '605c724f1c9d440000d0c1a1', user: { _id: 'user1', name: 'Nguyễn Văn An', email: 'an.nv@example.com' }, createdAt: new Date().toISOString(), totalPrice: 1250000, status: 'processing' },
            { _id: '605c724f1c9d440000d0c1a2', user: { _id: 'user2', name: 'Trần Thị Bình', email: 'binh.tt@example.com' }, createdAt: new Date(Date.now() - 86400000).toISOString(), totalPrice: 800000, status: 'delivered' },
            { _id: '605c724f1c9d440000d0c1a3', user: { _id: 'user3', name: 'Lê Văn Cường', email: 'cuong.lv@example.com' }, createdAt: new Date(Date.now() - 172800000).toISOString(), totalPrice: 2500000, status: 'shipped' },
            { _id: '605c724f1c9d440000d0c1a4', user: { _id: 'user4', name: 'Phạm Thị Dung', email: 'dung.pt@example.com' }, createdAt: new Date(Date.now() - 259200000).toISOString(), totalPrice: 500000, status: 'pending' },
            { _id: '605c724f1c9d440000d0c1a5', user: { _id: 'user5', name: 'Hoàng Văn Em', email: 'em.hv@example.com' }, createdAt: new Date(Date.now() - 345600000).toISOString(), totalPrice: 1750000, status: 'cancelled' },
        ]; // Hiển thị 5 đơn hàng giả
    } else {
        recentOrders.value = [];
    }
    // ---
  } catch (error) {
    console.error("Lỗi tải đơn hàng gần đây:", error);
    recentOrders.value = []; // Đảm bảo mảng rỗng nếu có lỗi
  } finally {
    loadingRecentOrders.value = false;
  }

  // TODO: Fetch data cho các section khác (products, users, ...) nếu cần
  // ...
});

</script>
  
  <style scoped>
  .table th, .table td {
      vertical-align: middle;
  }
  .table th {
      font-weight: 600;
      color: var(--bs-secondary-color);
      white-space: nowrap;
  }
  .badge {
      font-size: 0.75em;
      font-weight: 600;
  }
  </style>