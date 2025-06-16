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
             <i class=""></i>
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
           <div v-else class="text-center py-4 text-muted">
              <span v-if="!loadingSuggestedSectionComputed && !anySuggestionError">Hãy khám phá thêm sản phẩm!</span>
           </div>
        </section>

        <!-- Danh sách sản phẩm chính -->
        <section>
          <!-- THANH TÌM KIẾM -->
            <div class="mb-3 input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm sản phẩm..."
                v-model="searchKeyword"
                @keyup.enter="handleSearch"
              />
              <button class="btn btn-outline-secondary" type="button" @click="handleSearch">
                <i class="fas fa-search"></i>
              </button>
              <button v-if="searchKeyword" class="btn btn-outline-danger" type="button" @click="clearSearch">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                <h3 class="mb-2 mb-sm-0 fw-bold text-success">
                    <i class=""></i>Sản phẩm {{ mainListTitle }}
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
                <p v-if="!loadingMainProducts && !mainProductsError">Không có dữ liệu sản phẩm để hiển thị.</p>
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

    <!-- RASA Chatbot Floating Button & Window -->
    <div class="rasa-chat-widget">
      <button @click="toggleChat" class="rasa-chat-button btn btn-success btn-lg rounded-circle shadow">
        <font-awesome-icon :icon="showChat ? 'times' : 'comment-dots'" />
      </button>

      <div v-if="showChat" class="rasa-chat-window card shadow-lg">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Trợ lý OCOP</h5>
          <button @click="toggleChat" class="btn btn-sm btn-link text-white p-0">
            <font-awesome-icon icon="times" size="lg"/>
          </button>
        </div>
        <!-- SỬA ĐỔI PHẦN HIỂN THỊ TIN NHẮN RASA -->
        <div class="card-body rasa-chat-messages" ref="chatContainerRef">
          <div v-for="(msg, index) in chatMessages" :key="index"
              class="message-bubble-wrapper" 
              :class="msg.sender === 'user' ? 'user-message-wrapper' : 'bot-message-wrapper'">

            <!-- Hiển thị Text (nếu có) -->
            <div v-if="msg.text"
                class="message-bubble"
                :class="msg.sender === 'user' ? 'user-message' : 'bot-message'">
              <p class="mb-1" v-html="msg.text.replace(/\n/g, '<br>')"></p>
            </div>

            <!-- Hiển thị Image (nếu có VÀ KHÔNG PHẢI LÀ attachment) -->
            <!-- Hoặc nếu là attachment nhưng không phải generic template -->
            <div v-if="msg.image && (!msg.attachment || msg.attachment?.payload?.template_type !== 'generic')" 
                class="bot-image-container mt-1">
              <img :src="msg.image" alt="Hình ảnh từ bot" class="img-fluid rounded"/>
            </div>

            <!-- Hiển thị Attachment (Carousel - Generic Template) -->
            <div v-if="msg.attachment && msg.attachment.type === 'template' && msg.attachment.payload && msg.attachment.payload.template_type === 'generic'"
                class="bot-carousel-container mt-1">
              <div class="carousel-wrapper">
                <div v-for="(element, elIndex) in msg.attachment.payload.elements" :key="`carousel-${index}-${elIndex}`"
                    class="carousel-card card">
                  <img v-if="element.image_url" :src="element.image_url" class="card-img-top" alt="Hình ảnh sản phẩm">
                  <div class="card-body">
                    <h6 class="card-title" v-if="element.title">{{ element.title }}</h6>
                    <p class="card-text small" v-if="element.subtitle">{{ element.subtitle }}</p>
                    <div v-if="element.buttons && element.buttons.length > 0" class="carousel-buttons mt-auto">
                      <button v-for="(button, btnElIndex) in element.buttons" :key="`carousel-btn-${elIndex}-${btnElIndex}`"
                              @click="sendButtonPayload(button.payload, button.title)"
                              class="btn btn-sm btn-outline-primary me-1 mb-1">
                        {{ button.title }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hiển thị Buttons đơn giản (nếu có và không phải là một phần của carousel đã render ở trên) -->
            <!-- Điều kiện: có msg.buttons VÀ (msg.attachment không phải là generic template HOẶC không có msg.attachment) -->
            <div v-if="msg.buttons && msg.buttons.length > 0 && (!msg.attachment || msg.attachment?.payload?.template_type !== 'generic')" 
                class="mt-2 rasa-buttons" 
                :class="msg.sender === 'user' ? '' : 'bot-message-buttons-standalone'"> <!-- Thêm class để style nếu cần -->
              <button v-for="(button, btnIndex) in msg.buttons" :key="`simple-btn-${index}-${btnIndex}`"
                      @click="sendButtonPayload(button.payload, button.title)"
                      class="btn btn-sm btn-outline-primary me-2 mb-1">
                {{ button.title }}
              </button>
            </div>

          </div>
          <div v-if="isBotTyping" class="message-bubble bot-message typing-indicator">
            <p class="mb-1"><em>Trợ lý đang gõ...</em></p>
          </div>
        </div>
        <!-- KẾT THÚC SỬA ĐỔI PHẦN HIỂN THỊ TIN NHẮN RASA -->
        <div class="card-footer rasa-chat-input-area">
          <div class="input-group">
            <input type="text" v-model="userInput" @keyup.enter="sendUserMessage"
                   class="form-control" placeholder="Nhập tin nhắn..." />
            <button @click="sendUserMessage" class="btn btn-success">
              <font-awesome-icon icon="paper-plane" />
            </button>
          </div>
        </div>
      </div>
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
    faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp,
    faExclamationCircle, faStream,
    faCommentDots, faPaperPlane, faSearch, faTimes // Chat icons, Search, Times
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

library.add(
    faTags, faMapMarkerAlt, faDollarSign, faSyncAlt, faLightbulb, faLeaf,
    faShoppingBasket, faArrowLeft, faChevronDown, faChevronUp, faSearch,
    faExclamationCircle, faStream,
    faCommentDots, faPaperPlane, faTimes
);

const store = useStore();
const toast = useToast();

// --- Constants ---
const PROVINCES = [
   "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];
const CATEGORIES = ["Nông sản khô", "Thực phẩm chế biến", "Đồ uống", "Thảo dược", "Thủ công mỹ nghệ", "Đặc sản vùng miền", "Sản phẩm OCOP", "Khác"];
const PAGE_SIZE = 12;

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
const searchKeyword = ref('');

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
const hasUserSpecificRecs = computed(() => {
    const val = store.getters['recommendation/hasUserSpecificRecommendations'];
    return val;
});


// --- Computed Properties ---
const displayedProvinces = computed(() => {
  if (!Array.isArray(provinces.value)) return [];
  return showAllProvinces.value ? provinces.value : provinces.value.slice(0, initialProvinceCount);
});

const mainListTitle = computed(() => {
    let titleParts = [];
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
        titleParts.push(`cho "${searchKeyword.value.trim()}"`);
    }
    if (selectedCategory.value) {
        titleParts.push(`thuộc "${selectedCategory.value}"`);
    }
    if (selectedProvince.value) {
        titleParts.push(`tại ${selectedProvince.value}`);
    }

    if (titleParts.length > 0) {
        return titleParts.join(' ');
    }
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
  if (isAuthenticated.value) {
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
        if (isAuthenticated.value && !hasUserSpecificRecs.value && !userSpecificRecsError.value && !loadingUserSpecificRecs.value) {
            return 'Chúng tôi chưa có gợi ý nào dành riêng cho bạn lúc này. Hãy khám phá thêm sản phẩm nhé!';
        }
        return 'Chúng tôi đang tìm thêm gợi ý phù hợp.';
    }
    if (title === 'Sản phẩm tương tự đã xem') {
         if (lastViewedProductIdFromStore.value && !hasRelatedRecommendationsFromStore.value && !recommendationErrorFromStore.value && !loadingRecommendationsFromStore.value) {
            return 'Chưa có sản phẩm tương tự nào. Hãy thử xem một sản phẩm khác.';
        }
        return 'Xem một sản phẩm để chúng tôi gợi ý các sản phẩm tương tự.';
    }
    return 'Hiện chưa có sản phẩm nổi bật nào. Vui lòng quay lại sau!';
});

const mapProductDataForCard = (p) => {
  // p có thể là sản phẩm từ /api/products (có _id là Mongo ObjectId)
  // hoặc sản phẩm từ /api/recommendations (sau khi sửa, cũng nên có _id là Mongo ObjectId)
  let mongoId = p._id; // Ưu tiên _id trực tiếp
  let mainImage = '/images/placeholder-image.png';

  if (Array.isArray(p.images) && p.images.length > 0) {
    mainImage = p.images[0];
  } else if (p.image_url) { // Fallback cho trường hợp API gợi ý trả về image_url
    mainImage = p.image_url;
  }

  return {
    _id: String(mongoId || p.product_id || p.original_id), // p.product_id là original_id từ gợi ý
    name: p.name || 'N/A',
    images: [mainImage], // Luôn trả về mảng images cho ProductCard
    price: p.price,
    rating: p.rating || p.ocop_rating, // Lấy rating từ nhiều nguồn có thể
    numReviews: p.numReviews || 0,
    // Thêm các trường khác mà ProductCard cần
    category: p.category,
    origin: p.origin, // Nếu có
    // original_id_debug: p.original_id || p.product_id // Để debug nếu cần
  };
};

const suggestedProductsToDisplay = computed(() => {
    const title = suggestionSectionTitle.value;
    if (typeof title === 'string' && title.includes('Dành riêng cho') && isAuthenticated.value && hasUserSpecificRecs.value) {
        return (userSpecificRecommendationsFromStore.value || []).map(mapProductDataForCard);
    }
    if (typeof title === 'string' && title.includes('Gợi ý cho') && isAuthenticated.value) {
        return [];
    }
    if (title === 'Sản phẩm tương tự đã xem' && hasRelatedRecommendationsFromStore.value) {
        return (relatedRecommendationsFromStore.value || []).map(mapProductDataForCard);
    }
    if (title === 'Sản phẩm nổi bật') {
        if (Array.isArray(defaultSuggestedProducts.value) && defaultSuggestedProducts.value.length > 0) {
            return defaultSuggestedProducts.value.map(mapProductDataForCard);
        }
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
    let effectivePageSize = PAGE_SIZE; // Giá trị pageSize mặc định
    let effectivePage = page;

    // NẾU CÓ TỪ KHÓA TÌM KIẾM, KHÔNG PHÂN TRANG (HIỂN THỊ TẤT CẢ)
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      effectivePageSize = -1; // Gửi -1 (hoặc một số lớn, ví dụ 10000) để backend hiểu là lấy tất cả
                            // Hoặc bạn có thể KHÔNG gửi 'perPage' và 'page' luôn
                            // Tuy nhiên, việc gửi -1 và để backend xử lý sẽ rõ ràng hơn.
      effectivePage = 1;    // Khi lấy tất cả, luôn coi là trang 1
    }

    const apiParams = {
        // page: effectivePage, // Tạm thời bỏ page khi searchKeyword có giá trị
        // perPage: effectivePageSize, // Tạm thời bỏ perPage khi searchKeyword có giá trị
        category: selectedCategory.value,
        origin: selectedProvince.value,
        priceMin: filterPrice.value.min,
        priceMax: filterPrice.value.max,
        sort_by: sortBy.value,
    };

    // Chỉ thêm page và perPage nếu KHÔNG có searchKeyword hoặc searchKeyword rỗng
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      apiParams.keyword = searchKeyword.value.trim();
      // Khi có keyword, KHÔNG gửi 'page' và 'per_page'
      // Backend sẽ hiểu là lấy tất cả kết quả khớp keyword.
      console.log(`Fetching with keyword: '${apiParams.keyword}'. No pagination params sent.`);
    } else {
      // Khi KHÔNG có keyword (hoặc keyword rỗng), gửi 'page' và 'per_page' để phân trang
      apiParams.page = page;
      apiParams.per_page = PAGE_SIZE;
      console.log(`Fetching without keyword. Page: ${apiParams.page}, Per Page: ${apiParams.per_page}`);
    }


    // Remove null or empty string parameters
    Object.keys(apiParams).forEach(key => {
        if (apiParams[key] == null || apiParams[key] === '' || apiParams[key] === undefined) {
            delete apiParams[key];
        }
    });

    console.log("HomePage.vue - About to dispatch fetchMainProducts with apiParams:", JSON.stringify(apiParams));
    await store.dispatch('product/fetchMainProducts', apiParams);

  } catch (error) {
    if(!mainProductsError.value && error.message && !error.message.includes('aborted')) {
        toast.error(error?.response?.data?.message || error?.error || error?.message || "Lỗi tải sản phẩm.");
    } else if (!mainProductsError.value && !error.message) {
        toast.error("Lỗi tải sản phẩm không xác định.");
    }
    console.error("Error fetching main product list in HomePage.vue:", error);
  }
};

