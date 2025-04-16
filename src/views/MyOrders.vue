<template>
    <div class="my-orders container mx-auto my-8 px-4">
      <h1 class="text-3xl font-bold text-green-800 mb-6">Đơn hàng của tôi</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Tab buttons -->
        <div class="flex border-b border-gray-200">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value"
            class="px-4 py-3 text-sm font-medium"
            :class="activeTab === tab.value ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <!-- Orders list -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="loader"></div>
        </div>
        
        <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
          <div class="mb-4">
            <i class="fas fa-shopping-bag text-gray-300 text-5xl"></i>
          </div>
          <p class="text-gray-600 mb-4">Bạn chưa có đơn hàng nào {{ activeTab !== 'all' ? 'trong trạng thái này' : '' }}.</p>
          <router-link 
            to="/products" 
            class="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Tiếp tục mua sắm
          </router-link>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="order in filteredOrders" 
            :key="order._id"
            class="p-4 hover:bg-gray-50"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
              <div>
                <h3 class="text-lg font-medium text-gray-800">
                  Đơn hàng #{{ order._id.substring(order._id.length - 8) }}
                </h3>
                <p class="text-sm text-gray-500">
                  Ngày đặt: {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <div class="mt-2 md:mt-0 flex items-center">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusText(order.status) }}
                </span>
                <router-link 
                  :to="`/order/${order._id}`"
                  class="ml-4 text-green-600 hover:underline text-sm"
                >
                  Xem chi tiết
                </router-link>
              </div>
            </div>
            
            <div class="border-t border-gray-100 pt-3">
              <div 
                v-for="(item, index) in order.orderItems.slice(0, 2)" 
                :key="index"
                class="flex items-center py-2"
              >
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded-md mr-4"
                >
                <div class="flex-1">
                  <h4 class="text-gray-800">{{ item.name }}</h4>
                  <p class="text-gray-500 text-sm">{{ item.quantity }} x {{ formatPrice(item.price) }}đ</p>
                </div>
              </div>
              
              <div v-if="order.orderItems.length > 2" class="text-sm text-gray-500 py-2">
                và {{ order.orderItems.length - 2 }} sản phẩm khác
              </div>
              
              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <span class="text-gray-700">Tổng tiền:</span>
                  <span class="font-medium text-gray-900 ml-2">{{ formatPrice(order.totalPrice) }}đ</span>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    v-if="order.status === 'delivered'"
                    class="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
                  >
                    Đánh giá
                  </button>
                  <button 
                    v-if="order.status === 'pending'"
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  >
                    Hủy đơn
                  </button>
                  <button 
                    v-if="order.status === 'delivered'"
                    class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                  >
                    Mua lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: 'MyOrders',
    data() {
      return {
        loading: true,
        activeTab: 'all',
        tabs: [
          { label: 'Tất cả', value: 'all' },
          { label: 'Chờ xác nhận', value: 'pending' },
          { label: 'Đang xử lý', value: 'processing' },
          { label: 'Đang giao', value: 'shipping' },
          { label: 'Đã giao', value: 'delivered' },
          { label: 'Đã hủy', value: 'cancelled' }
        ]
      };
    },
    computed: {
      ...mapGetters({
        // Lấy trực tiếp từ getter, đã xử lý ở bước 2
        orders: 'order/myOrders'
      }),
      filteredOrders() {
        // orders ở đây NÊN đã là một mảng (rỗng hoặc có dữ liệu)
        // nhờ getter đã xử lý
        if (!Array.isArray(this.orders)) {
            console.warn('MyOrders computed: this.orders is not an array!', this.orders);
            return []; // Trả về mảng rỗng nếu có gì đó bất thường
        }
        if (this.activeTab === 'all') {
          return this.orders;
        }
        return this.orders.filter(order => order.status === this.activeTab);
      }
    },
    methods: {
      ...mapActions({
        fetchMyOrders: 'order/fetchMyOrders'
      }),
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      },
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
      },
      getStatusText(status) {
        const statusMap = {
          'pending': 'Chờ xác nhận',
          'processing': 'Đang xử lý',
          'shipping': 'Đang giao',
          'delivered': 'Đã giao',
          'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
      },
      getStatusClass(status) {
        const classMap = {
          'pending': 'bg-blue-100 text-blue-800',
          'processing': 'bg-yellow-100 text-yellow-800',
          'shipping': 'bg-purple-100 text-purple-800',
          'delivered': 'bg-green-100 text-green-800',
          'cancelled': 'bg-red-100 text-red-800'
        };
        return classMap[status] || 'bg-gray-100 text-gray-800';
      }
    },
    async mounted() {
      try {
        this.loading = true;
        await this.fetchMyOrders(); // Gọi hàm đã map (tên là fetchMyOrders)
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Không cần toast ở đây nếu action không throw lỗi
        // this.$toast.error('Không thể lấy danh sách đơn hàng');
      } finally {
        this.loading = false;
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