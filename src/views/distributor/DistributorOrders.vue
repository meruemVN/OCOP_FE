<template>
  <div class="container py-4">
    <h1>Quản lý Đơn hàng (Nhà Phân Phối)</h1>
    <p>Danh sách các đơn hàng được giao cho Nhà Phân Phối này xử lý.</p>
    <!-- Thêm bảng hiển thị danh sách đơn hàng, bộ lọc, v.v. -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="orders.length === 0">
      <p>Không có đơn hàng nào để hiển thị.</p>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã Đơn</th>
            <th>Khách hàng</th>
            <th>Ngày Đặt</th>
            <th>Tổng Tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>#{{ order._id.slice(-6).toUpperCase() }}</td>
            <td>{{ order.user?.name || 'N/A' }}</td>
            <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
            <td>{{ order.totalPrice }} VND</td>
            <td>{{ order.status }}</td>
            <td>
              <button class="btn btn-sm btn-info">Xem Chi Tiết</button>
              <!-- Thêm các hành động khác -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import apiClient from '@/services/apiClient'; // Nếu bạn fetch API ở đây

const orders = ref([]);
const loading = ref(true);

onMounted(async () => {
  console.log('DistributorOrders component mounted.');
  // Ví dụ fetch đơn hàng của NPP
  // try {
  //   const response = await apiClient.get('/distributor/orders'); // Endpoint của bạn
  //   orders.value = response.data.orders || response.data;
  // } catch (error) {
  //   console.error("Error fetching distributor orders:", error);
  // } finally {
  //   loading.value = false;
  // }
  // Tạm thời để rỗng
  loading.value = false;
});
</script>

<style scoped>
/* Styles specific to DistributorOrders */
</style>