<template>
  <div class="cart container mx-auto my-8 px-2 sm:px-4">
    <h1 class="text-3xl font-bold text-green-800 mb-8 text-center tracking-tight drop-shadow-md">🛒 Giỏ hàng của bạn</h1>
    
    <div v-if="cartItems.length === 0" class="bg-white rounded-2xl shadow-lg p-10 text-center max-w-xl mx-auto flex flex-col items-center">
      <div class="mb-4">
        <i class="fas fa-shopping-cart text-gray-200 text-7xl drop-shadow"></i>
      </div>
      <p class="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống.</p>
      <router-link
        to="/products"
        class="inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-400 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-200 font-semibold"
      >
        Tiếp tục mua sắm
      </router-link>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Danh sách sản phẩm -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div class="p-5 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
            <div class="grid grid-cols-12 gap-2">
              <div class="col-span-6 font-semibold text-gray-700">Sản phẩm</div>
              <div class="col-span-2 text-center font-semibold text-gray-700">Đơn giá</div>
              <div class="col-span-2 text-center font-semibold text-gray-700">Số lượng</div>
              <div class="col-span-2 text-right font-semibold text-gray-700">Thành tiền</div>
            </div>
          </div>

          <div class="divide-y divide-gray-100">
            <div v-for="item in cartItems" :key="item.product._id" class="p-4">
              <div class="grid grid-cols-12 gap-2 items-center">
                <div class="col-span-6">
                  <div class="flex items-center">
                    <img 
                      :src="(Array.isArray(item.product.images) && item.product.images.length > 0) ? item.product.images[0] : '/default.jpg'"
                      :alt="item.product.name"
                      class="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <router-link :to="`/product/${item.product._id}`" class="text-gray-800 hover:text-green-600 font-medium">
                        {{ item.product.name }}
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="col-span-2 text-center text-gray-800">
                  {{ formatPrice(item.product.price) }}đ
                </div>
                <div class="col-span-2 text-center">
                  <div class="flex items-center justify-center">
                    <button 
                      @click="updateQuantity(item.product._id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-100 disabled:opacity-50"
                    >
                      <i class="fas fa-minus text-xs"></i>
                    </button>
                    <input 
                      v-model.number="item.quantity"
                      @change="updateQuantity(item.product._id, item.quantity)"
                      type="number"
                      min="1"
                      class="w-10 text-center border-t border-b border-gray-300 py-1"
                    >
                    <button 
                      @click="updateQuantity(item.product._id, item.quantity + 1)"
                      class="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-100 disabled:opacity-50"
                    >
                      <i class="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div class="col-span-2 text-right">
                  <div class="flex items-center justify-end">
                    <span class="text-gray-800 font-medium">{{ formatPrice(item.product.price * item.quantity) }}đ</span>
                    <button 
                      @click="removeItem(item.product._id)"
                      class="ml-4 text-gray-500 hover:text-red-500"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tóm tắt đơn hàng -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 border border-green-100">
          <h2 class="text-2xl font-bold text-green-800 mb-6 text-center">Tóm tắt đơn hàng</h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Tạm tính</span>
              <span class="text-gray-800 font-medium">{{ formatPrice(cartTotal) }}₫</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Phí vận chuyển</span>
              <span class="text-gray-800 font-medium">{{ formatPrice(shippingFee) }}₫</span>
            </div>
            <div v-if="discount > 0" class="flex justify-between items-center">
              <span class="text-gray-600">Giảm giá</span>
              <span class="bg-red-100 rounded px-2 py-1 text-red-600 font-semibold text-sm">-{{ formatPrice(discount) }}₫</span>
            </div>
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center font-bold text-lg">
                <span class="text-green-800">Tổng cộng</span>
                <span class="text-green-800 text-2xl">{{ formatPrice(orderTotal) }}₫</span>
              </div>
            </div>
          </div>
          
          <!-- Mã giảm giá -->
          <div class="mb-7">
            <div class="flex space-x-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Nhập mã giảm giá"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
              <button
                @click="applyCoupon"
                class="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 rounded-lg hover:from-green-200 hover:to-emerald-300 transition font-semibold"
              >
                Áp dụng
              </button>
            </div>
          </div>
          
          <button
            @click="checkout"
            class="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-400 text-white font-bold rounded-full hover:scale-105 hover:shadow-xl transition disabled:from-gray-300 disabled:to-gray-200 disabled:text-gray-400"
            :disabled="cartItems.length === 0"
          >
            <i class="fas fa-credit-card mr-2"></i>Thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CartView',
  data() {
    return {
      couponCode: '',
      discount: 0,
      shippingFee: 30000 // Default shipping fee
    };
  },
  computed: {
    ...mapGetters({
      cartItems: 'cart/cartItems',
      cartTotalPrice: 'cart/cartTotalPrice',
      isLoggedIn: 'auth/isLoggedIn'
    }),
    cartTotal() {
      // Đảm bảo cartTotalPrice là số
      return Number(this.cartTotalPrice || 0);
    },
    orderTotal() {
      return Number(this.cartTotalPrice || 0) + Number(this.shippingFee || 0) - Number(this.discount || 0);
    }
  },
  created() {
    this.getCart(); // Gọi getCart khi component được tạo
  },
  methods: {
    ...mapActions({
      getCart: 'cart/getCart', // Thêm getCart vào mapActions
      updateCartItem: 'cart/updateCartItem',
      removeFromCart: 'cart/removeFromCart'
    }),
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN').format(price);
    },
    updateQuantity(productId, quantity) {
      if (quantity < 1) quantity = 1;
      this.updateCartItem({ productId, quantity });
    },
    removeItem(productId) {
      this.removeFromCart(productId);
    },
    applyCoupon() {
      if (!this.couponCode) {
        this.$toast.error('Vui lòng nhập mã giảm giá');
        return;
      }
      // Mock coupon codes for demonstration
      const coupons = {
        'WELCOME10': { type: 'percent', value: 10 },
        'SAVE20': { type: 'percent', value: 20 },
        'FREESHIP': { type: 'shipping', value: this.shippingFee }
      };
      const coupon = coupons[this.couponCode.toUpperCase()];
      if (coupon) {
        if (coupon.type === 'percent') {
          this.discount = (this.cartTotalPrice * coupon.value) / 100;
          this.$toast.success(`Đã áp dụng mã giảm ${coupon.value}%`);
        } else if (coupon.type === 'shipping') {
          this.discount = coupon.value;
          this.$toast.success('Đã áp dụng mã miễn phí vận chuyển');
        }
      } else {
        this.$toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    },
    checkout() {
      if (this.cartItems.length === 0) {
        this.$toast.error('Giỏ hàng của bạn đang trống');
        return;
      }
      if (!this.isLoggedIn) {
        this.$router.push({ name: 'Login', query: { redirect: '/checkout' } });
      } else {
        this.$router.push('/checkout');
      }
    }
  }
};
</script>

<style scoped>
/* Bo góc lớn và bóng cho giao diện chuyên nghiệp */
.cart {
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  background: linear-gradient(180deg, #f8fafc 0%, #e4ffe8 100%);
  min-height: 80vh;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
}
/* Nút hành động lớn hơn trên mobile */
@media (max-width: 640px) {
  .cart h1 {
    font-size: 2rem;
  }
  .cart .rounded-2xl {
    border-radius: 1rem;
  }
}
</style>