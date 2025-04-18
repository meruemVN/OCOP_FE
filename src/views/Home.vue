<template>
  <div class="home-page container-fluid py-4 px-md-4">
    <div class="row g-4">

      <!-- Sidebar Bộ lọc -->
      <nav class="col-12 col-lg-3">
        <div class="filter-sidebar card shadow-sm border-light sticky-lg-top" style="top: 20px;">
          <!-- Bộ lọc Danh mục (Ví dụ) -->
          <div class="card-header bg-light fw-bold">
            <i class="fas fa-tags me-1 text-success"></i> Danh mục
          </div>
          <ul class="list-group list-group-flush category-list">
            <li
              class="list-group-item list-group-item-action small py-2"
              :class="{ 'active text-white bg-success border-success': !selectedCategory }"
              @click="selectCategory(null)"
              style="cursor:pointer"
            >
              Tất cả sản phẩm
            </li>
             <li
              v-for="category in categories"
              :key="category"
              class="list-group-item list-group-item-action small py-2"
              :class="{ 'active text-white bg-success border-success': selectedCategory === category }"
              @click="selectCategory(category)"
              style="cursor:pointer"
            >
              {{ category }}
            </li>
             {/* Thêm Xem thêm nếu danh mục nhiều */}
          </ul>

          <!-- Bộ lọc Nơi bán (Tỉnh/Thành) -->
          <div class="card-header bg-light fw-bold border-top">
            <i class="fas fa-map-marker-alt me-1 text-success"></i> Nơi bán
          </div>
          <ul class="list-group list-group-flush province-list">
             <li
              class="list-group-item list-group-item-action small py-2"
              :class="{ 'active text-white bg-success border-success': !selectedProvince }"
              @click="selectProvince(null)"
              style="cursor:pointer"
            >
              Toàn quốc
            </li>
            <li
              v-for="province in displayedProvinces"
              :key="province"
              class="list-group-item list-group-item-action small py-2"
              :class="{ 'active text-white bg-success border-success': selectedProvince === province }"
              @click="selectProvince(province)"
              style="cursor:pointer"
            >
              {{ province }}
            </li>
             <li v-if="provinces.length > initialProvinceCount" class="list-group-item text-center py-2">
                 <button class="btn btn-link btn-sm text-decoration-none p-0" @click="showAllProvinces = !showAllProvinces">
                    {{ showAllProvinces ? 'Thu gọn' : 'Xem thêm' }}
                    <i class="fas" :class="showAllProvinces ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                 </button>
             </li>
          </ul>

           <!-- Bộ lọc Khoảng giá -->
           <div class="card-header bg-light fw-bold border-top">
             <i class="fas fa-dollar-sign me-1 text-success"></i> Chọn khoảng giá
          </div>
           <div class="p-3">
              <div class="d-flex align-items-center mb-2">
                <input type="number" class="form-control form-control-sm" placeholder="Từ" v-model.number="filterPrice.min" min="0">
                <span class="mx-2">-</span>
                <input type="number" class="form-control form-control-sm" placeholder="Đến" v-model.number="filterPrice.max" min="0">
             </div>
             <button class="btn btn-sm btn-outline-success w-100" @click="applyPriceFilter">Áp dụng</button>
             <button v-if="filterPrice.min || filterPrice.max" class="btn btn-sm btn-link text-danger w-100 mt-1 p-0" @click="resetPriceFilter">
                 Đặt lại giá
             </button>
           </div>

           <div class="card-footer bg-light text-center">
               <button class="btn btn-sm btn-secondary" @click="resetAllFilters">
                   <i class="fas fa-sync-alt me-1"></i> Đặt lại bộ lọc
               </button>
           </div>

        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="col-12 col-lg-9">

        <!-- Gợi ý cho bạn Section -->
        <section class="mb-5 suggested-section">
          <h3 class="mb-3 fw-bold text-success">
             <i class="fas fa-lightbulb me-2 text-warning"></i>Gợi ý cho bạn
          </h3>
           <div v-if="loadingSuggested" class="text-center py-4">
               <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
           </div>
          <div v-else-if="suggestedProducts.length === 0" class="text-center py-4 text-muted">
               Không có gợi ý nào.
          </div>
          <div v-else class="row flex-nowrap overflow-auto pb-3 gx-3">
            <div v-for="product in suggestedProducts" :key="'suggested-'+product._id" class="col-8 col-sm-6 col-md-4 col-lg-3">
              <product-card :product="product" @add-to-cart="handleAddToCart" />
            </div>
          </div>
        </section>

        <!-- Danh sách sản phẩm chính -->
        <section>
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                <h3 class="mb-2 mb-sm-0 fw-bold text-success">
                    <i class="fas fa-leaf me-2"></i>Sản phẩm {{ selectedProvince ? `tại ${selectedProvince}` : 'Toàn quốc' }}
                </h3>
                <div class="btn-group btn-group-sm sort-options" role="group" aria-label="Sắp xếp sản phẩm">
                    <button type="button" class="btn" :class="sortBy === 'popular' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('popular')">Phổ biến</button>
                    <button type="button" class="btn" :class="sortBy === 'newest' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('newest')">Hàng mới</button>
                    <button type="button" class="btn" :class="sortBy === 'priceAsc' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('priceAsc')">Giá tăng dần</button>
                    <button type="button" class="btn" :class="sortBy === 'priceDesc' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('priceDesc')">Giá giảm dần</button>
                </div>
           </div>


           <div v-if="loading" class="d-flex justify-content-center align-items-center py-5" style="min-height: 40vh;">
             <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
           </div>
            <div v-else-if="products.length === 0" class="text-center py-5 card border-light shadow-sm">
               <div class="card-body">
                   <i class="fas fa-search fa-3x text-light mb-3"></i>
                   <p class="text-muted">Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.</p>
               </div>
            </div>
            <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-4">
                <div class="col" v-for="product in products" :key="product._id">
                    <product-card :product="product" @add-to-cart="handleAddToCart" />
                </div>
            </div>

             <nav v-if="pagination.pages > 1 && !loading" aria-label="Product pagination" class="d-flex justify-content-center mt-5">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(pagination.page - 1)">«</a>
                    </li>
                    <li class="page-item" v-for="p in pageNumbers" :key="p" :class="{ active: pagination.page === p, disabled: p === '...' }">
                        <a v-if="p !== '...'" class="page-link" href="#" @click.prevent="changePage(p)">{{ p }}</a>
                        <span v-else class="page-link">...</span>
                    </li>
                    <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
                        <a class="page-link" href="#" @click.prevent="changePage(pagination.page + 1)">»</a>
                    </li>
                </ul>
             </nav>

        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import ProductCard from '@/components/products/ProductCard.vue'; // Đảm bảo đường dẫn đúng
