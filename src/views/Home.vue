<template>
  <div class="home-page container-fluid py-5">
    <div class="row">
      <!-- Sidebar tỉnh thành -->
      <nav class="col-12 col-md-3 mb-4 mb-md-0">
        <div class="province-menu card shadow-sm">
          <div class="card-header bg-success text-white fw-bold text-center">
            Chọn Tỉnh/Thành phố
          </div>
          <ul class="list-group list-group-flush province-list">
            <li
              v-for="province in provinces"
              :key="province"
              :class="['list-group-item', { active: selectedProvince === province }]"
              @click="selectProvince(province)"
              style="cursor:pointer"
            >
              {{ province }}
            </li>
          </ul>
        </div>
      </nav>

      <!-- Danh sách sản phẩm -->
      <main class="col-12 col-md-9">
        <h2 class="mb-4 fw-bold text-success text-center">Sản phẩm</h2>
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="loader"></div>
        </div>
        <div v-else-if="products.length === 0" class="text-center py-5">
          <p class="text-muted">Không có sản phẩm nào.</p>
        </div>
        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
          <div class="col" v-for="product in products" :key="product._id">
            <product-card :product="product" @add-to-cart="handleAddToCart" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ProductCard from '@/components/products/ProductCard.vue';

const PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
  "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
  "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội",
  "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn",
  "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận",
  "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh",
  "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh",
  "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export default {
  name: 'HomeView',
  components: {
    ProductCard
  },
  data() {
    return {
      loading: true,
      products: [],
      provinces: PROVINCES,
      selectedProvince: null
    }
  },
  methods: {
    ...mapActions({
      searchProducts: 'product/searchProducts',
      addToCart: 'cart/addToCart'
    }),
    async fetchProducts() {
      this.loading = true;
      try {
        const params = {};
        if (this.selectedProvince) {
          params.province = this.selectedProvince;
        }
        const result = await this.searchProducts(params);
        this.products = result?.products || [];
      } catch (error) {
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    selectProvince(province) {
      this.selectedProvince = province;
      this.fetchProducts();
    },
    
    async handleAddToCart({ productId, quantity }) {
      try {
          await this.addToCart({ productId, quantity });
          if (this.$toast) {
              this.$toast.success('Đã thêm vào giỏ hàng!');
          } else {
              alert('Đã thêm vào giỏ hàng!');
          }
      } catch (err) {
          if (this.$toast) {
              this.$toast.error('Không thể thêm vào giỏ hàng');
          } else {
              alert('Không thể thêm vào giỏ hàng');
          }
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
}
</script>

<style scoped>
.home-page {
  background: #f8fafc;
  min-height: 100vh;
}
.province-menu {
  max-height: 80vh;
  overflow-y: auto;
}
.province-list {
  padding: 0;
  margin: 0;
}
.province-list .list-group-item {
  border: none;
  transition: background 0.2s, color 0.2s;
  font-size: 1rem;
}
.province-list .list-group-item.active,
.province-list .list-group-item:hover {
  background: #097969;
  color: #fff;
}
.loader {
  border: 4px solid #dee2e6;
  border-radius: 50%;
  border-top: 4px solid #198754;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
@media (max-width: 768px) {
  .province-menu {
    margin-bottom: 24px;
    max-height: 30vh;
  }
}
</style>