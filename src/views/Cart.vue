<template>
  <div class="cart container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
      <i class="fas fa-shopping-cart me-2"></i>Giỏ hàng của bạn
    </h1>

    <div v-if="cartLoading && !initialLoadDone" class="text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Đang tải giỏ hàng...</span>
      </div>
       <p class="mt-2 text-muted">Đang tải giỏ hàng...</p>
    </div>

    <div v-else-if="!processedCartItems || processedCartItems.length === 0" class="card shadow-sm border-light p-5 text-center mx-auto" style="max-width: 550px;">
      <div class="mb-4">
         <i class="fas fa-shopping-basket text-light display-1"></i>
      </div>
      <p class="text-muted mb-4 fs-5">Giỏ hàng của bạn hiện đang trống.</p>
      <router-link to="/" class="btn btn-success btn-lg px-4 rounded-pill shadow-sm">
        <i class="fas fa-arrow-left me-2"></i>
        Tiếp tục mua sắm
      </router-link>
    </div>

    <div v-else class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-light mb-4">
          <div class="card-header bg-light py-3 px-4 border-bottom d-none d-md-block">
            <div class="row fw-semibold text-muted small text-uppercase">
              <div class="col-md-5">Sản phẩm</div>
              <div class="col-md-2 text-center">Đơn giá</div>
              <div class="col-md-3 text-center">Số lượng</div>
              <div class="col-md-2 text-end">Thành tiền</div>
            </div>
          </div>
          <ul class="list-group list-group-flush">
            <li v-for="(item, index) in processedCartItems" :key="item.product?._id || item.productId || `item-error-${index}`" class="list-group-item px-3 px-md-4 py-3">
              <div v-if="item.product" class="row align-items-center gy-3">
                <!-- Product Details -->
                <div class="col-md-5">
                  <div class="d-flex align-items-center">
                    <router-link :to="`/product/${item.product._id}`" class="flex-shrink-0">
                      <img
                        :src="getProductImage(item.product)"
                        :alt="item.product.name"
                        @error="onImageError"
                        loading="lazy"
                        class="rounded border"
                        style="width: 60px; height: 60px; object-fit: cover; background-color: #f8f9fa;"
                      />
                    </router-link>
                    <div class="ms-3 flex-grow-1">
                      <router-link :to="`/product/${item.product._id}`" class="text-decoration-none text-dark fw-medium stretched-link product-name-link">
                        {{ item.product.name }}
                      </router-link>
                    </div>
                  </div>
                </div>
                <!-- Price -->
                <div class="col-6 col-md-2 text-md-center">
                   <span class="d-md-none text-muted small">Đơn giá: </span>
                   <span class="fw-medium">{{ formatPrice(item.price !== undefined ? item.price : item.product.price) }}</span>
                </div>
                <!-- Quantity -->
                <div class="col-6 col-md-3 d-flex justify-content-end justify-content-md-center align-items-center">
                  <div class="input-group input-group-sm" style="max-width: 120px;">
                    <button
                      class="btn btn-outline-secondary px-2" type="button"
                      @click="updateQuantity(item.product._id, item.quantity - 1)"
                      :disabled="item.quantity <= 1 || isLoadingUpdate(item.product._id)" >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input
                      :value="item.quantity"
                      @input="handleQuantityInput(item.product._id, $event, item.product.countInStock)"
                      type="number" min="1" :max="item.product.countInStock"
                      class="form-control text-center px-1 no-spinners"
                      :disabled="isLoadingUpdate(item.product._id)"
                      :data-product-id="item.product._id"
                       aria-label="Số lượng" >
                    <button
                      class="btn btn-outline-secondary px-2" type="button"
                       @click="updateQuantity(item.product._id, item.quantity + 1)"
                       :disabled="item.quantity >= item.product.countInStock || isLoadingUpdate(item.product._id)" >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                   <button @click="removeItem(item.product._id)" class="btn btn-sm btn-link text-danger ms-2 d-md-none p-1" :disabled="isLoadingUpdate(item.product._id)">
                      <i class="fas fa-trash fs-5"></i>
                   </button>
                </div>
                <!-- Subtotal & Remove Button (Desktop) -->
                <div class="col-12 col-md-2 text-end">
                  <span class="fw-bold text-dark">{{ formatPrice((item.price !== undefined ? item.price : item.product.price) * item.quantity) }}</span>
                  <button @click="removeItem(item.product._id)" class="btn btn-sm btn-link text-danger ms-2 d-none d-md-inline-block p-0" :disabled="isLoadingUpdate(item.product._id)" title="Xóa sản phẩm">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                 <div v-if="isLoadingUpdate(item.product._id)" class="col-12 text-center text-muted small mt-2">
                     <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                     <span class="ms-1">Đang cập nhật...</span>
                 </div>
              </div>
              <!-- Fallback for item with productId but no product object -->
               <div v-else-if="item.productId" class="text-center text-danger small mt-2 p-3 border-top">
                   <i class="fas fa-exclamation-triangle me-1"></i> Sản phẩm với ID {{item.productId}} không còn tồn tại hoặc đã bị lỗi.
                   <button @click="removeItem(item.productId)" class="btn btn-sm btn-link text-danger p-0 ms-1">(Xóa)</button>
               </div>
            </li>
          </ul>
           <div class="card-footer bg-light text-end px-4 py-3" v-if="processedCartItems && processedCartItems.length > 0">
              <button @click="clearCart" class="btn btn-sm btn-outline-danger" :disabled="isUpdating">
                 <i class="fas fa-times-circle me-1"></i> Xóa tất cả giỏ hàng
              </button>
           </div>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng (Sidebar) -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-light sticky-top" style="top: 20px;">
          <div class="card-body p-4">
            <h4 class="card-title text-center mb-4 fw-bold text-success">Tóm tắt đơn hàng</h4>
            <div class="mb-3 pb-3 border-bottom">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Tạm tính</span>
                <span class="fw-medium">{{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Phí vận chuyển</span>
                <span class="fw-medium">{{ formatPrice(shippingFee) }}</span>
              </div>
              <div v-if="discount > 0" class="d-flex justify-content-between text-danger mb-2">
                <span>Giảm giá</span>
                <span>- {{ formatPrice(discount) }}</span>
              </div>
            </div>
            <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Tổng cộng</span>
              <span class="text-success">{{ formatPrice(orderTotal) }}</span>
            </div>
            <div class="d-grid">
              <button @click="checkout" class="btn btn-success btn-lg rounded-pill shadow-sm" :disabled="!processedCartItems || processedCartItems.length === 0 || isUpdating" >
                <i class="fas fa-credit-card me-2"></i>Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faShoppingCart, faShoppingBasket, faArrowLeft, 
  faMinus, faPlus, faTrash, 
  faCreditCard, faTimesCircle, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faShoppingCart, faShoppingBasket, faArrowLeft, 
  faMinus, faPlus, faTrash, 
  faCreditCard, faTimesCircle, faExclamationTriangle
);

export default {
  name: 'CartView',
  data() {
    return {
      couponCode: '',
      discount: 0, // Logic discount chi tiết cần được bạn triển khai (ví dụ: gọi API kiểm tra coupon)
      updatingItemId: null, // ID (product._id hoặc productId) của item đang được cập nhật số lượng/xóa
      quantityInputTimeout: null, // Timeout cho việc cập nhật số lượng từ input
      initialLoadDone: false,     // Cờ báo giỏ hàng đã được tải lần đầu
      placeholderImg: '/images/placeholder.png', // Đường dẫn ảnh placeholder
    };
  },
  computed: {
    ...mapGetters({
      // Lấy state từ Vuex store
      cart: 'cart/theCart',          // Getter trả về object cart { items, totalPrice, ... }
      cartLoading: 'cart/isLoading', // Getter trạng thái loading của module cart
      isLoggedIn: 'auth/isLoggedIn'  // Getter trạng thái đăng nhập từ module auth
    }),

    // Xử lý và lọc cart items để đảm bảo dữ liệu hợp lệ cho template
    processedCartItems() {
      if (this.initialLoadDone && this.cart && Array.isArray(this.cart.items)) {
        return this.cart.items.filter(item => 
          item && (item.product || item.productId) // Chỉ giữ item có product object hoặc ít nhất là productId
        );
      }
      return []; // Trả về mảng rỗng nếu chưa load xong hoặc cart không hợp lệ
    },

    // Tính toán các giá trị hiển thị
    cartTotalPrice() {
      return this.cart?.totalPrice || 0; // Lấy tổng tiền từ state cart, fallback về 0
    },
    cartTotal() {
      return Number(this.cartTotalPrice); // Đảm bảo là số
    },
    shippingFee() {
      if (this.cartTotal === 0) return 0;
      const potentialFee = this.calculatePotentialShippingFee();
      // Nếu có discount bằng đúng phí ship thì coi như free ship (logic ví dụ)
      return this.discount === potentialFee ? 0 : potentialFee;
    },
    orderTotal() {
       const total = this.cartTotal + this.shippingFee - this.discount;
       return Math.max(0, total); // Đảm bảo tổng tiền không âm
    },
    isUpdating() {
      // True nếu có một item đang trong quá trình cập nhật (để disable các nút khác)
      return !!this.updatingItemId;
    }
  },
  watch: {
     // Theo dõi cartLoading để set cờ initialLoadDone
     cartLoading(newValue, oldValue) {
       // Khi cartLoading chuyển từ true (đang tải) sang false (tải xong)
       // và initialLoadDone chưa được set (nghĩa là đây là lần load đầu tiên hoàn tất)
       if (oldValue === true && newValue === false && !this.initialLoadDone) {
          this.initialLoadDone = true;
       }
     }
   },
  methods: {
    ...mapActions({
      // Map các actions từ Vuex store vào methods của component
      initializeCartAction: 'cart/initializeCart',    // Action để tải/khởi tạo giỏ hàng
      updateCartItemAction: 'cart/updateCartItem',  // Action cập nhật số lượng item
      removeFromCartAction: 'cart/removeFromCart',// Action xóa item
      clearCartAction: 'cart/clearCart'          // Action xóa toàn bộ giỏ hàng
    }),

    calculatePotentialShippingFee() {
        // Logic tính phí ship ví dụ: miễn phí cho đơn > 500k
        return this.cartTotal > 500000 ? 0 : 30000;
     },

    isLoadingUpdate(idToCompare) {
      // Kiểm tra xem item với idToCompare có phải là item đang được cập nhật không
      return idToCompare && this.updatingItemId === idToCompare;
    },

    formatPrice(price) {
       if (price === undefined || price === null || isNaN(Number(price))) return 'N/A';
       return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },

    getProductImage(product) {
        // Lấy ảnh đầu tiên từ mảng images của sản phẩm, hoặc ảnh placeholder
        return product?.images?.[0] || this.placeholderImg;
    },

    onImageError(event) {
       // Nếu ảnh lỗi, thay bằng ảnh placeholder
       event.target.src = this.placeholderImg;
    },

    // Xử lý khi người dùng nhập số lượng vào input
    handleQuantityInput(productId, event, maxStock) {
       clearTimeout(this.quantityInputTimeout); // Xóa timeout cũ (debounce)
       const targetValue = event.target.value; 
       this.quantityInputTimeout = setTimeout(() => {
           let newQuantity = parseInt(targetValue);
           
           // Validate newQuantity
           if (isNaN(newQuantity) || newQuantity < 1) {
               newQuantity = 1;
           } else if (maxStock !== undefined && newQuantity > maxStock) {
               newQuantity = maxStock;
               this.$toast.info(`Sản phẩm này chỉ còn tối đa ${maxStock} trong kho.`);
           }

           const currentItem = this.processedCartItems.find(item => item.product?._id === productId || item.productId === productId);
           
           if (currentItem && newQuantity !== currentItem.quantity) {
              this.updateQuantity(productId, newQuantity);
           } else if (currentItem && event.target) { 
              // Nếu giá trị không đổi (hoặc user xóa hết -> NaN -> 1), cập nhật lại input để đồng bộ
              event.target.value = currentItem.quantity; 
           }
       }, 700); // Đợi 700ms sau khi user ngừng gõ rồi mới cập nhật
     },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateQuantity(productId, quantity) {
        const currentItem = this.processedCartItems.find(item => item.product?._id === productId || item.productId === productId);
        // Chỉ thực hiện nếu có sản phẩm, có thông tin sản phẩm đầy đủ (item.product), 
        // số lượng mới khác số lượng cũ và không có item nào khác đang được cập nhật
        if (!currentItem || !currentItem.product || quantity === currentItem.quantity || this.isLoadingUpdate(productId)) {
            return;
        }

        const maxQuantity = currentItem.product.countInStock;
        const validQuantity = Math.max(1, Math.min(quantity, maxQuantity)); // Đảm bảo số lượng hợp lệ

        this.updatingItemId = productId; // Đánh dấu item này đang được cập nhật
        try {
            await this.updateCartItemAction({ productId, quantity: validQuantity });
            clearTimeout(this.quantityInputTimeout); // Xóa timeout nếu có
        } catch (error) {
            this.$toast.error(error.response?.data?.message || 'Lỗi cập nhật số lượng sản phẩm.');
            // Tìm input và reset về giá trị cũ nếu cập nhật lỗi
            const inputElement = this.$el.querySelector(`input[data-product-id="${productId}"]`);
            if (inputElement) inputElement.value = currentItem.quantity;
        } finally {
            this.updatingItemId = null; // Hoàn tất cập nhật
        }
    },

    // Xóa một sản phẩm khỏi giỏ hàng
    async removeItem(idToRemove) {
        const itemKeyForLoading = idToRemove; 
        if (this.isLoadingUpdate(itemKeyForLoading)) return;

        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            this.updatingItemId = itemKeyForLoading;
            try {
                const itemInCart = this.cart.items.find(i => 
                    (i.product?._id === idToRemove) || 
                    (i.productId === idToRemove)
                    // Thêm điều kiện tìm bằng index nếu idToRemove là key dạng `error-${index}`
                    || (!i.product && !i.productId && `error-${this.cart.items.indexOf(i)}` === idToRemove)
                );
                
                const actualProductId = itemInCart?.product?._id || itemInCart?.productId;

                if (actualProductId) {
                    await this.removeFromCartAction(actualProductId);
                    this.$toast.success('Đã xóa sản phẩm khỏi giỏ hàng.');
                } else {
                    // Xử lý trường hợp item lỗi không có ID sản phẩm hợp lệ
                    // Tìm index của item lỗi trong mảng gốc từ store
                    const originalItemIndex = this.cart.items.findIndex(originalItem => {
                        if (originalItem === itemInCart) return true; // Nếu tìm được itemInCart ở trên
                        // Fallback nếu itemInCart không tìm được bằng ID (item rất lỗi)
                        // Dựa trên giả định `idToRemove` lúc này là `error-${index}`
                        const processedItemIndex = this.processedCartItems.findIndex(pItem => 
                           (pItem.product?._id || pItem.productId || `item-error-${this.processedCartItems.indexOf(pItem)}`) === idToRemove
                        );
                        return this.processedCartItems[processedItemIndex] === originalItem;
                    });

                    if (originalItemIndex !== -1) {
                        // Bạn cần tạo mutation 'cart/REMOVE_ITEM_BY_INDEX_LOCALLY' trong store
                        this.$store.commit('cart/REMOVE_ITEM_BY_INDEX_LOCALLY', originalItemIndex);
                        this.$toast.info('Đã xóa sản phẩm lỗi khỏi giỏ hàng (hiển thị).');
                    } else {
                       this.$toast.error('Không thể xác định sản phẩm để xóa.');
                    }
                }
            } catch (error) {
                this.$toast.error(error.response?.data?.message || 'Lỗi khi xóa sản phẩm.');
            } finally {
                this.updatingItemId = null;
            }
        }
    },

    // Xóa toàn bộ giỏ hàng
     async clearCart() {
        if (!this.processedCartItems || this.processedCartItems.length === 0) return;
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            try {
                await this.clearCartAction();
                this.$toast.success('Đã xóa toàn bộ giỏ hàng.');
                this.discount = 0; // Reset discount nếu có
                this.couponCode = ''; // Reset mã coupon
            } catch (error) {
                 this.$toast.error(error.response?.data?.message || 'Lỗi khi xóa giỏ hàng.');
            }
        }
     },

    // Xử lý áp dụng mã giảm giá
    applyCoupon() {
        // Đây là nơi bạn sẽ gọi API để kiểm tra và áp dụng mã coupon
        // Ví dụ:
        if (this.couponCode.toLowerCase() === 'OCOPDEAL') {
            this.discount = Math.min(this.cartTotal * 0.1, 50000); // Giảm 10%, tối đa 50k
            this.$toast.success('Đã áp dụng mã giảm giá!');
        } else {
            this.$toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
            this.couponCode = '';
        }
    },
    removeCoupon() {
        this.couponCode = '';
        this.discount = 0;
        this.$toast.info('Đã xóa mã giảm giá.');
    },

    // Xử lý khi nhấn nút Thanh toán
    checkout() {
      if (!this.processedCartItems || this.processedCartItems.length === 0) {
        this.$toast.error('Giỏ hàng của bạn đang trống để thanh toán.');
        return;
      }
      if (this.isUpdating) {
        this.$toast.info('Vui lòng chờ cập nhật giỏ hàng hoàn tất.');
        return;
      }

      if (!this.isLoggedIn) {
        this.$toast.info('Vui lòng đăng nhập để tiếp tục thanh toán.');
        this.$router.push({ name: 'Login', query: { redirect: '/checkout' } }); // Giả sử có route tên 'Login' và '/checkout'
      } else {
        this.$router.push('/checkout'); // Hoặc { name: 'CheckoutPage' }
      }
    }
  },
  created() {
     // Gọi action để tải/khởi tạo giỏ hàng khi component được tạo
     // Sử dụng .finally để đảm bảo initialLoadDone được set ngay cả khi có lỗi
     this.initializeCartAction().finally(() => {
         this.initialLoadDone = true;
     });
  }
};
</script>

<style scoped>
input[type="number"].no-spinners::-webkit-inner-spin-button,
input[type="number"].no-spinners::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"].no-spinners {
  appearance: textfield;
  -moz-appearance: textfield;
}

.input-group-sm .form-control {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
}
.input-group-sm .btn {
    padding: 0.25rem 0.5rem;
}
.product-name-link {
   display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--bs-body-color);
  text-decoration: none;
}
.product-name-link:hover {
    color: var(--bs-success);
}

@media (min-width: 992px) {
  .sticky-top {
    top: 80px;
  }
}
</style>