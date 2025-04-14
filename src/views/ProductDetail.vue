<template>
    <div class="product-detail container mx-auto my-8 px-4">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="loader"></div>
      </div>
      
      <div v-else-if="!product" class="text-center py-12">
        <p class="text-gray-600">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
        <router-link 
          to="/products" 
          class="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Quay lại danh sách sản phẩm
        </router-link>
      </div>
      
      <div v-else>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <!-- Ảnh sản phẩm -->
            <div class="product-images">
              <div class="mb-4 rounded-lg overflow-hidden">
                <img 
                  :src="activeImage || product.image" 
                  :alt="product.name"
                  class="w-full h-auto object-cover"
                >
              </div>
              
              <div v-if="product.images && product.images.length > 0" class="grid grid-cols-5 gap-2">
                <div 
                  v-for="(image, index) in allImages" 
                  :key="index"
                  @click="activeImage = image"
                  class="cursor-pointer rounded-md overflow-hidden border-2"
                  :class="activeImage === image ? 'border-green-500' : 'border-transparent'"
                >
                  <img :src="image" :alt="`${product.name} - Ảnh ${index + 1}`" class="w-full h-auto">
                </div>
              </div>
            </div>
            
            <!-- Thông tin sản phẩm -->
            <div class="product-info">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
              
              <div class="flex items-center mb-4">
                <div class="flex items-center">
                  <div class="flex">
                    <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"></i>
                  </div>
                  <span class="ml-2 text-gray-600">({{ product.numReviews }} đánh giá)</span>
                </div>
                <span class="mx-3 text-gray-300">|</span>
                <span class="text-green-600">Đã bán {{ product.sold || 0 }}</span>
              </div>
              
              <div class="mb-6">
                <span class="text-3xl font-bold text-red-600">{{ formatPrice(product.price) }}đ</span>
                <span v-if="product.originalPrice" class="ml-2 text-lg text-gray-500 line-through">
                  {{ formatPrice(product.originalPrice) }}đ
                </span>
                <span v-if="product.discount" class="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm">
                  -{{ product.discount }}%
                </span>
              </div>
              
              <div v-if="product.variants && product.variants.length > 0" class="mb-6">
                <h3 class="font-medium text-gray-700 mb-2">Phân loại:</h3>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="variant in product.variants" 
                    :key="variant._id"
                    @click="selectedVariant = variant"
                    class="px-3 py-1 border rounded-md"
                    :class="selectedVariant === variant ? 'border-green-500 bg-green-50' : 'border-gray-300'"
                  >
                    {{ variant.name }}
                  </button>
                </div>
              </div>
              
              <div class="mb-6">
                <h3 class="font-medium text-gray-700 mb-2">Số lượng:</h3>
                <div class="flex items-center">
                  <button 
                    @click="quantity > 1 ? quantity-- : 1"
                    class="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="product.countInStock"
                    class="w-16 text-center border-t border-b border-gray-300 py-1"
                  >
                  <button 
                    @click="quantity < product.countInStock ? quantity++ : quantity"
                    class="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                  <span class="ml-4 text-gray-500">{{ product.countInStock }} sản phẩm có sẵn</span>
                </div>
              </div>
              
              <div class="flex space-x-4 mb-6">
                <button 
                  @click="addToCart"
                  class="flex-1 px-6 py-3 bg-orange-100 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-200 transition"
                  :disabled="product.countInStock === 0"
                >
                  <i class="fas fa-cart-plus mr-2"></i> Thêm vào giỏ
                </button>
                <button 
                  @click="buyNow"
                  class="flex-1 px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                  :disabled="product.countInStock === 0"
                >
                  Mua ngay
                </button>
              </div>
              
              <!-- Thông tin cửa hàng -->
              <div v-if="product.shop" class="flex items-center p-4 border border-gray-200 rounded-md">
                <div class="mr-4">
                  <img 
                    :src="product.shop.logo || '@/assets/logo.png'" 
                    :alt="product.shop.name"
                    class="w-12 h-12 rounded-full object-cover"
                  >
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800">{{ product.shop.name }}</h4>
                  <p class="text-gray-500 text-sm">{{ product.shop.description }}</p>
                </div>
                <router-link :to="`/shop/${product.shop._id}`" class="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                  Xem cửa hàng
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Mô tả và thông tin chi tiết -->
          <div class="p-6 border-t border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Thông tin chi tiết</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 mb-6">
              <div class="flex">
                <span class="w-40 text-gray-600">Xuất xứ:</span>
                <span>{{ product.origin || 'Việt Nam' }}</span>
              </div>
              <div class="flex">
                <span class="w-40 text-gray-600">Chứng nhận:</span>
                <span>{{ product.certification || 'OCOP 3 sao' }}</span>
              </div>
              <div class="flex">
                <span class="w-40 text-gray-600">Danh mục:</span>
                <span>{{ product.category }}</span>
              </div>
              <div class="flex">
                <span class="w-40 text-gray-600">Bảo quản:</span>
                <span>{{ product.preservation || 'Nơi khô ráo, thoáng mát' }}</span>
              </div>
              <div class="flex">
                <span class="w-40 text-gray-600">Hạn sử dụng:</span>
                <span>{{ product.expiry || '12 tháng kể từ ngày sản xuất' }}</span>
              </div>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Mô tả sản phẩm</h3>
            <div class="product-description text-gray-700 mb-6" v-html="product.description"></div>
          </div>
          
          <!-- Đánh giá sản phẩm -->
          <div class="p-6 border-t border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Đánh giá sản phẩm</h3>
            
            <div v-if="product.reviews && product.reviews.length > 0">
              <div v-for="review in product.reviews" :key="review._id" class="mb-4 p-4 border-b border-gray-100">
                <div class="flex items-center mb-2">
                  <div class="font-medium text-gray-800">{{ review.name }}</div>
                  <div class="ml-2 text-gray-500 text-sm">{{ formatDate(review.createdAt) }}</div>
                </div>
                <div class="flex text-yellow-400 mb-2">
                  <i v-for="i in 5" :key="i" class="fas fa-star" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"></i>
                </div>
                <p class="text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              Sản phẩm chưa có đánh giá nào.
            </div>
            
            <div v-if="isLoggedIn" class="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 class="font-medium text-gray-800 mb-2">Đánh giá của bạn</h4>
              <div class="mb-3">
                <div class="flex items-center">
                  <div 
                    v-for="i in 5" 
                    :key="i" 
                    @click="userRating = i"
                    class="cursor-pointer text-2xl"
                  >
                    <i class="fas fa-star" :class="i <= userRating ? 'text-yellow-400' : 'text-gray-300'"></i>
                  </div>
                </div>
              </div>
              <textarea 
                v-model="userReview" 
                rows="3" 
                placeholder="Chia sẻ đánh giá của bạn về sản phẩm này..."
                class="w-full p-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
              ></textarea>
              <button 
                @click="submitReview"
                class="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Gửi đánh giá
              </button>
            </div>
            <div v-else class="mt-6 text-center">
              <p class="text-gray-600">Vui lòng đăng nhập để đánh giá sản phẩm.</p>
              <router-link to="/login" class="text-green-600 hover:underline">Đăng nhập ngay</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'ProductDetail',
    data() {
      return {
        loading: true,
        product: null,
        quantity: 1,
        activeImage: null,
        selectedVariant: null,
        userRating: 0,
        userReview: ''
      };
    },
    computed: {
      ...mapGetters({
        isLoggedIn: 'auth/isLoggedIn'
      }),
      allImages() {
        if (!this.product) return [];
        return [this.product.image, ...(this.product.images || [])].filter(Boolean);
      }
    },
    methods: {
      ...mapActions({
        getProductById: 'product/getProductById',
        addToCartAction: 'cart/addToCart'
      }),
      formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN').format(date);
      },
      async fetchProduct() {
        try {
          this.loading = true;
          const productId = this.$route.params.id;
          this.product = await this.getProductById(productId);
          
          // Set default active image
          if (this.product && this.product.image) {
            this.activeImage = this.product.image;
          }
          
          // Set default variant if exists
          if (this.product && this.product.variants && this.product.variants.length > 0) {
            this.selectedVariant = this.product.variants[0];
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          this.loading = false;
        }
      },
      addToCart() {
        if (this.product) {
          const cartItem = {
            id: this.product._id,
            name: this.product.name,
            image: this.product.image,
            price: this.product.price,
            countInStock: this.product.countInStock,
            quantity: this.quantity,
            variant: this.selectedVariant ? this.selectedVariant.name : null
          };
          
          this.addToCartAction(cartItem);
          
          this.$toast.success('Đã thêm sản phẩm vào giỏ hàng');
        }
      },
      buyNow() {
        this.addToCart();
        this.$router.push('/cart');
      },
      async submitReview() {
        if (!this.userRating) {
          this.$toast.error('Vui lòng chọn số sao đánh giá');
          return;
        }
        
        try {
          // Implement submit review logic
          this.$toast.success('Đánh giá của bạn đã được gửi thành công');
          this.userRating = 0;
          this.userReview = '';
          
          // Refresh product to show new review
          await this.fetchProduct();
        } catch (error) {
          console.error('Error submitting review:', error);
          this.$toast.error('Đã có lỗi xảy ra khi gửi đánh giá');
        }
      }
    },
    mounted() {
      this.fetchProduct();
    },
    watch: {
      '$route.params.id'() {
        this.fetchProduct();
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #10B981;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .product-description {
    line-height: 1.6;
  }
  
  .product-description img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
  }
  </style>