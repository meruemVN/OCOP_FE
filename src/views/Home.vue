<template>
  <div class="home-page container-fluid py-4 px-md-4">
    <!-- START: BANNER MỚI THÊM -->
    <header class="banner mb-4">
      <h1 class="banner__title">OCOP – Đặc sản vùng miền</h1>
      <p class="banner__subtitle">
        Chất lượng chuẩn 3 sao trở lên – Hương vị thiên nhiên, văn hóa bản địa.
      </p>
    </header>
    <!-- END: BANNER MỚI THÊM -->

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
          <div v-else-if="suggestedProductsToDisplay.length === 0 && !recommendationErrorFromStore" class="text-center py-4 text-muted">
               Khám phá thêm sản phẩm để nhận được gợi ý tốt nhất!
          </div>
           <div v-else-if="recommendationErrorFromStore" class="text-center py-4 text-danger">
              <i class="fas fa-exclamation-circle me-1"></i> Lỗi khi tải gợi ý: {{ recommendationErrorFromStore }}
           </div>
          <div v-else class="row flex-nowrap overflow-auto pb-3 gx-3">
            <div v-for="product in suggestedProductsToDisplay" :key="'suggested-'+product._id" class="col-8 col-sm-6 col-md-4 col-lg-3">
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

           <div v-if="loadingMainProducts" class="d-flex justify-content-center align-items-center py-5" style="min-height: 40vh;">
             <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;"></div>
           </div>
            <div v-else-if="mainProducts.length === 0" class="text-center py-5 card border-light shadow-sm">
               <div class="card-body">
                   <i class="fas fa-search fa-3x text-light mb-3"></i>
                   <p class="text-muted">Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.</p>
               </div>
            </div>
            <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-4" id="productListSection">
                <div class="col" v-for="product in mainProducts" :key="product._id">
                    <product-card :product="product" @add-to-cart="handleAddToCart" />
                </div>
            </div>

             <nav v-if="pagination.pages > 1 && !loadingMainProducts" aria-label="Product pagination" class="d-flex justify-content-center mt-5">
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
const CATEGORIES = ["Nông sản khô", "Thực phẩm chế biến", "Đồ uống", "Thảo dược", "Thủ công mỹ nghệ", "Đặc sản vùng miền", "Sản phẩm OCOP", "Khác"];
const LOCAL_STORAGE_SUGGESTION_PREF_KEY = 'userSawPersonalizedSuggestions';
const LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER = 'lastViewedIdForSuggestionTrigger';

// --- State cho danh sách sản phẩm chính ---
const loadingMainProducts = ref(true);
const mainProducts = ref([]);
const pagination = ref({ page: 1, pages: 1, count: 0 });

// --- State cho bộ lọc ---
const provinces = ref([...PROVINCES]); // Khởi tạo từ hằng số PROVINCES
const categories = ref([...CATEGORIES]); // Khởi tạo từ hằng số CATEGORIES
const selectedProvince = ref(null);
const selectedCategory = ref(null);
const filterPrice = ref({ min: null, max: null });
const sortBy = ref('popular');
const initialProvinceCount = 10;
const showAllProvinces = ref(false);

// --- State cho mục gợi ý ---
const defaultSuggestedProducts = ref([]);
const loadingDefaultSuggested = ref(false);

// --- Getters từ Vuex Store (cho mục gợi ý) ---
const lastViewedProductIdFromStore = computed(() => store.getters['recommendation/lastViewedProductId']);
const relatedRecommendationsFromStore = computed(() => store.getters['recommendation/relatedRecommendations']);
const loadingRecommendationsFromStore = computed(() => store.getters['recommendation/loadingRecommendations']);
const recommendationErrorFromStore = computed(() => store.getters['recommendation/recommendationError']);
const hasRelatedRecommendationsFromStore = computed(() => store.getters['recommendation/hasRelatedRecommendations']);

// --- Computed Properties ---
const displayedProvinces = computed(() => {
  if (!Array.isArray(provinces.value)) {
      return [];
  }
  return showAllProvinces.value ? provinces.value : provinces.value.slice(0, initialProvinceCount);
});

const suggestionSectionTitle = computed(() => {
  const hasSeenPersonalized = localStorage.getItem(LOCAL_STORAGE_SUGGESTION_PREF_KEY) === 'true';
  const triggerIdFromStorage = localStorage.getItem(LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER);
  const currentLastViewedId = lastViewedProductIdFromStore.value;

  if (hasRelatedRecommendationsFromStore.value && Array.isArray(relatedRecommendationsFromStore.value) && relatedRecommendationsFromStore.value.length > 0) {
    return 'Dành riêng cho bạn';
  }
  if (hasSeenPersonalized && currentLastViewedId &&
      (triggerIdFromStorage === String(currentLastViewedId) || !triggerIdFromStorage)
     ) {
    return 'Dành riêng cho bạn';
  }
  return 'Sản phẩm nổi bật';
});

