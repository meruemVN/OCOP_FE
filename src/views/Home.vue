<template>
  <div class="home-page container-fluid py-4 px-md-4">
    <!-- Banner -->
    <header class="banner mb-4">
      <h1 class="banner__title">OCOP – Đặc sản vùng miền</h1>
      <p class="banner__subtitle">
        Chất lượng chuẩn 3 sao trở lên – Hương vị thiên nhiên, văn hóa bản địa.
      </p>
    </header>

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
              @click="selectCategory(null)" style="cursor:pointer" >
              Tất cả sản phẩm
            </li>
             <li
              v-for="categoryItem in categories" :key="categoryItem"
              class="list-group-item list-group-item-action small py-2"
              :class="{ 'active text-white bg-success border-success': selectedCategory === categoryItem }"
              @click="selectCategory(categoryItem)" style="cursor:pointer" >
              {{ categoryItem }}
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
              @click="selectProvince(null)" style="cursor:pointer" >
              Toàn quốc
            </li>
            <li
              v-for="provinceItem in displayedProvinces" :key="provinceItem"
              class="list-group-item list-group-item-action small py-2"
              :class="{ 'active text-white bg-success border-success': selectedProvince === provinceItem }"
              @click="selectProvince(provinceItem)" style="cursor:pointer" >
              {{ provinceItem }}
            </li>
             <li v-if="provinces && provinces.length > initialProvinceCount" class="list-group-item text-center py-2">
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
                <input type="number" class="form-control form-control-sm" placeholder="Từ" v-model.number="filterPrice.min" min="0" @keyup.enter="applyPriceFilter">
                <span class="mx-2">-</span>
                <input type="number" class="form-control form-control-sm" placeholder="Đến" v-model.number="filterPrice.max" min="0" @keyup.enter="applyPriceFilter">
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
             <i class="fas fa-lightbulb me-2 text-warning"></i>
             {{ suggestionSectionTitle }}
          </h3>
           <div v-if="loadingSuggestedSectionComputed" class="text-center py-4">
               <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
               <p class="mt-2 text-muted">Đang tìm gợi ý phù hợp...</p>
           </div>
          <div v-else-if="suggestedProductsToDisplay && suggestedProductsToDisplay.length === 0 && !anySuggestionError" class="text-center py-4 text-muted">
               {{ noSuggestionMessage }}
          </div>
           <div v-else-if="anySuggestionError" class="text-center py-4 text-danger">
              <i class="fas fa-exclamation-circle me-1"></i> Lỗi khi tải gợi ý: {{ anySuggestionError }}
           </div>
          <div v-else-if="suggestedProductsToDisplay && suggestedProductsToDisplay.length > 0" class="row flex-nowrap overflow-auto pb-3 gx-3">
            <div v-for="product in suggestedProductsToDisplay" :key="'suggested-'+product._id" class="col-8 col-sm-6 col-md-4 col-lg-3">
              <product-card :product="product" @add-to-cart="handleAddToCart" />
            </div>
          </div>
           <div v-else class="text-center py-4 text-muted"> <!-- Fallback nếu không có gì để hiển thị trong gợi ý -->
              <span v-if="!loadingSuggestedSectionComputed">Hãy khám phá thêm sản phẩm!</span>
           </div>
        </section>

        <!-- Danh sách sản phẩm chính -->
        <section>
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                <h3 class="mb-2 mb-sm-0 fw-bold text-success">
                    <i class="fas fa-leaf me-2"></i>Sản phẩm {{ mainListTitle }}
                </h3>
                <div class="btn-group btn-group-sm sort-options" role="group" aria-label="Sắp xếp sản phẩm">
                    <button type="button" class="btn" :class="sortBy === 'popular' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('popular')">Phổ biến</button>
                    <button type="button" class="btn" :class="sortBy === 'newest' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('newest')">Hàng mới</button>
                    <button type="button" class="btn" :class="sortBy === 'priceAsc' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('priceAsc')">Giá tăng dần</button>
                    <button type="button" class="btn" :class="sortBy === 'priceDesc' ? 'btn-success' : 'btn-outline-secondary'" @click="changeSort('priceDesc')">Giá giảm dần</button>
                </div>
           </div>

           <div v-if="loadingMainProducts" class="d-flex justify-content-center align-items-center py-5" style="min-height: 30vh;">
             <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
           </div>
            <div v-else-if="mainProducts && mainProducts.length === 0 && !mainProductsError" class="text-center py-5 card border-light shadow-sm">
               <div class="card-body">
                   <i class="fas fa-search fa-3x text-secondary mb-3"></i>
                   <p class="text-muted">Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.</p>
               </div>
            </div>
             <div v-else-if="mainProductsError" class="text-center py-5 card border-danger shadow-sm">
                <div class="card-body text-danger">
                    <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                    <p class="fw-bold">Lỗi khi tải danh sách sản phẩm</p>
                    <p class="small">{{ mainProductsError }}</p>
                    <button class="btn btn-sm btn-outline-secondary mt-2" @click="() => fetchMainProductList(pagination && pagination.page ? pagination.page : 1)">
                        Thử lại
                    </button>
                </div>
             </div>
            <div v-else-if="mainProducts && mainProducts.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-4" id="productListSection">
                <div class="col" v-for="productItem in mainProducts" :key="productItem._id">
                    <product-card :product="productItem" @add-to-cart="handleAddToCart" />
                </div>
            </div>
             <div v-else class="text-center py-5 text-muted">
                <p v-if="!loadingMainProducts">Không có dữ liệu sản phẩm để hiển thị.</p>
             </div>


             <nav v-if="pagination && typeof pagination.pages === 'number' && pagination.pages > 1 && !loadingMainProducts && !mainProductsError" aria-label="Product pagination" class="d-flex justify-content-center mt-5">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: !pagination || pagination.page === 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(pagination && pagination.page ? pagination.page - 1 : 1)">«</a>
                    </li>
                    <template v-if="pageNumbers && pageNumbers.length > 0">
                        <li class="page-item" v-for="pNum in pageNumbers" :key="pNum" :class="{ active: pagination && pagination.page === pNum, disabled: pNum === '...' }">
                            <a v-if="pNum !== '...'" class="page-link" href="#" @click.prevent="changePage(pNum)">{{ pNum }}</a>
                            <span v-else class="page-link">...</span>
                        </li>
                    </template>
                    <li class="page-item" :class="{ disabled: !pagination || !pagination.pages || pagination.page === pagination.pages }">
                        <a class="page-link" href="#" @click.prevent="changePage(pagination && pagination.page ? pagination.page + 1 : 1)">»</a>
                    </li>
                </ul>
             </nav>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import ProductCard from '@/components/products/ProductCard.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf,
    faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch,
    faExclamationCircle, faStream
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf,
    faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch,
    faExclamationCircle, faStream
);

