<template>
    <div class="checkout container mx-auto my-8 px-4">
      <h1 class="text-3xl font-bold text-green-800 mb-6">Thanh toán</h1>
      
      <!-- Checkout Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  v-model="shippingInfo.fullName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập họ và tên"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  v-model="shippingInfo.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập số điện thoại"
                >
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="shippingInfo.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Nhập địa chỉ email"
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <select 
                  v-model="shippingInfo.province"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hochiminh">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                  <option value="haiphong">Hải Phòng</option>
                  <option value="cantho">Cần Thơ</option>
                  <!-- More options would be dynamically loaded -->
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <select 
                  v-model="shippingInfo.district"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  :disabled="!shippingInfo.province"
                >
                  <option value="">Chọn quận/huyện</option>
                  <!-- Options would be dynamically loaded based on selected province -->
                  <option v-if="shippingInfo.province" value="district1">Quận/Huyện 1</option>
                  <option v-if="shippingInfo.province" value="district2">Quận/Huyện 2</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <select 
                  v-model="shippingInfo.ward"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  :disabled="!shippingInfo.district"
                >
                  <option value="">Chọn phường/xã</option>
                  <!-- Options would be dynamically loaded based on selected district -->
                  <option v-if="shippingInfo.district" value="ward1">Phường/Xã 1</option>
                  <option v-if="shippingInfo.district" value="ward2">Phường/Xã 2</option>
                </select>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
              <input 
                v-model="shippingInfo.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Số nhà, tên đường, ..."
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng (tuỳ chọn)</label>
              <textarea 
                v-model="shippingInfo.note"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Ghi chú cho đơn hàng của bạn..."
              ></textarea>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Phương thức vận chuyển</h2>
            
            <div class="space-y-3">
              <div class="flex items-center">
                <input 
                  id="shipping-standard" 
                  type="radio" 
                  v-model="shippingMethod" 
                  value="standard"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                >
                <label for="shipping-standard" class="ml-3 block">
                  <span class="text-gray-700 font-medium">Giao hàng tiêu chuẩn</span>
                  <span class="block text-gray-500 text-sm">Nhận hàng trong 3-5 ngày</span>
                </label>
                <span class="ml-auto font-medium">30.000đ</span>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="shipping-fast" 
                  type="radio" 
                  v-model="shippingMethod" 
                  value="fast"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                >
                <label for="shipping-fast" class="ml-3 block">
                  <span class="text-gray-700 font-medium">Giao hàng nhanh</span>
                  <span class="block text-gray-500 text-sm">Nhận hàng trong 1-2 ngày</span>
                </label>
                <span class="ml-auto font-medium">50.000đ</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
            
            <div class="space-y-3">
              <div class="flex items-center">
                <input 
                  id="payment-cod" 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="cod"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                >
                <label for="payment-cod" class="ml-3 block">
                  <span class="text-gray-700 font-medium">Thanh toán khi nhận hàng (COD)</span>
                  <span class="block text-gray-500 text-sm">Thanh toán bằng tiền mặt khi nhận hàng</span>
                </label>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="payment-banking" 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="banking"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                >
                <label for="payment-banking" class="ml-3 block">
                  <span class="text-gray-700 font-medium">Chuyển khoản ngân hàng</span>
                  <span class="block text-gray-500 text-sm">Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi</span>
                </label>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="payment-momo" 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="momo"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                >
                <label for="payment-momo" class="ml-3 block">
                  <span class="text-gray-700 font-medium">Ví MoMo</span>
                  <span class="block text-gray-500 text-sm">Thanh toán qua ví điện tử MoMo</span>
                </label>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="payment-vnpay" 
                  type="radio" 
                  v-model="paymentMethod" 
                  value="vnpay"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                >
                <label for="payment-vnpay" class="ml-3 block">
                  <span class="text-gray-700 font-medium">VNPay</span>
                  <span class="block text-gray-500 text-sm">Thanh toán qua cổng VNPay</span>
                </label>
              </div>
            </div>
            
            <div v-if="paymentMethod === 'banking'" class="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 class="font-medium text-gray-700 mb-2">Thông tin tài khoản</h3>
              <p class="text-gray-600">Ngân hàng: <span class="font-medium">Vietcombank</span></p>
              <p class="text-gray-600">Số tài khoản: <span class="font-medium">1234567890</span></p>
              <p class="text-gray-600">Chủ tài khoản: <span class="font-medium">CÔNG TY OCOP STORE</span></p>
              <p class="text-gray-600">Nội dung chuyển khoản: <span class="font-medium">Thanh toán đơn hàng #{{ orderNumber }}</span></p>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Đơn hàng của bạn</h2>
            
            <div class="mb-4">
              <div class="max-h-64 overflow-y-auto mb-4">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="flex items-start py-3 first:pt-0 border-b border-gray-200 last:border-b-0"
                >
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded-md mr-3"
                  >
                  <div class="flex-1">
                    <h4 class="text-gray-800 font-medium">{{ item.name }}</h4>
                    <div class="flex justify-between mt-1">
                      <span class="text-gray-500 text-sm">{{ item.quantity }} x {{ formatPrice(item.price) }}đ</span>
                      <span class="text-gray-800">{{ formatPrice(item.price * item.quantity) }}đ</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="space-y-3 border-t border-gray-200 pt-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tạm tính</span>
                  <span class="text-gray-800">{{ formatPrice(orderSummary.subtotal) }}đ</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phí vận chuyển</span>
                  <span class="text-gray-800">{{ formatPrice(orderSummary.shippingFee) }}đ</span>
                </div>
                <div v-if="orderSummary.discount > 0" class="flex justify-between">
                  <span class="text-gray-600">Giảm giá</span>
                  <span class="text-red-600">-{{ formatPrice(orderSummary.discount) }}đ</span>
                </div>
                <div class="flex justify-between font-semibold pt-2">
                  <span class="text-gray-800">Tổng cộng</span>
                  <span class="text-gray-800 text-xl">{{ formatPrice(orderSummary.total) }}đ</span>
                </div>
              </div>
            </div>
            
            <div>
              <button 
                @click="placeOrder"
                :disabled="loading"
                class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                <span v-if="loading" class="mr-2">
                  <div class="loader-sm"></div>
                </span>
                <span>Đặt hàng</span>
              </button>
              
              <router-link 
                to="/cart" 
                class="block text-center mt-4 text-green-600 hover:underline"
              >
                Quay lại giỏ hàng
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'CheckoutView',
    data() {
      return {
        loading: false,
        orderNumber: 'ORD' + Date.now().toString().substr(5),
        shippingInfo: {
          fullName: '',
          phone: '',
          email: '',
          province: '',
          district: '',
          ward: '',
          address: '',
          note: ''
        },
        shippingMethod: 'standard',
        paymentMethod: 'cod',
        orderSummary: {
          subtotal: 0,
          shippingFee: 30000,
          discount: 0,
          total: 0
        }
      };
    },
    computed: {
      ...mapGetters({
        cartItems: 'cart/cartItems',
        cartTotal: 'cart/cartTotal',
        currentUser: 'auth/currentUser'
      })
    },
    watch: {
      shippingMethod(newMethod) {
        if (newMethod === 'standard') {
          this.orderSummary.shippingFee = 30000;
        } else if (newMethod === 'fast') {
          this.orderSummary.shippingFee = 50000;
        }
        this.calculateTotal();
      }
    },
    methods: {
      ...mapActions({
        createOrder: 'order/createOrder',
        clearCart: 'cart/clearCart'
      }),
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
      },
      calculateTotal() {
        this.orderSummary.subtotal = this.cartTotal;
        this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.shippingFee - this.orderSummary.discount;
      },
      validateForm() {
        const requiredFields = ['fullName', 'phone', 'email', 'province', 'district', 'ward', 'address'];
        const missing = requiredFields.filter(field => !this.shippingInfo[field]);
        
        if (missing.length > 0) {
          this.$toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
          return false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.shippingInfo.email)) {
          this.$toast.error('Email không hợp lệ');
          return false;
        }
        
        // Validate phone (Vietnam phone number)
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(this.shippingInfo.phone)) {
          this.$toast.error('Số điện thoại không hợp lệ');
          return false;
        }
        
        return true;
      },
      async placeOrder() {
        if (!this.validateForm()) {
          return;
        }
        
        try {
          this.loading = true;
          
          const orderItems = this.cartItems.map(item => ({
            name: item.name,
            price: item.price,
            image: item.image,
            product: item.id,
            quantity: item.quantity,
            variant: item.variant || null
          }));
          
          const shippingAddress = {
            fullName: this.shippingInfo.fullName,
            phone: this.shippingInfo.phone,
            email: this.shippingInfo.email,
            address: this.shippingInfo.address,
            ward: this.shippingInfo.ward,
            district: this.shippingInfo.district,
            province: this.shippingInfo.province
          };
          
          const order = {
            orderItems,
            shippingAddress,
            paymentMethod: this.paymentMethod,
            shippingMethod: this.shippingMethod,
            shippingPrice: this.orderSummary.shippingFee,
            itemsPrice: this.orderSummary.subtotal,
            totalPrice: this.orderSummary.total,
            note: this.shippingInfo.note || ''
          };
          
          const createdOrder = await this.createOrder(order);
          
          // Clear cart
          this.clearCart();
          
          // Redirect to order success page
          this.$router.push(`/order/${createdOrder._id}`);
          
        } catch (error) {
          console.error('Error placing order:', error);
          this.$toast.error('Đã có lỗi xảy ra khi đặt hàng');
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      // Pre-fill form with user info if available
      if (this.currentUser) {
        this.shippingInfo.fullName = this.currentUser.name || '';
        this.shippingInfo.email = this.currentUser.email || '';
        this.shippingInfo.phone = this.currentUser.phone || '';
        
        // Pre-fill address if available
        if (this.currentUser.address) {
          this.shippingInfo.address = this.currentUser.address.street || '';
          this.shippingInfo.ward = this.currentUser.address.ward || '';
          this.shippingInfo.district = this.currentUser.address.district || '';
          this.shippingInfo.province = this.currentUser.address.province || '';
        }
      }
      
      this.calculateTotal();
    }
  };
  </script>
  
  <style scoped>
  .loader-sm {
    border: 2px solid #f3f3f3;
    border-radius: 50%;
    border-top: 2px solid #ffffff;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>