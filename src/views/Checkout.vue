<template>
  <div class="checkout container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
        <i class="fas fa-credit-card me-2"></i> Thanh toán
    </h1>

     <!-- Loading Cart State -->
     <div v-if="isCartLoading && !initialLoadDone" class="text-center py-5">
        <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
         <p class="mt-2 text-muted">Đang tải thông tin giỏ hàng...</p>
     </div>

      <!-- Empty Cart State -->
      <div v-else-if="(!processedCartItems || processedCartItems.length === 0) && initialLoadDone" class="card shadow-sm border-light p-5 text-center mx-auto" style="max-width: 550px;">
          <div class="mb-4">
             <i class="fas fa-shopping-cart text-light display-1"></i>
          </div>
          <p class="text-muted mb-4 fs-5">Giỏ hàng trống, không thể thanh toán.</p>
          <router-link to="/" class="btn btn-success px-4 rounded-pill shadow-sm"> 
            <i class="fas fa-arrow-left me-2"></i> Quay lại mua sắm
          </router-link>
      </div>

    <!-- Main Checkout Content -->
    <div v-else class="row g-lg-5 g-md-4 g-3">
      <!-- Shipping and Payment Form -->
      <section class="col-lg-7">
         <div class="card shadow-sm border-light p-md-4 p-3">
            <h2 class="h5 mb-4 text-dark fw-semibold border-bottom pb-3">
                <i class="fas fa-map-marker-alt me-2 text-success"></i>Thông tin giao hàng
            </h2>
            <form @submit.prevent="placeOrder" class="needs-validation" novalidate ref="checkoutFormRef">
                 <div v-if="serverFormError" class="alert alert-danger small py-2 mb-3">{{ serverFormError }}</div>

                 <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="checkoutFullName" class="form-label">Họ và tên <span class="text-danger">*</span></label>
                        <input id="checkoutFullName" v-model.trim="shippingInfo.fullName" type="text" required class="form-control" placeholder="Nguyễn Văn A" />
                        <div class="invalid-feedback">{{ validationErrors.fullName }}</div>
                    </div>
                    <div class="col-md-6">
                        <label for="checkoutPhone" class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                        <input id="checkoutPhone" v-model.trim="shippingInfo.phone" type="tel" required class="form-control" placeholder="09xxxxxxxx" />
                        <div class="invalid-feedback">{{ validationErrors.phone }}</div>
                    </div>
                 </div>

                 <div class="mb-3">
                    <label for="checkoutEmail" class="form-label">Email <span class="text-danger">*</span></label>
                    <input id="checkoutEmail" v-model.trim="shippingInfo.email" type="email" required class="form-control" placeholder="email@example.com" />
                     <div class="invalid-feedback">{{ validationErrors.email }}</div>
                 </div>

                 <div class="row g-3 mb-3">
                    <div class="col-md-4">
                       <label for="checkoutProvince" class="form-label">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                       <select id="checkoutProvince" v-model="shippingInfo.province" required class="form-select">
                          <option value="" disabled>Chọn Tỉnh/Thành</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                       </select>
                       <div class="invalid-feedback">{{ validationErrors.province }}</div>
                    </div>
                     <div class="col-md-4">
                       <label for="checkoutDistrict" class="form-label">Quận/Huyện <span class="text-danger">*</span></label>
                       <select id="checkoutDistrict" v-model="shippingInfo.district" required class="form-select" :disabled="!shippingInfo.province">
                          <option value="" disabled>Chọn Quận/Huyện</option>
                           <option v-if="shippingInfo.province === 'Hà Nội'" value="Ba Đình">Ba Đình</option>
                           <option v-if="shippingInfo.province === 'Hà Nội'" value="Hoàn Kiếm">Hoàn Kiếm</option>
                           <option v-if="shippingInfo.province === 'TP. Hồ Chí Minh'" value="Quận 1">Quận 1</option>
                           <option v-if="shippingInfo.province === 'TP. Hồ Chí Minh'" value="Quận 3">Quận 3</option>
                           <option v-if="shippingInfo.province === 'Đà Nẵng'" value="Hải Châu">Hải Châu</option>
                           <option v-if="shippingInfo.province === 'Đà Nẵng'" value="Thanh Khê">Thanh Khê</option>
                       </select>
                       <div class="invalid-feedback">{{ validationErrors.district }}</div>
                    </div>
                     <div class="col-md-4">
                       <label for="checkoutWard" class="form-label">Phường/Xã <span class="text-danger">*</span></label>
                       <select id="checkoutWard" v-model="shippingInfo.ward" required class="form-select" :disabled="!shippingInfo.district">
                           <option value="" disabled>Chọn Phường/Xã</option>
                            <option v-if="shippingInfo.district === 'Quận 1' && shippingInfo.province === 'TP. Hồ Chí Minh'" value="Bến Nghé">Bến Nghé</option>
                            <option v-if="shippingInfo.district === 'Ba Đình' && shippingInfo.province === 'Hà Nội'" value="Điện Biên">Điện Biên</option>
                       </select>
                       <div class="invalid-feedback">{{ validationErrors.ward }}</div>
                    </div>
                 </div>
                  <div class="mb-3">
                    <label for="checkoutAddress" class="form-label">Địa chỉ chi tiết (số nhà, tên đường) <span class="text-danger">*</span></label>
                    <input id="checkoutAddress" v-model.trim="shippingInfo.address" type="text" required class="form-control" placeholder="Ví dụ: 123 Đường ABC" />
                     <div class="invalid-feedback">{{ validationErrors.address }}</div>
                 </div>

                 <div class="mb-4">
                    <label for="checkoutNote" class="form-label">Ghi chú đơn hàng (tuỳ chọn)</label>
                    <textarea id="checkoutNote" v-model.trim="shippingInfo.note" rows="3" class="form-control" placeholder="Ví dụ: Giao hàng giờ hành chính..."></textarea>
                 </div>

                 <div class="mb-4">
                    <h2 class="h5 mb-3 text-dark fw-semibold border-bottom pb-2">
                       <i class="fas fa-shipping-fast me-2 text-success"></i>Phương thức vận chuyển
                    </h2>
                     <div class="form-check mb-2">
                       <input class="form-check-input" type="radio" id="ship-standard" value="standard" v-model="selectedShippingMethod" name="shippingMethodOption">
                       <label class="form-check-label" for="ship-standard">
                          Giao hàng tiêu chuẩn (3-5 ngày) - <span class="fw-medium">{{formatPrice(STANDARD_SHIPPING_FEE)}}</span>
                       </label>
                     </div>
                     <div class="form-check">
                       <input class="form-check-input" type="radio" id="ship-fast" value="fast" v-model="selectedShippingMethod" name="shippingMethodOption">
                       <label class="form-check-label" for="ship-fast">
                          Giao hàng nhanh (1-2 ngày) - <span class="fw-medium">{{formatPrice(FAST_SHIPPING_FEE)}}</span>
                       </label>
                     </div>
                 </div>

                 <div>
                     <h2 class="h5 mb-3 text-dark fw-semibold border-bottom pb-2">
                        <i class="fas fa-money-check-alt me-2 text-success"></i>Phương thức thanh toán
                     </h2>
                     <div class="list-group list-group-flush">
                        <label class="list-group-item list-group-item-action d-flex align-items-center py-3">
                           <input class="form-check-input me-3" type="radio" value="cod" v-model="selectedPaymentMethod" name="paymentMethodOption" required>
                           <i class="fas fa-truck fa-fw me-2 text-secondary"></i> Thanh toán khi nhận hàng (COD)
                        </label>
                         <label class="list-group-item list-group-item-action d-flex align-items-center py-3">
                           <input class="form-check-input me-3" type="radio" value="banking" v-model="selectedPaymentMethod" name="paymentMethodOption" required>
                            <i class="fas fa-university fa-fw me-2 text-secondary"></i> Chuyển khoản ngân hàng
                         </label>
                         <label class="list-group-item list-group-item-action d-flex align-items-center">
                           <input class="form-check-input me-3" type="radio" value="momo" v-model="selectedPaymentMethod" name="paymentMethodOption">
                            <i class="fas fa-wallet fa-fw me-2 text-secondary"></i> Ví MoMo
                         </label>
                          <label class="list-group-item list-group-item-action d-flex align-items-center">
                           <input class="form-check-input me-3" type="radio" value="vnpay" v-model="selectedPaymentMethod" name="paymentMethodOption">
                            <i class="fas fa-qrcode fa-fw me-2 text-secondary"></i> VNPay
                         </label>
                     </div>
                     <div v-if="validationErrors.paymentMethod && formSubmitted" class="text-danger small mt-2 ps-1">{{ validationErrors.paymentMethod }}</div>
                 </div>

                 <div class="d-grid mt-4 pt-3 border-top">
                     <button type="submit" :disabled="isPlacingOrder || !processedCartItems || processedCartItems.length === 0" class="btn btn-success btn-lg rounded-pill shadow-sm">
                        <span v-if="isPlacingOrder" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <i v-else class="fas fa-check-circle me-2"></i>
                        <span>{{ isPlacingOrder ? 'Đang xử lý...' : 'Hoàn tất Đặt hàng' }}</span>
                     </button>
                 </div>
             </form>
         </div>
      </section>

      <aside class="col-lg-5">
         <div class="card shadow-sm border-light sticky-top p-4" style="top: 20px;">
            <h2 class="h5 text-center mb-4 text-success fw-semibold">
                <i class="fas fa-file-invoice-dollar me-2"></i>Đơn hàng của bạn
            </h2>
            <div v-if="!processedCartItems || processedCartItems.length === 0" class="text-center text-muted py-4"> (Giỏ hàng trống) </div>
            <div v-else class="mb-3 pb-2 border-bottom" style="max-height: 280px; overflow-y: auto;"> 
                <div v-for="item in processedCartItems" :key="item.product?._id || item.productId" class="d-flex align-items-center py-2">
                  <img :src="getProductImage(item.product)" :alt="item.product?.name" @error="onImageError" class="rounded me-3 flex-shrink-0" style="width: 50px; height: 50px; object-fit: cover; background-color: #f8f9fa;">
                  <div class="flex-grow-1">
                     <div class="fw-medium text-dark small text-truncate product-name-link">{{ item.product?.name || 'Sản phẩm không xác định' }}</div>
                     <div class="text-muted small">SL: {{ item.quantity }} x {{ formatPrice(item.price !== undefined ? item.price : item.product?.price) }}</div>
                  </div>
                  <div class="fw-semibold small ps-2">{{ formatPrice((item.price !== undefined ? item.price : item.product?.price || 0) * item.quantity) }}</div>
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faCreditCard, faMapMarkerAlt, faShippingFast, faMoneyCheckAlt, faTruck, 
    faUniversity, faWallet, faQrcode, faCheckCircle, faArrowLeft, 
    faShoppingCart, faFileInvoiceDollar, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faCreditCard, faMapMarkerAlt, faShippingFast, faMoneyCheckAlt, faTruck, 
    faUniversity, faWallet, faQrcode, faCheckCircle, faArrowLeft, 
    faShoppingCart, faFileInvoiceDollar, faExclamationTriangle
);

