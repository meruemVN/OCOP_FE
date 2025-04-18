<template>
  <div class="checkout container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
        <i class="fas fa-credit-card me-2"></i> Thanh toán
    </h1>

     <!-- Loading Cart State -->
     <div v-if="isCartLoading && !initialLoadDone" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
         <p class="mt-2 text-muted">Đang tải thông tin giỏ hàng...</p>
     </div>

      <!-- Empty Cart State -->
      <div v-else-if="(!cartItems || cartItems.length === 0) && initialLoadDone" class="card shadow-sm border-light p-5 text-center mx-auto" style="max-width: 550px;">
          <div class="mb-4">
             <i class="fas fa-shopping-cart text-light display-1"></i>
          </div>
          <p class="text-muted mb-4 fs-5">Giỏ hàng trống, không thể thanh toán.</p>
          <router-link to="/products" class="btn btn-success px-4 rounded-pill shadow-sm">
            <i class="fas fa-arrow-left me-2"></i> Quay lại mua sắm
          </router-link>
      </div>

    <!-- Main Checkout Content -->
    <div v-else class="row g-4">
      <!-- Shipping and Payment Form -->
      <section class="col-lg-7">
         <div class="card shadow-sm border-light p-4">
            <h2 class="h5 mb-4 text-dark fw-semibold border-bottom pb-3">
                <i class="fas fa-map-marker-alt me-2 text-success"></i>Thông tin giao hàng
            </h2>
            <form @submit.prevent="placeOrder" class="needs-validation" novalidate ref="checkoutFormRef">
                 <div v-if="formError" class="alert alert-danger small py-2">{{ formError }}</div>

                 <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="fullName" class="form-label">Họ và tên <span class="text-danger">*</span></label>
                        <input id="fullName" v-model.trim="shippingInfo.fullName" type="text" required class="form-control" placeholder="Nhập họ và tên" />
                        <div class="invalid-feedback">{{ errors.fullName || 'Vui lòng nhập họ tên.' }}</div>
                    </div>
                    <div class="col-md-6">
                        <label for="phone" class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                        <input id="phone" v-model.trim="shippingInfo.phone" type="tel" required class="form-control" placeholder="Nhập số điện thoại" pattern="(84|0[3|5|7|8|9])+([0-9]{8})" />
                        <div class="invalid-feedback">{{ errors.phone || 'Vui lòng nhập số điện thoại hợp lệ.' }}</div>
                    </div>
                 </div>

                 <div class="mb-3">
                    <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                    <input id="email" v-model.trim="shippingInfo.email" type="email" required class="form-control" placeholder="Nhập địa chỉ email" />
                     <div class="invalid-feedback">{{ errors.email || 'Vui lòng nhập email hợp lệ.' }}</div>
                 </div>

                 <div class="row g-3 mb-3">
                    <div class="col-md-4">
                       <label for="province" class="form-label">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                       <select id="province" v-model="shippingInfo.province" required class="form-select">
                          <option value="" disabled>Chọn...</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                           <option value="Đà Nẵng">Đà Nẵng</option>
                       </select>
                       <div class="invalid-feedback">{{ errors.province || 'Vui lòng chọn.' }}</div>
                    </div>
                     <div class="col-md-4">
                       <label for="district" class="form-label">Quận/Huyện <span class="text-danger">*</span></label>
                       <select id="district" v-model="shippingInfo.district" required class="form-select" :disabled="!shippingInfo.province">
                          <option value="" disabled>Chọn...</option>
                           <option v-if="shippingInfo.province === 'Hà Nội'" value="Ba Đình">Ba Đình</option>
                           <option v-if="shippingInfo.province === 'TP. Hồ Chí Minh'" value="Quận 1">Quận 1</option>
                            <option v-if="shippingInfo.province === 'Đà Nẵng'" value="Hải Châu">Hải Châu</option>
                       </select>
                       <div class="invalid-feedback">{{ errors.district || 'Vui lòng chọn.' }}</div>
                    </div>
                     <div class="col-md-4">
                       <label for="ward" class="form-label">Phường/Xã <span class="text-danger">*</span></label>
                       <select id="ward" v-model="shippingInfo.ward" required class="form-select" :disabled="!shippingInfo.district">
                           <option value="" disabled>Chọn...</option>
                            <option v-if="shippingInfo.district === 'Quận 1'" value="Bến Nghé">Bến Nghé</option>
                             <option v-if="shippingInfo.district === 'Ba Đình'" value="Điện Biên">Điện Biên</option>
                       </select>
                       <div class="invalid-feedback">{{ errors.ward || 'Vui lòng chọn.' }}</div>
                    </div>
                 </div>
                  <div class="mb-3">
                    <label for="address" class="form-label">Địa chỉ chi tiết <span class="text-danger">*</span></label>
                    <input id="address" v-model.trim="shippingInfo.address" type="text" required class="form-control" placeholder="Số nhà, tên đường..." />
                     <div class="invalid-feedback">{{ errors.address || 'Vui lòng nhập địa chỉ chi tiết.' }}</div>
                 </div>

                 <div class="mb-4">
                    <label for="note" class="form-label">Ghi chú đơn hàng (tuỳ chọn)</label>
                    <textarea id="note" v-model.trim="shippingInfo.note" rows="3" class="form-control" placeholder="Ví dụ: Giao hàng giờ hành chính..."></textarea>
                 </div>

                 <div class="mb-4">
                    <h2 class="h5 mb-3 text-dark fw-semibold border-bottom pb-2">
                       <i class="fas fa-shipping-fast me-2 text-success"></i>Phương thức vận chuyển
                    </h2>
                     <div class="form-check mb-2">
                       <input class="form-check-input" type="radio" id="ship-standard" value="standard" v-model="shippingMethod">
                       <label class="form-check-label" for="ship-standard">
                          Giao hàng tiêu chuẩn (3-5 ngày) - <span class="fw-medium">{{formatPrice(30000)}}</span>
                       </label>
                     </div>
                     <div class="form-check">
                       <input class="form-check-input" type="radio" id="ship-fast" value="fast" v-model="shippingMethod">
                       <label class="form-check-label" for="ship-fast">
                          Giao hàng nhanh (1-2 ngày) - <span class="fw-medium">{{formatPrice(50000)}}</span>
                       </label>
                     </div>
                 </div>

                 <div>
                     <h2 class="h5 mb-3 text-dark fw-semibold border-bottom pb-2">
                        <i class="fas fa-money-check-alt me-2 text-success"></i>Phương thức thanh toán
                     </h2>
                     <div class="list-group list-group-flush">
                        <label class="list-group-item list-group-item-action d-flex align-items-center">
                           <input class="form-check-input me-3" type="radio" value="cod" v-model="paymentMethod">
                           <i class="fas fa-truck fa-fw me-2 text-secondary"></i> Thanh toán khi nhận hàng (COD)
                        </label>
                         <label class="list-group-item list-group-item-action d-flex align-items-center">
                           <input class="form-check-input me-3" type="radio" value="banking" v-model="paymentMethod">
                            <i class="fas fa-university fa-fw me-2 text-secondary"></i> Chuyển khoản ngân hàng
                         </label>
                         <label class="list-group-item list-group-item-action d-flex align-items-center">
                           <input class="form-check-input me-3" type="radio" value="momo" v-model="paymentMethod">
                            <i class="fas fa-wallet fa-fw me-2 text-secondary"></i> Ví MoMo
                         </label>
                          <label class="list-group-item list-group-item-action d-flex align-items-center">
                           <input class="form-check-input me-3" type="radio" value="vnpay" v-model="paymentMethod">
                            <i class="fas fa-qrcode fa-fw me-2 text-secondary"></i> VNPay
                         </label>
                     </div>
                 </div>

                 <div class="d-grid mt-4 pt-3 border-top">
                     <button
                        type="submit"
                        :disabled="isPlacingOrder || cartItems.length === 0"
                        class="btn btn-success btn-lg rounded-pill shadow-sm"
                     >
                        <span v-if="isPlacingOrder" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <i v-else class="fas fa-check-circle me-2"></i>
                        <span>{{ isPlacingOrder ? 'Đang xử lý...' : 'Hoàn tất Đặt hàng' }}</span>
                     </button>
                 </div>
             </form>
         </div>
      </section>

      <!-- Order Summary -->
      <aside class="col-lg-5">
         <div class="card shadow-sm border-light sticky-top p-4" style="top: 20px;">
            <h2 class="h5 text-center mb-4 text-success fw-semibold">
                <i class="fas fa-file-invoice-dollar me-2"></i>Đơn hàng của bạn
            </h2>

             <div v-if="!cartItems || cartItems.length === 0" class="text-center text-muted py-4">
              (Giỏ hàng trống)
            </div>
            <div v-else class="mb-3 pb-2 border-bottom" style="max-height: 250px; overflow-y: auto;">
                <div v-for="item in cartItems" :key="item.product._id" class="d-flex align-items-center py-2">
                  <img :src="getProductImage(item.product)" :alt="item.product.name" @error="onImageError" class="rounded me-3 flex-shrink-0" style="width: 50px; height: 50px; object-fit: cover; background-color: #f8f9fa;">
                  <div class="flex-grow-1">
                     <div class="fw-medium text-dark small text-truncate product-name-link">{{ item.product.name }}</div>
                     <div class="text-muted small">SL: {{ item.quantity }} x {{ formatPrice(item.price || item.product.price) }}</div>
                  </div>
                  <div class="fw-semibold small ps-2">{{ formatPrice((item.price || item.product.price) * item.quantity) }}</div>
                </div>
            </div>

            <div class="pt-2">
              <div class="d-flex justify-content-between text-muted mb-1">
                <span>Tạm tính:</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="d-flex justify-content-between text-muted mb-2">
                <span>Phí vận chuyển:</span>
                <span>{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
                <span>Tổng cộng:</span>
                <span class="text-success">{{ formatPrice(total) }}</span>
              </div>
            </div>
         </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
// Import icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCreditCard, faMapMarkerAlt, faShippingFast, faMoneyCheckAlt, faTruck, faUniversity, faWallet, faQrcode, faCheckCircle, faArrowLeft, faShoppingCart, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

library.add(faCreditCard, faMapMarkerAlt, faShippingFast, faMoneyCheckAlt, faTruck, faUniversity, faWallet, faQrcode, faCheckCircle, faArrowLeft, faShoppingCart, faFileInvoiceDollar);

const store = useStore();
const router = useRouter();
const toast = useToast();

// --- Refs & Reactive State ---
const isPlacingOrder = ref(false);
const formSubmitted = ref(false); // Chỉ dùng để trigger validation UI của Bootstrap
const checkoutFormRef = ref(null); // Ref cho form để reset validation
const initialLoadDone = ref(false); // Cờ kiểm tra đã load cart lần đầu chưa
const placeholderImg = '/images/placeholder.png';

const shippingInfo = reactive({
  fullName: '',
  phone: '',
  email: '',
  province: '',
  district: '',
  ward: '',
  address: '',
  note: ''
});
const shippingMethod = ref('standard');
const paymentMethod = ref('cod');
const errors = reactive({}); // Lưu trữ lỗi validation từ hàm validateForm

// --- Computed Properties ---
const isCartLoading = computed(() => store.getters['cart/isLoading']);
const cartItems = computed(() => (initialLoadDone.value && store.getters['cart/cartItems']) ? store.getters['cart/cartItems'] : []);
const cartTotalPrice = computed(() => (initialLoadDone.value && store.getters['cart/cartTotalPrice']) ? store.getters['cart/cartTotalPrice'] : 0);
const currentUser = computed(() => store.getters['auth/currentUser']);
const formError = computed(() => store.getters['order/orderError']); 

const subtotal = computed(() => Number(cartTotalPrice.value) || 0);
const shippingFee = computed(() => {
   if (subtotal.value === 0) return 0;
   // Bạn có thể lấy phí ship từ API hoặc tính toán phức tạp hơn ở đây
   return shippingMethod.value === 'fast' ? 50000 : 30000;
});
const total = computed(() => subtotal.value + shippingFee.value);


// --- Methods ---
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getProductImage = (product) => product?.images?.[0] || placeholderImg;
const onImageError = (event) => { event.target.src = placeholderImg; };

// Hàm validate tùy chỉnh (có thể mở rộng)
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear lỗi cũ
  let isValid = true;
  // Sử dụng validation của HTML5 trước, chỉ thêm custom logic nếu cần
  // Ví dụ: Kiểm tra định dạng SĐT chặt chẽ hơn
  if (shippingInfo.phone && !/^(84|0[3|5|7|8|9])([0-9]{8})$/.test(shippingInfo.phone)) {
     errors.phone = 'Số điện thoại không đúng định dạng Việt Nam.';
     isValid = false;
  }
   // Thêm các kiểm tra khác nếu cần
  return isValid;
};

