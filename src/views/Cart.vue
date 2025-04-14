<template>
    <div class="cart container mx-auto my-8 px-4">
      <h1 class="text-3xl font-bold text-green-800 mb-6">Giỏ hàng của bạn</h1>
      
      <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="mb-4">
          <i class="fas fa-shopping-cart text-gray-300 text-5xl"></i>
        </div>
        <p class="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
        <router-link 
          to="/products" 
          class="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="p-4 bg-gray-50 border-b border-gray-200">
              <div class="grid grid-cols-12 gap-2">
                <div class="col-span-6 font-medium text-gray-700">Sản phẩm</div>
                <div class="col-span-2 text-center font-medium text-gray-700">Đơn giá</div>
                <div class="col-span-2 text-center font-medium text-gray-700">Số lượng</div>
                <div class="col-span-2 text-right font-medium text-gray-700">Thành tiền</div>
              </div>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div 
                v-for="item in cartItems" 
                :key="item.id"
                class="p-4"
              >
                <div class="grid grid-cols-12 gap-2 items-center">
                  <div class="col-span-6">
                    <div class="flex items-center">
                      <img 
                        :src="item.image" 
                        :alt="item.name"
                        class="w-16 h-16 object-cover rounded-md mr-4"
                      >
                      <div>
                        <router-link :to="`/product/${item.id}`" class="text-gray-800 hover:text-green-600 font-medium">
                          {{ item.name }}
                        </router-link>
                        <div v-if="item.variant" class="text-sm text-gray-500">
                          Phân loại: {{ item.variant }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-span-2 text-center text-gray-800">
                    {{ formatPrice(item.price) }}đ
                  </div>
                  
                  <div class="col-span-2 text-center">
                    <div class="flex items-center justify-center">
                      <button 
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-100 disabled:opacity-50"
                      >
                        <i class="fas fa-minus text-xs"></i>
                      </button>
                      <input 
                        v-model.number="item.quantity"
                        @change="updateQuantity(item.id, item.quantity)"
                        type="number"
                        min="1"
                        :max="item.countInStock"
                        class="w-10 text-center border-t border-b border-gray-300 py-1"
                      >
                      <button 
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        :disabled="item.quantity >= item.countInStock"
                        class="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-100 disabled:opacity-50"
                      >
                        <i class="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="col-span-2 text-right">
                    <div class="flex items-center justify-end">
                      <span class="text-gray-800 font-medium">{{ formatPrice(item.price * item.quantity) }}đ</span>
                      <button 
                        @click="removeItem(item.id)"
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
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính</span>
                <span class="text-gray-800">{{ formatPrice(cartTotal) }}đ</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span class="text-gray-800">{{ formatPrice(shippingFee) }}đ</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between">
                <span class="text-gray-600">Giảm giá</span>
                <span class="text-red-600">-{{ formatPrice(discount) }}đ</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between font-semibold">
                  <span class="text-gray-800">Tổng cộng</span>
                  <span class="text-gray-800 text-xl">{{ formatPrice(orderTotal) }}đ</span>
                </div>
              </div>
            </div>
            
            <!-- Mã giảm giá -->
            <div class="mb-6">
              <div class="flex space-x-2">
                <input 
                  v-model="couponCode"
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                <button 
                  @click="applyCoupon"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Áp dụng
                </button>
              </div>
            </div>
            
            <button 
              @click="checkout"
              class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              :disabled="cartItems.length === 0"
            >
              Thanh toán
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
        cartTotal: 'cart/cartTotal',
        isLoggedIn: 'auth/isLoggedIn'
      }),
      orderTotal() {
        return this.cartTotal + this.shippingFee - this.discount;
      }
    },
    methods: {
      ...mapActions({
        updateCartItem: 'cart/updateCartItem',
        removeFromCart: 'cart/removeFromCart'
      }),
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
      },
      updateQuantity(productId, quantity) {
        if (quantity < 1) quantity = 1;
        this.updateCartItem({ id: productId, quantity });
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
            this.discount = (this.cartTotal * coupon.value) / 100;
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