const store = useStore();
const router = useRouter();
const toast = useToast();

const STANDARD_SHIPPING_FEE = 30000;
const FAST_SHIPPING_FEE = 50000;

const isPlacingOrder = ref(false);
const formSubmitted = ref(false);
const checkoutFormRef = ref(null);
const initialLoadDone = ref(false);
const placeholderImg = '/images/placeholder.png';

const shippingInfo = reactive({
  fullName: '', phone: '', email: '',
  province: '', district: '', ward: '',
  address: '', note: ''
});
const selectedShippingMethod = ref('standard');
const selectedPaymentMethod = ref('cod');
const validationErrors = reactive({});

const isCartLoading = computed(() => store.getters['cart/isLoading']);
const cartItemsFromStore = computed(() => store.getters['cart/cartItems']);
const cartTotalPriceFromStore = computed(() => store.getters['cart/cartTotalPrice']);
const currentUser = computed(() => store.getters['auth/currentUser']);
const serverFormError = computed(() => store.getters['order/orderError']);

const processedCartItems = computed(() => {
    if (initialLoadDone.value && Array.isArray(cartItemsFromStore.value)) {
        return cartItemsFromStore.value.filter(item => item && (item.product || item.productId));
    }
    return [];
});
const subtotal = computed(() => Number(cartTotalPriceFromStore.value) || 0);
const shippingFee = computed(() => {
   if (subtotal.value === 0 && (!processedCartItems.value || processedCartItems.value.length === 0) ) return 0;
   return selectedShippingMethod.value === 'fast' ? FAST_SHIPPING_FEE : STANDARD_SHIPPING_FEE;
});
const total = computed(() => subtotal.value + shippingFee.value);

