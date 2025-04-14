<template>
    <header class="bg-white shadow-sm">
      <!-- Top bar -->
      <div class="bg-green-800 text-white py-2">
        <div class="container mx-auto px-4 flex justify-between items-center">
          <div class="text-sm">
            <span class="mr-4">
              <i class="fas fa-phone-alt mr-1"></i> Hotline: 1900 1234
            </span>
            <span>
              <i class="fas fa-envelope mr-1"></i> Email: ocop@example.com
            </span>
          </div>
          <div>
            <a href="#" class="text-white hover:text-green-200 text-sm mr-3">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" class="text-white hover:text-green-200 text-sm mr-3">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="text-white hover:text-green-200 text-sm">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Main navbar -->
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <img src="@/assets/logo.png" alt="OCOP Marketplace" class="h-10 mr-3">
            <span class="text-green-800 font-bold text-xl">OCOP Marketplace</span>
          </router-link>
          
          <!-- Search bar -->
          <div class="hidden md:block flex-grow mx-10">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm OCOP..." 
                class="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Navigation -->
          <nav class="flex items-center">
            <!-- Mobile menu button -->
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden mr-2 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <!-- Desktop nav items -->
            <div class="hidden md:flex items-center">
              <router-link to="/" class="text-gray-700 hover:text-green-600 px-3 py-2">Trang chủ</router-link>
              <router-link to="/products" class="text-gray-700 hover:text-green-600 px-3 py-2">Sản phẩm</router-link>
              <router-link to="/about-ocop" class="text-gray-700 hover:text-green-600 px-3 py-2">Về OCOP</router-link>
              <router-link to="/sellers" class="text-gray-700 hover:text-green-600 px-3 py-2">Nhà cung cấp</router-link>
              
              <!-- Cart -->
              <div class="relative ml-3">
                <router-link to="/cart" class="flex items-center text-gray-700 hover:text-green-600 px-2 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span v-if="cartItemCount > 0" 
                        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {{ cartItemCount }}
                  </span>
                </router-link>
              </div>
              
              <!-- User menu -->
              <div class="relative ml-2">
                <div v-if="isLoggedIn">
                  <button @click="isUserMenuOpen = !isUserMenuOpen" class="flex items-center text-gray-700 hover:text-green-600 px-3 py-2">
                    <span class="mr-1">{{ currentUser.name }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <!-- Dropdown menu -->
                  <div v-if="isUserMenuOpen" 
                       class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Thông tin tài khoản
                    </router-link>
                    <router-link to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Đơn hàng của tôi
                    </router-link>
                    <div v-if="isSeller || isAdmin">
                      <hr class="my-1">
                      <router-link to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Quản lý cửa hàng
                      </router-link>
                    </div>
                    <hr class="my-1">
                    <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Đăng xuất
                    </button>
                  </div>
                </div>
                
                <div v-else class="flex items-center">
                  <router-link to="/login" class="text-gray-700 hover:text-green-600 px-3 py-2">Đăng nhập</router-link>
                  <router-link to="/register" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg ml-2">Đăng ký</router-link>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        <!-- Mobile search bar -->
        <div class="md:hidden mt-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm OCOP..." 
              class="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div class="flex flex-col mt-2">
            <router-link to="/" class="text-gray-700 hover:text-green-600 py-2">Trang chủ</router-link>
            <router-link to="/products" class="text-gray-700 hover:text-green-600 py-2">Sản phẩm</router-link>
            <router-link to="/about-ocop" class="text-gray-700 hover:text-green-600 py-2">Về OCOP</router-link>
            <router-link to="/sellers" class="text-gray-700 hover:text-green-600 py-2">Nhà cung cấp</router-link>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'Navbar',
    data() {
      return {
        searchKeyword: '',
        isMobileMenuOpen: false,
        isUserMenuOpen: false
      }
    },
    computed: {
      ...mapGetters({
        isLoggedIn: 'auth/isLoggedIn',
        currentUser: 'auth/currentUser',
        isAdmin: 'auth/isAdmin',
        isSeller: 'auth/isSeller',
        cartItemCount: 'cart/cartItemCount'
      })
    },
    methods: {
      ...mapActions({
        logoutAction: 'auth/logout'
      }),
      handleSearch() {
        if (this.searchKeyword.trim()) {
          this.$router.push({ 
            name: 'ProductList', 
            query: { keyword: this.searchKeyword.trim() } 
          });
        }
      },
      logout() {
        this.logoutAction();
        this.isUserMenuOpen = false;
        this.$router.push('/');
      }
    },
    created() {
      // Close user menu when clicking outside
      const handleClickOutside = (event) => {
        if (this.isUserMenuOpen && !event.target.closest('.user-menu')) {
          this.isUserMenuOpen = false;
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('click', handleClickOutside);
      });
    }
  }
  </script>