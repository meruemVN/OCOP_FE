<template>
  <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
    <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }">
      <div class="relative pb-[100%] overflow-hidden">
        <img 
          :src="product.images && product.images.length > 0 ? product.images[0] : require('@/assets/product-placeholder.jpg')" 
          :alt="product.name"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        >
        
        <div v-if="product.rating >= 4" class="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {{ product.rating }} ★ OCOP
        </div>
        
        <div v-if="product.discount" class="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          -{{ product.discount }}%
        </div>
      </div>
      
      <div class="p-4">
        <div class="flex justify-between items-start">
          <h3 class="text-gray-800 font-medium text-lg mb-1 line-clamp-2">{{ product.name }}</h3>
        </div>
        
        <div v-if="product.origin" class="text-gray-500 text-sm mb-2">{{ product.origin }}</div>
        
        <div class="flex items-center mb-3">
          <div class="flex text-yellow-400">
            <span v-for="i in Math.floor(product.rating || 0)" :key="'star-' + i" class="text-sm">★</span>
            <span v-for="i in (5 - Math.floor(product.rating || 0))" :key="'empty-' + i" class="text-gray-300 text-sm">★</span>
          </div>
          <span class="text-gray-500 text-xs ml-1">({{ product.reviewCount || 0 }})</span>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="price-container">
            <div v-if="product.discount" class="flex items-center">
              <span class="text-gray-400 line-through text-sm">{{ formatPrice(product.price) }}</span>
              <span class="text-red-600 font-semibold ml-2">{{ formatPrice(discountedPrice) }}</span>
            </div>
            <div v-else>
              <span class="text-gray-900 font-semibold">{{ formatPrice(product.price) }}</span>
            </div>
          </div>
          
          <button @click.prevent="addToCart" class="bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    discountedPrice() {
      if (!this.product.discount) return this.product.price;
      return this.product.price * (1 - this.product.discount / 100);
    }
  },
  methods: {
    ...mapActions({
      addToCartAction: 'cart/addToCart'
    }),
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    addToCart() {
      this.addToCartAction({
        id: this.product._id,
        name: this.product.name,
        price: this.discountedPrice,
        image: this.product.images && this.product.images.length > 0 ? this.product.images[0] : null,
        quantity: 1
      });
      
      this.$emit('added-to-cart');
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>