<template>
  <div class="order-detail container my-5">
    <!-- Loading State -->
    <div v-if="loading && !order" class="text-center py-5"> 
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
         <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải chi tiết đơn hàng...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger text-center mx-auto shadow-sm" style="max-width: 600px;">
         <i class="fas fa-exclamation-triangle me-2"></i> {{ error }}
         <div class="mt-3">
             <router-link :to="{ name: 'MyOrders' }" class="btn btn-sm btn-secondary"> 
                Quay lại danh sách đơn hàng
             </router-link>
         </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="mx-auto" style="max-width: 950px;"> 
       <div class="card shadow-sm border-light p-3 p-md-4 mb-4">
         <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            <h1 class="h4 fw-bold text-success mb-2 mb-md-0">
              <i class="fas fa-file-invoice me-2"></i>Chi tiết đơn hàng #{{ order._id.substring(order._id.length - 8).toUpperCase() }}
            </h1>
            <span
              class="badge rounded-pill fs-6 px-3 py-2" 
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          <div class="small text-muted border-top pt-3"> 
             <span>Ngày đặt hàng: {{ formatDate(order.createdAt) }}</span>
             <span class="mx-2 d-none d-sm-inline">|</span>
             <span class="d-block d-sm-inline mt-1 mt-sm-0">Mã đơn hàng: {{ order._id }}</span>
          </div>
      </div>

      <div class="row g-4">
          <div class="col-lg-7">
                <div class="card shadow-sm border-light mb-4">
                    <div class="card-header bg-light fw-semibold py-3">
                         <i class="fas fa-map-marker-alt me-2 text-success"></i>Thông tin giao hàng
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-md-6 mb-2">
                                <strong class="d-block small text-muted">Người nhận:</strong>
                                <p class="mb-0 text-break fs-6">{{ order.shippingAddress?.fullName || 'N/A' }}</p>
                            </div>
                            <div class="col-md-6 mb-2">
                                <strong class="d-block small text-muted">Số điện thoại:</strong>
                                <p class="mb-0 fs-6">{{ order.shippingAddress?.phone || 'N/A' }}</p>
                            </div>
                             <div class="col-12 mb-2">
                                <strong class="d-block small text-muted">Email:</strong>
                                <p class="mb-0 fs-6 text-break">{{ order.shippingAddress?.email || order.user?.email || 'N/A' }}</p>
                            </div>
                            <div class="col-12">
                                <strong class="d-block small text-muted">Địa chỉ giao hàng:</strong>
                                <p class="mb-0 text-break fs-6">
                                    {{ formatFullAddress(order.shippingAddress) || 'N/A' }}
                                </p>
                            </div>
                             <div v-if="order.note" class="col-12 mt-3 pt-3 border-top">
                                <strong class="d-block small text-muted">Ghi chú của khách hàng:</strong>
                                <p class="mb-0 fst-italic text-break fs-6">"{{ order.note }}"</p>
                             </div>
                        </div>
                        <div class="mt-3 pt-3 border-top d-flex align-items-center small">
                            <strong class="me-2">Trạng thái giao hàng:</strong>
                            <span class="badge rounded-pill me-2 fs-08rem" :class="order.isDelivered ? 'bg-success-subtle text-success-emphasis' : 'bg-warning-subtle text-warning-emphasis'">
                                {{ order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng' }}
                            </span>
                            <span v-if="order.isDelivered" class="text-muted">
                                lúc {{ formatDate(order.deliveredAt) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm border-light mb-4">
                    <div class="card-header bg-light fw-semibold py-3">
                        <i class="fas fa-credit-card me-2 text-success"></i>Thông tin thanh toán
                    </div>
                     <div class="card-body p-4">
                        <div>
                            <strong class="d-block small text-muted">Phương thức:</strong>
                            <p class="mb-3 fs-6">{{ getPaymentMethod(order.paymentMethod) }}</p>

                            <div class="d-flex align-items-center small">
                                <strong class="me-2">Trạng thái thanh toán:</strong>
                                <span class="badge rounded-pill me-2 fs-08rem" :class="order.isPaid ? 'bg-success-subtle text-success-emphasis' : 'bg-warning-subtle text-warning-emphasis'">
                                    {{ order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                                </span>
                                <span v-if="order.isPaid" class="text-muted">
                                    lúc {{ formatDate(order.paidAt) }}
                                </span>
                            </div>
                        </div>
                        <div v-if="!order.isPaid && order.paymentMethod === 'paypal'" class="mt-4 pt-3 border-top">
                            <button class="btn btn-primary btn-lg"> {/* Thêm btn-lg */}
                                <font-awesome-icon :icon="['fab', 'paypal']" class="me-2" />Thanh toán ngay với PayPal
                            </button>
                            
                        </div>
                    </div>
                </div>
          </div> 

           <div class="col-lg-5">
                <div class="card shadow-sm border-light mb-4">
                   <div class="card-header bg-light fw-semibold py-3">
                       <i class="fas fa-shopping-bag me-2 text-success"></i>Chi tiết sản phẩm ({{ order.orderItems ? order.orderItems.length : 0 }})
                   </div>
                    <ul class="list-group list-group-flush" v-if="order.orderItems && order.orderItems.length > 0">
                        <li v-for="(item, index) in order.orderItems" :key="item._id || `ordered-item-${index}`" class="list-group-item d-flex align-items-center px-3 py-2">
                            <img :src="item.image || placeholderImg" :alt="item.name" @error="onImageError" loading="lazy" class="rounded me-3 flex-shrink-0" style="width: 50px; height: 50px; object-fit: cover; background-color: #f8f9fa;">
                            <div class="flex-grow-1 overflow-hidden">
                                <div class="fw-medium text-dark small text-truncate" :title="item.name">{{ item.name || 'Sản phẩm không tên' }}</div>
                                <div class="text-muted small">SL: {{ item.quantity }} x {{ formatPrice(item.price) }}</div>
                            </div>
                             <div class="fw-semibold small ps-2 text-nowrap">{{ formatPrice(item.price * item.quantity) }}</div>
                        </li>
                    </ul>
                     <div v-else class="card-body text-center text-muted">
                         <p class="mb-0">Không có sản phẩm trong đơn hàng.</p>
                     </div>
                </div>

                <div class="card shadow-sm border-light">
                    <div class="card-header bg-light fw-semibold py-3">
                       <i class="fas fa-file-invoice-dollar me-2 text-success"></i>Tổng thanh toán
                    </div>
                    <div class="card-body p-4">
                         <div class="d-flex justify-content-between mb-1 text-muted">
                            <span>Tạm tính:</span>
                            <span>{{ formatPrice(order.itemsPrice) }}</span>
                         </div>
                         <div class="d-flex justify-content-between mb-2 text-muted">
                             <span>Phí vận chuyển:</span>
                             <span>{{ formatPrice(order.shippingPrice) }}</span>
                         </div>
                         
                         <div class="pt-2 mt-2 border-top d-flex justify-content-between fw-bold fs-5">
                            <span>Tổng cộng:</span>
                            <span class="text-success">{{ formatPrice(order.totalPrice) }}</span>
                         </div>
                    </div>
                </div>

                 <div v-if="isAdmin || isDistributor" class="card shadow-sm border-light mt-4">
                    <div class="card-header bg-warning-subtle text-dark-emphasis fw-semibold py-3">
                        <i class="fas fa-user-shield me-2"></i>Thao tác quản trị
                    </div>
                     <div class="card-body d-grid gap-2 p-4">
                         <button v-if="!order.isDelivered && canManageOrder && order.status !== 'cancelled'" @click="markAsDelivered" class="btn btn-success" :disabled="isActionLoading">
                             <span v-if="isActionLoading && currentAction === 'deliver'" class="spinner-border spinner-border-sm me-1" ></span>
                              <i v-else class="fas fa-check-circle me-1"></i>
                             Đánh dấu đã giao
                         </button>
                         <button v-if="order.status !== 'cancelled' && order.status !== 'delivered' && canManageOrder" @click="cancelOrder" class="btn btn-danger" :disabled="isActionLoading">
                             <span v-if="isActionLoading && currentAction === 'cancel'" class="spinner-border spinner-border-sm me-1" ></span>
                              <i v-else class="fas fa-times-circle me-1"></i>
                             Hủy đơn hàng
                         </button>
                         <button v-if="order.status === 'pending' && isAdmin" @click="updateStatus('processing')" class="btn btn-primary" :disabled="isActionLoading">
                            <span v-if="isActionLoading && currentAction === 'processing'" class="spinner-border spinner-border-sm me-1"></span>
                            <i v-else class="fas fa-cogs me-1"></i>
                            Xác nhận & Xử lý
                         </button>
                          <button v-if="order.status === 'processing' && canManageOrder && !order.isDelivered" @click="updateStatus('shipped')" class="btn btn-info text-white" :disabled="isActionLoading">
                            <span v-if="isActionLoading && currentAction === 'shipped'" class="spinner-border spinner-border-sm me-1"></span>
                             <i v-else class="fas fa-shipping-fast me-1"></i>
                             Đánh dấu đang giao
                          </button>
                           
                     </div>
                 </div>
           </div> 
      </div> 
    </div> 
     <div v-else-if="!loading && !error && !order" class="text-center py-5 card border-light shadow-sm mx-auto" style="max-width: 600px;">
         <div class="card-body">
              <i class="fas fa-question-circle fa-3x text-light mb-3"></i>
             <p class="text-muted">Không thể tải thông tin đơn hàng. Có thể đơn hàng không tồn tại hoặc bạn không có quyền xem.</p>
             <router-link :to="{ name: 'MyOrders' }" class="btn btn-secondary mt-2">
              <i class="fas fa-arrow-left me-1"></i> Quay lại danh sách đơn hàng
             </router-link>
         </div>
     </div>
  </div> 
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
// Solid Icons
import { 
    faFileInvoice, faMapMarkerAlt, faCreditCard, faShoppingBag, 
    faFileInvoiceDollar, faUserShield, faCheckCircle, faTimesCircle, 
    faShippingFast, faCogs, faQuestionCircle, faArrowLeft, faSpinner,
    faBoxOpen, faPrint, faEnvelope, faPhone, faTruck // Thêm các icon còn thiếu
} from '@fortawesome/free-solid-svg-icons';
// Brand Icons
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

library.add(
    faFileInvoice, faMapMarkerAlt, faCreditCard, faShoppingBag, 
    faFileInvoiceDollar, faUserShield, faCheckCircle, faTimesCircle, 
    faShippingFast, faCogs, faQuestionCircle, faArrowLeft, faSpinner,
    faBoxOpen, faPrint, faEnvelope, faPhone, faTruck,
    faPaypal 
);

export default {
  name: 'OrderDetail',
  props: {
     id: { type: String, required: true }
  },
  data() {
    return {
      selectedDistributorId: '', // Dùng nếu có chức năng gán NPP
      isActionLoading: false,    // Loading cho các action (deliver, cancel, ...)
      currentAction: null,       // Action nào đang được thực hiện
      placeholderImg: '/images/placeholder.png',
    };
  },
  computed: {
    ...mapGetters({
      order: 'order/currentOrder', // Getter cho chi tiết đơn hàng hiện tại
      loading: 'order/isLoading',  // Getter cho trạng thái loading của module order
      error: 'order/orderError',   // Getter cho lỗi của module order
      isAdmin: 'auth/isAdmin',
      isDistributor: 'auth/isDistributor',
      currentUser: 'auth/currentUser'
    }),
    // Kiểm tra xem user hiện tại có phải là distributor được gán cho đơn hàng này không
    isAssignedDistributor() {
        return this.isDistributor && this.order && this.order.distributor && this.currentUser && this.order.distributor._id === this.currentUser._id;
    },
    // Kiểm tra xem user có quyền quản lý đơn hàng này không (admin hoặc assigned distributor)
     canManageOrder() {
         return this.isAdmin || this.isAssignedDistributor;
     }
  },
  methods: {
    ...mapActions({
      fetchOrderByIdAction: 'order/fetchOrderById',
      deliverOrderAction: 'order/updateOrderToDelivered', // Giả sử action này trong module order
      updateOrderStatusAction: 'order/updateOrderStatus',   // Giả sử action này trong module order
      // assignOrderAction: 'admin/assignOrderToDistributor' // Nếu gán NPP là của admin
    }),

    formatPrice(price) {
      if (price === undefined || price === null || isNaN(Number(price))) return '0 ₫';
       return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);
      } catch (e) {
        return 'Ngày không hợp lệ';
      }
    },
    getStatusClass(status) {
      const classMap = {
        'pending': 'bg-primary-subtle text-primary-emphasis',
        'processing': 'bg-warning-subtle text-warning-emphasis',
        'shipped': 'bg-info-subtle text-info-emphasis',
        'delivered': 'bg-success-subtle text-success-emphasis',
        'cancelled': 'bg-danger-subtle text-danger-emphasis'
      };
      return classMap[status] || 'bg-secondary-subtle text-secondary-emphasis';
    },
    getStatusText(status) {
       const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status?.charAt(0).toUpperCase() + status?.slice(1) || 'Không rõ';
    },
    getPaymentMethod(method) {
      const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'paypal': 'PayPal',
        'card': 'Thẻ tín dụng/ghi nợ',
        'bank': 'Chuyển khoản ngân hàng',
        'banking': 'Chuyển khoản ngân hàng', // Add alias
        'momo': 'Ví MoMo',
        'vnpay': 'VNPay'
      };
      return methodMap[method] || method;
    },
    onImageError(event) { event.target.src = this.placeholderImg; },
    formatFullAddress(shippingAddr) {
         if (!shippingAddr) return 'N/A';
         const parts = [ shippingAddr.address, shippingAddr.ward, shippingAddr.district, shippingAddr.province, shippingAddr.country];
         return parts.filter(p => p && String(p).trim() !== '').join(', ');
     },
    async fetchOrderDetails(orderIdToFetch) {
      if (!orderIdToFetch) return;
      this.isActionLoading = false; // Reset action loading
      this.currentAction = null;
      try {
        await this.fetchOrderByIdAction(orderIdToFetch);
      } catch (fetchError) {
        console.error('OrderDetail: Error fetching order details:', fetchError);
        // Lỗi đã được set vào state.error bởi action, component sẽ tự hiển thị
      }
    },
    async handleOrderAction(actionType, confirmMessage, actionDispatchDetails) {
        if (!this.order || this.isActionLoading) return;
        if (!confirm(confirmMessage)) return;
        
        this.isActionLoading = true;
        this.currentAction = actionType;
        try {
            if (actionType === 'deliver') {
                await this.deliverOrderAction(this.order._id);
            } else if (actionType === 'cancel') {
                await this.updateOrderStatusAction({ orderId: this.order._id, status: 'cancelled' });
            } else if (actionDispatchDetails && actionDispatchDetails.actionName) {
                 await this.$store.dispatch(actionDispatchDetails.actionName, actionDispatchDetails.payload);
            }
            this.$toast.success(actionDispatchDetails.successMessage || 'Thao tác thành công!');
            // Sau khi thành công, fetch lại chi tiết đơn hàng để cập nhật UI
            await this.fetchOrderDetails(this.order._id);

        } catch (error) {
            this.$toast.error(error.response?.data?.message || error.message || 'Thao tác thất bại.');
        } finally {
            this.isActionLoading = false;
            this.currentAction = null;
        }
    },
    markAsDelivered() {
        this.handleOrderAction('deliver', 'Xác nhận đánh dấu đơn hàng này đã giao?', {
            actionName: 'order/updateOrderToDelivered', // Sửa cho khớp với mapActions
            payload: this.order._id,
            successMessage: 'Đã cập nhật trạng thái giao hàng.'
        });
    },
    cancelOrder() {
        this.handleOrderAction('cancel', 'Bạn có chắc chắn muốn hủy đơn hàng này?', {
            actionName: 'order/updateOrderStatus', // Sửa cho khớp với mapActions
            payload: { orderId: this.order._id, status: 'cancelled' },
            successMessage: 'Đã hủy đơn hàng.'
        });
    },
    updateStatus(newStatus) {
        this.handleOrderAction(newStatus, `Cập nhật trạng thái thành "${this.getStatusText(newStatus)}"?`, {
             actionName: 'order/updateOrderStatus', // Sửa cho khớp với mapActions
             payload: { orderId: this.order._id, status: newStatus },
             successMessage: `Đã cập nhật trạng thái thành "${this.getStatusText(newStatus)}".`
        });
    },
    // assignDistributor() { /* TODO: Hoàn thiện nếu cần */ }
  },
  watch: {
    id: { // Theo dõi prop 'id' từ router
      handler(newId) {
        if (newId && newId !== this.order?._id) { // Chỉ fetch nếu ID thay đổi thực sự
            this.$store.commit('order/CLEAR_CURRENT_ORDER'); // Xóa order cũ trước khi fetch
            this.fetchOrderDetails(newId);
        }
      },
      immediate: true // Gọi handler ngay khi component được tạo với prop id ban đầu
    }
  },
  created() {
    // Không cần gọi fetchOrderDetails ở đây nữa vì watch immediate đã xử lý
    // Nếu không có id prop, hoặc route không cung cấp, cần xử lý
    if (!this.id) {
        this.$toast.error("Không tìm thấy ID đơn hàng.");
        this.$router.push({name: 'MyOrders'}); // Hoặc trang lỗi
    }
  }
};
</script>

<style scoped>
.card-header { background-color: #f8f9faee; font-size: 0.95rem; padding: 0.8rem 1.25rem;}
.list-group-item { padding: 0.8rem 1.25rem; border-bottom: 1px solid var(--bs-list-group-border-color) !important; }
.list-group-flush .list-group-item:last-child { border-bottom-width: 0 !important; }
.badge { font-size: 0.8em; padding: 0.45em 0.75em; }
.fs-08rem { font-size: 0.8rem !important; }
.text-break { word-break: break-word; }
.overflow-hidden { overflow: hidden; }
.text-nowrap { white-space: nowrap; }
.text-dark-emphasis { color: var(--bs-dark-text-emphasis) !important; }
.bg-primary-subtle { background-color: var(--bs-primary-bg-subtle) !important; }
.text-primary-emphasis { color: var(--bs-primary-text-emphasis) !important; }
/* Thêm các class subtle khác nếu Bootstrap 5.3+ */
.bg-warning-subtle { background-color: #fff3cd; } 
.text-warning-emphasis { color: #664d03; }
.bg-info-subtle { background-color: #cff4fc; }
.text-info-emphasis { color: #055160; }
.bg-success-subtle { background-color: #d1e7dd; }
.text-success-emphasis { color: #0f5132; }
.bg-danger-subtle { background-color: #f8d7da; }
.text-danger-emphasis { color: #58151c; }
.bg-secondary-subtle { background-color: #e2e3e5; }
.text-secondary-emphasis { color: #41464b; }

</style>