const formatPrice = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
const getProductImage = (product) => product?.images?.[0] || placeholderImg;
const onImageError = (event) => { event.target.src = placeholderImg; };

const validateForm = () => {
  console.log('[validateForm] Starting validation. Current shippingInfo:', JSON.parse(JSON.stringify(shippingInfo)));
  console.log('[validateForm] Current selectedPaymentMethod:', selectedPaymentMethod.value);

  Object.keys(validationErrors).forEach(key => delete validationErrors[key]); // Xóa lỗi cũ
  let isValid = true;
  const requiredMsg = "Trường này là bắt buộc.";
  
  // Kiểm tra từng trường bắt buộc trong shippingInfo
  if (!String(shippingInfo.fullName).trim()) { 
    console.log('[validateForm] fullName FAILED: Is empty or only whitespace.');
    validationErrors.fullName = requiredMsg; 
    isValid = false; 
  }

  if (!String(shippingInfo.phone).trim()) { 
    console.log('[validateForm] phone FAILED: Is empty or only whitespace.');
    validationErrors.phone = requiredMsg; 
    isValid = false; 
  } else if (!/^(0|84)(2|3|5|7|8|9)([0-9]{8})$/.test(String(shippingInfo.phone).trim())) { 
     console.log('[validateForm] phone FAILED: Does not match regex. Value:', String(shippingInfo.phone).trim());
     validationErrors.phone = 'Số điện thoại không hợp lệ (VD: 09xxxxxxxx hoặc 849xxxxxxxx).'; 
     isValid = false; 
  }

  if (!String(shippingInfo.email).trim()) { 
    console.log('[validateForm] email FAILED: Is empty or only whitespace.');
    validationErrors.email = requiredMsg; 
    isValid = false; 
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(shippingInfo.email).trim())) { 
    console.log('[validateForm] email FAILED: Does not match regex. Value:', String(shippingInfo.email).trim());
    validationErrors.email = 'Email không hợp lệ.'; 
    isValid = false; 
  }

  if (!shippingInfo.province) { // select rỗng sẽ là ''
    console.log('[validateForm] province FAILED: Is empty.');
    validationErrors.province = 'Vui lòng chọn Tỉnh/Thành phố.'; 
    isValid = false; 
  }
  if (!shippingInfo.district) {
    console.log('[validateForm] district FAILED: Is empty.');
    validationErrors.district = 'Vui lòng chọn Quận/Huyện.'; 
    isValid = false; 
  }
  if (!shippingInfo.ward) {
    console.log('[validateForm] ward FAILED: Is empty.');
    validationErrors.ward = 'Vui lòng chọn Phường/Xã.'; 
    isValid = false; 
  }
  if (!String(shippingInfo.address).trim()) {
    console.log('[validateForm] address FAILED: Is empty or only whitespace.');
    validationErrors.address = 'Vui lòng nhập địa chỉ chi tiết.'; 
    isValid = false; 
  }
  
  // Kiểm tra phương thức thanh toán
  if (!selectedPaymentMethod.value) {
      console.log('[validateForm] paymentMethod FAILED: Not selected.');
      validationErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán.';
      isValid = false;
  }
  
  console.log('[validateForm] Final isValid result:', isValid);
  console.log('[validateForm] Current validationErrors object:', JSON.parse(JSON.stringify(validationErrors)));
  return isValid;
};

