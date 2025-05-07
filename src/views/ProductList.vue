<template>
    <div class="product-list container mx-auto my-8 px-4">
      <h1 class="text-3xl font-bold text-green-800 mb-6">Sản phẩm OCOP</h1>
      
      <!-- Bộ lọc sản phẩm -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select 
              v-model="filters.category" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              @change="filterProducts"
            >
              <option value="">Tất cả danh mục</option>
              <option value="food">Thực phẩm</option>
              <option value="drink">Đồ uống</option>
              <option value="handcraft">Thủ công mỹ nghệ</option>
              <option value="herb">Thảo dược</option>
              <option value="textile">Dệt may</option>
            </select>
          </div>
          
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Giá</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model.number="filters.minPrice" 
                type="number" 
                placeholder="Từ"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                @change="filterProducts"
              />
              <span>-</span>
              <input 
                v-model.number="filters.maxPrice" 
                type="number" 
                placeholder="Đến"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                @change="filterProducts"
              />
            </div>
          </div>
          
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
            <select 
              v-model="filters.rating" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              @change="filterProducts"
            >
              <option value="">Tất cả đánh giá</option>
              <option value="4">4★ trở lên</option>
              <option value="3">3★ trở lên</option>
              <option value="2">2★ trở lên</option>
              <option value="1">1★ trở lên</option>
            </select>
          </div>
          
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
            <select 
              v-model="filters.sortBy"
              class="..."
              @change="filterProducts"
            >
              <option value="createdAt">Mới nhất</option>
              <option value="price">Giá (thấp đến cao)</option>
              <option value="-price">Giá (cao đến thấp)</option>
              <option value="rating">Đánh giá (thấp đến cao)</option>
              <option value="-rating">Đánh giá (cao đến thấp)</option>
            </select>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="relative">
            <input 
              v-model="filters.keyword" 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              @input="debouncedSearch"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Kết quả sản phẩm -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="loader"></div>
      </div>
      <div v-else-if="products.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
        <p class="text-gray-600">Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <product-card 
          v-for="product in products" 
          :key="product._id" 
          :product="product"
        />
      </div>
      
      <!-- Phân trang -->
      <div v-if="pagination.pages > 1" class="flex justify-center mt-8">
        <nav class="inline-flex rounded-md shadow">
          <button 
            @click="goToPage(pagination.page - 1)" 
            :disabled="pagination.page === 1"
            class="px-3 py-1 bg-white text-gray-700 rounded-l-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button 
            v-for="pageNumber in pageNumbers" 
            :key="pageNumber"
            @click="goToPage(pageNumber)"
            class="px-3 py-1 border-t border-b border-gray-300"
            :class="pageNumber === pagination.page ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            {{ pageNumber }}
          </button>
          
          <button 
            @click="goToPage(pagination.page + 1)" 
            :disabled="pagination.page === pagination.pages"
            class="px-3 py-1 bg-white text-gray-700 rounded-r-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  import ProductCard from '@/components/products/ProductCard.vue';
  
  export default {
    name: 'ProductList',
    components: {
      ProductCard
    },
    data() {
      return {
        loading: true,
        products: [],
        pagination: {
          page: 1,
          pages: 1,
          count: 0
        },
        filters: {
          keyword: '',
          category: '',
          minPrice: '',
          maxPrice: '',
          rating: '',
          sortBy: 'createdAt',
          pageNumber: 1,
          pageSize: 12
        },
        searchTimeout: null
      };
    },
    computed: {
      pageNumbers() {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (this.pagination.pages <= maxVisiblePages) {
          // Show all pages if total is less than maxVisiblePages
          for (let i = 1; i <= this.pagination.pages; i++) {
            pages.push(i);
          }
        } else {
          // Otherwise show a window of pages around the current page
          let startPage = Math.max(1, this.pagination.page - Math.floor(maxVisiblePages / 2));
          let endPage = Math.min(this.pagination.pages, startPage + maxVisiblePages - 1);
          
          // Adjust if we're near the end
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
        }
        
        return pages;
      }
    },
    methods: {
      ...mapActions({
        searchProducts: 'product/searchProducts',
        addToCart: 'cart/addToCart'
      }),
      async filterProducts() {
        try {
          this.loading = true;
          const results = await this.searchProducts({
            ...this.filters,
            pageNumber: 1 // Reset to first page when filters change
          });
          
          this.products = results.products;
          this.pagination = {
            page: results.page,
            pages: results.pages,
            count: results.count
          };
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          this.loading = false;
        }
      },
      debouncedSearch() {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        
        this.searchTimeout = setTimeout(() => {
          this.filterProducts();
        }, 500);
      },
      // handleAddToCart(item) {
      //   this.addToCart(item)
      //     .then(() => {
      //       // Hiển thị thông báo thành công (nếu bạn có hệ thống toast)
      //       if (this.$toast) {
      //         this.$toast.success('Đã thêm sản phẩm vào giỏ hàng');
      //       }
      //     })
      //     .catch(error => {
      //       console.error('Error adding to cart:', error);
      //       // Hiển thị thông báo lỗi (nếu bạn có hệ thống toast)
      //       if (this.$toast) {
      //         this.$toast.error('Không thể thêm sản phẩm vào giỏ hàng');
      //       }
      //     });
      // },
      async goToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.pagination.pages) {
          return;
        }
        
        try {
          this.loading = true;
          const results = await this.searchProducts({
            ...this.filters,
            pageNumber
          });
          
          this.products = results.products;
          this.pagination = {
            page: results.page,
            pages: results.pages,
            count: results.count
          };
          
          // Scroll to top when changing page
          window.scrollTo(0, 0);
        } catch (error) {
          console.error('Error fetching page:', error);
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      // Parse query params
      const queryParams = new URLSearchParams(window.location.search);
      
      if (queryParams.has('keyword')) {
        this.filters.keyword = queryParams.get('keyword');
      }
      
      if (queryParams.has('category')) {
        this.filters.category = queryParams.get('category');
      }
      
      // Fetch products
      this.filterProducts();
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