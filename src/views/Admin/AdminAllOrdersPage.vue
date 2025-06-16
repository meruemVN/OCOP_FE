<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h3 mb-0 text-gray-800">
        <i class="fas fa-receipt me-2"></i>Quản lý Tất cả Đơn hàng
      </h1>
      <!-- Có thể thêm nút lọc hoặc tìm kiếm ở đây -->
    </div>

    <p class="text-muted mb-4">
      Xem, tìm kiếm, và quản lý tất cả đơn hàng trong hệ thống.
    </p>

    <div class="card shadow-sm border-light">
      <div class="card-header bg-light py-3">
        <h6 class="m-0 font-weight-bold text-primary">Danh sách Đơn hàng</h6>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải danh sách đơn hàng...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else-if="orders.length === 0" class="text-center py-5">
          <i class="fas fa-inbox fa-3x text-light mb-3"></i>
          <p>Không có đơn hàng nào.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách hàng</th>
                <th>Ngày Đặt</th>
                <th class="text-end">Tổng Tiền</th>
                <th class="text-center">Trạng thái</th>
                <th class="text-center">Thanh toán</th>
                <th class="text-center">Giao hàng</th>
                <th class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order._id">
                <td>
                  <router-link :to="{ name: 'AdminOrderDetail', params: { id: order._id } }">
                    #{{ order._id.substring(order._id.length - 7).toUpperCase() }}
                  </router-link>
                </td>
                <td>
                  <div>{{ order.user?.name || 'N/A' }}</div>
                  <small class="text-muted">{{ order.user?.email || 'N/A' }}</small>
                </td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td class="text-end fw-medium">{{ formatCurrency(order.totalPrice) }}</td>
                <td class="text-center">
                  <span :class="['badge', getStatusBadgeClass(order.status)]">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="text-center">
                  <span :class="['badge', order.isPaid ? 'bg-success-subtle text-success-emphasis' : 'bg-warning-subtle text-warning-emphasis']">
                    {{ order.isPaid ? 'Đã TT' : 'Chưa TT' }}
                  </span>
                </td>
                <td class="text-center">
                   <span :class="['badge', order.isDelivered ? 'bg-success-subtle text-success-emphasis' : 'bg-info-subtle text-info-emphasis']">
                    {{ order.isDelivered ? 'Đã Giao' : (order.status === 'shipped' ? 'Đang Giao' : 'Chưa Giao') }}
                  </span>
                </td>
                <td class="text-center">
                  <router-link :to="{ name: 'AdminOrderDetail', params: { id: order._id } }" class="btn btn-sm btn-outline-primary" title="Xem & Sửa">
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <!-- Thêm nút xóa nếu cần, cẩn thận với hành động này -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination Component (nếu có) -->
        <div v-if="!loading && totalPages > 1" class="mt-4 d-flex justify-content-center">
            <!-- Tự thêm component pagination ở đây hoặc dùng thư viện -->
            <nav>
                <ul class="pagination">
                    <li class="page-item" :class="{disabled: currentPage === 1}">
                        <a class="page-link" href="#" @click.prevent="fetchOrders(currentPage - 1)">Trước</a>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{active: currentPage === page}">
                        <a class="page-link" href="#" @click.prevent="fetchOrders(page)">{{page}}</a>
                    </li>
                    <li class="page-item" :class="{disabled: currentPage === totalPages}">
                        <a class="page-link" href="#" @click.prevent="fetchOrders(currentPage + 1)">Sau</a>
                    </li>
                </ul>
            </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import apiClient from '@/services/apiClient'; // Bỏ comment khi dùng API thật

// --- MOCK API CLIENT (XÓA KHI SỬ DỤNG apiClient THỰC TẾ) ---
const apiClient = {
  get: async (url) => {
    console.log(`[MockApiClient] GET ${url}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    // Giả sử url là /api/admin/orders?page=1&limit=10
    const page = parseInt(new URLSearchParams(url.split('?')[1]).get('page')) || 1;
    const limit = 10;
    const totalOrders = 25; // Tổng số đơn hàng giả
    const totalPages = Math.ceil(totalOrders / limit);
    let mockOrders = [];
    for(let i = 0; i < limit; i++) {
        const orderIdNum = (page - 1) * limit + i + 1;
        if (orderIdNum > totalOrders) break;
        mockOrders.push({
            _id: `mockorder${orderIdNum.toString().padStart(3, '0')}`,
            user: { name: `Customer ${orderIdNum}`, email: `customer${orderIdNum}@example.com`},
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            totalPrice: Math.floor(Math.random() * 1000000) + 50000,
            status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
            isPaid: Math.random() > 0.3,
            isDelivered: Math.random() > 0.5
        });
    }
    return { data: { orders: mockOrders, page, pages: totalPages, count: totalOrders } };
  }
};
// --- KẾT THÚC MOCK API CLIENT ---

const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const limitPerPage = 10; // Số đơn hàng mỗi trang

const fetchOrders = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get(`/api/admin/orders?page=${page}&limit=${limitPerPage}`);
    if (response.data && response.data.orders) {
      orders.value = response.data.orders;
      currentPage.value = response.data.page;
      totalPages.value = response.data.pages;
    } else {
      orders.value = [];
      totalPages.value = 1;
      console.warn("AdminAllOrdersPage: No orders array in response or unexpected structure.");
    }
  } catch (err) {
    console.error("AdminAllOrdersPage: Error fetching orders:", err);
    error.value = "Không thể tải danh sách đơn hàng. Vui lòng thử lại.";
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

// Helper functions (copy từ Dashboard.vue hoặc tạo file utils chung)
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
const getStatusText = (status) => {
  const statusMap = {pending: 'Chờ xử lý', processing: 'Đang xử lý', shipped: 'Đã vận chuyển', delivered: 'Đã giao', cancelled: 'Đã hủy', failed: 'Thất bại'};
  return statusMap[status?.toLowerCase()] || status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A';
};
const getStatusBadgeClass = (status) => {
  const s = status?.toLowerCase();
  const classMap = {pending: 'bg-secondary-subtle text-secondary-emphasis', processing: 'bg-warning-subtle text-warning-emphasis', shipped: 'bg-info-subtle text-info-emphasis', delivered: 'bg-success-subtle text-success-emphasis', cancelled: 'bg-danger-subtle text-danger-emphasis', failed: 'bg-danger-subtle text-danger-emphasis'};
  return classMap[s] || 'bg-light text-dark';
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
/* Thêm style nếu cần */
.table th {
    font-weight: 600;
}
</style>