const loadingSuggestedSectionComputed = computed(() => {
    if (suggestionSectionTitle.value === 'Dành riêng cho bạn') {
        return loadingRecommendationsFromStore.value;
    }
    return loadingDefaultSuggested.value;
});

const suggestedProductsToDisplay = computed(() => {
    const relatedRecs = relatedRecommendationsFromStore.value;
    const defaultRecs = defaultSuggestedProducts.value;

    if (hasRelatedRecommendationsFromStore.value && Array.isArray(relatedRecs) && relatedRecs.length > 0) {
        return relatedRecs.map(p => ({
            _id: String(p.product_id),
            original_id: p.product_id,
            name: p.name,
            images: p.image_url ? [p.image_url] : ['/images/placeholder-image.png'],
            price: p.price,
            rating: p.ocop_rating,
            numReviews: p.num_reviews || 0,
            countInStock: p.count_in_stock || 1,
        }));
    }
    if (Array.isArray(defaultRecs)) {
        return defaultRecs.map(p => ({
            _id: p._id,
            original_id: p.original_id || p._id,
            name: p.name,
            images: p.images && p.images.length > 0 ? p.images : ['/images/placeholder-image.png'],
            price: p.price,
            rating: p.rating,
            numReviews: p.numReviews,
            countInStock: p.countInStock,
        }));
    }
    return [];
});