// Hàm xử lý đặt hàng
const placeOrder = async (event) => {
  formSubmitted.value = true; // Đánh dấu đã submit
  const form = checkoutFormRef.value; // Lấy form element

  // Kiểm tra validation tổng hợp (cả HTML5 và custom)
  if (!form.checkValidity() || !validateForm()) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated'); // Trigger Bootstrap styles
    // Cuộn đến trường lỗi đầu tiên (nếu cần)
     const firstError = Object.keys(errors)[0];
     if (firstError) {
         document.getElementById(firstError)?.focus();
     } else {
          // Tìm input invalid đầu tiên của HTML5
          form.querySelector(':invalid')?.focus();
     }
    toast.error('Vui lòng kiểm tra lại thông tin đã nhập.');
    return;
  }
   form.classList.add('was-validated'); // Hiển thị validation nếu pass

  if (cartItems.value.length === 0) {
    toast.error('Giỏ hàng của bạn đang trống');
    return;
  }

  isPlacingOrder.value = true;
  try {
    const orderPayload = {
        shippingAddress: { ...shippingInfo },
        paymentMethod: paymentMethod.value,
        note: shippingInfo.note || ''
        // Backend sẽ tự lấy cart items và tính giá
    };

    const createdOrder = await store.dispatch('order/createOrder', orderPayload);
    // Action 'order/createOrder' đã gọi reset cart

    toast.success('Đặt hàng thành công!');
    router.push(`/order/${createdOrder._id}`); // Đi đến trang chi tiết đơn hàng

  } catch (error) {
    console.error("Checkout Error:", error);
    // Reset validation state khi có lỗi từ server
    form.classList.remove('was-validated');
    formSubmitted.value = false;
    const message = store.getters['order/orderError'] || 'Đặt hàng thất bại.'; // Lấy lỗi từ store
    toast.error(message);
  } finally {
    isPlacingOrder.value = false;
  }
};

