<template>
  <div class="home">
    <!-- Banner chính -->
    <main-banner />
    
    <!-- Danh mục sản phẩm -->
    <category-section />
    
    <!-- Sản phẩm nổi bật -->
    <section class="featured-products container mx-auto my-8 px-4">
      <h2 class="text-2xl font-semibold text-green-800 mb-6">Sản phẩm nổi bật</h2>
      <div v-if="loading" class="flex justify-center">
        <div class="loader"></div>
      </div>
      <div v-else-if="featuredProducts.length === 0" class="text-center py-8">
        <p class="text-gray-600">Không có sản phẩm nổi bật nào.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <product-card 
          v-for="product in featuredProducts" 
          :key="product._id" 
          :product="product"
        />
      </div>
    </section>
    
    <!-- Giới thiệu về OCOP -->
    <section class="bg-green-50 py-12 my-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-6 md:mb-0">
            <h2 class="text-3xl font-bold text-green-800 mb-4">OCOP là gì?</h2>
            <p class="text-gray-700 mb-4">
              OCOP (One Commune One Product) là chương trình quốc gia về phát triển kinh tế 
              khu vực nông thôn theo hướng phát triển nội lực và gia tăng giá trị.
            </p>
            <p class="text-gray-700 mb-4">
              Mỗi địa phương sẽ chọn các sản phẩm truyền thống, đặc sản để hỗ trợ, ươm tạo 
              và phát triển theo chuỗi giá trị, từ sản xuất đến tiêu thụ.
            </p>
            <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition">
              Tìm hiểu thêm
            </button>
          </div>
          <div class="md:w-1/2 md:pl-8">
            <div class="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="@/assets/logo.png" 
                alt="OCOP Program" 
                class="w-full h-auto"
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Sản phẩm mới -->
    <section class="new-products container mx-auto my-8 px-4">
      <h2 class="text-2xl font-semibold text-green-800 mb-6">Sản phẩm mới</h2>
      <div v-if="loading" class="flex justify-center">
        <div class="loader"></div>
      </div>
      <div v-else-if="newProducts.length === 0" class="text-center py-8">
        <p class="text-gray-600">Không có sản phẩm mới nào.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <product-card 
          v-for="product in newProducts" 
          :key="product._id" 
          :product="product"
        />
      </div>
    </section>
    
    <!-- Đánh giá từ khách hàng -->
    <testimonials-section />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MainBanner from '@/components/home/MainBanner.vue';
import CategorySection from '@/components/home/CategorySection.vue';
import ProductCard from '@/components/products/ProductCard.vue';
import TestimonialsSection from '@/components/home/TestimonialsSection.vue';

export default {
  name: 'HomeView',
  components: {
    MainBanner,
    CategorySection,
    ProductCard,
    TestimonialsSection
  },
  data() {
    return {
      loading: true,
      featuredProducts: [],
      newProducts: []
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      currentUser: 'auth/currentUser'
    })
  },
  methods: {
    ...mapActions({
      getProductsAction: 'product/getProducts',
      searchProducts: 'product/searchProducts'
    }),
    async fetchProducts() {
      try {
        this.loading = true;
        
        // Lấy sản phẩm nổi bật (giả sử có trường featured hoặc rating cao)
        const featuredResults = await this.searchProducts({
          rating: 4,
          sortBy: 'rating',
          pageSize: 8
        });
        this.featuredProducts = featuredResults.products;
        
        // Lấy sản phẩm mới (sắp xếp theo thời gian tạo)
        const newResults = await this.searchProducts({
          sortBy: 'createdAt',
          pageSize: 8
        });
        this.newProducts = newResults.products;
        
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchProducts();
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