const store = useStore();
const toast = useToast();

// --- Constants ---
const PROVINCES = [
   "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];
const CATEGORIES = ["Nông sản khô", "Thực phẩm chế biến", "Đồ uống", "Thảo dược", "Thủ công mỹ nghệ", "Đặc sản vùng miền", "Sản phẩm OCOP", "Khác"];

// --- State cho danh sách sản phẩm chính (Lấy từ Vuex Getters) ---
const loadingMainProducts = computed(() => store.getters['product/isProductLoading']);
const mainProducts = computed(() => store.getters['product/mainProducts'] || []);
const pagination = computed(() => store.getters['product/mainPagination'] || { page: 1, pages: 0, count: 0 });
const mainProductsError = computed(() => store.getters['product/productError']);

// --- State cho bộ lọc (Local state của component) ---
const provinces = ref([...PROVINCES]);
const categories = ref([...CATEGORIES]);
const selectedProvince = ref(null);
const selectedCategory = ref(null);
const filterPrice = ref({ min: null, max: null });
const sortBy = ref('popular');
const initialProvinceCount = 10;
const showAllProvinces = ref(false);

// --- State cho mục gợi ý (chung) ---
const defaultSuggestedProducts = ref([]);
const loadingDefaultSuggested = ref(false);

// --- Getters từ Auth Store ---
const isAuthenticated = computed(() => store.getters['auth/isLoggedIn']);
const currentUser = computed(() => store.getters['auth/currentUser']);

// --- Getters từ Recommendation Store ---
const lastViewedProductIdFromStore = computed(() => store.getters['recommendation/lastViewedProductId']);
const relatedRecommendationsFromStore = computed(() => store.getters['recommendation/relatedRecommendations'] || []);
const loadingRecommendationsFromStore = computed(() => store.getters['recommendation/loadingRecommendations']);
const recommendationErrorFromStore = computed(() => store.getters['recommendation/recommendationError']);
const hasRelatedRecommendationsFromStore = computed(() => store.getters['recommendation/hasRelatedRecommendations']);

const userSpecificRecommendationsFromStore = computed(() => store.getters['recommendation/userSpecificRecommendations'] || []);
const loadingUserSpecificRecs = computed(() => store.getters['recommendation/loadingUserSpecificRecommendations']);
const userSpecificRecsError = computed(() => store.getters['recommendation/userSpecificRecommendationError']);
const hasUserSpecificRecs = computed(() => store.getters['recommendation/hasUserSpecificRecommendations']);


// --- Computed Properties ---
const displayedProvinces = computed(() => {
  if (!Array.isArray(provinces.value)) return [];
  return showAllProvinces.value ? provinces.value : provinces.value.slice(0, initialProvinceCount);
});

const mainListTitle = computed(() => {
    if (selectedCategory.value && selectedProvince.value) {
        return `thuộc "${selectedCategory.value}" tại ${selectedProvince.value}`;
    }
    if (selectedCategory.value) return `thuộc "${selectedCategory.value}"`;
    if (selectedProvince.value) return `tại ${selectedProvince.value}`;
    return 'Toàn quốc';
});

const suggestionSectionTitle = computed(() => {
  const currentUserName = currentUser.value?.name || 'bạn';
  if (isAuthenticated.value && hasUserSpecificRecs.value) {
    return `Dành riêng cho ${currentUserName}`;
  }
  if (lastViewedProductIdFromStore.value && hasRelatedRecommendationsFromStore.value) {
     return 'Sản phẩm tương tự đã xem';
  }
  if (isAuthenticated.value && (loadingUserSpecificRecs.value || !hasUserSpecificRecs.value)) {
      return `Gợi ý cho ${currentUserName}`;
  }
  return 'Sản phẩm nổi bật';
});

const loadingSuggestedSectionComputed = computed(() => {
    const title = suggestionSectionTitle.value;
    if (typeof title === 'string' && (title.includes('Dành riêng cho') || title.includes('Gợi ý cho'))) {
        return loadingUserSpecificRecs.value;
    }
    if (title === 'Sản phẩm tương tự đã xem') {
        return loadingRecommendationsFromStore.value;
    }
    return loadingDefaultSuggested.value;
});

const anySuggestionError = computed(() => {
    const title = suggestionSectionTitle.value;
    if (typeof title === 'string' && (title.includes('Dành riêng cho') || title.includes('Gợi ý cho'))) {
        return userSpecificRecsError.value;
    }
    if (title === 'Sản phẩm tương tự đã xem') {
        return recommendationErrorFromStore.value;
    }
    return null;
});

const noSuggestionMessage = computed(() => {
    const title = suggestionSectionTitle.value;
    if (typeof title === 'string' && (title.includes('Dành riêng cho') || title.includes('Gợi ý cho'))) {
        return 'Chúng tôi đang tìm thêm gợi ý phù hợp. Hãy tiếp tục khám phá sản phẩm nhé!';
    }
    if (title === 'Sản phẩm tương tự đã xem') {
        return 'Xem một sản phẩm để chúng tôi gợi ý các sản phẩm tương tự.';
    }
    return 'Khám phá thêm sản phẩm để nhận được gợi ý tốt nhất!';
});

const mapProductDataForCard = (p) => ({
    _id: String(p._id || p.product_id),
    name: p.name,
    images: p.image_url ? [p.image_url] : (Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/images/placeholder-image.png']),
    price: p.price,
    rating: p.rating || p.ocop_rating,
    numReviews: p.numReviews || p.num_reviews || 0,
    countInStock: p.countInStock || p.count_in_stock || 1,
});

const suggestedProductsToDisplay = computed(() => {
    const title = suggestionSectionTitle.value;
    if (typeof title === 'string' && title.includes('Dành riêng cho') && hasUserSpecificRecs.value) {
        return (userSpecificRecommendationsFromStore.value || []).map(mapProductDataForCard);
    }
    if (title === 'Sản phẩm tương tự đã xem' && hasRelatedRecommendationsFromStore.value) {
        return (relatedRecommendationsFromStore.value || []).map(mapProductDataForCard);
    }
    if (Array.isArray(defaultSuggestedProducts.value) && defaultSuggestedProducts.value.length > 0) {
        return defaultSuggestedProducts.value.map(mapProductDataForCard);
    }
    return [];
});

const pageNumbers = computed(() => {
    const currentPagination = pagination.value || { page: 1, pages: 0 };
    const currentPage = currentPagination.page;
    const totalPages = currentPagination.pages;
    if (totalPages <= 1) return [];
    const delta = 1; const range = []; const rangeWithDots = []; let l;
    range.push(1);
    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);
    if (left > right && totalPages > 1) {
        if (currentPage === 1 && totalPages > 1) right = Math.min(totalPages -1, currentPage + delta);
        else if (currentPage === totalPages && totalPages > 1) left = Math.max(2, currentPage - delta);
    }
    for (let i = left; i <= right; i++) { 
        if (i > 1 && i < totalPages) range.push(i); 
    }
    if (totalPages > 1) range.push(totalPages);
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);
    uniqueRange.forEach((i) => {
        if (l !== undefined) {
            if (i - l === 2) rangeWithDots.push(l + 1);
            else if (i - l > 1) rangeWithDots.push('...');
        }
        rangeWithDots.push(i); l = i;
    });
    return rangeWithDots;
});


