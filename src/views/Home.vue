<template>
  <div class="home-page container-fluid py-4 px-md-4">
    <div class="row g-4">

      <!-- Sidebar Bộ lọc -->
      <nav class="col-12 col-lg-3">
        <div class="filter-sidebar card shadow-sm border-light sticky-lg-top" style="top: 20px;">
          <!-- Bộ lọc Danh mục -->
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

        <!-- Gợi ý cho bạn Section (ĐÃ CẬP NHẬT LOGIC HIỂN THỊ) -->
        <section class="mb-5 suggested-section">
          <h3 class="mb-3 fw-bold text-success">
             <i class="fas fa-lightbulb me-2 text-warning"></i>
             {{ lastViewedProductIdFromStore ? 'Dành riêng cho bạn' : 'Sản phẩm nổi bật' }}
          </h3>
           <div v-if="loadingSuggestedSection" class="text-center py-4">
               <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
               <p class="mt-2 text-muted">Đang tìm gợi ý phù hợp...</p>
           </div>
          <div v-else-if="suggestedProductsToDisplay.length === 0 && !recommendationErrorFromStore" class="text-center py-4 text-muted">
               Khám phá thêm sản phẩm để nhận được gợi ý tốt nhất!
          </div>
           <div v-else-if="recommendationErrorFromStore" class="text-center py-4 text-danger">
              <i class="fas fa-exclamation-circle me-1"></i> Lỗi khi tải gợi ý: {{ recommendationErrorFromStore }}
           </div>
          <div v-else class="row flex-nowrap overflow-auto pb-3 gx-3">
            <!-- suggestedProductsToDisplay là computed property đã map dữ liệu -->
            <div v-for="product in suggestedProductsToDisplay" :key="'suggested-'+product._id" class="col-8 col-sm-6 col-md-4 col-lg-3">
              <product-card :product="product" @add-to-cart="handleAddToCart" />
            </div>
          </div>
        </section>

        <!-- Danh sách sản phẩm chính (GIỮ NGUYÊN TEMPLATE CỦA BẠN) -->
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
            <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-4" id="productListSection">
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
import { 
    faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf, 
    faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch, 
    faExclamationCircle, faStream // faStream đã được thêm ở ProductDetailView, thêm ở đây nếu cần
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf, 
    faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch, 
    faExclamationCircle, faStream
);

const store = useStore();
const toast = useToast();

// --- Constants & State (GIỮ NGUYÊN TỪ CODE GỐC CỦA BẠN) ---
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
const CATEGORIES = ["Nông sản khô", "Thực phẩm chế biến", "Đồ uống", "Thảo dược", "Thủ công mỹ nghệ", "Đặc sản vùng miền", "Sản phẩm OCOP", "Khác"]; // Mở rộng danh mục

const loading = ref(true); // Loading cho danh sách sản phẩm chính
// loadingSuggested đã được thay bằng loadingSuggestedSection (computed)
const products = ref([]);
// suggestedProducts đã được thay bằng suggestedProductsToDisplay (computed)
const defaultSuggestedProducts = ref([]); // Để lưu gợi ý mặc định (ví dụ: phổ biến)
const loadingDefaultSuggested = ref(false); // State loading riêng cho default suggestions

const provinces = ref(PROVINCES);
const categories = ref(CATEGORIES);
const selectedProvince = ref(null);
const selectedCategory = ref(null);
const filterPrice = ref({ min: null, max: null });
const sortBy = ref('popular');
const pagination = ref({ page: 1, pages: 1, count: 0 });
const initialProvinceCount = 10;
const showAllProvinces = ref(false);

// --- Vuex Getters cho recommendation (THÊM VÀO) ---
const lastViewedProductIdFromStore = computed(() => store.getters['recommendation/lastViewedProductId']);
const relatedRecommendationsFromStore = computed(() => store.getters['recommendation/relatedRecommendations']);
const loadingRecommendationsFromStore = computed(() => store.getters['recommendation/loadingRecommendations']);
const recommendationErrorFromStore = computed(() => store.getters['recommendation/recommendationError']);
const hasRelatedRecommendationsFromStore = computed(() => store.getters['recommendation/hasRelatedRecommendations']);

// --- Computed Properties (GIỮ NGUYÊN VÀ THÊM MỚI) ---
const displayedProvinces = computed(() => {
  return showAllProvinces.value ? provinces.value : provinces.value.slice(0, initialProvinceCount);
});

