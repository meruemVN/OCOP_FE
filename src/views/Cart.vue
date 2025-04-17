<template>
  <div class="cart container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
      <i class="fas fa-shopping-cart me-2"></i>Giỏ hàng của bạn
    </h1>

    <!-- Trường hợp giỏ hàng trống -->
    <div v-if="!cartItems || cartItems.length === 0" class="card shadow-sm border-light p-5 text-center mx-auto" style="max-width: 550px;">
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

    <!-- Trường hợp có sản phẩm -->
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
            <li v-for="item in cartItems" :key="item.product._id" class="list-group-item px-3 px-md-4 py-3">
              <div class="row align-items-center gy-3">
                <!-- Product Info -->
                <div class="col-md-5">
                  <div class="d-flex align-items-center">
                    <router-link :to="`/product/${item.product._id}`" class="flex-shrink-0">
                      <img
                        :src="(item.product.images && item.product.images.length > 0 ? item.product.images[0] : '') || '/default.jpg'"
                        :alt="item.product.name"
                        class="rounded border"
                        style="width: 60px; height: 60px; object-fit: cover;"
                      />
                    </router-link>
                    <div class="ms-3 flex-grow-1">
                      <router-link :to="`/product/${item.product._id}`" class="text-decoration-none text-dark fw-medium stretched-link">
                        {{ item.product.name }}
                      </router-link>
                       <!-- Có thể thêm mô tả ngắn hoặc thuộc tính ở đây nếu cần -->
                       <!-- <small class="d-block text-muted">Size: M, Color: Red</small> -->
                    </div>
                  </div>
                </div>
                <!-- Price -->
                <div class="col-6 col-md-2 text-md-center">
                   <span class="d-md-none text-muted small">Đơn giá: </span>
                   <span class="fw-medium">{{ formatPrice(item.price || item.product.price) }}</span>
                </div>
                <!-- Quantity -->
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
                      @change="updateQuantity(item.product._id, parseInt($event.target.value) || 1)"
                      type="number"
                       min="1"
                      :max="item.product.countInStock"
                      class="form-control text-center px-1"
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
                   <!-- Nút xóa trên mobile có thể đặt ở đây -->
                   <button
                     @click="removeItem(item.product._id)"
                     class="btn btn-sm btn-link text-danger ms-2 d-md-none p-1"
                     :disabled="isLoadingUpdate(item.product._id)"
                   >
                      <i class="fas fa-trash fs-5"></i>
                   </button>
                </div>
                <!-- Subtotal & Remove -->
                <div class="col-12 col-md-2 text-end">
                  <span class="fw-bold text-dark">{{ formatPrice((item.price || item.product.price) * item.quantity) }}</span>
                   <!-- Nút xóa trên desktop -->
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
               <!-- Loading indicator cho item đang cập nhật -->
               <div v-if="isLoadingUpdate(item.product._id)" class="text-center text-muted small mt-2">
                   <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                   <span class="ms-1">Đang cập nhật...</span>
               </div>
            </li>
            <!-- End Cart Item -->
          </ul>
           <div class="card-footer bg-light text-end px-4 py-3">
              <button @click="clearCart" class="btn btn-sm btn-outline-danger">
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

            <!-- Mã giảm giá -->
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
                  Đã áp dụng mã giảm giá!
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
// Import icons nếu cần
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShoppingCart, faShoppingBasket, faArrowLeft, faMinus, faPlus, faTrash, faCreditCard, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingCart, faShoppingBasket, faArrowLeft, faMinus, faPlus, faTrash, faCreditCard, faTimesCircle);


