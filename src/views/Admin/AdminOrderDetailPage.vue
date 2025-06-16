<template>
  <div class="container-fluid py-4">
    <h1 class="h3 mb-2 text-gray-800">
        <i class="fas fa-file-invoice-dollar me-2"></i>Chi tiết Đơn hàng
    </h1>
    <p class="mb-4">
      Quản lý thông tin và trạng thái của đơn hàng #{{ orderIdDisplay }}.
       <router-link :to="{name: 'AdminAllOrders'}" class="ms-2 small">« Quay lại danh sách</router-link>
    </p>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-2">Đang tải chi tiết đơn hàng...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
    </div>
    <div v-else-if="!order" class="alert alert-warning">
      <i class="fas fa-info-circle me-2"></i>Không tìm thấy thông tin đơn hàng.
    </div>

    <div v-else class="row">
      <!-- Cột thông tin chính -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-light mb-4">
          <div class="card-header bg-light py-3">
            <h6 class="m-0 font-weight-bold text-primary">Thông tin Đơn hàng</h6>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Mã đơn hàng:</strong> {{ order._id }}<br>
                <strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}<br>
                <strong>Khách hàng:</strong> {{ order.user?.name || 'N/A' }} ({{ order.user?.email || 'N/A' }})
              </div>
              <div class="col-md-6">
                <strong>Tổng tiền sản phẩm:</strong> {{ formatCurrency(order.itemsPrice) }}<br>
                <strong>Phí vận chuyển:</strong> {{ formatCurrency(order.shippingPrice) }}<br>
                <strong class="fs-5">Tổng cộng:</strong> <span class="fs-5 text-danger fw-bold">{{ formatCurrency(order.totalPrice) }}</span>
              </div>
            </div>
            <hr>
            <h6 class="mt-3 mb-2">Địa chỉ giao hàng:</h6>
            <p>
              {{ order.shippingAddress.fullName }}<br>
              {{ order.shippingAddress.phone }}<br>
              {{ order.shippingAddress.address }}, {{ order.shippingAddress.ward }}, {{ order.shippingAddress.district }}, {{ order.shippingAddress.province }}
            </p>
            <h6 class="mt-3 mb-2">Phương thức thanh toán:</h6>
            <p>{{ order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod }}</p>
            <div v-if="order.note">
                <h6 class="mt-3 mb-2">Ghi chú của khách:</h6>
                <p class="fst-italic">"{{ order.note }}"</p>
            </div>
          </div>
        </div>

        <div class="card shadow-sm border-light mb-4">
          <div class="card-header bg-light py-3">
            <h6 class="m-0 font-weight-bold text-primary">Các sản phẩm trong đơn</h6>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table mb-0 table-hover">
                <thead>
                  <tr class="table-light">
                    <th>Sản phẩm</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-end">Đơn giá</th>
                    <th class="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.orderItems" :key="item.product || item._id"> <!-- Thêm item._id làm fallback key -->
                    <td>
                      <div class="d-flex align-items-center">
                        <img :src="item.image || '/images/placeholder.png'" 
                             :alt="item.name" 
                             style="width: 50px; height: 50px; object-fit: cover;" 
                             class="me-2 rounded border">
                        <div>
                          <span class="fw-medium">{{ item.name }}</span>
                          <small v-if="item.product" class="d-block text-muted">ID Sản phẩm: {{ item.product.toString().slice(-6).toUpperCase() }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="text-center align-middle">{{ item.quantity }}</td>
                    <td class="text-end align-middle">{{ formatCurrency(item.price) }}</td>
                    <td class="text-end align-middle fw-medium">{{ formatCurrency(item.price * item.quantity) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột cập nhật trạng thái -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-light mb-4">
          <div class="card-header bg-light py-3">
            <h6 class="m-0 font-weight-bold text-primary">Cập nhật Trạng thái</h6>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="orderStatus" class="form-label">Trạng thái đơn hàng:</label>
              <select id="orderStatus" class="form-select" v-model="selectedStatus" :disabled="updatingStatus">
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã vận chuyển</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
             <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="isPaid" v-model="isPaidStatus" :disabled="updatingStatus">
                <label class="form-check-label" for="isPaid">Đã thanh toán</label>
            </div>
             <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="isDelivered" v-model="isDeliveredStatus" :disabled="updatingStatus || selectedStatus !== 'delivered'">
                <label class="form-check-label" for="isDelivered">Đã giao hàng (chỉ kích hoạt khi trạng thái là "Đã giao")</label>
            </div>

            <button class="btn btn-success w-100" @click="handleUpdateOrder" :disabled="updatingStatus || !isChanged">
              <span v-if="updatingStatus" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {{ updatingStatus ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
            </button>
            <p v-if="updateError" class="text-danger mt-2 small">{{ updateError }}</p>
          </div>
        </div>
        <!-- Thêm các panel khác nếu cần (ví dụ: Giao cho NPP) -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/services/api'; // Đảm bảo đường dẫn này đúng
import { useToast } from 'vue-toastification'; // Nếu bạn dùng toast

const toast = useToast(); // Khởi tạo toast
const route = useRoute();
const router = useRouter(); // Khởi tạo router nếu cần dùng router.push()

// --- KHAI BÁO STATE REACTIVE ---
const orderId = ref(route.params.id);
const order = ref(null);
const loading = ref(true);
const error = ref(null);

const selectedStatus = ref('');
const isPaidStatus = ref(false);
const isDeliveredStatus = ref(false);
const originalOrderData = ref(null); // Để so sánh xem có thay đổi không

const updatingStatus = ref(false);
const updateError = ref(null);

// --- COMPUTED PROPERTIES ---
const orderIdDisplay = computed(() => {
  return orderId.value ? orderId.value.substring(orderId.value.length - 7).toUpperCase() : 'N/A';
});

const isChanged = computed(() => {
    if (!order.value || !originalOrderData.value) {
        console.log('[isChanged] order or originalOrderData is null, returning false');
        return false;
    }
    const statusChanged = selectedStatus.value !== originalOrderData.value.status;
    const paidChanged = isPaidStatus.value !== originalOrderData.value.isPaid;
    
    // isDelivered chỉ có ý nghĩa khi status là 'delivered' hoặc sắp chuyển thành 'delivered'
    let deliveredChanged = false;
    if (selectedStatus.value === 'delivered') {
        deliveredChanged = isDeliveredStatus.value !== originalOrderData.value.isDelivered;
    } else if (originalOrderData.value.status === 'delivered' && selectedStatus.value !== 'delivered') {
        // Nếu chuyển từ 'delivered' sang trạng thái khác, isDelivered sẽ bị bỏ qua (thường là false ở backend)
        // hoặc giữ nguyên giá trị cũ tùy logic backend.
        // Để đơn giản, coi như có thay đổi nếu status thay đổi khỏi 'delivered'
        deliveredChanged = true; 
    }

    const changed = statusChanged || paidChanged || deliveredChanged;
    console.log('[isChanged] Values:', {
        selectedStatus: selectedStatus.value,
        originalStatus: originalOrderData.value.status,
        isPaidStatus: isPaidStatus.value,
        originalIsPaid: originalOrderData.value.isPaid,
        isDeliveredStatus: isDeliveredStatus.value,
        originalIsDelivered: originalOrderData.value.isDelivered,
        statusChanged,
        paidChanged,
        deliveredChanged,
        result: changed
    });
    return changed;
});

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch(e) { return 'N/A'; }
};


// --- API CALLS ---
const fetchOrderDetail = async () => {
  loading.value = true; // Đặt loading thành true khi bắt đầu fetch
  error.value = null;
  const urlToFetch = `/admin/orders/${orderId.value}`;
  console.log(`[AdminOrderDetailPage] Fetching order from (REAL API): ${urlToFetch}`);
  try {
    const response = await apiClient.get(urlToFetch);
    console.log('[AdminOrderDetailPage] REAL API Response:', response);
    if (response.data && response.data._id) {
      order.value = response.data;
      selectedStatus.value = response.data.status;
      isPaidStatus.value = response.data.isPaid;
      isDeliveredStatus.value = response.data.isDelivered;
      originalOrderData.value = JSON.parse(JSON.stringify(response.data)); // Lưu bản sao để so sánh
    } else {
      order.value = null;
      error.value = "Không tìm thấy đơn hàng hoặc dữ liệu không hợp lệ từ API.";
      console.warn("[AdminOrderDetailPage] Order not found or invalid data in REAL API response:", response.data);
    }
  } catch (err) {
    order.value = null;
    console.error("[AdminOrderDetailPage] Error fetching order detail from REAL API:", err.response || err);
    error.value = err.response?.data?.message || "Lỗi tải chi tiết đơn hàng từ API.";
    toast.error(error.value); // Hiển thị toast lỗi
  } finally {
    loading.value = false; // Đặt loading thành false khi fetch xong (thành công hoặc thất bại)
  }
};

const handleUpdateOrder = async () => {
  if (!order.value || !isChanged.value) {
    toast.info("Không có thay đổi nào để lưu.");
    return;
  }
  updatingStatus.value = true;
  updateError.value = null;

  const payload = {
    status: selectedStatus.value,
    isPaid: isPaidStatus.value,
    isDelivered: selectedStatus.value === 'delivered' ? isDeliveredStatus.value : order.value.isDelivered,
  };
  if (payload.status === 'delivered') {
      payload.isDelivered = true; // Luôn đảm bảo isDelivered là true khi status là delivered
      // isDeliveredStatus.value = true; // Không cần set ở đây, UI sẽ tự cập nhật nếu API thành công
  }
  console.log('[AdminOrderDetailPage] Payload to be sent for update:', payload); // << THÊM LOG NÀY
  try {
    const response = await apiClient.put(`/admin/orders/${orderId.value}/status`, payload);
    console.log('[AdminOrderDetailPage] Update API Response:', response);
    
    // Cập nhật lại order với dữ liệu mới từ server để đảm bảo đồng bộ
    if(response.data && response.data._id) {
        order.value = response.data;
        selectedStatus.value = response.data.status;
        isPaidStatus.value = response.data.isPaid;
        isDeliveredStatus.value = response.data.isDelivered;
        originalOrderData.value = JSON.parse(JSON.stringify(response.data));
    } else {
        // Nếu API không trả về order đầy đủ, fetch lại
        await fetchOrderDetail();
    }
    toast.success("Cập nhật đơn hàng thành công!");
  } catch (err) {
    console.error("AdminOrderDetailPage: Error updating order:", err.response || err);
    updateError.value = err.response?.data?.message || "Lỗi cập nhật đơn hàng.";
    toast.error(updateError.value);
  } finally {
    updatingStatus.value = false;
  }
};

// --- LIFECYCLE HOOK ---
onMounted(() => {
  fetchOrderDetail();
});

</script>

<style scoped>
/* Thêm style nếu cần */
.table th {
    font-weight: 600;
    color: var(--bs-secondary-color);
}
</style>