// Trạng thái loading tổng hợp cho section gợi ý (THÊM MỚI)
const loadingSuggestedSection = computed(() => {
    // Nếu đang tải gợi ý liên quan (từ Vuex), thì section này đang loading
    if (loadingRecommendationsFromStore.value) {
        return true;
    }
    // Nếu không có gợi ý liên quan và cũng không có lỗi, và đang tải gợi ý mặc định
    if (!hasRelatedRecommendationsFromStore.value && !recommendationErrorFromStore.value && loadingDefaultSuggested.value) {
        return true;
    }
    return false;
});

// Quyết định danh sách sản phẩm nào sẽ hiển thị trong "Gợi ý cho bạn" (THÊM MỚI)
const suggestedProductsToDisplay = computed(() => {
    if (hasRelatedRecommendationsFromStore.value && relatedRecommendationsFromStore.value.length > 0) {
        // Ưu tiên hiển thị gợi ý liên quan nếu có
        return relatedRecommendationsFromStore.value.map(p => ({
            _id: String(p.product_id), // ProductCard thường dùng _id (string)
            original_id: p.product_id,
            name: p.name,
            images: p.image_url ? [p.image_url] : ['/images/placeholder-image.png'], // ProductCard có thể cần mảng images
            price: p.price,
            rating: p.ocop_rating, // Hoặc một trường rating khác từ sản phẩm gốc
            numReviews: 0, // API gợi ý thường không có thông tin này
            countInStock: 1, // Mặc định là còn hàng
            // Thêm các trường khác mà ProductCard của bạn có thể cần
        }));
    }
    // Nếu không có gợi ý liên quan, hiển thị gợi ý mặc định
    return defaultSuggestedProducts.value;
});


const pageNumbers = computed(() => { // Giữ nguyên logic pageNumbers của bạn
    const currentPage = pagination.value.page;
    const totalPages = pagination.value.pages;
    if (totalPages <= 1) return []; // Không hiển thị pagination nếu chỉ có 1 trang
    const delta = 1; // Số trang hiển thị mỗi bên của trang hiện tại, bạn có thể dùng delta = 2 như trước
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    // Tính toán left và right range, đảm bảo không vượt quá giới hạn
    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);

    for (let i = left; i <= right; i++) {
        range.push(i);
    }
    range.push(totalPages);
    range.sort((a, b) => a - b); // Sắp xếp lại để đảm bảo thứ tự đúng

    // Loại bỏ các số trùng lặp sau khi sort (nếu có)
    const uniqueRange = [...new Set(range)];

    uniqueRange.forEach((i) => {
        if (l !== undefined) { // Bắt đầu kiểm tra từ phần tử thứ 2
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l > 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    });
    return rangeWithDots;
});


// --- Methods (GIỮ NGUYÊN VÀ THÊM MỚI) ---
const fetchProducts = async (page = 1) => { // Giữ nguyên
  loading.value = true;
  try {
    const params = { pageNumber: page, pageSize: 12 };
    if (selectedProvince.value) params.province = selectedProvince.value;
    if (selectedCategory.value) params.category = selectedCategory.value;
    if (filterPrice.value.min != null && filterPrice.value.min !== '') params.minPrice = filterPrice.value.min;
    if (filterPrice.value.max != null && filterPrice.value.max !== '') params.maxPrice = filterPrice.value.max;
    if (sortBy.value) params.sortBy = sortBy.value;

    const result = await store.dispatch('product/searchProducts', params);
    products.value = result?.products || [];
    pagination.value = {
      page: result?.page || 1,
      pages: result?.pages || 1,
      count: result?.count || 0
    };
  } catch (error) {
    console.error("HomeView: Lỗi fetchProducts:", error.response?.data?.message || error.message);
    products.value = [];
    pagination.value = { page: 1, pages: 1, count: 0 };
    toast.error(error.response?.data?.message || "Không thể tải danh sách sản phẩm.");
  } finally {
    loading.value = false;
  }
};

