<template>
    <header class="bg-green-700 text-white shadow">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="font-bold text-xl flex items-center">
            <img src="@/assets/logo.svg" alt="OCOP Market" class="h-8 mr-2" />
            <span>OCOP Market</span>
          </router-link>
        </div>
        
        <div class="hidden md:block flex-grow mx-8">
          <SearchBar />
        </div>
        
        <div class="flex items-center space-x-4">
          <router-link to="/cart" class="relative">
            <i class="fas fa-shopping-cart text-xl"></i>
            <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {{ cartCount }}
            </span>
          </router-link>
          
          <div v-if="isLoggedIn">
            <UserDropdown />
          </div>
          <div v-else>
            <router-link to="/login" class="text-white hover:text-green-200">Đăng nhập</router-link>
          </div>
        </div>
      </div>
      
      <nav class="bg-green-800 text-white">
        <div class="container mx-auto px-4">
          <ul class="flex flex-wrap">
            <li v-for="category in categories" :key="category.id" class="py-2 px-4 hover:bg-green-600">
              <router-link :to="`/products?category=${category.slug}`">{{ category.name }}</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  </template>
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import SearchBar from '@/components/SearchBar.vue';
  import UserDropdown from '@/components/UserDropdown.vue';
  
  export default {
    name: 'Header',
    components: {
      SearchBar,
      UserDropdown
    },
    
    setup() {
      const store = useStore();
      
      const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
      const cartCount = computed(() => store.getters['cart/cartItemCount'] || 0);
      
      // Mock categories data (this would typically come from an API)
      const categories = [
        { id: 1, name: 'Thực phẩm', slug: 'thuc-pham' },
        { id: 2, name: 'Đồ uống', slug: 'do-uong' },
        { id: 3, name: 'Thủ công mỹ nghệ', slug: 'thu-cong-my-nghe' },
        { id: 4, name: 'Dược liệu', slug: 'duoc-lieu' },
        { id: 5, name: 'Vải & May mặc', slug: 'vai-may-mac' }
      ];
      
      return {
        isLoggedIn,
        cartCount,
        categories
      };
    }
  }
  </script>