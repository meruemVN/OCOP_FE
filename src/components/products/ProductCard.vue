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
      <!-- Category/Brand (Optional) -->
      <div class="mb-2">
        <span class="badge bg-success-subtle text-success-emphasis rounded-pill px-2 py-1 small">
          {{ product.category?.name || 'Chưa phân loại' }}
        </span>
        <!-- Or Brand -->
        <!-- <span class="text-muted small">{{ product.brand || 'Thương hiệu khác' }}</span> -->
      </div>

      <!-- Product Name -->
      <h5 class="card-title flex-grow-1 mb-2">
        <router-link :to="'/product/' + product._id" class="text-decoration-none text-dark product-name-link" :title="product.name">
          {{ product.name }}
        </router-link>
      </h5>

      <!-- Price -->
      <p class="card-text fw-bold text-danger mb-3 fs-5">{{ formatCurrency(product.price) }}</p>

      <!-- Rating (Optional) -->
      <!-- <div class="d-flex align-items-center mb-3 small text-warning">
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star-half-alt"></i>
           <i class="far fa-star"></i>
           <span class="ms-1 text-muted">(4.5)</span>
      </div> -->

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
    <!-- Có thể thêm card-footer nếu cần -->
    <!-- <div class="card-footer bg-transparent border-top-0 text-center">
         <small class="text-muted">Còn lại: {{ product.countInStock }}</small>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { RouterLink, useRouter } from 'vue-router'; // Import useRouter nếu cần redirect
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification'; // Import toast

const store = useStore();
const toast = useToast(); // Khởi tạo toast
const router = useRouter(); // Khởi tạo router nếu cần

const defaultPlaceholder = '/images/placeholder.png'; // Đường dẫn đến ảnh placeholder cục bộ

// --- Props ---
const props = defineProps({
  product: {
    type: Object,
    required: true,
    // Default chỉ để tránh lỗi, component cha nên đảm bảo truyền product hợp lệ
    default: () => ({
      _id: 'default-id',
      name: 'Sản phẩm mẫu',
      price: 0,
      images: [], // Sử dụng mảng images thay vì imageUrl
      category: { name: 'Chưa phân loại' },
      countInStock: 1, // Thêm tồn kho
    })
  }
});

// --- Emits ---
const emit = defineEmits(['add-to-cart-success', 'add-to-cart-error']);

// --- State ---
const isAddingToCart = ref(false); // Trạng thái loading khi thêm vào giỏ
const currentImageSrc = ref(props.product.images?.[0] || defaultPlaceholder); // Ảnh đang hiển thị

// --- Computed ---
// Lấy ảnh đầu tiên hoặc ảnh placeholder
const imageUrlToDisplay = computed(() => {
    // Ưu tiên ảnh đang hiển thị (nếu có lỗi sẽ là placeholder)
    // Sau đó kiểm tra mảng images của product
    // Cuối cùng là placeholder mặc định
     return currentImageSrc.value || props.product.images?.[0] || defaultPlaceholder;
});

// --- Methods ---
const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'Liên hệ'; // Hoặc giá trị mặc định khác
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Xử lý khi ảnh gốc bị lỗi
const onImageError = () => {
  console.warn(`Image failed to load for product ${props.product._id}. Using placeholder.`);
  currentImageSrc.value = defaultPlaceholder; // Đổi sang ảnh placeholder
};

// Xử lý thêm vào giỏ hàng
const addToCartHandler = async () => {
  if (isAddingToCart.value) return; // Ngăn click nhiều lần
  isAddingToCart.value = true;

  try {
     // Gọi action addToCart của module cart
    const addedCart = await store.dispatch('cart/addToCart', {
      productId: props.product._id,
      quantity: 1
    });
    console.log('Added to cart:', addedCart);
    toast.success(`Đã thêm "${props.product.name}" vào giỏ hàng!`); // Thông báo thành công
    emit('add-to-cart-success', props.product._id); // Emit sự kiện thành công

  } catch (error) {
    console.error('Error adding to cart:', error);
    const errorMessage = error.response?.data?.message || 'Thêm vào giỏ hàng thất bại. Vui lòng thử lại.';
    toast.error(errorMessage); // Thông báo lỗi
    emit('add-to-cart-error', { productId: props.product._id, error: errorMessage }); // Emit sự kiện lỗi
  } finally {
    isAddingToCart.value = false; // Kết thúc loading
  }
};

</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 0.5rem; /* Bo góc nhẹ */
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, 0.12) !important; /* Tăng shadow khi hover */
}

/* Đảm bảo ảnh không bị tràn và giữ tỷ lệ */
.product-image-link {
   display: block;
   aspect-ratio: 1 / 1; /* Giữ tỷ lệ vuông cho khu vực ảnh */
   overflow: hidden;
   background-color: #f8f9fa; /* Màu nền nhẹ cho ảnh */
}
.card-img-top.product-image {
  width: 100%;
  height: 100%; /* Lấp đầy thẻ cha */
  object-fit: cover; /* Cover khu vực, có thể crop ảnh */
  transition: transform 0.3s ease; /* Hiệu ứng zoom nhẹ */
}
.product-card:hover .product-image {
   transform: scale(1.03); /* Zoom nhẹ khi hover card */
}

.card-body {
  padding: 0.8rem 1rem; /* Điều chỉnh padding */
}

.card-title {
  font-size: 0.95rem; /* Kích thước tiêu đề */
  font-weight: 600; /* Đậm hơn một chút */
  margin-bottom: 0.5rem;
}

/* Giới hạn tên sản phẩm 2 dòng */
.product-name-link {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em; /* Đảm bảo đủ không gian cho 2 dòng chữ */
  color: #343a40; /* Màu chữ đậm hơn */
  transition: color 0.2s ease;
}
.product-name-link:hover {
    color: #198754; /* Màu success khi hover */
}

.card-text {
  font-size: 0.9rem;
}

/* Nút bấm */
.add-to-cart-btn {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  /* transition: background-color 0.2s ease, border-color 0.2s ease; */
}

/* Badge danh mục */
.badge {
   font-weight: 500;
}

/* Responsive cho ảnh (ví dụ) */
/* @media (max-width: 768px) {
  .product-image-link {
     aspect-ratio: 4 / 3;
  }
} */
</style>