// Import icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf, faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf, faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch);

const store = useStore();
const toast = useToast();

// --- Constants & State ---
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
const CATEGORIES = ["Nông sản khô", "Thực phẩm chế biến", "Đồ uống", "Thảo dược", "Thủ công mỹ nghệ", "Khác"]; // Ví dụ

const loading = ref(true);
const loadingSuggested = ref(true);
const products = ref([]);
const suggestedProducts = ref([]); // Danh sách sản phẩm gợi ý
const provinces = ref(PROVINCES);
const categories = ref(CATEGORIES); // Danh sách danh mục
const selectedProvince = ref(null);
const selectedCategory = ref(null); // State cho danh mục đã chọn
const filterPrice = ref({ min: null, max: null });
const sortBy = ref('popular'); // Mặc định sắp xếp theo phổ biến
const pagination = ref({ page: 1, pages: 1, count: 0 });

const initialProvinceCount = 10; // Số tỉnh hiển thị ban đầu
const showAllProvinces = ref(false);

// --- Computed Properties ---
const displayedProvinces = computed(() => {
  return showAllProvinces.value ? provinces.value : provinces.value.slice(0, initialProvinceCount);
});

// Tính toán các số trang hiển thị cho pagination
const pageNumbers = computed(() => {
    const currentPage = pagination.value.page;
    const totalPages = pagination.value.pages;
    const delta = 2; // Số trang hiển thị mỗi bên của trang hiện tại
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1); // Luôn hiển thị trang 1

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i >= 2 && i < totalPages) {
            range.push(i);
        }
    }
    range.push(totalPages); // Luôn hiển thị trang cuối

    range.forEach((i) => {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1); // Thêm số trang ở giữa nếu chỉ cách 1
            } else if (i - l !== 1) {
                rangeWithDots.push('...'); // Thêm dấu '...' nếu cách xa
            }
        }
        rangeWithDots.push(i);
        l = i;
    });

    return rangeWithDots;
});


// --- Methods ---
const fetchProducts = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      pageNumber: page,
      // pageSize: 12 // Có thể thêm pageSize nếu backend hỗ trợ
    };
    if (selectedProvince.value) params.province = selectedProvince.value;
    if (selectedCategory.value) params.category = selectedCategory.value; // Thêm category
    if (filterPrice.value.min) params.minPrice = filterPrice.value.min;
    if (filterPrice.value.max) params.maxPrice = filterPrice.value.max;
    if (sortBy.value) params.sortBy = sortBy.value; // Thêm sắp xếp

    // Gọi action searchProducts (đã bao gồm các filter)
    const result = await store.dispatch('product/searchProducts', params);

    products.value = result?.products || [];
    pagination.value = {
      page: result?.page || 1,
      pages: result?.pages || 1,
      count: result?.count || 0
    };

  } catch (error) {
    console.error("HomeView: Lỗi fetchProducts:", error);
    products.value = []; // Reset khi lỗi
    pagination.value = { page: 1, pages: 1, count: 0 };
    // Không cần toast ở đây nếu action đã xử lý
  } finally {
    loading.value = false;
  }
};