// --- Lifecycle Hook ---
onMounted(async () => {
   // Điền sẵn thông tin từ user profile khi component mount
   if (currentUser.value) {
       shippingInfo.fullName = currentUser.value.name || '';
       shippingInfo.email = currentUser.value.email || '';
       shippingInfo.phone = currentUser.value.phone || '';
       // Điền địa chỉ mặc định nếu có
       if (currentUser.value.address) {
           shippingInfo.address = currentUser.value.address.street || ''; // Giả sử schema user có address.street
           shippingInfo.ward = currentUser.value.address.ward || '';
           shippingInfo.district = currentUser.value.address.district || '';
           shippingInfo.province = currentUser.value.address.city || currentUser.value.address.province || ''; // Ưu tiên city hoặc province
       }
   }
    // Đảm bảo giỏ hàng đã được tải (có thể gọi lại hoặc chờ App.vue)
    // Nếu App.vue đã gọi initializeCart, chỉ cần chờ loading xong
    if (!store.getters['cart/theCart'] && store.getters['auth/isLoggedIn']) {
         await store.dispatch('cart/initializeCart'); // Gọi lại nếu cần
    }
    initialLoadDone.value = true; // Đánh dấu đã qua giai đoạn khởi tạo
});

</script>

<style scoped>
/* Kế thừa hoặc ghi đè CSS nếu cần */
.product-name-link {
    font-size: 0.9em;
     display: -webkit-box;
     -webkit-line-clamp: 1; /* Chỉ hiển thị 1 dòng trong tóm tắt */
     -webkit-box-orient: vertical;
     overflow: hidden;
     text-overflow: ellipsis;
}
@media (min-width: 992px) {
  .sticky-top {
    top: 80px; /* Điều chỉnh dựa trên chiều cao Navbar */
  }
}
/* CSS cho Bootstrap validation */
.needs-validation .form-control:invalid,
.needs-validation .form-select:invalid {
    border-color: var(--bs-form-invalid-border-color);
}
.was-validated .form-control:invalid:focus,
.was-validated .form-select:invalid:focus {
   box-shadow: 0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.25);
}
/* Bỏ viền đỏ khi chưa submit */
.form-control:not(._invalid),
.form-select:not(._invalid) {
  border-color: var(--bs-border-color);
  box-shadow: none;
}
.list-group-item-action {
    cursor: pointer; /* Thêm con trỏ cho payment methods */
}
</style>