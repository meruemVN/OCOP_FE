<template>
    <div class="card h-100 shadow-sm product-card">
      <router-link :to="'/product/' + product._id" class="text-decoration-none">
        <img
          :src="product.imageUrl || placeholderImage"
          class="card-img-top"
          :alt="product.name"
          @error="handleImageError"
        />
      </router-link>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title flex-grow-1">
           <router-link :to="'/product/' + product._id" class="text-decoration-none text-dark product-name">
              {{ product.name }}
           </router-link>
        </h5>
        <p class="card-text text-muted small mb-2">{{ product.category?.name || 'Chưa phân loại' }}</p>
        <p class="card-text fw-bold text-danger mb-3">{{ formatCurrency(product.price) }}</p>
        <div class="mt-auto d-grid"> {/* Use d-grid for full-width button */}
           <button class="btn btn-sm btn-outline-success" @click="addToCart">
             <i class="fas fa-cart-plus me-1"></i> Thêm vào giỏ
           </button>
          {/* Alternative: Link to details */}
          {/* <router-link :to="'/product/' + product._id" class="btn btn-sm btn-outline-primary mt-auto">
            Xem chi tiết
          </router-link> */}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import { RouterLink } from 'vue-router';
  // Assuming you have Font Awesome setup
  
  const props = defineProps({
    product: {
      type: Object,
      required: true,
      default: () => ({ // Provide default structure for safety
          _id: 'default',
          name: 'No Name',
          price: 0,
          imageUrl: '',
          category: { name: 'Uncategorized' }
      })
    }
  });
  
  const emit = defineEmits(['add-to-cart']);
  
  // const placeholderImage = '/images/placeholder.png'; // Path relative to public folder
  
  const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  const handleImageError = (event) => {
    event.target.src = placeholderImage; // Fallback image on error
  };
  
  const addToCart = () => {
      console.log('Adding to cart:', props.product._id);
      // Emit event to parent or call Vuex action
      // emit('add-to-cart', props.product);
      // store.dispatch('cart/addItem', props.product);
  }
  </script>
  
  <style scoped>
  .product-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
  }
  .card-img-top {
    width: 100%;
    height: 200px; /* Fixed height for consistency */
    object-fit: cover; /* Cover the area, might crop */
  }
  .card-body {
    padding: 1rem; /* Adjust padding if needed */
  }
  .card-title {
     font-size: 1rem; /* Adjust title size */
     margin-bottom: 0.5rem;
  }
  .product-name {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Limit product name to 2 lines */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 2.4em; /* Ensure space for 2 lines */
  }
  .card-text {
    font-size: 0.9rem; /* Adjust text size */
  }
  </style>