const fetchSuggestedProducts = async () => {
    loadingSuggested.value = true;
    try {
        // Gọi API hoặc action riêng để lấy sản phẩm gợi ý
        // Ví dụ: Lấy các sản phẩm bán chạy nhất hoặc mới nhất
        const result = await store.dispatch('product/searchProducts', { sortBy: 'popular', pageSize: 8 }); // Ví dụ lấy 8 sp phổ biến
        suggestedProducts.value = result?.products || [];
    } catch (error) {
        console.error("HomeView: Lỗi fetchSuggestedProducts:", error);
        suggestedProducts.value = [];
    } finally {
        loadingSuggested.value = false;
    }
}

const selectProvince = (province) => {
  if (selectedProvince.value === province) return; // Không làm gì nếu chọn lại tỉnh cũ
  selectedProvince.value = province;
  fetchProducts(1); // Luôn fetch lại từ trang 1 khi đổi bộ lọc
};

const selectCategory = (category) => {
    if (selectedCategory.value === category) return;
    selectedCategory.value = category;
    fetchProducts(1);
}

const applyPriceFilter = () => {
    fetchProducts(1);
}

const resetPriceFilter = () => {
    if (filterPrice.value.min || filterPrice.value.max) {
        filterPrice.value = { min: null, max: null };
        fetchProducts(1);
    }
}

const resetAllFilters = () => {
    selectedProvince.value = null;
    selectedCategory.value = null;
    filterPrice.value = { min: null, max: null };
    sortBy.value = 'popular'; // Reset về sắp xếp mặc định
    fetchProducts(1);
}

const changeSort = (sortKey) => {
    if (sortBy.value === sortKey) return;
    sortBy.value = sortKey;
    fetchProducts(1); // Fetch lại từ trang 1 với cách sắp xếp mới
}

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.pages && page !== pagination.value.page) {
        fetchProducts(page);
         // Cuộn lên đầu danh sách sản phẩm khi chuyển trang
         // Cần có ref hoặc selector cho khu vực sản phẩm
         // document.getElementById('productListSection')?.scrollIntoView({ behavior: 'smooth' });
    }
};


const handleAddToCart = async ({ productId, quantity }) => {
  try {
      await store.dispatch('cart/addToCart', { productId, quantity });
      toast.success('Đã thêm vào giỏ hàng!');
  } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
  fetchProducts(); // Tải sản phẩm chính
  fetchSuggestedProducts(); // Tải sản phẩm gợi ý
});

// Watch for changes in selected province to refetch (alternative to method call)
// watch(selectedProvince, () => fetchProducts(1));
// watch(selectedCategory, () => fetchProducts(1));
// watch(sortBy, () => fetchProducts(1));

</script>

<style scoped>
.home-page {
  background: #f8f9fa; /* Màu nền sáng hơn */
}
.filter-sidebar .card {
    border-radius: 0.5rem;
}
.filter-sidebar .card-header {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
}
.province-list, .category-list {
  max-height: 250px; /* Giới hạn chiều cao cho list tỉnh/danh mục */
  overflow-y: auto;
  font-size: 0.9rem; /* Chữ nhỏ hơn cho bộ lọc */
}
/* Custom scrollbar */
.province-list::-webkit-scrollbar,
.category-list::-webkit-scrollbar {
  width: 6px;
}
.province-list::-webkit-scrollbar-track,
.category-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.province-list::-webkit-scrollbar-thumb,
.category-list::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 3px;
}
.province-list::-webkit-scrollbar-thumb:hover,
.category-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}


.list-group-item {
  border-left: 0;
  border-right: 0;
  padding-left: 1rem;
  padding-right: 1rem;
}
.list-group-item.active {
   font-weight: 600;
}
.list-group-item-action:hover {
   background-color: #e9ecef; /* Màu hover nhẹ */
}

/* CSS cho horizontal scroll section gợi ý */
.suggested-section .row {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #ced4da #f8f9fa; /* Firefox */
}
.suggested-section .row::-webkit-scrollbar {
  height: 8px;
}
.suggested-section .row::-webkit-scrollbar-track {
   background: #f8f9fa;
   border-radius: 4px;
}
.suggested-section .row::-webkit-scrollbar-thumb {
   background-color: #ced4da;
   border-radius: 4px;
   border: 2px solid #f8f9fa;
}

/* Pagination */
.pagination .page-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.75rem;
}
.pagination .page-item.disabled .page-link {
    color: #adb5bd;
}
.pagination .page-item.active .page-link {
    background-color: #198754;
    border-color: #198754;
    color: white;
}

/* Sort options */
.sort-options .btn {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
}

@media (max-width: 991.98px) { /* lg breakpoint */
  .sticky-lg-top {
     position: static !important; /* Disable sticky on smaller screens */
  }
  .filter-sidebar .card {
     margin-bottom: 1.5rem;
  }
}
</style>