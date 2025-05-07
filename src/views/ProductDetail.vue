<template>
  <div class="product-detail container my-5">
    <!-- Trạng thái Loading -->
    <div v-if="loadingProductDetails" class="text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
    </div>

    <!-- Trạng thái Lỗi hoặc Không tìm thấy -->
    <div v-else-if="productError || !product" class="text-center py-5 card border-light shadow-sm mx-auto" style="max-width: 600px;">
       <div class="card-body">
            <i class="fas fa-exclamation-circle fa-3x text-danger mb-3" v-if="productError"></i>
            <i class="fas fa-question-circle fa-3x text-secondary mb-3" v-else></i>
            <p class="text-danger fw-semibold mb-3" v-if="productError">{{ productError }}</p>
            <p class="text-muted" v-else>Sản phẩm không tồn tại hoặc đã bị xóa.</p>
            <router-link :to="{ name: 'Home' }" class="btn btn-secondary mt-2"> <!-- Giả sử có route tên là 'Home' -->
                <i class="fas fa-arrow-left me-1"></i> Quay lại mua sắm
            </router-link>
       </div>
    </div>

    <!-- Nội dung chi tiết sản phẩm -->
    <div v-else>
      <div class="card shadow-sm border-light overflow-hidden">
        <div class="row g-0">
          <!-- Cột Ảnh sản phẩm -->
          <div class="col-lg-6">
            <div class="product-images p-3">
              <div class="mb-3 rounded border overflow-hidden" style="aspect-ratio: 1 / 1;">
                <img
                  :src="activeImage || placeholderImg"
                  :alt="product.name"
                  class="img-fluid w-100 h-100"
                   style="object-fit: contain; background-color: #f8f9fa;"
                   @error="onImageError"
                >
              </div>
              <div v-if="allImages.length > 1" class="d-flex flex-wrap gap-2 justify-content-center">
                <div
                  v-for="(image, index) in allImages"
                  :key="index"
                  @click="setActiveImage(image)"
                  class="cursor-pointer rounded overflow-hidden border border-2 p-1"
                  :class="activeImage === image ? 'border-success' : 'border-transparent'"
                  style="width: 65px; height: 65px;"
                >
                  <img :src="image || placeholderImg" :alt="`${product.name} - Ảnh ${index + 1}`" class="img-fluid w-100 h-100" style="object-fit: cover;" @error="onThumbnailError(index)">
                </div>
              </div>
            </div>
          </div>

          <!-- Cột Thông tin & Mua hàng -->
          <div class="col-lg-6">
            <div class="card-body p-4">
              <h1 class="h3 fw-bold text-dark mb-2">{{ product.name }}</h1>
              <div class="d-flex align-items-center mb-3 small">
                <div class="text-warning me-2">
                  <i v-for="i in 5" :key="`star-${i}`" class="fa-star" :class="i <= (product.rating || 0) ? 'fas' : 'far'"></i>
                </div>
                <a href="#reviews-tab-pane" @click.prevent="setActiveTab('reviews-tab')" class="text-muted text-decoration-none me-3">({{ product.numReviews || 0 }} đánh giá)</a>
                <span class="border-start ps-3 text-muted">Đã bán {{ product.sold || 0 }}</span>
              </div>
              <div class="mb-4 bg-light p-3 rounded">
                <span class="h4 fw-bold text-danger me-2">{{ formatPrice(product.price) }}</span>
                 <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-muted text-decoration-line-through me-2">{{ formatPrice(product.originalPrice) }}</span>
                 <span v-if="product.discountPercent" class="badge bg-danger rounded-pill">-{{ product.discountPercent }}%</span>
              </div>
              <div v-if="product.variants && product.variants.length > 0" class="mb-4">
                  <h6 class="fw-medium mb-2">Phân loại:</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      v-for="variant in product.variants"
                      :key="variant._id"
                      @click="selectedVariant = variant"
                      type="button"
                      class="btn btn-sm"
                      :class="selectedVariant && selectedVariant._id === variant._id ? 'btn-success' : 'btn-outline-secondary'"
                    >
                      {{ variant.name }}
                       <small v-if="variant.priceAdjust && variant.priceAdjust !== 0">({{ formatPriceAdjustment(variant.priceAdjust) }})</small>
                    </button>
                  </div>
                   <div v-if="selectedVariant && selectedVariant.priceAdjust" class="mt-2 small text-muted">
                       Giá cuối: {{ formatPrice(product.price + selectedVariant.priceAdjust) }}
                   </div>
              </div>
              <div class="mb-4">
                <label for="quantity" class="form-label fw-medium">Số lượng:</label>
                <div class="d-flex align-items-center">
                  <div class="input-group input-group-sm me-3" style="max-width: 120px;">
                    <button class="btn btn-outline-secondary px-2" type="button" @click="quantity > 1 ? quantity-- : null" :disabled="quantity <= 1 || finalCountInStock === 0">
                       <i class="fas fa-minus"></i>
                    </button>
                    <input
                      id="quantity"
                      v-model.number="quantity"
                      @input="validateQuantity"
                      type="number"
                      min="1"
                      :max="finalCountInStock"
                      class="form-control text-center no-spinners"
                      :disabled="finalCountInStock === 0"
                    >
                    <button class="btn btn-outline-secondary px-2" type="button" @click="quantity < finalCountInStock ? quantity++ : null" :disabled="quantity >= finalCountInStock || finalCountInStock === 0">
                       <i class="fas fa-plus"></i>
                    </button>
                  </div>
                   <span class="text-muted small">{{ finalCountInStock }} sản phẩm có sẵn</span>
                </div>
                  <div v-if="finalCountInStock === 0" class="text-danger small mt-1">Sản phẩm tạm hết hàng</div>
              </div>
              <div class="row g-2">
                <div class="col-6 d-grid">
                  <button @click="addToCartHandler" class="btn btn-outline-success btn-lg" :disabled="finalCountInStock === 0 || isAddingToCart">
                    <span v-if="isAddingToCart" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="fas fa-cart-plus me-1"></i> {{ isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ' }}
                  </button>
                </div>
                <div class="col-6 d-grid">
                  <button @click="buyNowHandler" class="btn btn-success btn-lg" :disabled="finalCountInStock === 0 || isAddingToCart">Mua ngay</button>
                </div>
              </div>
              <div v-if="product.distributor" class="mt-4 pt-3 border-top">
                 <small class="text-muted d-block mb-1">Cung cấp bởi:</small>
                 <div class="d-flex align-items-center">
                     <div class="rounded-circle bg-secondary-subtle me-2 d-flex align-items-center justify-content-center flex-shrink-0" style="width:35px; height:35px;"><i class="fas fa-store text-secondary"></i></div>
                      <div class="overflow-hidden">
                           <router-link :to="`/shop/${product.distributor._id}`" class="fw-medium text-dark text-decoration-none">{{ product.distributor.distributorInfo?.companyName || product.distributor.name || 'Nhà phân phối' }}</router-link>
                      </div>
                       <router-link :to="`/shop/${product.distributor._id}`" class="btn btn-sm btn-outline-secondary ms-auto flex-shrink-0">Xem cửa hàng</router-link>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
          <div class="card shadow-sm border-light">
              <div class="card-header bg-light">
                 <ul class="nav nav-tabs card-header-tabs" id="productTab" role="tablist">
                     <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="details-tab" data-bs-toggle="tab" data-bs-target="#details-tab-pane" type="button" role="tab">Thông tin chi tiết</button>
                     </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="description-tab" data-bs-toggle="tab" data-bs-target="#description-tab-pane" type="button" role="tab">Mô tả sản phẩm</button>
                     </li>
                      <li class="nav-item" role="presentation">
                        <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews-tab-pane" type="button" role="tab" ref="reviewsTabButton">
                           Đánh giá ({{ product.numReviews || 0 }})
                        </button>
                     </li>
                 </ul>
              </div>
              <div class="card-body p-4">
                 <div class="tab-content" id="productTabContent">
                     <div class="tab-pane fade show active" id="details-tab-pane" role="tabpanel">
                         <h5 class="mb-3 fw-semibold">Thông tin chi tiết</h5>
                          <dl class="row">
                            <dt class="col-sm-3">Danh mục:</dt><dd class="col-sm-9">{{ product.category?.name || product.category || 'Đang cập nhật' }}</dd>
                            <dt class="col-sm-3">Thương hiệu:</dt><dd class="col-sm-9">{{ product.brand || 'Đang cập nhật' }}</dd>
                            <dt class="col-sm-3">Xuất xứ:</dt><dd class="col-sm-9">{{ product.origin || 'Việt Nam' }}</dd>
                            <dt class="col-sm-3">Chứng nhận OCOP:</dt><dd class="col-sm-9">{{ product.ocop_rating ? `${product.ocop_rating} sao` : 'Không' }}</dd>
                            <dt class="col-sm-3">Bảo quản:</dt><dd class="col-sm-9">{{ product.preservation || 'Nơi khô ráo, thoáng mát' }}</dd>
                            <dt class="col-sm-3">Hạn sử dụng:</dt><dd class="col-sm-9">{{ product.expiry || 'Xem trên bao bì' }}</dd>
                          </dl>
                     </div>
                     <div class="tab-pane fade" id="description-tab-pane" role="tabpanel">
                           <h5 class="mb-3 fw-semibold">Mô tả sản phẩm</h5>
                           <div class="product-description-content" v-html="product.description || '<p><em>Chưa có mô tả chi tiết cho sản phẩm này.</em></p>'"></div>
                     </div>
                     <div class="tab-pane fade" id="reviews-tab-pane" role="tabpanel">
                          <h5 class="mb-3 fw-semibold">Đánh giá từ khách hàng</h5>
                          <div v-if="product.reviews && product.reviews.length > 0">
                              <div v-for="review in product.reviews" :key="review._id" class="mb-4 pb-3 border-bottom">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                   <span class="fw-medium">{{ review.name }}</span>
                                   <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
                                </div>
                                 <div class="mb-2 text-warning small">
                                     <i v-for="i in 5" :key="`review-star-${i}`" class="fa-star" :class="i <= review.rating ? 'fas' : 'far'"></i>
                                 </div>
                                 <p class="mb-0 text-dark" style="white-space: pre-wrap;">{{ review.comment }}</p>
                              </div>
                          </div>
                           <div v-else class="text-center text-muted py-4">Chưa có đánh giá nào cho sản phẩm này.</div>
                           <div v-if="isLoggedIn && canReview" class="mt-4 pt-4 border-top">
                               <h6 class="fw-semibold mb-3">Viết đánh giá của bạn</h6>
                                <form @submit.prevent="submitReviewHandler" class="needs-validation" novalidate ref="reviewForm">
                                    <div class="mb-2">
                                        <label class="form-label small">Chọn số sao:</label>
                                        <div class="d-flex align-items-center rating-stars">
                                           <i v-for="i in 5" :key="`rating-${i}`" class="fas fa-star fa-lg"
                                              :class="{ 'text-warning': i <= (hoverRating || userRating), 'text-secondary': i > (hoverRating || userRating) }"
                                              @click="userRating = i" @mouseover="hoverRating = i" @mouseleave="hoverRating = 0"
                                              style="cursor: pointer; margin-right: 5px;"></i>
                                        </div>
                                         <input type="number" v-model="userRating" required hidden>
                                    </div>
                                    <div class="mb-3">
                                        <label for="reviewComment" class="form-label small">Nhận xét của bạn:</label>
                                        <textarea id="reviewComment" v-model.trim="userReview" rows="3" class="form-control" placeholder="Chia sẻ cảm nhận của bạn..." required></textarea>
                                         <div class="invalid-feedback">Vui lòng nhập nhận xét.</div>
                                    </div>
                                    <button type="submit" class="btn btn-sm btn-success" :disabled="!userRating || !userReview || isSubmittingReview">
                                        <span v-if="isSubmittingReview" class="spinner-border spinner-border-sm me-1"></span>
                                        <i v-else class="fas fa-paper-plane me-1"></i>
                                        {{ isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá' }}
                                    </button>
                                </form>
                           </div>
                            <div v-else-if="!isLoggedIn" class="mt-4 text-center text-muted border-top pt-3">
                               <small>Vui lòng <router-link :to="{ name: 'Login', query: { redirect: $route.fullPath } }">đăng nhập</router-link> để để lại đánh giá.</small>
                           </div>
                           <div v-else-if="!canReview && hasReviewed" class="mt-4 text-center text-muted border-top pt-3">
                               <small>Bạn đã đánh giá sản phẩm này.</small>
                           </div>
                     </div>
                 </div>
              </div>
          </div>
      </div>

      <!-- Gợi ý Sản phẩm Tương Tự (ĐÃ TÍCH HỢP LOGIC MỚI) -->
      <section v-if="hasRelatedRecommendations || loadingRecommendations" class="related-products-section mt-5 pt-4 border-top">
        <h3 class="mb-4 fw-bold text-success">
          <i class="fas fa-stream me-2"></i>Sản phẩm bạn có thể thích
        </h3>
        <div v-if="loadingRecommendations" class="text-center py-4">
            <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
            <p class="mt-2 text-muted">Đang tải gợi ý...</p>
        </div>
        <div v-else-if="relatedRecommendations.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          <div v-for="recProduct in relatedRecommendations" :key="'related-' + recProduct.product_id" class="col">
            <product-card :product="{
                _id: String(recProduct.product_id), // Đảm bảo _id là string nếu ProductCard cần
                original_id: recProduct.product_id, // Giữ lại ID gốc từ API gợi ý
                name: recProduct.name,
                images: recProduct.image_url ? [recProduct.image_url] : [placeholderImg], // Đảm bảo images là mảng và có placeholder
                price: recProduct.price,
                rating: recProduct.ocop_rating, // Hoặc một trường rating khác
                numReviews: 0, // API gợi ý thường không có thông tin này
                countInStock: 1, // Mặc định là còn hàng cho sản phẩm gợi ý
              }"
              @add-to-cart="handleAddToCartFromRecommendation"
            />
          </div>
        </div>
        <p v-else-if="recommendationError && !loadingRecommendations" class="text-center text-danger py-3">
          <i class="fas fa-exclamation-triangle me-1"></i> Lỗi khi tải gợi ý: {{ recommendationError }}
        </p>
        <!-- Không hiển thị gì nếu không có lỗi và không có gợi ý (relatedRecommendations rỗng) -->
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import ProductCard from '@/components/products/ProductCard.vue'; // Đảm bảo đường dẫn đúng
// ... (các imports icon của bạn) ...

// ... (library.add(...) của bạn) ...

const store = useStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const product = ref(null);
const loadingProductDetails = ref(true);
const productError = ref(null);
const quantity = ref(1);
const activeImage = ref(null);
const selectedVariant = ref(null);
const userRating = ref(0);
const hoverRating = ref(0);
const userReview = ref('');
const placeholderImg = ref('/images/placeholder-image.png'); // Cập nhật đường dẫn placeholder
const isAddingToCart = ref(false);
const isSubmittingReview = ref(false);
let recommendationTimer = null;
const RECOMMENDATION_DELAY = 5000; // 5 giây
const reviewsTabButton = ref(null); // Cho tab reviews

// Vuex Getters (auth)
const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
const currentUser = computed(() => store.getters['auth/currentUser']);

// Vuex Getters (recommendation) - dùng để hiển thị gợi ý sản phẩm tương tự
const relatedRecommendations = computed(() => store.getters['recommendation/relatedRecommendations']);
const loadingRecommendations = computed(() => store.getters['recommendation/loadingRecommendations']);
const recommendationError = computed(() => store.getters['recommendation/recommendationError']);
const hasRelatedRecommendations = computed(() => store.getters['recommendation/hasRelatedRecommendations']);

// Computed properties
const allImages = computed(() => {
  if (!product.value) return [placeholderImg.value];
  const primaryImage = product.value.image; // Giả sử product.image là ảnh chính
  const otherImages = Array.isArray(product.value.images) ? product.value.images : []; // Giả sử product.images là mảng ảnh phụ
  let images = [];
  if (primaryImage && typeof primaryImage === 'string') images.push(primaryImage);
  otherImages.forEach(img => {
    if (img && typeof img === 'string' && !images.includes(img)) images.push(img);
  });
  return images.length > 0 ? images.filter(Boolean) : [placeholderImg.value];
});

const finalCountInStock = computed(() => {
    if (!product.value) return 0;
    if (selectedVariant.value && typeof selectedVariant.value.countInStock === 'number') {
        return selectedVariant.value.countInStock;
    }
    return product.value.countInStock || 0;
});

const canReview = computed(() => {
    if (!isLoggedIn.value || !product.value || !currentUser.value) return false;
    // Logic kiểm tra xem user đã mua sản phẩm này chưa (tùy theo hệ thống của bạn)
    // Ví dụ: return store.getters['order/hasUserPurchasedProduct'](product.value._id);
    // Hiện tại, chỉ cho phép review nếu chưa review
    return !hasReviewed.value;
});

const hasReviewed = computed(() => {
    if (!isLoggedIn.value || !product.value || !product.value.reviews || !currentUser.value) return false;
    return product.value.reviews.some(review => review.user === currentUser.value._id); // Giả sử review.user lưu ID user
});

// Methods
const formatPrice = (price) => {
  if (price == null || isNaN(price)) return 'Đang cập nhật';
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
const formatPriceAdjustment = (adjustment) => {
    if (adjustment == null || isNaN(adjustment)) return '';
    const formatted = formatPrice(Math.abs(adjustment));
    return adjustment > 0 ? `+ ${formatted}` : `- ${formatted}`; // Thêm dấu cách
};
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};
const onImageError = (event) => { event.target.src = placeholderImg.value; };
const onThumbnailError = (index) => { /* console.warn(`Thumbnail ${index} error`); */ };
const setActiveImage = (image) => { activeImage.value = image || placeholderImg.value; };

const validateQuantity = () => {
    const stock = finalCountInStock.value;
    if (quantity.value === null || quantity.value === '' || isNaN(parseInt(String(quantity.value)))) {
        quantity.value = stock > 0 ? 1 : 0; // Nếu hết hàng thì số lượng là 0
    } else {
        quantity.value = Math.max(stock > 0 ? 1 : 0, Math.min(parseInt(String(quantity.value)), stock > 0 ? stock : 0));
    }
    if (stock === 0) {
        quantity.value = 0;
    }
};

const fetchProductDetail = async (id) => {
  loadingProductDetails.value = true;
  productError.value = null;
  activeImage.value = null;
  product.value = null;
  store.commit('recommendation/CLEAR_RECOMMENDATIONS'); // Xóa gợi ý cũ của sản phẩm trước

  try {
    const fetchedProductData = await store.dispatch('product/fetchProductById', id);
    if (fetchedProductData) {
        product.value = fetchedProductData;
        quantity.value = 1; // Reset quantity
        activeImage.value = allImages.value[0];
        if (product.value.variants && product.value.variants.length > 0) {
            selectedVariant.value = product.value.variants[0]; // Chọn variant đầu tiên làm mặc định
        } else {
            selectedVariant.value = null; // Reset nếu không có variants
        }
        validateQuantity(); // Quan trọng: gọi sau khi product và selectedVariant được set

        // Sử dụng original_id (nếu có từ hệ thống recommendation) hoặc _id cho gợi ý
        const idForRecommendation = product.value.original_id || product.value._id;
        if (idForRecommendation) {
            // Set lastViewedProductId trong store
            store.dispatch('recommendation/setLastViewedProduct', idForRecommendation);

            // Lên lịch fetch gợi ý sau một khoảng trễ
            clearTimeout(recommendationTimer);
            recommendationTimer = setTimeout(() => {
                store.dispatch('recommendation/fetchRelatedRecommendations', {
                    productId: idForRecommendation,
                    topN: 4 // Số lượng sản phẩm gợi ý
                });
            }, RECOMMENDATION_DELAY);
        } else {
            console.warn("ProductDetailView: ID for recommendation is missing.");
        }
    } else {
        productError.value = "Sản phẩm không được tìm thấy.";
    }
  } catch (err) {
    console.error("ProductDetailView: Error fetching product detail:", err.response?.data?.message || err.message);
    productError.value = err.response?.data?.message || "Lỗi khi tải chi tiết sản phẩm.";
  } finally {
    loadingProductDetails.value = false;
  }
};

const addToCartHandler = async () => {
  if (isAddingToCart.value || !product.value || finalCountInStock.value === 0 || quantity.value <= 0) {
    if(finalCountInStock.value === 0 || quantity.value <= 0) {
        toast.error('Sản phẩm đã hết hàng hoặc số lượng không hợp lệ.');
    }
    return;
  }
  isAddingToCart.value = true;
  try {
    const cartItem = {
        productId: product.value._id,
        name: product.value.name, // Thêm tên và ảnh để hiển thị trong giỏ hàng mini
        image: allImages.value[0], // Ảnh đầu tiên
        price: selectedVariant.value ? (product.value.price + selectedVariant.value.priceAdjust) : product.value.price,
        quantity: quantity.value,
        variant: selectedVariant.value ? { _id: selectedVariant.value._id, name: selectedVariant.value.name } : undefined,
        countInStock: finalCountInStock.value // Thêm countInStock để cart kiểm tra
    };
    await store.dispatch('cart/addToCart', cartItem);
    toast.success(`Đã thêm ${quantity.value} "${product.value.name}" vào giỏ hàng!`);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Thêm vào giỏ hàng thất bại.');
  } finally {
    isAddingToCart.value = false;
  }
};

const buyNowHandler = async () => {
    if (isAddingToCart.value || !product.value || finalCountInStock.value === 0 || quantity.value <= 0 ) return;
    isAddingToCart.value = true; // Dùng chung cờ loading
    try {
        const cartItem = { // Tạo cartItem tương tự addToCartHandler
            productId: product.value._id,
            name: product.value.name,
            image: allImages.value[0],
            price: selectedVariant.value ? (product.value.price + selectedVariant.value.priceAdjust) : product.value.price,
            quantity: quantity.value,
            variant: selectedVariant.value ? { _id: selectedVariant.value._id, name: selectedVariant.value.name } : undefined,
            countInStock: finalCountInStock.value
        };
        // Thay vì dispatch addToCart, có thể bạn muốn một logic khác cho "mua ngay"
        // Ví dụ: lưu tạm item này vào state riêng và redirect tới trang checkout đặc biệt
        // Hoặc đơn giản là thêm vào giỏ rồi redirect
        await store.dispatch('cart/addToCart', cartItem);
        router.push({ name: 'Checkout' }); // Giả sử có route tên là 'Checkout'
    } catch (error) {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi mua ngay.');
    } finally {
        isAddingToCart.value = false;
    }
};

const reviewForm = ref(null);
const submitReviewHandler = async () => {
    if (reviewForm.value) {
        reviewForm.value.classList.add('was-validated');
        if (!reviewForm.value.checkValidity() || !userRating.value) {
            if(!userRating.value) toast.error('Vui lòng chọn số sao đánh giá.');
            return;
        }
    } else { return; }

    isSubmittingReview.value = true;
    try {
      // Giả sử action 'product/submitProductReview' tồn tại và xử lý việc gửi review
      await store.dispatch('product/submitProductReview', {
        productId: product.value._id,
        rating: userRating.value,
        comment: userReview.value,
      });
      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
      userRating.value = 0;
      userReview.value = '';
      if(reviewForm.value) reviewForm.value.classList.remove('was-validated');
      // Tải lại chi tiết sản phẩm để cập nhật danh sách review
      await fetchProductDetail(route.params.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi đánh giá thất bại.');
    } finally {
      isSubmittingReview.value = false;
    }
};

const setActiveTab = (tabId) => {
    // ... (giữ nguyên logic setActiveTab của bạn, đảm bảo Bootstrap JS được tải) ...
    const tabButton = document.getElementById(tabId);
    if (tabButton) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tab) {
            const tab = new bootstrap.Tab(tabButton);
            tab.show();
        }
    }
};

// Lifecycle hooks
onMounted(() => {
  // Fetch sản phẩm khi component được mount, không cần watch immediate nữa
  //   nếu watch(() => route.params.id, ...) được đặt ngay sau đó.
});

// Watch sự thay đổi của route param 'id' để fetch lại sản phẩm
watch(() => route.params.id, (newId, oldId) => {
  if (newId) { // Chỉ fetch nếu newId có giá trị
    fetchProductDetail(newId);
    if (oldId && newId !== oldId) { // Chỉ cuộn nếu ID thực sự thay đổi
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}, { immediate: true }); // immediate: true để fetch lần đầu khi component được tạo

onBeforeUnmount(() => {
    clearTimeout(recommendationTimer);
    // Không clear recommendations ở đây để HomeView có thể dùng nếu người dùng quay lại nhanh
    // store.commit('recommendation/CLEAR_RECOMMENDATIONS');
});

const handleAddToCartFromRecommendation = async (payload) => {
    // Đây là hàm được gọi khi ProductCard trong mục gợi ý emit 'add-to-cart'
    // payload có thể là { productId, quantity }
    // Bạn có thể điều hướng đến trang sản phẩm đó, hoặc thêm trực tiếp vào giỏ
    // Ví dụ: Thêm trực tiếp vào giỏ
    try {
        // Cần lấy thông tin chi tiết của sản phẩm gợi ý để thêm vào giỏ
        // Hoặc ProductCard gửi đủ thông tin
        const recProduct = relatedRecommendations.value.find(p => String(p.product_id) === payload.productId);
        if (recProduct) {
            const cartItem = {
                productId: String(recProduct.product_id),
                name: recProduct.name,
                image: recProduct.image_url || placeholderImg.value,
                price: recProduct.price,
                quantity: payload.quantity || 1,
                // variant: undefined, // Sản phẩm gợi ý thường không có variant phức tạp
                countInStock: 1 // Giả sử còn hàng
            };
            await store.dispatch('cart/addToCart', cartItem);
            toast.success(`Đã thêm "${cartItem.name}" vào giỏ hàng!`);
        } else {
            toast.error('Không tìm thấy thông tin sản phẩm gợi ý.');
        }
    } catch (err) {
        toast.error(err.response?.data?.message || 'Thêm vào giỏ hàng thất bại.');
    }
};

</script>

<style scoped>
/* GIỮ NGUYÊN CSS TỪ CODE GỐC CỦA BẠN */
.product-description-content img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    display: block;
    border-radius: 0.25rem;
}
.rating-stars i {
   transition: color 0.15s ease-in-out;
}
.no-spinners::-webkit-outer-spin-button,
.no-spinners::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinners {
  -moz-appearance: textfield;
}
.cursor-pointer {
  cursor: pointer;
}
.border-transparent {
  border-color: transparent !important;
}
.product-detail-page {
  font-family: 'Roboto', sans-serif;
}
.product-main-image {
  max-height: 450px;
  width: 100%;
  object-fit: cover;
  border: 1px solid #e0e0e0;
}
.img-thumbnail.active-thumbnail {
    border-color: #198754;
    box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}
.quantity-input {
  width: 70px;
  text-align: center;
}
.product-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
}
.product-price {
    font-size: 1.6rem;
}
.product-rating i {
    font-size: 0.9rem;
}
.product-meta p {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}
.product-meta strong {
    color: #333;
}
.related-products-section h3 {
    font-size: 1.4rem;
}
img[src$="/placeholder.png"] {
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 0.9rem;
}
img[src$="/placeholder.png"]::before {
    content: "Ảnh SP";
}
.nav-tabs .nav-link {
    color: #6c757d;
}
.nav-tabs .nav-link.active {
    color: #198754;
    border-color: #dee2e6 #dee2e6 #fff;
    font-weight: 500;
}
.nav-tabs {
    border-bottom-color: #dee2e6;
}
</style>