const placeOrder = async () => {
  console.log('!!!!!!!!!!!!!! PLACE ORDER FUNCTION CALLED !!!!!!!!!!!!!!'); // << LOG NÀY XUẤT HIỆN

  formSubmitted.value = true; 
  const formElement = checkoutFormRef.value;
  if (formElement) formElement.classList.remove('was-validated'); 

  // BƯỚC 1: Custom Validation
  if (!validateForm()) { 
    console.log('[Checkout placeOrder] Custom validation FAILED. Returning.'); // << THÊM LOG
    if (formElement) formElement.classList.add('was-validated'); 
    const firstErrorKey = Object.keys(validationErrors).find(key => validationErrors[key]);
    if (firstErrorKey) {
        const elId = `checkout${firstErrorKey.charAt(0).toUpperCase() + firstErrorKey.slice(1)}`;
        document.getElementById(elId)?.focus();
    } else if (!selectedPaymentMethod.value) {
         toast.error("Vui lòng chọn phương thức thanh toán.");
    } else {
         toast.error('Vui lòng kiểm tra lại thông tin đã nhập (từ validateForm).');
    }
    return; // <<<<<<<<<<< THOÁT SỚM NẾU CUSTOM VALIDATION FAIL
  }
  console.log('[Checkout placeOrder] Custom validation PASSED.'); // << THÊM LOG
  
  // BƯỚC 2: HTML5 Validation
  if (formElement && !formElement.checkValidity()) { 
    console.log('[Checkout placeOrder] HTML5 validation FAILED. Returning.'); // << THÊM LOG
    if (formElement) formElement.classList.add('was-validated');
    toast.error('Một số thông tin chưa hợp lệ theo định dạng yêu cầu (từ HTML5).');
    formElement.querySelector(':invalid')?.focus();
    return; // <<<<<<<<<<< THOÁT SỚM NẾU HTML5 VALIDATION FAIL
  }
  console.log('[Checkout placeOrder] HTML5 validation PASSED.'); // << THÊM LOG

  // BƯỚC 3: Thêm class was-validated nếu tất cả OK
  if (formElement) formElement.classList.add('was-validated');

  // >>> LOG GIÁ TRỊ KIỂM TRA GIỎ HÀNG Ở ĐÂY <<<
  console.log('[Checkout placeOrder] Checking cart status before proceeding to order.');
  console.log('[Checkout placeOrder] initialLoadDone:', initialLoadDone.value);
  console.log('[Checkout placeOrder] cartItemsFromStore exists:', !!cartItemsFromStore.value);
  if (cartItemsFromStore.value) {
    console.log('[Checkout placeOrder] cartItemsFromStore length:', cartItemsFromStore.value.length);
  }
  console.log('[Checkout placeOrder] processedCartItems exists:', !!processedCartItems.value);
  if (processedCartItems.value) {
    console.log('[Checkout placeOrder] processedCartItems length:', processedCartItems.value.length);
  }


  // BƯỚC 4: Kiểm tra giỏ hàng có trống không
  if (!processedCartItems.value || processedCartItems.value.length === 0) {
    console.log('[Checkout placeOrder] Cart is empty. Returning.'); // << THÊM LOG
    toast.error('Giỏ hàng của bạn đang trống để thanh toán.'); 
    return; // <<<<<<<<<<< THOÁT SỚM NẾU GIỎ HÀNG RỖNG
  }
  console.log('[Checkout placeOrder] Cart is NOT empty. Proceeding to set isPlacingOrder.'); // << THÊM LOG


  isPlacingOrder.value = true; 
console.log('[Checkout placeOrder] isPlacingOrder set to true. Calling API...');
  try {
    // ***** BẮT ĐẦU LOGIC ĐẶT HÀNG *****
    const payloadShippingAddress = { 
        fullName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        email: shippingInfo.email,
        province: shippingInfo.province,
        district: shippingInfo.district,
        ward: shippingInfo.ward,
        address: shippingInfo.address,
        // Không cần note ở đây vì nó sẽ được thêm vào payload chính
    };
    // Có thể bạn muốn xóa các trường rỗng khỏi payloadShippingAddress nếu backend không muốn nhận
    // Object.keys(payloadShippingAddress).forEach(key => (payloadShippingAddress[key] === '') && delete payloadShippingAddress[key]);


    const orderPayload = {
        shippingAddress: payloadShippingAddress,
        paymentMethod: selectedPaymentMethod.value,
        note: shippingInfo.note || '', // Gửi note nếu có
        shippingMethod: selectedShippingMethod.value, // Gửi phương thức vận chuyển
        // Backend sẽ tự lấy cart items từ session/DB của user và tính lại giá
        // itemsPrice: subtotal.value, // Không cần gửi nếu backend tự tính
        // shippingPrice: shippingFee.value, // Không cần gửi nếu backend tự tính
        // totalPrice: total.value, // Không cần gửi nếu backend tự tính
    };
    console.log('[Checkout placeOrder] Order Payload to be sent:', JSON.parse(JSON.stringify(orderPayload)));

    // Dispatch action của Vuex store để tạo đơn hàng
    const createdOrder = await store.dispatch('order/createOrder', orderPayload);
    console.log('[Checkout placeOrder] Order creation API call successful. Response:', JSON.parse(JSON.stringify(createdOrder)));

    // Xử lý sau khi đặt hàng thành công
    toast.success('Đặt hàng thành công!');
    
    console.log('[Checkout placeOrder] Dispatching cart/resetCartState...');
    await store.dispatch('cart/resetCartState'); // Reset giỏ hàng (state và localStorage)
    
    console.log('[Checkout placeOrder] Navigating to OrderDetail page for order ID:', createdOrder._id);
    router.push({ name: 'OrderDetail', params: { id: createdOrder._id } }); // Điều hướng đến trang chi tiết đơn hàng

    // ***** KẾT THÚC LOGIC ĐẶT HÀNG *****
  } catch (error) {
    console.error("[Checkout placeOrder] CATCH BLOCK - Error during order placement:", error);
    if (error && error.response && error.response.data) { // Kiểm tra error.response trước khi truy cập .data
        console.error("[Checkout placeOrder] CATCH BLOCK - Error response data:", error.response.data);
        console.error("[Checkout placeOrder] CATCH BLOCK - Error response status:", error.response.status);
    } else {
        console.error("[Checkout placeOrder] CATCH BLOCK - Error does not have response object or data:", error.message);
    }
    
    if (checkoutFormRef.value) checkoutFormRef.value.classList.remove('was-validated');
    // Lấy lỗi từ Vuex store nếu action order/createOrder đã commit lỗi
    // Hoặc lấy trực tiếp từ lỗi bắt được
    const message = error?.response?.data?.message || store.getters['order/orderError'] || 'Đặt hàng thất bại. Vui lòng thử lại.';
    toast.error(message);
  } finally {
    isPlacingOrder.value = false;
    console.log('[Checkout placeOrder] FINALLY BLOCK - isPlacingOrder set to false.');
  }
};

