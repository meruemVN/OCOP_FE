<template>
    <div class="relative">
      <form @submit.prevent="search">
        <div class="flex">
          <div class="relative flex-grow">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm sản phẩm OCOP..." 
              class="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              type="button"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button 
            type="submit" 
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </form>
      
      <div v-if="showSuggestions && suggestions.length > 0" class="absolute z-10 bg-white w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <ul>
          <li 
            v-for="suggestion in suggestions" 
            :key="suggestion.id" 
            @click="selectSuggestion(suggestion)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          >
            <img v-if="suggestion.image" :src="suggestion.image" class="w-10 h-10 object-cover mr-2" />
            <div>
              <div class="text-gray-800">{{ suggestion.name }}</div>
              <div class="text-gray-500 text-sm">{{ suggestion.price | formatPrice }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import debounce from 'lodash/debounce';
  
  export default {
    name: 'SearchBar',
    
    setup() {
      const router = useRouter();
      const searchQuery = ref('');
      const suggestions = ref([]);
      const showSuggestions = ref(false);
      
      // Fetch suggestions when searchQuery changes
      const fetchSuggestions = debounce(async (query) => {
        if (!query || query.length < 2) {
          suggestions.value = [];
          return;
        }
        
        try {
          // Replace with your actual API call
          // const response = await api.get(`/products/search?q=${query}&limit=5`);
          // suggestions.value = response.data;
          
          // Mock data for now
          suggestions.value = [
            { id: 1, name: 'Mật ong rừng U Minh', price: 250000, image: '/img/products/honey.jpg' },
            { id: 2, name: 'Trà hoa cúc mật ong', price: 120000, image: '/img/products/tea.jpg' },
            { id: 3, name: 'Mật ong sữa chúa', price: 350000, image: '/img/products/royal-honey.jpg' },
          ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
          
          showSuggestions.value = true;
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      }, 300);
      
      watch(searchQuery, (newValue) => {
        fetchSuggestions(newValue);
      });
      
      const search = () => {
        if (searchQuery.value.trim()) {
          router.push({ path: '/products', query: { search: searchQuery.value } });
          showSuggestions.value = false;
        }
      };
      
      const selectSuggestion = (suggestion) => {
        router.push({ path: `/product/${suggestion.id}` });
        searchQuery.value = '';
        showSuggestions.value = false;
      };
      
      const clearSearch = () => {
        searchQuery.value = '';
        showSuggestions.value = false;
      };
      
      // Close suggestions when clicking outside
      const handleClickOutside = (event) => {
        if (!event.target.closest('.search-container')) {
          showSuggestions.value = false;
        }
      };
      
      // Lifecycle hooks
      onMounted(() => {
        document.addEventListener('click', handleClickOutside);
      });
      
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
      });
      
      return {
        searchQuery,
        suggestions,
        showSuggestions,
        search,
        selectSuggestion,
        clearSearch
      };
    }
  }
  </script>