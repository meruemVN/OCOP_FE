<template>
  <div class="cart container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
      <i class="fas fa-shopping-cart me-2"></i>Giỏ hàng của bạn
    </h1>

    <!-- TRẠNG THÁI LOADING CHUNG -->
    <div v-if="cartLoading && !initialLoadDone" class="text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Đang tải giỏ hàng...</span>
      </div>
       <p class="mt-2 text-muted">Đang tải giỏ hàng...</p>
    </div>

    <!-- TRƯỜNG HỢP GIỎ HÀNG TRỐNG (Kiểm tra sau khi loading xong) -->
    <div v-else-if="!cartItems || cartItems.length === 0" class="card shadow-sm border-light p-5 text-center mx-auto" style="max-width: 550px;">
      <div class="mb-4">
         <i class="fas fa-shopping-basket text-light display-1"></i>
      </div>
      <p class="text-muted mb-4 fs-5">Giỏ hàng của bạn hiện đang trống.</p>
      <router-link
        to="/products"
        class="btn btn-success btn-lg px-4 rounded-pill shadow-sm"
      >
        <i class="fas fa-arrow-left me-2"></i>
        Tiếp tục mua sắm
      </router-link>
    </div>

    <!-- TRƯỜNG HỢP CÓ SẢN PHẨM (Hiển thị sau khi loading xong) -->
    <div v-else class="row g-4">
      <!-- Danh sách sản phẩm -->
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
            <!-- Cart Item -->
            <li v-for="(item, index) in cartItems" :key="item.product?._id || `item-${index}`" class="list-group-item px-3 px-md-4 py-3">
              <div v-if="item.product" class="row align-items-center gy-3">
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
                <div class="col-6 col-md-2 text-md-center">
                   <span class="d-md-none text-muted small">Đơn giá: </span>
                   <span class="fw-medium">{{ formatPrice(item.price !== undefined ? item.price : item.product.price) }}</span>
                </div>
                <div class="col-6 col-md-3 d-flex justify-content-end justify-content-md-center align-items-center">
                  <div class="input-group input-group-sm" style="max-width: 120px;">
                    <button
                      class="btn btn-outline-secondary px-2"
                      type="button"
                      @click="updateQuantity(item.product._id, item.quantity - 1)"
                      :disabled="item.quantity <= 1 || isLoadingUpdate(item.product._id)"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input
                      :value="item.quantity"
                      @input="handleQuantityInput(item.product._id, $event.target.value, item.product.countInStock)"
                      type="number"
                       min="1"
                      :max="item.product.countInStock"
                      class="form-control text-center px-1 no-spinners"
                      :disabled="isLoadingUpdate(item.product._id)"
                       aria-label="Số lượng"
                    >
                    <button
                      class="btn btn-outline-secondary px-2"
                      type="button"
                       @click="updateQuantity(item.product._id, item.quantity + 1)"
                       :disabled="item.quantity >= item.product.countInStock || isLoadingUpdate(item.product._id)"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                   <button
                     @click="removeItem(item.product._id)"
                     class="btn btn-sm btn-link text-danger ms-2 d-md-none p-1"
                     :disabled="isLoadingUpdate(item.product._id)"
                   >
                      <i class="fas fa-trash fs-5"></i>
                   </button>
                </div>
                <div class="col-12 col-md-2 text-end">
                  <span class="fw-bold text-dark">{{ formatPrice((item.price !== undefined ? item.price : item.product.price) * item.quantity) }}</span>
                  <button
                    @click="removeItem(item.product._id)"
                    class="btn btn-sm btn-link text-danger ms-2 d-none d-md-inline-block p-0"
                    :disabled="isLoadingUpdate(item.product._id)"
                    title="Xóa sản phẩm"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
               <div v-if="isLoadingUpdate(item.product._id)" class="text-center text-muted small mt-2">
                   <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                   <span class="ms-1">Đang cập nhật...</span>
               </div>
               <div v-else-if="!item.product" class="text-center text-danger small mt-2">
                   <i class="fas fa-exclamation-triangle me-1"></i> Sản phẩm này không còn tồn tại hoặc đã bị lỗi.
                   <button @click="removeItem(item.productId || `error-${index}`)" class="btn btn-sm btn-link text-danger p-0 ms-1">(Xóa)</button> {/* Cung cấp fallback key/ID */}
               </div>
            </li>
          </ul>
           <div class="card-footer bg-light text-end px-4 py-3">
              <button @click="clearCart" class="btn btn-sm btn-outline-danger" :disabled="isUpdating || cartItems.length === 0">
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
                <span>Giảm giá (Coupon)</span>
                <span>- {{ formatPrice(discount) }}</span>
              </div>
            </div>

            <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Tổng cộng</span>
              <span class="text-success">{{ formatPrice(orderTotal) }}</span>
            </div>
            <div class="mb-4">
              <label for="couponCode" class="form-label small text-muted">Mã giảm giá (nếu có)</label>
              <div class="input-group">
                <input
                  id="couponCode"
                  v-model.trim="couponCode"
                  type="text"
                  class="form-control"
                  placeholder="Nhập mã giảm giá"
                  :disabled="discount > 0"
                >
                <button
                  @click="applyCoupon"
                  class="btn btn-outline-secondary"
                  type="button"
                  :disabled="!couponCode || discount > 0"
                >
                  Áp dụng
                </button>
              </div>
               <div v-if="discount > 0" class="text-success small mt-1">
                  Đã áp dụng mã giảm giá! <button @click="removeCoupon" class="btn btn-sm btn-link text-danger p-0 ms-1">(Xóa)</button>
               </div>
            </div>

            <div class="d-grid">
              <button
                @click="checkout"
                class="btn btn-success btn-lg rounded-pill shadow-sm"
                :disabled="cartItems.length === 0 || isUpdating"
              >
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
import { faShoppingCart, faShoppingBasket, faArrowLeft, faMinus, faPlus, faTrash, faCreditCard, faTimesCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingCart, faShoppingBasket, faArrowLeft, faMinus, faPlus, faTrash, faCreditCard, faTimesCircle, faExclamationTriangle);


