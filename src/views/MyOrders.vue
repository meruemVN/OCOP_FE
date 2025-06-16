<template>
  <div class="my-orders container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
      <i class="fas fa-receipt me-2"></i>Đơn hàng của tôi
    </h1>

    <div class="card shadow-sm border-light">
      <!-- Tab buttons using Navs -->
      <div class="card-header bg-light p-0 border-bottom">
        <ul class="nav nav-tabs nav-fill border-0">
          <li v-for="tab in tabs" :key="tab.value" class="nav-item">
            <button
              class="nav-link border-0 rounded-0 py-3"
              :class="{ 'active bg-white text-success fw-semibold': activeTab === tab.value, 'text-secondary': activeTab !== tab.value }"
              @click="activeTab = tab.value"
              type="button"
            >
              <i :class="tab.icon" class="me-1"></i>
              {{ tab.label }}
              <span v-if="tab.value !== 'all' && getCountForTab(tab.value) > 0" class="badge bg-secondary rounded-pill ms-1 align-middle">
                {{ getCountForTab(tab.value) }}
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div class="card-body p-0">
        <!-- Orders list -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center py-5" style="min-height: 300px;">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <span class="ms-3 text-muted">Đang tải đơn hàng...</span>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-5 px-3" style="min-height: 300px;">
          <div class="mb-4">
             <i class="fas fa-box-open text-light display-4"></i>
          </div>
          <p class="text-muted mb-4 fs-5">Bạn chưa có đơn hàng nào {{ activeTab !== 'all' ? 'trong trạng thái này' : '' }}.</p>
          <router-link
            to="/"
            class="btn btn-success btn-lg px-4 rounded-pill shadow-sm"
          >
            <i class="fas fa-shopping-cart me-2"></i>
            Tiếp tục mua sắm
          </router-link>
        </div>

        <div v-else class="list-group list-group-flush">
          <!-- Order Item -->
          <div
            v-for="order in filteredOrders"
            :key="order._id"
            class="list-group-item p-3 p-md-4"
          >
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
              <div>
                <h5 class="mb-1 fw-semibold text-dark">
                  Đơn hàng #{{ order._id.substring(order._id.length - 8).toUpperCase() }}
                </h5>
                <small class="text-muted">
                  Ngày đặt: {{ formatDate(order.createdAt) }}
                </small>
              </div>
              <div class="mt-2 mt-md-0 d-flex align-items-center">
                 <!-- Status Badge -->
                <span
                  class="badge rounded-pill me-3 fs-09"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusText(order.status) }}
                </span>
                <router-link
                  :to="`/order/${order._id}`"
                  class="btn btn-sm btn-outline-success py-1 px-2"
                >
                  Xem chi tiết
                </router-link>
              </div>
            </div>

            <!-- Product Snippets -->
            <div class="border-top pt-3">
              <div
                v-for="(item, index) in order.orderItems.slice(0, 2)"
                :key="index"
                class="d-flex align-items-center mb-2"
              >
                <img
                  :src="item.image || 'https://placehold.co/600x400'"
                  :alt="item.name"
                  class="rounded me-3"
                  style="width: 45px; height: 45px; object-fit: cover;"
                >
                <div class="flex-grow-1">
                  <div class="text-dark text-truncate" style="max-width: 300px;">{{ item.name }}</div>
                  <small class="text-muted">{{ item.quantity }} x {{ formatPrice(item.price) }}</small>
                </div>
              </div>

              <div v-if="order.orderItems.length > 2" class="text-muted small mt-2">
                + {{ order.orderItems.length - 2 }} sản phẩm khác
              </div>

              <!-- Order Total & Actions -->
              <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <div>
                  <span class="text-secondary">Tổng tiền:</span>
                  <span class="fw-bold text-dark ms-2 fs-5">{{ formatPrice(order.totalPrice) }}</span>
                </div>

                 <!-- Action Buttons -->
                <div class="d-flex gap-2">
                  <button
                    v-if="order.status === 'delivered'"
                    class="btn btn-sm btn-warning text-white py-1 px-2"
                  >
                    <i class="fas fa-star me-1"></i> Đánh giá
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                     @click="cancelOrder(order._id)"
                    class="btn btn-sm btn-danger py-1 px-2"
                  >
                    <i class="fas fa-times me-1"></i> Hủy đơn
                  </button>
                   <button
                    v-if="order.status === 'delivered'"
                     @click="repurchaseOrder(order)"
                    class="btn btn-sm btn-success py-1 px-2"
                  >
                     <i class="fas fa-redo me-1"></i> Mua lại
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- End Order Item -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// Import Font Awesome icons nếu cần thêm
import { library } from '@fortawesome/fontawesome-svg-core';
import { faReceipt, faBoxOpen, faShoppingBag, faShippingFast, faCheckCircle, faTimesCircle, faHourglassHalf, faCogs, faStar, faRedo } from '@fortawesome/free-solid-svg-icons';

