<!-- src/views/OrderDetail.vue -->
<template>
    <div class="order-detail container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="loader"></div>
      </div>
      
      <div v-else-if="order" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-xl font-semibold text-gray-800">
              Chi tiết đơn hàng #{{ order._id }}
            </h1>
            <span 
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <div class="text-sm text-gray-500 mb-1">Ngày đặt hàng: {{ formatDate(order.createdAt) }}</div>
            <div class="text-sm text-gray-500">Mã đơn hàng: {{ order._id }}</div>
          </div>
        </div>
        
        <!-- Thông tin giao hàng -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-1">Người nhận</h3>
              <p class="text-gray-800">{{ order.shippingAddress.fullName }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-1">Số điện thoại</h3>
              <p class="text-gray-800">{{ order.shippingAddress.phone }}</p>
            </div>
            
            <div class="md:col-span-2">
              <h3 class="text-sm font-medium text-gray-600 mb-1">Địa chỉ giao hàng</h3>
              <p class="text-gray-800">
                {{ order.shippingAddress.address }}, 
                {{ order.shippingAddress.city }}, 
                {{ order.shippingAddress.country }}
              </p>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-600 mb-1">Trạng thái giao hàng</h3>
            <div class="flex items-center">
              <span 
                class="px-2 py-1 rounded-full text-xs font-semibold mr-2"
                :class="order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng' }}
              </span>
              <span v-if="order.isDelivered" class="text-sm text-gray-500">
                vào {{ formatDate(order.deliveredAt) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Thông tin thanh toán -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Thông tin thanh toán</h2>
          
          <div>
            <h3 class="text-sm font-medium text-gray-600 mb-1">Phương thức thanh toán</h3>
            <p class="text-gray-800 mb-4">{{ getPaymentMethod(order.paymentMethod) }}</p>
            
            <div class="flex items-center">
              <span 
                class="px-2 py-1 rounded-full text-xs font-semibold mr-2"
                :class="order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </span>
              <span v-if="order.isPaid" class="text-sm text-gray-500">
                vào {{ formatDate(order.paidAt) }}
              </span>
            </div>
          </div>
          
          <div v-if="!order.isPaid && order.paymentMethod === 'paypal'" class="mt-4 pt-4 border-t border-gray-200">
            <button 
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            >
              Thanh toán bằng PayPal
            </button>
          </div>
        </div>
        
        <!-- Các sản phẩm đặt hàng -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Chi tiết sản phẩm</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="border-b">
                <tr>
                  <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Sản phẩm</th>
                  <th class="text-center py-3 px-4 text-sm font-medium text-gray-500">Số lượng</th>
                  <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">Đơn giá</th>
                  <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">Thành tiền</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="item in order.orderItems" :key="item._id || item.product">
                  <td class="py-3 px-4">
                    <div class="flex items-center">
                      <img 
                        :src="item.image || 'https://via.placeholder.com/50'"
                        alt="Product image"
                        class="w-12 h-12 object-cover rounded-md mr-3"
                      >
                      <div>
                        <p class="font-medium text-gray-800">{{ item.name }}</p>
                        <p v-if="item.variant" class="text-xs text-gray-500">{{ item.variant }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-center">{{ item.quantity }}</td>
                  <td class="py-3 px-4 text-right">{{ formatPrice(item.price) }}</td>
                  <td class="py-3 px-4 text-right font-medium">{{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Tổng tiền -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Tổng thanh toán</h2>
          
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Tạm tính:</span>
              <span class="text-gray-800">{{ formatPrice(order.itemsPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phí vận chuyển:</span>
              <span class="text-gray-800">{{ formatPrice(order.shippingPrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Thuế:</span>
              <span class="text-gray-800">{{ formatPrice(order.taxPrice) }}</span>
            </div>
            <div class="pt-2 mt-2 border-t border-gray-200 flex justify-between">
              <span class="font-semibold text-gray-800">Tổng cộng:</span>
              <span class="font-semibold text-green-600 text-xl">{{ formatPrice(order.totalPrice) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Admin/Distributor Actions -->
        <div v-if="isAdmin || isDistributor" class="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Thao tác quản trị</h2>
          
          <div class="space-y-3">
            <button 
              v-if="!order.isDelivered" 
              @click="markAsDelivered"
              class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
            >
              Đánh dấu đã giao hàng
            </button>
            
            <div v-if="isAdmin && !order.distributor" class="space-y-2">
              <label for="distributor" class="block text-gray-700">Chỉ định nhà phân phối:</label>
              <select 
                id="distributor" 
                v-model="selectedDistributor"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Chọn nhà phân phối --</option>
                <option value="dist1">Nhà phân phối A</option>
                <option value="dist2">Nhà phân phối B</option>
                <option value="dist3">Nhà phân phối C</option>
              </select>
              <button 
                :disabled="!selectedDistributor"
                @click="assignDistributor"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Chỉ định
              </button>
            </div>
            
            <button 
              v-if="order.status !== 'cancelled'"
              @click="cancelOrder"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
            >
              Hủy đơn hàng
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-600">Không tìm thấy thông tin đơn hàng.</p>
        <router-link 
          to="/orders" 
          class="text-green-600 hover:text-green-700 mt-4 inline-block"
        >
          Quay lại danh sách đơn hàng
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'OrderDetail',
    data() {
      return {
        loading: true,
        order: null,
        selectedDistributor: ''
      };
    },
    computed: {
      ...mapGetters({
        isAdmin: 'auth/isAdmin',
        isDistributor: 'auth/isDistributor'
      })
    },
    methods: {
      ...mapActions({
        getOrderById: 'order/getOrderById',
        deliverOrder: 'order/deliverOrder',
        updateOrderStatus: 'order/updateOrderStatus',
        assignOrderToDistributor: 'order/assignOrderToDistributor'
      }),
      
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(price);
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
      
      getStatusClass(status) {
        switch (status) {
          case 'processing':
            return 'bg-yellow-100 text-yellow-800';
          case 'shipped':
            return 'bg-blue-100 text-blue-800';
          case 'delivered':
            return 'bg-green-100 text-green-800';
          case 'cancelled':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      },
      
      getStatusText(status) {
        switch (status) {
          case 'processing':
            return 'Đang xử lý';
          case 'shipped':
            return 'Đang giao';
          case 'delivered':
            return 'Đã giao';
          case 'cancelled':
            return 'Đã hủy';
          default:
            return 'Không xác định';
        }
      },
      
      getPaymentMethod(method) {
        switch (method) {
          case 'cod':
            return 'Thanh toán khi nhận hàng (COD)';
          case 'paypal':
            return 'PayPal';
          case 'card':
            return 'Thẻ tín dụng/ghi nợ';
          case 'bank':
            return 'Chuyển khoản ngân hàng';
          default:
            return method;
        }
      },
      
      async fetchOrderDetails() {
        try {
          this.loading = true;
          const orderId = this.$route.params.id;
          
          // For demonstration, we're using mock data
          // In a real app: this.order = await this.getOrderById(orderId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock data
          this.order = {
            _id: orderId,
            user: {
              _id: 'user123',
              name: 'Nguyễn Văn A'
            },
            orderItems: [
              {
                name: 'Mật ong rừng Tây Bắc',
                quantity: 2,
                image: 'https://via.placeholder.com/150',
                price: 250000,
                product: 'prod1'
              },
              {
                name: 'Chè Shan tuyết Hà Giang',
                quantity: 1,
                image: 'https://via.placeholder.com/150',
                price: 180000,
                product: 'prod2'
              }
            ],
            shippingAddress: {
              fullName: 'Nguyễn Văn A',
              address: '123 Đường Lê Lợi, Quận 1',
              city: 'TP. Hồ Chí Minh',
              country: 'Việt Nam',
              phone: '0987654321'
            },
            paymentMethod: 'cod',
            itemsPrice: 680000,
            shippingPrice: 30000,
            taxPrice: 68000,
            totalPrice: 778000,
            isPaid: true,
            paidAt: '2025-04-01T10:30:00',
            isDelivered: false,
            status: 'processing',
            createdAt: '2025-04-01T09:15:00'
          };
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          this.loading = false;
        }
      },
      
      async markAsDelivered() {
        try {
          if (!confirm('Xác nhận đánh dấu đơn hàng này đã giao?')) return;
          
          // In a real app: await this.deliverOrder(this.order._id);
          this.order.isDelivered = true;
          this.order.deliveredAt = new Date().toISOString();
          this.order.status = 'delivered';
          
          alert('Đã cập nhật trạng thái giao hàng thành công!');
        } catch (error) {
          console.error('Error marking as delivered:', error);
          alert('Cập nhật thất bại. Vui lòng thử lại.');
        }
      },
      
      async cancelOrder() {
        try {
          if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
          
          // In a real app: await this.updateOrderStatus({ orderId: this.order._id, status: 'cancelled' });
          this.order.status = 'cancelled';
          
          alert('Đã hủy đơn hàng thành công!');
        } catch (error) {
          console.error('Error cancelling order:', error);
          alert('Hủy đơn hàng thất bại. Vui lòng thử lại.');
        }
      },
      
      async assignDistributor() {
        try {
          if (!this.selectedDistributor) return;
          
          // In a real app: await this.assignOrderToDistributor({ 
          //   orderId: this.order._id, 
          //   distributorId: this.selectedDistributor 
          // });
          
          this.order.distributor = {
            _id: this.selectedDistributor,
            name: 'Nhà phân phối ' + (this.selectedDistributor === 'dist1' ? 'A' : this.selectedDistributor === 'dist2' ? 'B' : 'C')
          };
          
          alert('Đã chỉ định nhà phân phối thành công!');
        } catch (error) {
          console.error('Error assigning distributor:', error);
          alert('Chỉ định nhà phân phối thất bại. Vui lòng thử lại.');
        }
      }
    },
    created() {
      this.fetchOrderDetails();
    },
    watch: {
      '$route.params.id': {
        handler() {
          this.fetchOrderDetails();
        },
        immediate: true
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #10B981;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>