export default {
  name: 'CartView',
  data() {
    return {
      couponCode: '',
      discount: 0,
      updatingItemId: null, // Lưu productId đang được cập nhật số lượng
      // shippingFee tính toán dựa trên cartTotal
    };
  },
  computed: {
    ...mapGetters({
      cart: 'cart/theCart', // Lấy cả object cart để truy cập items và totalPrice
      cartLoading: 'cart/isLoading', // Lấy trạng thái loading của cart module
      isLoggedIn: 'auth/isLoggedIn'
    }),
    cartItems() {
      // Luôn trả về mảng rỗng nếu cart null hoặc không có items
      return this.cart?.items || [];
    },
    cartTotalPrice() {
      return this.cart?.totalPrice || 0;
    },
    cartTotal() {
      return Number(this.cartTotalPrice); // Đảm bảo là số
    },
    // Tính phí ship động dựa trên cartTotal
    shippingFee() {
        // Ví dụ: Miễn phí ship cho đơn > 500k, còn lại 30k
        if (this.cartTotal === 0) return 0;
        return this.cartTotal > 500000 ? 0 : 30000;
    },
    orderTotal() {
      // Tính tổng cuối cùng (có thể âm nếu giảm giá lớn?) -> cần kiểm tra
       const total = this.cartTotal + this.shippingFee - this.discount;
       return total > 0 ? total : 0;
    },
    // Kiểm tra xem có item nào đang được cập nhật không
    isUpdating() {
        return !!this.updatingItemId;
    }
  },
  created() {
    // Không cần gọi getCart ở đây nếu App.vue đã gọi khi login/load
    // this.getCart();
  },
  methods: {
    ...mapActions({
      // Không cần getCart ở đây nữa
      updateCartItemAction: 'cart/updateCartItem', // Đổi tên để tránh trùng lặp
      removeFromCartAction: 'cart/removeFromCart', // Đổi tên
      clearCartAction: 'cart/clearCart' // Đổi tên
    }),
    // Helper kiểm tra loading cho từng item
    isLoadingUpdate(productId) {
        return this.updatingItemId === productId;
    },
    formatPrice(price) {
       if (price === undefined || price === null) return 'N/A';
       return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    async updateQuantity(productId, quantity) {
      // Đảm bảo số lượng hợp lệ
      const currentItem = this.cartItems.find(item => item.product._id === productId);
      if (!currentItem) return;
      const maxQuantity = currentItem.product.countInStock;
      quantity = Math.max(1, Math.min(quantity, maxQuantity)); // Giới hạn min 1 và max tồn kho

      if (quantity === currentItem.quantity) return; // Không làm gì nếu số lượng không đổi

      this.updatingItemId = productId; // Bắt đầu loading cho item này
      try {
        await this.updateCartItemAction({ productId, quantity });
         // Thành công, không cần làm gì thêm vì state sẽ tự cập nhật
      } catch (error) {
        console.error('Update quantity error:', error);
        this.$toast.error(error.response?.data?.message || 'Lỗi cập nhật số lượng.');
      } finally {
        this.updatingItemId = null; // Kết thúc loading
      }
    },
    async removeItem(productId) {
       if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
           this.updatingItemId = productId; // Có thể dùng loading state này
           try {
             await this.removeFromCartAction(productId);
             this.$toast.success('Đã xóa sản phẩm khỏi giỏ hàng.');
           } catch (error) {
             console.error('Remove item error:', error);
             this.$toast.error(error.response?.data?.message || 'Lỗi xóa sản phẩm.');
           } finally {
               this.updatingItemId = null;
           }
       }
    },
     async clearCart() {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
            try {
                await this.clearCartAction();
                this.$toast.success('Đã xóa toàn bộ giỏ hàng.');
                 this.discount = 0; // Reset discount
                 this.couponCode = ''; // Reset coupon code
            } catch (error) {
                 console.error('Clear cart error:', error);
                 this.$toast.error(error.response?.data?.message || 'Lỗi xóa giỏ hàng.');
            }
        }
     },
    applyCoupon() {
      if (!this.couponCode) {
        this.$toast.error('Vui lòng nhập mã giảm giá');
        return;
      }
      // Logic kiểm tra coupon (có thể gọi API hoặc dùng danh sách cố định)
      const coupons = {
        'OCOP10': { type: 'percent', value: 10 }, // Giảm 10%
        'KHAO30K': { type: 'fixed', value: 30000 }, // Giảm 30k
        'FREESHIP500': { type: 'shipping', condition: this.cartTotal > 500000 } // Miễn ship nếu đơn > 500k
      };
      const coupon = coupons[this.couponCode.toUpperCase()];

      if (coupon) {
         if (coupon.type === 'percent') {
           this.discount = (this.cartTotal * coupon.value) / 100;
           this.$toast.success(`Đã áp dụng mã giảm ${coupon.value}%`);
         } else if (coupon.type === 'fixed') {
           this.discount = coupon.value;
            this.$toast.success(`Đã áp dụng mã giảm ${this.formatPrice(coupon.value)}`);
         } else if (coupon.type === 'shipping') {
             if (coupon.condition !== undefined && !coupon.condition) {
                  this.$toast.error(`Mã này chỉ áp dụng cho đơn hàng trên ${this.formatPrice(500000)}`); // Ví dụ
                  return;
             }
             // Giảm giá bằng phí ship hiện tại
             if (this.shippingFee > 0) {
                 this.discount = this.shippingFee;
                 this.$toast.success('Đã áp dụng mã miễn phí vận chuyển');
             } else {
                  this.$toast.info('Đơn hàng của bạn đã được miễn phí vận chuyển.');
                  this.couponCode = ''; // Reset vì không cần mã nữa
             }
         }
      } else {
        this.$toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
         this.discount = 0; // Reset discount nếu mã sai
         this.couponCode = '';
      }
    },
    checkout() {
      if (this.cartItems.length === 0) {
        this.$toast.error('Giỏ hàng của bạn đang trống');
        return;
      }
       if (this.isUpdating) {
          this.$toast.info('Vui lòng chờ cập nhật giỏ hàng hoàn tất.');
          return;
       }
      if (!this.isLoggedIn) {
        this.$router.push({ name: 'Login', query: { redirect: '/checkout' } });
      } else {
        // Có thể truyền thông tin discount/coupon qua state hoặc query nếu trang checkout cần
        this.$router.push('/checkout');
      }
    }
  }
};
</script>

<style scoped>
/* Giữ lại CSS cho input number nếu cần */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield; /* Firefox */
  -moz-appearance: textfield; /* Firefox */
}

/* Đảm bảo nút input group nhỏ hơn */
.input-group-sm .form-control {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
}
.input-group-sm .btn {
    padding: 0.25rem 0.5rem;
}

/* Sticky sidebar */
@media (min-width: 992px) { /* lg breakpoint */
  .sticky-top {
    top: 80px; /* Điều chỉnh khoảng cách từ top nếu Navbar của bạn có chiều cao khác */
  }
}
</style>