library.add(faReceipt, faBoxOpen, faShoppingBag, faShippingFast, faCheckCircle, faTimesCircle, faHourglassHalf, faCogs, faStar, faRedo);


export default {
  name: 'MyOrders',
  data() {
    return {
      loading: true,
      activeTab: 'all',
      tabs: [
        // Thêm icon cho tabs
        { label: 'Tất cả', value: 'all', icon: 'fas fa-list-alt' },
        { label: 'Chờ xác nhận', value: 'pending', icon: 'fas fa-hourglass-half' },
        { label: 'Đang xử lý', value: 'processing', icon: 'fas fa-cogs' },
        { label: 'Đang giao', value: 'shipped', icon: 'fas fa-shipping-fast' }, // Sửa value thành shipped nếu backend dùng shipped
        { label: 'Đã giao', value: 'delivered', icon: 'fas fa-check-circle' },
        { label: 'Đã hủy', value: 'cancelled', icon: 'fas fa-times-circle' }
      ]
    };
  },
  computed: {
    ...mapGetters({
      orders: 'order/myOrders'
    }),
    filteredOrders() {
      if (!Array.isArray(this.orders)) {
           return [];
      }
      if (this.activeTab === 'all') {
        // Sắp xếp theo ngày tạo mới nhất
        return [...this.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      const filtered = this.orders.filter(order => order.status === this.activeTab);
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },
  methods: {
    ...mapActions({
      fetchMyOrders: 'order/fetchMyOrders',
      // Thêm action hủy đơn nếu có
      // cancelOrderAction: 'order/cancelOrder',
    }),
    // Hàm tính số lượng cho mỗi tab (nếu cần)
    getCountForTab(status) {
        if (!Array.isArray(this.orders)) return 0;
        return this.orders.filter(order => order.status === status).length;
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    formatPrice(price) {
      if (price === undefined || price === null) return 'N/A';
      // Sử dụng định dạng tiền tệ VND
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Chờ xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao', // Đổi shipping thành shipped nếu backend dùng shipped
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status;
    },
    getStatusClass(status) {
      // Sử dụng các class màu của Bootstrap
      const classMap = {
        'pending': 'bg-primary text-white', // Xanh dương
        'processing': 'bg-warning text-dark', // Vàng
        'shipped': 'bg-info text-white', // Xanh lơ (cho đang giao)
        'delivered': 'bg-success text-white', // Xanh lá
        'cancelled': 'bg-danger text-white' // Đỏ
      };
      return classMap[status] || 'bg-secondary text-white'; // Xám cho trạng thái khác
    },
    // Hàm xử lý hủy đơn (ví dụ)
    async cancelOrder(orderId) {
        if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            try {
                // Gọi action Vuex để hủy đơn
                // await this.cancelOrderAction(orderId);
                alert('Đã gửi yêu cầu hủy đơn hàng.'); // Hoặc cập nhật UI trực tiếp nếu API trả về đơn đã hủy
                // Cập nhật lại danh sách đơn hàng
                await this.fetchMyOrders();
            } catch (error) {
                 this.$toast.error(error.response?.data?.message || 'Hủy đơn hàng thất bại.');
            }
        }
    },
    // Hàm xử lý mua lại (ví dụ - cần logic phức tạp hơn)
    repurchaseOrder(order) {
        // Logic này cần:
        // 1. Lấy các sản phẩm từ đơn hàng cũ.
        // 2. Thêm các sản phẩm đó vào giỏ hàng hiện tại (có thể cần gọi action addToCart nhiều lần).
        // 3. Điều hướng người dùng đến trang giỏ hàng.
        alert('Chức năng mua lại đang được phát triển!');
        // Ví dụ:
        // for (const item of order.orderItems) {
        //    await this.$store.dispatch('cart/addToCart', { productId: item.product, quantity: item.quantity });
        // }
        // this.$router.push('/cart');
    }
  },
  async mounted() {
    try {
      this.loading = true;
      await this.fetchMyOrders();
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Không cần toast ở đây nếu action không throw lỗi và getter/state đã xử lý
      // this.$toast.error('Không thể lấy danh sách đơn hàng');
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
.nav-tabs .nav-link {
  margin-bottom: -1px; /* Giúp border-bottom của tab active đè lên border của card-header */
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.nav-tabs .nav-link.active {
  border-color: #dee2e6 #dee2e6 #fff; /* Màu border của Bootstrap */
}

.list-group-item {
    transition: background-color 0.15s ease-in-out;
}
.list-group-item:hover {
    background-color: #f8f9fa; /* Màu xám nhạt khi hover */
}

/* Đảm bảo badge nhỏ hơn một chút */
.fs-09 {
    font-size: 0.85em;
}

/* Nút nhỏ hơn */
.btn-sm {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
}

/* Loader căn giữa */
.spinner-border {
    width: 2.5rem;
    height: 2.5rem;
}
</style>