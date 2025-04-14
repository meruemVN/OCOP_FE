<template>
    <div class="relative">
      <button @click="toggleMenu" class="flex items-center space-x-2 focus:outline-none">
        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          <span v-if="!user.avatar">{{ userInitials }}</span>
          <img v-else :src="user.avatar" class="w-full h-full rounded-full object-cover" />
        </div>
        <span class="hidden md:inline">{{ user.fullName || user.email }}</span>
        <i class="fas fa-chevron-down text-xs"></i>
      </button>
      
      <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
        <router-link to="/profile" class="block px-4 py-2 text-gray-800 hover:bg-green-100">
          <i class="fas fa-user mr-2"></i> Tài khoản
        </router-link>
        
        <router-link to="/orders" class="block px-4 py-2 text-gray-800 hover:bg-green-100">
          <i class="fas fa-clipboard-list mr-2"></i> Đơn hàng
        </router-link>
        
        <!-- Admin links -->
        <template v-if="isAdmin">
          <div class="border-t border-gray-200 my-1"></div>
          <router-link to="/admin" class="block px-4 py-2 text-gray-800 hover:bg-green-100">
            <i class="fas fa-cog mr-2"></i> Quản trị
          </router-link>
        </template>
        
        <!-- Seller links -->
        <template v-if="isSeller">
          <div class="border-t border-gray-200 my-1"></div>
          <router-link :to="`/shop/${user.shopId}`" class="block px-4 py-2 text-gray-800 hover:bg-green-100">
            <i class="fas fa-store mr-2"></i> Cửa hàng
          </router-link>
        </template>
        
        <!-- Distributor links -->
        <template v-if="isDistributor">
          <div class="border-t border-gray-200 my-1"></div>
          <router-link to="/distributor/dashboard" class="block px-4 py-2 text-gray-800 hover:bg-green-100">
            <i class="fas fa-chart-line mr-2"></i> Nhà phân phối
          </router-link>
        </template>
        
        <div class="border-t border-gray-200 my-1"></div>
        <button @click="logout" class="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100">
          <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'UserDropdown',
    
    setup() {
      const store = useStore();
      const isMenuOpen = ref(false);
      
      const user = computed(() => store.getters['auth/currentUser'] || {});
      const isAdmin = computed(() => store.getters['auth/isAdmin']);
      const isSeller = computed(() => store.getters['auth/isSeller']);
      const isDistributor = computed(() => store.getters['auth/isDistributor']);
      
      const userInitials = computed(() => {
        if (user.value.fullName) {
          return user.value.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }
        return user.value.email ? user.value.email[0].toUpperCase() : '?';
      });
      
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
      };
      
      const logout = () => {
        store.dispatch('auth/logout');
        isMenuOpen.value = false;
        // Redirect to home or login page
        window.location.href = '/';
      };
      
      return {
        user,
        isAdmin,
        isSeller,
        isDistributor,
        userInitials,
        isMenuOpen,
        toggleMenu,
        logout
      };
    }
  }
  </script>