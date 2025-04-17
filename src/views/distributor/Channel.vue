<template>
  <div class="distributor-channel container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
       <h1 class="h2 text-success fw-bold mb-0">
           <i class="fas fa-store-alt me-2"></i>Kênh Người Bán
       </h1>
       <router-link to="/distributor/products/new" class="btn btn-sm btn-success">
           <i class="fas fa-plus me-1"></i> Thêm sản phẩm
       </router-link>
    </div>

    <p class="lead text-muted mb-4">
      Chào mừng <b>{{ userName }}</b>! Quản lý hoạt động kinh doanh của bạn tại đây.
    </p>

    <!-- Phần Thống kê -->
    <div class="row g-4 mb-5">
      <!-- Card Tổng quan đơn hàng -->
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm border-light h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title text-primary mb-0">
                <i class="fas fa-receipt me-2"></i>Đơn hàng
              </h5>
              <router-link to="/distributor/orders" class="small text-decoration-none">Xem tất cả</router-link>
            </div>
            <div v-if="isStatsLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>
            <div v-else class="list-group list-group-flush">
               <div class="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                 Tổng số đơn hàng:
                 <span class="badge bg-primary rounded-pill fs-6">{{ stats.totalOrders || 0 }}</span>
               </div>
               <div class="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                 Đang xử lý:
                 <span class="badge bg-warning text-dark rounded-pill">{{ stats.processingOrders || 0 }}</span>
               </div>
                <div class="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                 Đang giao/Đã giao:
                 <span class="badge bg-info rounded-pill">{{ stats.shippedOrders || 0 }}</span>
               </div>
                <div class="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                 Chờ xác nhận:
                 <span class="badge bg-secondary rounded-pill">{{ stats.pendingOrders || 0 }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Tổng quan doanh thu -->
       <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm border-light h-100">
          <div class="card-body">
             <div class="d-flex justify-content-between align-items-center mb-2">
                 <h5 class="card-title text-success mb-0">
                    <i class="fas fa-dollar-sign me-2"></i>Doanh thu
                 </h5>
            </div>
             <div v-if="isStatsLoading" class="text-center py-3">
                 <div class="spinner-border spinner-border-sm text-success" role="status"></div>
            </div>
             <div v-else>
                <p class="display-6 fw-bold text-success mb-1">{{ formatCurrency(stats.totalRevenue) }}</p>
                <p class="text-muted small mb-3">Tổng doanh thu (dựa trên đơn đã giao)</p>
             </div>
          </div>
        </div>
      </div>

       <!-- Card Hành động nhanh -->
       <div class="col-lg-4">
         <div class="card shadow-sm border-light h-100">
            <div class="card-body d-flex flex-column">
               <h5 class="card-title text-info mb-3">
                   <i class="fas fa-bolt me-2"></i>Truy cập nhanh
               </h5>
               <div class="d-grid gap-2 mt-auto">
                   <router-link to="/distributor/products" class="btn btn-outline-primary">
                       <i class="fas fa-boxes me-1"></i> Quản lý Sản phẩm
                   </router-link>
                    <router-link to="/distributor/orders" class="btn btn-outline-secondary">
                        <i class="fas fa-list-alt me-1"></i> Quản lý Đơn hàng
                   </router-link>
                   <router-link to="/distributor/profile" class="btn btn-outline-dark">
                        <i class="fas fa-store me-1"></i> Thông tin Gian hàng
                   </router-link>
               </div>
            </div>
         </div>
       </div>

    </div>

    <!-- Các phần khác -->
    <div class="card shadow-sm border-light">
        <div class="card-body">
            <h4 class="card-title mb-3">Công cụ và Tài nguyên</h4>
            <ul>
                <li>Quản lý thông tin nhà phân phối</li>
                <li>Thông báo từ hệ thống</li>
                <li>Hướng dẫn bán hàng</li>
                <li>Chính sách nhà phân phối</li>
            </ul>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStoreAlt, faReceipt, faDollarSign, faBoxes, faPlus, faListAlt, faStore, faBolt } from '@fortawesome/free-solid-svg-icons';

library.add(faStoreAlt, faReceipt, faDollarSign, faBoxes, faPlus, faListAlt, faStore, faBolt);

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters['auth/currentUser']);
const userName = computed(() => user.value?.name || '');
const stats = computed(() => store.getters['distributor/distributorStats']);
const isStatsLoading = computed(() => store.getters['distributor/isStatsLoading']);

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

onMounted(async () => {
  try {
    await store.dispatch('distributor/fetchDistributorStats');
  } catch (error) {
     console.error("Component failed to fetch stats initially.");
  }
});

</script>

<style scoped>
.card-title i {
    opacity: 0.7;
}
.display-6 {
    font-size: 2.2rem;
}
.list-group-item {
    border-bottom: 1px solid var(--bs-list-group-border-color) !important;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
}
.list-group-flush .list-group-item:last-child {
    border-bottom-width: 0 !important;
}
.btn-sm.btn-success {
    --bs-btn-padding-y: 0.25rem;
    --bs-btn-padding-x: 0.6rem;
    --bs-btn-font-size: 0.8rem;
}
</style>