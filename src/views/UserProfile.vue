<template>
    <div class="user-profile container mx-auto my-8 px-4">
      <h1 class="text-3xl font-bold text-green-800 mb-6">Tài khoản của tôi</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 bg-green-50">
              <div class="flex items-center">
                <div class="mr-3">
                  <div class="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-lg font-semibold">
                    {{ userInitials }}
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800">{{ user.name }}</h3>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                </div>
              </div>
            </div>
            
            <div class="p-4">
              <ul class="space-y-2">
                <li>
                  <a 
                    href="#profile"
                    @click.prevent="activeTab = 'profile'"
                    class="block px-3 py-2 rounded-md"
                    :class="activeTab === 'profile' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <i class="fas fa-user mr-2"></i> Thông tin tài khoản
                  </a>
                </li>
                <li>
                  <router-link 
                    to="/orders"
                    class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-shopping-bag mr-2"></i> Đơn hàng của tôi
                  </router-link>
                </li>
                <li>
                  <a 
                    href="#addresses"
                    @click.prevent="activeTab = 'addresses'"
                    class="block px-3 py-2 rounded-md"
                    :class="activeTab === 'addresses' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <i class="fas fa-map-marker-alt mr-2"></i> Sổ địa chỉ
                  </a>
                </li>
                <li>
                  <a 
                    href="#password"
                    @click.prevent="activeTab = 'password'"
                    class="block px-3 py-2 rounded-md"
                    :class="activeTab === 'password' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <i class="fas fa-lock mr-2"></i> Đổi mật khẩu
                  </a>
                </li>
                <li>
                  <a 
                    href="#notifications"
                    @click.prevent="activeTab = 'notifications'"
                    class="block px-3 py-2 rounded-md"
                    :class="activeTab === 'notifications' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <i class="fas fa-bell mr-2"></i> Thông báo
                  </a>
                </li>
                <li>
                  <a 
                    v-if="user.role === 'user'"
                    href="#seller"
                    @click.prevent="activeTab = 'seller'"
                    class="block px-3 py-2 rounded-md"
                    :class="activeTab === 'seller' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <i class="fas fa-store mr-2"></i> Đăng ký bán hàng
                  </a>
                </li>
                <li v-if="user.role === 'seller'">
                  <router-link 
                    to="/shop/dashboard"
                    class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-store mr-2"></i> Quản lý cửa hàng
                  </router-link>
                </li>
                <li v-if="user.role === 'admin'">
                  <router-link 
                    to="/admin"
                    class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-cog mr-2"></i> Quản trị hệ thống
                  </router-link>
                </li>
                <li>
                  <a 
                    href="#logout"
                    @click.prevent="logout"
                    class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="md:col-span-3">
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
              
              <form @submit.prevent="updateProfile" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input 
                      v-model="profileData.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      v-model="profileData.email"
                      type="email"
                      disabled
                      class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                      v-model="profileData.phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <input 
                      v-model="profileData.birthdate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <div class="flex space-x-4">
                    <div class="flex items-center">
                      <input 
                        id="gender-male" 
                        v-model="profileData.gender" 
                        type="radio" 
                        value="male"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      >
                      <label for="gender-male" class="ml-2 block text-sm text-gray-700">Nam</label>
                    </div>
                    <div class="flex items-center">
                      <input 
                        id="gender-female" 
                        v-model="profileData.gender" 
                        type="radio" 
                        value="female"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      >
                      <label for="gender-female" class="ml-2 block text-sm text-gray-700">Nữ</label>
                    </div>
                    <div class="flex items-center">
                      <input 
                        id="gender-other" 
                        v-model="profileData.gender" 
                        type="radio" 
                        value="other"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      >
                      <label for="gender-other" class="ml-2 block text-sm text-gray-700">Khác</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button 
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <span v-if="loading" class="mr-2">
                      <div class="loader-sm"></div>
                    </span>
                    <span>Cập nhật thông tin</span>
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Addresses Tab -->
            <div v-else-if="activeTab === 'addresses'">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Sổ địa chỉ</h2>
              
              <div v-if="addresses.length === 0" class="text-center py-8">
                <p class="text-gray-600 mb-4">Bạn chưa có địa chỉ nào.</p>
                <button 
                  @click="showAddAddressForm = true"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <i class="fas fa-plus mr-2"></i> Thêm địa chỉ mới
                </button>
              </div>
              
              <div v-else>
                <div class="mb-4">
                  <button 
                    @click="showAddAddressForm = true"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <i class="fas fa-plus mr-2"></i> Thêm địa chỉ mới
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div 
                    v-for="(address, index) in addresses" 
                    :key="index"
                    class="border border-gray-200 rounded-md p-4"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <h3 class="font-medium text-gray-800">{{ address.fullName }}</h3>
                        <p class="text-gray-600">{{ address.phone }}</p>
                      </div>
                      <div v-if="address.isDefault" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                        Mặc định
                      </div>
                    </div>
                    
                    <p class="text-gray-700">
                      {{ address.addressDetail }}, {{ address.ward }}, {{ address.district }}, {{ address.province }}
                    </p>
                    
                    <div class="mt-3 pt-3 border-t border-gray-200 flex space-x-3">
                      <button 
                        v-if="!address.isDefault"
                        @click="setDefaultAddress(index)"
                        class="text-sm text-green-600 hover:underline"
                      >
                        Đặt làm mặc định
                      </button>
                      <button 
                        @click="editAddress(index)"
                        class="text-sm text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button 
                        @click="deleteAddress(index)"
                        class="text-sm text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Add/Edit Address Form -->
              <div v-if="showAddAddressForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-full max-w-lg">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    {{ editingAddressIndex === null ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ' }}
                  </h3>
                  
                  <form @submit.prevent="saveAddress" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input 
                          v-model="addressForm.fullName"
                          type="text"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input 
                          v-model="addressForm.phone"
                          type="tel"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                        <select 
                          v-model="addressForm.province"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <!-- More options -->
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                        <select 
                          v-model="addressForm.district"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Chọn quận/huyện</option>
                          <!-- Dynamic options based on province -->
                          <option value="Quận 1">Quận 1</option>
                          <option value="Quận 2">Quận 2</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                        <select 
                          v-model="addressForm.ward"
                          required
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Chọn phường/xã</option>
                          <!-- Dynamic options based on district -->
                          <option value="Phường 1">Phường 1</option>
                          <option value="Phường 2">Phường 2</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                      <input 
                        v-model="addressForm.addressDetail"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Số nhà, tên đường, ..."
                      >
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        id="default-address" 
                        v-model="addressForm.isDefault" 
                        type="checkbox"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      >
                      <label for="default-address" class="ml-2 block text-sm text-gray-700">
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>
                    
                    <div class="flex justify-end space-x-3 pt-4">
                      <button 
                        type="button"
                        @click="showAddAddressForm = false"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button 
                        type="submit"
                        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Lưu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <!-- Password Tab -->
            <div v-else-if="activeTab === 'password'">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Đổi mật khẩu</h2>
              
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                  <input 
                    v-model="passwordData.currentPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input 
                    v-model="passwordData.newPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                  <p class="mt-1 text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                  <input 
                    v-model="passwordData.confirmPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                </div>
                
                <div>
                  <button 
                    type="submit"
                    :disabled="loading"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Notifications Tab -->
            <div v-else-if="activeTab === 'notifications'">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Cài đặt thông báo</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between py-2">
                  <div>
                    <h3 class="text-gray-700 font-medium">Thông báo về đơn hàng</h3>
                    <p class="text-gray-500 text-sm">Nhận thông báo khi đơn hàng có cập nhật</p>
                  </div>
                  <div class="relative inline-block w-12 align-middle select-none">
                    <input 
                      id="notification-orders" 
                      v-model="notificationSettings.orders" 
                      type="checkbox"
                      class="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                      :class="notificationSettings.orders ? 'right-0 border-green-500' : 'left-0 border-gray-300'"
                    />
                    <label 
                      for="notification-orders" 
                      class="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer"
                      :class="notificationSettings.orders ? 'bg-green-500' : ''"
                    ></label>
                  </div>
                </div>
                
                <div class="flex items-center justify-between py-2 border-t border-gray-200">
                  <div>
                    <h3 class="text-gray-700 font-medium">Thông báo về khuyến mãi</h3>
                    <p class="text-gray-500 text-sm">Nhận thông báo về các chương trình khuyến mãi</p>
                  </div>
                  <div class="relative inline-block w-12 align-middle select-none">
                    <input 
                      id="notification-promotions" 
                      v-model="notificationSettings.promotions" 
                      type="checkbox"
                      class="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                      :class="notificationSettings.promotions ? 'right-0 border-green-500' : 'left-0 border-gray-300'"
                    />
                    <label 
                      for="notification-promotions" 
                      class="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer"
                      :class="notificationSettings.promotions ? 'bg-green-500' : ''"
                    ></label>
                  </div>
                </div>
                
                <div class="flex items-center justify-between py-2 border-t border-gray-200">
                  <div>
                    <h3 class="text-gray-700 font-medium">Thông báo qua email</h3>
                    <p class="text-gray-500 text-sm">Nhận email thông báo</p>
                  </div>
                  <div class="relative inline-block w-12 align-middle select-none">
                    <input 
                      id="notification-email" 
                      v-model="notificationSettings.email" 
                      type="checkbox"
                      class="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer"
                      :class="notificationSettings.email ? 'right-0 border-green-500' : 'left-0 border-gray-300'"
                    />
                    <label 
                      for="notification-email" 
                      class="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer"
                      :class="notificationSettings.email ? 'bg-green-500' : ''"
                    ></label>
                  </div>
                </div>
                
                <div class="pt-4">
                  <button 
                    @click="saveNotificationSettings"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Seller Registration Tab -->
            <div v-else-if="activeTab === 'seller'">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Đăng ký trở thành người bán hàng</h2>
              
              <p class="text-gray-600 mb-6">
                Bằng cách đăng ký làm người bán hàng, bạn có thể đưa sản phẩm OCOP của mình lên hệ thống và tiếp cận với 
                hàng ngàn khách hàng tiềm năng.
              </p>
              
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-yellow-400"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      Để đăng ký bán hàng, bạn cần chuẩn bị giấy chứng nhận sản phẩm OCOP và các giấy tờ liên quan.
                    </p>
                  </div>
                </div>
              </div>
              
              <router-link 
                to="/shop/create" 
                class="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              >
                Đăng ký ngay
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
    name: 'UserProfile',
    data() {
      return {
        activeTab: 'profile',
        loading: false,
        profileData: {
          name: '',
          email: '',
          phone: '',
          birthdate: '',
          gender: 'male'
        },
        passwordData: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        addresses: [],
        showAddAddressForm: false,
        editingAddressIndex: null,
        addressForm: {
          fullName: '',
          phone: '',
          province: '',
          district: '',
          ward: '',
          addressDetail: '',
          isDefault: false
        },
        notificationSettings: {
          orders: true,
          promotions: true,
          email: true
        }
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/currentUser'
      }),
      userInitials() {
        if (!this.user.name) return '';
        return this.user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
      }
    },
    methods: {
      ...mapActions({
        updateProfile: 'auth/updateProfile',
        logout: 'auth/logout'
      }),
      async updateUserProfile() {
        try {
          this.loading = true;
          await this.updateProfile(this.profileData);
          this.$toast.success('Cập nhật thông tin thành công');
        } catch (error) {
          console.error('Update profile error:', error);
          this.$toast.error('Cập nhật thông tin thất bại');
        } finally {
          this.loading = false;
        }
      },
      async changePassword() {
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
          this.$toast.error('Mật khẩu xác nhận không khớp');
          return;
        }
        
        if (this.passwordData.newPassword.length < 6) {
          this.$toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
          return;
        }
        
        try {
          // Implement change password logic
          this.$toast.success('Đổi mật khẩu thành công');
          
          this.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        } catch (error) {
          console.error('Change password error:', error);
          this.$toast.error('Đổi mật khẩu thất bại');
        }
      },
      editAddress(index) {
        this.editingAddressIndex = index;
        this.addressForm = { ...this.addresses[index] };
        this.showAddAddressForm = true;
      },
      deleteAddress(index) {
        if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
          this.addresses.splice(index, 1);
          this.$toast.success('Xóa địa chỉ thành công');
        }
      },
      setDefaultAddress(index) {
        this.addresses.forEach((address, i) => {
          address.isDefault = i === index;
        });
        this.$toast.success('Đã thiết lập địa chỉ mặc định');
      },
      saveAddress() {
        // If it's a new address and set as default, update other addresses
        if (this.addressForm.isDefault) {
          this.addresses.forEach(address => {
            address.isDefault = false;
          });
        }
        
        if (this.editingAddressIndex !== null) {
          // Update existing address
          this.addresses[this.editingAddressIndex] = { ...this.addressForm };
          this.$toast.success('Cập nhật địa chỉ thành công');
        } else {
          // Add new address
          // If this is the first address, set it as default
          if (this.addresses.length === 0) {
            this.addressForm.isDefault = true;
          }
          this.addresses.push({ ...this.addressForm });
          this.$toast.success('Thêm địa chỉ thành công');
        }
        
        this.showAddAddressForm = false;
        this.editingAddressIndex = null;
        this.resetAddressForm();
      },
      resetAddressForm() {
        this.addressForm = {
          fullName: '',
          phone: '',
          province: '',
          district: '',
          ward: '',
          addressDetail: '',
          isDefault: false
        };
      },
      saveNotificationSettings() {
        // Implement save notification settings logic
        this.$toast.success('Lưu cài đặt thông báo thành công');
      }
    },
    mounted() {
      // Load user data
      if (this.user) {
        this.profileData = {
          name: this.user.name || '',
          email: this.user.email || '',
          phone: this.user.phone || '',
          birthdate: this.user.birthdate || '',
          gender: this.user.gender || 'male'
        };
        
        // Load addresses if available
        if (this.user.addresses && this.user.addresses.length > 0) {
          this.addresses = [...this.user.addresses];
        }
      }
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