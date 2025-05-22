<template>
  <div class="card h-100 shadow-sm product-card overflow-hidden border-light">
    <router-link :to="'/product/' + product._id" class="text-decoration-none d-block product-image-link">
      <img
        :src="imageUrlToDisplay"
        class="card-img-top product-image"
        :alt="product.name"
        @error="onImageError"
        loading="lazy"
      />
    </router-link>

    <div class="card-body d-flex flex-column p-3">
      <!-- Star Rating Display -->
      <div class="mb-2 d-flex align-items-center product-rating">
        <template v-if="product.rating !== undefined && product.rating > 0 && product.numReviews > 0">
          <span class="text-warning me-1">
            <i v-for="i in 5" :key="'filled-star-' + i" :class="getStarClass(i, product.rating)"></i>
          </span>
          <span class="text-muted small">
            ({{ product.rating.toFixed(1) }})
            <span v-if="product.numReviews !== undefined" class="ms-1"> - {{ product.numReviews }} đánh giá</span>
          </span>
        </template>
        <template v-else>
          <!-- Hiển thị 5 ngôi sao mờ khi chưa có đánh giá -->
          <span class="text-muted me-1">
            <i v-for="i in 5" :key="'empty-star-' + i" class="far fa-star"></i>
          </span>
        </template>
      </div>

      <!-- Product Name -->
      <h5 class="card-title flex-grow-1 mb-2">
        <router-link :to="'/product/' + product._id" class="text-decoration-none text-dark product-name-link" :title="product.name">
          {{ product.name }}
        </router-link>
      </h5>

      <!-- Price -->
      <p class="card-text fw-bold text-danger mb-3 fs-5">{{ formatCurrency(product.price) }}</p>

      <!-- Action Button -->
      <div class="mt-auto d-grid">
        <button
          class="btn btn-success add-to-cart-btn"
          @click="addToCartHandler"
          :disabled="isAddingToCart"
        >
          <span v-if="isAddingToCart" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          <i v-else class="fas fa-cart-plus me-1"></i>
          {{ isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';


const store = useStore();
const toast = useToast();
const router = useRouter(); // Khởi tạo router nếu cần

const defaultPlaceholder = '/images/placeholder.png';

// --- Props ---
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      _id: 'default-id',
      name: 'Sản phẩm mẫu',
      price: 0,
      images: [],
      rating: 0,
      numReviews: 0,
      countInStock: 1,
    })
  }
});

// --- Emits ---
const emit = defineEmits(['add-to-cart-success', 'add-to-cart-error']);

// --- State ---
const isAddingToCart = ref(false);
const currentImageSrc = ref(props.product.images?.[0] || defaultPlaceholder);

// --- Computed ---
const imageUrlToDisplay = computed(() => {
  return currentImageSrc.value || props.product.images?.[0] || defaultPlaceholder;
});

// --- Methods ---
const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const onImageError = () => {
  console.warn(`Image failed to load for product ${props.product._id}. Using placeholder.`);
  currentImageSrc.value = defaultPlaceholder;
};

const getStarClass = (index, rating) => {
  if (rating >= index) {
    return 'fas fa-star'; // Full star
  } else if (rating >= index - 0.5) {
    return 'fas fa-star-half-alt'; // Half star
  } else {
    return 'far fa-star'; // Empty star (sử dụng cho phần rating > 0 nhưng chưa đủ 5 sao)
  }
};

const addToCartHandler = async () => {
  if (isAddingToCart.value) return;
  isAddingToCart.value = true;

  try {
    const addedCart = await store.dispatch('cart/addToCart', {
      productId: props.product._id,
      quantity: 1
    });
    console.log('Added to cart:', addedCart);
    toast.success(`Đã thêm "${props.product.name}" vào giỏ hàng!`);
    emit('add-to-cart-success', props.product._id);

  } catch (error) {
    console.error('Error adding to cart:', error);
    const errorMessage = error.response?.data?.message || 'Thêm vào giỏ hàng thất bại. Vui lòng thử lại.';
    toast.error(errorMessage);
    emit('add-to-cart-error', { productId: props.product._id, error: errorMessage });
  } finally {
    isAddingToCart.value = false;
  }
};

</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 0.5rem;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, 0.12) !important;
}

.product-image-link {
   display: block;
   aspect-ratio: 1 / 1;
   overflow: hidden;
   background-color: #f8f9fa;
}
.card-img-top.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .product-image {
   transform: scale(1.03);
}

.card-body {
  padding: 0.8rem 1rem;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-name-link {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
  color: #343a40;
  transition: color 0.2s ease;
}
.product-name-link:hover {
    color: #198754;
}

.card-text {
  font-size: 0.9rem;
}

.add-to-cart-btn {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
}

/* Rating styles */
.product-rating {
  min-height: 1.5em; /* Đảm bảo chiều cao nhất quán */
  /* Điều chỉnh kích thước sao nếu cần */
  /* font-size: 0.9em;  */
}
.product-rating .fa-star, /* sao đầy */
.product-rating .fa-star-half-alt, /* nửa sao */
.product-rating .far.fa-star { /* sao rỗng */
  /* Màu của sao đầy/nửa sao được kế thừa từ text-warning */
  /* Màu của sao rỗng được kế thừa từ text-muted */
}
/* Thêm một chút fst-italic (font-style: italic) cho chữ "Chưa có đánh giá" để nó trông nhẹ nhàng hơn */
.product-rating .fst-italic {
    font-size: 0.85em; /* Làm chữ nhỏ hơn một chút */
}
</style>