const pageNumbers = computed(() => {
    const currentPage = pagination.value.page;
    const totalPages = pagination.value.pages;
    if (totalPages <= 1) return [];
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);

    for (let i = left; i <= right; i++) {
        range.push(i);
    }
    if (totalPages > 1) range.push(totalPages);
    range.sort((a, b) => a - b);
    const uniqueRange = [...new Set(range)];

    uniqueRange.forEach((i) => {
        if (l !== undefined) {
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


// --- Methods ---
const fetchMainProducts = async (page = 1) => {
  loadingMainProducts.value = true;
  try {
    const params = { pageNumber: page, pageSize: 12 };
    if (selectedProvince.value) params.province = selectedProvince.value;
    if (selectedCategory.value) params.category = selectedCategory.value;
    if (filterPrice.value.min != null && filterPrice.value.min !== '') params.minPrice = filterPrice.value.min;
    if (filterPrice.value.max != null && filterPrice.value.max !== '') params.maxPrice = filterPrice.value.max;
    if (sortBy.value) params.sortBy = sortBy.value;

    const result = await store.dispatch('product/searchProducts', params);

    if (result && result.products) {
        mainProducts.value = result.products;
        pagination.value = {
          page: result.page || 1,
          pages: result.pages || 1,
          count: result.count || 0
        };
    } else {
        mainProducts.value = [];
        pagination.value = { page: 1, pages: 1, count: 0 };
        if (!result?.error && mainProducts.value.length === 0 && !loadingMainProducts.value) { // Chỉ toast khi không loading
           toast.info("Không tìm thấy sản phẩm nào phù hợp.");
        }
    }
  } catch (error) {
    console.error("HomeView: Lỗi fetchMainProducts:", error.response?.data?.message || error.message);
    mainProducts.value = [];
    pagination.value = { page: 1, pages: 1, count: 0 };
    toast.error(error.response?.data?.message || "Không thể tải danh sách sản phẩm.");
  } finally {
    loadingMainProducts.value = false;
  }
};

const fetchDefaultSuggestedProducts = async () => {
    if (defaultSuggestedProducts.value.length > 0 || loadingDefaultSuggested.value) {
        return;
    }
    if (hasRelatedRecommendationsFromStore.value && Array.isArray(relatedRecommendationsFromStore.value) && relatedRecommendationsFromStore.value.length > 0) {
        return;
    }
    loadingDefaultSuggested.value = true;
    try {
        const result = await store.dispatch('product/searchProducts', { sortBy: 'popular', pageSize: 8 });
        if (result && result.products) {
             defaultSuggestedProducts.value = result.products;
        } else {
            defaultSuggestedProducts.value = [];
        }
    } catch (error) {
        console.error("HomeView: Lỗi fetchDefaultSuggestedProducts:", error);
        defaultSuggestedProducts.value = [];
    } finally {
        loadingDefaultSuggested.value = false;
    }
}

const triggerFetchPersonalizedRecommendations = () => {
    const lastViewedId = lastViewedProductIdFromStore.value;
    if (lastViewedId && !loadingRecommendationsFromStore.value) {
        // Kiểm tra nếu chưa có data hoặc data không khớp ID hiện tại (tùy logic bạn muốn)
        // Hiện tại, cứ fetch nếu có ID và không đang loading
        store.dispatch('recommendation/fetchRelatedRecommendations', {
            productId: lastViewedId,
            topN: 4
        });
    }
};

const selectProvince = (province) => {
  if (selectedProvince.value === province) return;
  selectedProvince.value = province;
  fetchMainProducts(1);
};

const selectCategory = (category) => {
    if (selectedCategory.value === category) return;
    selectedCategory.value = category;
    fetchMainProducts(1);
}

const applyPriceFilter = () => {
    fetchMainProducts(1);
}

const resetPriceFilter = () => {
    if (filterPrice.value.min != null || filterPrice.value.max != null) {
        filterPrice.value = { min: null, max: null };
        fetchMainProducts(1);
    }
}

const resetAllFilters = () => {
    selectedProvince.value = null;
    selectedCategory.value = null;
    filterPrice.value = { min: null, max: null };
    sortBy.value = 'popular';
    fetchMainProducts(1);
    localStorage.removeItem(LOCAL_STORAGE_SUGGESTION_PREF_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER);
};

const changeSort = (sortKey) => {
    if (sortBy.value === sortKey) return;
    sortBy.value = sortKey;
    fetchMainProducts(1);
}

const changePage = (page) => {
    if (page >= 1 && page <= pagination.value.pages && page !== pagination.value.page) {
        fetchMainProducts(page);
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
onMounted(async () => {
  await fetchMainProducts();

  if (suggestionSectionTitle.value === 'Dành riêng cho bạn') {
    triggerFetchPersonalizedRecommendations();
  } else if (defaultSuggestedProducts.value.length === 0 && !loadingDefaultSuggested.value) {
    fetchDefaultSuggestedProducts();
  }
});

watch(hasRelatedRecommendationsFromStore, (newHasRecs, oldHasRecs) => {
    console.log('[HomeView Watcher hasRelatedRecs] TRIGGERED. NewVal:', newHasRecs, 'OldVal:', oldHasRecs); // LOG 1
    console.log('[HomeView Watcher hasRelatedRecs] Current relatedRecommendationsFromStore.value:', JSON.parse(JSON.stringify(relatedRecommendationsFromStore.value))); // LOG 2
    console.log('[HomeView Watcher hasRelatedRecs] Current lastViewedProductIdFromStore.value:', lastViewedProductIdFromStore.value); // LOG 3

    const currentRelatedRecs = relatedRecommendationsFromStore.value;

    if (newHasRecs && Array.isArray(currentRelatedRecs) && currentRelatedRecs.length > 0) {
        console.log('[HomeView Watcher hasRelatedRecs] CONDITIONS MET. Setting localStorage items.'); // LOG 4
        localStorage.setItem(LOCAL_STORAGE_SUGGESTION_PREF_KEY, 'true');
        if(lastViewedProductIdFromStore.value) {
            localStorage.setItem(LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER, String(lastViewedProductIdFromStore.value));
            console.log(`[HomeView Watcher hasRelatedRecs] Set trigger ID to: ${lastViewedProductIdFromStore.value}`); // LOG 5
        } else {
            console.warn('[HomeView Watcher hasRelatedRecs] lastViewedProductIdFromStore is null/undefined, cannot set trigger ID.');
        }
    } else if (!newHasRecs) {
        console.log('[HomeView Watcher hasRelatedRecs] newHasRecs is false. Checking for default suggestions.');
        if (defaultSuggestedProducts.value.length === 0 && !loadingDefaultSuggested.value) {
            fetchDefaultSuggestedProducts();
        }
      } else {
        console.warn('[HomeView Watcher hasRelatedRecs] newHasRecs is true, but other conditions not met for setting localStorage.'); // LOG 6
        console.warn('[HomeView Watcher hasRelatedRecs] Is currentRelatedRecs an array?', Array.isArray(currentRelatedRecs));
        console.warn('[HomeView Watcher hasRelatedRecs] currentRelatedRecs length:', currentRelatedRecs ? currentRelatedRecs.length : 'N/A');
    }
});

watch(() => store.state.recommendation.relatedRecommendations, (newRecs, oldRecs) => {
    console.log('[HomeView Direct State Watcher] TRIGGERED.');
    console.log('[HomeView Direct State Watcher] New recommendations:', JSON.parse(JSON.stringify(newRecs)));
    console.log('[HomeView Direct State Watcher] Length:', newRecs ? newRecs.length : 'N/A');

    // Lấy lastViewedProductId từ getter, vì nó có thể đã được persist và cập nhật
    const currentLastViewedId = store.getters['recommendation/lastViewedProductId'];
    console.log('[HomeView Direct State Watcher] Current lastViewedProductIdFromStore:', currentLastViewedId);


    if (Array.isArray(newRecs) && newRecs.length > 0) {
        console.log('[HomeView Direct State Watcher] CONDITIONS MET. Setting localStorage items.');
        localStorage.setItem(LOCAL_STORAGE_SUGGESTION_PREF_KEY, 'true');
        if (currentLastViewedId) { // Sử dụng currentLastViewedId đã lấy ở trên
            localStorage.setItem(LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER, String(currentLastViewedId));
            console.log(`[HomeView Direct State Watcher] Set trigger ID to: ${currentLastViewedId}`);
        } else {
             console.warn('[HomeView Direct State Watcher] lastViewedProductId is null/undefined, cannot set trigger ID.');
        }
        // Cập nhật shouldShowPersonalizedTitle nếu bạn đang dùng ref đó
        if (typeof shouldShowPersonalizedTitle !== 'undefined' && shouldShowPersonalizedTitle.value === false) { // Thêm kiểm tra typeof
            console.log('[HomeView Direct State Watcher] Updating shouldShowPersonalizedTitle to true');
            shouldShowPersonalizedTitle.value = true;
        }

    } else {
        console.log('[HomeView Direct State Watcher] Conditions NOT MET or newRecs is empty.');
        // Nếu mảng gợi ý trở nên rỗng sau khi đã từng có dữ liệu,
        // có thể bạn muốn xóa các key localStorage để quay về "Sản phẩm nổi bật"
        if (Array.isArray(oldRecs) && oldRecs.length > 0 && (!newRecs || newRecs.length === 0)) {
            console.log('[HomeView Direct State Watcher] Recommendations became empty, clearing localStorage keys.');
            localStorage.removeItem(LOCAL_STORAGE_SUGGESTION_PREF_KEY);
            localStorage.removeItem(LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER);
            if (typeof shouldShowPersonalizedTitle !== 'undefined') { // Thêm kiểm tra typeof
                shouldShowPersonalizedTitle.value = false;
            }
        }
    }
}, { deep: true }); // QUAN TRỌNG: deep: true để theo dõi thay đổi bên trong mảng


watch(lastViewedProductIdFromStore, (newId, oldId) => {
    if (newId && newId !== oldId) {
        // Khi lastViewedId thay đổi (người dùng xem sản phẩm khác),
        // Vuex store 'recommendation' nên tự động gọi fetchRelatedRecommendations
        // (nếu action `setLastViewedProduct` của bạn có dispatch).
        // Hoặc ProductDetailView tự gọi.
        // HomeView cũng có thể trigger nếu nó đang active và muốn cập nhật ngay.
        if (suggestionSectionTitle.value === 'Dành riêng cho bạn') { // Chỉ trigger nếu UI đang muốn hiển thị personalized
             triggerFetchPersonalizedRecommendations();
        }
    } else if (!newId && oldId) {
        localStorage.removeItem(LOCAL_STORAGE_SUGGESTION_PREF_KEY);
        localStorage.removeItem(LOCAL_STORAGE_LAST_VIEWED_ID_FOR_SUGGESTION_TRIGGER);
        if (defaultSuggestedProducts.value.length === 0 && !loadingDefaultSuggested.value && !hasRelatedRecommendationsFromStore.value) {
            fetchDefaultSuggestedProducts();
        }
    }
});

watch(suggestionSectionTitle, (newTitle, oldTitle) => {
    if (newTitle === 'Sản phẩm nổi bật' && oldTitle === 'Dành riêng cho bạn') {
        if (defaultSuggestedProducts.value.length === 0 && !loadingDefaultSuggested.value) {
             fetchDefaultSuggestedProducts();
        }
    } else if (newTitle === 'Dành riêng cho bạn' && oldTitle === 'Sản phẩm nổi bật') {
        if (!hasRelatedRecommendationsFromStore.value && !loadingRecommendationsFromStore.value) {
             triggerFetchPersonalizedRecommendations();
        }
    }
});

</script>

<style scoped>
/* CSS CỦA BANNER */
.banner {
  position: relative;
  width: 100%;
  min-height: 250px;
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