onMounted(async () => {
   if (currentUser.value) { 
       shippingInfo.fullName = currentUser.value.name || '';
       shippingInfo.email = currentUser.value.email || '';
       shippingInfo.phone = currentUser.value.phone || '';
       if (currentUser.value.address && typeof currentUser.value.address === 'object') {
           shippingInfo.address = currentUser.value.address.address || currentUser.value.address.street || '';
           shippingInfo.ward = currentUser.value.address.ward || '';
           shippingInfo.district = currentUser.value.address.district || '';
           shippingInfo.province = currentUser.value.address.province || currentUser.value.address.city || '';
       }
   }
    try {
        if (store.getters['auth/isLoggedIn']) {
            const currentCart = store.getters['cart/theCart'];
            if (!currentCart?._id) { // Chỉ fetch nếu cart chưa có ID từ server
                await store.dispatch('cart/initializeCart');
            }
        } else {
            await store.dispatch('cart/initializeCart'); // Sẽ dùng localStorage
        }
    } catch(e) {
        // Lỗi đã được xử lý trong action
    } finally {
        initialLoadDone.value = true;
    }
});

watch(() => shippingInfo.province, (newVal, oldVal) => {
  if (newVal !== oldVal) { shippingInfo.district = ''; shippingInfo.ward = ''; }
});
watch(() => shippingInfo.district, (newVal, oldVal) => {
  if (newVal !== oldVal) { shippingInfo.ward = ''; }
});
</script>

<style scoped>
.product-name-link { font-size: 0.9em; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
@media (min-width: 992px) { .sticky-top { top: 80px; } }
.form-control.is-invalid ~ .invalid-feedback,
.form-select.is-invalid ~ .invalid-feedback { display: block; }
.list-group-item-action { cursor: pointer; }
/* Bỏ outline mặc định của trình duyệt khi input được focus (nếu Bootstrap chưa xử lý) */
input.form-control:focus, select.form-select:focus {
  box-shadow: none; /* Hoặc một box-shadow tùy chỉnh nhẹ nhàng hơn */
}
</style>