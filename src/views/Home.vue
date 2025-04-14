<template>
  <div class="home">
    <main-banner />

    <category-section class="my-5" />

    <section class="featured-products container my-5">
      <h2 class="mb-4 fw-bold text-success">Sản phẩm nổi bật</h2>
      <div v-if="loading" class="d-flex justify-content-center py-5">
        <div class="loader"></div>
      </div>
      <div v-else-if="featuredProducts.length === 0" class="text-center py-5">
        <p class="text-muted">Không có sản phẩm nổi bật nào.</p>
      </div>
      <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <div class="col" v-for="product in featuredProducts" :key="product._id">
          <product-card :product="product" />
        </div>
      </div>
    </section>

    <section class="bg-light py-5 my-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 mb-4 mb-md-0">
            <h2 class="fw-bold text-success mb-3">OCOP là gì?</h2>
            <p class="text-dark mb-3">
              OCOP (One Commune One Product) là chương trình quốc gia về phát triển kinh tế
              khu vực nông thôn theo hướng phát triển nội lực và gia tăng giá trị.
            </p>
            <p class="text-dark mb-4">
              Mỗi địa phương sẽ chọn các sản phẩm truyền thống, đặc sản để hỗ trợ, ươm tạo
              và phát triển theo chuỗi giá trị, từ sản xuất đến tiêu thụ.
            </p>
            <button class="btn btn-success py-2 px-4">
              Tìm hiểu thêm
            </button>
          </div>
          <div class="col-md-6 ps-md-4">
            <div class="rounded shadow-lg overflow-hidden">
              <img
                src="@/assets/logo.png"
                alt="OCOP Program"
                class="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="new-products container my-5">
       <h2 class="mb-4 fw-bold text-success">Sản phẩm mới</h2>
       <div v-if="loading" class="d-flex justify-content-center py-5">
         <div class="loader"></div>
       </div>
       <div v-else-if="newProducts.length === 0" class="text-center py-5">
         <p class="text-muted">Không có sản phẩm mới nào.</p>
       </div>
       <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
         <div class="col" v-for="product in newProducts" :key="product._id">
           <product-card :product="product" />
         </div>
       </div>
    </section>

    <testimonials-section class="my-5" />

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
      searchProducts: 'product/searchProducts'
    }),
    async fetchProducts() {
            console.log('HomeView: fetchProducts() method called.');
            try {
                 console.log('HomeView: Calling this.searchProducts...'); // Add this log
                 const featuredResults = await this.searchProducts({ // <-- Calling the mapped action
                     isFeatured: true,
                     sortBy: 'rating',
                     sortOrder: 'desc',
                     pageSize: 8
                 });
                 console.log('HomeView: featuredResults received (or not)'); // Add this log

                 const newResults = await this.searchProducts({ // <-- Calling it again
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                    pageSize: 8
                 });
                 console.log('HomeView: newResults received (or not)'); // Add this log

                 this.featuredProducts = featuredResults?.products || [];
                 this.newProducts = newResults?.products || [];

            } catch (error) {
                 console.error('HomeView: Error in fetchProducts:', error);
            } finally {
                this.loading = false; // This might be set too early if using root loader
            }
        }
  },
  mounted() {
    console.log('HomeView: mounted() hook executed.'); // <-- ADD THIS
    this.fetchProducts();
  }
}
</script>

<style scoped>
.loader {
  border: 4px solid #dee2e6;
  border-radius: 50%;
  border-top: 4px solid #198754;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>