<!-- src/views/Admin/Dashboard.vue -->
<template>
    <div class="admin-dashboard">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-semibold text-green-800 mb-6">Quản trị hệ thống</h1>
        
        <!-- Dashboard Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <i class="fas fa-shopping-cart text-xl"></i>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Đơn hàng</p>
                <p class="text-2xl font-semibold">{{ stats.orders }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <i class="fas fa-users text-xl"></i>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Người dùng</p>
                <p class="text-2xl font-semibold">{{ stats.users }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <i class="fas fa-box text-xl"></i>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Sản phẩm</p>
                <p class="text-2xl font-semibold">{{ stats.products }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <i class="fas fa-dollar-sign text-xl"></i>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Doanh thu</p>
                <p class="text-2xl font-semibold">{{ formatPrice(stats.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div class="bg-white rounded-lg shadow-md mb-8">
          <nav class="flex border-b">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-6 py-3 text-center"
              :class="{'text-green-600 border-b-2 border-green-600 font-medium': activeTab === tab.id}"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
        
        <!-- Tab Content -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium">Đơn hàng gần đây</h2>
              <button class="text-green-600 hover:text-green-700">
                Xem tất cả
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in recentOrders" :key="order._id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ order._id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.user.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatPrice(order.totalPrice) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusClass(order.status)"
                      >
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-green-600 hover:text-green-900 mr-3">Chi tiết</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Products Tab -->
          <div v-else-if="activeTab === 'products'">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium">Sản phẩm</h2>
              <button class="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded">
                Thêm sản phẩm
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in products" :key="product._id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img class="h-10 w-10 rounded-full" :src="product.image || 'https://via.placeholder.com/150'" alt="">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatPrice(product.price) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.countInStock }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-green-600 hover:text-green-900 mr-3">Sửa</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Xóa</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Users Tab -->
          <div v-else-if="activeTab === 'users'">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium">Người dùng</h2>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng ký</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user._id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/150" alt="">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getRoleClass(user.role)"
                      >
                        {{ getRoleText(user.role) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" class="text-green-600 hover:text-green-900 mr-3">Chỉnh sửa</a>
                      <a href="#" class="text-red-600 hover:text-red-900">Xóa</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard',
    data() {
      return {
        activeTab: 'orders',
        tabs: [
          { id: 'orders', name: 'Đơn hàng' },
          { id: 'products', name: 'Sản phẩm' },
          { id: 'users', name: 'Người dùng' }
        ],
        stats: {
          orders: 156,
          users: 532,
          products: 237,
          revenue: 78500000
        },
        recentOrders: [
          { 
            _id: '1001', 
            user: { name: 'Nguyễn Văn A' }, 
            createdAt: '2025-03-10T10:30:00', 
            totalPrice: 850000, 
            status: 'processing' 
          },
          { 
            _id: '1002', 
            user: { name: 'Trần Thị B' }, 
            createdAt: '2025-03-09T14:20:00', 
            totalPrice: 1250000, 
            status: 'delivered' 
          },
          { 
            _id: '1003', 
            user: { name: 'Lê Văn C' }, 
            createdAt: '2025-03-08T09:45:00', 
            totalPrice: 550000, 
            status: 'shipped' 
          },
          { 
            _id: '1004', 
            user: { name: 'Phạm Thị D' }, 
            createdAt: '2025-03-07T16:15:00', 
            totalPrice: 1750000, 
            status: 'delivered' 
          },
          { 
            _id: '1005', 
            user: { name: 'Hoàng Văn E' }, 
            createdAt: '2025-03-07T11:30:00', 
            totalPrice: 425000, 
            status: 'cancelled' 
          }
        ],
        products: [
          { 
            _id: '1', 
            name: 'Mật ong rừng Tây Bắc', 
            category: 'Thực phẩm', 
            price: 250000, 
            countInStock: 15, 
            image: 'https://via.placeholder.com/150' 
          },
          { 
            _id: '2', 
            name: 'Chè Shan tuyết Hà Giang', 
            category: 'Đồ uống', 
            price: 180000, 
            countInStock: 8, 
            image: 'https://via.placeholder.com/150' 
          },
          { 
            _id: '3', 
            name: 'Gạo nếp cẩm Điện Biên', 
            category: 'Thực phẩm', 
            price: 75000, 
            countInStock: 25, 
            image: 'https://via.placeholder.com/150' 
          },
          { 
            _id: '4', 
            name: 'Chổi đót làng Vẹt', 
            category: 'Thủ công mỹ nghệ', 
            price: 45000, 
            countInStock: 0, 
            image: 'https://via.placeholder.com/150' 
          },
          { 
            _id: '5', 
            name: 'Rượu cần Tây Nguyên', 
            category: 'Đồ uống', 
            price: 320000, 
            countInStock: 12, 
            image: 'https://via.placeholder.com/150' 
          }
        ],
        users: [
          { 
            _id: '1', 
            name: 'Nguyễn Văn Admin', 
            email: 'admin@example.com', 
            role: 'admin', 
            createdAt: '2024-01-15T08:30:00' 
          },
          { 
            _id: '2', 
            name: 'Trần Thị Seller', 
            email: 'seller@example.com', 
            role: 'seller', 
            createdAt: '2024-02-10T14:20:00' 
          },
          { 
            _id: '3', 
            name: 'Lê Văn Distributor', 
            email: 'distributor@example.com', 
            role: 'distributor', 
            createdAt: '2024-02-20T10:15:00' 
          },
          { 
            _id: '4', 
            name: 'Phạm Thị User', 
            email: 'user@example.com', 
            role: 'user', 
            createdAt: '2024-03-05T16:45:00' 
          },
          { 
            _id: '5', 
            name: 'Hoàng Văn New', 
            email: 'newuser@example.com', 
            role: 'user', 
            createdAt: '2024-04-01T09:30:00' 
          }
        ]
      };
    },
    methods: {
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(price);
      },
      
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
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
      
      getRoleClass(role) {
        switch (role) {
          case 'admin':
            return 'bg-red-100 text-red-800';
          case 'seller':
            return 'bg-blue-100 text-blue-800';
          case 'distributor':
            return 'bg-purple-100 text-purple-800';
          case 'user':
            return 'bg-green-100 text-green-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      },
      
      getRoleText(role) {
        switch (role) {
          case 'admin':
            return 'Quản trị viên';
          case 'seller':
            return 'Nhà bán hàng';
          case 'distributor':
            return 'Nhà phân phối';
          case 'user':
            return 'Người dùng';
          default:
            return 'Không xác định';
        }
      }
    }
  };
  </script>