<template>
  <div class="order-detail container my-5"> 
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
         <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải chi tiết đơn hàng...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger text-center mx-auto" style="max-width: 600px;">
         <i class="fas fa-exclamation-triangle me-2"></i> {{ error }}
         <div class="mt-3">
             <router-link to="/orders" class="btn btn-sm btn-secondary">
                Quay lại danh sách
             </router-link>
         </div>
    </div>
    <div v-else-if="order" class="mx-auto" style="max-width: 900px;">
       <div class="card shadow-sm border-light p-3 p-md-4 mb-4">
         <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            <h1 class="h4 fw-bold text-success mb-2 mb-md-0">
              <i class="fas fa-file-invoice me-2"></i>Chi tiết đơn hàng #{{ order._id.substring(order._id.length - 8).toUpperCase() }}
            </h1>
            <span
              class="badge rounded-pill fs-6"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          <div class="small text-muted border-top pt-2">
             <span>Ngày đặt hàng: {{ formatDate(order.createdAt) }}</span>
             <span class="mx-2 d-none d-sm-inline">|</span>
             <span class="d-block d-sm-inline mt-1 mt-sm-0">Mã đơn hàng: {{ order._id }}</span>
          </div>
      </div>

      {/* Grid Layout cho các phần thông tin */}
      <div class="row g-4">
          {/* Cột trái: Giao hàng & Thanh toán */}
          <div class="col-lg-7">
                {/* Card Thông tin giao hàng */}
                <div class="card shadow-sm border-light mb-4">
                    <div class="card-header bg-light fw-semibold">
                         <i class="fas fa-map-marker-alt me-2 text-success"></i>Thông tin giao hàng
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <strong class="d-block small text-muted">Người nhận:</strong>
                                <p class="mb-0 text-break">{{ order.shippingAddress?.fullName }}</p> {/* Thêm text-break */}
                            </div>
                            <div class="col-md-6">
                                <strong class="d-block small text-muted">Số điện thoại:</strong>
                                <p class="mb-0">{{ order.shippingAddress?.phone }}</p>
                            </div>
                            <div class="col-12">
                                <strong class="d-block small text-muted">Địa chỉ giao hàng:</strong>
                                <p class="mb-0 text-break"> {/* Thêm text-break */}
                                    {{ formatFullAddress(order.shippingAddress) }}
                                </p>
                            </div>
                             <div v-if="order.note" class="col-12 mt-2 pt-2 border-top">
                                <strong class="d-block small text-muted">Ghi chú:</strong>
                                <p class="mb-0 fst-italic text-break">"{{ order.note }}"</p> {/* Thêm text-break */}
                             </div>
                        </div>
                        <div class="mt-3 pt-3 border-top d-flex align-items-center small">
                            <strong class="me-2">Trạng thái giao hàng:</strong>
                            <span
                                class="badge rounded-pill me-2"
                                :class="order.isDelivered ? 'bg-success' : 'bg-warning text-dark'"
                            >
                                {{ order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng' }}
                            </span>
                            <span v-if="order.isDelivered" class="text-muted">
                                vào {{ formatDate(order.deliveredAt) }}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card Thông tin thanh toán */}
                <div class="card shadow-sm border-light mb-4">
                    <div class="card-header bg-light fw-semibold">
                        <i class="fas fa-credit-card me-2 text-success"></i>Thông tin thanh toán
                    </div>
                     <div class="card-body">
                        <div>
                            <strong class="d-block small text-muted">Phương thức:</strong>
                            <p class="mb-3">{{ getPaymentMethod(order.paymentMethod) }}</p>

                            <div class="d-flex align-items-center small">
                                <strong class="me-2">Trạng thái thanh toán:</strong>
                                <span
                                    class="badge rounded-pill me-2"
                                    :class="order.isPaid ? 'bg-success' : 'bg-warning text-dark'"
                                >
                                    {{ order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                                </span>
                                <span v-if="order.isPaid" class="text-muted">
                                    vào {{ formatDate(order.paidAt) }}
                                </span>
                            </div>
                        </div>
                        {/* Nút thanh toán PayPal */}
                        <div v-if="!order.isPaid && order.paymentMethod === 'paypal'" class="mt-3 pt-3 border-top">
                            <button class="btn btn-primary">
                                <i class="fab fa-paypal me-2"></i>Thanh toán bằng PayPal
                            </button>
                        </div>
                    </div>
                </div>
          </div> {/* End col-lg-7 */}

          {/* Cột phải: Sản phẩm & Tổng tiền */}
           <div class="col-lg-5">
                {/* Card Chi tiết sản phẩm */}
                <div class="card shadow-sm border-light mb-4">
                   <div class="card-header bg-light fw-semibold">
                       <i class="fas fa-shopping-bag me-2 text-success"></i>Chi tiết sản phẩm ({{ order.orderItems.length }})
                   </div>
                    <ul class="list-group list-group-flush">
                        <li v-for="(item, index) in order.orderItems" :key="item._id || `item-${index}`" class="list-group-item d-flex align-items-center">
                            <img
                                :src="item.image || placeholderImg"
                                :alt="item.name"
                                @error="onImageError"
                                loading="lazy"
                                class="rounded me-3 flex-shrink-0"
                                style="width: 50px; height: 50px; object-fit: cover; background-color: #f8f9fa;"
                            >
                            <div class="flex-grow-1 overflow-hidden"> {/* Thêm overflow-hidden */}
                                <div class="fw-medium text-dark small text-truncate">{{ item.name }}</div>
                                <div class="text-muted small">SL: {{ item.quantity }} x {{ formatPrice(item.price) }}</div>
                            </div>
                             <div class="fw-semibold small ps-2 text-nowrap">{{ formatPrice(item.price * item.quantity) }}</div> {/* Thêm text-nowrap */}
                        </li>
                    </ul>
                </div>

                {/* Card Tổng thanh toán */}
                <div class="card shadow-sm border-light">
                    <div class="card-header bg-light fw-semibold">
                       <i class="fas fa-file-invoice-dollar me-2 text-success"></i>Tổng thanh toán
                    </div>
                    <div class="card-body">
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

                 {/* Card Thao tác quản trị */}
                 <div v-if="isAdmin || isDistributor" class="card shadow-sm border-light mt-4">
                    <div class="card-header bg-warning-subtle fw-semibold">
                        <i class="fas fa-user-shield me-2"></i>Thao tác quản trị
                    </div>
                     <div class="card-body d-grid gap-2">
                         <button
                           v-if="!order.isDelivered && canManageOrder"
                           @click="markAsDelivered"
                           class="btn btn-success"
                           :disabled="isActionLoading"
                         >
                             <span v-if="isActionLoading && currentAction === 'deliver'" class="spinner-border spinner-border-sm me-1" ></span>
                              <i v-else class="fas fa-check-circle me-1"></i>
                             Đánh dấu đã giao hàng
                         </button>

                         <button
                           v-if="order.status !== 'cancelled' && order.status !== 'delivered' && canManageOrder"
                           @click="cancelOrder"
                           class="btn btn-danger"
                            :disabled="isActionLoading"
                         >
                             <span v-if="isActionLoading && currentAction === 'cancel'" class="spinner-border spinner-border-sm me-1" ></span>
                              <i v-else class="fas fa-times-circle me-1"></i>
                             Hủy đơn hàng
                         </button>

                         <button v-if="order.status === 'pending' && isAdmin" @click="updateStatus('processing')" class="btn btn-primary" :disabled="isActionLoading">
                            <span v-if="isActionLoading && currentAction === 'processing'" class="spinner-border spinner-border-sm me-1"></span>
                            <i v-else class="fas fa-cogs me-1"></i>
                            Xác nhận & Xử lý
                         </button>
                          <button v-if="order.status === 'processing' && canManageOrder" @click="updateStatus('shipped')" class="btn btn-info text-white" :disabled="isActionLoading">
                            <span v-if="isActionLoading && currentAction === 'shipped'" class="spinner-border spinner-border-sm me-1"></span>
                             <i v-else class="fas fa-shipping-fast me-1"></i>
                             Đánh dấu đang giao
                          </button>

                           <div v-if="isAdmin && !order.distributor && !order.isDelivered" class="mt-3 pt-3 border-top">
                                <label for="distributorSelect" class="form-label small fw-medium">Chỉ định Nhà Phân Phối:</label>
                                <div class="input-group">
                                    <select id="distributorSelect" v-model="selectedDistributorId" class="form-select form-select-sm">
                                        <option value="">-- Chọn NPP --</option>
                                         {/* TODO: Load danh sách NPP */}
                                        <option value="dist1_id">NPP A</option>
                                    </select>
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        @click="assignDistributor"
                                        :disabled="!selectedDistributorId || (isActionLoading && currentAction === 'assign')"
                                    >
                                         <span v-if="isActionLoading && currentAction === 'assign'" class="spinner-border spinner-border-sm"></span>
                                         <span v-else>Chỉ định</span>
                                    </button>
                                </div>
                           </div>
                            <div v-if="order.distributor" class="mt-2 text-muted small">
                                NPP xử lý: {{ order.distributor.name || 'N/A' }}
                            </div>
                     </div>
                 </div>

           </div> 
      </div> 

    </div> 

     <div v-else-if="!loading && !error" class="text-center py-5 card border-light shadow-sm mx-auto" style="max-width: 600px;">
         <div class="card-body">
              <i class="fas fa-question-circle fa-3x text-light mb-3"></i>
             <p class="text-muted">Không tìm thấy thông tin đơn hàng.</p>
             <router-link
             to="/orders"
             class="btn btn-secondary mt-2"
             >
              <i class="fas fa-arrow-left me-1"></i> Quay lại danh sách
             </router-link>
         </div>
     </div>

  </div> 
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileInvoice, faMapMarkerAlt, faCreditCard, faShoppingBag, faFileInvoiceDollar, faUserShield, faCheckCircle, faTimesCircle, faShippingFast, faCogs, faQuestionCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faFileInvoice, faMapMarkerAlt, faCreditCard, faShoppingBag, faFileInvoiceDollar, faUserShield, faCheckCircle, faTimesCircle, faShippingFast, faCogs, faQuestionCircle, faArrowLeft, faPaypal );

export default {
  name: 'OrderDetail',
  props: {
     id: {
         type: String,
         required: true
     }
  },
  data() {
    return {
      selectedDistributorId: '',
      isActionLoading: false,
      currentAction: null,
      placeholderImg: '/images/placeholder.png',
    };
  },
  computed: {
    ...mapGetters({
      order: 'order/currentOrder',
      loading: 'order/isLoading',
      error: 'order/orderError',
      isAdmin: 'auth/isAdmin',
      isDistributor: 'auth/isDistributor',
      currentUser: 'auth/currentUser'
    }),
    isAssignedDistributor() {
        return this.isDistributor && this.order?.distributor?._id === this.currentUser?._id;
    },
     canManageOrder() {
         return this.isAdmin || this.isAssignedDistributor;
     }
  },
  methods: {
    ...mapActions({
      fetchOrderByIdAction: 'order/fetchOrderById',
      deliverOrderAction: 'admin/deliverOrder',
      updateOrderStatusAction: 'admin/updateOrderStatus',
      assignOrderAction: 'admin/assignOrderToDistributor'
    }),

    formatPrice(price) {
      if (price === undefined || price === null) return '0 ₫';
       return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
    },
    getStatusClass(status) {
      const classMap = {
        'pending': 'bg-primary text-white',
        'processing': 'bg-warning text-dark',
        'shipped': 'bg-info text-white',
        'delivered': 'bg-success text-white',
        'cancelled': 'bg-danger text-white'
      };
      return classMap[status] || 'bg-secondary text-white';
    },
    getStatusText(status) {
       const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || 'Không rõ';
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
    onImageError(event) {
       event.target.src = this.placeholderImg;
    },
     formatFullAddress(shippingAddr) {
         if (!shippingAddr) return 'N/A';
         const parts = [
             shippingAddr.address,
             shippingAddr.ward,
             shippingAddr.district,
             shippingAddr.province || shippingAddr.city,
             shippingAddr.country
         ];
         return parts.filter(Boolean).join(', ');
     },
    async fetchOrderDetails(orderId) {
      this.isActionLoading = false;
      try {
        await this.fetchOrderByIdAction(orderId);
      } catch (error) {
        console.error('Component: Error fetching order details:', error);
      }
    },
    async markAsDelivered() {
      if (!this.order || this.isActionLoading) return;
      if (!confirm('Xác nhận đánh dấu đơn hàng này đã giao?')) return;
      this.isActionLoading = true;
      this.currentAction = 'deliver';
      try {
        await this.deliverOrderAction(this.order._id);
        this.$toast.success('Đã cập nhật trạng thái giao hàng.');
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Cập nhật thất bại.');
      } finally {
        this.isActionLoading = false;
        this.currentAction = null;
      }
    },
    async cancelOrder() {
       if (!this.order || this.isActionLoading) return;
       if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        this.isActionLoading = true;
        this.currentAction = 'cancel';
       try {
         await this.updateOrderStatusAction({ orderId: this.order._id, status: 'cancelled' });
         this.$toast.success('Đã hủy đơn hàng.');
       } catch (error) {
          this.$toast.error(error.response?.data?.message || 'Hủy đơn hàng thất bại.');
       } finally {
          this.isActionLoading = false;
          this.currentAction = null;
       }
    },
     async updateStatus(newStatus) {
         if (!this.order || this.isActionLoading || !newStatus) return;
         if (!confirm(`Bạn muốn cập nhật trạng thái đơn hàng thành "${this.getStatusText(newStatus)}"?`)) return;
         this.isActionLoading = true;
         this.currentAction = newStatus;
         try {
            await this.updateOrderStatusAction({ orderId: this.order._id, status: newStatus });
            this.$toast.success(`Đã cập nhật trạng thái thành "${this.getStatusText(newStatus)}".`);
         } catch (error) {
             this.$toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại.');
         } finally {
            this.isActionLoading = false;
            this.currentAction = null;
         }
     },
    async assignDistributor() {
       if (!this.order || !this.selectedDistributorId || this.isActionLoading) return;
       if (!confirm(`Chỉ định đơn hàng này cho Nhà phân phối đã chọn?`)) return;
        this.isActionLoading = true;
        this.currentAction = 'assign';
       try {
         await this.assignOrderAction({
           orderId: this.order._id,
           distributorId: this.selectedDistributorId
         });
          this.$toast.success('Đã chỉ định nhà phân phối thành công.');
          this.selectedDistributorId = '';
       } catch (error) {
          this.$toast.error(error.response?.data?.message || 'Chỉ định thất bại.');
       } finally {
          this.isActionLoading = false;
           this.currentAction = null;
       }
    }
  },
  watch: {
    id: {
      handler(newId) {
        if (newId) {
            this.fetchOrderDetails(newId);
        }
      },
      immediate: true
    }
  },
};
</script>

<style scoped>
.card-header {
    background-color: #f8f9fa;
    font-size: 0.95rem;
}
.list-group-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--bs-list-group-border-color) !important;
}
.list-group-flush .list-group-item:last-child {
    border-bottom-width: 0 !important;
}
dl dt { font-weight: 500; color: #6c757d;}
dl dd { margin-bottom: 0.5rem; }
.badge { font-size: 0.8em; padding: 0.4em 0.7em; }
</style>