export default {
  name: 'CartView',
  data() {
    return {
      couponCode: '',
      discount: 0,
      updatingItemId: null,
      quantityInputTimeout: null,
      initialLoadDone: false, // << Thêm cờ để biết đã load lần đầu chưa
      placeholderImg: '/images/placeholder.png', // << Lưu placeholder vào data
    };
  },
  computed: {
    ...mapGetters({
      cart: 'cart/theCart',
      cartLoading: 'cart/isLoading',
      isLoggedIn: 'auth/isLoggedIn'
    }),
    cartItems() {
      // Chỉ trả về mảng khi cart đã load xong và không null
      return (this.initialLoadDone && this.cart?.items) ? this.cart.items : [];
    },
    cartTotalPrice() {
      return this.cart?.totalPrice || 0;
    },
    cartTotal() {
      return Number(this.cartTotalPrice);
    },
    shippingFee() {
      if (this.cartTotal === 0) return 0;
      const potentialFee = this.calculatePotentialShippingFee();
      // Nếu có discount bằng đúng phí ship thì coi như free ship
      return this.discount === potentialFee ? 0 : potentialFee;
    },
     orderTotal() {
       const total = this.cartTotal + this.shippingFee - this.discount;
       return Math.max(0, total);
    },
    isUpdating() {
      return !!this.updatingItemId;
    }
  },
   watch: {
     // Theo dõi cartLoading để set cờ initialLoadDone
     cartLoading(newValue, oldValue) {
       if (oldValue === true && newValue === false) {
          this.initialLoadDone = true;
       }
     }
   },
  methods: {
    ...mapActions({
      // Action để khởi tạo giỏ hàng (quan trọng)
      initializeCartAction: 'cart/initializeCart',
      updateCartItemAction: 'cart/updateCartItem',
      removeFromCartAction: 'cart/removeFromCart',
      clearCartAction: 'cart/clearCart'
    }),
     calculatePotentialShippingFee() {
        return this.cartTotal > 500000 ? 0 : 30000;
     },
    isLoadingUpdate(productId) {
      return this.updatingItemId === productId;
    },
    formatPrice(price) {
       if (price === undefined || price === null) return 'N/A';
       return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    getProductImage(product) {
        return product?.images?.[0] || this.placeholderImg;
    },
    onImageError(event) {
       event.target.src = this.placeholderImg;
    },
     handleQuantityInput(productId, value, maxStock) {
       clearTimeout(this.quantityInputTimeout);
       this.quantityInputTimeout = setTimeout(() => {
           let newQuantity = parseInt(value) || 1;
           newQuantity = Math.max(1, Math.min(newQuantity, maxStock));
           // Chỉ gọi update nếu giá trị thực sự thay đổi so với state hiện tại
           const currentItem = this.cartItems.find(item => item.product?._id === productId);
           if (currentItem && newQuantity !== currentItem.quantity) {
              this.updateQuantity(productId, newQuantity);
           } else if (currentItem) {
              // Nếu user nhập lại giá trị cũ, cập nhật lại input để đồng bộ
              event.target.value = currentItem.quantity;
           }
       }, 700);
     },
    async updateQuantity(productId, quantity) {
        const currentItem = this.cartItems.find(item => item.product?._id === productId);
        if (!currentItem || quantity === currentItem.quantity || this.isLoadingUpdate(productId)) return;

        const maxQuantity = currentItem.product.countInStock;
        // Đảm bảo quantity cuối cùng là hợp lệ trước khi gửi đi
        const validQuantity = Math.max(1, Math.min(quantity, maxQuantity));

        this.updatingItemId = productId;
        try {
            await this.updateCartItemAction({ productId, quantity: validQuantity });
             // Xóa timeout nếu có để tránh gọi lại update
             clearTimeout(this.quantityInputTimeout);
        } catch (error) {
            console.error('Update quantity error:', error);
            this.$toast.error(error.response?.data?.message || 'Lỗi cập nhật số lượng.');
            // Reset input về giá trị cũ nếu lỗi?
            const inputElement = this.$el.querySelector(`input[aria-label="Số lượng"][data-product-id="${productId}"]`); // Cần thêm data-product-id vào input
            if (inputElement) inputElement.value = currentItem.quantity;
        } finally {
            this.updatingItemId = null;
        }
    },
    async removeItem(productIdToRemove) {
        const itemKey = productIdToRemove || `error-${Date.now()}`; // Tạo key tạm nếu ID lỗi
        if (this.isLoadingUpdate(itemKey)) return;

        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            this.updatingItemId = itemKey;
            try {
                // Lấy ID sản phẩm thực tế từ item trong state (quan trọng nếu item.product là null)
                const item = this.cartItems.find(i => (i.product?._id || i.productId) === productIdToRemove);
                const actualProductId = item?.product?._id || item?.productId; // Lấy ID thực tế

                if (actualProductId) {
                    await this.removeFromCartAction(actualProductId);
                    this.$toast.success('Đã xóa sản phẩm khỏi giỏ hàng.');
                } else {
                    // Xử lý trường hợp item lỗi không có ID hợp lệ
                    // Có thể cần commit mutation xóa tạm thời khỏi state
                     console.warn("Could not find valid product ID for removal:", productIdToRemove);
                     // Ví dụ: this.$store.commit('cart/REMOVE_ITEM_LOCALLY_BY_KEY', itemKey);
                     this.$toast.info('Đã xóa sản phẩm lỗi.');
                }
            } catch (error) {
                console.error('Remove item error:', error);
                this.$toast.error(error.response?.data?.message || 'Lỗi xóa sản phẩm.');
            } finally {
                this.updatingItemId = null;
            }
        }
    },
     async clearCart() {
        if (this.cartItems.length === 0) return; // Không làm gì nếu giỏ hàng đã trống
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            try {
                await this.clearCartAction();
                this.$toast.success('Đã xóa toàn bộ giỏ hàng.');
                 this.discount = 0;
                 this.couponCode = '';
            } catch (error) {
                 console.error('Clear cart error:', error);
                 this.$toast.error(error.response?.data?.message || 'Lỗi xóa giỏ hàng.');
            }
        }
     },
    applyCoupon() { /* ... giữ nguyên ... */ },
    removeCoupon() { /* ... giữ nguyên ... */ },
    checkout() {
      // >> Log ngay khi hàm được gọi <<
      console.log('[CartView] checkout() method called.');

      // Kiểm tra các điều kiện chặn
      if (this.cartItems.length === 0) {
        console.log('[CartView] Checkout blocked: Cart is empty.');
        this.$toast.error('Giỏ hàng của bạn đang trống');
        return;
      }
      if (this.isUpdating) {
        console.log('[CartView] Checkout blocked: Cart is updating.');
        this.$toast.info('Vui lòng chờ cập nhật giỏ hàng hoàn tất.');
        return;
      }

      // Kiểm tra đăng nhập và điều hướng
      console.log('[CartView] Checking isLoggedIn:', this.isLoggedIn);
      if (!this.isLoggedIn) {
        console.log('[CartView] Redirecting to Login for checkout.');
        this.$router.push({ name: 'Login', query: { redirect: '/checkout' } });
      } else {
        console.log('[CartView] Proceeding to checkout page...');
        try {
            this.$router.push('/checkout'); // Hoặc { name: 'Checkout' } nếu đã đặt tên
            console.log('[CartView] $router.push("/checkout") executed.');
        } catch(routerError) {
            // Bắt lỗi nếu $router.push có vấn đề (hiếm gặp)
            console.error('[CartView] Error during $router.push:', routerError);
            this.$toast.error('Không thể điều hướng đến trang thanh toán.');
        }
      }
    }
  },
  // Sử dụng created thay vì mounted để gọi initializeCart sớm hơn
  created() {
     console.log("CartView created. Initializing cart...");
     this.initializeCartAction().then(() => {
         this.initialLoadDone = true; // Đánh dấu đã load xong lần đầu
         console.log("Cart initialized.");
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