const fetchSuggestionData = () => {
    const title = suggestionSectionTitle.value;
    if (typeof title === 'string' && (title.includes('Dành riêng cho') || title.includes('Gợi ý cho'))) {
        if (isAuthenticated.value && !loadingUserSpecificRecs.value) {
            store.dispatch('recommendation/fetchUserSpecificRecommendations');
        }
    } else if (title === 'Sản phẩm tương tự đã xem') {
        if (lastViewedProductIdFromStore.value && !loadingRecommendationsFromStore.value) {
            store.dispatch('recommendation/fetchRelatedRecommendations', {
                productId: lastViewedProductIdFromStore.value, topN: 8
            });
        }
    } else { // Sản phẩm nổi bật
        if (!defaultSuggestedProducts.value || defaultSuggestedProducts.value.length === 0 && !loadingDefaultSuggested.value) {
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

const handleSearch = () => {
  // Khi tìm kiếm, luôn fetch từ trang 1 và logic bỏ qua page/per_page sẽ được áp dụng
  // trong fetchMainProductList nếu searchKeyword có giá trị.
  console.log("Handling search for keyword:", searchKeyword.value);
  fetchMainProductList(1); // Gọi fetchMainProductList, nó sẽ tự xử lý việc có gửi page/per_page hay không
};

const clearSearch = () => {
  searchKeyword.value = '';
  console.log("Search cleared, fetching all products (paginated)");
  fetchMainProductList(1); // Fetch lại với keyword rỗng, sẽ có phân trang
};

const applyFiltersAndFetch = (page = 1) => { fetchMainProductList(page); };
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
    searchKeyword.value = ''; // Reset cả searchKeyword

    store.dispatch('product/clearProductState'); // Nếu có
    console.log("All filters reset, fetching paginated products from page 1");
    fetchMainProductList(1); // Gọi fetch với keyword rỗng, sẽ phân trang

    store.dispatch('recommendation/clearAllRecommendationData');
    defaultSuggestedProducts.value = [];
    nextTick(fetchSuggestionData);
};

const changePage = (newPage) => {
    const currentPagination = pagination.value || { page: 1, pages: 0 };
    // Kiểm tra newPage có hợp lệ và khác trang hiện tại không
    if (newPage >= 1 && newPage <= currentPagination.pages && newPage !== currentPagination.page) {
        console.log(`Changing page to: ${newPage}`); // DEBUG
        applyFiltersAndFetch(newPage); // Hoặc trực tiếp fetchMainProductList(newPage)

        // Scroll to top of product list after page change
        const productListElement = document.getElementById('productListSection');
        if (productListElement) {
            productListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        console.log(`Not changing page. newPage: ${newPage}, currentPage: ${currentPagination.page}, totalPages: ${currentPagination.pages}`); // DEBUG
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

// --- RASA CHATBOT STATE ---
const showChat = ref(false);
const chatMessages = ref([]);
const userInput = ref('');
const isBotTyping = ref(false);
const RASA_SENDER_ID = `web_user_${Date.now()}`;
const RASA_WEBHOOK_URL = 'http://localhost:5005/webhooks/rest/webhook';

// --- RASA CHATBOT METHODS ---
const toggleChat = () => {
  showChat.value = !showChat.value;
  if (showChat.value && chatMessages.value.length === 0) {
    // You can send an initial greeting if desired
    // sendToRasa('/greet'); // Example: send an intent or payload
  }
};

const sendUserMessage = async () => {
  if (!userInput.value.trim()) return;

  const messageText = userInput.value.trim();
  chatMessages.value.push({ sender: 'user', text: messageText });
  userInput.value = '';
  isBotTyping.value = true; 
  scrollToChatBottom();

  console.log(`Sending to Rasa: Sender: ${RASA_SENDER_ID}, Message: ${messageText}`); // DEBUG

  try {
    const response = await axios.post(RASA_WEBHOOK_URL, {
      sender: RASA_SENDER_ID,
      message: messageText,
    });

    console.log("Raw response from Rasa (sendUserMessage):", JSON.parse(JSON.stringify(response))); // DEBUG
    console.log("Response.data from Rasa (sendUserMessage):", JSON.parse(JSON.stringify(response.data))); // DEBUG

    isBotTyping.value = false;
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach(botMsg => {
        console.log("Processing individual botMsg (array):", JSON.parse(JSON.stringify(botMsg))); // DEBUG
        if (typeof botMsg === 'object' && botMsg !== null) {
          chatMessages.value.push({
            sender: 'bot',
            text: botMsg.text || "",
            buttons: botMsg.buttons || [],
            image: botMsg.image || null,        
            attachment: botMsg.attachment || null 
          });
        } else {
          console.warn("Received non-object bot message (array):", botMsg);
          chatMessages.value.push({ sender: 'bot', text: String(botMsg || "") });
        }
      });
    } else if (response.data && typeof response.data === 'object' && (response.data.text || response.data.image || response.data.attachment || response.data.buttons)) {
       console.log("Processing single object botMsg:", JSON.parse(JSON.stringify(response.data))); // DEBUG
       chatMessages.value.push({
          sender: 'bot',
          text: response.data.text || "",
          buttons: response.data.buttons || [],
          image: response.data.image || null,      
          attachment: response.data.attachment || null 
       });
    }
    else {
      console.warn("Unexpected response structure from Rasa or empty response data (sendUserMessage):", JSON.parse(JSON.stringify(response.data)));
      // Có thể không cần push message lỗi ở đây nếu Rasa không trả về gì (ví dụ action không utter)
      // Hoặc nếu muốn, có thể push một message chung chung hơn
      // chatMessages.value.push({ sender: 'bot', text: "..." });
    }
  } catch (error) {
    console.error("Error sending message to Rasa (sendUserMessage):", error);
    isBotTyping.value = false;
    if (error.isAxiosError && !error.response) {
        chatMessages.value.push({ sender: 'bot', text: "Lỗi kết nối đến trợ lý. Vui lòng thử lại." });
    } else if (error.response) {
        chatMessages.value.push({ sender: 'bot', text: `Trợ lý gặp lỗi: ${error.response.status}. Vui lòng thử lại.` });
    } else {
        chatMessages.value.push({ sender: 'bot', text: "Có lỗi không xác định khi giao tiếp với trợ lý." });
    }
  }
  scrollToChatBottom();
};

const sendButtonPayload = async (payload, title) => {
  if (title) {
    chatMessages.value.push({ sender: 'user', text: title });
  }
  isBotTyping.value = true; 
  scrollToChatBottom(); 

  console.log(`Sending payload to Rasa: Sender: ${RASA_SENDER_ID}, Payload: ${payload}`); // DEBUG

  try {
    const response = await axios.post(RASA_WEBHOOK_URL, {
      sender: RASA_SENDER_ID,
      message: payload,
    });

    console.log("Raw response from Rasa (sendButtonPayload):", JSON.parse(JSON.stringify(response))); // DEBUG
    console.log("Response.data from Rasa (sendButtonPayload):", JSON.parse(JSON.stringify(response.data))); // DEBUG

    isBotTyping.value = false;
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach(botMsg => {
        console.log("Processing individual botMsg from payload (array):", JSON.parse(JSON.stringify(botMsg))); // DEBUG
        if (typeof botMsg === 'object' && botMsg !== null) {
          chatMessages.value.push({
            sender: 'bot',
            text: botMsg.text || "",
            buttons: botMsg.buttons || [],
            image: botMsg.image || null,  
            attachment: botMsg.attachment || null 
          });
        } else {
          console.warn("Received non-object bot message from payload response (array):", botMsg);
          chatMessages.value.push({ sender: 'bot', text: String(botMsg || "") });
        }
      });
    } else if (response.data && typeof response.data === 'object' && (response.data.text || response.data.image || response.data.attachment || response.data.buttons)) {
      console.log("Processing single object botMsg from payload:", JSON.parse(JSON.stringify(response.data))); // DEBUG
       chatMessages.value.push({
          sender: 'bot',
          text: response.data.text || "",
          buttons: response.data.buttons || [],
          image: response.data.image || null, 
          attachment: response.data.attachment || null
       });
    } else {
      console.warn("Empty or unexpected response from Rasa after sending payload:", JSON.parse(JSON.stringify(response.data)));
    }
  } catch (error) {
    console.error("Error sending payload to Rasa (sendButtonPayload):", error);
    isBotTyping.value = false;
    // Xử lý lỗi tương tự như sendUserMessage
    if (error.isAxiosError && !error.response) {
        chatMessages.value.push({ sender: 'bot', text: "Lỗi kết nối khi xử lý lựa chọn. Vui lòng thử lại." });
    } else if (error.response) {
        chatMessages.value.push({ sender: 'bot', text: `Trợ lý gặp lỗi: ${error.response.status} khi xử lý lựa chọn.` });
    } else {
        chatMessages.value.push({ sender: 'bot', text: "Có lỗi không xác định khi xử lý lựa chọn." });
    }
  }
  scrollToChatBottom();
};

const chatContainerRef = ref(null);
const scrollToChatBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

watch(chatMessages, () => {
  scrollToChatBottom();
}, { deep: true });

// --- Lifecycle Hooks & Watchers (Existing) ---
onMounted(() => {
  store.dispatch('product/clearProductState');
  store.dispatch('recommendation/clearAllRecommendationData');
  defaultSuggestedProducts.value = [];
  fetchMainProductList();
  nextTick(() => {
      fetchSuggestionData();
  });
});

watch(isAuthenticated, (loggedIn, previouslyLoggedIn) => {
  if (loggedIn !== previouslyLoggedIn) {
    store.dispatch('recommendation/clearAllRecommendationData');
    defaultSuggestedProducts.value = [];
    nextTick(fetchSuggestionData);
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
    if (newTitle === oldTitle || isFetchingSuggestionsByTitleDebounced || loadingSuggestedSectionComputed.value) {
      return;
    }
    clearTimeout(titleWatcherTimeout);
    titleWatcherTimeout = setTimeout(() => {
        if (!loadingSuggestedSectionComputed.value) {
            isFetchingSuggestionsByTitleDebounced = true;
            fetchSuggestionData();
            setTimeout(() => { isFetchingSuggestionsByTitleDebounced = false; }, 700);
        }
    }, 250);
}, { immediate: true });

</script>

<style scoped>
/* CSS CỦA BANNER */
.banner {
  position: relative;
  width: 100%;
  min-height: 20px; /* Adjusted from 250px/300px if it's too tall */
  background: linear-gradient(135deg, #198754 0%, #63d471 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  border-radius: 0.5rem;
  padding: 2rem 1rem; /* Reduced padding a bit */
  font-family: 'Arial', sans-serif;
}
.banner__title {
  font-size: 2rem; /* Adjusted for better fit */
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
.banner__subtitle {
  font-size: 1.1rem; /* Adjusted for better fit */
  margin: 0.5rem 0 0;
  max-width: 90%;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}
@media (max-width: 768px) {
  .banner { min-height: 200px; padding: 1.5rem 10px; } /* Adjusted from 200px */
  .banner__title { font-size: 1.6rem; }
  .banner__subtitle { font-size: 1rem; }
}
@media (max-width: 576px) {
  .banner { min-height: 180px; padding: 1rem 10px; } /* Adjusted from 180px */
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

/* RASA CHATBOT STYLES */
.rasa-chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.rasa-chat-button {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rasa-chat-window {
  position: fixed;
  bottom: 90px; /* Đảm bảo không che nút toggle */
  right: 20px;
  width: 370px; /* Tăng nhẹ chiều rộng */
  max-width: calc(100vw - 40px); /* Giới hạn chiều rộng trên màn hình nhỏ */
  height: 550px; /* Tăng nhẹ chiều cao */
  max-height: calc(100vh - 120px); /* Giới hạn chiều cao, trừ header và input */
  border-radius: 0.75rem; /* Bo góc lớn hơn */
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15); /* Tăng shadow */
}

.rasa-chat-window .card-header {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  padding: 0.75rem 1rem; /* Điều chỉnh padding */
}
.rasa-chat-window .card-header h5 {
    font-size: 1.05rem; /* Giảm nhẹ font size */
}

.rasa-chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem 0.75rem; /* Điều chỉnh padding */
  display: flex;
  flex-direction: column;
  /* gap: 0.75rem; Bỏ gap ở đây, xử lý margin ở message-bubble-wrapper */
}
.rasa-chat-messages::-webkit-scrollbar {
  width: 6px;
}
.rasa-chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.message-bubble-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.75rem; /* Thêm margin giữa các khối message */
}
.user-message-wrapper {
  align-items: flex-end;
}
.bot-message-wrapper {
  align-items: flex-start;
}

.message-bubble {
  padding: 0.6rem 0.9rem;
  border-radius: 1rem;
  max-width: 85%; /* Tăng max-width */
  word-wrap: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Thêm shadow nhẹ */
}

.message-bubble p {
    margin-bottom: 0 !important; /* Đảm bảo không có margin thừa */
}

.user-message {
  background-color: #007bff; /* Màu xanh dương cho user */
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 0.25rem;
}

.bot-message {
  background-color: #f1f3f5; /* Màu xám nhạt cho bot */
  color: #212529;
  align-self: flex-start;
  border-bottom-left-radius: 0.25rem;
}

.typing-indicator {
  font-style: italic;
  color: #6c757d; /* Màu xám đậm hơn */
}

.rasa-buttons {
    align-self: flex-start; /* Căn các button theo bot message */
    max-width: 85%; /* Giống message bubble */
    margin-top: 0.25rem; /* Khoảng cách nhỏ với text bubble nếu có */
}
.rasa-buttons button {
    font-size: 0.8rem; /* Giảm nhẹ font size button */
    padding: 0.3rem 0.6rem;
    border-color: #6c757d; /* Màu xám cho outline */
    color: #495057;
    background-color: white; /* Nền trắng */
    margin-right: 0.5rem !important; /* Thêm !important nếu cần */
    margin-bottom: 0.25rem !important;
    border-radius: 0.75rem; /* Bo tròn hơn */
}
.rasa-buttons button:hover {
    background-color: #e9ecef; /* Hover xám nhạt */
    color: #212529;
    border-color: #adb5bd;
}

.bot-image-container {
    align-self: flex-start;
    max-width: 85%;
    margin-top: 0.25rem; /* Nếu text ở trên */
    background-color: #f1f3f5; /* Nền giống bot message */
    padding: 5px; /* Padding nhỏ quanh ảnh */
    border-radius: 1rem;
    border-bottom-left-radius: 0.25rem;
}
.bot-image-container img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain; /* Giữ tỷ lệ ảnh */
  border-radius: calc(1rem - 5px); /* Bo góc trong */
}

.bot-carousel-container {
  width: 100%;
  max-width: 330px; /* Điều chỉnh để vừa với cửa sổ chat */
  align-self: flex-start;
  margin-top: 0.25rem; /* Nếu text ở trên */
}

.carousel-wrapper {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
  gap: 8px; /* Giảm gap */
}

.carousel-card {
  min-width: 180px; /* Giảm chiều rộng card */
  max-width: 220px;
  flex-shrink: 0;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem; /* Bo góc card */
  background-color: white;
  display: flex; /* Cho phép card body co giãn */
  flex-direction: column; /* Sắp xếp nội dung theo chiều dọc */
}
.carousel-card .card-img-top {
  height: 100px; /* Giảm chiều cao ảnh */
  object-fit: cover;
  border-top-left-radius: calc(0.5rem - 1px); /* Bo góc theo card */
  border-top-right-radius: calc(0.5rem - 1px);
}
.carousel-card .card-body {
  padding: 0.6rem; /* Giảm padding body */
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Cho phép card body chiếm không gian */
}
.carousel-card .card-title {
  font-size: 0.85rem;
  font-weight: 600; /* Đậm hơn */
  margin-bottom: 0.2rem;
  color: #343a40;
  /* Giới hạn số dòng cho title */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.5em; /* Đảm bảo không gian cho 2 dòng title */
}
.carousel-card .card-text {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* Đẩy buttons xuống dưới */
}
.carousel-buttons {
    margin-top: auto; /* Đẩy buttons xuống cuối card-body */
    padding-top: 0.4rem; /* Khoảng cách với text */
    border-top: 1px solid #f1f1f1; /* Đường kẻ nhẹ */
    width: 100%;
}
.carousel-buttons button {
  font-size: 0.7rem !important;
  padding: 0.25rem 0.5rem !important; /* Padding nhỏ hơn cho button trong carousel */
  width: 100%; /* Button chiếm hết chiều rộng */
  margin-bottom: 0.25rem !important; /* Khoảng cách giữa các button nếu có nhiều */
}
.carousel-buttons button:last-child {
    margin-bottom: 0 !important;
}


.rasa-chat-input-area {
  padding: 0.75rem;
  border-top: 1px solid #e0e0e0; /* Đường kẻ rõ hơn */
  background-color: #f8f9fa; /* Nền nhẹ cho input area */
}
.rasa-chat-input-area .form-control {
    font-size: 0.9rem;
    border-right: none; /* Bỏ border phải của input */
    border-top-left-radius: 1rem; /* Bo góc input */
    border-bottom-left-radius: 1rem;
}
.rasa-chat-input-area .form-control:focus {
    box-shadow: none;
    border-color: #198754;
}
.rasa-chat-input-area .btn {
    font-size: 0.9rem;
    border-top-right-radius: 1rem; /* Bo góc button */
    border-bottom-right-radius: 1rem;
    border-left: none; /* Bỏ border trái của button */
}


@media (max-width: 576px) {
  .rasa-chat-window {
    width: calc(100vw - 30px); /* Gần full width hơn */
    max-width: none;
    height: calc(100vh - 80px); 
    max-height: none;
    bottom: 70px; 
    right: 15px;
    left: 15px;
    border-radius: 0.5rem; /* Giảm bo góc trên mobile */
  }
  .rasa-chat-button {
    bottom: 15px;
    right: 15px;
    width: 55px;
    height: 55px;
  }
  .carousel-card {
    min-width: 160px; /* Card nhỏ hơn nữa trên mobile */
  }
}
</style>