// Đổi tên hàm fetchSuggestedProducts thành fetchDefaultSuggestedProducts (THAY ĐỔI)
const fetchDefaultSuggestedProducts = async () => {
    // Chỉ fetch nếu chưa có gợi ý liên quan (để tránh gọi thừa)
    // và cũng chưa có default suggestions nào được tải
    if ((hasRelatedRecommendationsFromStore.value && relatedRecommendationsFromStore.value.length > 0) || defaultSuggestedProducts.value.length > 0) {
        loadingDefaultSuggested.value = false; // Nếu đã có thì không cần loading
        return;
    }

    loadingDefaultSuggested.value = true;
    try {
        // Ví dụ: Lấy các sản phẩm bán chạy nhất hoặc mới nhất làm default
        const result = await store.dispatch('product/searchProducts', { sortBy: 'popular', pageSize: 8 });
        // Map dữ liệu default suggestions cho ProductCard
        defaultSuggestedProducts.value = (result?.products || []).map(p => ({
             _id: p._id,
             original_id: p.original_id || p._id, // Cần original_id nếu ProductCard dùng để điều hướng
             name: p.name,
             images: p.images && p.images.length > 0 ? p.images : ['/images/placeholder-image.png'], // Đảm bảo images là mảng
             price: p.price,
             rating: p.rating, // Hoặc ocop_rating tùy dữ liệu
             numReviews: p.numReviews,
             countInStock: p.countInStock,
        }));
    } catch (error) {
        console.error("HomeView: Lỗi fetchDefaultSuggestedProducts:", error);
        defaultSuggestedProducts.value = [];
        // Có thể không cần toast ở đây vì đây là gợi ý phụ
    } finally {
        loadingDefaultSuggested.value = false;
    }
}

const selectProvince = (province) => { // Giữ nguyên
  if (selectedProvince.value === province) return;
  selectedProvince.value = province;
  fetchProducts(1);
};

const selectCategory = (category) => { // Giữ nguyên
    if (selectedCategory.value === category) return;
    selectedCategory.value = category;
    fetchProducts(1);
}

const applyPriceFilter = () => { // Giữ nguyên
    fetchProducts(1);
}

const resetPriceFilter = () => { // Giữ nguyên
    if (filterPrice.value.min != null || filterPrice.value.max != null) { // So sánh với null
        filterPrice.value = { min: null, max: null };
        fetchProducts(1);
    }
}

const resetAllFilters = () => { // Giữ nguyên
    selectedProvince.value = null;
    selectedCategory.value = null;
    filterPrice.value = { min: null, max: null };
    sortBy.value = 'popular';
    fetchProducts(1);
}

const changeSort = (sortKey) => { // Giữ nguyên
    if (sortBy.value === sortKey) return;
    sortBy.value = sortKey;
    fetchProducts(1);
}

const changePage = (page) => { // Giữ nguyên
    if (page >= 1 && page <= pagination.value.pages && page !== pagination.value.page) {
        fetchProducts(page);
         const productListElement = document.getElementById('productListSection');
         if (productListElement) {
             productListElement.scrollIntoView({ behavior: 'smooth' });
         }
    }
};

const handleAddToCart = async ({ productId, quantity }) => { // Giữ nguyên
  try {
      await store.dispatch('cart/addToCart', { productId, quantity });
      toast.success('Đã thêm vào giỏ hàng!');
  } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
  }
};

// --- Lifecycle Hook & Watchers (CẬP NHẬT) ---
onMounted(() => {
  fetchProducts(); // Tải sản phẩm chính
  // Kiểm tra và tải gợi ý mặc định nếu chưa có gợi ý cá nhân hóa
  if (!hasRelatedRecommendationsFromStore.value || relatedRecommendationsFromStore.value.length === 0) {
      fetchDefaultSuggestedProducts();
  }
});

// Watch for changes from Vuex store
watch(hasRelatedRecommendationsFromStore, (newHasRecs) => {
    if (!newHasRecs && defaultSuggestedProducts.value.length === 0) {
        // Nếu không có gợi ý cá nhân hóa (ví dụ sau khi clear store) VÀ cũng chưa có default
        // thì fetch lại default suggestions.
        fetchDefaultSuggestedProducts();
    }
});

// Bạn không cần watch các filter khác ở đây nếu các hàm select.../apply... đã gọi fetchProducts(1)

</script>

<style scoped>
/* GIỮ NGUYÊN CSS CỦA BẠN */
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
.pagination .page-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.75rem;
    color: #198754; /* Màu link pagination */
}
.pagination .page-item.disabled .page-link {
    color: #adb5bd;
}
.pagination .page-item.active .page-link {
    background-color: #198754;
    border-color: #198754;
    color: white;
}
.page-link:hover { /* Thêm hover cho pagination links */
    color: #105c37;
    /* background-color: #e9ecef; */ /* Tùy chọn màu nền hover */
}
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