// --- Methods ---
const fetchMainProductList = async (page = 1) => {
  try {
    const params = {
        pageNumber: page, pageSize: 12,
        category: selectedCategory.value,
        province: selectedProvince.value,
        minPrice: filterPrice.value.min,
        maxPrice: filterPrice.value.max,
        sortBy: sortBy.value
    };
    // console.log("[HomeView] Fetching main products with params:", params);
    await store.dispatch('product/fetchMainProducts', params);
  } catch (error) {
    if(!mainProductsError.value && !error.message?.includes('aborted')) { // Bỏ qua lỗi aborted nếu có
        toast.error(error?.error || error?.message || "Lỗi tải sản phẩm.");
    }
  }
};

const fetchSuggestionData = () => {
    const title = suggestionSectionTitle.value;
    if (title.includes('Dành riêng cho') || title.includes('Gợi ý cho')) {
        if (isAuthenticated.value && !loadingUserSpecificRecs.value) {
            store.dispatch('recommendation/fetchUserSpecificRecommendations');
        }
    } else if (title === 'Sản phẩm tương tự đã xem') {
        if (lastViewedProductIdFromStore.value && !loadingRecommendationsFromStore.value) {
            store.dispatch('recommendation/fetchRelatedRecommendations', {
                productId: lastViewedProductIdFromStore.value,
                topN: 8
            });
        }
    } else { // Sản phẩm nổi bật
        if (defaultSuggestedProducts.value.length === 0 && !loadingDefaultSuggested.value) {
            loadingDefaultSuggested.value = true;
            store.dispatch('product/fetchMainProducts', { sortBy: 'popular', pageSize: 8 })
                .then(result => {
                    if (result && result.products) defaultSuggestedProducts.value = result.products;
                    else defaultSuggestedProducts.value = [];
                })
                .catch(err => { 
                    if (!err.message?.includes('aborted')) defaultSuggestedProducts.value = []; 
                })
                .finally(() => loadingDefaultSuggested.value = false);
        }
    }
};

