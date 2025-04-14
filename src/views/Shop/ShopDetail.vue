<template>
    <div class="shop-detail container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center">
        <div class="loader"></div>
      </div>
      
      <div v-else-if="!shop" class="text-center py-12">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Cửa hàng không tồn tại</h2>
        <router-link to="/" class="text-green-600 hover:text-green-800">
          Quay lại trang chủ
        </router-link>
      </div>
      
      <div v-else>
        <!-- Shop Header -->
        <div class="shop-header bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="flex flex-col md:flex-row items-start">
            <div class="shop-logo mr-6 mb-4 md:mb-0">
              <img 
                :src="shop.logo || require('@/assets/default-shop.png')" 
                :alt="shop.name" 
                class="w-24 h-24 object-cover rounded-lg border border-gray-200"
              >
            </div>
            <div class="shop-info flex-1">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ shop.name }}</h1>
              <div class="shop-meta flex items-center text-sm text-gray-600 mb-3">
                <span class="mr-4">
                  <i class="fas fa-map-marker-alt mr-1"></i> {{ shop.location }}
                </span>
                <span>
                  <i class="fas fa-store mr-1"></i> Tham gia từ {{ formatDate(shop.createdAt) }}
                </span>
              </div>
              <p class="text-gray-700 mb-4">{{ shop.description }}</p>
              <div class="shop-contact flex items-center">
                <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mr-4 transition">
                  <i class="fas fa-phone-alt mr-1"></i> Liên hệ
                </button>
                <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition">
                  <i class="fas fa-heart mr-1"></i> Theo dõi
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Shop Products -->
        <div class="shop-products">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-green-800">Sản phẩm của cửa hàng</h2>
            <div class="flex items-center">
              <label for="sort" class="mr-2 text-gray-600">Sắp xếp:</label>
              <select 
                id="sort" 
                v-model="sortOption"
                class="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>
          
          <div v-if="shopProducts.length === 0" class="text-center py-8">
            <p class="text-gray-600">Cửa hàng chưa có sản phẩm nào.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <product-card 
              v-for="product in shopProducts" 
              :key="product._id" 
              :product="product"
            />
          </div>
          
          <div v-if="hasMoreProducts" class="text-center mt-8">
            <button 
              @click="loadMoreProducts"
              class="bg-white border border-green-600 text-green-600 hover:bg-green-50 py-2 px-6 rounded-lg transition"
              :disabled="productsLoading"
            >
              <span v-if="productsLoading">Đang tải...</span>
              <span v-else>Xem thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  import ProductCard from '@/components/products/ProductCard.vue';
  
  export default {
    name: 'ShopDetail',
    components: {
      ProductCard
    },
    data() {
      return {
        loading: true,
        shop: null,
        shopProducts: [],
        productsLoading: false,
        currentPage: 1,
        hasMoreProducts: true,
        sortOption: 'newest'
      };
    },
    computed: {
      shopId() {
        return this.$route.params.id;
      }
    },
    watch: {
      sortOption() {
        this.resetProducts();
        this.fetchShopProducts();
      },
      shopId() {
        this.fetchShopDetail();
        this.resetProducts();
        this.fetchShopProducts();
      }
    },
    methods: {
      ...mapActions({
        searchProducts: 'product/searchProducts',
        getShopDetail: 'shop/getShopDetail'
      }),
      
      async fetchShopDetail() {
        try {
          this.loading = true;
          const data = await this.getShopDetail(this.shopId);
          this.shop = data.shop;
        } catch (error) {
          console.error('Error fetching shop details:', error);
        } finally {
          this.loading = false;
        }
      },
      
      async fetchShopProducts() {
        try {
          this.productsLoading = true;
          
          let sortCriteria = {};
          switch (this.sortOption) {
            case 'priceAsc':
              sortCriteria = { sortBy: 'price', sortOrder: 'asc' };
              break;
            case 'priceDesc':
              sortCriteria = { sortBy: 'price', sortOrder: 'desc' };
              break;
            case 'rating':
              sortCriteria = { sortBy: 'rating', sortOrder: 'desc' };
              break;
            default:
              sortCriteria = { sortBy: 'createdAt', sortOrder: 'desc' };
          }
          
          const results = await this.searchProducts({
            shopId: this.shopId,
            page: this.currentPage,
            pageSize: 8,
            ...sortCriteria
          });
          
          if (this.currentPage === 1) {
            this.shopProducts = results.products;
          } else {
            this.shopProducts = [...this.shopProducts, ...results.products];
          }
          
          this.hasMoreProducts = results.products.length === 8;
        } catch (error) {
          console.error('Error fetching shop products:', error);
        } finally {
          this.productsLoading = false;
        }
      },
      
      resetProducts() {
        this.shopProducts = [];
        this.currentPage = 1;
        this.hasMoreProducts = true;
      },
      
      loadMoreProducts() {
        this.currentPage += 1;
        this.fetchShopProducts();
      },
      
      formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);
      }
    },
    mounted() {
      this.fetchShopDetail();
      this.fetchShopProducts();
    }
  }
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