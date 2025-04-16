<template>
  <div class="checkout container mx-auto my-8 px-4 max-w-5xl">
    <h1 class="text-3xl font-bold text-green-800 mb-6">Thanh toán</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form thông tin giao hàng và thanh toán -->
      <section class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Thông tin giao hàng</h2>
        <!-- Use @submit.prevent="placeOrder" -->
        <form @submit.prevent="placeOrder" novalidate>
          <!-- Thông tin cá nhân -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block mb-1 font-medium text-gray-700" for="fullName">Họ và tên <span class="text-red-500">*</span></label>
              <!-- Use v-model="shippingInfo.fullName" -->
              <input id="fullName" v-model.trim="shippingInfo.fullName" type="text" required
                class="input-field" placeholder="Nhập họ và tên" />
              <!-- Use v-if="errors.fullName" -->
              <p v-if="errors.fullName" class="text-red-600 text-sm mt-1">{{ errors.fullName }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700" for="phone">Số điện thoại <span class="text-red-500">*</span></label>
              <!-- Use v-model="shippingInfo.phone" -->
              <input id="phone" v-model.trim="shippingInfo.phone" type="tel" required
                class="input-field" placeholder="Nhập số điện thoại" />
              <!-- Use v-if="errors.phone" -->
              <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Email -->
          <div class="mb-6">
            <label class="block mb-1 font-medium text-gray-700" for="email">Email <span class="text-red-500">*</span></label>
            <!-- Use v-model="shippingInfo.email" -->
            <input id="email" v-model.trim="shippingInfo.email" type="email" required
              class="input-field" placeholder="Nhập địa chỉ email" />
            <!-- Use v-if="errors.email" -->
            <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Địa chỉ -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label class="block mb-1 font-medium text-gray-700" for="province">Tỉnh/Thành phố <span class="text-red-500">*</span></label>
              <!-- Use v-model="shippingInfo.province" -->
              <select id="province" v-model="shippingInfo.province" required class="input-field">
                <option value="" disabled>Chọn tỉnh/thành phố</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hochiminh">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="cantho">Cần Thơ</option>
              </select>
              <!-- Use v-if="errors.province" -->
              <p v-if="errors.province" class="text-red-600 text-sm mt-1">{{ errors.province }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700" for="district">Quận/Huyện <span class="text-red-500">*</span></label>
              <!-- Use v-model="shippingInfo.district" -->
              <select id="district" v-model="shippingInfo.district" required class="input-field" :disabled="!shippingInfo.province">
                <option value="" disabled>Chọn quận/huyện</option>
                <option value="district1" v-if="shippingInfo.province">Quận/Huyện 1</option>
                <option value="district2" v-if="shippingInfo.province">Quận/Huyện 2</option>
              </select>
              <!-- Use v-if="errors.district" -->
              <p v-if="errors.district" class="text-red-600 text-sm mt-1">{{ errors.district }}</p>
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700" for="ward">Phường/Xã <span class="text-red-500">*</span></label>
              <!-- Use v-model="shippingInfo.ward" -->
              <select id="ward" v-model="shippingInfo.ward" required class="input-field" :disabled="!shippingInfo.district">
                <option value="" disabled>Chọn phường/xã</option>
                <option value="ward1" v-if="shippingInfo.district">Phường/Xã 1</option>
                <option value="ward2" v-if="shippingInfo.district">Phường/Xã 2</option>
              </select>
              <!-- Use v-if="errors.ward" -->
              <p v-if="errors.ward" class="text-red-600 text-sm mt-1">{{ errors.ward }}</p>
            </div>
          </div>

          <div class="mb-6">
            <label class="block mb-1 font-medium text-gray-700" for="address">Địa chỉ chi tiết <span class="text-red-500">*</span></label>
            <!-- Use v-model="shippingInfo.address" -->
            <input id="address" v-model.trim="shippingInfo.address" type="text" required class="input-field" placeholder="Số nhà, tên đường..." />
            <!-- Use v-if="errors.address" -->
            <p v-if="errors.address" class="text-red-600 text-sm mt-1">{{ errors.address }}</p>
          </div>

          <div class="mb-6">
            <label class="block mb-1 font-medium text-gray-700" for="note">Ghi chú đơn hàng (tuỳ chọn)</label>
            <!-- Use v-model="shippingInfo.note" -->
            <textarea id="note" v-model.trim="shippingInfo.note" rows="3" class="input-field" placeholder="Ghi chú cho đơn hàng của bạn..."></textarea>
          </div>

          <!-- Phương thức vận chuyển -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Phương thức vận chuyển</h2>
            <label class="flex items-center mb-2 cursor-pointer">
              <!-- Use v-model="shippingMethod" -->
              <input type="radio" value="standard" v-model="shippingMethod" class="mr-2" />
              <span>Giao hàng tiêu chuẩn (3-5 ngày) - {{formatPrice(30000)}}đ</span>
            </label>
            <label class="flex items-center mb-2 cursor-pointer">
              <!-- Use v-model="shippingMethod" -->
              <input type="radio" value="fast" v-model="shippingMethod" class="mr-2" />
              <span>Giao hàng nhanh (1-2 ngày) - {{formatPrice(50000)}}đ</span>
            </label>
          </div>

          <!-- Phương thức thanh toán -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Phương thức thanh toán</h2>
            <label class="flex items-center mb-2 cursor-pointer">
              <!-- Use v-model="paymentMethod" -->
              <input type="radio" value="cod" v-model="paymentMethod" class="mr-2" />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label class="flex items-center mb-2 cursor-pointer">
              <!-- Use v-model="paymentMethod" -->
              <input type="radio" value="banking" v-model="paymentMethod" class="mr-2" />
              <span>Chuyển khoản ngân hàng</span>
            </label>
            <label class="flex items-center mb-2 cursor-pointer">
              <!-- Use v-model="paymentMethod" -->
              <input type="radio" value="momo" v-model="paymentMethod" class="mr-2" />
              <span>Ví MoMo</span>
            </label>
            <label class="flex items-center mb-2 cursor-pointer">
               <!-- Use v-model="paymentMethod" -->
              <input type="radio" value="vnpay" v-model="paymentMethod" class="mr-2" />
              <span>VNPay</span>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md flex justify-center items-center disabled:opacity-50 transition"
          >
            <!-- Use v-if="loading" -->
            <span v-if="loading" class="mr-2">
              <div class="loader-sm"></div>
            </span>
            <span>Đặt hàng</span>
          </button>
        </form>
      </section>

      <!-- Tổng đơn hàng -->
      <aside class="bg-white rounded-lg shadow-md p-6 sticky top-20">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Đơn hàng của bạn</h2>

        <!-- Use v-if="cartItems.length === 0" -->
        <div v-if="cartItems.length === 0" class="text-center text-gray-500">
          Giỏ hàng trống.
        </div>

        <!-- Use v-else -->
        <div v-else class="space-y-4 max-h-72 overflow-y-auto">
          <!-- Use v-for="item in cartItems" -->
          <div v-for="item in cartItems" :key="item.product._id" class="flex items-center space-x-4">
            <img :src="(item.product.images && item.product.images.length > 0 ? item.product.images[0] : '') || '/default.jpg'" alt="" class="w-14 h-14 object-cover rounded-md" />
            <div class="flex-1">
              <div class="font-medium text-gray-800">{{ item.product.name }}</div>
               <!-- Use formatPrice(item.price) -->
              <div class="text-sm text-gray-600">{{ item.quantity }} x {{ formatPrice(item.price) }}đ</div>
            </div>
             <!-- Use formatPrice(item.price * item.quantity) -->
            <div class="font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}đ</div>
          </div>
        </div>

        <div class="border-t border-gray-300 pt-4 mt-4 space-y-3">
          <div class="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <!-- Use formatPrice(subtotal) -->
            <span>{{ formatPrice(subtotal) }}đ</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
             <!-- Use formatPrice(shippingFee) -->
            <span>{{ formatPrice(shippingFee) }}đ</span>
          </div>
          <div class="flex justify-between font-semibold text-lg pt-2 border-t border-gray-300">
            <span>Tổng cộng</span>
             <!-- Use formatPrice(total) -->
            <span>{{ formatPrice(total) }}đ</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup> // Use <script setup> for Composition API
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // Import useToast

const store = useStore();
const router = useRouter();
const toast = useToast(); // Get the toast instance

// --- State ---
const loading = ref(false);
const shippingInfo = reactive({ // Use reactive for objects
  fullName: '',
  phone: '',
  email: '',
  province: '',
  district: '',
  ward: '',
  address: '',
  note: ''
});
const shippingMethod = ref('standard'); // Use ref for primitives
const paymentMethod = ref('cod');      // Use ref for primitives
const errors = reactive({}); // Use reactive for the errors object

// --- Computed Properties ---
// Access getters via store.getters
const cartItems = computed(() => store.getters['cart/cartItems']);
const cartTotalPrice = computed(() => store.getters['cart/cartTotalPrice']);

const subtotal = computed(() => cartTotalPrice.value || 0);

const shippingFee = computed(() => {
  return shippingMethod.value === 'fast' ? 50000 : 30000;
});

const total = computed(() => {
  // Ensure values are numbers before adding
  const sub = Number(subtotal.value) || 0;
  const fee = Number(shippingFee.value) || 0;
  return sub + fee;
});


// --- Methods ---
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key]);

  if (!shippingInfo.fullName) {
    errors.fullName = 'Họ và tên là bắt buộc';
  }
  if (!shippingInfo.phone) {
    errors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(shippingInfo.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  if (!shippingInfo.email) {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
    errors.email = 'Email không hợp lệ';
  }
  if (!shippingInfo.province) {
    errors.province = 'Tỉnh/Thành phố là bắt buộc';
  }
  if (!shippingInfo.district) {
    errors.district = 'Quận/Huyện là bắt buộc';
  }
  if (!shippingInfo.ward) {
    errors.ward = 'Phường/Xã là bắt buộc';
  }
  if (!shippingInfo.address) {
    errors.address = 'Địa chỉ chi tiết là bắt buộc';
  }

  return Object.keys(errors).length === 0;
};

const placeOrder = async () => {
  if (!validateForm()) {
    toast.error('Vui lòng điền đầy đủ thông tin hợp lệ'); // Use toast directly
    return;
  }
  // Use .value for computed properties inside script setup
  if (cartItems.value.length === 0) {
    toast.error('Giỏ hàng của bạn đang trống'); // Use toast directly
    return;
  }
  loading.value = true; // Use .value for refs
  try {
    // Map items - access computed value with .value
    const orderItems = cartItems.value.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        // Ensure images array exists and has elements
        image: (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '') || '',
        // Removed variant as it wasn't in the original data structure example
        // variant: item.variant || null
      }));


    // Use the reactive shippingInfo directly
    const shippingAddress = { ...shippingInfo };

    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod.value, // Use .value for refs
      shippingMethod: shippingMethod.value, // Use .value for refs
      shippingPrice: shippingFee.value,   // Use .value for computed
      itemsPrice: subtotal.value,         // Use .value for computed
      totalPrice: total.value,            // Use .value for computed
      note: shippingInfo.note || ''
    };

    // Dispatch actions via store.dispatch
    const createdOrder = await store.dispatch('order/createOrder', orderData);
    await store.dispatch('cart/clearCart'); // Make sure this action exists and works

    toast.success('Đặt hàng thành công!'); // Use toast directly

    // Use router for navigation
    router.push(`/order/${createdOrder._id}`);

  } catch (error) {
    console.error("Checkout Error:", error); // Log the full error for debugging
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Đặt hàng thất bại. Vui lòng thử lại.';

    toast.error(message); // Use toast directly
  } finally {
    loading.value = false; // Use .value for refs
  }
};

</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.2s;
}
.input-field:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
}
.loader-sm {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #22c55e;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>