const applyFiltersAndFetch = (page = 1) => {
    fetchMainProductList(page);
};

const selectCategory = (categoryName) => { selectedCategory.value = categoryName; applyFiltersAndFetch(1); };
const selectProvince = (provinceName) => { selectedProvince.value = provinceName; applyFiltersAndFetch(1); };
const applyPriceFilter = () => { applyFiltersAndFetch(1); };
const resetPriceFilter = () => { filterPrice.value = { min: null, max: null }; applyFiltersAndFetch(1); };
const changeSort = (sortKeyName) => { sortBy.value = sortKeyName; applyFiltersAndFetch(1); };

const resetAllFilters = () => {
    selectedCategory.value = null;
    selectedProvince.value = null;
    filterPrice.value = { min: null, max: null };
    sortBy.value = 'popular';
    
    store.dispatch('product/clearProductState');
    applyFiltersAndFetch(1);
    
    store.dispatch('recommendation/clearAllRecommendationData');
    defaultSuggestedProducts.value = [];
    nextTick(() => {
        fetchSuggestionData();
    });
};

const changePage = (newPage) => {
    const currentPagination = pagination.value || { page: 1, pages: 0 };
    if (newPage >= 1 && newPage <= currentPagination.pages && newPage !== currentPagination.page) {
        applyFiltersAndFetch(newPage);
         const productListElement = document.getElementById('productListSection');
         if (productListElement) {
             productListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
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

// --- Lifecycle Hooks & Watchers ---
onMounted(() => {
  store.dispatch('product/clearProductState');
  store.dispatch('recommendation/clearAllRecommendationData');
  defaultSuggestedProducts.value = [];
  fetchMainProductList();
  // fetchSuggestionData sẽ được trigger bởi watcher khi title ổn định
});

watch(isAuthenticated, (loggedIn, previouslyLoggedIn) => {
  if (loggedIn !== previouslyLoggedIn) {
    store.dispatch('recommendation/clearAllRecommendationData');
    defaultSuggestedProducts.value = [];
    nextTick(() => fetchSuggestionData());
  }
});

watch(lastViewedProductIdFromStore, (newId, oldId) => {
    if (newId && newId !== oldId) {
        if (suggestionSectionTitle.value === 'Sản phẩm tương tự đã xem' || !isAuthenticated.value) {
            fetchSuggestionData();
        }
    } else if (!newId && oldId) {
        store.dispatch('recommendation/clearRelatedRecommendations');
    }
});

let isFetchingSuggestionsByTitleDebounced = false;
let titleWatcherTimeout = null;
watch(suggestionSectionTitle, (newTitle, oldTitle) => {
    if (newTitle === oldTitle || isFetchingSuggestionsByTitleDebounced || loadingSuggestedSectionComputed.value) return;
    
    clearTimeout(titleWatcherTimeout);
    titleWatcherTimeout = setTimeout(() => {
        if (!loadingSuggestedSectionComputed.value) {
            isFetchingSuggestionsByTitleDebounced = true;
            fetchSuggestionData();
            setTimeout(() => { isFetchingSuggestionsByTitleDebounced = false; }, 700); // Thời gian chờ đủ để fetch hoàn tất
        }
    }, 250); // Debounce
}, { immediate: false });

</script>

<style scoped>
/* CSS CỦA BANNER */
.banner {
  position: relative;
  width: 100%;
  min-height: 20px;
  background: linear-gradient(135deg, #198754 0%, #63d471 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  border-radius: 0.5rem;
  padding: 2rem 1rem;
  font-family: 'Arial', sans-serif;
}
.banner__title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
.banner__subtitle {
  font-size: 1.1rem;
  margin: 0.5rem 0 0;
  max-width: 90%;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}
@media (max-width: 768px) {
  .banner { min-height: 200px; padding: 1.5rem 10px; }
  .banner__title { font-size: 1.6rem; }
  .banner__subtitle { font-size: 1rem; }
}
@media (max-width: 576px) {
  .banner { min-height: 180px; padding: 1rem 10px; }
  .banner__title { font-size: 1.4rem; }
  .banner__subtitle { font-size: 0.9rem; }
}

/* CSS CHUNG */
.home-page {
  background: #f8f9fa;
}
.filter-sidebar .card {
    border-radius: 0.5rem;
}
.filter-sidebar .card-header {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
}
.province-list, .category-list {
  max-height: 250px;
  overflow-y: auto;
  font-size: 0.9rem;
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
   background-color: #e9ecef;
}
.suggested-section .row {
  scrollbar-width: thin;
  scrollbar-color: #ced4da #f8f9fa;
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
    color: #198754;
}
.pagination .page-item.disabled .page-link {
    color: #adb5bd;
}
.pagination .page-item.active .page-link {
    background-color: #198754;
    border-color: #198754;
    color: white;
}
.page-link:hover {
    color: #105c37;
}
.sort-options .btn {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
}
@media (max-width: 991.98px) {
  .sticky-lg-top {
     position: static !important;
  }
  .filter-sidebar .card {
     margin-bottom: 1.5rem;
  }
}
</style>